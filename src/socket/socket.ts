import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// ================================================================
// FILE: src/socket/socket.ts  (CLIENT SIDE)
//
// PEHLE KA PROBLEM:
//   - Reconnection logic bilkul nahi tha
//   - Connection fail ho toh app hang ho jaati thi
//   - "user:join" emit ho jaata tha CONNECT hone SE PEHLE
//     (race condition — server ko user pata nahi chalta)
//
// AB KYA FIXED HAI:
//   - Auto reconnection ON hai (5 baar try karega)
//   - Error aaye toh gracefully handle hoga, crash nahi
//   - "user:join" sirf tab emit hoga jab connection PAKKA ho
// ================================================================

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      autoConnect: false,

      // ✅ FIX 1: Reconnection logic add kiya
      reconnection: true,          // disconnect hone pe dobara try karo
      reconnectionAttempts: 5,     // max 5 baar try karega
      reconnectionDelay: 1000,     // pehli baar 1 second baad
      reconnectionDelayMax: 5000,  // max 5 second wait (exponential backoff)
      timeout: 10000,              // 10 second mein connect nahi hua toh fail
    });

    // ✅ FIX 2: Event listeners — kya ho raha hai pata chalega
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      // Agar server ne disconnect kiya toh manually reconnect karo
      if (reason === "io server disconnect") {
        socket?.connect();
      }
    });

    socket.on("reconnect", (attempt) => {
      console.log(`♻️ Socket reconnected after ${attempt} attempt(s)`);
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Reconnection failed:", error.message);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Socket gave up reconnecting after 5 attempts");
    });

    socket.on("connect_error", (error) => {
      console.warn("⚠️ Socket connection error:", error.message);
      console.warn("💡 Chat real-time updates nahi aayenge. Socket server check karo port 3001 pe.");
    });
  }

  return socket;
};

export const connectSocket = (userId: string): void => {
  try {
    const sock = getSocket();

    if (!sock.connected) {
      sock.connect();

      // ✅ FIX 3: "user:join" sirf CONNECT hone KE BAAD emit karo
      // Pehle yeh emit connect se pehle ho jaata tha — server ko user pata nahi chalta tha
      sock.once("connect", () => {
        sock.emit("user:join", userId);
        console.log("✅ Socket connected + user joined:", userId);
      });

    } else {
      // Already connected hai toh seedha join karo
      sock.emit("user:join", userId);
      console.log("♻️ Socket already connected, user joined:", userId);
    }
  } catch (error) {
    console.error("❌ connectSocket error:", error);
  }
};

export const disconnectSocket = (): void => {
  try {
    if (socket?.connected) {
      socket.disconnect();
      console.log("🔌 Socket disconnected");
    }
  } catch (error) {
    console.error("❌ disconnectSocket error:", error);
  }
};