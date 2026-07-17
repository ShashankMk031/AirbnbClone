import type { Metadata } from "next";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Airbnb Clone | Premium Vacation Rentals & Places to Stay",
  description: "Explore stays, wishlists, and bookings in a modern full-stack Airbnb Clone built with Next.js 15 and FastAPI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
