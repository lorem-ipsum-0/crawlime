import { eq, gt } from "drizzle-orm";
import { InternalServerError } from "../api-error";
import { type Db, db } from "../db";
import { verificationTokens } from "../db/schema";

export const createVerificationToken = async (
  { userId }: { userId: string },
  tx?: Db,
) => {
  return await (tx ?? db).transaction(async (stx) => {
    const [existingToken] = await stx
      .select()
      .from(verificationTokens)
      .where(gt(verificationTokens.expires, new Date()));

    if (existingToken) {
      return existingToken;
    }

    await stx
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, userId));

    const token = crypto.randomUUID();
    return await stx
      .insert(verificationTokens)
      .values({
        identifier: userId,
        token,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .returning()
      .then(
        ([res]) =>
          res ??
          Promise.reject(
            new InternalServerError("Unable to create verification token"),
          ),
      );
  });
};
