import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConfessHub - Anonymous Confessions & Stories",
  description: "Share your thoughts, confessions, and stories anonymously in a safe and supportive community.",
  keywords: "anonymous, confessions, stories, community, support, sharing",
  authors: [{ name: "ConfessHub Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-all duration-300">
            {children}
          </div>
          <Toaster 
            position="top-right" 
            richColors 
            closeButton 
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}