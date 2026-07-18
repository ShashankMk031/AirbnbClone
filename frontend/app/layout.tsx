import type { Metadata } from "next";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import MobileNavbar from "../components/common/MobileNavbar";
import { RoleProvider } from "../context/RoleContext";
import { ThemeProvider } from "../components/common/ThemeProvider";
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
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased transition-colors duration-300">
        <RoleProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <MobileNavbar />
            <Footer />
          </ThemeProvider>
        </RoleProvider>
      </body>
    </html>
  );
}
