import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminStripeSetupPage() {
  usePageMeta('Stripe Setup', 'Configure Stripe payment processing.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Stripe Setup</h1>
      <p className="text-muted-foreground">Stripe configuration interface coming soon.</p>
    </div>
  );
}
