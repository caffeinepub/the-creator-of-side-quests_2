import { useState, useEffect } from 'react';
import type { GiveawayEntrant } from '../../backend';
import { Card, CardContent } from '../ui/card';

interface AdminGiveawayWheelProps {
  entrants: GiveawayEntrant[];
  onSpinComplete: (selectedIndex: number) => void;
  isSpinning: boolean;
}

export default function AdminGiveawayWheel({ entrants, onSpinComplete, isSpinning }: AdminGiveawayWheelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(50);

  useEffect(() => {
    if (!isSpinning) {
      setSpinSpeed(50);
      return;
    }

    let intervalId: NodeJS.Timeout;
    let elapsed = 0;
    const totalDuration = 5000; // 5 seconds
    const finalIndex = Math.floor(Math.random() * entrants.length);

    const animate = () => {
      elapsed += spinSpeed;
      const progress = elapsed / totalDuration;

      if (progress >= 1) {
        setCurrentIndex(finalIndex);
        onSpinComplete(finalIndex);
        return;
      }

      // Slow down over time
      const newSpeed = 50 + progress * 200;
      setSpinSpeed(newSpeed);

      setCurrentIndex((prev) => (prev + 1) % entrants.length);
      intervalId = setTimeout(animate, newSpeed);
    };

    intervalId = setTimeout(animate, spinSpeed);

    return () => {
      if (intervalId) clearTimeout(intervalId);
    };
  }, [isSpinning, entrants.length, onSpinComplete]);

  if (entrants.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">No entrants to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              {isSpinning ? 'Spinning...' : 'Selected Entrant'}
            </p>
            <div
              className={`rounded-lg border-4 border-primary bg-card p-8 transition-all ${
                isSpinning ? 'animate-pulse scale-105' : 'scale-100'
              }`}
            >
              <p className="font-serif text-3xl font-bold">{entrants[currentIndex]?.displayName}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {currentIndex + 1} of {entrants.length}
              </p>
            </div>
          </div>

          {!isSpinning && (
            <div className="w-full max-w-md space-y-2">
              <p className="text-center text-sm font-medium">All Entrants:</p>
              <div className="max-h-48 overflow-y-auto rounded-md border p-2">
                <div className="space-y-1">
                  {entrants.map((entrant, index) => (
                    <div
                      key={index}
                      className={`rounded px-3 py-2 text-sm ${
                        index === currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      {entrant.displayName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
