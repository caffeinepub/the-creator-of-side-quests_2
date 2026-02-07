import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useProduct } from '../hooks/shop/useProducts';
import { usePageMeta } from '../hooks/usePageMeta';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { useCreateCheckoutSession } from '../hooks/shop/useStripeCheckout';
import CouponBox from '../components/shop/CouponBox';
import { useState } from 'react';
import FulfillmentNotice from '../components/shop/FulfillmentNotice';

export default function ProductDetailPage() {
  const { productId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(productId || '');
  const createCheckoutSession = useCreateCheckoutSession();
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  usePageMeta(product?.name || 'Product', product?.description);

  if (isLoading) {
    return (
      <div className="container py-8 px-4 sm:py-16">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8 px-4 sm:py-16">
        <p>Product not found.</p>
        <Link to="/shop">
          <Button className="mt-4">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    try {
      const session = await createCheckoutSession.mutateAsync({
        items: [
          {
            productName: product.name,
            productDescription: product.description,
            priceInCents: product.price,
            quantity: BigInt(1),
            currency: 'usd',
          },
        ],
        couponCode: appliedCoupon || undefined,
      });

      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const handleRequestQuote = () => {
    navigate({ to: '/contact', search: { productId: product.id } });
  };

  const getImageUrl = (imageBytes: Uint8Array): string => {
    const blob = new Blob([imageBytes as Uint8Array<ArrayBuffer>], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
  };

  return (
    <div>
      <section className="py-8 sm:py-16">
        <div className="container px-4">
          <Link to="/shop">
            <Button variant="ghost" size="sm" className="mb-4 sm:mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Button>
          </Link>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="mb-2 font-serif text-2xl sm:text-3xl md:text-4xl font-bold break-words">{product.name}</h1>
                <div className="flex flex-wrap gap-2">
                  {!product.inStock && <Badge variant="destructive">Out of Stock</Badge>}
                  {product.requiresQuote && <Badge variant="secondary">Quote Required</Badge>}
                </div>
              </div>

              <p className="text-base sm:text-lg leading-relaxed">{product.description}</p>

              <div className="text-2xl sm:text-3xl font-bold">
                ${(Number(product.price) / 100).toFixed(2)}
              </div>

              <FulfillmentNotice />

              {!product.requiresQuote && product.inStock && (
                <div className="space-y-4">
                  <CouponBox onCouponApplied={setAppliedCoupon} />
                  <Button
                    onClick={handleCheckout}
                    disabled={createCheckoutSession.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {createCheckoutSession.isPending ? 'Processing...' : 'Checkout with Stripe'}
                  </Button>
                </div>
              )}

              {(product.requiresQuote || !product.inStock) && (
                <Button onClick={handleRequestQuote} className="w-full" size="lg">
                  Request Quote / Contact
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
