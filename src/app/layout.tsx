import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Providers } from "./provider";

export const metadata: Metadata = {
  title: "Crawlime",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-slate-50 font-sans">
        <div className="container mx-auto h-screen">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
