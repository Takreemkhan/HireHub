import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// ================================================================
// FILE: src/socket/socket.ts  (CLIENT SIDE)
//
// PREVIOUS ISSUES:
//   - No reconnection logic existed
//   - App would freeze if connection failed
//   - "user:join" was emitted BEFORE connecting
//     (race condition — server did not detect user)
//
// WHAT IS FIXED NOW:
//   - Auto reconnection is enabled (will retry 5 times)
//   - Errors are handled gracefully without crashing
//   - "user:join" is only emitted once the connection is confirmed
// ================================================================

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      autoConnect: false,

      // ✅ FIX 1: Added reconnection logic
      reconnection: true,          // retry on disconnect
      reconnectionAttempts: 5,     // max 5 baar try karega
      reconnectionDelay: 1000,     // pehli baar 1 second baad
      reconnectionDelayMax: 5000,  // max 5 second wait (exponential backoff)
      timeout: 10000,              // 10 second mein connect nahi hua toh fail
    });

    // ✅ FIX 2: Event listeners for better visibility
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket?.id);
      if (socket && socket.auth && (socket.auth as any).userId) {
        socket.emit("user:join", (socket.auth as any).userId);
        console.log("👤 Re-joined user session on connect/reconnect:", (socket.auth as any).userId);
      }
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      // If the server disconnected, manually reconnect
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
      console.warn("💡 Real-time chat updates will not be received. Check if the socket server is running on port 3001.");
    });
  }

  return socket;
};

export const connectSocket = (userId: string): void => {
  try {
    const sock = getSocket();
    sock.auth = { userId };

    if (!sock.connected) {
      sock.connect();
    } else {
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