import { Link } from '@tanstack/react-router';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import LoginButton from './auth/LoginButton';
import LoyaltyBadge from './loyalty/LoyaltyBadge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsPermanentlyLocked } from '../hooks/admin/useAdminVerificationStatus';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isLocked, isLoading: isLockStatusLoading, isFetched } = useIsPermanentlyLocked();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
    { to: '/shop', label: 'Shop' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/contact', label: 'Contact' },
    { to: '/hours-policies', label: 'Hours & Policies' },
  ];

  // Hide Admin link if:
  // 1. User is not authenticated (anonymous)
  // 2. Lockout status is still loading or not yet fetched (prevents flash)
  // 3. User is permanently locked out
  const showAdminLink = !!identity && isFetched && !isLockStatusLoading && !isLocked;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2 sm:space-x-3" onClick={closeMobileMenu}>
          <img
            src="/assets/generated/logo-crest.dim_512x512.png"
            alt="The Creator of Side Quests"
            className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0"
          />
          <span className="hidden font-serif text-base sm:text-lg font-semibold sm:inline-block">
            The Creator of Side Quests
          </span>
        </Link>

        <nav className="hidden items-center space-x-4 lg:space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
              activeProps={{ className: 'text-primary' }}
            >
              {link.label}
            </Link>
          ))}
          {showAdminLink && (
            <Link
              to="/admin"
              className="text-sm font-medium transition-colors hover:text-primary whitespace-nowrap"
              activeProps={{ className: 'text-primary' }}
            >
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {identity && <LoyaltyBadge />}
          <LoginButton />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex-shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/40 bg-background md:hidden">
          <nav className="container flex flex-col space-y-3 py-4 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                activeProps={{ className: 'text-primary' }}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            {showAdminLink && (
              <Link
                to="/admin"
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                activeProps={{ className: 'text-primary' }}
                onClick={closeMobileMenu}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
