import React from 'react';
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: '--font-jakarta',
  display: 'swap',
});

const dancing = Dancing_Script({ 
  subsets: ["latin"], 
  variable: '--font-dancing',
  display: 'swap', 
});

export const metadata: Metadata = {
  title: "Velox Logistics - Global Shipping Solutions",
  description: "Modern, high-performance shipping and logistics platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dancing.variable}`}>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}