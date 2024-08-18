"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SignOut() {
  useEffect(() => {
    signOut({ callbackUrl: "/sign-in" }).catch(console.error);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6">
      <p>See you soon</p>
    </div>
  );
}
