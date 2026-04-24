import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* GET BID INSIGHTS */
export const getBidInsights = async (freelancerId, filters = {}) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  
  const query = {
    freelancerId: new ObjectId(freelancerId),
    isActive: true
  };

 
  if (filters.status) {
    query.status = filters.status;
  }


  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  
  const proposals = await db.collection(COLLECTIONS.PROPOSALS)
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  
  const bidInsights = await Promise.all(
    proposals.map(async (proposal) => {
     
      const job = await db.collection(COLLECTIONS.JOBS).findOne({
        _id: new ObjectId(proposal.jobId)
      });

      if (!job) {
        return null; 
      }


      const totalBids = await db.collection(COLLECTIONS.PROPOSALS).countDocuments({
        jobId: new ObjectId(proposal.jobId),
        isActive: true
      });

  
      const allBids = await db.collection(COLLECTIONS.PROPOSALS)
        .find({
          jobId: new ObjectId(proposal.jobId),
          isActive: true
        })
        .sort({ bidAmount: 1 }) 
        .toArray();


      const bidRank = allBids.findIndex(
        bid => bid._id.toString() === proposal._id.toString()
      ) + 1;

      
      let winningBid = null;
      const acceptedProposal = allBids.find(bid => bid.status === "accepted");
      
      if (acceptedProposal) {
        winningBid = {
          amount: acceptedProposal.bidAmount,
          currency: acceptedProposal.currency,
          isAccepted: true
        };
      } else if (allBids.length > 0) {
        
        winningBid = {
          amount: allBids[0].bidAmount,
          currency: allBids[0].currency,
          isAccepted: false
        };
      }

      let timeLeft = null;
      if (job.deadline) {
        const now = new Date();
        const deadline = new Date(job.deadline);
        const diffMs = deadline - now;
        
        if (diffMs > 0) {
          const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          
          timeLeft = {
            days,
            hours,
            minutes,
            seconds,
            totalSeconds: Math.floor(diffMs / 1000),
            formatted: days > 0 
              ? `${days} days, ${hours} hours`
              : hours > 0
              ? `${hours} hours, ${minutes} minutes`
              : `${minutes} minutes, ${seconds} seconds`
          };
        } else {
          timeLeft = {
            expired: true,
            formatted: "Expired"
          };
        }
      }

  
      const clientUser = await db.collection(COLLECTIONS.USERS).findOne({
        _id: new ObjectId(job.clientId)
      });

    
      const avgBid = allBids.reduce((sum, bid) => sum + bid.bidAmount, 0) / allBids.length;
      const isCompetitive = proposal.bidAmount <= avgBid;

      
      let actionTaken = null;
      if (proposal.status === "shortlisted") {
        actionTaken = "shortlisted";
      } else if (proposal.status === "accepted") {
        actionTaken = "hired";
      } else if (proposal.status === "rejected") {
        actionTaken = "rejected";
      }

      return {
        proposalId: proposal._id,
        
    
        project: {
          id: job._id,
          title: job.title,
          category: job.category,
          subCategory: job.subCategory,
          description: job.description,
          budget: job.budget,
          status: job.status
        },


        timeToBid: timeLeft,
        submittedAt: proposal.createdAt,
        
      
        bidRank: {
          current: bidRank,
          total: totalBids,
          formatted: `#${bidRank} of ${totalBids}`,
          percentage: Math.round((bidRank / totalBids) * 100)
        },

     
        winningBid: winningBid,

    
        yourBid: {
          amount: proposal.bidAmount,
          deposit: proposal.depositRequired,
          total: proposal.bidAmount + proposal.depositRequired,
          currency: proposal.currency,
          isLowest: bidRank === 1,
          isCompetitive: isCompetitive,
          differenceFromLowest: winningBid 
            ? proposal.bidAmount - winningBid.amount 
            : 0
        },

      
        status: proposal.status,
        actionTaken: actionTaken,
        isShortlisted: proposal.status === "shortlisted",
        isAccepted: proposal.status === "accepted",
        isRejected: proposal.status === "rejected",

   
        clientInformation: {
          id: clientUser?._id,
          name: clientUser?.name,
          email: clientUser?.email,
          country: job.location || "Not specified",
          rating: clientUser?.rating || 0,
          totalJobsPosted: clientUser?.totalJobsPosted || 0
        },

        chatInitiated: proposal.chatInitiated || false,
        unreadMessages: proposal.unreadMessages || 0,

       
        proposalText: proposal.proposalText,
        coverLetter: proposal.coverLetter,
        estimatedDuration: proposal.estimatedDuration,
        attachments: proposal.attachments
      };
    })
  );


  const validInsights = bidInsights.filter(insight => insight !== null);

  const total = await db.collection(COLLECTIONS.PROPOSALS).countDocuments(query);
  
  const stats = await db.collection(COLLECTIONS.PROPOSALS).aggregate([
    { $match: query },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalBidAmount: { $sum: "$bidAmount" }
      }
    }
  ]).toArray();

  const summary = {
    total: total,
    pending: stats.find(s => s._id === "pending")?.count || 0,
    shortlisted: stats.find(s => s._id === "shortlisted")?.count || 0,
    accepted: stats.find(s => s._id === "accepted")?.count || 0,
    rejected: stats.find(s => s._id === "rejected")?.count || 0,
    totalBidValue: stats.reduce((sum, s) => sum + s.totalBidAmount, 0),
    averageBid: total > 0 
      ? stats.reduce((sum, s) => sum + s.totalBidAmount, 0) / total 
      : 0
  };

  return {
    bidInsights: validInsights,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    summary
  };
};

/* GET BID INSIGHTS SUMMARY */
export const getBidInsightsSummary = async (freelancerId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const query = {
    freelancerId: new ObjectId(freelancerId),
    isActive: true
  };


  const statusCounts = await db.collection(COLLECTIONS.PROPOSALS).aggregate([
    { $match: query },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$bidAmount" }
      }
    }
  ]).toArray();

  // Get active bids (pending + shortlisted)
  const activeBids = await db.collection(COLLECTIONS.PROPOSALS).countDocuments({
    freelancerId: new ObjectId(freelancerId),
    status: { $in: ["pending", "shortlisted"] },
    isActive: true
  });


  const hired = await db.collection(COLLECTIONS.PROPOSALS).countDocuments({
    freelancerId: new ObjectId(freelancerId),
    status: "accepted"
  });


  const totalBidValue = statusCounts.reduce((sum, s) => sum + s.totalAmount, 0);

 
  const total = statusCounts.reduce((sum, s) => sum + s.count, 0);
  const successRate = total > 0 ? ((hired / total) * 100).toFixed(1) : 0;

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentBids = await db.collection(COLLECTIONS.PROPOSALS).countDocuments({
    freelancerId: new ObjectId(freelancerId),
    createdAt: { $gte: sevenDaysAgo }
  });

  return {
    overview: {
      totalBids: total,
      activeBids: activeBids,
      hired: hired,
      pending: statusCounts.find(s => s._id === "pending")?.count || 0,
      shortlisted: statusCounts.find(s => s._id === "shortlisted")?.count || 0,
      rejected: statusCounts.find(s => s._id === "rejected")?.count || 0,
      successRate: `${successRate}%`,
      totalBidValue: totalBidValue,
      recentBids: recentBids
    },
    breakdown: statusCounts.map(s => ({
      status: s._id,
      count: s.count,
      totalAmount: s.totalAmount
    }))
  };
};

/* GET COMPETITIVE ANALYSIS - Compare with other bidders */
export const getCompetitiveAnalysis = async (proposalId, freelancerId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Get the proposal
  const proposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(proposalId),
    freelancerId: new ObjectId(freelancerId)
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  // Get all proposals for this job
  const allProposals = await db.collection(COLLECTIONS.PROPOSALS)
    .find({
      jobId: new ObjectId(proposal.jobId),
      isActive: true
    })
    .sort({ bidAmount: 1 })
    .toArray();


  const bidAmounts = allProposals.map(p => p.bidAmount);
  const avgBid = bidAmounts.reduce((a, b) => a + b, 0) / bidAmounts.length;
  const minBid = Math.min(...bidAmounts);
  const maxBid = Math.max(...bidAmounts);
  const medianBid = bidAmounts.sort((a, b) => a - b)[Math.floor(bidAmounts.length / 2)];


  const yourRank = allProposals.findIndex(p => p._id.toString() === proposalId) + 1;
  const percentile = ((allProposals.length - yourRank + 1) / allProposals.length) * 100;

  
  const ranges = [
    { label: "Low", min: 0, max: avgBid * 0.8, count: 0 },
    { label: "Average", min: avgBid * 0.8, max: avgBid * 1.2, count: 0 },
    { label: "High", min: avgBid * 1.2, max: Infinity, count: 0 }
  ];

  allProposals.forEach(p => {
    const range = ranges.find(r => p.bidAmount >= r.min && p.bidAmount < r.max);
    if (range) range.count++;
  });

  return {
    yourBid: {
      amount: proposal.bidAmount,
      rank: yourRank,
      percentile: Math.round(percentile),
      status: proposal.bidAmount <= avgBid ? "competitive" : "above_average"
    },
    marketAnalysis: {
      totalBidders: allProposals.length,
      averageBid: Math.round(avgBid),
      lowestBid: minBid,
      highestBid: maxBid,
      medianBid: Math.round(medianBid),
      yourDifferenceFromAvg: proposal.bidAmount - avgBid,
      yourDifferenceFromLowest: proposal.bidAmount - minBid
    },
    distribution: ranges,
    recommendations: {
      shouldAdjust: proposal.bidAmount > avgBid * 1.3,
      suggestedRange: {
        min: Math.round(avgBid * 0.9),
        max: Math.round(avgBid * 1.1)
      },
      competitiveAdvantage: yourRank <= 3 ? "high" : yourRank <= 10 ? "medium" : "low"
    }
  };
};