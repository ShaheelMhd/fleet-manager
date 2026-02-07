import { supabase } from "@/utils/supabaseClient";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
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

        // Sign in with Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          console.error("Supabase auth error:", error?.message);
          return null;
        }

        if (!data.user.email_confirmed_at) {
          throw new Error("Please confirm your email before logging in.");
        }

        // Optionally still fetch from custom table if needed for additional metadata
        const { data: users } = await supabase.rpc(
          "get_next_auth_user_by_email",
          { email: credentials.email }
        );

        const customUser = users && users.length > 0 ? users[0] : null;

        return {
          id: data.user.id,
          email: data.user.email,
          name: customUser?.name || data.user.user_metadata?.name,
        };
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
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
};
