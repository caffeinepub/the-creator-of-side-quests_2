import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminLoyaltyRewardsPage() {
  usePageMeta('Loyalty Rewards', 'Manage loyalty points and rewards.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Loyalty Rewards</h1>
      <p className="text-muted-foreground">Loyalty rewards interface coming soon.</p>
    </div>
  );
}
