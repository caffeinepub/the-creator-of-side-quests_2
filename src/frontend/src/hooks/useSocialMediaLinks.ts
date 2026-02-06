import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SocialMediaLink } from '../backend';

export function useSocialMediaLinks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SocialMediaLink[]>({
    queryKey: ['socialMediaLinks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSocialMediaLinks();
    },
    enabled: !!actor && !actorFetching,
  });
}
