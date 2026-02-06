import { useMutation } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Coupon } from '../../backend';

export function useValidateCoupon() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (code: string): Promise<Coupon | null> => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateCoupon(code);
    },
  });
}
