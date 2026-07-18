import { request } from "./api";
import { Review, PaginatedReviews } from "../types/review";

export interface CreateReviewInput {
  listing_id: number;
  author_id: number;
  rating: number;
  comment: string;
}

export async function createReview(data: CreateReviewInput): Promise<Review> {
  return request<Review>("/reviews/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getListingReviews(
  listingId: number,
  page?: number,
  pageSize?: number
): Promise<PaginatedReviews> {
  const params: Record<string, number> = {};
  if (page) params.page = page;
  if (pageSize) params.page_size = pageSize;

  return request<PaginatedReviews>(`/listings/${listingId}/reviews`, {
    method: "GET",
    params,
  });
}
