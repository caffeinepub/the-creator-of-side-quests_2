import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useValidateCoupon } from '../../hooks/admin/useCoupons';
import { toast } from 'sonner';

interface CouponBoxProps {
  onCouponApplied: (code: string | null) => void;
}

export default function CouponBox({ onCouponApplied }: CouponBoxProps) {
  const [couponCode, setCouponCode] = useState('');
  const validateCoupon = useValidateCoupon();

  const handleApply = async () => {
    if (!couponCode.trim()) return;

    try {
      const coupon = await validateCoupon.mutateAsync(couponCode.trim());
      if (coupon) {
        onCouponApplied(couponCode.trim());
        toast.success('Coupon applied successfully!');
      } else {
        toast.error('Invalid or expired coupon code.');
      }
    } catch (error) {
      toast.error('Failed to validate coupon.');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="coupon">Have a coupon code?</Label>
      <div className="flex gap-2">
        <Input
          id="coupon"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter code"
        />
        <Button onClick={handleApply} disabled={validateCoupon.isPending} variant="outline">
          Apply
        </Button>
      </div>
    </div>
  );
}
