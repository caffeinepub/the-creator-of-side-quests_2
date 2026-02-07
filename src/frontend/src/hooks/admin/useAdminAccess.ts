import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

export function useListAdminUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAdminUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGrantAdminAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.grantAdminAccess(userPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Admin access granted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to grant admin access: ${error.message}`);
    },
  });
}

export function useRevokeAdminAccess() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.revokeAdminAccess(userPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('Admin access revoked successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to revoke admin access: ${error.message}`);
    },
  });
}
