import { useState } from 'react';
import { usePageMeta } from '../../hooks/usePageMeta';
import { useAdminTestimonials } from '../../hooks/admin/useAdminTestimonials';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import AdminTestimonialsTable from '../../components/testimonials/AdminTestimonialsTable';
import AdminTestimonialFormDialog from '../../components/testimonials/AdminTestimonialFormDialog';
import type { Testimonial } from '../../backend';

export default function AdminTestimonialsPage() {
  usePageMeta('Manage Testimonials', 'Add, edit, and remove testimonials.');

  const { data: testimonials, isLoading } = useAdminTestimonials();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTestimonial(null);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Manage Testimonials</h1>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Testimonial
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading testimonials...</p>
      ) : (
        <AdminTestimonialsTable testimonials={testimonials || []} onEdit={handleEdit} />
      )}

      <AdminTestimonialFormDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        testimonial={editingTestimonial}
      />
    </div>
  );
}
