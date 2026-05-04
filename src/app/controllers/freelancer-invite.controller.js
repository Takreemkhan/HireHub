import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";


/*  FREELANCER INVITE SYSTEM (Private Jobs)    */


/* Convert to ObjectId */
const toObjectId = (id) => {
    if (!id) return null;
    if (typeof id === 'string') return new ObjectId(id);
    return id;
};

/* Email transporter */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

/* SEARCH FREELANCERS  */
export const searchFreelancers = async (searchTerm, limit = 10) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    if (!searchTerm || searchTerm.trim().length === 0) {
        return [];
    }

    const searchRegex = new RegExp(searchTerm, 'i');


    const freelancers = await db.collection(COLLECTIONS.USERS).aggregate([
        {
            $match: {
                role: "freelancer",
                $or: [
                    { name: searchRegex },
                    { email: searchRegex }
                ]
            }
        },
        {
            $lookup: {
                from: COLLECTIONS.PROFILES,
                localField: "_id",
                foreignField: "userId",
                as: "profile"
            }
        },
        {
            $unwind: {
                path: "$profile",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                email: 1,
                image: {
                    $ifNull: ["$image", "$profile.profileImage", null]
                },
                title: "$profile.title",
                rating: "$profile.rating",
                location: "$profile.location",
                completedJobs: "$profile.completedJobs"
            }
        },
        {
            $limit: limit
        }
    ]).toArray();

    return freelancers;
};

/* INVITE FREELANCERS TO PRIVATE JOB */
export const inviteFreelancers = async (jobId, clientId, invites) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const jobObjId = toObjectId(jobId);

    console.log("Searching for job with:", {
        jobId: jobId,
        jobObjId: jobObjId,
        clientId: clientId,
        clientIdType: typeof clientId
    });

    // First, find the job without clientId check to see if it exists
    const jobById = await db.collection(COLLECTIONS.JOBS).findOne({
        _id: jobObjId
    });

    console.log("Job found by ID:", jobById);

    if (!jobById) {
        throw new Error("Job not found");
    }

    console.log("Job clientId:", jobById.clientId, "Type:", typeof jobById.clientId);
    console.log("Provided clientId:", clientId, "Type:", typeof clientId);

    // Compare as strings to avoid type issues
    const jobClientIdStr = jobById.clientId?.toString();
    const providedClientIdStr = clientId?.toString();

    if (jobClientIdStr !== providedClientIdStr) {
        console.log("Client ID mismatch:", {
            jobClientId: jobClientIdStr,
            providedClientId: providedClientIdStr
        });
        throw new Error("unauthorized: This job belongs to a different client");
    }

    if (jobById.jobVisibility !== "private") {
        throw new Error("not a private job");
    }

    const job = jobById; // Use the job we already found

    // Get client info using the clientId from auth
    let clientUser = await db.collection(COLLECTIONS.USERS).findOne({
        $or: [
            { _id: toObjectId(clientId) },
            { _id: clientId },
            { clientId: clientId } // Some collections might store clientId separately
        ]
    });

    if (!clientUser) {
        console.log("Client not found for ID:", clientId);
        // Create a default client name if not found
        clientUser = { name: "A client" };
    }

    const results = [];
    const transporter = createTransporter();

    for (const invite of invites) {
        try {
            let freelancer = null;

            // Check if freelancer exists by freelancerId or email
            if (invite.freelancerId) {
                freelancer = await db.collection(COLLECTIONS.USERS).findOne({
                    _id: toObjectId(invite.freelancerId),
                    role: "freelancer"
                });
            }

            if (!freelancer && invite.email) {
                freelancer = await db.collection(COLLECTIONS.USERS).findOne({
                    email: invite.email.toLowerCase().trim(),
                    role: "freelancer"
                });
            }

            if (!freelancer && !invite.email) {
                throw new Error("Freelancer not found and no email provided");
            }


            const inviteData = {
                jobId: jobObjId,
                clientId: jobById.clientId,
                invitedAt: new Date(),
                status: "pending"
            };

            if (freelancer) {
                // Freelancer exists in system
                inviteData.freelancerId = freelancer._id;
                inviteData.email = freelancer.email;
                inviteData.name = freelancer.name || freelancer.email.split('@')[0];
                inviteData.type = "registered";
            } else {
                // External/new freelancer
                inviteData.email = invite.email.toLowerCase().trim();
                inviteData.name = invite.name || invite.email.split('@')[0];
                inviteData.type = "external";
                inviteData.freelancerId = null;
            }

            // Check if already invited
            const existingInvite = await db.collection(COLLECTIONS.JOB_INVITES).findOne({
                jobId: jobObjId,
                email: inviteData.email
            });

            if (existingInvite) {
                results.push({
                    email: inviteData.email,
                    success: false,
                    message: "Already invited"
                });
                continue;
            }

            // Save invite
            const inviteResult = await db.collection(COLLECTIONS.JOB_INVITES).insertOne(inviteData);

            // Send email
            try {
                await sendInviteEmail(
                    inviteData.email,
                    inviteData.name,
                    clientUser.name || "A client",
                    job,
                    freelancer ? "registered" : "external"
                );
                console.log(`Email sent to ${inviteData.email}`);
            } catch (emailError) {
                console.error("Email sending failed:", emailError);

            }

            results.push({
                email: inviteData.email,
                name: inviteData.name,
                success: true,
                inviteId: inviteResult.insertedId,
                type: inviteData.type
            });

        } catch (error) {
            console.error("Error processing invite:", error);
            results.push({
                email: invite.email || "unknown",
                success: false,
                message: error.message
            });
        }
    }

    return {
        jobId: job._id,
        jobTitle: job.title,
        totalInvites: invites.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
    };
};






/* SEND INVITE EMAIL */
const sendInviteEmail = async (email, name, clientName, job, type) => {
    const transporter = createTransporter();

    const jobUrl = type === "registered"
        ? `${process.env.NEXT_PUBLIC_APP_URL}/jobs/${job._id}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/signup?invite=${job._id}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `You're invited: ${job.title}`,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #ff6b35;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background-color: #fff;
            padding: 30px;
            border: 1px solid #ddd;
          }
          .job-card {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            background-color: #ff6b35;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>FreelanceHub</h1>
            <p>You've been invited to a private job!</p>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            
            <p><strong>${clientName}</strong> has invited you to apply for a private job opportunity:</p>
            
            <div class="job-card">
              <h2>${job.title}</h2>
              <p><strong>Budget:</strong> $${job.budget}</p>
              <p><strong>Category:</strong> ${job.category}</p>
              <p><strong>Duration:</strong> ${job.projectDuration}</p>
              <p><strong>Description:</strong></p>
              <p>${job.description?.substring(0, 200)}...</p>
            </div>
            
            <center>
              <a href="${jobUrl}" class="button">View Job & Apply</a>
            </center>
            
            ${type === "external" ? `
              <p style="color: #666; font-size: 14px; margin-top: 20px;">
                <em>Don't have an account? The link above will help you create one!</em>
              </p>
            ` : ''}
          </div>
          
          <div class="footer">
            <p>&copy; 2026 FreelanceHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
    };

    await transporter.sendMail(mailOptions);
};

/* GET JOB INVITES (for client)*/
export const getJobInvites = async (jobId, clientId) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const jobObjId = toObjectId(jobId);
    const clientObjId = toObjectId(clientId);

    // Verify job belongs to client
    const job = await db.collection(COLLECTIONS.JOBS).findOne({
        _id: jobObjId,
        clientId: clientObjId
    });

    if (!job) {
        throw new Error("Job not found or unauthorized");
    }

    const invites = await db.collection(COLLECTIONS.JOB_INVITES)
        .find({ jobId: jobObjId })
        .sort({ invitedAt: -1 })
        .toArray();

    return {
        jobTitle: job.title,
        totalInvites: invites.length,
        invites: invites.map(inv => ({
            _id: inv._id,
            email: inv.email,
            name: inv.name,
            type: inv.type,
            status: inv.status,
            invitedAt: inv.invitedAt,
            freelancerId: inv.freelancerId
        }))
    };
};

/* VIEW INVITED JOB (for freelancer) */
export const viewInvitedJob = async (jobId, freelancerId) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const jobObjId = toObjectId(jobId);
    const freelancerObjId = toObjectId(freelancerId);

    // Check if invited
    const invite = await db.collection(COLLECTIONS.JOB_INVITES).findOne({
        jobId: jobObjId,
        freelancerId: freelancerObjId,
        status: "pending"
    });

    if (!invite) {
        throw new Error("You don't have access to this job");
    }

    // Get job details
    const job = await db.collection(COLLECTIONS.JOBS).findOne({
        _id: jobObjId
    });

    if (!job) {
        throw new Error("Job not found");
    }

    // Update invite status to viewed
    await db.collection(COLLECTIONS.JOB_INVITES).updateOne(
        { _id: invite._id },
        { $set: { status: "viewed", viewedAt: new Date() } }
    );

    // Get client info
    const clientUser = await db.collection(COLLECTIONS.USERS).findOne({
        _id: toObjectId(job.clientId)
    });

    return {
        job,
        clientInfo: {
            name: clientUser?.name,
            rating: clientUser?.rating
        },
        invitedAt: invite.invitedAt
    };
};