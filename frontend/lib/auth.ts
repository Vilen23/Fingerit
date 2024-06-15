import axios from "axios";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const NEXT_AUTH = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
            { credentials }
          );
          if (response.status === 200) {
            return response.data;
          } else throw new Error("Invalid credentials");
        } catch (error) {
          throw new Error("Internal server error");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || " ",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || " ",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.id;
      return session;
    },
    async signIn(user: any) {
      if (user.account.provider === "google") {
        const { login, email, name } = user.profile;
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
            { username: name, email, password: login }
          );
          if (response.status === 200) {
            return true;
          }
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return false;
    },
  },
};
