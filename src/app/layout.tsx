import "../styles/index.css";
import React from "react";
import SessionProviderWrapper from "./SessionProviderWrapper";
import Providers from "./providers";

export const metadata = {
  title: "Next.js with Tailwind CSS",
  description: "A boilerplate project with Next.js and Tailwind CSS",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ background: "#FAFBFC", color: "#1A1D23" }}>
        <SessionProviderWrapper>
          <Providers>
            {children}
          </Providers>
        </SessionProviderWrapper>

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
      </body>
    </html>
  );
}