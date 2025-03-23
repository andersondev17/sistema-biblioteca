import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userName: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.userName || !credentials?.password) return null;

        const user = await db
          .select()
          .from(users)
          .where(eq(users.userName, credentials.userName.toString()))
          .limit(1);

        if (user.length === 0) return null;
        
        const isValid = await compare(
          credentials.password.toString(),
          user[0].password
        );

        if (!isValid) return null;

        return {
          id: user[0].id.toString(),
          name: user[0].userName,
          tipo: user[0].tipo
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tipo = user.tipo;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name || "",
        tipo: token.tipo
      };
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.AUTH_SECRET
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);