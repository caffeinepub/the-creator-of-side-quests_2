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
import { ScrollArea } from '../../components/ui/scroll-area';

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
      <div className="flex min-h-[100dvh] flex-col md:flex-row">
        {/* Sidebar - stacks on top on mobile, side-by-side on md+ */}
        <aside className="w-full border-b border-border bg-card md:w-64 md:border-b-0 md:border-r">
          <div className="flex h-full flex-col">
            {/* Fixed header */}
            <div className="shrink-0 border-b border-border p-4 md:p-6">
              <h2 className="font-serif text-xl font-bold">Admin Panel</h2>
            </div>
            
            {/* Scrollable navigation */}
            <ScrollArea className="admin-nav-scroll flex-1">
              <nav className="space-y-1 p-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                      activeProps={{ className: 'bg-accent font-medium' }}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 break-words">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Main content - scrollable independently */}
        <main className="admin-main-scroll min-w-0 flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </AdminRouteGuard>
  );
}
