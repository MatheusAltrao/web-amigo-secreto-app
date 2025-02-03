/* eslint-disable prettier/prettier */

import { FirestoreAdapter } from "@auth/firebase-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { firebaseCert } from "./firebase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: FirestoreAdapter({ credential: firebaseCert }),
  providers: [Google],
  events: {},
  callbacks: {},
});
