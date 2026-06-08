const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient('mongodb+srv://shivamkrr:G1xO211yJ4lM0o6M@cluster0.qr0re1p.mongodb.net/?retryWrites=true&w=majority');
  await client.connect();
  const db = client.db('hirehub');
  const tx = await db.collection('wallet_transactions').find().sort({createdAt: -1}).limit(5).toArray();
  const jobs = await db.collection('jobs').find({_id: {$in: tx.map(t => t.jobId).filter(Boolean)}}).toArray();
  console.log('Jobs:', JSON.stringify(jobs.map(j => ({_id: j._id, title: j.title, businessPageId: j.businessPageId})), null, 2));
  console.log('Transactions:', JSON.stringify(tx.map(t => ({_id: t._id, jobId: t.jobId, businessPageId: t.businessPageId})), null, 2));
  await client.close();
}
run();
