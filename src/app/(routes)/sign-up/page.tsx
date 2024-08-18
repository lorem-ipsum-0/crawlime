import { env } from "~/env";
import { SignUpForm } from "./_components/sign-up-form";
import { ResendForm } from "./_components/resend-form";
import Link from "next/link";

export default async function SignIn({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = searchParams;
  const verification = token
    ? await fetch(`${env.BASE_URL}/api/auth/sign-up/verify`, {
        method: "POST",
        body: JSON.stringify({ token }),
      })
        .then(
          (res) =>
            res.json() as Promise<{ data: { verified: true }; error: never }>,
        )
        .catch((error) => ({ error }) as { data: never; error: unknown })
    : null;

  return token ? (
    verification?.error ? (
      <ResendForm />
    ) : (
      <>
        Your email address was successfully verified. You can{" "}
        <Link href="/sign-in">sign-in</Link> now.
      </>
    )
  ) : (
    <SignUpForm />
  );
}
