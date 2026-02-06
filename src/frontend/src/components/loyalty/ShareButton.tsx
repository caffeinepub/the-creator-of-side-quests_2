import { Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { toast } from 'sonner';

export default function ShareButton() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const shareMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.addLoyaltyPoints({ __kind__: 'share', share: null });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Thanks for sharing! You earned 50 points.');
    },
    onError: () => {
      toast.error('Failed to award points. Please try again.');
    },
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Creator of Side Quests',
          text: 'Check out The Creator of Side Quests - where chaotic creativity meets intentional craftsmanship!',
          url: window.location.origin,
        });
        shareMutation.mutate();
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin);
      toast.success('Link copied to clipboard!');
      shareMutation.mutate();
    }
  };

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      disabled={shareMutation.isPending}
      aria-label="Share and earn points"
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share & Earn 50 Points
    </Button>
  );
}
