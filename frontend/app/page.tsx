import HomeSearchBar from "../components/listings/HomeSearchBar";
import FilterBar from "../components/listings/FilterBar";
import ListingGrid from "../components/listings/ListingGrid";
import Pagination from "../components/listings/Pagination";
import { getListings, GetListingsParams } from "../services/listings";
import { getUserWishlistIds } from "../services/wishlist";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function HomePage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;

  // Extract query parameters with defensive string type checks
  const location = typeof resolvedSearchParams.location === "string" ? resolvedSearchParams.location : undefined;
  const check_in = typeof resolvedSearchParams.check_in === "string" ? resolvedSearchParams.check_in : undefined;
  const check_out = typeof resolvedSearchParams.check_out === "string" ? resolvedSearchParams.check_out : undefined;
  
  const guestsRaw = resolvedSearchParams.guests;
  const guests = guestsRaw ? Number(guestsRaw) : undefined;

  const property_type = typeof resolvedSearchParams.property_type === "string" ? resolvedSearchParams.property_type : undefined;

  const minPriceRaw = resolvedSearchParams.min_price;
  const min_price = minPriceRaw ? Number(minPriceRaw) : undefined;

  const maxPriceRaw = resolvedSearchParams.max_price;
  const max_price = maxPriceRaw ? Number(maxPriceRaw) : undefined;

  const sort_by = typeof resolvedSearchParams.sort_by === "string" ? resolvedSearchParams.sort_by as any : undefined;

  const pageRaw = resolvedSearchParams.page;
  const page = pageRaw ? Number(pageRaw) : 1;
  const page_size = 12; // Grid-friendly layout page size

  const params: GetListingsParams = {
    location,
    check_in,
    check_out,
    guests,
    property_type,
    min_price,
    max_price,
    sort_by,
    page,
    page_size,
  };

  let data = null;
  let errorMsg = null;

  try {
    data = await getListings(params);
  } catch (err: any) {
    errorMsg = err.message || "Failed to load listings from the server.";
  }

  let wishlistMap: Record<number, number> = {};
  try {
    wishlistMap = await getUserWishlistIds(4);
  } catch (err) {
    console.error("Failed to load wishlist mapping:", err);
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero Header Banner */}
      <section className="text-center max-w-3xl mx-auto mt-6 mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Find your next home away from home
        </h1>
        <p className="mt-4 text-base text-zinc-500 dark:text-zinc-400">
          Discover unique spaces, beachfront villas, cozy cabins, and Portuguese heritage stays.
        </p>
      </section>

      {/* Filter Options & Search Container */}
      <HomeSearchBar />
      <FilterBar />

      {/* Grid or Server Error fallback state */}
      {errorMsg ? (
        <div className="w-full text-center py-16 px-4 bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 mx-auto mb-4 text-rose-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <h3 className="text-lg font-bold">Failed to connect to host</h3>
          <p className="text-sm mt-1 max-w-md mx-auto opacity-90">
            {errorMsg}. Make sure the FastAPI backend server is running and try again.
          </p>
        </div>
      ) : data ? (
        <>
          <ListingGrid listings={data.items} wishlistMap={wishlistMap} />
          <Pagination currentPage={data.page} totalPages={data.total_pages} />
        </>
      ) : null}
    </div>
  );
}
