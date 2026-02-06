import PageHeaderBanner from '../components/PageHeaderBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function HoursPoliciesPage() {
  usePageMeta('Hours & Policies', 'Transparency builds trust. Learn about our hours, policies, and service guidelines.');

  return (
    <div>
      <PageHeaderBanner
        title="Transparency builds trust"
        subtitle="Our hours, policies, and commitment to you"
      />

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Monday–Thursday:</strong> Available for inquiries and consultations
                </p>
                <p className="mt-2">
                  <strong>Friday–Sunday:</strong> Reserved for project work
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Response time: 24–72 hours for all inquiries
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Payments & Quotes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>All quotes are individualized based on project scope and requirements.</p>
                <p>
                  Physical items require upfront material costs. Digital platforms and local
                  arrangements accepted for payment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Service Scope & Licensing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  We offer only legal creative, decorative, and support services. Certain
                  specialized licensed services (e.g., medical, legal, financial advice) are not
                  offered.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Returns & Adjustments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Custom projects have limited return options due to their personalized nature.
                </p>
                <p>
                  Reasonable adjustments and corrections are encouraged and will be handled on a
                  case-by-case basis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Local Service Area</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  In-person services are limited to the <strong>Ashland/Westwood area of Kentucky</strong>,
                  scheduling permitting.
                </p>
                <p>
                  Physical items require local pickup or dropoff coordination. Shipping is not
                  currently available but may be added in the future.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Respect & Community</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  We maintain a strict anti-discrimination policy and are committed to providing
                  professional, inclusive service to all clients.
                </p>
                <p>
                  Mutual respect, clear communication, and trust are the foundation of every
                  project.
                </p>
              </CardContent>
            </Card>

            <p className="mt-8 text-center italic text-muted-foreground">
              "Creative work is built on trust, clarity, and communication."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
