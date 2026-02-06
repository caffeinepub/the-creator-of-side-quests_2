import { Link } from '@tanstack/react-router';
import PageHeaderBanner from '../components/PageHeaderBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import { useProducts } from '../hooks/shop/useProducts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import FulfillmentNotice from '../components/shop/FulfillmentNotice';

export default function ShopPage() {
  usePageMeta('Shop', 'Browse our collection of handmade items, digital creations, and custom services. Local pickup and dropoff available in Ashland/Westwood, KY.');

  const { data: products, isLoading } = useProducts();

  return (
    <div>
      <PageHeaderBanner
        title="Shop"
        subtitle="Handmade with care, crafted with creativity"
      />

      <section className="py-16">
        <div className="container">
          <FulfillmentNotice className="mb-8" />

          {isLoading && (
            <div className="text-center">
              <p>Loading products...</p>
            </div>
          )}

          {products && products.length === 0 && (
            <div className="text-center">
              <p className="text-muted-foreground">No products available at this time.</p>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products?.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="mb-4 aspect-square overflow-hidden rounded-md bg-muted">
                    <img
                      src={product.image.getDirectURL()}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardTitle className="font-serif">{product.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      ${(Number(product.price) / 100).toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                      {product.requiresQuote && <Badge variant="secondary">Quote Required</Badge>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/shop/$productId" params={{ productId: product.id }} className="w-full">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
