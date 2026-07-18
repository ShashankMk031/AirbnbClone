import { request } from "./api";
import { WishlistItem, WishlistListing } from "../types/wishlist";

export async function addWishlist(userId: number, listingId: number): Promise<WishlistItem> {
  return request<WishlistItem>("/wishlist/", {
    method: "POST",
    body: JSON.stringify({ user_id: userId, listing_id: listingId }),
  });
}

export async function removeWishlist(id: number): Promise<void> {
  return request<void>(`/wishlist/${id}`, {
    method: "DELETE",
  });
}

export async function getUserWishlist(userId: number): Promise<WishlistListing[]> {
  return request<WishlistListing[]>(`/users/${userId}/wishlist`, {
    method: "GET",
  });
}

export async function getUserWishlistIds(userId: number): Promise<Record<number, number>> {
  return request<Record<number, number>>(`/users/${userId}/wishlist-ids`, {
    method: "GET",
  });
}
