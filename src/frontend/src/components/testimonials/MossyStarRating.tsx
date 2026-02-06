import { Star } from 'lucide-react';
import { useState } from 'react';

interface MossyStarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function MossyStarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = 'md',
}: MossyStarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, value: number) => {
    if (!readonly && onRatingChange && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1" role={readonly ? 'img' : 'radiogroup'} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((value) => {
        const isActive = value <= (hoverRating || rating);
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleClick(value)}
            onMouseEnter={() => !readonly && setHoverRating(value)}
            onMouseLeave={() => !readonly && setHoverRating(0)}
            onKeyDown={(e) => handleKeyDown(e, value)}
            disabled={readonly}
            className={`mossy-star ${sizeClasses[size]} ${
              readonly ? 'cursor-default' : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-mossy-glow focus:ring-offset-2'
            } transition-all`}
            aria-label={`${value} star${value !== 1 ? 's' : ''}`}
            role={readonly ? 'presentation' : 'radio'}
            aria-checked={!readonly && value === rating}
            tabIndex={readonly ? -1 : 0}
          >
            <Star
              className={`${sizeClasses[size]} transition-all ${
                isActive ? 'mossy-star-filled' : 'mossy-star-empty'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
