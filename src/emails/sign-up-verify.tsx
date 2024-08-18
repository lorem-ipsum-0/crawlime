import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
} from "@react-email/components";

export default function Email({ token }: { token: string }) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="m-auto bg-white p-2 font-sans">
          <Container className="mx-auto">
            <Section className="text-center">
              <Button
                className="rounded-lg border border-slate-800 bg-slate-800 p-2 text-white hover:bg-slate-900"
                href={`http://localhost:3000/sign-up?token=${token}`}
              >
                Click here to verify your email
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
