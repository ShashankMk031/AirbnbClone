export const dynamic = "force-dynamic";

import HostDashboardClient from "../../../components/host/HostDashboardClient";
import RoleGuard from "../../../components/common/RoleGuard";
import { getListings } from "../../../services/listings";

export default async function HostDashboardPage() {
  let listings: any[] = [];
  let errorMsg = null;

  try {
    // Fetch listings for Mock Host ID = 4 using the centralized API service
    const data = await getListings({ host_id: 4, page_size: 100 });
    listings = data.items;
  } catch (err: any) {
    errorMsg = err.message || "Failed to load listings from the server.";
  }

  return (
    <RoleGuard allowedRole="host">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {errorMsg ? (
          <div className="w-full text-center py-16 px-4 bg-rose-50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
            <h3 className="text-lg font-bold">Failed to load listings</h3>
            <p className="text-sm mt-1 max-w-md mx-auto opacity-90">
              {errorMsg}. Make sure the FastAPI backend server is running and try again.
            </p>
          </div>
        ) : (
          <HostDashboardClient listings={listings} />
        )}
      </div>
    </RoleGuard>
  );
}
