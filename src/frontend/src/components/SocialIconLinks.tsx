import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from 'react-icons/si';
import { useSocialMediaLinks } from '../hooks/useSocialMediaLinks';

export default function SocialIconLinks() {
  const { data: links, isLoading } = useSocialMediaLinks();

  if (isLoading) {
    return <div className="flex space-x-4">Loading...</div>;
  }

  const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    facebook: SiFacebook,
    instagram: SiInstagram,
    tiktok: SiTiktok,
    youtube: SiYoutube,
  };

  return (
    <div className="flex space-x-4">
      {links?.map((link) => {
        const Icon = platformIcons[link.platform.toLowerCase()];
        if (!Icon) return null;

        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-primary"
            aria-label={`Visit our ${link.platform} page`}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
}
