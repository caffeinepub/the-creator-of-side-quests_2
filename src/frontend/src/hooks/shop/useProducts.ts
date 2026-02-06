import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Product } from '../../backend';

export function useProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useProduct(id: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !actorFetching && !!id,
  });
}
