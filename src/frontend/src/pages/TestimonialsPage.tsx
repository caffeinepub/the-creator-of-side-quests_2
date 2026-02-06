import PageHeaderBanner from '../components/PageHeaderBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import { useTestimonials } from '../hooks/content/useTestimonials';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import MossyStarRating from '../components/testimonials/MossyStarRating';
import CreateTestimonyDialog from '../components/testimonials/CreateTestimonyDialog';

export default function TestimonialsPage() {
  usePageMeta('Testimonials', 'See what our clients have to say about working with us.');
  const { data: testimonials, isLoading } = useTestimonials();

  return (
    <div>
      <PageHeaderBanner
        title="Testimonials"
        subtitle="Hear from those who've embarked on side quests with us"
      />

      <section className="py-16">
        <div className="container">
          <div className="mb-8 flex justify-center">
            <CreateTestimonyDialog />
          </div>

          {isLoading && <p className="text-center">Loading testimonials...</p>}

          {testimonials && testimonials.length === 0 && (
            <p className="text-center text-muted-foreground">No testimonials yet. Be the first to share your experience!</p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials?.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-semibold">{testimonial.author}</h3>
                    <MossyStarRating rating={Number(testimonial.rating)} readonly size="sm" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
