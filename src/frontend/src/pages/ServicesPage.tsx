import PageHeaderBanner from '../components/PageHeaderBanner';
import { usePageMeta } from '../hooks/usePageMeta';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function ServicesPage() {
  usePageMeta('Services', 'Flexible services for creative, practical, and everyday needs. Every service can be customized to fit your unique side quest.');

  const services = [
    {
      title: 'Digital Design & Creative Media',
      items: [
        'Branding & logo design',
        'Marketing graphics',
        'Social media content',
        'Photo & video editing',
        'Website layout design',
        'Digital content packages',
      ],
    },
    {
      title: 'Writing & Editorial',
      items: [
        'Business copy',
        'Content writing',
        'Creative writing',
        'Professional documents',
        'Editing & proofreading',
        'Scriptwriting',
      ],
    },
    {
      title: 'Social Media & Creator Support',
      items: [
        'Account setup',
        'Content planning',
        'Management assistance',
        'Creator organization',
      ],
    },
    {
      title: 'Physical Creative Goods',
      items: [
        'Cricut/vinyl items',
        'Print & paper projects',
        'Jewelry & accessories',
        'Decor items',
        'Memory projects',
        'Future: 3D-printed items',
      ],
    },
    {
      title: 'Home & In-Person Services (Local)',
      items: [
        'Cleaning services',
        'Organization',
        'Interior styling',
        'Event & holiday setup',
      ],
    },
    {
      title: 'Virtual Assistance & Administrative Support',
      items: [
        'Administrative tasks',
        'Digital organization',
        'Research assistance',
      ],
    },
    {
      title: 'Coaching, Mentorship & Skill Support',
      items: [
        'Creative coaching',
        'Productivity coaching',
        'Skill workshops',
      ],
    },
  ];

  return (
    <div>
      <PageHeaderBanner
        title="Flexible services for creative, practical, and everyday needs"
        subtitle="Every service can be customized. If you don't see exactly what you need, send a request."
      />

      <section className="py-16">
        <div className="container">
          <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title}>
                <CardHeader>
                  <CardTitle className="font-serif">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
              <p className="mb-4 text-lg font-medium">
                "If you can imagine it, we can explore how to create it."
              </p>
              <p className="text-muted-foreground">
                Many projects combine multiple categories. Don't hesitate to reach out with your
                unique needs—creativity isn't one skill, it's a collection of possibilities.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-serif text-xl font-semibold">
                Kentucky-Specific Guidance
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Physical items:</strong> Require sales tax permit for regular sales
                </li>
                <li>
                  <strong>Digital-only services:</strong> Usually do not require sales tax
                </li>
                <li>
                  <strong>In-person services:</strong> May require sales tax depending on service
                  type
                </li>
                <li>
                  <strong>Occupational license:</strong> Required once income is consistent
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                All services are provided in compliance with Kentucky state regulations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
