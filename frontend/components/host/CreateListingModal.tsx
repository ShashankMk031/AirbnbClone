"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createListing, CreateListingInput } from "../../services/listings";

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROPERTY_TYPES = ["Apartment", "Villa", "Cabin", "Farm Stay", "Beach House", "Treehouse"];
const STANDARD_AMENITIES = ["Wifi", "Kitchen", "Free Parking", "Air Conditioning", "Pool", "Beach Access"];

export default function CreateListingModal({ isOpen, onClose }: CreateListingModalProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [propertyType, setPropertyType] = useState(PROPERTY_TYPES[0]);
  const [maxGuests, setMaxGuests] = useState("2");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [photoUrl, setPhotoUrl] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Form Validation
    const price = Number(pricePerNight);
    const guests = Number(maxGuests);
    const beds = Number(bedrooms);
    const baths = Number(bathrooms);

    if (!title.trim()) return setErrorMsg("Title is required.");
    if (!description.trim()) return setErrorMsg("Description is required.");
    if (!location.trim()) return setErrorMsg("Location is required.");
    if (isNaN(price) || price <= 0) return setErrorMsg("Price per night must be greater than 0.");
    if (isNaN(guests) || guests <= 0) return setErrorMsg("Max guests must be greater than 0.");
    if (isNaN(beds) || beds < 0) return setErrorMsg("Bedrooms must be 0 or more.");
    if (isNaN(baths) || baths < 0) return setErrorMsg("Bathrooms must be 0 or more.");

    setLoading(true);

    const photos = photoUrl.trim() ? [photoUrl.trim()] : [];

    const inputData: CreateListingInput = {
      host_id: 4, // Mock host user ID 4
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      price_per_night: price,
      property_type: propertyType,
      max_guests: guests,
      bedrooms: beds,
      bathrooms: baths,
      amenities: selectedAmenities,
      photos,
    };

    try {
      await createListing(inputData);
      setLoading(false);
      onClose();
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err.message || "Failed to create listing. Please check connection and try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6">
        <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-3">
          <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Create a New Listing
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-full transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Modern Loft in Indiranagar"
              value={title}
              onChange={e => { setTitle(e.target.value); setErrorMsg(null); }}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Description
            </label>
            <textarea
              placeholder="Provide a detailed description of the space..."
              value={description}
              onChange={e => { setDescription(e.target.value); setErrorMsg(null); }}
              rows={3}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 resize-none"
              required
            />
          </div>

          {/* Location & Property Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore, KA"
                value={location}
                onChange={e => { setLocation(e.target.value); setErrorMsg(null); }}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type} value={type} className="dark:bg-zinc-950">
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Max Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Price per night (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 3500"
                value={pricePerNight}
                onChange={e => { setPricePerNight(e.target.value); setErrorMsg(null); }}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
                min={1}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Max Guests
              </label>
              <input
                type="number"
                value={maxGuests}
                onChange={e => { setMaxGuests(e.target.value); setErrorMsg(null); }}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
                min={1}
                required
              />
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={e => { setBedrooms(e.target.value); setErrorMsg(null); }}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
                min={0}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                value={bathrooms}
                onChange={e => { setBathrooms(e.target.value); setErrorMsg(null); }}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
                min={0}
                step={0.5}
                required
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Image Photo URL
            </label>
            <input
              type="url"
              placeholder="e.g. https://images.unsplash.com/photo-..."
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 py-2 px-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          {/* Amenities Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
              What amenities does this place offer?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STANDARD_AMENITIES.map(amenity => {
                const isSelected = selectedAmenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`py-1.5 px-3 border text-xs font-semibold rounded-xl text-center transition ${
                      isSelected
                        ? "bg-zinc-900 border-zinc-900 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900"
                        : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400"
                    }`}
                  >
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-semibold text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
              {errorMsg}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-zinc-200 hover:border-zinc-300 dark:bg-zinc-950 dark:border-zinc-800 hover:bg-zinc-50 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#FF385C] hover:bg-[#E61E4D] disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center"
            >
              {loading ? "Creating..." : "Create Listing"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
