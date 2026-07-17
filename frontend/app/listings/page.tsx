import Link from "next/link";

export default function ListingsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Explore All Listings</h1>
      <p className="text-muted-foreground mt-2">
        Find beautiful places to stay and things to do.
      </p>
      <div className="mt-8">
        <Link href="/" className="bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/95 transition">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
