export interface HostSummary {
  id: number;
  full_name: string;
  avatar_url?: string | null;
}

export interface ListingSummary {
  id: number;
  title: string;
  location: string;
  price_per_night: number;
  property_type: string;
  rating: number;
  review_count: number;
  photos: string[];
  created_at: string;
}

export interface ListingDetail {
  id: number;
  host_id: number;
  host: HostSummary;
  title: string;
  description: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  price_per_night: number;
  property_type: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  photos: string[];
  rating: number;
  review_count: number;
  created_at: string;
  is_available?: boolean | null;
}

export interface PaginatedListings {
  items: ListingSummary[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}
