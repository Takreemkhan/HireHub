"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // ── Form state ───────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"client" | "freelancer">("client");
  const [formError, setFormError] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  // ── OTP state ────────────────────────────────────────────────
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpSectionRef = useRef<HTMLDivElement>(null);

  // ── Redirect if already logged in ───────────────────────────
  useEffect(() => {
    if (session?.user?.role) {
      router.replace(session.user.role === "client" ? "/client" : "/freelancer");
    }
  }, [session, router]);

  // ── OTP countdown ────────────────────────────────────────────
  useEffect(() => {
    if (!showOTP) return;
    if (resendTimer > 0 && !canResend) {
      const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
      return () => clearTimeout(t);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend, showOTP]);

  // ── Scroll to OTP when it appears ───────────────────────────
  useEffect(() => {
    if (showOTP) {
      setTimeout(() => {
        otpSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [showOTP]);

  // ── Signup handler ───────────────────────────────────────────
  const handleSignup = async () => {
    setFormError("");
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setFormError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
      return;
    }
    setIsSigningUp(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword, role }),
      });
      const data = await res.json();
      if (data.success) {
        setShowOTP(true);
        setResendTimer(60);
        setCanResend(false);
      } else {
        setFormError(data.message || "Signup failed. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  // ── OTP handlers ─────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
    if (code.length < 6) { setOtpError("Please enter the complete 6-digit code."); return; }
    setIsVerifying(true);
    setOtpError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        router.replace(role === "client" ? "/client" : "/freelancer");
      } else {
        setOtpError(data.message || "Invalid code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setIsResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setCanResend(false);
        setResendTimer(60);
        inputRefs.current[0]?.focus();
      } else {
        setOtpError(data.message || "Failed to resend. Try again.");
      }
    } catch {
      setOtpError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // ── Loading screen ───────────────────────────────────────────
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
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>

          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Sign up
          </h1>

          <div className="flex flex-col gap-3 mb-5">
            <button
              onClick={() => signIn("google")}
              className="flex items-center justify-center w-full border border-gray-300 py-2.5 rounded hover:bg-gray-50 transition font-medium text-sm px-3 relative"
            >
              <FaGoogle className="text-red-500 absolute left-4 text-lg" />
              Continue with Google
            </button>
            <button
              onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center w-full border border-gray-300 py-2.5 rounded hover:bg-gray-50 transition font-medium text-sm px-3 relative"
            >
              <FaFacebook className="text-blue-600 absolute left-4 text-lg" />
              Continue with Facebook
            </button>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] bg-gray-300 flex-1"></div>
            <span className="text-xs font-bold text-gray-400 uppercase">OR</span>
            <div className="h-[1px] bg-gray-300 flex-1"></div>
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={showOTP}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={showOTP}
                className="w-1/2 px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={showOTP}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={showOTP}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={showOTP}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none transition disabled:bg-gray-50 disabled:text-gray-400"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => !showOTP && setRole("client")}
                disabled={showOTP}
                className={`flex-1 flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm
                  ${role === "client"
                    ? " bg-brand-blue text-[white]"
                    : " bg-white  hover:bg-brand-blue hover:text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>I'm Hiring Talent</span>
                </div>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => !showOTP && setRole("freelancer")}
                disabled={showOTP}
                className={`flex-1 flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm
                  ${role === "freelancer"
                    ? " bg-accent text-white "
                    : " bg-white text-gray-700 "
                  } disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-accent hover:text-white shadow-brand hover:shadow-brand-lg hover:scale-105
                  `}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>I'm a Freelancer</span>
                </div>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-start gap-2 mt-2">
              <input type="checkbox" id="terms" className="mt-1 accent-blue-600" />
              <label htmlFor="terms" className="text-[12px] text-gray-600 leading-snug mt-1">
                I agree to the Freelancer{" "}
                <Link href="#" className="text-[#FF6B35] hover:underline">User Agreement</Link>{" "}
                and{" "}
                <Link href="#" className="text-[#FF6B35] hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Form error */}
            {formError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-600">{formError}</p>
              </div>
            )}

            {/* Join button — OTP aane ke baad hide */}
            {!showOTP && (
              <button
                type="button"
                onClick={handleSignup}
                disabled={isSigningUp}
                className="w-full bg-[#FF6B35] text-white font-bold py-3.5 rounded mt-2 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
              >
                {isSigningUp ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>Join FreelancerHub <span className="text-[#4299E1]">Pro</span></>
                )}
              </button>
            )}
          </form>

          {/* ── OTP Section — same page pe neeche ── */}
          {showOTP && (
            <div ref={otpSectionRef} className="mt-6 pt-6 border-t border-dashed border-gray-300">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-lg font-semibold text-center text-gray-800 mb-1">
                Verify your email
              </h2>
              <p className="text-sm text-gray-500 text-center mb-5">
                We&apos;ve sent a 6-digit code to{" "}
                <span className="font-semibold text-gray-700">{email}</span>
              </p>

              {/* OTP inputs */}
              <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg outline-none transition-all
                      ${otpError
                        ? "border-red-400 bg-red-50"
                        : digit
                        ? "border-[#FF6B35] bg-orange-50"
                        : "border-gray-300"
                      }
                      focus:border-[#FF6B35] focus:ring-2 focus:ring-orange-100`}
                  />
                ))}
              </div>

              {/* OTP error */}
              {otpError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-600">{otpError}</p>
                </div>
              )}

              {/* Verify button */}
              <button
                onClick={handleVerify}
                disabled={otp.join("").length < 6}
                className="w-full bg-[#FF6B35] text-white font-bold py-3.5 rounded mb-3 flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
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
                    Resend in <span className="font-semibold text-gray-600">{resendTimer}s</span>
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="mt-4 text-center border-t border-gray-100 pt-6">
            <p className="text-xs text-gray-500 mb-2 leading-relaxed px-2">
              This site is protected by reCAPTCHA and the Google{" "}
              <Link href="#" className="underline">Privacy Policy</Link>{" "}
              and{" "}
              <Link href="#" className="underline">Terms of Service</Link>{" "}
              apply.
            </p>
            <p className="text-sm text-gray-700">
              Already have an account?{" "}
              <Link href="/sign-in-page" className="text-[#FF6B35] font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}