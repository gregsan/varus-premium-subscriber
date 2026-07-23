'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type Variants,
} from 'framer-motion'
import {
  Truck,
  ShieldCheck,
  Percent,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CheckoutSheet } from '@/components/checkout/checkout-sheet'
import { useSubscription } from '@/hooks/use-subscription'
import { TENANT_CONFIG } from '@/lib/tenant-config'
import {
  RETAIL_BENEFITS,
  PARTNER_OFFERS,
  INSURANCE_OFFERS,
  DIGITAL_SERVICES,
} from '@/lib/paywall-data'

const PERKS = [
  { icon: Percent, label: 'Знижки до 10%' },
  { icon: Truck, label: 'Безкоштовна доставка' },
  { icon: ShieldCheck, label: 'Страхування' },
  { icon: Sparkles, label: 'Партнерські сервіси' },
]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/** Glass card used across the page — consistent frosted-glass look */
function GlassCard({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] ${className}`}
    >
      {children}
    </div>
  )
}

/** Light-mode glass card for sections on white background */
function GlassCardLight({
  className = '',
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`rounded-3xl border border-black/[0.06] bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] ${className}`}
    >
      {children}
    </div>
  )
}

/** Cursor-reactive spotlight for the hero — subtle premium touch */
function Spotlight() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 50, damping: 20 })
  const sy = useSpring(y, { stiffness: 50, damping: 20 })

  return (
    <div
      className="absolute inset-0"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - rect.left)
        y.set(e.clientY - rect.top)
      }}
    >
      <motion.div
        className="pointer-events-none absolute h-[600px] w-[600px] rounded-full opacity-20 blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, oklch(0.72 0.17 48) 0%, transparent 70%)',
          left: sx,
          top: sy,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  )
}

/** Animated counter for the stat strip */
function StatNumber({ value, suffix = '' }: { value: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl font-bold tracking-tight md:text-4xl"
    >
      {value}
      <span className="text-primary">{suffix}</span>
    </motion.span>
  )
}

export default function SubscribeDesktopPage() {
  const router = useRouter()
  const { status, hydrated } = useSubscription()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.2])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  const isActive = hydrated && (status === 'active' || status === 'cancelling')

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------- NAV ---------- */}
      <nav className="fixed top-0 z-50 w-full">
        <div className="mx-auto mt-4 flex h-14 max-w-5xl items-center justify-between rounded-full border border-white/10 bg-white/70 px-6 shadow-lg backdrop-blur-xl dark:bg-black/40">
          <span className="text-base font-bold tracking-tight">
            {TENANT_CONFIG.brandName}
          </span>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#benefits" className="transition-colors hover:text-foreground">Переваги</a>
            <a href="#services" className="transition-colors hover:text-foreground">Сервіси</a>
            <a href="#faq" className="transition-colors hover:text-foreground">Питання</a>
          </div>
          {isActive ? (
            <Button size="sm" className="rounded-full" onClick={() => router.push('/dashboard')}>
              Мій кабінет
            </Button>
          ) : (
            <Button size="sm" className="rounded-full" onClick={() => setCheckoutOpen(true)}>
              Спробувати за 1 грн
            </Button>
          )}
        </div>
      </nav>

      {/* ---------- HERO ---------- */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden bg-[oklch(0.11_0_0)] text-white"
      >
        {/* Layered ambient gradient mesh */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-[oklch(0.66_0.17_48)] opacity-30 blur-[130px]"
            animate={{ x: [0, 50, 0], y: [0, 40, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute right-[-15%] top-1/4 h-[480px] w-[480px] rounded-full bg-[oklch(0.78_0.15_140)] opacity-15 blur-[120px]"
            animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[-20%] left-1/3 h-[420px] w-[420px] rounded-full bg-[oklch(0.7_0.12_20)] opacity-20 blur-[110px]"
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Grain / noise-style grid overlay for texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black_10%,transparent_70%)]" />
          <Spotlight />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-20 text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/70 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {TENANT_CONFIG.planName} · новий рівень шопінгу
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl text-6xl font-semibold leading-[0.98] tracking-tight md:text-7xl"
          >
            Продуктовий шопінг
            <br />
            <span className="bg-gradient-to-r from-[oklch(0.78_0.17_48)] via-[oklch(0.7_0.17_48)] to-[oklch(0.6_0.17_48)] bg-clip-text text-transparent">
              переосмислений
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-xl text-lg text-white/55"
          >
            Знижки, доставка, страхування та улюблені сервіси — все зібрано в
            одній підписці {TENANT_CONFIG.brandName}.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            {isActive ? (
              <Button
                size="lg"
                className="h-14 rounded-full px-8 text-base shadow-[0_0_40px_rgba(245,131,31,0.35)]"
                onClick={() => router.push('/dashboard')}
              >
                Перейти в кабінет
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                className="h-14 rounded-full px-8 text-base shadow-[0_0_40px_rgba(245,131,31,0.35)]"
                onClick={() => setCheckoutOpen(true)}
              >
                Спробувати за 1 грн
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <span className="text-sm text-white/45">
              1 грн перший місяць · 199 грн/місяць далі · скасування в 1 клік
            </span>
          </motion.div>

          {/* Floating glass price card with tilt-on-hover */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
            whileHover={{ rotateX: -2, rotateY: 2, scale: 1.01 }}
            style={{ perspective: 1000 }}
            className="mt-16 w-full max-w-3xl"
          >
            <GlassCard className="p-8 md:p-10">
              <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                <div className="text-left">
                  <p className="text-sm text-white/50">Тариф</p>
                  <p className="mt-1 text-2xl font-semibold">{TENANT_CONFIG.brandName}</p>
                  <p className="mt-3 text-4xl font-bold">
                    1 грн
                    <span className="ml-2 text-base font-normal text-white/50">
                      перший місяць, потім 199 грн/міс
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {PERKS.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-white/80">
                      <Icon className="h-4 w-4 text-primary" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-widest text-white/30"
        >
          Гортай нижче
        </motion.div>
      </section>

      {/* ---------- STAT STRIP ---------- */}
      <section className="border-y border-border bg-secondary/30 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 text-center md:grid-cols-4">
          {[
            { value: '35 000', suffix: '+ грн/рік', label: 'вигоди на рік' },
            { value: '10', suffix: '%', label: 'знижка на покупки' },
            { value: '5', suffix: ' сервісів', label: 'у подарунок' },
            { value: '1', suffix: ' клік', label: 'на скасування' },
          ].map((s) => (
            <div key={s.label}>
              <StatNumber value={s.value} suffix={s.suffix} />
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- BENEFITS — asymmetric bento grid ---------- */}
      <section id="benefits" className="mx-auto max-w-6xl px-6 py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-16 max-w-xl"
        >
          <h2 className="text-4xl font-semibold tracking-tight">
            Переваги в мережі Varus
          </h2>
          <p className="mt-3 text-muted-foreground">
            Знижки та бонуси, які працюють щоразу, коли ви заходите в магазин
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-4 md:grid-cols-3 md:[grid-template-rows:repeat(2,minmax(0,1fr))]"
        >
          {RETAIL_BENEFITS.map(({ id, icon: Icon, label, value }, i) => (
            <motion.div
              key={id}
              variants={scaleIn}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={
                i === 0
                  ? 'md:col-span-2 md:row-span-2'
                  : ''
              }
            >
              <GlassCardLight
                className={`group h-full p-7 transition-shadow hover:shadow-xl ${
                  i === 0 ? 'flex flex-col justify-between' : ''
                }`}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-6 w-6" />
                </div>
                <p className={i === 0 ? 'text-xl font-medium' : 'font-medium'}>{label}</p>
                <p className={i === 0 ? 'mt-3 text-4xl font-bold text-primary' : 'mt-1 text-2xl font-semibold text-primary'}>
                  {value}
                </p>
              </GlassCardLight>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------- PARTNER OFFERS — horizontal scroll marquee feel ---------- */}
      <section className="overflow-hidden bg-[oklch(0.11_0_0)] py-28 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="mb-16 flex items-end justify-between"
          >
            <div>
              <h2 className="text-4xl font-semibold tracking-tight">
                Пропозиції від партнерів
              </h2>
              <p className="mt-3 text-white/50">
                Вигідні умови поза мережею Varus
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PARTNER_OFFERS.map(({ id, icon: Icon, label, value }) => (
              <motion.div key={id} variants={fadeUp} whileHover={{ y: -6, scale: 1.02 }}>
                <GlassCard className="h-full p-6">
                  <Icon className="mb-4 h-6 w-6 text-primary" />
                  <p className="font-medium text-white/90">{label}</p>
                  <p className="mt-1 text-lg font-semibold text-primary">{value}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- INSURANCE ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="mb-16 max-w-xl"
        >
          <h2 className="text-4xl font-semibold tracking-tight">
            Страхування, яке завжди з вами
          </h2>
          <p className="mt-3 text-muted-foreground">
            Спокій на кожен день — без додаткової оплати
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {INSURANCE_OFFERS.map(({ id, icon: Icon, label, value }) => (
            <motion.div key={id} variants={fadeUp} whileHover={{ y: -6 }}>
              <GlassCardLight className="flex h-full items-start gap-4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{value}</p>
                </div>
              </GlassCardLight>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ---------- DIGITAL SERVICES ---------- */}
      <section id="services" className="bg-secondary/30 py-28">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
            className="mb-16 max-w-xl"
          >
            <h2 className="text-4xl font-semibold tracking-tight">
              Цифрові сервіси в подарунок
            </h2>
            <p className="mt-3 text-muted-foreground">
              Стрімінг, книги, фітнес та трекер калорій — без додаткової оплати
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {DIGITAL_SERVICES.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeUp}
                whileHover={{ y: -10, transition: { duration: 0.25 } }}
              >
                <GlassCardLight className="h-full p-6 transition-shadow hover:shadow-2xl">
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-lg"
                    style={{ backgroundColor: service.color }}
                  >
                    {service.initials}
                  </div>
                  <p className="font-semibold">{service.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                  <ul className="mt-4 space-y-1.5">
                    {service.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </GlassCardLight>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section id="faq" className="relative overflow-hidden bg-[oklch(0.11_0_0)] py-32 text-white">
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[oklch(0.66_0.17_48)] opacity-25 blur-[150px]"
            animate={{ opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="relative mx-auto flex max-w-2xl flex-col items-center px-6 text-center"
        >
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Почніть економити вже сьогодні
          </h2>
          <p className="mt-4 text-white/55">
            Перший місяць — 1 грн. Далі 199 грн/місяць. Скасувати можна будь-коли в один клік.
          </p>
          {isActive ? (
            <Button
              size="lg"
              className="mt-8 h-14 rounded-full px-8 text-base shadow-[0_0_40px_rgba(245,131,31,0.35)]"
              onClick={() => router.push('/dashboard')}
            >
              Мій кабінет
            </Button>
          ) : (
            <Button
              size="lg"
              className="mt-8 h-14 rounded-full px-8 text-base shadow-[0_0_40px_rgba(245,131,31,0.35)]"
              onClick={() => setCheckoutOpen(true)}
            >
              Спробувати за 1 грн
            </Button>
          )}
        </motion.div>
      </section>

      <CheckoutSheet open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  )
}