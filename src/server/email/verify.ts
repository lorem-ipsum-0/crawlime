import Email from "~/emails/sign-up-verify";
import { gmail } from "../mailer";
import { render } from "@react-email/render";
import { createElement } from "react";

export const sendVerificationEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  return await gmail.sendMail({
    from: "crawlime@gmail.com",
    to: email,
    subject: "Verify email",
    html: render(
      createElement(Email, { token: Buffer.from(token).toString("base64") }),
    ),
  });
};
