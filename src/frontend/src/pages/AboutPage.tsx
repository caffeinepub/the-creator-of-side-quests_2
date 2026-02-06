import PageHeaderBanner from '../components/PageHeaderBanner';
import { usePageMeta } from '../hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta('About', 'Built from curiosity, creativity, and controlled chaos. Meet Joseph Fitchpatrick, a neurodivergent multi-disciplinary creative.');

  return (
    <div>
      <PageHeaderBanner
        title="Built from curiosity, creativity, and controlled chaos"
        subtitle="Meet the creator behind the side quests"
      />

      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            <div>
              <h2 className="mb-4 font-serif text-2xl font-semibold">About Joseph Fitchpatrick</h2>
              <p className="mb-4 text-lg leading-relaxed">
                Hi, I'm Joseph Fitchpatrick—though you might know me as Joe or Willow. I'm a
                neurodivergent, multi-disciplinary creative who thrives in the space where structure
                meets spontaneity. As someone who is autistic, ADHD, and OCD, I've learned that what
                some might call "chaos" is actually a unique way of seeing connections others miss.
              </p>
              <p className="mb-4 text-lg leading-relaxed">
                My experiences shape a detail-focused, empathetic workflow that honors both the big
                picture and the tiny details that make projects shine. I believe creativity isn't
                just one skill—it's a collection of possibilities waiting to be explored.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-serif text-xl font-semibold">Vision</h3>
              <p className="leading-relaxed">
                To create a world where every idea—no matter how unconventional—has a place to
                flourish. Where side quests are celebrated as much as main quests, and creativity is
                accessible to everyone.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-serif text-xl font-semibold">Mission</h3>
              <p className="leading-relaxed">
                To provide flexible, personalized creative services that meet clients where they
                are. Whether you need digital design, physical creations, writing support, or
                something entirely unique, I'm here to help turn your side quest into reality.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-serif text-xl font-semibold">Emission Statement</h3>
              <p className="leading-relaxed">
                I emit energy, enthusiasm, and empathy into every project. My work radiates
                authenticity, attention to detail, and a genuine desire to help others bring their
                ideas to life. Controlled chaos becomes intentional craftsmanship.
              </p>
            </div>

            <div className="space-y-4 border-l-4 border-primary pl-6">
              <p className="italic text-lg">
                "Where chaotic creativity meets intentional craftsmanship."
              </p>
              <p className="italic text-lg">"Side quests accepted. Main quests optional."</p>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold">The Side Quest Philosophy</h3>
              <p className="leading-relaxed">
                Not every project fits neatly into a category. Sometimes the most meaningful work
                happens in the margins—the side quests that don't follow a traditional path but lead
                to something uniquely yours. That's where I thrive, and that's where I can help you
                most.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
