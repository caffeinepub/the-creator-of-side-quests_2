import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { PortfolioItem } from '../../backend';

export function usePortfolioItems() {
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
