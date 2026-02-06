import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Testimonial } from '../../backend';
import { toast } from 'sonner';

export function useTestimonials() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTestimonials();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addTestimonial(testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Thank you for your testimonial!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit testimonial: ${error.message}`);
    },
  });
}
