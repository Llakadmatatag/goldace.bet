import type { Metadata } from "next";
import { Audiowide, Nunito } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import SignInButton from "./components/SignInButton";
import Footer from "./components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const audiowide = Audiowide({
  variable: "--font-audiowide",
  subsets: ["latin"],
  weight: ["400"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GoldAce | Next Level Affiliate Program",
  description: "Your All-in-One Hub for Leaderboards, Streams & Rewards. Use code GoldAce and level up your perks!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${audiowide.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <Sidebar />
          <SignInButton />
          <main className="flex-1 pt-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
