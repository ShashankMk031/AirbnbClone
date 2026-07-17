import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;

  // Static mock detail mapping
  const listingDetails = {
    id: Number(id) || 1,
    title: "Luxury Beachfront Villa in Malibu",
    location: "Malibu, California",
    description: "Experience the ultimate coastal getaway in this stunning modern beachfront villa. Located directly on the sand in Malibu, this home features floor-to-ceiling windows, an expansive oceanfront deck, and premium designer finishes throughout. Relax to the sound of breaking waves and enjoy breathtaking sunsets over the Pacific.",
    propertyType: "Entire Villa",
    pricePerNight: 550,
    rating: 4.95,
    reviewsCount: 124,
    amenities: ["Ocean view", "Direct beach access", "High-speed Wi-Fi", "Dedicated workspace", "Chef's kitchen", "Hot tub", "Air conditioning", "Free parking"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    ],
    hostName: "Sarah Connor",
    hostAvatar: "U"
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{listingDetails.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">★ {listingDetails.rating}</span>
            <span className="text-muted-foreground">•</span>
            <span className="underline cursor-pointer">{listingDetails.reviewsCount} reviews</span>
            <span className="text-muted-foreground">•</span>
            <span className="underline font-medium">{listingDetails.location}</span>
          </div>
          <div className="flex items-center gap-4 font-medium underline">
            <button className="flex items-center gap-1.5 hover:bg-muted py-1.5 px-3 rounded-md transition">Share</button>
            <button className="flex items-center gap-1.5 hover:bg-muted py-1.5 px-3 rounded-md transition">Save</button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mb-8">
        <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listingDetails.images[0]}
            alt={listingDetails.title}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </section>

      {/* Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="border-b border-border pb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{listingDetails.propertyType} hosted by {listingDetails.hostName}</h2>
              <p className="text-muted-foreground text-sm mt-1">8 guests • 4 bedrooms • 4 beds • 4.5 baths</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {listingDetails.hostAvatar}
            </div>
          </div>

          <div className="border-b border-border pb-6">
            <h3 className="text-xl font-bold mb-4">About this space</h3>
            <p className="text-muted-foreground leading-relaxed">{listingDetails.description}</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">What this place offers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listingDetails.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-foreground">
                  <span className="text-primary font-bold">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card Sticky Wrapper */}
        <div className="relative">
          <div className="border border-border rounded-2xl p-6 shadow-xl sticky top-28 bg-card">
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="text-2xl font-bold">${listingDetails.pricePerNight}</span>
                <span className="text-muted-foreground text-sm"> night</span>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium">
                <span>★ {listingDetails.rating}</span>
                <span className="text-muted-foreground">•</span>
                <span className="underline text-xs">{listingDetails.reviewsCount} reviews</span>
              </div>
            </div>

            {/* Date Overlap Check & Booking Form Mock */}
            <form className="space-y-4">
              <div className="border border-border rounded-xl">
                <div className="grid grid-cols-2 border-b border-border">
                  <div className="p-3">
                    <label className="block text-[10px] font-bold uppercase tracking-wider">Check-in</label>
                    <input type="date" className="w-full text-sm outline-none bg-transparent pt-1" defaultValue="2026-07-20" />
                  </div>
                  <div className="p-3 border-l border-border">
                    <label className="block text-[10px] font-bold uppercase tracking-wider">Checkout</label>
                    <input type="date" className="w-full text-sm outline-none bg-transparent pt-1" defaultValue="2026-07-25" />
                  </div>
                </div>
                <div className="p-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider">Guests</label>
                  <select className="w-full text-sm outline-none bg-transparent pt-1">
                    <option>1 guest</option>
                    <option>2 guests</option>
                    <option>3 guests</option>
                    <option>4 guests</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="w-full bg-[#FF385C] text-white font-semibold py-3 rounded-lg hover:bg-[#E61E4D] transition text-center block"
              >
                Reserve stay
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              You won&apos;t be charged yet
            </div>

            <div className="mt-6 pt-4 border-t border-border space-y-3 text-sm text-foreground">
              <div className="flex justify-between">
                <span className="underline">${listingDetails.pricePerNight} x 5 nights</span>
                <span>${listingDetails.pricePerNight * 5}</span>
              </div>
              <div className="flex justify-between">
                <span className="underline">Cleaning fee</span>
                <span>$85</span>
              </div>
              <div className="flex justify-between">
                <span className="underline">Airbnb service fee</span>
                <span>$60</span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t border-border">
                <span>Total before taxes</span>
                <span>${(listingDetails.pricePerNight * 5) + 85 + 60}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
