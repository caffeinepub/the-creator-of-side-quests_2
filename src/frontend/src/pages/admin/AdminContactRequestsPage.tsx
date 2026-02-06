import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminContactRequestsPage() {
  usePageMeta('Contact Requests', 'View and manage contact requests.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Contact Requests</h1>
      <p className="text-muted-foreground">Contact requests interface coming soon.</p>
    </div>
  );
}
