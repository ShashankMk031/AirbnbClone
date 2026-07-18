export interface Review {
  id: number;
  listing_id: number;
  author_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface PaginatedReviews {
  items: Review[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}
