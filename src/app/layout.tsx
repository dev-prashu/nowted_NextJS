"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Stack } from "@mui/material";
import SideLayout from "@/components/sidebar/SideLayout";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <title>Nowted</title>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <Stack direction="row" height="100vh">
            <SideLayout />
            {children}
          </Stack>
        </QueryClientProvider>
      </body>
    </html>
  );
}
