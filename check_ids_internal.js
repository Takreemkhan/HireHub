const clientPromise = require('./src/lib/mongodb').default;

async function check() {
    try {
        const client = await clientPromise;
        const db = client.db('hirehub');

        console.log("Checking current chats...");
        const chats = await db.collection('CHATS').find({}).sort({ lastMessageAt: -1 }).limit(3).toArray();

        for (const chat of chats) {
            console.log(`--- Chat: ${chat._id} ---`);
            console.log(`Participants: ${JSON.stringify(chat.participants)}`);

            for (const pId of chat.participants) {
                const user = await db.collection('users').findOne({ _id: pId });
                if (user) {
                    console.log(`  User: ${user.name} | ID: ${user._id} | Email: ${user.email}`);
                } else {
                    // Try searching by string ID if pId is a string
                    const userByStr = await db.collection('users').findOne({ _id: pId.toString() });
                    if (userByStr) {
                        console.log(`  User(str): ${userByStr.name} | ID: ${userByStr._id} | Email: ${userByStr.email}`);
                    } else {
                        console.log(`  User NOT FOUND for ID: ${pId} (${typeof pId})`);
                    }
                }
            }
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit();
    }
}

check();
