import Link from "next/link";
import { auth } from "~/server/auth";
import { Button } from "~/ui/button";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      {session ? (
        <>
          Signed in as {session.user.email} <br />
          <Button asChild>
            <Link href="/sign-out">Sign out</Link>
          </Button>
        </>
      ) : (
        <>
          Not signed in <br />
          <Button asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </>
      )}
    </main>
  );
}
