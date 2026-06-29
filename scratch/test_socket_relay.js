const { io } = require("socket.io-client");

const SOCKET_URL = "http://localhost:3001";
const CHAT_ID = "test-chat-123";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRelay() {
  console.log("Connecting Socket A...");
  const socketA = io(SOCKET_URL, { auth: { userId: "user-A" } });
  
  console.log("Connecting Socket B...");
  const socketB = io(SOCKET_URL, { auth: { userId: "user-B" } });

  let messageReceived = false;

  socketB.on("message:received", (data) => {
    console.log("📥 Socket B received message:", data);
    messageReceived = true;
  });

  // Wait for connections
  await new Promise((resolve) => {
    let connectedCount = 0;
    const checkConnect = () => {
      connectedCount++;
      if (connectedCount === 2) resolve();
    };
    socketA.on("connect", () => {
      console.log("✅ Socket A connected");
      checkConnect();
    });
    socketB.on("connect", () => {
      console.log("✅ Socket B connected");
      checkConnect();
    });
  });

  // Join rooms
  console.log("Emitting join:chat for both sockets...");
  socketA.emit("user:join", "user-A");
  socketA.emit("join:chat", { chatId: CHAT_ID, userId: "user-A" });

  socketB.emit("user:join", "user-B");
  socketB.emit("join:chat", { chatId: CHAT_ID, userId: "user-B" });

  // Wait for rooms to be joined on server
  await sleep(500);

  // Send message
  console.log("Emitting message:send from Socket A...");
  const testMsg = {
    senderId: "user-A",
    receiverId: "user-B",
    content: "Hello from test script!",
    messageType: "text",
    timestamp: new Date()
  };
  socketA.emit("message:send", { chatId: CHAT_ID, message: testMsg });

  // Wait for relay
  await sleep(1000);

  if (messageReceived) {
    console.log("🎉 Test SUCCESS! Real-time relay is working correctly.");
  } else {
    console.error("❌ Test FAILED! Socket B did not receive the message.");
  }

  socketA.disconnect();
  socketB.disconnect();
}

testRelay().catch(console.error);
