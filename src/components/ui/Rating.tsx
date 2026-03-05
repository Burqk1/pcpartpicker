import { Star } from 'lucide-react';

type RatingSize = 'sm' | 'md';

interface RatingProps {
  rating: number;
  size?: RatingSize;
  showValue?: boolean;
  reviewCount?: number;
}

const sizeMap: Record<RatingSize, number> = {
  sm: 14,
  md: 18,
};

function Rating({ rating, size = 'md', showValue = false, reviewCount }: RatingProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating - fullStars >= 0.25 && clampedRating - fullStars < 0.75;
  const roundedUp = clampedRating - fullStars >= 0.75;
  const totalFull = roundedUp ? fullStars + 1 : fullStars;
  const emptyStars = 5 - totalFull - (hasHalfStar ? 1 : 0);

  const iconSize = sizeMap[size];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: totalFull }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={iconSize}
            className="text-[var(--star-color)] fill-[var(--star-color)]"
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star
              size={iconSize}
              className="text-[var(--star-color)]"
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                size={iconSize}
                className="text-[var(--star-color)] fill-[var(--star-color)]"
              />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={iconSize}
            className="text-[var(--star-color)]"
          />
        ))}
      </div>
      {showValue && (
        <span className={`${textSize} text-[var(--text-primary)] font-medium ml-1`}>
          {clampedRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={`${textSize} text-[var(--text-secondary)] ml-1`}>
          ({reviewCount} de\u011Ferlendirme)
        </span>
      )}
    </div>
  );
}

export default Rating;
