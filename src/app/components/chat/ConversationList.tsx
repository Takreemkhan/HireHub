// "use client";

// import { getAvatarGradient, getInitials } from "@/utils/avatarColors";

// interface ConversationsListProps {
//   userId: string;
//   chats: any[];
//   activeChatId: string | null;
//   loading: boolean;
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   onChatSelect: (chatId: string) => void;
//   onNewConversation: () => void;
// }

// export default function ConversationsList({
//   userId,
//   chats,
//   activeChatId,
//   loading,
//   searchQuery,
//   onSearchChange,
//   onChatSelect,
//   onNewConversation,
// }: ConversationsListProps) {

//   const formatTimestamp = (date: string | Date) => {
//     const d = new Date(date);
//     const now = new Date();
//     const diffMs = now.getTime() - d.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMs / 3600000);
//     const diffDays = Math.floor(diffMs / 86400000);

//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60) return `${diffMins}m`;
//     if (diffHours < 24) return `${diffHours}h`;
//     if (diffDays < 7) return `${diffDays}d`;

//     return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//   };

//   return (
//     <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between mb-3">
//           <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
//           <button
//             onClick={onNewConversation}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//             title="New conversation"
//           >
//             <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//             </svg>
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="relative">
//           <svg 
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" 
//             fill="none" 
//             stroke="currentColor" 
//             viewBox="0 0 24 24"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => onSearchChange(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//       </div>

//       {/* Conversations List */}
//       <div className="flex-1 overflow-y-auto">
//         {loading ? (
//           <div className="p-8 text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="text-sm text-gray-500 mt-2">Loading conversations...</p>
//           </div>
//         ) : chats.length > 0 ? (
//           <div>
//             {chats.map((chat) => {
//               const otherUser = chat.participants?.find((p: string) => p !== userId) || "";
//               const lastMessage = chat.messages?.[chat.messages.length - 1];
//               const isActive = chat._id === activeChatId;
//               const unreadCount = 0; // TODO: Implement unread count logic

//               return (
//                 <button
//                   key={chat._id}
//                   onClick={() => onChatSelect(chat._id)}
//                   className={`w-full text-left px-4 py-3 border-l-4 transition-all ${
//                     isActive 
//                       ? "border-blue-600 bg-blue-50" 
//                       : "border-transparent hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-start gap-3">
//                     {/* Avatar */}
//                     <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(otherUser)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm`}>
//                       {getInitials(otherUser)}
//                     </div>

//                     {/* Content */}
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center justify-between mb-1">
//                         <h3 className={`text-sm font-semibold truncate ${isActive ? "text-gray-900" : "text-gray-900"}`}>
//                           {otherUser?.split('@')[0] || "User"}
//                         </h3>
//                         <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
//                           {formatTimestamp(lastMessage?.timestamp || chat.createdAt)}
//                         </span>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <p className={`text-xs truncate ${isActive ? "text-gray-600" : "text-gray-500"}`}>
//                           {lastMessage?.senderId === userId && "You: "}
//                           {lastMessage?.text || "No messages yet"}
//                         </p>

//                         {unreadCount > 0 && (
//                           <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
//                             {unreadCount}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="p-8 text-center">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//               </svg>
//             </div>
//             <p className="text-sm text-gray-600 font-medium">No conversations yet</p>
//             <p className="text-xs text-gray-400 mt-1">Start a new conversation to begin messaging</p>
//             <button
//               onClick={onNewConversation}
//               className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Start Conversation
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { getAvatarGradient, getInitials } from "@/utils/avatarColors";

interface ConversationsListProps {
  userId: string;
  chats: any[];
  activeChatId: string | null;
  loading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatSelect: (chatId: string) => void;
  onNewConversation: () => void;
  // ✅ NEW: passed down from ChatPage so display logic is centralised
  getOtherUserDisplay: (chat: any) => string;
}

export default function ConversationsList({
  userId,
  chats,
  activeChatId,
  loading,
  searchQuery,
  onSearchChange,
  onChatSelect,
  onNewConversation,
  getOtherUserDisplay,
}: ConversationsListProps) {

  const formatTimestamp = (date: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // get last message text — backend stores messages with "content" field
  // (job_share messages also use "content"), not "text"
  const getLastMessageText = (chat: any): string => {
    const messages = chat.messages || [];
    if (messages.length === 0) return "No messages yet";
    const last = messages[messages.length - 1];

    if (last.messageType === "job_share") {
      return `📎 Shared a job`;
    }
    // backend saves as "content"; fallback to "text" for older records
    return last.content || last.text || "No messages yet";
  };

  //  compare chat._id as string; backend returns ObjectId
  const isOwnLastMessage = (chat: any): boolean => {
    const messages = chat.messages || [];
    if (messages.length === 0) return false;
    const last = messages[messages.length - 1];
    return last.senderId?.toString() === userId?.toString();
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <button
            onClick={onNewConversation}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="New conversation"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading conversations...</p>
          </div>
        ) : chats.length > 0 ? (
          <div>
            {chats.map((chat) => {
              // chat._id from MongoDB is an ObjectId — convert to string
              const chatIdStr = chat._id?.toString();
              const isActive = chatIdStr === activeChatId?.toString();

              const displayName = getOtherUserDisplay(chat);

              const lastText = getLastMessageText(chat);
              const showYou = isOwnLastMessage(chat);

              const lastMessageTime =
                chat.lastMessageAt ||
                chat.messages?.[chat.messages.length - 1]?.timestamp ||
                chat.createdAt;

              const unreadCount = isActive
                ? 0
                : (chat.messages || []).reduce((count: number, m: any) => {
                  if (m.senderId?.toString() !== userId?.toString()) {
                    const isRead = m.readBy?.some((r: any) => r?.toString() === userId?.toString());
                    if (!isRead) return count + 1;
                  }
                  return count;
                }, 0);

              const profileImage = chat.participantDetails?.[0]?.profileImage || null;

              return (
                <button
                  key={chatIdStr}
                  onClick={() => onChatSelect(chatIdStr)}
                  className={`w-full text-left px-4 py-3 border-l-4 transition-all ${isActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-transparent hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0 shadow-sm"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(displayName)} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm`}
                      >
                        {getInitials(displayName)}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-semibold truncate text-gray-900 flex flex-col">
                          <span>
                            {displayName.includes("@")
                              ? displayName.split("@")[0]
                              : displayName || "User"}
                          </span>
                          <span className={`text-[10px] font-medium opacity-80 truncate ${chat.jobTitle ? 'text-blue-600' : 'text-gray-400'}`}>
                            {chat.jobTitle || "General Chat"}
                          </span>
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {formatTimestamp(lastMessageTime)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className={`text-xs truncate ${isActive ? "text-gray-600" : "text-gray-500"}`}>
                          {showYou && "You: "}
                          {lastText}
                        </p>
                        {!!unreadCount && unreadCount > 0 && (
                          <span className="ml-2 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-[20px] h-[20px] flex items-center justify-center px-1 flex-shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">No conversations yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a new conversation to begin messaging</p>
            <button
              onClick={onNewConversation}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}