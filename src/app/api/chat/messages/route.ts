// import { NextResponse } from "next/server";
// import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
// import { ObjectId } from "mongodb";

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const chatId = searchParams.get("chatId");

//   if (!chatId) {
//     return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
//   }

//   try {
//     const db = (await clientPromise).db(DB_NAME);
//     const chats = db.collection(COLLECTIONS.CHATS);

//     const chat = await chats.findOne({ _id: new ObjectId(chatId) });

//     if (!chat) {
//       return NextResponse.json({ error: "Chat not found" }, { status: 404 });
//     }

//     // Add job details for job_share messages
//     const messages = chat.messages || [];
//     const enhancedMessages = await Promise.all(
//       messages.map(async (msg: any) => {
//         // If message is a job share, fetch job details
//         if (msg.messageType === "job_share" && msg.jobId) {
//           const job = await db.collection(COLLECTIONS.JOBS).findOne({
//             _id: new ObjectId(msg.jobId)
//           });

//           return {
//             ...msg,
//             jobDetails: job ? {
//               _id: job._id,
//               title: job.title,
//               category: job.category,
//               budget: job.budget,
//               status: job.status,
//               description: job.description?.substring(0, 150)
//             } : null
//           };
//         }

//         return msg;
//       })
//     );

//     return NextResponse.json({
//       messages: enhancedMessages,
//       participants: (chat.participants || []).map((p: any) => p.toString()),
//       total: enhancedMessages.length
//     });
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const { chatId, message } = await req.json();

//     if (!chatId || !message) {
//       return NextResponse.json({ error: "Invalid data" }, { status: 400 });
//     }

//     const db = (await clientPromise).db(DB_NAME);
//     const chats = db.collection(COLLECTIONS.CHATS);


//     const messageWithId = {
//       _id: new ObjectId(),
//       ...message,
//       messageType: message.messageType || "text",
//       jobId: message.jobId || null,
//       timestamp: new Date(),
//     };

//     const result = await chats.updateOne(
//       { _id: new ObjectId(chatId) },
//       { $push: { messages: messageWithId } }
//     );

//     if (result.matchedCount === 0) {
//       return NextResponse.json({ error: "Chat not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       messageId: messageWithId._id.toString()
//     });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
//   }
// }


















// src/app/api/chat/messages/route.ts
import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ✅ Import notification helper
import { notifyNewMessage } from "@/services/notificationService";

// ✅ Import message content filter
import { filterMessage } from "@/utils/messageFilter";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return NextResponse.json({ error: "Chat ID required" }, { status: 400 });
  }

  try {
    const db = (await clientPromise).db(DB_NAME);
    const chats = db.collection(COLLECTIONS.CHATS);

    const chat = await chats.findOne({ _id: new ObjectId(chatId) });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // ✅ DISPUTE CHECK: Check if any active dispute exists for this chat (handles past disputes)
    const activeDispute = await db.collection(COLLECTIONS.DISPUTES).findOne({
      chatId: new ObjectId(chatId),
      status: { $in: ["open", "in_review"] }
    });

    const isFrozen = !!activeDispute || chat.status === "disputed";

    const messages = chat.messages || [];
    const enhancedMessages = await Promise.all(
      messages.map(async (msg: any) => {
        if (msg.messageType === "job_share" && msg.jobId) {
          const job = await db.collection(COLLECTIONS.JOBS).findOne({
            _id: new ObjectId(msg.jobId)
          });

          return {
            ...msg,
            jobDetails: job ? {
              _id: job._id,
              title: job.title,
              category: job.category,
              budget: job.budget,
              status: job.status,
              description: job.description?.substring(0, 150)
            } : null
          };
        }
        return msg;
      })
    );

    return NextResponse.json({
      messages: enhancedMessages,
      participants: (chat.participants || []).map((p: any) => p.toString()),
      total: enhancedMessages.length,
      isFrozen
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { chatId, message } = await req.json();

    if (!chatId || !message) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // ✅ RESTRICTION CHECK: Email, phone, external links block karo
    const messageContent = message.content || message.text || "";
    const filterResult = filterMessage(messageContent);
    if (filterResult.blocked) {
      return NextResponse.json(
        { error: filterResult.reason, restricted: true },
        { status: 422 }
      );
    }

    const db = (await clientPromise).db(DB_NAME);
    const chats = db.collection(COLLECTIONS.CHATS);

    // ✅ DISPUTE CHECK: Block messages if chat is disputed (checking both chat status and disputes collection)
    const chat = await chats.findOne({ _id: new ObjectId(chatId) });
    const activeDispute = await db.collection("disputes").findOne({
      chatId: new ObjectId(chatId),
      status: { $in: ["open", "in_review"] }
    });

    if (chat?.status === "disputed" || activeDispute) {
      return NextResponse.json(
        { error: "This conversation is frozen due to an active dispute.", frozen: true },
        { status: 403 }
      );
    }

    const messageWithId = {
      _id: new ObjectId(),
      ...message,
      messageType: message.messageType || "text",
      jobId: message.jobId || null,
      timestamp: new Date(),
    };

    const result = await chats.updateOne(
      { _id: new ObjectId(chatId) },
      { $push: { messages: messageWithId } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    // ✅ NOTIFICATION: receiver ko notify karo (fire-and-forget)
    // message.senderId = jo bhej raha hai
    // message.receiverId = jo receive karega (freelancer ya client)
    if (message.senderId && message.receiverId) {
      try {
        // Sender ka naam fetch karo
        const sender = await db.collection(COLLECTIONS.USERS).findOne(
          { _id: new ObjectId(message.senderId) },
          { projection: { name: 1 } }
        );

        const senderName = sender?.name || "Someone";

        // Receiver ko notification bhejo
        await notifyNewMessage({
          recipientId: message.receiverId,   // jo receive karega
          senderId: message.senderId,     // jo bhej raha hai
          senderName: senderName,
          chatId: chatId,
        });
      } catch (notifErr) {
        // Notification fail hone se message send fail nahi hoga
        console.warn("⚠️ Notification failed (non-blocking):", notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      messageId: messageWithId._id.toString()
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { chatId, userId } = await req.json();

    if (!chatId || !userId) {
      return NextResponse.json({ error: "chatId and userId required" }, { status: 400 });
    }

    const db = (await clientPromise).db(DB_NAME);
    const chats = db.collection(COLLECTIONS.CHATS);

    // Add userId to readBy array for all messages not sent by the userId
    // Note: In MongoDB, we use $addToSet to avoid duplicates in the array
    await chats.updateOne(
      { _id: new ObjectId(chatId) },
      { $addToSet: { "messages.$[elem].readBy": userId } },
      {
        arrayFilters: [{ "elem.senderId": { $ne: userId } }]
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json({ error: "Failed to mark as read" }, { status: 500 });
  }
}