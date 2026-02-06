import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ShopPage from './pages/ShopPage';
import PortfolioPage from './pages/PortfolioPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import HoursPoliciesPage from './pages/HoursPoliciesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage';
import AdminTestimonialsPage from './pages/admin/AdminTestimonialsPage';
import AdminSocialLinksPage from './pages/admin/AdminSocialLinksPage';
import AdminContactRequestsPage from './pages/admin/AdminContactRequestsPage';
import AdminCouponsPage from './pages/admin/AdminCouponsPage';
import AdminLoyaltyRewardsPage from './pages/admin/AdminLoyaltyRewardsPage';
import AdminGiveawaysPage from './pages/admin/AdminGiveawaysPage';
import AdminPoliciesFulfillmentPage from './pages/admin/AdminPoliciesFulfillmentPage';
import AdminStripeSetupPage from './pages/admin/AdminStripeSetupPage';
import SiteLayout from './components/SiteLayout';
import AdminLayout from './pages/admin/AdminLayout';
import { Toaster } from './components/ui/sonner';
import ProfileSetupModal from './components/auth/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: SiteLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesPage,
});

const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop',
  component: ShopPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop/$productId',
  component: ProductDetailPage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: PortfolioPage,
});

const testimonialsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/testimonials',
  component: TestimonialsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const hoursPoliciesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hours-policies',
  component: HoursPoliciesPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const adminRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLayout,
});

const adminHomeRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/',
  component: AdminHomePage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/products',
  component: AdminProductsPage,
});

const adminPortfolioRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/portfolio',
  component: AdminPortfolioPage,
});

const adminTestimonialsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/testimonials',
  component: AdminTestimonialsPage,
});

const adminSocialLinksRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/social-links',
  component: AdminSocialLinksPage,
});

const adminContactRequestsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/contact-requests',
  component: AdminContactRequestsPage,
});

const adminCouponsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/coupons',
  component: AdminCouponsPage,
});

const adminLoyaltyRewardsRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/loyalty-rewards',
  component: AdminLoyaltyRewardsPage,
});

const adminGiveawaysRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/giveaways',
  component: AdminGiveawaysPage,
});

const adminPoliciesFulfillmentRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/policies-fulfillment',
  component: AdminPoliciesFulfillmentPage,
});

const adminStripeSetupRoute = createRoute({
  getParentRoute: () => adminRootRoute,
  path: '/stripe-setup',
  component: AdminStripeSetupPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  shopRoute,
  productDetailRoute,
  portfolioRoute,
  testimonialsRoute,
  contactRoute,
  hoursPoliciesRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  adminRootRoute.addChildren([
    adminHomeRoute,
    adminProductsRoute,
    adminPortfolioRoute,
    adminTestimonialsRoute,
    adminSocialLinksRoute,
    adminContactRequestsRoute,
    adminCouponsRoute,
    adminLoyaltyRewardsRoute,
    adminGiveawaysRoute,
    adminPoliciesFulfillmentRoute,
    adminStripeSetupRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <ProfileSetupModal />
      <Toaster />
    </ThemeProvider>
  );
}
