import { useEffect } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { usePageMeta } from '../hooks/usePageMeta';
import { useMutation } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';

export default function PaymentSuccessPage() {
  usePageMeta('Payment Successful', 'Your payment was processed successfully.');
  const search = useSearch({ strict: false }) as { session_id?: string };
  const { actor } = useActor();

  const recordPurchase = useMutation({
    mutationFn: async (amount: number) => {
      if (!actor) throw new Error('Actor not available');
      await actor.recordPurchase(BigInt(amount));
    },
  });

  useEffect(() => {
    if (search.session_id && actor) {
      recordPurchase.mutate(100);
    }
  }, [search.session_id, actor]);

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-md text-center">
        <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-primary" />
        <h1 className="mb-4 font-serif text-3xl font-bold">Payment Successful!</h1>
        <p className="mb-8 text-muted-foreground">
          Thank you for your purchase. We'll be in touch soon to coordinate pickup or dropoff.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
