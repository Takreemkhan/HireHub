const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient('mongodb+srv://TakreemKhan:takreem1234@cluster0.qr0re1p.mongodb.net/freelancehub?retryWrites=true&w=majority&appName=Cluster0');
  await client.connect();
  const db = client.db('freelancehub');
  const pipeline = [
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    {
        $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'jobInfo'
        }
    },
    {
        $addFields: {
            projectTitle: { $ifNull: [{ $arrayElemAt: ['$jobInfo.title', 0] }, 'N/A'] },
            businessPageId: { $ifNull: [{ $arrayElemAt: ['$jobInfo.businessPageId', 0] }, '$businessPageId', null] }
        }
    },
    { $project: { jobInfo: 0 } }
  ];
  const agg = await db.collection('wallet_transactions').aggregate(pipeline).toArray();
  console.log('Aggregated:', JSON.stringify(agg.map(t => ({_id: t._id, jobId: t.jobId, projectTitle: t.projectTitle, businessPageId: t.businessPageId})), null, 2));
  await client.close();
}
run();
