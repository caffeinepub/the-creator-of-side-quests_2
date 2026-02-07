import { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import type { PortfolioItem, PortfolioMedia } from '../../backend';

interface PortfolioLightboxProps {
  item: PortfolioItem;
  onClose: () => void;
}

export default function PortfolioLightbox({ item, onClose }: PortfolioLightboxProps) {
  const mediaUrlRef = useRef<string | null>(null);

  const isVideo = (media: PortfolioMedia): boolean => {
    return media.__kind__ === 'video';
  };

  const itemIsVideo = isVideo(item.media);

  // Create and manage object URL for the current item
  useEffect(() => {
    // Create new URL for current item
    let url: string;
    if (item.media.__kind__ === 'image') {
      const blob = new Blob([new Uint8Array(item.media.image)], { type: 'image/jpeg' });
      url = URL.createObjectURL(blob);
    } else {
      const blob = new Blob([new Uint8Array(item.media.video)], { type: 'video/mp4' });
      url = URL.createObjectURL(blob);
    }
    mediaUrlRef.current = url;

    // Cleanup when item changes or component unmounts
    return () => {
      if (mediaUrlRef.current) {
        URL.revokeObjectURL(mediaUrlRef.current);
        mediaUrlRef.current = null;
      }
    };
  }, [item.id, item.media]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-4 sm:p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="font-serif text-xl sm:text-2xl">{item.title}</DialogTitle>
              {item.category && <DialogDescription className="text-sm sm:text-base">{item.category}</DialogDescription>}
            </DialogHeader>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg">
                {itemIsVideo ? (
                  <video
                    src={mediaUrlRef.current || undefined}
                    controls
                    muted
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                ) : (
                  <img
                    src={mediaUrlRef.current || undefined}
                    alt={item.title}
                    className="w-full h-auto max-h-[60vh] object-contain"
                  />
                )}
              </div>
              <div className="prose prose-sm sm:prose-base max-w-none">
                <p className="leading-relaxed whitespace-pre-wrap">{item.description}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
