import Link from "next/link";

export default function WishlistPage() {
  const mockWishlist = [
    {
      id: 2,
      title: "Modernist Forest A-Frame",
      location: "Catskills, New York",
      pricePerNight: 280,
      rating: 4.89,
      image: "https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 4,
      title: "Secluded Eco-Treehouse",
      location: "Volcano, Hawaii",
      pricePerNight: 320,
      rating: 4.97,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Wishlists</h1>
      <p className="text-muted-foreground mt-2">Your saved vacation rentals and places to stay.</p>

      {mockWishlist.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl p-12 text-center mt-8">
          <h2 className="text-xl font-semibold mb-2">Create your first wishlist</h2>
          <p className="text-muted-foreground mb-6">As you search, click the heart icon on your favorite places to save them here.</p>
          <Link href="/" className="bg-[#FF385C] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#E61E4D] transition">
            Find stays
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {mockWishlist.map((stay) => (
            <Link
              key={stay.id}
              href={`/listings/${stay.id}`}
              className="group cursor-pointer block"
            >
              <div className="flex flex-col gap-2">
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stay.image}
                    alt={stay.title}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-[#FF385C] p-1.5 rounded-full hover:scale-110 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                    {stay.location}
                  </h3>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <span>★</span>
                    <span>{stay.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{stay.title}</p>
                <p className="text-sm font-semibold mt-1">
                  ${stay.pricePerNight} <span className="font-normal text-muted-foreground">night</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
