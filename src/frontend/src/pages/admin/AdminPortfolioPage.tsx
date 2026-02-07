import { usePageMeta } from '../../hooks/usePageMeta';
import { useAdminPortfolio } from '../../hooks/admin/useAdminPortfolio';
import AdminPortfolioUploader from '../../components/portfolio/AdminPortfolioUploader';
import AdminPortfolioTable from '../../components/portfolio/AdminPortfolioTable';

export default function AdminPortfolioPage() {
  usePageMeta('Manage Portfolio', 'Add, edit, and remove portfolio items.');

  const { data: portfolioItems, isLoading, error } = useAdminPortfolio();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Portfolio</h1>

      <div className="space-y-8">
        <AdminPortfolioUploader />

        {isLoading && (
          <p className="text-muted-foreground">Loading portfolio items...</p>
        )}

        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              Failed to load portfolio items. Please try refreshing the page.
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <AdminPortfolioTable items={portfolioItems || []} />
        )}
      </div>
    </div>
  );
}
