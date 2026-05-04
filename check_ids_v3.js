const { MongoClient } = require('mongodb');

async function check() {
    const uri = "mongodb+srv://socialreels:IdE9z2cQ4WpC9M8Z@cluster0.3h98c.mongodb.net/hirehub?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('hirehub');
        const chats = await db.collection('CHATS').find({}).sort({ lastMessageAt: -1 }).limit(5).toArray();
        console.log("CHATS Sample:");
        chats.forEach(c => {
            console.log(`Chat ${c._id}: Participants = ${JSON.stringify(c.participants.map(p => ({ val: p, type: typeof p })))}`);
        });
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}
check();
