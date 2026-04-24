import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* ================================================== */
/*              DRAFT JOB MANAGEMENT                  */
/* ================================================== */

/* SAVE JOB AS DRAFT */
export const saveDraftJob = async (data) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const draftData = {
    ...data,
    clientId: new ObjectId(data.clientId),  // ⭐ Convert to ObjectId
    isDraft: true,
    status: "draft",
    proposalCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.JOBS).insertOne(draftData);
  return { ...draftData, _id: result.insertedId };
};

/* GET ALL DRAFTS FOR A CLIENT */
export const getClientDrafts = async (clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  console.log("Getting drafts for clientId:", clientId);  // ⭐ Debug log

  const drafts = await db.collection(COLLECTIONS.JOBS)
    .find({ 
      clientId: new ObjectId(clientId),
      isDraft: true,
      status: "draft"
    })
    .sort({ updatedAt: -1 })
    .toArray();

  console.log("Found drafts:", drafts.length);  // ⭐ Debug log

  return drafts;
};

/* GET SINGLE DRAFT BY ID */
export const getDraftById = async (draftId, clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  console.log("Getting draft:", draftId, "for client:", clientId);  // ⭐ Debug log

  const draft = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(draftId),
    clientId: new ObjectId(clientId),
    isDraft: true
  });

  if (!draft) {
    throw new Error("Draft not found or you don't have permission");
  }

  return draft;
};

/* UPDATE DRAFT */
export const updateDraft = async (draftId, clientId, updateData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Verify draft belongs to client
  const draft = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(draftId),
    clientId: new ObjectId(clientId),
    isDraft: true
  });

  if (!draft) {
    throw new Error("Draft not found or you don't have permission");
  }

  const result = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { 
      _id: new ObjectId(draftId),
      clientId: new ObjectId(clientId)
    },
    { 
      $set: { 
        ...updateData, 
        isDraft: true,
        status: "draft",
        updatedAt: new Date() 
      } 
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* DELETE DRAFT */
export const deleteDraft = async (draftId, clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Verify draft belongs to client
  const draft = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(draftId),
    clientId: new ObjectId(clientId),
    isDraft: true
  });

  if (!draft) {
    throw new Error("Draft not found or you don't have permission");
  }

  const result = await db.collection(COLLECTIONS.JOBS).deleteOne({
    _id: new ObjectId(draftId),
    clientId: new ObjectId(clientId)
  });

  return result.deletedCount > 0;
};

/* PUBLISH DRAFT (Convert draft to active job) */
export const publishDraft = async (draftId, clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Verify draft belongs to client
  const draft = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(draftId),
    clientId: new ObjectId(clientId),
    isDraft: true
  });

  if (!draft) {
    throw new Error("Draft not found or you don't have permission");
  }

  // Validate all required fields are present
  const requiredFields = [
    'category',
    'subCategory', 
    'title',
    'description',
    'budget',
    'freelancerSource',
    'projectDuration'
  ];

  const missingFields = requiredFields.filter(field => !draft[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Convert draft to active job
  const result = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { 
      _id: new ObjectId(draftId),
      clientId: new ObjectId(clientId)
    },
    { 
      $set: { 
        isDraft: false,
        status: "open",
        proposalCount: 0,
        jobVisibility: draft.jobVisibility || "public",
        updatedAt: new Date(),
        publishedAt: new Date()
      } 
    },
    { returnDocument: "after" }
  );

  return result.value;
};




