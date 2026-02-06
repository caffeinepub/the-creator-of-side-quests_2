import { usePageMeta } from '../../hooks/usePageMeta';
import { Card, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Package, Image, MessageSquare, Mail } from 'lucide-react';

export default function AdminHomePage() {
  usePageMeta('Admin Dashboard', 'Manage your website content and settings.');

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <Package className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage shop inventory</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Image className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Showcase your work</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Testimonials</CardTitle>
            <CardDescription>Client feedback</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Mail className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Contact Requests</CardTitle>
            <CardDescription>Manage inquiries</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Welcome to Your Admin Panel</CardTitle>
            <CardDescription>
              Use the navigation on the left to manage your website content, products, and settings.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
