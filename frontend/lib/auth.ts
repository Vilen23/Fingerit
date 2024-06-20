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
            credentials
          );
          if (response.status === 201) {
            // console.log(response.data.user)
            return response.data.user;
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
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn(user: any) {
      if (user.account.provider === "google") {
        const { email, name } = user.profile;
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/signup/google`,
            { username: name, email, password: name }
          );
          if (response.status === 201) {
            console.log(response.data);
            return true; 
          }
        } catch (error) {
          console.log(error);
          return false; 
        }
      }
      return true;
    },
    async jwt({ token, user }: any) {
      if (user) {
        console.log(user);
        token.words = user.words;
        token.id = user.id;
        token.name = user.username || user.name;
        token.email = user.email;
      }

      return token;
    },
    async session({ token, session }: any) {
      session.user.words = token.words;
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
};
