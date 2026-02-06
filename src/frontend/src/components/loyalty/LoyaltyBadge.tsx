import { useGetCallerUserProfile } from '../../hooks/useCurrentUser';
import { Award } from 'lucide-react';

export default function LoyaltyBadge() {
  const { data: profile } = useGetCallerUserProfile();

  if (!profile) return null;

  return (
    <div className="flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm">
      <Award className="h-4 w-4 text-primary" />
      <span className="font-medium">{profile.loyaltyPoints.toString()} pts</span>
    </div>
  );
}
