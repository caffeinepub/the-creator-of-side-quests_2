import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { toast } from 'sonner';

interface RotateCodesParams {
  masterOverride: string;
  newCode1: string;
  newCode2: string;
  newCode3: string;
}

export function useRotateVerificationCodes() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ masterOverride, newCode1, newCode2, newCode3 }: RotateCodesParams) => {
      if (!actor) throw new Error('Actor not available');
      
      await actor.updateWithMasterOverride(masterOverride, newCode1, newCode2, newCode3);
    },
    onSuccess: () => {
      toast.success('Verification codes updated successfully');
      // Clear all admin session-related queries since backend clears all sessions
      queryClient.invalidateQueries({ queryKey: ['adminSessionValid'] });
      queryClient.invalidateQueries({ queryKey: ['adminVerificationStatus'] });
    },
    onError: (error: any) => {
      // Generic error message without exposing sensitive details
      toast.error('Verification failed');
    },
  });
}

export function useUpdateMasterOverride() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currentMasterOverride, newMasterOverride }: { currentMasterOverride: string; newMasterOverride: string }) => {
      if (!actor) throw new Error('Actor not available');
      
      await actor.updateMasterOverride(currentMasterOverride, newMasterOverride);
    },
    onSuccess: () => {
      toast.success('Master Override Code updated successfully');
      // Clear all admin session-related queries since backend clears all sessions
      queryClient.invalidateQueries({ queryKey: ['adminSessionValid'] });
      queryClient.invalidateQueries({ queryKey: ['adminVerificationStatus'] });
    },
    onError: (error: any) => {
      // Generic error message without exposing sensitive details
      toast.error('Verification failed');
    },
  });
}
