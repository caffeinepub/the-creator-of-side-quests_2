import { useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import PageHeaderBanner from '../components/PageHeaderBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useSubmitContactRequest } from '../hooks/contact/useContactRequests';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import SocialIconLinks from '../components/SocialIconLinks';
import { Principal } from '@dfinity/principal';

export default function ContactPage() {
  usePageMeta('Contact', 'Start your next side quest. Get in touch to discuss your project, request a quote, or just say hello.');

  const search = useSearch({ strict: false }) as { productId?: string };
  const submitRequest = useSubmitContactRequest();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    timeline: '',
    budget: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitRequest.mutateAsync({
        id: `contact-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        projectType: formData.projectType || undefined,
        timeline: formData.timeline || undefined,
        budget: formData.budget || undefined,
        description: formData.description,
        productId: search.productId,
        status: 'pending',
        submittedAt: BigInt(Date.now() * 1000000),
        submittedBy: Principal.anonymous(),
      });

      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        projectType: '',
        timeline: '',
        budget: '',
        description: '',
      });
    } catch (error) {
      console.error('Failed to submit contact request:', error);
    }
  };

  return (
    <div>
      <PageHeaderBanner
        title="Start your next side quest"
        subtitle="Every project begins as a conversation. Let's turn your idea into something real."
      />

      <section className="py-8 sm:py-16">
        <div className="container px-4">
          <div className="mx-auto max-w-2xl">
            {submitted && (
              <Alert className="mb-6 sm:mb-8">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Request Submitted!</AlertTitle>
                <AlertDescription>
                  Thank you for reaching out. We'll respond within 24–72 hours.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-1.5 text-base"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1.5 text-base"
                />
              </div>

              <div>
                <Label htmlFor="projectType" className="text-sm sm:text-base">Project Type</Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                >
                  <SelectTrigger id="projectType" className="mt-1.5 text-base">
                    <SelectValue placeholder="Select a project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="digital-design">Digital Design</SelectItem>
                    <SelectItem value="writing">Writing & Editorial</SelectItem>
                    <SelectItem value="physical-goods">Physical Goods</SelectItem>
                    <SelectItem value="in-person">In-Person Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline" className="text-sm sm:text-base">Timeline</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="e.g., 2 weeks, flexible, ASAP"
                  className="mt-1.5 text-base"
                />
              </div>

              <div>
                <Label htmlFor="budget" className="text-sm sm:text-base">Budget</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="e.g., $100-$500, flexible"
                  className="mt-1.5 text-base"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm sm:text-base">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  required
                  placeholder="Tell us about your side quest..."
                  className="mt-1.5 text-base resize-none"
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={submitRequest.isPending}>
                {submitRequest.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>

            <div className="mt-8 sm:mt-12 border-t border-border pt-6 sm:pt-8">
              <h3 className="mb-3 sm:mb-4 font-serif text-lg sm:text-xl font-semibold">Or reach out directly</h3>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base text-muted-foreground">
                You can also message us on social media:
              </p>
              <SocialIconLinks />
            </div>

            <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm italic text-muted-foreground">
              "Every project begins as a conversation."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
