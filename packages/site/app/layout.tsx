import "@/styles/globals.scss";

import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ZamaTalk",
  description: "ZamaTalk"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/zama-talk.svg" />
      </head>
      <body className={`h-screen text-foreground antialiased`}>
        <main className="h-full w-full flex flex-col">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
