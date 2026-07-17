import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tight">
          <span className="text-[#FF385C]">airbnb</span>
          <span className="text-xs bg-[#FF385C]/10 px-2 py-0.5 rounded-full uppercase font-semibold">clone</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">
            Explore
          </Link>
          <Link href="/wishlist" className="transition-colors hover:text-primary">
            Wishlist
          </Link>
          <Link href="/bookings" className="transition-colors hover:text-primary">
            Bookings
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold hover:bg-muted py-2 px-4 rounded-full transition">
            Become a host
          </button>
          <div className="flex items-center gap-2 border border-border rounded-full p-2 hover:shadow-md cursor-pointer transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-muted-foreground"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div className="w-8 h-8 rounded-full bg-muted-foreground flex items-center justify-center text-white text-xs font-semibold">
              U
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
