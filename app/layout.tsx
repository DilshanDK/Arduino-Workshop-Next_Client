import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Arduino Workshop — Build & Race | Innovior Kids Tech Academy",
  description: "Hands-on Arduino workshop for Grade 8–9 students. Build sensors, wire motors, code an IR remote car — all in one afternoon. Presented by Innovior Institute of Technology Studies, Kundasale, Kandy.",
  keywords: "arduino workshop, kids coding, robotics Sri Lanka, STEM education, Innovior, sensors, microcontroller",
  authors: [{ name: "Innovior Institute of Technology Studies" }],
  openGraph: {
    title: "Arduino Workshop — Build & Race",
    description: "One afternoon, four sensors, one motor driver, and a remote control car. Grade 8–9 Maker Lab.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Anti-flash: apply saved theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'light' || t === 'dark') {
                    document.documentElement.setAttribute('data-theme', t);
                  }
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
