import type { Metadata } from "next";
import AppProvider from "./provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barangay Information Management System",
  description: "Complete barangay information management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased h-screen w-screen overflow-hidden">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
