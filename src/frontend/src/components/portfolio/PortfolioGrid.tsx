import { useState, useRef, useCallback } from 'react';
import type { PortfolioItem, PortfolioMedia } from '../../backend';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import FlipCard from '../FlipCard';
import { Maximize2 } from 'lucide-react';
import { useManagedObjectUrls } from '../../utils/objectUrls';

interface PortfolioGridProps {
  items: PortfolioItem[];
  onItemClick: (item: PortfolioItem) => void;
}

export default function PortfolioGrid({ items, onItemClick }: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [hoveringCards, setHoveringCards] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  // Create managed object URLs for all items
  const mediaUrls = useManagedObjectUrls(
    filteredItems,
    useCallback((item: PortfolioItem) => {
      if (item.media.__kind__ === 'image') {
        return {
          bytes: item.media.image as Uint8Array,
          mimeType: 'image/jpeg',
        };
      } else {
        return {
          bytes: item.media.video as Uint8Array,
          mimeType: 'video/mp4',
        };
      }
    }, [])
  );

  const getCategoryLabel = (category: string | undefined) => {
    if (!category) return category;
    if (category === 'What I have created for the community') {
      return 'Community Creations';
    }
    return category;
  };

  const isVideo = (media: PortfolioMedia): boolean => {
    return media.__kind__ === 'video';
  };

  const handleVideoMouseEnter = (itemId: string) => {
    setHoveringCards((prev) => ({ ...prev, [itemId]: true }));
    
    // Only play if card is not flipped
    if (!flippedCards[itemId]) {
      const video = videoRefs.current[itemId];
      if (video) {
        video.play().catch(() => {
          // Silently handle autoplay blocks - no UI errors
        });
      }
    }
  };

  const handleVideoMouseLeave = (itemId: string) => {
    setHoveringCards((prev) => ({ ...prev, [itemId]: false }));
    
    const video = videoRefs.current[itemId];
    if (video) {
      video.pause();
    }
  };

  const handleFlipChange = (itemId: string, itemIsVideo: boolean, newFlipped: boolean) => {
    setFlippedCards((prev) => ({
      ...prev,
      [itemId]: newFlipped,
    }));

    // Handle video pause when flipping to back
    if (itemIsVideo && newFlipped) {
      const video = videoRefs.current[itemId];
      if (video) {
        video.pause();
      }
    }
  };

  const handleViewFullClick = (item: PortfolioItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onItemClick(item);
  };

  return (
    <div>
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category || null)}
            >
              {getCategoryLabel(category)}
            </Badge>
          ))}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const mediaUrl = mediaUrls.get(item.id);
          const itemIsVideo = isVideo(item.media);
          const isFlipped = flippedCards[item.id] || false;

          if (!mediaUrl) return null;

          return (
            <div key={item.id} className="h-96">
              <FlipCard
                isFlipped={isFlipped}
                onFlippedChange={(flipped) => handleFlipChange(item.id, itemIsVideo, flipped)}
                className="h-full"
                front={
                  <div
                    className="relative h-full w-full overflow-hidden rounded-lg cursor-pointer"
                    onMouseEnter={() => itemIsVideo && handleVideoMouseEnter(item.id)}
                    onMouseLeave={() => itemIsVideo && handleVideoMouseLeave(item.id)}
                    onClick={() => handleFlipChange(item.id, itemIsVideo, true)}
                  >
                    {itemIsVideo ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[item.id] = el;
                        }}
                        src={mediaUrl}
                        className="h-full w-full object-cover"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-none">
                      <h3 className="font-serif font-semibold text-white">{item.title}</h3>
                      {item.category && (
                        <Badge variant="outline" className="mt-1 text-xs border-white/50 text-white">
                          {getCategoryLabel(item.category)}
                        </Badge>
                      )}
                    </div>
                  </div>
                }
                back={
                  <div className="flex h-full flex-col justify-between overflow-y-auto p-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleFlipChange(item.id, itemIsVideo, false)}
                    >
                      <h3 className="font-serif text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleViewFullClick(item, e)}
                        className="gap-2"
                      >
                        <Maximize2 className="h-3 w-3" />
                        View Full
                      </Button>
                    </div>
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
