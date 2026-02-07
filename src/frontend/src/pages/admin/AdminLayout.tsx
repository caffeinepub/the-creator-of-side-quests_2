import { Outlet, Link } from '@tanstack/react-router';
import AdminRouteGuard from '../../components/auth/AdminRouteGuard';
import { 
  LayoutDashboard, 
  Package, 
  Image, 
  MessageSquare, 
  Share2, 
  Mail, 
  Tag, 
  Award, 
  Gift, 
  Settings,
  CreditCard,
  Users,
  ShieldCheck
} from 'lucide-react';

export default function AdminLayout() {
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/portfolio', label: 'Portfolio', icon: Image },
    { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
    { to: '/admin/social-links', label: 'Social Links', icon: Share2 },
    { to: '/admin/contact-requests', label: 'Contact Requests', icon: Mail },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    { to: '/admin/loyalty-rewards', label: 'Loyalty Rewards', icon: Award },
    { to: '/admin/giveaways', label: 'Giveaways', icon: Gift },
    { to: '/admin/policies-fulfillment', label: 'Policies & Fulfillment', icon: Settings },
    { to: '/admin/stripe-setup', label: 'Stripe Setup', icon: CreditCard },
    { to: '/admin/access', label: 'Access', icon: Users },
    { to: '/admin/verification-codes', label: 'Verification Codes', icon: ShieldCheck },
  ];

  return (
    <AdminRouteGuard>
      <div className="flex min-h-screen">
        <aside className="w-64 border-r border-border bg-card">
          <div className="p-6">
            <h2 className="font-serif text-xl font-bold">Admin Panel</h2>
          </div>
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                  activeProps={{ className: 'bg-accent font-medium' }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </AdminRouteGuard>
  );
}
