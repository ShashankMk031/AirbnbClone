import Link from "next/link";

export default function BookingsPage() {
  const mockBookings = [
    {
      id: 1,
      listingTitle: "Luxury Beachfront Villa",
      location: "Malibu, California",
      startDate: "2026-07-20",
      endDate: "2026-07-25",
      totalPrice: 2895.0,
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      listingTitle: "Chic Loft in Downtown NYC",
      location: "New York, New York",
      startDate: "2026-06-10",
      endDate: "2026-06-12",
      totalPrice: 420.0,
      status: "cancelled",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Trips</h1>
      <p className="text-muted-foreground mt-2">Manage your current, upcoming, and past reservations.</p>

      {mockBookings.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl p-12 text-center mt-8">
          <h2 className="text-xl font-semibold mb-2">No trips booked... yet!</h2>
          <p className="text-muted-foreground mb-6">Time to dust off your bags and start planning your next adventure.</p>
          <Link href="/" className="bg-[#FF385C] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#E61E4D] transition">
            Start searching
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {mockBookings.map((booking) => (
            <div key={booking.id} className="border border-border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 hover:shadow-md transition">
              <div className="aspect-[4/3] w-full sm:w-48 overflow-hidden rounded-xl bg-muted shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.image}
                  alt={booking.listingTitle}
                  className="h-full w-full object-cover object-center"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{booking.location}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                      booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mt-1 text-foreground">{booking.listingTitle}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold text-foreground">Check-in</p>
                      <p>{booking.startDate}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Checkout</p>
                      <p>{booking.endDate}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-between items-baseline">
                  <div>
                    <span className="text-sm text-muted-foreground">Total Price: </span>
                    <span className="text-lg font-bold">${booking.totalPrice}</span>
                  </div>
                  {booking.status === "confirmed" && (
                    <button className="text-sm font-semibold text-primary hover:text-primary-dark transition underline">
                      Cancel reservation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
