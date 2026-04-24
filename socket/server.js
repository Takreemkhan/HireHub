const { createServer } = require("http");
const { Server } = require("socket.io");

// ── Message content filter (profile links only — normal links allowed) ──
const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/gi;

// Only PROFILE-specific URL patterns (not all URLs)
const PROFILE_PATTERNS = [
  /linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/gi,
  /upwork\.com\/freelancers\/[a-zA-Z0-9~_\-]+/gi,
  /upwork\.com\/o\/profiles\/[a-zA-Z0-9~_\-]+/gi,
  /fiverr\.com\/(?!categories|gigs|pro|search|subcategories|support)[a-zA-Z0-9_\-]+/gi,
  /freelancer\.com\/u\/[a-zA-Z0-9_\-]+/gi,
  /toptal\.com\/resume\/[a-zA-Z0-9_\-]+/gi,
  /guru\.com\/freelancers\/[a-zA-Z0-9_\-]+/gi,
  /peopleperhour\.com\/freelancer\/[a-zA-Z0-9_\-]+/gi,
  /truelancer\.com\/freelancer\/[a-zA-Z0-9_\-]+/gi,
  /github\.com\/(?!orgs|explore|trending|issues|pulls|marketplace|about|contact|pricing|login|join|topics)[a-zA-Z0-9_\-]+(?:\/)?(?:\s|$)/gi,
  /youtube\.com\/@[a-zA-Z0-9_\-]+/gi,
  /youtube\.com\/channel\/[a-zA-Z0-9_\-]+/gi,
  /youtube\.com\/user\/[a-zA-Z0-9_\-]+/gi,
  /(?:twitter|x)\.com\/(?!home|explore|hashtag|i\/|search|settings|notifications|messages|login|signup)[a-zA-Z0-9_]+/gi,
  /instagram\.com\/(?!p\/|reel\/|reels\/|explore\/|stories\/)[a-zA-Z0-9_.]+/gi,
  /(?:facebook|fb)\.com\/(?!groups\/|pages\/|events\/|watch|marketplace|gaming|fundraisers|help|login|signup)[a-zA-Z0-9._\-]+/gi,
  /behance\.net\/[a-zA-Z0-9_\-]+/gi,
  /dribbble\.com\/[a-zA-Z0-9_\-]+/gi,
  /t\.me\/[a-zA-Z0-9_\-]+/gi,
  /wa\.me\/\d+/gi,
  /discord\.gg\/[a-zA-Z0-9]+/gi,
  /skype:[a-zA-Z0-9._\-]+\?(?:call|chat|add)/gi,
];

const MEETING_PATTERNS = [
  /meet\.google\.com\/[a-zA-Z0-9\-]+/gi,
  /zoom\.us\/j\/[0-9]+/gi,
  /zoom\.us\/my\/[a-zA-Z0-9._\-]+/gi,
  /zoom\.us\/s\/[0-9]+/gi,
  /zoom\.us\/w\/[0-9]+/gi,
  /us[0-9]*web\.zoom\.us\/j\/[0-9]+/gi,
  /teams\.microsoft\.com\/l\/meetup-join\/[^\s]+/gi,
  /teams\.live\.com\/meet\/[a-zA-Z0-9]+/gi,
  /webex\.com\/meet\/[a-zA-Z0-9._\-]+/gi,
  /[a-zA-Z0-9]+\.webex\.com\/meet\/[a-zA-Z0-9._\-]+/gi,
  /[a-zA-Z0-9]+\.webex\.com\/join\/[a-zA-Z0-9._\-]+/gi,
  /gotomeet\.me\/[a-zA-Z0-9_\-]+/gi,
  /join\.me\/[a-zA-Z0-9_\-]+/gi,
  /gotomeeting\.com\/join\/[0-9]+/gi,
  /meet\.jit\.si\/[a-zA-Z0-9_\-]+/gi,
  /jitsi\.org\/[a-zA-Z0-9_\-]+/gi,
  /whereby\.com\/[a-zA-Z0-9_\-]+/gi,
  /appear\.in\/[a-zA-Z0-9_\-]+/gi,
  /bluejeans\.com\/[0-9]+/gi,
  /join\.skype\.com\/[a-zA-Z0-9]+/gi,
  /chime\.aws\/[0-9]+/gi,
  /loom\.com\/share\/[a-zA-Z0-9]+/gi,
  /calendly\.com\/[a-zA-Z0-9_\-]+/gi,
  /dyte\.io\/meeting\/[a-zA-Z0-9_\-]+/gi,
  /8x8\.vc\/[a-zA-Z0-9_\-]+/gi,
  /meetings\.ringcentral\.com\/[a-zA-Z0-9_\-]+/gi,
  /https?:\/\/[^\s]+\/(?:meeting|join|room)\/[a-zA-Z0-9_\-]+/gi,
];

function isMessageRestricted(content) {
  if (!content || typeof content !== "string") return null;
  EMAIL_PATTERN.lastIndex = 0;
  if (EMAIL_PATTERN.test(content)) {
    EMAIL_PATTERN.lastIndex = 0;
    return "📧 Email address share karna allowed nahi hai.";
  }
  EMAIL_PATTERN.lastIndex = 0;
  for (const p of PROFILE_PATTERNS) {
    p.lastIndex = 0;
    if (p.test(content)) {
      p.lastIndex = 0;
      return "🔗 Kisi bhi platform ki profile link share karna allowed nahi hai.";
    }
    p.lastIndex = 0;
  }
  for (const p of MEETING_PATTERNS) {
    p.lastIndex = 0;
    if (p.test(content)) {
      p.lastIndex = 0;
      return "🎥 Meeting links (Google Meet, Zoom, Teams, Webex, etc.) share karna allowed nahi hai.";
    }
    p.lastIndex = 0;
  }
  const phones = (content.match(/(?:\+?\d[\s\-.]?){8,15}/g) || []).filter(
    (m) => m.replace(/\D/g, "").length >= 8
  );
  if (phones.length) return "📞 Contact number share karna allowed nahi hai.";
  return null;
}

// ── HTTP server (handles both socket.io + the emit-notification REST endpoint)
const httpServer = createServer((req, res) => {
  // Simple HTTP router for the notification emit endpoint
  if (req.method === "POST" && req.url === "/emit-notification") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const { recipientId, notification } = JSON.parse(body);
        if (recipientId && notification) {
          // Emit to the specific user's room
          io.to(`user:${recipientId}`).emit("notification:new", notification);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "recipientId and notification required" }));
        }
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  // Default response for unknown routes
  res.writeHead(404);
  res.end("Not found");
});

const getAllowedOrigins = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  return ["http://localhost:3000", "http://localhost:4028", "http://localhost:4029"];
};

const io = new Server(httpServer, {
  cors: {
    origin: getAllowedOrigins(),
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const userSockets = new Map();
console.log(`🚀 Socket.IO Server starting...`);

io.on("connection", (socket) => {
  console.log("✅ New connection:", socket.id);

  socket.on("user:join", (userId) => {
    if (!userId) return;
    socket.data.userId = userId;
    socket.join(`user:${userId}`);
    userSockets.set(userId, socket.id);

    console.log(`👤 User ${userId} joined → socket ${socket.id}`);

    // Broadcast online presence to everyone who might be in a chat with them
    io.emit("user:status_change", { userId, isOnline: true });
  });

  // ── Online Status Request
  socket.on("user:check_online", (checkUserId) => {
    if (checkUserId) {
      socket.emit("user:status_response", {
        userId: checkUserId,
        isOnline: userSockets.has(checkUserId)
      });
    }
  });

  // ── Chat room join
  socket.on("join:chat", (data) => {
    if (!data?.chatId || !data?.userId) return;
    socket.join(`chat:${data.chatId}`);
    console.log(`📬 User ${data.userId} joined chat:${data.chatId}`);
  });

  // ── Chat request
  socket.on("chat:request", (data) => {
    if (!data?.toUserId || !data?.fromUserId) return;
    if (userSockets.has(data.toUserId)) {
      io.to(`user:${data.toUserId}`).emit("chat:request:received", {
        requestId: data.requestId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
      });
    } else {
      socket.emit("chat:request:offline", { toUserId: data.toUserId });
    }
  });

  // ── Chat accept
  socket.on("chat:accept", (data) => {
    if (!data?.chatId || !data?.fromUserId) return;
    socket.join(`chat:${data.chatId}`);
    const otherSocketId = userSockets.get(data.fromUserId);
    if (otherSocketId) {
      const otherSocket = io.sockets.sockets.get(otherSocketId);
      if (otherSocket) otherSocket.join(`chat:${data.chatId}`);
      io.to(`user:${data.fromUserId}`).emit("chat:accepted", {
        chatId: data.chatId,
        withUserId: data.toUserId,
      });
    }
  });

  // ── Message send
  socket.on("message:send", (data) => {
    if (!data?.chatId || !data?.message) return;

    // ✅ RESTRICTION: content check karo before relay
    const content = data.message.content || data.message.text || "";
    const restrictionReason = isMessageRestricted(content);
    if (restrictionReason) {
      // Sirf sender ko error bhejo, message relay nahi karo
      socket.emit("message:restricted", {
        chatId: data.chatId,
        reason: restrictionReason,
      });
      return;
    }

    socket.to(`chat:${data.chatId}`).emit("message:received", {
      chatId: data.chatId,
      message: data.message,
    });
  });

  // ── Typing indicators
  socket.on("typing:start", (data) => {
    if (!data?.chatId) return;
    socket.to(`chat:${data.chatId}`).emit("typing:user", {
      chatId: data.chatId, userId: data.userId, isTyping: true,
    });
  });

  socket.on("typing:stop", (data) => {
    if (!data?.chatId) return;
    socket.to(`chat:${data.chatId}`).emit("typing:user", {
      chatId: data.chatId, userId: data.userId, isTyping: false,
    });
  });

  // ── Disconnect
  socket.on("disconnect", (reason) => {
    const userId = socket.data.userId;
    if (userId && userSockets.get(userId) === socket.id) {
      userSockets.delete(userId);
      console.log(`❌ User ${userId} disconnected (${reason})`);

      // Broadcast offline status
      io.emit("user:status_change", { userId, isOnline: false });
    }
  });

  socket.on("error", (err) => {
    console.error(`❌ Socket error [${socket.id}]:`, err.message);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`✅ Socket.IO Server running on port ${PORT}`);
  console.log(`📡 Notification emit endpoint: POST http://localhost:${PORT}/emit-notification`);
});