import "../styles/index.css";
import React from "react";
import SessionProviderWrapper from "./SessionProviderWrapper";
import Providers from "./providers";

export const metadata = {
  title: "HireHub – Find Top Freelancers & Remote Jobs",
  description: "Connect with skilled freelancers and quality clients. Post jobs, submit proposals, and get work done on HireHub.",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preconnect to key external domains for faster DNS/TLS handshake */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" />
      </head>
      <body style={{ background: "#FAFBFC", color: "#1A1D23" }}>
        <SessionProviderWrapper>
          <Providers>
            {children}
          </Providers>
        </SessionProviderWrapper>

        {/* Design-tool scripts — development only, never shipped to production */}
        {isDev && (
          <>
            <script
              type="module"
              async
              src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Ffreelanceh2246back.builtwithrocket.new&_be=https%3A%2F%2Fapplication.rocket.new&_v=0.1.12"
            />
            <script
              type="module"
              defer
              src="https://static.rocket.new/rocket-shot.js?v=0.0.2"
            />
          </>
        )}
      </body>
    </html>
  );
}