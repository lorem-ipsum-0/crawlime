import { hash } from "bcrypt-ts";
import { NextResponse } from "next/server";
import { InternalServerError } from "~/server/api-error";
import { createVerificationToken } from "~/server/auth/verify";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { sendVerificationEmail } from "~/server/email/verify";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email: string; password: string };

    const user = await db.transaction(async (tx) => {
      const createdUser = await tx
        .insert(users)
        .values({ email: body.email, password: await hash(body.password, 10) })
        .returning()
        .then(
          ([res]) =>
            res ??
            Promise.reject(new InternalServerError("Cannot create a user")),
        );

      const { token } = await createVerificationToken(
        { userId: createdUser.id },
        tx,
      );
      await sendVerificationEmail({ email: createdUser.email, token });

      return createdUser;
    });

    return NextResponse.json({ data: user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot create a user" });
  }
}
