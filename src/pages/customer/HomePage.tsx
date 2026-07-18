import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Quote } from 'lucide-react';
import { useGetProductsQuery } from '@/services/productsApi';
import { useParallax, useHeroIntro, useSectionReveal } from '@/lib/scrollfx';
import { DEITIES } from '@/utils/constants';
import { SectionHeading } from '@/components/shop/SectionHeading';
import { ProductCard } from '@/components/shop/ProductCard';
import { TrustSignals } from '@/components/shop/TrustSignals';
import { NewsletterForm } from '@/components/shop/NewsletterForm';
import { CtaLink } from '@/components/shop/LuxeCta';
import { OmSymbol } from '@/components/shop/Logo';
import { RevealGroup, RevealItem, Reveal } from '@/components/shop/Reveal';
import { SkeletonCard } from '@/components/ui/Skeleton';

/* Featured deity collections shown on the homepage grid. */
const FEATURED_DEITIES = ['radha-krishna', 'mahadev', 'shri-ram', 'ganesh-ji', 'maa-durga', 'buddha-artwork'];

const TESTIMONIALS = [
  {
    quote:
      'The Radha Krishna canvas transformed our living room into a place of calm. The framing is flawless — you can feel the care in it.',
    name: 'Priya Sharma',
    city: 'Jaipur',
  },
  {
    quote:
      'Ordered a Mahadev print for my father. The colours are deep and serene, nothing loud. Exactly the reverence we hoped for.',
    name: 'Arjun Mehta',
    city: 'Pune',
  },
  {
    quote:
      'Beautifully packed, delivered on time, and the gold-accented frame feels far more premium than the price suggests.',
    name: 'Lakshmi Iyer',
    city: 'Chennai',
  },
];

export default function HomePage() {
  const { data: products, isLoading } = useGetProductsQuery({ active_only: true });
  const bestsellers = products?.slice(0, 8) ?? [];

  return (
    <div>
      <Hero />

      {/* ——— Featured deity collections ——— */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="collections-heading">
        <SectionHeading
          eyebrow="Sacred Collections"
          title="Shop by Deity"
          description="Fourteen devotional collections, each curated around a single divine presence — from Vrindavan's eternal love to the stillness of Kailash."
        />
        <RevealGroup className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3" stagger={0.09}>
          {FEATURED_DEITIES.map((slug) => {
            const deity = DEITIES.find((d) => d.slug === slug)!;
            return (
              <RevealItem key={deity.slug}>
                <Link
                  to={`/products?deity=${deity.slug}`}
                  className="focus-ring group relative block overflow-hidden bg-primary-800"
                  aria-label={`Explore the ${deity.name} collection`}
                >
                  <div className="relative aspect-[4/5] sm:aspect-[3/4]">
                    {/* Layered devotional monogram in lieu of imagery until catalog photos load */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-primary-800 via-primary-900 to-primary-950 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-[1.05]">
                      <span className="font-display select-none text-6xl text-accent-500/25 transition-colors duration-700 group-hover:text-accent-500/40 sm:text-7xl">
                        {deity.salutation.length <= 2 ? deity.salutation : 'ॐ'}
                      </span>
                    </div>
                    <div className="veil-divine absolute inset-0" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <p className="font-accent mb-1.5 text-2xs uppercase tracking-luxe text-accent-400">
                        {deity.salutation}
                      </p>
                      <h3 className="font-display text-xl font-medium text-surface-50 sm:text-2xl">
                        {deity.name}
                      </h3>
                      <p className="font-accent mt-3 inline-flex items-center gap-2 text-2xs uppercase tracking-luxe text-surface-300 transition-colors duration-400 group-hover:text-accent-400">
                        Explore Collection
                        <ArrowRight className="h-3 w-3 transition-transform duration-400 group-hover:translate-x-1" aria-hidden="true" />
                      </p>
                    </div>
                    {/* gold hairline frame */}
                    <div className="pointer-events-none absolute inset-3 border border-accent-500/0 transition-colors duration-700 group-hover:border-accent-500/35" />
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
        <Reveal className="mt-12 text-center">
          <CtaLink to="/products" variant="outline">
            View All Fourteen Collections
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </CtaLink>
        </Reveal>
      </section>

      {/* ——— Bestsellers carousel ——— */}
      <section className="bg-cream py-20 sm:py-28" aria-labelledby="bestsellers-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Most Loved"
            title="Bestselling Artworks"
            description="The pieces our devotees return to — museum-grade prints and hand-finished frames."
          />
          <BestsellerCarousel isLoading={isLoading}>
            {bestsellers.map((product) => (
              <div key={product.id} className="w-[78vw] shrink-0 snap-start sm:w-80">
                <ProductCard product={product} />
              </div>
            ))}
          </BestsellerCarousel>
        </div>
      </section>

      {/* ——— Craft story band (GSAP scroll reveal) ——— */}
      <CraftStory />

      {/* ——— Trust signals ——— */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8" aria-label="Why shop with us">
        <TrustSignals />
      </section>

      {/* ——— Testimonials ——— */}
      <section className="bg-cream py-20 sm:py-28" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Voices of Devotion"
            title="From Their Sacred Spaces"
          />
          <RevealGroup className="grid gap-6 md:grid-cols-3" stagger={0.12}>
            {TESTIMONIALS.map((t) => (
              <RevealItem key={t.name}>
                <figure className="flex h-full flex-col border border-surface-200 bg-surface-50 p-8">
                  <Quote className="mb-5 h-5 w-5 text-accent-500" aria-hidden="true" />
                  <blockquote className="font-display flex-1 text-lg italic leading-relaxed text-primary-600">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-surface-200 pt-5">
                    <span className="font-accent block text-2xs font-medium uppercase tracking-luxe text-primary-700">
                      {t.name}
                    </span>
                    <span className="mt-1 block text-xs text-surface-500">{t.city}</span>
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ——— Newsletter invitation ——— */}
      <section className="relative overflow-hidden bg-primary-900 py-20 sm:py-24" aria-labelledby="newsletter-heading">
        <div className="gradient-mesh absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6">
          <OmSymbol className="mb-6 text-4xl text-accent-500" />
          <h2 id="newsletter-heading" className="font-display text-3xl font-medium text-surface-50 sm:text-4xl">
            Bring Home a Daily Blessing
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-surface-400">
            Join our circle for new artwork releases, festival collections and
            quiet reflections — never noise, only grace.
          </p>
          <div className="mt-9 flex w-full justify-center">
            <NewsletterForm onDark />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================================================================
   HERO — full-screen divine artwork, GSAP parallax + intro timeline
   ================================================================ */

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  useHeroIntro(heroRef);
  useParallax(artRef, { yPercent: 14 });

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-primary-950"
      aria-label="Ashirwad Digitals — devotional art"
    >
      {/* Artwork layer (parallax) */}
      <div ref={artRef} className="absolute inset-0" aria-hidden="true">
        <div className="gradient-hero absolute inset-0" />
        <div className="gradient-mesh absolute inset-0" />
        {/* Radiant mandala rings behind the om */}
        <svg
          viewBox="0 0 800 800"
          className="absolute left-1/2 top-1/2 h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
          fill="none"
        >
          {[120, 190, 260, 330].map((r) => (
            <circle key={r} cx="400" cy="400" r={r} stroke="var(--color-accent-500)" strokeWidth="0.75" />
          ))}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 24;
            return (
              <line
                key={i}
                x1={400 + Math.cos(a) * 330}
                y1={400 + Math.sin(a) * 330}
                x2={400 + Math.cos(a) * 352}
                y2={400 + Math.sin(a) * 352}
                stroke="var(--color-accent-500)"
                strokeWidth="0.75"
              />
            );
          })}
        </svg>
        <span className="font-display absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[38vmin] leading-none text-accent-500/[0.12]">
          ॐ
        </span>
        {/* Bottom veil for text legibility */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary-950 to-transparent" />
      </div>

      {/* Copy */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p data-hero-seq className="eyebrow mb-6 !text-accent-400">
            Museum-Grade Devotional Art
          </p>
          <h1
            data-hero-seq
            className="font-display text-5xl font-medium leading-[1.08] text-surface-50 sm:text-6xl lg:text-display"
          >
            Divine Art for
            <span className="block italic text-accent-400">Sacred Spaces</span>
          </h1>
          <p data-hero-seq className="mt-7 max-w-lg text-base leading-relaxed text-surface-300">
            Hand-finished frames, archival canvas and fine-art posters of
            Shri Ram, Radha Krishna, Mahadev and more — crafted to bring
            stillness into your home.
          </p>
          <div data-hero-seq className="mt-10 flex flex-wrap items-center gap-4">
            <CtaLink to="/products" variant="gold" size="lg">
              Explore the Collection
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </CtaLink>
            <CtaLink to="/about" variant="outline-light" size="lg">
              Our Craft
            </CtaLink>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2" aria-hidden="true">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="h-12 w-px bg-gradient-to-b from-transparent via-accent-500 to-transparent"
        />
      </div>
    </section>
  );
}

/* ================================================================
   BESTSELLER CAROUSEL — horizontal snap scroll with arrow controls
   ================================================================ */

function BestsellerCarousel({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: reduced ? 'auto' : 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Bestselling artworks carousel"
        tabIndex={0}
      >
        {children}
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => scrollBy(-1)}
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-surface-300 text-primary-600 transition-colors duration-400 hover:border-accent-500 hover:text-accent-700"
          aria-label="Previous artworks"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => scrollBy(1)}
          className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-surface-300 text-primary-600 transition-colors duration-400 hover:border-accent-500 hover:text-accent-700"
          aria-label="Next artworks"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ================================================================
   CRAFT STORY — dark band, GSAP scroll-triggered reveal
   ================================================================ */

function CraftStory() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section ref={ref} className="relative overflow-hidden bg-primary-900 py-24 sm:py-32" aria-labelledby="craft-heading">
      <div className="gradient-mesh absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
        <div>
          <p data-reveal className="eyebrow mb-5">
            The Ashirwad Craft
          </p>
          <h2 data-reveal id="craft-heading" className="font-display text-3xl font-medium leading-tight text-surface-50 sm:text-4xl lg:text-5xl">
            Every frame leaves our studio
            <span className="italic text-accent-400"> blessed by patient hands</span>
          </h2>
          <p data-reveal className="mt-7 max-w-xl text-sm leading-relaxed text-surface-400 sm:text-base">
            We print on archival, gallery-weight media with pigment inks rated
            for a hundred years. Frames are cut, joined and finished by
            artisans — then inspected under natural light before they are
            wrapped for their journey to your home temple.
          </p>
          <div data-reveal className="mt-10">
            <CtaLink to="/about" variant="outline-light">
              Read Our Story
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </CtaLink>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-12">
          {[
            { value: '100 yr', label: 'Archival pigment rating' },
            { value: '14', label: 'Devotional collections' },
            { value: '4.9 ★', label: 'Average devotee rating' },
            { value: '25k+', label: 'Homes graced across India' },
          ].map((stat) => (
            <div key={stat.label} data-reveal className="border-l border-accent-500/40 pl-6">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-4xl font-medium text-accent-400 sm:text-5xl">{stat.value}</dd>
              <dd className="font-accent mt-2 text-2xs uppercase tracking-luxe text-surface-400">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
