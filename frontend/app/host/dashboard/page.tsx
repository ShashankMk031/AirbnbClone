import { execSync } from "child_process";
import path from "path";
import HostDashboardClient from "../../../components/host/HostDashboardClient";

export default async function HostDashboardPage() {
  let listings = [];
  let errorMsg = null;

  try {
    // Query local SQLite database directly to get host listings (Mock Host ID = 4)
    const dbPath = path.resolve(process.cwd(), "../backend/airbnb_clone.db");
    const query = "SELECT id, title, location, price_per_night, property_type, rating, review_count, photos, created_at FROM listings WHERE host_id = 4 ORDER BY created_at DESC;";
    const result = execSync(`sqlite3 -json "${dbPath}" "${query}"`).toString().trim();
    
    if (result) {
      const rawListings = JSON.parse(result);
      listings = rawListings.map((item: any) => {
        let photos: string[] = [];
        if (typeof item.photos === "string") {
          try {
            photos = JSON.parse(item.photos);
          } catch {
            // ignore
          }
        } else if (Array.isArray(item.photos)) {
          photos = item.photos;
        }

        return {
          id: Number(item.id),
          title: item.title,
          location: item.location,
          price_per_night: Number(item.price_per_night),
          property_type: item.property_type,
          rating: Number(item.rating),
          review_count: Number(item.review_count),
          photos,
          created_at: item.created_at
        };
      });
    }
  } catch (err: any) {
    errorMsg = err.message || "Failed to load listings from the database.";
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {errorMsg ? (
        <div className="w-full text-center py-16 px-4 bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
          <h3 className="text-lg font-bold">Failed to connect to database</h3>
          <p className="text-sm mt-1 max-w-md mx-auto opacity-90">
            {errorMsg}. Make sure the SQLite database exists at backend/airbnb_clone.db.
          </p>
        </div>
      ) : (
        <HostDashboardClient listings={listings} />
      )}
    </div>
  );
}
