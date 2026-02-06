import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminPoliciesFulfillmentPage() {
  usePageMeta('Policies & Fulfillment', 'Manage policies and fulfillment options.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Policies & Fulfillment</h1>
      <p className="text-muted-foreground">Policies management interface coming soon.</p>
    </div>
  );
}
