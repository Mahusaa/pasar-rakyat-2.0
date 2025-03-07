import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "~/components/ui/sonner";
import { UserProvider } from "~/server/auth";
import { getUser } from "~/server/db/queries";

export const metadata: Metadata = {
  title: "Pasar Rakyat 2.0",
  description: "Pasar Rakyat by Gradasi FUSI FTUI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //eslint-disable-next-line
  let userPromise = getUser().then((user) => user ?? null);
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-white h-screen flex flex-col">
        <UserProvider userPromise={userPromise}>
          {children}
          <Toaster position="top-center" />
        </UserProvider>
      </body>
    </html >
  );
}
