import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@lib/actions/user.prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt", // Using JWT sessions
  },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const user = await login(credentials);
          if (!user) {
            return null;
          }
          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.username = user.username;
        token.email = user.email;
        token.image = user.picture;
        token.longitude = user.longitude;
        token.latitude = user.latitude;
        token.kingdom = user.kingdom;
        token.bio = user.bio;
        token.about = user.about;
        token.department = user.department;
        token.level = user.level;
        token.gender = user.gender;
      }
      // console.log("JWT callback:", token);
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.longitude = token.longitude;
        session.user.latitude = token.latitude;
        session.user.kingdom = token.kingdom;
        session.user.about = token.about;
        session.user.bio = token.bio;
        session.user.department = token.department;
        session.user.level = token.level;
        session.user.gender = token.gender;
      }
      console.log("session after modification", session.user);
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
