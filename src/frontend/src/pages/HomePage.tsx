import { Link } from '@tanstack/react-router';
import { ArrowRight, Sparkles, Scroll, Wand2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import TexturedSection from '../components/TexturedSection';
import FlipCard from '../components/FlipCard';
import ShareButton from '../components/loyalty/ShareButton';
import EnterGiveawayCard from '../components/giveaway/EnterGiveawayCard';
import { usePageMeta } from '../hooks/usePageMeta';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HomePage() {
  usePageMeta('Home', 'Creative solutions for ideas that do not fit in a single box. Side quests accepted. Main quests optional.');

  const { identity } = useInternetIdentity();

  return (
    <div>
      <TexturedSection variant="hero" className="py-24 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 font-serif text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
              Side quests accepted. Main quests optional.
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Creative solutions for ideas that don't fit in a single box.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/contact">
                <Button size="lg" className="group">
                  Start Your Side Quest
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline">
                  Explore Services & Creations
                </Button>
              </Link>
            </div>
            <p className="mt-8 italic text-muted-foreground">
              "Where chaotic creativity meets intentional craftsmanship."
            </p>
          </div>
        </div>
      </TexturedSection>

      <section className="py-16">
        <div className="container">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold md:text-4xl">
            What We Offer
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <FlipCard
              front={
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Sparkles className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="font-serif text-xl font-semibold">Digital Design</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Branding, graphics, and content
                  </p>
                </div>
              }
              back={
                <div className="flex h-full flex-col justify-center text-sm">
                  <p className="mb-4">
                    From logos to social media content, we bring your digital vision to life with
                    creativity and precision.
                  </p>
                  <Link to="/services" className="text-primary hover:underline">
                    Learn more →
                  </Link>
                </div>
              }
            />
            <FlipCard
              front={
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Scroll className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="font-serif text-xl font-semibold">Writing & Editorial</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Words that work for you
                  </p>
                </div>
              }
              back={
                <div className="flex h-full flex-col justify-center text-sm">
                  <p className="mb-4">
                    Business copy, creative writing, editing, and more. Every word crafted with
                    intention.
                  </p>
                  <Link to="/services" className="text-primary hover:underline">
                    Learn more →
                  </Link>
                </div>
              }
            />
            <FlipCard
              front={
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Wand2 className="mb-4 h-12 w-12 text-primary" />
                  <h3 className="font-serif text-xl font-semibold">Physical Creations</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Handmade with care
                  </p>
                </div>
              }
              back={
                <div className="flex h-full flex-col justify-center text-sm">
                  <p className="mb-4">
                    Custom vinyl items, jewelry, decor, and memory projects. Tangible creativity for
                    your space.
                  </p>
                  <Link to="/shop" className="text-primary hover:underline">
                    Visit shop →
                  </Link>
                </div>
              }
            />
          </div>
        </div>
      </section>

      <TexturedSection variant="tile" className="py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 font-serif text-2xl font-semibold md:text-3xl">
              "If you can dream it, we can make it; if you've got a side quest, we can most likely achieve it."
            </p>
            <p className="text-lg text-muted-foreground">
              Creativity isn't one skill — it's a collection of possibilities.
            </p>
          </div>
        </div>
      </TexturedSection>

      {identity && (
        <section className="py-16">
          <div className="container">
            <div className="mx-auto max-w-2xl space-y-8">
              <div className="text-center">
                <h2 className="mb-4 font-serif text-3xl font-bold">Join the Community</h2>
                <p className="text-muted-foreground">
                  Share with friends and enter our giveaways to win exclusive items!
                </p>
              </div>
              <div className="flex justify-center">
                <ShareButton />
              </div>
              <EnterGiveawayCard />
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border/40 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold">Ready to Begin?</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Every project begins as a conversation. Let's turn your idea into something real.
            </p>
            <Link to="/contact">
              <Button size="lg">
                Start Your Side Quest
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
