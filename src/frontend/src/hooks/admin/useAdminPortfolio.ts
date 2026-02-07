import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { PortfolioItem } from '../../backend';
import { toast } from 'sonner';

export function useAdminPortfolio() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PortfolioItem[]>({
    queryKey: ['portfolioItems'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPortfolioItems();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddPortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: PortfolioItem) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addPortfolioItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      toast.success('Portfolio item added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add portfolio item: ${error.message}`);
    },
  });
}

export function useUpdatePortfolioItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: PortfolioItem) => {
      if (!actor) throw new Error('Actor not available');
      // Backend uses addPortfolioItem for both add and update (overwrites by ID)
      await actor.addPortfolioItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolioItems'] });
      toast.success('Portfolio item updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update portfolio item: ${error.message}`);
    },
  });
}
