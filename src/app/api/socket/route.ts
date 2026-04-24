import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Server } from "socket.io";

let io: Server | null = null;

export async function GET() {
  if (!io) {
    console.log("🔌 Initializing Socket Server...");

    // @ts-ignore
    io = new Server(globalThis.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    
    io.on("connection", (socket) => {
      console.log("Socket connected:", socket.id);

      socket.on("join", (userId: string) => {
        socket.join(userId);
        console.log("User joined personal room:", userId);
      });

      socket.on("join_chat", (chatId: string) => {
        socket.join(chatId);
        console.log("Joined chat room:", chatId);
      });

      socket.on("send_message", async (data) => {
        const { chatId, userId, content } = data;
        const db = (await clientPromise).db();

        const message = {
          senderId: userId,
          content,
          createdAt: new Date(),
        };


        await db.collection("chats").updateOne(
          { _id: new ObjectId(chatId) },
          { $push: { messages: message } }
        );

        io?.to(chatId).emit("receive_message", message);
      });

      socket.on("send_request", async (data) => {
        const { fromUserId, toUserId } = data;
        const db = (await clientPromise).db();
        const chatRequests = db.collection("chat_requests");

        const result = await chatRequests.insertOne({
          fromUserId,
          toUserId,
          status: "pending",
          createdAt: new Date(),
        });

        io?.to(toUserId).emit("new_request", {
          _id: result.insertedId.toString(),
          fromUserId,
          toUserId,
        });
      });

      socket.on("disconnect", () => {
        console.log(" Socket disconnected:", socket.id);
      });
    });
  }

  return NextResponse.json({ status: "Socket running" });
}
