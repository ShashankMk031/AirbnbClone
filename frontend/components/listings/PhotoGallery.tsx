import Image from "next/image";

interface PhotoGalleryProps {
  photos: string[];
  title: string;
}

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80";

export default function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const displayPhotos = photos && photos.length > 0 ? photos : [PLACEHOLDER_IMAGE];
  const heroPhoto = displayPhotos[0];

  // If there's only 1 photo, or it's a placeholder, render a single large aspect ratio image.
  if (displayPhotos.length === 1) {
    return (
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-900 shadow-sm">
        <Image
          src={heroPhoto}
          alt={title}
          fill
          priority
          sizes="(max-w-7xl) 100vw"
          className="object-cover object-center"
        />
      </div>
    );
  }

  // 5-photo grid for high fidelity desktop layout, collapsing to single hero on mobile
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden shadow-sm bg-zinc-100 dark:bg-zinc-900 aspect-[16/10] md:aspect-[21/9] relative">
      {/* Hero Image (left half on desktop, full image on mobile) */}
      <div className="relative md:col-span-2 h-full w-full aspect-[16/10] md:aspect-auto">
        <Image
          src={heroPhoto}
          alt={`${title} main`}
          fill
          priority
          sizes="(max-w-7xl) 50vw, 100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Grid of smaller photos on the right (desktop only) */}
      <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
        {displayPhotos.slice(1, 5).map((photo, i) => (
          <div key={i} className="relative w-full h-full">
            <Image
              src={photo}
              alt={`${title} detail ${i + 1}`}
              fill
              sizes="(max-w-7xl) 25vw"
              className="object-cover object-center hover:brightness-90 transition duration-300"
            />
          </div>
        ))}
        {/* Handle fill if less than 5 photos */}
        {displayPhotos.length < 5 &&
          Array.from({ length: 5 - displayPhotos.length }).map((_, i) => (
            <div key={`fill-${i}`} className="relative w-full h-full bg-zinc-200 dark:bg-zinc-800" />
          ))}
      </div>
    </div>
  );
}
