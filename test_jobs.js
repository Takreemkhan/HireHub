const { MongoClient, ObjectId } = require('mongodb');
async function run() {
  const client = new MongoClient('mongodb+srv://TakreemKhan:takreem1234@cluster0.qr0re1p.mongodb.net/freelancehub?retryWrites=true&w=majority&appName=Cluster0');
  await client.connect();
  const db = client.db('freelancehub');
  
  const businessPageId = '6a05c3ebd059f8a6b9118cbf';
  
  // Find the jobs the user likely meant
  const titles = ['Article writing', 'Maketing'];
  
  for (const title of titles) {
     const result = await db.collection('jobs').updateMany(
       { title: title, businessPageId: null },
       { $set: { businessPageId: businessPageId } }
     );
     console.log('Updated ' + result.modifiedCount + ' jobs with title: ' + title);
  }
  
  await client.close();
}
run();
