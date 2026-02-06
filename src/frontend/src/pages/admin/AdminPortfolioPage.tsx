import { usePageMeta } from '../../hooks/usePageMeta';
import { useAdminPortfolio } from '../../hooks/admin/useAdminPortfolio';
import AdminPortfolioUploader from '../../components/portfolio/AdminPortfolioUploader';
import AdminPortfolioTable from '../../components/portfolio/AdminPortfolioTable';

export default function AdminPortfolioPage() {
  usePageMeta('Manage Portfolio', 'Add, edit, and remove portfolio items.');

  const { data: portfolioItems, isLoading } = useAdminPortfolio();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Portfolio</h1>

      <div className="space-y-8">
        <AdminPortfolioUploader />

        {isLoading ? (
          <p className="text-muted-foreground">Loading portfolio items...</p>
        ) : (
          <AdminPortfolioTable items={portfolioItems || []} />
        )}
      </div>
    </div>
  );
}
