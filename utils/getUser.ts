import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export async function getUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}
