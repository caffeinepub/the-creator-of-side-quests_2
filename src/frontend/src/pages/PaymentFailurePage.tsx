import { Link } from '@tanstack/react-router';
import { XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePageMeta } from '../hooks/usePageMeta';

export default function PaymentFailurePage() {
  usePageMeta('Payment Cancelled', 'Your payment was cancelled or failed.');

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-md text-center">
        <XCircle className="mx-auto mb-6 h-16 w-16 text-destructive" />
        <h1 className="mb-4 font-serif text-3xl font-bold">Payment Cancelled</h1>
        <p className="mb-8 text-muted-foreground">
          Your payment was cancelled or failed to process. No charges were made to your account.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link to="/shop">
            <Button>Return to Shop</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
