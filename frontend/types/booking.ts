import { ListingSummary } from "./listing";

export interface Booking {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
  total_price: number;
  status: "CONFIRMED" | "CANCELLED";
  created_at: string;
}

export interface BookingWithListing extends Booking {
  listing: ListingSummary;
}
