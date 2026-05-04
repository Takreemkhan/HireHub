"use client";
import { useEffect } from "react";

export default function AuthCallback() {
  useEffect(() => {
    // Signal the opener that auth is complete, then close
    if (window.opener) {
      window.opener.postMessage({ type: "AUTH_COMPLETE" }, window.location.origin);
      window.close();
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Completing sign in...</p>
    </div>
  );
}