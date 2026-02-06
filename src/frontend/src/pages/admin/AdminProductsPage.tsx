import { useState } from 'react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useAdminProducts } from '../../hooks/admin/useAdminProducts';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import AdminProductsTable from '../../components/products/AdminProductsTable';
import AdminProductFormDialog from '../../components/products/AdminProductFormDialog';
import type { Product } from '../../backend';

export default function AdminProductsPage() {
  usePageMeta('Manage Products', 'Add, edit, and remove products from your shop.');

  const { data: products, isLoading } = useAdminProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingProduct(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Manage Products</h1>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Product
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading products...</p>
      ) : (
        <AdminProductsTable products={products || []} onEdit={handleEdit} />
      )}

      <AdminProductFormDialog open={dialogOpen} onOpenChange={handleDialogClose} product={editingProduct} />
    </div>
  );
}
