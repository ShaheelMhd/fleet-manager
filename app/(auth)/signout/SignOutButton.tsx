"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

async function handleSignOut() {
  await signOut();
}

const SignOutButton = () => {
  return (
    <Link href="#" onClick={handleSignOut}>
      Sign out
    </Link>
  );
};

export default SignOutButton;
