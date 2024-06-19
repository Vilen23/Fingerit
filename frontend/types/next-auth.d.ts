import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      words: {
        common_words: string[];
      };
    } & DefaultSession["user"];
  }
}
