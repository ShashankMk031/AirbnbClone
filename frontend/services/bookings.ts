import { request } from "./api";
import { Booking, BookingWithListing } from "../types/booking";

export interface CreateBookingInput {
  listing_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
}

export async function createBooking(data: CreateBookingInput, guestId?: number): Promise<Booking> {
  return request<Booking>("/bookings/", {
    method: "POST",
    params: guestId ? { guest_id: guestId } : undefined,
    body: JSON.stringify(data),
  });
}

export async function cancelBooking(id: number, guestId: number): Promise<Booking> {
  return request<Booking>(`/bookings/${id}/cancel`, {
    method: "PATCH",
    params: { guest_id: guestId },
  });
}

export async function getBooking(id: number): Promise<BookingWithListing> {
  return request<BookingWithListing>(`/bookings/${id}`, {
    method: "GET",
  });
}

export async function getUserBookings(userId: number): Promise<BookingWithListing[]> {
  return request<BookingWithListing[]>(`/users/${userId}/bookings`, {
    method: "GET",
  });
}
