import { useMutation, useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';

export function useHasValidAdminSharedCode() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['adminSharedCodeValid'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasValidAdminSharedCode();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useVerifyAdminSharedCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        return await actor.verifyAdminSharedCode(code);
      } catch (error: any) {
        throw new Error(error.message || 'Verification failed');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useRetryVerifyAdminSharedCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        return await actor.retryVerifyAdminSharedCode(code);
      } catch (error: any) {
        throw new Error(error.message || 'Verification failed');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
