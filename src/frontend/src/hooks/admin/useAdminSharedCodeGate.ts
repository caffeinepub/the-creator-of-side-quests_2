import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';

export function useHasValidAdminSession() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['adminSessionValid'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasValidAdminSession();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useVerifyAdminCodeStep1() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.verifyAdminCodeStep1(code);
      if (!result) {
        throw new Error('Incorrect code. Please try again.');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSessionValid'] });
      queryClient.invalidateQueries({ queryKey: ['adminVerificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['isPermanentlyLocked'] });
    },
    onError: () => {
      // Invalidate lockout-related queries on error to immediately reflect lockout state
      queryClient.invalidateQueries({ queryKey: ['adminVerificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['isPermanentlyLocked'] });
      queryClient.invalidateQueries({ queryKey: ['adminSessionValid'] });
    },
  });
}

export function useVerifyAdminCodeStep2() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.verifyAdminCodeStep2(code);
      if (!result) {
        throw new Error('Incorrect code. Please try again.');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSessionValid'] });
      queryClient.invalidateQueries({ queryKey: ['adminVerificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['isPermanentlyLocked'] });
    },
    onError: () => {
      // Invalidate lockout-related queries on error to immediately reflect lockout state
      queryClient.invalidateQueries({ queryKey: ['adminVerificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['isPermanentlyLocked'] });
      queryClient.invalidateQueries({ queryKey: ['adminSessionValid'] });
    },
  });
}

export function useVerifyAdminCodeStep3() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.verifyAdminCodeStep3(code);
      if (!result) {
        throw new Error('Incorrect code. Please try again.');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSessionValid'] });
      queryClient.invalidateQueries({ queryKey: ['adminVerificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['isPermanentlyLocked'] });
    },
    onError: () => {
      // Invalidate lockout-related queries on error to immediately reflect lockout state
      queryClient.invalidateQueries({ queryKey: ['adminVerificationStatus'] });
      queryClient.invalidateQueries({ queryKey: ['isPermanentlyLocked'] });
      queryClient.invalidateQueries({ queryKey: ['adminSessionValid'] });
    },
  });
}
