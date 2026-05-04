"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  const userEmail = session?.user?.email ?? "";

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    if (!userEmail) {
      setError("Session expired. Please sign up again.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // API expects: { email, otp }
        body: JSON.stringify({ email: userEmail, otp: code }),
      });

      const data = await res.json();

      if (data.success) {
        setVerified(true);
        setTimeout(() => {
          const redirectPath = session?.user?.role === "client" ? "/client" : "/freelancer";
          console.log(redirectPath)
          router.replace(redirectPath);
        }, 2000);
      } else {
        setError(data.message || "Invalid code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !userEmail) return;
    setIsResending(true);

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setCanResend(false);
        setResendTimer(60);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || "Failed to resend. Try again.");
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Success state
  if (verified) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F7FA]">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-800">Email Verified!</p>
          <p className="text-sm text-gray-500 mt-1">Redirecting you now...</p>
        </div>
      </div>
    );
  }

  // Verifying loader
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F7FA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#F3F7FA] justify-center items-center py-14">
      <section className="flex flex-col items-center justify-center w-full max-w-[500px] bg-white px-8 py-10 rounded-xl border border-gray-200 shadow-sm mx-4">
        <div className="w-full max-w-[380px]">

          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>

          {/* Email icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
            Verify your email
          </h1>
          <p className="text-sm text-gray-500 text-center mb-7">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="font-semibold text-gray-700">
              {userEmail || "your email"}
            </span>
            . Enter it below to verify your account.
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 mb-5" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-12 text-center text-xl font-bold border rounded-lg outline-none transition-all
                  ${error
                    ? "border-red-400 bg-red-50"
                    : digit
                    ? "border-[#FF6B35] bg-orange-50"
                    : "border-gray-300"
                  }
                  focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100`}
              />
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.join("").length < 6}
            className="w-full bg-[#FF6B35] text-white font-bold py-3.5 rounded mt-1 mb-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e85e2a] transition"
          >
            Verify Email
          </button>

          {/* Resend */}
          <p className="text-sm text-center text-gray-600">
            Didn&apos;t receive a code?{" "}
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-[#FF6B35] font-semibold hover:underline disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend code"}
              </button>
            ) : (
              <span className="text-gray-400">
                Resend in{" "}
                <span className="font-semibold text-gray-600">{resendTimer}s</span>
              </span>
            )}
          </p>

          {/* Bottom link */}
          <div className="mt-6 text-center border-t pt-6">
            <p className="text-sm text-gray-700">
              Wrong account?{" "}
              <Link href="/sign-up-page" className="text-[#FF6B35] font-semibold">
                Sign up again
              </Link>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}