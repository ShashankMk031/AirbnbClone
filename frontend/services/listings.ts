import { request } from "./api";
import { ListingDetail, PaginatedListings } from "../types/listing";

export interface GetListingsParams {
  location?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  page_size?: number;
  sort_by?: "price_asc" | "price_desc" | "rating";
  host_id?: number;
}

export interface CreateListingInput {
  host_id: number;
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
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  location?: string;
  latitude?: number | null;
  longitude?: number | null;
  price_per_night?: number;
  property_type?: string;
  max_guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  photos?: string[];
}

export async function getListings(params: GetListingsParams = {}): Promise<PaginatedListings> {
  return request<PaginatedListings>("/listings/", {
    method: "GET",
    params: params as any,
  });
}

export async function getListing(
  id: number,
  checkIn?: string,
  checkOut?: string
): Promise<ListingDetail> {
  const params = checkIn && checkOut ? { check_in: checkIn, check_out: checkOut } : undefined;
  return request<ListingDetail>(`/listings/${id}`, {
    method: "GET",
    params,
  });
}

export async function createListing(data: CreateListingInput): Promise<ListingDetail> {
  return request<ListingDetail>("/listings/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateListing(
  id: number,
  hostId: number,
  data: UpdateListingInput
): Promise<ListingDetail> {
  return request<ListingDetail>(`/listings/${id}`, {
    method: "PUT",
    params: { host_id: hostId },
    body: JSON.stringify(data),
  });
}

export async function deleteListing(id: number, hostId: number): Promise<void> {
  return request<void>(`/listings/${id}`, {
    method: "DELETE",
    params: { host_id: hostId },
  });
}
