import { Hand, Sparkles, HeartHandshake } from 'lucide-react';
import { SectionHeading } from '@/components/shop/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '@/components/shop/Reveal';
import { NewsletterForm } from '@/components/shop/NewsletterForm';
import { OmSymbol } from '@/components/shop/Logo';
import { CtaLink } from '@/components/shop/LuxeCta';

const VALUES = [
  {
    icon: Hand,
    title: 'Artisan Hands',
    desc: 'Every frame is cut, joined and finished by craftspeople who treat each piece as seva — service, not just work.',
  },
  {
    icon: Sparkles,
    title: 'Museum Standards',
    desc: 'Archival pigment inks, 100-year colour fidelity, art-grade glazing. The divine deserves permanence.',
  },
  {
    icon: HeartHandshake,
    title: 'Devotion First',
    desc: 'We begin each production day with a small prayer. It sounds old-fashioned. It is — deliberately.',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* ——— Story hero ——— */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="gradient-mesh absolute inset-0 opacity-60" aria-hidden="true" />
        <span
          className="font-display pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 select-none text-[14rem] leading-none text-accent-500/10"
          aria-hidden="true"
        >
          ॐ
        </span>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 !text-accent-400">Our Story</p>
            <h1 className="font-display text-4xl font-medium leading-tight text-surface-50 sm:text-5xl lg:text-6xl">
              A modern temple
              <span className="block italic text-accent-400">of art</span>
            </h1>
            <div className="hairline-gold mt-8 w-24" />
            <p className="mt-8 max-w-lg text-base leading-relaxed text-surface-300">
              Ashirwad Digitals began as a small printing studio with one conviction — that the images we pray to
              deserve the same care as the art the world hangs in galleries.
            </p>
          </div>
        </div>
      </section>

      {/* ——— Brand story ——— */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <Reveal>
          <div className="prose-devotional space-y-6 text-base leading-relaxed">
            <p>
              In most homes, the mandir holds the most loved corner of the house — and, too often, the most faded
              print. Mass-produced posters curl at the edges, colours drift to orange, frames chip. We felt that
              mismatch deeply: the most sacred image in the home was the least cared for.
            </p>
            <p>
              So we rebuilt our studio around a single discipline: devotional art, produced to museum standards.
              Archival inks that hold their depth for generations. Hand-finished hardwood frames. Colour work that
              respects the iconography — Mahadev's ash-grey stillness, Vrindavan's dusk, the gold of Maa Lakshmi —
              without turning it loud.
            </p>
            <p>
              Every order is reviewed by a person before it is printed, blessed with a moment of quiet before it is
              packed, and insured until it reaches your door. That is the whole business model. It has not changed
              since day one.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <figure className="mt-14 border-l-2 border-accent-400 pl-6">
            <blockquote className="font-display text-2xl italic leading-relaxed text-primary-700">
              “We do not sell posters. We frame prayers.”
            </blockquote>
            <figcaption className="font-accent mt-4 text-2xs uppercase tracking-luxe text-surface-400">
              — The Ashirwad Studio
            </figcaption>
          </figure>
        </Reveal>
      </section>

      {/* ——— Values ——— */}
      <section className="border-y border-surface-200 bg-surface-100/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <SectionHeading
            eyebrow="What Guides Us"
            title="Craft as Devotion"
            description="Three principles shape every artwork that leaves our studio."
          />
          <RevealGroup className="grid gap-10 sm:grid-cols-3" stagger={0.12}>
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <RevealItem key={title} className="text-center">
                <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-accent-300 text-accent-600">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display mb-3 text-xl font-medium text-primary-700">{title}</h3>
                <p className="mx-auto max-w-[30ch] text-sm leading-relaxed text-surface-500">{desc}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ——— Invitation ——— */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8">
        <Reveal>
          <OmSymbol className="mx-auto mb-8 h-10 w-10 text-accent-500" />
          <h2 className="font-display mx-auto max-w-xl text-3xl font-medium leading-tight text-primary-700 sm:text-4xl">
            Bring home a piece of the divine
          </h2>
          <div className="mt-10">
            <CtaLink to="/products" variant="gold" size="lg">
              Explore the Gallery
            </CtaLink>
          </div>
        </Reveal>
      </section>

      {/* ——— Newsletter ——— */}
      <section className="border-t border-surface-200 bg-surface-100/60">
        <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-display mb-3 text-2xl font-medium text-primary-700">Letters from the Studio</h2>
          <p className="mb-8 text-sm leading-relaxed text-surface-500">
            New collections, festival editions and quiet notes on devotional art. Once a month, never more.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
