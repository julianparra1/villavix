import "./globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import ConditionalHeader from "@/components/ConditionalHeader"
const inter = Inter({ subsets: ["latin"] });
import { usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: "VillaVix - Plataforma de Conexión Ciudadana",
  description: "Conectando ciudadanos y funcionarios para mejorar la comunidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head  />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 text-gray-800 dark:text-white">  
            <ConditionalHeader/>
            {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
