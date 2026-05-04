import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";


export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
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
        const client = await clientPromise;
        const db = client.db();
        const dbUser = await db.collection("users").findOne({
          _id: new ObjectId(user.id),
        });
        if (dbUser?.isBlocked) {
          return "/sign-in-page?error=blocked";
        }
      } catch (e) { }
      return true;
    },

    async jwt({ token, user, trigger, session, account }: any) {
      const client = await clientPromise;
      const db = client.db();

      if (user) {
        token.id = user.id;

        const dbUser = await db.collection("users").findOne({
          _id: new ObjectId(user.id),
        });

        if (dbUser) {
          token.role = dbUser.role !== undefined ? dbUser.role : null;
        } else {
          token.role = null;
        }
      }

      if (trigger === "update" && session?.role && token.id) {
        token.role = session.role;

        await db.collection("users").updateOne(
          { _id: new ObjectId(token.id as string) },
          { $set: { role: session.role } }
        );
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string | null) ?? undefined;
      }
      return session;
    },

    async redirect({ url, baseUrl }: any) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl + "/sign-in-page";
    },
  },
};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
