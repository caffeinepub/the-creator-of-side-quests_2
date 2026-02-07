import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import type { PortfolioItem } from '../../backend';

interface PortfolioLightboxProps {
  item: PortfolioItem;
  onClose: () => void;
}

export default function PortfolioLightbox({ item, onClose }: PortfolioLightboxProps) {
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
                <img
                  src={item.image.getDirectURL()}
                  alt={item.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              </div>
              <p className="text-sm sm:text-base leading-relaxed">{item.description}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
