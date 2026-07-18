import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Reveal } from '@/components/shop/Reveal';
import { CtaButton } from '@/components/shop/LuxeCta';
import { contactFormSchema, type ContactFormData } from '@/utils/validators';

const CONTACT_INFO = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: Mail, label: 'Email', value: 'info@ashirwaddigitals.com', href: 'mailto:info@ashirwaddigitals.com' },
  { icon: MapPin, label: 'Studio', value: 'Shop No. 5, Main Road, City, State – 000000', href: undefined },
];

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    // Simulate sending — in production, hook up to a real endpoint
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Message received — we'll write back within a day.");
    reset();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Temple-themed subtle background */}
      <span
        className="font-display pointer-events-none absolute -right-16 top-24 select-none text-[18rem] leading-none text-accent-500/[0.06]"
        aria-hidden="true"
      >
        ॐ
      </span>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <Reveal className="mb-14 max-w-2xl">
          <p className="eyebrow mb-4">Namaste</p>
          <h1 className="font-display text-4xl font-medium leading-tight text-primary-700 sm:text-5xl">
            We would love to hear from you
          </h1>
          <div className="hairline-gold mt-6 w-24" />
          <p className="mt-6 max-w-lg text-base leading-relaxed text-surface-500">
            A question about an artwork, a custom devotional commission, or simply a hello — every message reaches a
            real person at the studio.
          </p>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          {/* ——— Contact details ——— */}
          <Reveal delay={0.1} className="lg:col-span-1">
            <ul className="space-y-8">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent-300 text-accent-600">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-accent mb-1 text-2xs font-medium uppercase tracking-luxe text-surface-400">
                      {label}
                    </h2>
                    {href ? (
                      <a
                        href={href}
                        className="focus-ring text-sm font-medium text-primary-700 transition-colors duration-400 hover:text-accent-700"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium leading-relaxed text-primary-700">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="hairline-gold my-10" />
            <p className="text-sm leading-relaxed text-surface-500">
              Studio hours — Monday to Saturday, 10 am to 7 pm IST. Closed on major festival days, so our artisans can
              celebrate them too.
            </p>
          </Reveal>

          {/* ——— Form ——— */}
          <Reveal delay={0.2} className="lg:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="border border-surface-200 bg-cream p-7 shadow-card sm:p-10"
              aria-label="Contact form"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Your Name *"
                  placeholder="Full name"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register('name')}
                />
                <Input
                  label="Email *"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              <div className="mt-5">
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>
              <div className="mt-5">
                <Textarea
                  label="Message *"
                  placeholder="Tell us about the artwork or occasion…"
                  rows={6}
                  error={errors.message?.message}
                  {...register('message')}
                />
              </div>
              <div className="mt-8">
                <CtaButton type="submit" variant="gold" size="lg" disabled={isSubmitting}>
                  <Send className="h-4 w-4" aria-hidden="true" />
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </CtaButton>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
