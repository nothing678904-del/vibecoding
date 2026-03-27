import type { Metadata } from "next";
import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SoundProvider } from "@/providers/SoundProvider";
import { GasProvider } from "@/providers/GasProvider";
import { ScrollProvider } from "@/providers/ScrollProvider";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "GasMood",
  description: "Feel Ethereum gas stress in real-time.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} text-slate-50 bg-[#101217] antialiased min-h-screen`}>
        <ThemeProvider>
          <SoundProvider>
            <GasProvider>
              <ScrollProvider>
                {children}
                <Analytics />
              </ScrollProvider>
            </GasProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
