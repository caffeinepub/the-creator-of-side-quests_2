import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminSocialLinksPage() {
  usePageMeta('Manage Social Links', 'Update your social media links.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Social Links</h1>
      <p className="text-muted-foreground">Social links management interface coming soon.</p>
    </div>
  );
}
