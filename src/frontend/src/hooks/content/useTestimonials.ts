import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Testimonial } from '../../backend';

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
