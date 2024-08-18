import nodemailer from "nodemailer";
import { env } from "~/env";

export const gmail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.GMAIL_USER,
    pass: env.GMAIL_PASS,
  },
});
