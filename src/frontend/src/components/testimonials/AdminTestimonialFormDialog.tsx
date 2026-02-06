import { useState, useEffect } from 'react';
import { useAddTestimonial, useUpdateTestimonial } from '../../hooks/admin/useAdminTestimonials';
import type { Testimonial } from '../../backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import MossyStarRating from './MossyStarRating';

interface AdminTestimonialFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial | null;
}

export default function AdminTestimonialFormDialog({
  open,
  onOpenChange,
  testimonial,
}: AdminTestimonialFormDialogProps) {
  const addTestimonial = useAddTestimonial();
  const updateTestimonial = useUpdateTestimonial();

  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const isEditing = !!testimonial;

  useEffect(() => {
    if (testimonial) {
      setRating(Number(testimonial.rating));
      setAuthor(testimonial.author);
      setContent(testimonial.content);
    } else {
      setRating(5);
      setAuthor('');
      setContent('');
    }
  }, [testimonial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!author.trim() || !content.trim() || rating === 0) {
      return;
    }

    const testimonialData: Testimonial = {
      id: testimonial?.id || `testimonial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: author.trim(),
      content: content.trim(),
      rating: BigInt(rating),
      createdAt: testimonial?.createdAt || BigInt(Date.now() * 1000000),
    };

    if (isEditing) {
      await updateTestimonial.mutateAsync(testimonialData);
    } else {
      await addTestimonial.mutateAsync(testimonialData);
    }

    onOpenChange(false);
  };

  const isPending = addTestimonial.isPending || updateTestimonial.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update the testimonial details.' : 'Create a new testimonial.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating *</Label>
              <MossyStarRating rating={rating} onRatingChange={setRating} size="lg" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author">Author Name *</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Testimonial Content *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter testimonial content..."
                rows={5}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !author.trim() || !content.trim()}>
              {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
