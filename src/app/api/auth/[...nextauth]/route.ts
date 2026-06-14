import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import fs from "fs";

function logToFile(type: string, message: any, metadata?: any) {
  try {
    const logPath = "./nextauth_debug.log";
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      type,
      message: message instanceof Error ? message.message : message,
      stack: message instanceof Error ? message.stack : undefined,
      metadata: metadata ? (metadata instanceof Error ? { message: metadata.message, stack: metadata.stack } : metadata) : undefined
    }) + "\n";
    fs.appendFileSync(logPath, logEntry);
  } catch (err) {
    console.error("Failed to write to log file", err);
  }
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  debug: true,

  logger: {
    error(code: any, metadata: any) {
      logToFile("NEXTAUTH-ERROR", code, metadata);
    },
    warn(code: any) {
      logToFile("NEXTAUTH-WARN", code);
    },
    debug(code: any, metadata: any) {
      logToFile("NEXTAUTH-DEBUG", code, metadata);
    }
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember Me", type: "boolean" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db();

          const user = await db.collection("users").findOne({
            email: credentials.email
          });

          if (!user) {
            return null;
          }

          if (user.isBlocked) {
            throw new Error("BLOCKED");
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || null,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          logToFile("credentials-authorize-error", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in-page",
  },

  callbacks: {
    async signIn({ user, account }: any) {
      try {
        logToFile("signIn-start", { user, account });
        const client = await clientPromise;
        const db = client.db();
        const query = ObjectId.isValid(user.id)
          ? { _id: new ObjectId(user.id) }
          : { email: user.email };
        const dbUser = await db.collection("users").findOne(query);
        if (dbUser?.isBlocked) {
          logToFile("signIn-blocked", { user, dbUser });
          return "/sign-in-page?error=blocked";
        }
        logToFile("signIn-success", { user });
      } catch (e: any) {
        logToFile("signIn-error", e);
        console.error("Error in signIn callback:", e);
      }
      return true;
    },

    async jwt({ token, user, trigger, session, account }: any) {
      try {
        logToFile("jwt-start", { token, user, trigger, session, account });
        const client = await clientPromise;
        const db = client.db();

        if (user) {
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;

          try {
            const query = ObjectId.isValid(user.id)
              ? { _id: new ObjectId(user.id) }
              : { email: user.email };
            const dbUser = await db.collection("users").findOne(query);

            if (dbUser) {
              token.role = dbUser.role !== undefined ? dbUser.role : null;
              token.id = dbUser._id.toString();
            } else {
              token.role = null;
            }
            logToFile("jwt-user-added", { token });
          } catch (e: any) {
            logToFile("jwt-user-error", e);
            console.error("Error in jwt callback:", e);
            token.role = null;
          }
        }

        if (trigger === "update" && session?.role && token.id) {
          token.role = session.role;

          try {
            const query = ObjectId.isValid(token.id as string)
              ? { _id: new ObjectId(token.id as string) }
              : { email: token.email };
            await db.collection("users").updateOne(
              query,
              { $set: { role: session.role } }
            );
            logToFile("jwt-update-success", { tokenId: token.id, role: session.role });
          } catch (e: any) {
            logToFile("jwt-update-error", e);
            console.error("Error updating user role in jwt callback:", e);
          }
        }
      } catch (err: any) {
        logToFile("jwt-callback-error", err);
      }

      return token;
    },

    async session({ session, token }: any) {
      try {
        logToFile("session-start", { session, token });
        if (session.user) {
          session.user.id = token.id as string;
          session.user.name = token.name as string;
          session.user.email = token.email as string;
          session.user.role = (token.role as string | null) ?? undefined;
        }
        logToFile("session-success", { session });
      } catch (err: any) {
        logToFile("session-callback-error", err);
      }
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      logToFile("redirect", { url, baseUrl });
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl + "/sign-in-page";
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
