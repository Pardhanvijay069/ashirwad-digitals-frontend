import { Truck, RefreshCcw, PackageCheck } from 'lucide-react';
import { SectionHeading } from '@/components/shop/SectionHeading';
import { Accordion } from '@/components/shop/Accordion';
import { Reveal } from '@/components/shop/Reveal';
import { TrustSignals } from '@/components/shop/TrustSignals';

const SHIPPING_ITEMS = [
  {
    title: 'How long does delivery take?',
    content: (
      <p>
        Every artwork is printed and framed to order. Studio time is 2–4 working days, and insured delivery adds
        2–6 days depending on your pincode. You receive a tracking token the moment your order is placed, and you can
        follow each stage — design review, printing, ready, delivered — on the Track Order page.
      </p>
    ),
  },
  {
    title: 'How is my artwork packed?',
    content: (
      <p>
        Prints travel in rigid archival tubes; framed pieces are corner-guarded, wrapped in acid-free tissue, then
        double-boxed with impact padding. Every parcel is insured door to door.
      </p>
    ),
  },
  {
    title: 'Do you deliver across India?',
    content: <p>Yes — we deliver to every serviceable pincode in India. Delivery charges, if any, are confirmed with your order.</p>,
  },
  {
    title: 'What if my order arrives damaged?',
    content: (
      <p>
        Photograph the parcel and the piece within 48 hours of delivery and share it with us. We replace transit-damaged
        artworks free of charge — no forms, no arguing. It is our blessed guarantee.
      </p>
    ),
  },
  {
    title: 'Can I return or exchange a piece?',
    content: (
      <p>
        Because each piece is made to order, we accept returns only for damage or a printing fault. If something feels
        wrong with your artwork, write to us within 7 days — we will make it right, whether that means a reprint or a
        replacement.
      </p>
    ),
  },
  {
    title: 'Can I cancel my order?',
    content: (
      <p>
        Orders can be cancelled while they are in the pending or design-review stage — call or message us with your
        order number. Once printing begins, materials are committed and cancellation is no longer possible.
      </p>
    ),
  },
];

export default function ShippingReturnsPage() {
  return (
    <div>
      <section className="gradient-hero relative overflow-hidden">
        <div className="gradient-mesh absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
          <p className="eyebrow mb-4 !text-accent-400">Care, in Transit</p>
          <h1 className="font-display text-4xl font-medium text-surface-50 sm:text-5xl">Shipping & Returns</h1>
          <div className="hairline-gold mx-auto mt-6 w-24" />
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-surface-300">
            Sacred art deserves a careful journey. Here is exactly how your piece travels — and what we promise if
            anything goes wrong.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal>
          <ul className="mb-16 grid gap-8 sm:grid-cols-3">
            {[
              { icon: PackageCheck, title: 'Made to Order', desc: '2–4 days in the studio' },
              { icon: Truck, title: 'Insured Delivery', desc: '2–6 days across India' },
              { icon: RefreshCcw, title: 'Blessed Guarantee', desc: 'Free replacement for damage' },
            ].map(({ icon: Icon, title, desc }) => (
              <li key={title} className="text-center">
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-accent-300 text-accent-600">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="font-accent mb-1 text-2xs font-medium uppercase tracking-luxe text-primary-700">{title}</h2>
                <p className="text-xs text-surface-500">{desc}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <SectionHeading eyebrow="Everything You May Ask" title="The Details" align="left" className="mb-8" />
        <Accordion items={SHIPPING_ITEMS} />
      </div>

      <section className="border-t border-surface-200 bg-surface-100/60">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <TrustSignals />
        </div>
      </section>
    </div>
  );
}
