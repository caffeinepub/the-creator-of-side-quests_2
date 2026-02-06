import { useState } from 'react';
import type { PortfolioItem } from '../../backend';
import { Badge } from '../ui/badge';

interface PortfolioGridProps {
  items: PortfolioItem[];
  onItemClick: (item: PortfolioItem) => void;
}

export default function PortfolioGrid({ items, onItemClick }: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : items;

  const getCategoryLabel = (category: string | undefined) => {
    if (!category) return category;
    if (category === 'What I have created for the community') {
      return 'Community Creations';
    }
    return category;
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
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-transform hover:scale-105"
            onClick={() => onItemClick(item)}
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={item.image.getDirectURL()}
                alt={item.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="font-serif font-semibold">{item.title}</h3>
              {item.category && (
                <Badge variant="outline" className="mt-1 text-xs">
                  {getCategoryLabel(item.category)}
                </Badge>
              )}
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
