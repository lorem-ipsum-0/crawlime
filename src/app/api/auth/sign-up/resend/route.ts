import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { BadRequestError } from "~/server/api-error";
import { createVerificationToken } from "~/server/auth/verify";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { sendVerificationEmail } from "~/server/email/verify";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email: string };

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .then(
        ([res]) =>
          res ??
          Promise.reject(new BadRequestError("Cannot resend verification")),
      );

    await db.transaction(async (tx) => {
      const { token } = await createVerificationToken({ userId: user.id }, tx);
      await sendVerificationEmail({ email: user.email, token });
    });

    return NextResponse.json({ data: null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot verify the user" });
  }
}
