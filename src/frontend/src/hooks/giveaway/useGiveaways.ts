import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Giveaway } from '../../backend';

export function useActiveGiveaways() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Giveaway[]>({
    queryKey: ['activeGiveaways'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveGiveaways();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useEnterGiveaway() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ giveawayId, displayName }: { giveawayId: string; displayName: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addGiveawayEntrant(giveawayId, displayName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeGiveaways'] });
    },
  });
}
