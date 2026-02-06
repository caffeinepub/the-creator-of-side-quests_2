import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { FulfillmentOptions } from '../../backend';

export function useFulfillmentOptions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<FulfillmentOptions>({
    queryKey: ['fulfillmentOptions'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFulfillmentOptions();
    },
    enabled: !!actor && !actorFetching,
  });
}
