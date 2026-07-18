import { Review } from "../../types/review";

interface ReviewsSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

// User names matching seeded guests in database
const GUEST_NAMES: Record<number, string> = {
  1: "Vikram Mehta",
  2: "Priya Sharma",
  3: "Amit Patel",
  4: "Rohan Das",
  5: "Sneha Reddy",
};

export default function ReviewsSection({ reviews, rating, reviewCount }: ReviewsSectionProps) {
  const getAuthorName = (authorId: number) => {
    return GUEST_NAMES[authorId] || `Guest #${authorId}`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return "June 2026";
    }
  };

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
      {/* Header aggregates */}
      <div className="flex items-center gap-2 text-xl font-extrabold text-zinc-900 dark:text-zinc-50">
        <span>★</span>
        <span>{rating > 0 ? rating.toFixed(2) : "New"}</span>
        {reviewCount > 0 && (
          <>
            <span className="text-zinc-300 dark:text-zinc-700 font-normal text-sm">•</span>
            <span className="underline font-bold text-sm">
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold italic">
          No reviews yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {reviews.map((review) => {
            const reviewerInitials = getAuthorName(review.author_id)
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div key={review.id} className="space-y-3">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 dark:bg-zinc-850 dark:border-zinc-800 dark:text-zinc-300 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {reviewerInitials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                      {getAuthorName(review.author_id)}
                    </h4>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                </div>

                {/* Rating stars */}
                <div className="flex items-center gap-0.5 text-xs text-rose-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-rose-500" : "text-zinc-200 dark:text-zinc-800"}>
                      ★
                    </span>
                  ))}
                </div>

                {/* Comment text */}
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
