"use client";

import React, { useState, useEffect, Suspense } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/ui/Logo";

// ============================================================
// 🔐 AES-GCM Encryption helpers (Web Crypto API - browser built-in)
// Password browser mein sirf encrypted ciphertext ke roop mein stored hota hai
// ============================================================
const CRYPTO_KEY_MATERIAL = "flh-rmb-k-v1"; // key seed — change to invalidate old stored data

async function getDerivedKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(CRYPTO_KEY_MATERIAL),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode("flh-salt-v1"), iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptPassword(plain: string): Promise<string> {
  const key = await getDerivedKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plain);
  const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
  // iv + ciphertext ko base64 mein pack karo
  const combined = new Uint8Array(iv.byteLength + cipherBuf.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuf), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

async function decryptPassword(cipherB64: string): Promise<string | null> {
  try {
    const key = await getDerivedKey();
    const combined = Uint8Array.from(atob(cipherB64), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const cipherBuf = combined.slice(12);
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipherBuf);
    return new TextDecoder().decode(plainBuf);
  } catch {
    return null; // tampered ya invalid data
  }
}
// ============================================================

function SigninPageContent() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [role, setRole] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ Remember Me: Page load pe saved email + encrypted password restore karo
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedCipher = localStorage.getItem("rememberedPwdEnc");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedCipher) {
      decryptPassword(savedCipher).then((plain) => {
        if (plain) setPassword(plain);
      });
    }
  }, []);

  // Check if redirected here due to block
  useEffect(() => {
    if (searchParams.get("error") === "blocked") {
      setLoginError("🚫 Your account has been blocked by the admin. Please contact support.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user) {
      const userRole = session.user.role;
      localStorage.setItem("role", userRole!);
      if (userRole && userRole !== null && userRole !== "null") {
        const redirectUrl = sessionStorage.getItem("redirectAfterLogin");

        if (redirectUrl) {
          sessionStorage.removeItem("redirectAfterLogin");
          router.replace(redirectUrl);
        } else {
          const redirectPath =
            userRole === "client" ? "/client-dashboard" : "/freelancer-dashboard";
          router.replace(redirectPath);
        }
      } else {
        setShowRoleModal(true);
        setIsProcessing(false);
      }
    } else {
      setShowRoleModal(false);
      setIsProcessing(false);
    }
  }, [session, status, router]);

  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    try {
      await signIn("google", { redirect: false });
    } catch (error) {
      console.error("Google login error:", error);
      setIsProcessing(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsProcessing(true);
    try {
      await signIn("facebook", { redirect: false });
    } catch (error) {
      console.error("Facebook login error:", error);
      setIsProcessing(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setLoginError("Please fill in all fields");
      return;
    }

    setIsProcessing(true);
    setLoginError("");

    try {
      // ✅ Pehle block check karo
      const checkRes = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const checkData = await checkRes.json();

      if (checkData.isBlocked) {
        setLoginError(
          "🚫 Your account has been blocked by the admin. Please contact support."
        );
        setIsProcessing(false);
        return;
      }

      // ✅ Remember Me: Email plain text, Password AES-GCM encrypted store karo
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        const cipher = await encryptPassword(password);
        localStorage.setItem("rememberedPwdEnc", cipher); // browser mein sirf gibberish dikhega
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPwdEnc");
        sessionStorage.removeItem("rememberedPassword");
      }

      // ✅ remember ko String mein convert karke pass karo
      // NextAuth credentials provider mein sab kuch string hota hai
      const result = await signIn("credentials", {
        email,
        password,
        remember: String(rememberMe), // ✅ FIX: "true" ya "false" string
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          setLoginError("Invalid email or password");
        } else {
          setLoginError(result.error || "Login failed. Please try again.");
        }
        setIsProcessing(false);
      } else if (result?.ok) {
        // useEffect handle karega redirect
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Email login error:", error);
      setLoginError("An error occurred during login");
      setIsProcessing(false);
    }
  };

  const handleContinueWithRole = async () => {
    if (!role || !session) return;

    setIsProcessing(true);

    try {
      await update({ role });
      // The useEffect will handle the redirect after role is updated
    } catch (error) {
      console.error("Error updating role:", error);
      setIsProcessing(false);
      alert("Failed to set role. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  if ((status === "loading" || isProcessing) && !showRoleModal) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F3F7FA]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            {status === "loading" ? "Loading..." : "Signing you in..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="flex min-h-screen bg-[#F3F7FA] justify-center items-center py-14">
        <section className="flex flex-col items-center justify-center w-full max-w-[500px] bg-white px-8 py-10 rounded-xl border border-gray-200 shadow-sm mx-4">
          <div className="w-full max-w-[380px]">
            <div className="mb-6 flex justify-center">
              <Logo />
            </div>

            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Sign in
            </h1>

            {/* Blocked / Error Message */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-center font-medium">
                {loginError}
              </div>
            )}

            <div className="flex flex-col gap-3 mb-5">
              <button
                onClick={handleGoogleLogin}
                disabled={isProcessing}
                className="flex items-center justify-center w-full border border-gray-300 py-2.5 rounded hover:bg-gray-50 transition font-medium text-sm px-3 relative disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaGoogle className="text-red-500 absolute left-4 text-lg" />
                Continue with Google
              </button>

              <button
                onClick={handleFacebookLogin}
                disabled={isProcessing}
                className="flex items-center justify-center w-full border border-gray-300 py-2.5 rounded hover:bg-gray-50 transition font-medium text-sm px-3 relative disabled:opacity-50 disabled:cursor-not-allowed"
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

            <form className="flex flex-col gap-4" onSubmit={handleEmailLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none transition"
                disabled={isProcessing}
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-500 outline-none transition"
                  disabled={isProcessing}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <div className="flex justify-between mt-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mt-1 accent-blue-600"
                  />
                  <label htmlFor="remember" className="text-sm">
                    Remember Me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#FF6B35] text-white font-bold py-3.5 rounded mt-2 transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="mt-4 text-center border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-500 mb-2 leading-relaxed px-2">
                This site is protected by reCAPTCHA and the Google{" "}
                <Link href="#" className="underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="#" className="underline">
                  Terms & Conditions
                </Link>{" "}
                apply.
              </p>

              <p className="text-sm text-gray-700">
                Don't have an account?{" "}
                <Link
                  href="/sign-up-page"
                  className="text-[#FF6B35] font-semibold hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ROLE SELECTION MODAL */}
      {showRoleModal && session?.user && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white w-[400px] rounded-xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-center mb-2 text-gray-800">
              Login as
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Choose how you want to use FreelanceHub Pro
            </p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setRole("freelancer")}
                className={`flex-1 py-4 rounded-lg border-2 font-semibold transition-all ${role === "freelancer"
                  ? "border-[#FF6B35] bg-[#FF6B35] text-white shadow-lg scale-105"
                  : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
              >
                I'm Freelancer
              </button>

              <button
                onClick={() => setRole("client")}
                className={`flex-1 py-4 rounded-lg border-2 font-semibold transition-all ${role === "client"
                  ? "border-[#FF6B35] bg-[#FF6B35] text-white shadow-lg scale-105"
                  : "border-gray-300 hover:border-gray-400 text-gray-700"
                  }`}
              >
                I'm Hiring
              </button>
            </div>

            <button
              disabled={!role || isProcessing}
              onClick={handleContinueWithRole}
              className={`w-full py-3.5 rounded-lg font-bold transition-all ${role && !isProcessing
                ? "bg-gray-800 hover:bg-gray-900 text-white hover:scale-105 shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Setting up...
                </span>
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SigninPageContent />
    </Suspense>
  );
}