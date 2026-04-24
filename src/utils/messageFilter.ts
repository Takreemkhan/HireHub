const EMAIL_PATTERN =
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/gi;

const PHONE_PATTERN =
    /(?:\+?\d{1,3}[\s\-.]?)?(?:\(?\d{2,4}\)?[\s\-.]?)?\d{3,5}[\s\-.]?\d{4,6}/g;

const PROFILE_PATTERNS: RegExp[] = [
    /linkedin\.com\/in\/[a-zA-Z0-9\-_%]+/gi,
    /upwork\.com\/freelancers\/[a-zA-Z0-9~_\-]+/gi,
    /upwork\.com\/o\/profiles\/[a-zA-Z0-9~_\-]+/gi,
    /fiverr\.com\/(?!categories|gigs|pro|search|subcategories|support|privacypolicy|terms)[a-zA-Z0-9_\-]+/gi,
    /freelancer\.com\/u\/[a-zA-Z0-9_\-]+/gi,
    /toptal\.com\/resume\/[a-zA-Z0-9_\-]+/gi,
    /guru\.com\/freelancers\/[a-zA-Z0-9_\-]+/gi,
    /peopleperhour\.com\/freelancer\/[a-zA-Z0-9_\-]+/gi,
    /truelancer\.com\/freelancer\/[a-zA-Z0-9_\-]+/gi,
    /github\.com\/(?!orgs|explore|trending|issues|pulls|marketplace|sponsors|about|contact|pricing|login|join|topics)[a-zA-Z0-9_\-]+(?:\/)?(?:\s|$)/gi,
    /youtube\.com\/@[a-zA-Z0-9_\-]+/gi,
    /youtube\.com\/channel\/[a-zA-Z0-9_\-]+/gi,
    /youtube\.com\/user\/[a-zA-Z0-9_\-]+/gi,
    /(?:twitter|x)\.com\/(?!home|explore|hashtag|i\/|search|settings|notifications|messages|login|signup)[a-zA-Z0-9_]+/gi,
    /instagram\.com\/(?!p\/|reel\/|reels\/|explore\/|stories\/|ar\/|tv\/)[a-zA-Z0-9_.]+/gi,
    /(?:facebook|fb)\.com\/(?!groups\/|pages\/|events\/|watch|marketplace|gaming|fundraisers|ads|help|login|signup|share)[a-zA-Z0-9._\-]+/gi,
    /behance\.net\/[a-zA-Z0-9_\-]+/gi,
    /dribbble\.com\/[a-zA-Z0-9_\-]+/gi,
    /t\.me\/[a-zA-Z0-9_\-]+/gi,
    /wa\.me\/\d+/gi,
    /discord\.gg\/[a-zA-Z0-9]+/gi,
    /skype:[a-zA-Z0-9._\-]+\?(?:call|chat|add)/gi,
];

const MEETING_PATTERNS: RegExp[] = [
    // Google Meet
    /meet\.google\.com\/[a-zA-Z0-9\-]+/gi,

    // Zoom
    /zoom\.us\/j\/[0-9]+/gi,
    /zoom\.us\/my\/[a-zA-Z0-9._\-]+/gi,
    /zoom\.us\/s\/[0-9]+/gi,
    /zoom\.us\/w\/[0-9]+/gi,
    /us[0-9]*web\.zoom\.us\/j\/[0-9]+/gi,

    // Microsoft Teams
    /teams\.microsoft\.com\/l\/meetup-join\/[^\s]+/gi,
    /teams\.live\.com\/meet\/[a-zA-Z0-9]+/gi,

    // Webex (Cisco)
    /webex\.com\/meet\/[a-zA-Z0-9._\-]+/gi,
    /[a-zA-Z0-9]+\.webex\.com\/meet\/[a-zA-Z0-9._\-]+/gi,
    /[a-zA-Z0-9]+\.webex\.com\/join\/[a-zA-Z0-9._\-]+/gi,

    // GoToMeeting / join.me
    /gotomeet\.me\/[a-zA-Z0-9_\-]+/gi,
    /join\.me\/[a-zA-Z0-9_\-]+/gi,
    /gotomeeting\.com\/join\/[0-9]+/gi,

    // Jitsi Meet
    /meet\.jit\.si\/[a-zA-Z0-9_\-]+/gi,
    /jitsi\.org\/[a-zA-Z0-9_\-]+/gi,

    // Whereby / appear.in
    /whereby\.com\/[a-zA-Z0-9_\-]+/gi,
    /appear\.in\/[a-zA-Z0-9_\-]+/gi,

    // BlueJeans
    /bluejeans\.com\/[0-9]+/gi,

    // Skype meeting
    /join\.skype\.com\/[a-zA-Z0-9]+/gi,

    // Amazon Chime
    /chime\.aws\/[0-9]+/gi,

    // Loom
    /loom\.com\/share\/[a-zA-Z0-9]+/gi,

    // Calendly
    /calendly\.com\/[a-zA-Z0-9_\-]+/gi,

    // Dyte
    /dyte\.io\/meeting\/[a-zA-Z0-9_\-]+/gi,

    // 8x8
    /8x8\.vc\/[a-zA-Z0-9_\-]+/gi,

    // RingCentral
    /meetings\.ringcentral\.com\/[a-zA-Z0-9_\-]+/gi,

    // Generic meeting/join/room deep-link
    /https?:\/\/[^\s]+\/(?:meeting|join|room)\/[a-zA-Z0-9_\-]+/gi,
];

export type FilterResult =
    | { blocked: false }
    | { blocked: true; reason: string };

export function filterMessage(content: string): FilterResult {
    if (!content || typeof content !== "string") return { blocked: false };

    const text = content.trim();

    EMAIL_PATTERN.lastIndex = 0;
    if (EMAIL_PATTERN.test(text)) {
        EMAIL_PATTERN.lastIndex = 0;
        return {
            blocked: true,
            reason:
                "📧 Sharing email addresses is not allowed on this platform. Please communicate only through the platform.",
        };
    }

    for (const pattern of PROFILE_PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(text)) {
            pattern.lastIndex = 0;
            return {
                blocked: true,
                reason:
                    "🔗 Sharing profile links is not allowed on this platform. You can share normal website links.",
            };
        }
        pattern.lastIndex = 0;
    }

    for (const pattern of MEETING_PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(text)) {
            pattern.lastIndex = 0;
            return {
                blocked: true,
                reason:
                    "🎥 Meeting links share karna allowed nahi hai. Platform ke through hi kaam karein.",
            };
        }
        pattern.lastIndex = 0;
    }

    const phoneMatches = text.match(PHONE_PATTERN) || [];
    const realPhones = phoneMatches.filter((m) => m.replace(/\D/g, "").length >= 8);
    if (realPhones.length > 0) {
        return {
            blocked: true,
            reason:
                "📞 Contact number share karna is platform par allowed nahi hai. Platform ke through hi contact karein.",
        };
    }

    return { blocked: false };
}