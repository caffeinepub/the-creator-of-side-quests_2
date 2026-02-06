import { useState } from 'react';
import PageHeaderBanner from '../components/PageHeaderBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import { usePortfolioItems } from '../hooks/content/usePortfolio';
import PortfolioGrid from '../components/portfolio/PortfolioGrid';
import PortfolioLightbox from '../components/portfolio/PortfolioLightbox';
import type { PortfolioItem } from '../backend';

export default function PortfolioPage() {
  usePageMeta('Portfolio', 'Explore our creative work and past projects.');
  const { data: items, isLoading } = usePortfolioItems();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  return (
    <div>
      <PageHeaderBanner
        title="Portfolio"
        subtitle="A collection of our creative work and side quests"
      />

      <section className="py-16">
        <div className="container">
          {isLoading && <p className="text-center">Loading portfolio...</p>}

          {items && items.length === 0 && (
            <p className="text-center text-muted-foreground">No portfolio items yet.</p>
          )}

          {items && items.length > 0 && (
            <PortfolioGrid items={items} onItemClick={setSelectedItem} />
          )}
        </div>
      </section>

      {selectedItem && (
        <PortfolioLightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
