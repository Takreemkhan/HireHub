const { MongoClient } = require("mongodb");

async function cleanup() {
    const uri = "mongodb+srv://TakreemKhan:takreem1234@cluster0.qr0re1p.mongodb.net/freelancehub";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("freelancehub");

        const accounts = db.collection("accounts");

        const cursor = accounts.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $match: {
                    user: { $size: 0 }
                }
            }
        ]);

        let count = 0;

        for await (const doc of cursor) {
            await accounts.deleteOne({ _id: doc._id });
            count++;
        }

        console.log(`✅ Deleted ${count} orphan accounts`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

cleanup();