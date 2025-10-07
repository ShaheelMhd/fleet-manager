import { supabase } from "@/utils/supabaseClient";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: users, error } = await supabase.rpc(
          "get_next_auth_user_by_email",
          { email: credentials.email }
        );

        if (error || !users || users.length === 0) return null;

        const user = users[0];

        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password!
        );

        return passwordsMatch ? user : null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};
