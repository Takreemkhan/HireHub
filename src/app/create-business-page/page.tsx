"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

export default function CreateBusinessPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  const [limitInfo, setLimitInfo] = useState<{ count: number; limit: number } | null>(null);

  // Real-time checking
  useEffect(() => {
    if (name.trim().length < 2) {
      setIsUnique(null);
      return;
    }
    setChecking(true);
    const delay = setTimeout(async () => {
      try {
        const res = await fetch(`/api/business-pages/check?name=${encodeURIComponent(name.trim())}`);
        const data = await res.json();
        setIsUnique(data.isUnique);
      } catch {
        setIsUnique(null);
      } finally {
        setChecking(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [name]);

  // Fetch current usage so we can warn if at limit
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/business-pages")
      .then((r) => r.json())
      .then((d) => {
        if (d.businessPages !== undefined) {
          setLimitInfo({ count: d.businessPages.length, limit: d.limit });
        }
      })
      .catch(() => {});
  }, [status]);

  // Redirect non-freelancers
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user || (session.user as any).role !== "freelancer") {
      router.replace("/");
    }
  }, [session, status, router]);

  const validate = async (): Promise<boolean> => {
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return false;
    }
    if (isUnique === false) {
      setError("This name is already taken.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!(await validate())) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/business-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      router.push(`/business-dashboard/${data.businessPage._id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white flex items-stretch pt-[80px]">
      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-12 py-4 xl:px-20">
        <div className="max-w-2xl w-full">
        {/* Heading */}
        <div className="mb-3">
          <h1 className="text-4xl font-bold text-[#2a528a] leading-tight mb-1">
            Create Your
          </h1>
          <h1 className="text-4xl font-bold text-[#FF6B35] leading-tight">
            Business Page
          </h1>
          <p className="mt-2 text-gray-600 text-base leading-relaxed max-w-sm">
            Build your presence as a business and start posting jobs,
            hiring talent, and growing your team.
          </p>
        </div>

        {/* Plan usage notice */}
        {limitInfo && (
          <div className="mb-3 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-600">
            Business pages:{" "}
            <span className="text-gray-900 font-semibold">
              {limitInfo.count} / {limitInfo.limit}
            </span>
            {limitInfo.count >= limitInfo.limit && (
              <span className="ml-2 text-[#FF6B35]">
                — Limit reached. Upgrade to Plus for more.
              </span>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <label className="block text-gray-900 font-semibold mb-1.5 text-sm tracking-wide">
            Business Page Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="Enter unique business page name"
            disabled={submitting || (limitInfo ? limitInfo.count >= limitInfo.limit : false)}
            className="w-full bg-white border border-gray-200 rounded-lg px-5 py-3 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#FF6B35] focus:ring-1 focus:ring-[#FF6B35] transition-all disabled:opacity-50"
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-gray-500 text-xs flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 9v5M10 6.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              This name must be unique and cannot be changed later.
            </p>
            {checking && <span className="text-gray-500 text-xs">Checking...</span>}
            {!checking && isUnique === true && <span className="text-green-500 text-xs font-semibold">✓ Name is available</span>}
            {!checking && isUnique === false && <span className="text-red-500 text-xs font-semibold">✗ Name already taken</span>}
          </div>

          {error && (
            <div className="mt-3 px-4 py-3 bg-red-900/30 border border-red-500/40 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !name.trim() || (limitInfo ? limitInfo.count >= limitInfo.limit : false)}
            className="mt-3 w-full bg-[#FF6B35] hover:bg-[#ff7f4f] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-200 text-base tracking-wide shadow-lg shadow-[#FF6B35]/20"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Business Page"
            )}
          </button>
        </form>

        {/* Features list */}
        <div>
          <h2 className="text-gray-900 font-bold text-base mb-2.5">Why create a Business Page?</h2>
          <div className="space-y-2.5">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#FF6B35]" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="7" width="18" height="14" rx="2" />
                    <path d="M8 7V5a4 4 0 018 0v2" />
                  </svg>
                ),
                title: "Post Jobs & Hire Top Talent",
                desc: "Access a wide pool of skilled professionals.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#FF6B35]" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="18" rx="2" />
                    <path d="M9 3v18M15 8h2M15 12h2M15 16h2" />
                  </svg>
                ),
                title: "Build Your Brand",
                desc: "Establish your business identity and reputation.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#FF6B35]" stroke="currentColor" strokeWidth="2">
                    <path d="M3 20l5-8 4 4 4-6 5 10" />
                  </svg>
                ),
                title: "Manage Projects Efficiently",
                desc: "Organize jobs, proposals, and team communication.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#FF6B35]" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "All From One Account",
                desc: "Use your freelancer account to manage your business.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:block lg:w-[50%] relative bg-[#FAFBFC] border-l border-gray-100 overflow-hidden">
        <Image
          src="/Business.png"
          alt="Business Page Dashboard Preview"
          fill
          className="object-contain object-center p-8 lg:p-12"
          priority
        />
      </div>
    </div>
    <FooterSection />
    </>
  );
}
