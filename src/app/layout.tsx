"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Stack } from "@mui/material";
import SideLayout from "@/components/sidebar/SideLayout";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  
  // Hide SideLayout on /sign-in and /sign-up
  const shouldShowSideLayout = !["/sign-in", "/sign-up"].includes(pathname);

  return (
    <html lang="en">
      <title>Nowted</title>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <Stack direction="row" height="100vh" bgcolor="black">
            {shouldShowSideLayout && <SideLayout />}
            {children}
          </Stack>
        </QueryClientProvider>
      </body>
    </html>
  );
}