import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Giveaway, GiveawayWinner } from '../../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export function useAdminActiveGiveaways() {
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

export function useAdminGiveaway(id: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Giveaway | null>({
    queryKey: ['giveaway', id],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getGiveaway(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}

export function useAddGiveawayEntrantByAdmin() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      giveawayId,
      principalText,
      displayName,
    }: {
      giveawayId: string;
      principalText: string;
      displayName: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(principalText);
      await actor.addGiveawayEntrantByAdmin(giveawayId, principal, displayName);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['giveaway', variables.giveawayId] });
      queryClient.invalidateQueries({ queryKey: ['activeGiveaways'] });
      toast.success('Entrant added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add entrant: ${error.message}`);
    },
  });
}

export function useSelectGiveawayWinner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      giveawayId,
      winnerIndex,
    }: {
      giveawayId: string;
      winnerIndex: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const winner = await actor.selectGiveawayWinner(giveawayId, BigInt(winnerIndex));
      return winner;
    },
    onSuccess: (winner, variables) => {
      queryClient.invalidateQueries({ queryKey: ['giveaway', variables.giveawayId] });
      queryClient.invalidateQueries({ queryKey: ['activeGiveaways'] });
      if (winner) {
        toast.success(`Winner selected: ${winner.entrant.displayName}`);
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to select winner: ${error.message}`);
    },
  });
}
