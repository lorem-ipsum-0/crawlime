import { and, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { BadRequestError } from "~/server/api-error";
import { db } from "~/server/db";
import { users, verificationTokens } from "~/server/db/schema";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token: string };
    const token = Buffer.from(body.token, "base64").toString("utf8");

    await db.transaction(async (tx) => {
      const [verifiedToken] = await tx
        .delete(verificationTokens)
        .where(and(eq(verificationTokens.token, token)))
        .returning();

      if (verifiedToken && verifiedToken.expires >= new Date()) {
        await tx
          .update(users)
          .set({ emailVerified: new Date() })
          .where(eq(users.id, verifiedToken.identifier));
      } else {
        throw new BadRequestError("Invalid token");
      }
    });

    return NextResponse.json({ data: { verified: true } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Cannot verify the user" });
  }
}
