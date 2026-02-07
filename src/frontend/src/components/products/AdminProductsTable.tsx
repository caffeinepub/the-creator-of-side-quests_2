import type { Product } from '../../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Edit } from 'lucide-react';

interface AdminProductsTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export default function AdminProductsTable({ products, onEdit }: AdminProductsTableProps) {
  const formatPrice = (price: bigint) => {
    return `$${(Number(price) / 100).toFixed(2)}`;
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead className="min-w-[120px]">Name</TableHead>
            <TableHead className="hidden sm:table-cell">Price</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="w-16 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No products yet. Create your first product to get started.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.image.getDirectURL()}
                    alt={product.name}
                    className="h-12 w-12 rounded-md border object-cover"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="min-w-0 break-words">{product.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:hidden">
                    {formatPrice(product.price)}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{formatPrice(product.price)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {product.category ? (
                    <Badge variant="outline">{product.category}</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={product.inStock ? 'default' : 'secondary'}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    {product.requiresQuote && (
                      <Badge variant="outline" className="text-xs">
                        Requires Quote
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
