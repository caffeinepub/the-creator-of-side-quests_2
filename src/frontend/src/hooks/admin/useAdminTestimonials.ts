import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Testimonial } from '../../backend';
import { toast } from 'sonner';

export function useAdminTestimonials() {
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

export function useAddTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addTestimonial(testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial added successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to add testimonial: ${error.message}`);
    },
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateTestimonial(testimonial);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update testimonial: ${error.message}`);
    },
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteTestimonial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success('Testimonial deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete testimonial: ${error.message}`);
    },
  });
}
