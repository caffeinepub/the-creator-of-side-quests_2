import { useState } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useCreateTestimonial } from '../../hooks/content/useTestimonials';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUser';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import MossyStarRating from './MossyStarRating';
import { Plus } from 'lucide-react';

export default function CreateTestimonyDialog() {
  const { identity, login } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const createTestimonial = useCreateTestimonial();

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      try {
        await login();
      } catch (error) {
        console.error('Login failed:', error);
      }
      return;
    }

    if (!author.trim() || !content.trim() || rating === 0) {
      return;
    }

    const testimonial = {
      id: `testimonial-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: author.trim(),
      content: content.trim(),
      rating: BigInt(rating),
      createdAt: BigInt(Date.now() * 1000000),
    };

    await createTestimonial.mutateAsync(testimonial);
    setOpen(false);
    setRating(5);
    setAuthor('');
    setContent('');
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && userProfile?.name) {
      setAuthor(userProfile.name);
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Create Testimony
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg sm:text-xl">Share Your Experience</DialogTitle>
              <DialogDescription className="text-sm">
                {!isAuthenticated
                  ? 'Please sign in to share your testimonial.'
                  : 'Tell us about your experience working with us.'}
              </DialogDescription>
            </DialogHeader>

            {!isAuthenticated ? (
              <div className="py-6">
                <Button type="button" onClick={login} className="w-full">
                  Sign In to Continue
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="rating">Rating *</Label>
                    <MossyStarRating rating={rating} onRatingChange={setRating} size="lg" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="author">Your Name *</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="text-base"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="content">Your Testimonial *</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your experience..."
                      rows={5}
                      required
                      className="text-base resize-none"
                    />
                  </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={createTestimonial.isPending}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createTestimonial.isPending || !author.trim() || !content.trim()}
                    className="w-full sm:w-auto"
                  >
                    {createTestimonial.isPending ? 'Submitting...' : 'Submit Testimonial'}
                  </Button>
                </DialogFooter>
              </>
            )}
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
