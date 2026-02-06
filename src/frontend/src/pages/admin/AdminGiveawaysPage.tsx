import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminGiveawaysPage() {
  usePageMeta('Manage Giveaways', 'Create and manage giveaways with winner selection.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Giveaways</h1>
      <p className="text-muted-foreground">Giveaway management interface coming soon.</p>
    </div>
  );
}
