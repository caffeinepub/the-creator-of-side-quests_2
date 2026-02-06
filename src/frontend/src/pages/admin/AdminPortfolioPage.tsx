import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminPortfolioPage() {
  usePageMeta('Manage Portfolio', 'Add, edit, and remove portfolio items.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Portfolio</h1>
      <p className="text-muted-foreground">Portfolio management interface coming soon.</p>
    </div>
  );
}
