import { useActiveGiveaways, useEnterGiveaway } from '../../hooks/giveaway/useGiveaways';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export default function EnterGiveawayCard() {
  const { data: giveaways } = useActiveGiveaways();
  const { data: profile } = useGetCallerUserProfile();
  const enterGiveaway = useEnterGiveaway();

  if (!giveaways || giveaways.length === 0) return null;

  const activeGiveaway = giveaways[0];

  const handleEnter = async () => {
    if (!profile) {
      toast.error('Please complete your profile first.');
      return;
    }

    try {
      await enterGiveaway.mutateAsync({
        giveawayId: activeGiveaway.id,
        displayName: profile.name,
      });
      toast.success('You have entered the giveaway!');
    } catch (error) {
      toast.error('Failed to enter giveaway. You may have already entered.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">{activeGiveaway.name}</CardTitle>
        <CardDescription>{activeGiveaway.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleEnter} disabled={enterGiveaway.isPending} className="w-full">
          {enterGiveaway.isPending ? 'Entering...' : 'Enter Giveaway'}
        </Button>
      </CardContent>
    </Card>
  );
}
