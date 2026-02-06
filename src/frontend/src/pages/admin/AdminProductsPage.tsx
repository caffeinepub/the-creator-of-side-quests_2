import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminProductsPage() {
  usePageMeta('Manage Products', 'Add, edit, and remove products from your shop.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Products</h1>
      <p className="text-muted-foreground">Product management interface coming soon.</p>
    </div>
  );
}
