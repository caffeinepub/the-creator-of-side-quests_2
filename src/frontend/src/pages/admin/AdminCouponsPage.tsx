import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminCouponsPage() {
  usePageMeta('Manage Coupons', 'Create and manage discount coupons.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Coupons</h1>
      <p className="text-muted-foreground">Coupon management interface coming soon.</p>
    </div>
  );
}
