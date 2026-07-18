import { ListingSummary } from "./listing";

export interface WishlistItem {
  id: number;
  user_id: number;
  listing_id: number;
  created_at: string;
}

export type WishlistListing = ListingSummary;
