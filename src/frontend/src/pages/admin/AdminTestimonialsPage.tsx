import { usePageMeta } from '../../hooks/usePageMeta';

export default function AdminTestimonialsPage() {
  usePageMeta('Manage Testimonials', 'Add, edit, and remove testimonials.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Manage Testimonials</h1>
      <p className="text-muted-foreground">Testimonials management interface coming soon.</p>
    </div>
  );
}
