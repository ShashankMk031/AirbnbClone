import Link from "next/link";

export default function HomePage() {
  // Static placeholders to present a high-fidelity visual design
  const featuredListings = [
    {
      id: 1,
      title: "Luxury Beachfront Villa",
      location: "Malibu, California",
      propertyType: "Entire Villa",
      pricePerNight: 550,
      rating: 4.95,
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 2,
      title: "Modernist Forest A-Frame",
      location: "Catskills, New York",
      propertyType: "Entire Cabin",
      pricePerNight: 280,
      rating: 4.89,
      image: "https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 3,
      title: "Industrial Loft with Skyline Views",
      location: "Brooklyn, New York",
      propertyType: "Entire Loft",
      pricePerNight: 195,
      rating: 4.78,
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: 4,
      title: "Secluded Eco-Treehouse",
      location: "Volcano, Hawaii",
      propertyType: "Treehouse",
      pricePerNight: 320,
      rating: 4.97,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero / Filter Categories */}
      <section className="mb-10 text-center max-w-2xl mx-auto mt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Find your next home away from home
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discover beautiful listings, book stays, and keep track of your favorites.
        </p>
      </section>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featuredListings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="group cursor-pointer block"
          >
            <div className="flex flex-col gap-2">
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                  {listing.location}
                </h3>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <span>★</span>
                  <span>{listing.rating}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{listing.title}</p>
              <p className="text-sm text-muted-foreground">{listing.propertyType}</p>
              <p className="text-sm font-semibold mt-1">
                ${listing.pricePerNight} <span className="font-normal text-muted-foreground">night</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
