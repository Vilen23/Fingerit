import NextAuth from "next-auth/next";
import { NEXT_AUTH } from "@/lib/auth";

const handler = NextAuth(NEXT_AUTH);

export {handler as GET,handler as POST}