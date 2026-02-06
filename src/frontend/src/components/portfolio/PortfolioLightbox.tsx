import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import type { PortfolioItem } from '../../backend';

interface PortfolioLightboxProps {
  item: PortfolioItem;
  onClose: () => void;
}

export default function PortfolioLightbox({ item, onClose }: PortfolioLightboxProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-serif">{item.title}</DialogTitle>
          {item.category && <DialogDescription>{item.category}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg">
            <img
              src={item.image.getDirectURL()}
              alt={item.title}
              className="w-full object-contain"
            />
          </div>
          <p className="leading-relaxed">{item.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
