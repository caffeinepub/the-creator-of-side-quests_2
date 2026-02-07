import { ReactNode, useState } from 'react';
import { cn } from '../lib/utils';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
  isFlipped?: boolean;
  onFlippedChange?: (flipped: boolean) => void;
}

export default function FlipCard({ front, back, className, isFlipped: controlledFlipped, onFlippedChange }: FlipCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);

  const isControlled = controlledFlipped !== undefined;
  const isFlipped = isControlled ? controlledFlipped : internalFlipped;

  const handleFlip = () => {
    if (isControlled) {
      onFlippedChange?.(!isFlipped);
    } else {
      setInternalFlipped(!isFlipped);
    }
  };

  return (
    <div
      className={cn('group perspective-1000 h-64 w-full', className)}
      role="button"
      tabIndex={0}
      aria-label="Flip card"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleFlip();
        }
      }}
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-600 preserve-3d'
        )}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="absolute inset-0 backface-hidden rounded-lg border border-border bg-card p-6 shadow-medieval"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 backface-hidden rounded-lg border border-border bg-card p-6 shadow-medieval"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
