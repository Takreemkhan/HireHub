// "use client";
// // src/app/components/chat/VideoCallModal.tsx
// // WebRTC video call + screen share modal used inside ChatPage

// import { useEffect, useRef, useState, useCallback } from "react";
// import { getSocket } from "@/socket/socket";

// /* ─── Types ─────────────────────────────────────────────────── */
// export type CallState =
//     | "idle"
//     | "calling"       // we initiated, waiting for answer
//     | "incoming"      // receiving a call
//     | "connected"     // in call
//     | "ended";

// export interface IncomingCallInfo {
//     fromUserId: string;
//     fromName: string;
//     chatId: string;
//     offer: RTCSessionDescriptionInit;
// }

// interface Props {
//     callState: CallState;
//     incomingCall: IncomingCallInfo | null;
//     localUserId: string;
//     localUserName: string;       // ← caller's own display name sent to callee
//     remoteUserId: string;
//     remoteUserName: string;
//     chatId: string;
//     onConnected: () => void;     // called on CALLER side after answer processed
//     onEnd: () => void;
//     onAccept: (info: IncomingCallInfo) => void;
//     onReject: () => void;
//     peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>;
// }

// /* ─── ICE config — multiple STUN servers for better connectivity ── */
// const RTC_CONFIG: RTCConfiguration = {
//     iceServers: [
//         { urls: "stun:stun.l.google.com:19302" },
//         { urls: "stun:stun1.l.google.com:19302" },
//         { urls: "stun:stun2.l.google.com:19302" },
//         { urls: "stun:stun3.l.google.com:19302" },
//         { urls: "stun:stun4.l.google.com:19302" },
//         // Open TURN server fallback (for restrictive NAT / different browsers on same device)
//         {
//             urls: "turn:openrelay.metered.ca:80",
//             username: "openrelayproject",
//             credential: "openrelayproject",
//         },
//         {
//             urls: "turn:openrelay.metered.ca:443",
//             username: "openrelayproject",
//             credential: "openrelayproject",
//         },
//     ],
//     iceCandidatePoolSize: 10,
// };

// /* ─── Helpers ────────────────────────────────────────────────── */
// function Avatar({ name, size = 16 }: { name: string; size?: number }) {
//     const initials = name
//         .split(" ")
//         .slice(0, 2)
//         .map((w) => w[0] ?? "")
//         .join("")
//         .toUpperCase();
//     return (
//         <div
//             className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
//             style={{ width: size * 4, height: size * 4, fontSize: size, backgroundColor: "#1B365D" }}
//         >
//             {initials || "?"}
//         </div>
//     );
// }

// /* ─── Main Component ─────────────────────────────────────────── */
// export default function VideoCallModal({
//     callState,
//     incomingCall,
//     localUserId,
//     localUserName,
//     remoteUserId,
//     remoteUserName,
//     chatId,
//     onConnected,
//     onEnd,
//     onAccept,
//     onReject,
//     peerConnectionRef,

// }: Props) {
//     const localVideoRef = useRef<HTMLVideoElement>(null);
//     const remoteVideoRef = useRef<HTMLVideoElement>(null);
//     const localStreamRef = useRef<MediaStream | null>(null);
//     const screenStreamRef = useRef<MediaStream | null>(null);
//     const iceBufRef = useRef<RTCIceCandidateInit[]>([]);
//     console.log("connect on", onConnected);
//     // ── Stable callback refs — prevents socket useEffect re-running on every render ──
//     // ChatPage passes inline arrow functions; without refs the ICE listener gets
//     // torn down and re-added mid-exchange, dropping candidates.
//     const onEndRef = useRef(onEnd);
//     const onConnectedRef = useRef(onConnected);
//     const onAcceptRef = useRef(onAccept);
//     const onRejectRef = useRef(onReject);
//     useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);
//     useEffect(() => { onConnectedRef.current = onConnected; }, [onConnected]);
//     useEffect(() => { onAcceptRef.current = onAccept; }, [onAccept]);
//     useEffect(() => { onRejectRef.current = onReject; }, [onReject]);

//     const [micMuted, setMicMuted] = useState(false);
//     const [camOff, setCamOff] = useState(false);
//     const [sharing, setSharing] = useState(false);
//     const [remoteCam, setRemoteCam] = useState(true);   // optimistic
//     const [peerSharing, setPeerSharing] = useState(false);
//     const [duration, setDuration] = useState(0);
//     const [hasRemoteStream, setHasRemoteStream] = useState(false);
//     const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);

//     const socket = getSocket();

//     /* ── Duration timer ── */
//     useEffect(() => {
//         if (callState === "connected") {
//             durationRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
//         } else {
//             if (durationRef.current) clearInterval(durationRef.current);
//             setDuration(0);
//         }
//         return () => { if (durationRef.current) clearInterval(durationRef.current); };
//     }, [callState]);

//     const formatDuration = (s: number) => {
//         const m = Math.floor(s / 60).toString().padStart(2, "0");
//         const sec = (s % 60).toString().padStart(2, "0");
//         return `${m}:${sec}`;
//     };

//     /* ── Get local media ── */
//     const getLocalStream = useCallback(async () => {
//         // If we already have a live stream, reuse it — prevents AbortError on double call
//         if (localStreamRef.current) {
//             const tracks = localStreamRef.current.getTracks();
//             if (tracks.length > 0 && tracks.every(t => t.readyState === "live")) {
//                 if (localVideoRef.current) {
//                     localVideoRef.current.srcObject = localStreamRef.current;
//                     localVideoRef.current.muted = true;
//                 }
//                 return localStreamRef.current;
//             }
//             // Stale stream — stop it first
//             tracks.forEach(t => t.stop());
//             localStreamRef.current = null;
//         }

//         // Retry loop: AbortError can happen when camera is still releasing
//         let lastErr: unknown;
//         for (let attempt = 1; attempt <= 3; attempt++) {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({
//                     video: { facingMode: "user" },
//                     audio: true,
//                 });
//                 localStreamRef.current = stream;
//                 if (localVideoRef.current) {
//                     localVideoRef.current.srcObject = stream;
//                     localVideoRef.current.muted = true;
//                 }
//                 return stream;
//             } catch (err: any) {
//                 lastErr = err;
//                 const isAbort = err?.name === "AbortError" || err?.name === "NotReadableError";
//                 if (isAbort && attempt < 3) {
//                     // Camera still releasing — wait and retry
//                     await new Promise(r => setTimeout(r, 600 * attempt));
//                     continue;
//                 }
//                 // NotAllowedError or final attempt — throw
//                 throw err;
//             }
//         }
//         throw lastErr;
//     }, []);

//     /* ── Create PeerConnection ── */
//     const createPeer = useCallback((stream: MediaStream) => {
//         const pc = new RTCPeerConnection(RTC_CONFIG);
//         peerConnectionRef.current = pc;

//         stream.getTracks().forEach((t) => pc.addTrack(t, stream));

//         pc.ontrack = (e) => {
//             if (remoteVideoRef.current && e.streams[0]) {
//                 remoteVideoRef.current.srcObject = e.streams[0];
//                 setHasRemoteStream(true);
//             }
//         };

//         pc.onicecandidate = (e) => {
//             if (e.candidate) {
//                 socket.emit("call:ice", { toUserId: remoteUserId, candidate: e.candidate.toJSON() });
//             }
//         };

//         pc.onconnectionstatechange = () => {
//             console.log("🔗 PeerConnection state:", pc.connectionState);
//             if (["failed", "closed"].includes(pc.connectionState)) {
//                 onEndRef.current();   // ← use ref so no stale closure
//             }
//         };

//         return pc;
//         // onEnd intentionally excluded — use ref instead to avoid re-creating peer
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [remoteUserId, socket, peerConnectionRef]);

//     /* ── Outgoing call flow (caller) ── */
//     useEffect(() => {
//         if (callState !== "calling") return;
//         let cancelled = false;
//         (async () => {
//             try {
//                 const stream = await getLocalStream();
//                 if (cancelled) return;
//                 const pc = createPeer(stream);
//                 const offer = await pc.createOffer();
//                 await pc.setLocalDescription(offer);
//                 if (cancelled) return;
//                 socket.emit("call:offer", {
//                     toUserId: remoteUserId,
//                     fromUserId: localUserId,
//                     fromName: localUserName,
//                     chatId,
//                     offer,
//                 });
//             } catch (err) {
//                 if (!cancelled) {
//                     console.error("Call setup error:", err);
//                     onEndRef.current();  // use ref
//                 }
//             }
//         })();
//         return () => { cancelled = true; };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [callState]);

//     /* ── Socket events for call ── */
//     useEffect(() => {
//         // ── All handlers use *Ref.current so this effect never needs to re-run ──

//         // Answer received (CALLER side)
//         const onAnswered = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
//             const pc = peerConnectionRef.current;
//             if (!pc) return;
//             try {
//                 await pc.setRemoteDescription(new RTCSessionDescription(answer));
//                 // Flush ICE candidates that arrived before remote description was set
//                 for (const c of iceBufRef.current) {
//                     try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) { }
//                 }
//                 iceBufRef.current = [];
//                 onConnectedRef.current();   // transition caller → "connected"
//             } catch (err) {
//                 console.error("setRemoteDescription error:", err);
//             }
//         };

//         // ICE candidate from peer
//         const onIce = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
//             if (!candidate) return;
//             const pc = peerConnectionRef.current;
//             // ✅ KEY FIX: If PC not created yet (callee hasn't accepted),
//             // buffer the candidate — don't drop it.
//             // handleAccept will flush iceBufRef after creating the PC.
//             if (!pc) {
//                 iceBufRef.current.push(candidate);
//                 return;
//             }
//             try {
//                 if (pc.remoteDescription?.type) {
//                     await pc.addIceCandidate(new RTCIceCandidate(candidate));
//                 } else {
//                     // PC exists but remote description not set yet — also buffer
//                     iceBufRef.current.push(candidate);
//                 }
//             } catch (err) {
//                 console.warn("ICE add error (non-fatal):", err);
//             }
//         };

//         const onEnded = () => onEndRef.current();
//         const onRejected = () => onEndRef.current();
//         const onPeerScreen = ({ isSharing }: { isSharing: boolean }) => setPeerSharing(isSharing);

//         socket.on("call:answered", onAnswered);
//         socket.on("call:ice", onIce);
//         socket.on("call:ended", onEnded);
//         socket.on("call:rejected", onRejected);
//         socket.on("call:screen_share", onPeerScreen);

//         return () => {
//             socket.off("call:answered", onAnswered);
//             socket.off("call:ice", onIce);
//             socket.off("call:ended", onEnded);
//             socket.off("call:rejected", onRejected);
//             socket.off("call:screen_share", onPeerScreen);
//         };
//         // ⚠ Only socket + peerConnectionRef — callbacks are stable via refs above
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [socket, peerConnectionRef]);

//     /* ── Accept incoming call ── */
//     const handleAccept = useCallback(async () => {
//         if (!incomingCall) return;
//         const savedInfo = incomingCall;   // snapshot before parent clears it
//         try {
//             const stream = await getLocalStream();
//             const pc = createPeer(stream);
//             await pc.setRemoteDescription(new RTCSessionDescription(savedInfo.offer));
//             // Flush any ICE candidates buffered before accept
//             for (const c of iceBufRef.current) {
//                 try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (_) { }
//             }
//             iceBufRef.current = [];
//             const answer = await pc.createAnswer();
//             await pc.setLocalDescription(answer);
//             socket.emit("call:answer", { toUserId: savedInfo.fromUserId, answer });
//             // Transition callee → "connected" only after WebRTC answer is ready
//             onAcceptRef.current(savedInfo);
//         } catch (err) {
//             console.error("Accept error:", err);
//             onEndRef.current();
//         }
//         // onAccept/onEnd intentionally excluded — use refs
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [incomingCall, getLocalStream, createPeer, socket]);

//     /* ── End call ── */
//     const handleEnd = useCallback(() => {
//         socket.emit("call:end", { toUserId: remoteUserId });
//         // Stop all tracks explicitly before nulling ref
//         localStreamRef.current?.getTracks().forEach((t) => { t.stop(); });
//         screenStreamRef.current?.getTracks().forEach((t) => { t.stop(); });
//         localStreamRef.current = null;
//         screenStreamRef.current = null;
//         // Clear video elements srcObject so camera indicator turns off
//         if (localVideoRef.current) localVideoRef.current.srcObject = null;
//         if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
//         if (peerConnectionRef.current) {
//             peerConnectionRef.current.close();
//             peerConnectionRef.current = null;
//         }
//         setSharing(false);
//         setHasRemoteStream(false);
//         onEndRef.current();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [socket, remoteUserId, peerConnectionRef]);

//     /* ── Reject incoming ── */
//     const handleReject = useCallback(() => {
//         if (incomingCall) socket.emit("call:reject", { toUserId: incomingCall.fromUserId });
//         onRejectRef.current();   // ← use ref
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [socket, incomingCall]);

//     /* ── Toggle Mic ── */
//     const toggleMic = () => {
//         const stream = localStreamRef.current;
//         if (!stream) return;
//         stream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
//         setMicMuted((m) => !m);
//     };

//     /* ── Toggle Camera ── */
//     const toggleCam = () => {
//         const stream = localStreamRef.current;
//         if (!stream) return;
//         stream.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
//         setCamOff((c) => !c);
//     };

//     /* ── Screen Share ── */
//     const toggleScreenShare = useCallback(async () => {
//         const pc = peerConnectionRef.current;
//         if (!pc) return;

//         if (!sharing) {
//             try {
//                 const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
//                     video: true, audio: false,
//                 });
//                 screenStreamRef.current = screenStream;
//                 const screenTrack = screenStream.getVideoTracks()[0];

//                 // Replace video sender with screen track
//                 const sender = pc.getSenders().find((s) => s.track?.kind === "video");
//                 if (sender) await sender.replaceTrack(screenTrack);

//                 // Show local screen in local video
//                 if (localVideoRef.current) {
//                     const mixed = new MediaStream([
//                         screenTrack,
//                         ...(localStreamRef.current?.getAudioTracks() ?? []),
//                     ]);
//                     localVideoRef.current.srcObject = mixed;
//                 }

//                 // When screen share stops (browser button)
//                 screenTrack.onended = () => {
//                     stopScreenShare();
//                 };

//                 setSharing(true);
//                 socket.emit("call:screen_share", { toUserId: remoteUserId, isSharing: true });
//             } catch (e) {
//                 console.warn("Screen share cancelled/error:", e);
//             }
//         } else {
//             stopScreenShare();
//         }
//     }, [sharing, peerConnectionRef, socket, remoteUserId]);

//     const stopScreenShare = useCallback(async () => {
//         const pc = peerConnectionRef.current;
//         screenStreamRef.current?.getTracks().forEach((t) => t.stop());
//         screenStreamRef.current = null;

//         // Restore camera track
//         if (pc && localStreamRef.current) {
//             const camTrack = localStreamRef.current.getVideoTracks()[0];
//             const sender = pc.getSenders().find((s) => s.track?.kind === "video");
//             if (sender && camTrack) await sender.replaceTrack(camTrack);
//             if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
//         }

//         setSharing(false);
//         socket.emit("call:screen_share", { toUserId: remoteUserId, isSharing: false });
//     }, [peerConnectionRef, socket, remoteUserId]);

//     /* ── Cleanup on unmount ── */
//     useEffect(() => {
//         return () => {
//             localStreamRef.current?.getTracks().forEach(t => t.stop());
//             screenStreamRef.current?.getTracks().forEach(t => t.stop());
//             localStreamRef.current = null;
//             screenStreamRef.current = null;
//             if (localVideoRef.current) localVideoRef.current.srcObject = null;
//             if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
//             if (peerConnectionRef.current) {
//                 peerConnectionRef.current.close();
//                 peerConnectionRef.current = null;
//             }
//         };
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     /* ────────────────────────────────────────────────────────────
//        INCOMING CALL SCREEN
//     ─────────────────────────────────────────────────────────── */
//     if (callState === "incoming" && incomingCall) {
//         return (
//             <div className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
//                 <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center gap-6">
//                     {/* Pulse ring */}
//                     <div className="relative flex items-center justify-center">
//                         <div className="absolute w-28 h-28 rounded-full bg-green-200 animate-ping opacity-60" />
//                         <div className="absolute w-24 h-24 rounded-full bg-green-300 animate-ping animation-delay-200 opacity-40" />
//                         <div className="relative z-10">
//                             <Avatar name={incomingCall.fromName} size={18} />
//                         </div>
//                     </div>
//                     <div className="text-center">
//                         <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Incoming Video Call</p>
//                         <h2 className="text-2xl font-bold" style={{ color: "#1B365D" }}>{incomingCall.fromName}</h2>
//                     </div>
//                     <div className="flex gap-6 mt-2">
//                         {/* Reject */}
//                         <button
//                             onClick={handleReject}
//                             className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
//                             title="Decline"
//                         >
//                             <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
//                                 <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)" />
//                             </svg>
//                         </button>
//                         {/* Accept */}
//                         <button
//                             onClick={handleAccept}
//                             className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
//                             title="Accept"
//                         >
//                             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     /* ────────────────────────────────────────────────────────────
//        CALLING (waiting for pickup)
//     ─────────────────────────────────────────────────────────── */
//     if (callState === "calling") {
//         return (
//             <div className="fixed inset-0 z-[99999] bg-gray-950 flex flex-col items-center justify-center gap-6">
//                 <div className="relative flex items-center justify-center">
//                     <div className="absolute w-32 h-32 rounded-full bg-white/10 animate-ping" />
//                     <div className="relative z-10">
//                         <Avatar name={remoteUserName} size={20} />
//                     </div>
//                 </div>
//                 <div className="text-center text-white">
//                     <p className="text-gray-400 text-sm mb-1">Calling…</p>
//                     <h2 className="text-2xl font-bold">{remoteUserName}</h2>
//                 </div>
//                 <button
//                     onClick={handleEnd}
//                     className="mt-4 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105"
//                     title="Cancel"
//                 >
//                     <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)" />
//                     </svg>
//                 </button>
//             </div>
//         );
//     }

//     /* ────────────────────────────────────────────────────────────
//        IN CALL
//     ─────────────────────────────────────────────────────────── */
//     if (callState !== "connected") return null;

//     return (
//         <div className="fixed inset-0 z-[99999] bg-gray-950 flex flex-col overflow-hidden">

//             {/* ── Remote video (main) ── */}
//             <div className="relative flex-1 bg-black flex items-center justify-center">
//                 <video
//                     ref={remoteVideoRef}
//                     autoPlay
//                     playsInline
//                     className="w-full h-full object-cover"
//                 />

//                 {/* Remote avatar if no stream yet */}
//                 {!hasRemoteStream && (
//                     <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
//                         <Avatar name={remoteUserName} size={22} />
//                         <div className="flex items-center gap-2">
//                             <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "0ms" }} />
//                             <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "150ms" }} />
//                             <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "300ms" }} />
//                         </div>
//                         <p className="text-white/70 text-sm">Establishing connection…</p>
//                     </div>
//                 )}

//                 {/* Peer sharing indicator */}
//                 {peerSharing && (
//                     <div className="absolute top-4 left-4 flex items-center gap-2 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
//                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                         </svg>
//                         {remoteUserName} is sharing screen
//                     </div>
//                 )}

//                 {/* Duration */}
//                 <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-mono px-3 py-1 rounded-full">
//                     {formatDuration(duration)}
//                 </div>

//                 {/* Local video PiP */}
//                 <div className="absolute bottom-4 right-4 w-36 h-24 rounded-xl overflow-hidden border-2 border-white/30 shadow-xl bg-gray-900">
//                     <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
//                     {camOff && (
//                         <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
//                             <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
//                             </svg>
//                         </div>
//                     )}
//                     {sharing && (
//                         <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">SCREEN</div>
//                     )}
//                 </div>
//             </div>

//             {/* ── Controls bar ── */}
//             <div className="bg-gray-900/95 backdrop-blur-md px-6 py-4 flex items-center justify-center gap-4 border-t border-white/10">

//                 {/* Remote name */}
//                 <span className="absolute left-6 text-white text-sm font-medium hidden sm:block truncate max-w-[120px]">
//                     {remoteUserName}
//                 </span>

//                 {/* Mic */}
//                 <button
//                     onClick={toggleMic}
//                     title={micMuted ? "Unmute" : "Mute"}
//                     className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95
//             ${micMuted ? "bg-red-500 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}
//                 >
//                     {micMuted ? (
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
//                         </svg>
//                     ) : (
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
//                         </svg>
//                     )}
//                 </button>

//                 {/* Camera */}
//                 <button
//                     onClick={toggleCam}
//                     title={camOff ? "Turn Camera On" : "Turn Camera Off"}
//                     className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95
//             ${camOff ? "bg-red-500 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}
//                 >
//                     {camOff ? (
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2zM3 3l18 18" />
//                         </svg>
//                     ) : (
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                         </svg>
//                     )}
//                 </button>

//                 {/* Screen Share */}
//                 <button
//                     onClick={toggleScreenShare}
//                     title={sharing ? "Stop Screen Share" : "Share Screen"}
//                     className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95
//             ${sharing ? "bg-blue-500 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}
//                 >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                     </svg>
//                 </button>

//                 {/* End call */}
//                 <button
//                     onClick={handleEnd}
//                     title="End Call"
//                     className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
//                 >
//                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                         <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)" />
//                     </svg>
//                 </button>
//             </div>
//         </div>
//     );
// }


"use client";
// src/app/components/chat/VideoCallModal.tsx
// WebRTC video call + screen share modal used inside ChatPage

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { getSocket } from "@/socket/socket";

/* ─── Types ─────────────────────────────────────────────────── */
export type CallState =
    | "idle"
    | "calling"       // we initiated, waiting for answer
    | "incoming"      // receiving a call
    | "connected"     // in call
    | "ended";

export interface IncomingCallInfo {
    fromUserId: string;
    fromName: string;
    chatId: string;
    offer: RTCSessionDescriptionInit;
}

interface Props {
    callState: CallState;
    incomingCall: IncomingCallInfo | null;
    localUserId: string;
    localUserName: string;       // ← caller's own display name sent to callee
    remoteUserId: string;
    remoteUserName: string;
    chatId: string;
    onConnected: () => void;     // called on CALLER side after answer processed
    onEnd: () => void;
    onAccept: (info: IncomingCallInfo) => void;
    onReject: () => void;
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>;
}

/* ─── ICE config (free STUN servers) ────────────────────────── */
const RTC_CONFIG: RTCConfiguration = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        // Free TURN servers for NAT traversal (needed when STUN alone can't punch through)
        {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: "turn:openrelay.metered.ca:443?transport=tcp",
            username: "openrelayproject",
            credential: "openrelayproject",
        },
    ],
};

/* ─── Helpers ────────────────────────────────────────────────── */
function Avatar({ name, size = 16 }: { name: string; size?: number }) {
    const initials = name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0] ?? "")
        .join("")
        .toUpperCase();
    return (
        <div
            className={`rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
            style={{ width: size * 4, height: size * 4, fontSize: size, backgroundColor: "#1B365D" }}
        >
            {initials || "?"}
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function VideoCallModal({
    callState,
    incomingCall,
    localUserId,
    localUserName,
    remoteUserId,
    remoteUserName,
    chatId,
    onConnected,
    onEnd,
    onAccept,
    onReject,
    peerConnectionRef,
}: Props) {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);
    const iceBufRef = useRef<RTCIceCandidateInit[]>([]);
    const remoteStreamRef = useRef<MediaStream | null>(null);

    const [micMuted, setMicMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [remoteCam, setRemoteCam] = useState(true);   // optimistic
    const [peerSharing, setPeerSharing] = useState(false);
    const [duration, setDuration] = useState(0);
    const [hasRemoteStream, setHasRemoteStream] = useState(false);
    const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const socket = getSocket();

    /* ── Duration timer ── */
    useEffect(() => {
        if (callState === "connected") {
            durationRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
        } else {
            if (durationRef.current) clearInterval(durationRef.current);
            setDuration(0);
        }
        return () => { if (durationRef.current) clearInterval(durationRef.current); };
    }, [callState]);

    const formatDuration = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    /* ── Get local media ── */
    const getLocalStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true;
            // Explicit play to handle autoplay policy
            localVideoRef.current.play().catch(() => { });
        }
        return stream;
    }, []);

    /* ── Create PeerConnection ── */
    const createPeer = useCallback((stream: MediaStream) => {
        const pc = new RTCPeerConnection(RTC_CONFIG);
        peerConnectionRef.current = pc;

        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        pc.ontrack = (e) => {
            console.log("🎥 ontrack fired, streams:", e.streams.length, "tracks:", e.track.kind);
            if (e.streams[0]) {
                // Always store the stream — video element might not exist yet
                remoteStreamRef.current = e.streams[0];
                setHasRemoteStream(true);
                // If video element already exists, attach immediately
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = e.streams[0];
                    remoteVideoRef.current.play().catch(() => { });
                }
            }
        };

        pc.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit("call:ice", { toUserId: remoteUserId, candidate: e.candidate.toJSON() });
            }
        };

        pc.onconnectionstatechange = () => {
            console.log("PeerConnection state:", pc.connectionState);
            // Only end on definitive failure — "disconnected" can be transient
            if (["failed", "closed"].includes(pc.connectionState)) {
                onEnd();
            }
        };

        return pc;
    }, [remoteUserId, socket, onEnd, peerConnectionRef]);

    /* ── Outgoing call flow (caller) ── */
    useEffect(() => {
        if (callState !== "calling") return;
        let cancelled = false;
        (async () => {
            try {
                const stream = await getLocalStream();
                if (cancelled) return;
                const pc = createPeer(stream);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                if (cancelled) return;
                socket.emit("call:offer", {
                    toUserId: remoteUserId,
                    fromUserId: localUserId,
                    fromName: localUserName,
                    chatId,
                    offer,
                });
            } catch (err) {
                if (!cancelled) {
                    console.error("Call setup error:", err);
                    onEnd();
                }
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callState]);

    /* ── Socket events for call ── */
    useEffect(() => {
        // Answer received (caller side)
        const onAnswered = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            const pc = peerConnectionRef.current;
            if (!pc) return;
            try {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
                // Flush buffered ICE candidates
                for (const c of iceBufRef.current) {
                    await pc.addIceCandidate(new RTCIceCandidate(c));
                }
                iceBufRef.current = [];
                // ✅ Transition caller to "connected" — THIS WAS THE MISSING PIECE
                onConnected();
            } catch (err) {
                console.error("setRemoteDescription error:", err);
            }
        };

        // ICE from peer
        const onIce = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            const pc = peerConnectionRef.current;
            if (!pc || !candidate) return;
            try {
                if (pc.remoteDescription && pc.remoteDescription.type) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } else {
                    iceBufRef.current.push(candidate);
                }
            } catch (err) {
                // Ignore benign ICE errors (e.g. "candidate cannot be added")
                console.warn("ICE candidate error (non-fatal):", err);
            }
        };

        // Remote ended
        const onEnded = () => onEnd();
        const onRejected = () => onEnd();

        // Remote screen share toggle
        const onPeerScreen = ({ isSharing }: { isSharing: boolean }) => setPeerSharing(isSharing);

        socket.on("call:answered", onAnswered);
        socket.on("call:ice", onIce);
        socket.on("call:ended", onEnded);
        socket.on("call:rejected", onRejected);
        socket.on("call:screen_share", onPeerScreen);

        return () => {
            socket.off("call:answered", onAnswered);
            socket.off("call:ice", onIce);
            socket.off("call:ended", onEnded);
            socket.off("call:rejected", onRejected);
            socket.off("call:screen_share", onPeerScreen);
        };
    }, [socket, peerConnectionRef, onEnd, onConnected]);

    /* ── Attach stored remote stream when video element becomes available ── */
    useEffect(() => {
        if (callState === "connected" && remoteStreamRef.current && remoteVideoRef.current) {
            if (remoteVideoRef.current.srcObject !== remoteStreamRef.current) {
                console.log("🎥 Attaching stored remote stream to video element");
                remoteVideoRef.current.srcObject = remoteStreamRef.current;
                remoteVideoRef.current.play().catch(() => { });
            }
        }
    }, [callState, hasRemoteStream]);

    /* ── Accept incoming call ── */
    const handleAccept = useCallback(async () => {
        if (!incomingCall) return;
        // Save ref before clearing — onAccept() clears incomingCall in parent
        const savedInfo = incomingCall;
        try {
            const stream = await getLocalStream();
            const pc = createPeer(stream);
            await pc.setRemoteDescription(new RTCSessionDescription(savedInfo.offer));
            for (const c of iceBufRef.current) await pc.addIceCandidate(new RTCIceCandidate(c));
            iceBufRef.current = [];
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit("call:answer", { toUserId: savedInfo.fromUserId, answer });
            // Only transition to connected AFTER WebRTC setup succeeds
            onAccept(savedInfo);
        } catch (err) {
            console.error("Accept error:", err);
            onEnd();
        }
    }, [incomingCall, onAccept, getLocalStream, createPeer, socket, onEnd]);

    /* ── End call ── */
    const handleEnd = useCallback(() => {
        socket.emit("call:end", { toUserId: remoteUserId });
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        screenStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        screenStreamRef.current = null;
        remoteStreamRef.current = null;
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }
        setSharing(false);
        setHasRemoteStream(false);
        onEnd();
    }, [socket, remoteUserId, peerConnectionRef, onEnd]);

    /* ── Reject incoming ── */
    const handleReject = useCallback(() => {
        if (incomingCall) socket.emit("call:reject", { toUserId: incomingCall.fromUserId });
        onReject();
    }, [socket, incomingCall, onReject]);

    /* ── Toggle Mic ── */
    const toggleMic = () => {
        const stream = localStreamRef.current;
        if (!stream) return;
        stream.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
        setMicMuted((m) => !m);
    };

    /* ── Toggle Camera ── */
    const toggleCam = () => {
        const stream = localStreamRef.current;
        if (!stream) return;
        stream.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
        setCamOff((c) => !c);
    };

    /* ── Screen Share ── */
    const toggleScreenShare = useCallback(async () => {
        const pc = peerConnectionRef.current;
        if (!pc) return;

        if (!sharing) {
            try {
                const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({
                    video: true, audio: false,
                });
                screenStreamRef.current = screenStream;
                const screenTrack = screenStream.getVideoTracks()[0];

                // Replace video sender with screen track
                const sender = pc.getSenders().find((s) => s.track?.kind === "video");
                if (sender) await sender.replaceTrack(screenTrack);

                // Show local screen in local video
                if (localVideoRef.current) {
                    const mixed = new MediaStream([
                        screenTrack,
                        ...(localStreamRef.current?.getAudioTracks() ?? []),
                    ]);
                    localVideoRef.current.srcObject = mixed;
                }

                // When screen share stops (browser button)
                screenTrack.onended = () => {
                    stopScreenShare();
                };

                setSharing(true);
                socket.emit("call:screen_share", { toUserId: remoteUserId, isSharing: true });
            } catch (e) {
                console.warn("Screen share cancelled/error:", e);
            }
        } else {
            stopScreenShare();
        }
    }, [sharing, peerConnectionRef, socket, remoteUserId]);

    const stopScreenShare = useCallback(async () => {
        const pc = peerConnectionRef.current;
        screenStreamRef.current?.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;

        // Restore camera track
        if (pc && localStreamRef.current) {
            const camTrack = localStreamRef.current.getVideoTracks()[0];
            const sender = pc.getSenders().find((s) => s.track?.kind === "video");
            if (sender && camTrack) await sender.replaceTrack(camTrack);
            if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        }

        setSharing(false);
        socket.emit("call:screen_share", { toUserId: remoteUserId, isSharing: false });
    }, [peerConnectionRef, socket, remoteUserId]);

    /* ── Cleanup on unmount ── */
    useEffect(() => {
        return () => {
            localStreamRef.current?.getTracks().forEach((t) => t.stop());
            screenStreamRef.current?.getTracks().forEach((t) => t.stop());
            remoteStreamRef.current = null;
        };
    }, []);

    /* ────────────────────────────────────────────────────────────
       INCOMING CALL SCREEN
    ─────────────────────────────────────────────────────────── */
    if (callState === "incoming" && incomingCall) {
        const content = (
            <div className="fixed inset-0 z-[100000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center gap-6">
                    {/* Pulse ring */}
                    <div className="relative flex items-center justify-center">
                        <div className="absolute w-28 h-28 rounded-full bg-green-200 animate-ping opacity-60" />
                        <div className="absolute w-24 h-24 rounded-full bg-green-300 animate-ping animation-delay-200 opacity-40" />
                        <div className="relative z-10">
                            <Avatar name={incomingCall.fromName} size={18} />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Incoming Video Call</p>
                        <h2 className="text-2xl font-bold" style={{ color: "#1B365D" }}>{incomingCall.fromName}</h2>
                    </div>
                    <div className="flex gap-6 mt-2">
                        {/* Reject */}
                        <button
                            onClick={handleReject}
                            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                            title="Decline"
                        >
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)" />
                            </svg>
                        </button>
                        {/* Accept */}
                        <button
                            onClick={handleAccept}
                            className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
                            title="Accept"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        );
        return typeof document !== "undefined" ? createPortal(content, document.body) : content;
    }

    /* ────────────────────────────────────────────────────────────
       CALLING (waiting for pickup)
    ─────────────────────────────────────────────────────────── */
    if (callState === "calling") {
        const content = (
            <div className="fixed inset-0 z-[100000] bg-gray-950 flex flex-col items-center justify-center gap-6">
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-32 h-32 rounded-full bg-white/10 animate-ping" />
                    <div className="relative z-10">
                        <Avatar name={remoteUserName} size={20} />
                    </div>
                </div>
                <div className="text-center text-white">
                    <p className="text-gray-400 text-sm mb-1">Calling…</p>
                    <h2 className="text-2xl font-bold">{remoteUserName}</h2>
                </div>
                <button
                    onClick={handleEnd}
                    className="mt-4 w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105"
                    title="Cancel"
                >
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)" />
                    </svg>
                </button>
            </div>
        );
        return typeof document !== "undefined" ? createPortal(content, document.body) : content;
    }

    /* ────────────────────────────────────────────────────────────
       IN CALL
    ─────────────────────────────────────────────────────────── */
    if (callState !== "connected") return null;

    const content = (
        <div className="fixed inset-0 z-[100000] bg-gray-950 flex flex-col overflow-hidden w-screen h-screen">

            {/* ── Remote video (main) ── */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                />

                {/* Remote avatar if no stream yet */}
                {!hasRemoteStream && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <Avatar name={remoteUserName} size={22} />
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                        <p className="text-white/70 text-sm">Establishing connection…</p>
                    </div>
                )}

                {/* Peer sharing indicator */}
                {peerSharing && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {remoteUserName} is sharing screen
                    </div>
                )}

                {/* Duration */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-mono px-3 py-1 rounded-full">
                    {formatDuration(duration)}
                </div>

                {/* Local video PiP */}
                <div className="absolute bottom-4 right-4 w-36 h-24 rounded-xl overflow-hidden border-2 border-white/30 shadow-xl bg-gray-900 z-[100001]">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                    {camOff && (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                            <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                    )}
                    {sharing && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">SCREEN</div>
                    )}
                </div>
            </div>

            {/* ── Controls bar ── */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-center gap-4 border-t border-white/10 flex-shrink-0 relative z-[100002]">

                {/* Remote name */}
                <span className="absolute left-6 text-white text-sm font-medium hidden sm:block truncate max-w-[120px]">
                    {remoteUserName}
                </span>

                {/* Mic */}
                <button
                    onClick={toggleMic}
                    title={micMuted ? "Unmute" : "Mute"}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95
            ${micMuted ? "bg-red-500 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}
                >
                    {micMuted ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                </button>

                {/* Camera */}
                <button
                    onClick={toggleCam}
                    title={camOff ? "Turn Camera On" : "Turn Camera Off"}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95
            ${camOff ? "bg-red-500 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}
                >
                    {camOff ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2zM3 3l18 18" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    )}
                </button>

                {/* Screen Share */}
                <button
                    onClick={toggleScreenShare}
                    title={sharing ? "Stop Screen Share" : "Share Screen"}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95
            ${sharing ? "bg-blue-500 text-white" : "bg-white/15 text-white hover:bg-white/25"}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </button>

                {/* End call */}
                <button
                    onClick={handleEnd}
                    title="End Call"
                    className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" transform="rotate(135 12 12)" />
                    </svg>
                </button>
            </div>
        </div>
    );

    return typeof document !== "undefined" ? createPortal(content, document.body) : content;
}