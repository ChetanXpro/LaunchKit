import connectDB from "@/configs/dbConfig/dbConfig";
import clientPromise from "@/configs/mongodbClient";
import Users from "@/models/user";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import type { NextAuthOptions } from "next-auth";
import Credentials, {
  CredentialsProvider,
} from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcryptjs";
import { isDotDotDotToken } from "typescript";

export const options: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", placeholder: "jsmith" },
        password: { label: "Password", placeholder: "password" },
      },

      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        await connectDB();

        const foundUser = await Users.findOne({ email: credentials.email });

        if (!foundUser) {
          return null;
        }
        const isMatch = await bcrypt.compare(
          credentials.password,
          foundUser.password
        );

        if (!isMatch) {
          return null;
        } else {
          return foundUser;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
    verifyRequest: "/verifymail",
  },
};

// export const options: NextAuthOptions = {
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     EmailProvider({
//       server: {
//         host: process.env.SMPT_HOST,
//         port: process.env.SMPT_PORT,
//         auth: {
//           user: process.env.SMPT_USER,
//           pass: process.env.SMPT_PASSWORD,
//         },
//       },
//       from: process.env.SMPT_USER,
//     }),
//   ],
// };
