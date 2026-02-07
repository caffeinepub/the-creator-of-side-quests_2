import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';

export function useAdminVerificationStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['adminVerificationStatus'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminVerificationStatus();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  // Return custom state that properly reflects actor dependency
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useIsPermanentlyLocked() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['isPermanentlyLocked'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isPermanentlyLocked();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  // Return custom state that properly reflects actor dependency
  // Keep isLoading true until actor is ready AND query has completed
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}
