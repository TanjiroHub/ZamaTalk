import "@/styles/globals.scss";

import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Zama FHEVM SDK Quickstart",
  description: "Zama FHEVM SDK Quickstart app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`text-foreground antialiased`}>
        <main className="flex flex-col max-w-screen-lg mx-auto min-w-[850px]">
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
