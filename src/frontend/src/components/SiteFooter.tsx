import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import SocialIconLinks from './SocialIconLinks';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
                About
              </Link>
              <Link to="/services" className="text-sm text-muted-foreground hover:text-primary">
                Services
              </Link>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">
                Shop
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Connect</h3>
            <SocialIconLinks />
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold">Start Your Quest</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Ready to turn your side quest into reality?
            </p>
            <Link to="/contact">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with <Heart className="inline h-4 w-4 text-destructive" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
