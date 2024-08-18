import "~/styles/globals.css";
import { type Metadata } from "next";
import { Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { cn } from "~/ui/utils/cn";
import { ModeButton } from "./_components/mode-button";
import { Providers } from "./provider";

export const metadata: Metadata = {
  title: "Crawlime",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["cyrillic", "latin"],
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();

  return (
    <Providers>
      <html
        lang="en"
        style={
          { "--font-montserrat-sans": montserrat.style.fontFamily } as never
        }
      >
        <body
          className={cn(
            "min-h-screen bg-gradient-to-b from-background to-foreground/5 font-sans",
            {
              dark: cookieStore.get("crawlime.theme-mode")?.value === "dark",
            },
          )}
        >
          <header className="container flex items-center gap-2 py-4">
            <h1 className="text-3xl font-bold">
              <Link className="group flex items-center gap-2" href="/anime">
                <div className="flex h-4 w-6 flex-col items-center justify-center rounded-full border border-red-500 bg-foreground">
                  <div className="size-2 rounded-full bg-red-500"></div>
                </div>{" "}
                <span className="mb-1 inline-block leading-none">crawlime</span>
              </Link>
            </h1>
            <ModeButton className="ml-auto" />
          </header>
          {children}
        </body>
      </html>
    </Providers>
  );
}
