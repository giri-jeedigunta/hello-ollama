import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"; // Added Playfair_Display font
import "./globals.css";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Add Playfair Display font
const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chef's Recipe Notebook",
  description: "Your AI Sous-Chef for Perfect Recipes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Import Playwrite AU SA font from Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playwrite+AU+SA:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable}`}
        suppressHydrationWarning
      >
        <Header />
        <div className="pt-24 w-full px-2 md:px-6">
          {children}
        </div>
        <div className="notebook-holes fixed top-0 bottom-0 left-12 z-10 pointer-events-none flex flex-col justify-around h-full">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-gray-300 rounded-full w-4 h-4 border border-gray-400 shadow-inner"
              style={{
                opacity: 0.7,
                backgroundColor: '#e8e2d3'
              }}
            />
          ))}
        </div>
      </body>
    </html>
  );
}
