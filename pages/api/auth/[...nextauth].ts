import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
   },
  callbacks: {
    // @ts-ignore
    async signIn({ account, profile }) {
      if (account.provider === "google") {
        //Check emails exists
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });
        if (!existingUser) {
          //User does not exist, create a new user with the profile data
          const newUser = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            },
          });
        }
      }
      return true;
    },
  },
};
// @ts-ignore
export default NextAuth(authOptions);
