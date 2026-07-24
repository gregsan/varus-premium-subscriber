"use client"

import { useMemo, useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useInView,
  animate,
  type Variants,
} from 'framer-motion'
import {
  Truck,
  ShieldCheck,
  Percent,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  Box,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CheckoutSheet } from '@/components/checkout/checkout-sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { useSubscription } from '@/hooks/use-subscription'
import { TENANT_CONFIG } from '@/lib/tenant-config'
import {
  RETAIL_BENEFITS,
  PARTNER_OFFERS,
  INSURANCE_OFFERS,
  DIGITAL_SERVICES,
} from '@/lib/paywall-data'

type NodeKind = 'retail' | 'partner' | 'insurance' | 'digital'

type BenefitNode = {
  id: string
  kind: NodeKind
  title: string
  value: string
  description: string
  bullets: string[]
  bgIcon?: LucideIcon
  logo?: {
    initials: string
    color: string
  }
  accentClass: string
  size: 'sm' | 'md' | 'lg'
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

/**
 * GlassCard / GlassCardLight
 * overflow-hidden is REQUIRED here: without it, the inner accent
 * gradient and decorative background icon are rectangular and will
 * visually "poke out" past the rounded corners of the card, which is
 * exactly the jagged-corner bug from the screenshots.
 */
function GlassCard({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.07] backdrop-blur-2xl',
        'shadow-[0_12px_50px_rgba(0,0,0,0.24)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

function GlassCardLight({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[2rem] border border-black/[0.07] bg-white/70 backdrop-blur-2xl',
        'shadow-[0_10px_40px_rgba(0,0,0,0.06)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

function Spotlight() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 45, damping: 18 })
  const sy = useSpring(y, { stiffness: 45, damping: 18 })

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
        className="pointer-events-none absolute h-[620px] w-[620px] rounded-full opacity-20 blur-[110px]"
        style={{
          background: 'radial-gradient(circle, oklch(0.72 0.17 48) 0%, transparent 70%)',
          left: sx,
          top: sy,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </div>
  )
}

function Counter({ value, suffix = '', duration = 1.8 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(containerRef, { once: true, amount: 0.6 })

  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (!ref.current) return
        ref.current.textContent = `${Math.round(latest).toLocaleString('uk-UA')}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, value, suffix, duration])

  return (
    <div ref={containerRef}>
      <span ref={ref} className="text-3xl font-bold tracking-tight md:text-4xl">
        0{suffix}
      </span>
    </div>
  )
}

function buildNodes(): BenefitNode[] {
  const retailDescriptions: Record<string, string> = {
    delivery: 'Замовляйте продукти тоді, коли зручно — без додаткової плати за доставку в межах підписки.',
    bonus: 'Отримуйте більше бонусних балів з кожної покупки та швидше накопичуйте вигоду.',
  }

  const retailBullets: Record<string, string[]> = {
    delivery: ['Безкоштовна доставка в межах тарифу', 'Комфорт для щотижневих великих замовлень', 'Одна підписка — менше побутових витрат'],
    bonus: ['Підвищене нарахування балів', 'Швидше накопичення бонусів', 'Вигода на регулярних покупках'],
  }

  const partnerBullets = ['Додаткова користь поза супермаркетом', 'Знижки у щоденних сценаріях', 'Преміум-вигода не лише в Varus']
  const insuranceBullets = ['Працює як частина підписки', 'Захист у звичних життєвих ситуаціях', 'Оформлення та подання заявки в кабінеті']

  const retail: BenefitNode[] = RETAIL_BENEFITS.map((item, index) => ({
    id: item.id,
    kind: 'retail',
    title: item.label,
    value: item.value,
    description: retailDescriptions[item.id] ?? 'Щоденна вигода для покупок у мережі Varus.',
    bullets: retailBullets[item.id] ?? ['Перевага в рамках підписки', 'Доступно одразу після активації', 'Створено для регулярних покупок'],
    bgIcon: item.icon,
    accentClass: 'from-orange-500/20 via-orange-400/10 to-transparent',
    size: index === 0 ? 'lg' : 'md',
  }))

  const partner: BenefitNode[] = PARTNER_OFFERS.map((item, index) => ({
    id: item.id,
    kind: 'partner',
    title: item.label,
    value: item.value,
    description: 'Партнерська пропозиція, яка розширює цінність підписки за межами супермаркету.',
    bullets: partnerBullets,
    bgIcon: item.icon,
    accentClass: 'from-amber-500/20 via-yellow-400/10 to-transparent',
    size: index === 0 ? 'sm' : 'md',
  }))

  const insurance: BenefitNode[] = INSURANCE_OFFERS.map((item) => ({
    id: item.id,
    kind: 'insurance',
    title: item.label,
    value: item.value,
    description: 'Страховий модуль у складі підписки для більш спокійного повсякденного користування сервісом.',
    bullets: insuranceBullets,
    bgIcon: item.icon,
    accentClass: 'from-emerald-500/20 via-teal-400/10 to-transparent',
    size: 'md',
  }))

  const digital: BenefitNode[] = DIGITAL_SERVICES.map((item, index) => ({
    id: item.id,
    kind: 'digital',
    title: item.name,
    value: 'Входить у підписку',
    description: item.description,
    bullets: item.features,
    bgIcon: Box,
    logo: { initials: item.initials, color: item.color },
    accentClass: 'from-violet-500/20 via-fuchsia-400/10 to-transparent',
    size: index === 0 ? 'lg' : 'sm',
  }))

  return [...retail, ...partner, ...insurance, ...digital]
}

function getKindLabel(kind: NodeKind) {
  switch (kind) {
    case 'retail':
      return 'Вигода в Varus'
    case 'partner':
      return 'Партнерська пропозиція'
    case 'insurance':
      return 'Страхування'
    case 'digital':
      return 'Цифровий сервіс'
  }
}

function NodeCard({ node, onOpen }: { node: BenefitNode; onOpen: (node: BenefitNode) => void }) {
  const BgIcon = node.bgIcon ?? ShoppingBag
  const large = node.size === 'lg'
  const medium = node.size === 'md'

  return (
    <motion.button
      type="button"
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => onOpen(node)}
      className={[
        'group relative text-left',
        large ? 'md:col-span-2 md:row-span-2 min-h-[320px]' : medium ? 'min-h-[280px]' : 'min-h-[240px]',
      ].join(' ')}
    >
      <GlassCardLight className="h-full p-6 md:p-7">
        {/* accent gradient + decorative icon live INSIDE the overflow-hidden card now */}
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${node.accentClass}`} />
        <div className="pointer-events-none absolute -right-8 -top-6 opacity-[0.08] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
          {node.logo ? (
            <div
              className="flex h-36 w-36 items-center justify-center rounded-[2rem] text-5xl font-black text-white shadow-2xl"
              style={{ backgroundColor: node.logo.color }}
            >
              {node.logo.initials}
            </div>
          ) : (
            <BgIcon className="h-36 w-36 text-foreground" strokeWidth={1.2} />
          )}
        </div>

        <div className="relative flex h-full flex-col justify-between">
          <div>
            <span className="inline-flex rounded-full border border-black/8 bg-white/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
              {getKindLabel(node.kind)}
            </span>
            <h3 className={['mt-4 max-w-[16ch] font-semibold tracking-tight', large ? 'text-3xl leading-[1.02]' : 'text-xl'].join(' ')}>
              {node.title}
            </h3>
            <p className="mt-3 max-w-[34ch] text-sm text-muted-foreground">{node.description}</p>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Перевага</p>
              <p className={['font-semibold text-primary', large ? 'text-2xl' : 'text-lg'].join(' ')}>{node.value}</p>
            </div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white/70 text-foreground backdrop-blur-md transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </GlassCardLight>
    </motion.button>
  )
}

/**
 * BenefitModal
 * Widened to max-w-[92vw] / sm:2xl / md:3xl / lg:4xl so two-column
 * content (bullet list + benefit summary) has room to breathe.
 * max-h-[88vh] + overflow-y-auto prevents content from being clipped
 * at the bottom on shorter screens/mobile.
 */
function BenefitModal({ node, open, onOpenChange }: { node: BenefitNode | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-full max-w-[92vw] overflow-y-auto overflow-x-hidden rounded-[2rem] border border-white/10 bg-[oklch(0.12_0_0)] p-0 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
        {node && (
          <div className="relative">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${node.accentClass}`} />
            <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.08]">
              {node.logo ? (
                <div
                  className="flex h-44 w-44 items-center justify-center rounded-[2.5rem] text-6xl font-black text-white"
                  style={{ backgroundColor: node.logo.color }}
                >
                  {node.logo.initials}
                </div>
              ) : node.bgIcon ? (
                <node.bgIcon className="h-44 w-44" strokeWidth={1} />
              ) : null}
            </div>

            <div className="relative p-6 md:p-10">
              <div>
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60 backdrop-blur-sm">
                  {getKindLabel(node.kind)}
                </span>
                <DialogTitle className="mt-4 max-w-[28ch] text-3xl font-semibold tracking-tight md:text-4xl">
                  {node.title}
                </DialogTitle>
                <DialogDescription className="mt-3 max-w-[56ch] text-sm text-white/60">
                  {node.description}
                </DialogDescription>
              </div>

              <GlassCard className="mt-8 border-white/10 bg-white/[0.05] p-5 md:p-7">
                <div className="grid gap-6 md:grid-cols-[1.4fr_0.6fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">Що входить</p>
                    <ul className="mt-4 space-y-3">
                      {node.bullets.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/45">Перевага</p>
                    <p className="mt-3 break-words text-3xl font-bold text-primary">{node.value}</p>
                    <p className="mt-4 text-sm text-white/55">
                      Ця вигода активується в межах підписки {TENANT_CONFIG.brandName} і доповнює щоденний користувацький досвід.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default function SubscribeDesktopPage() {
  const router = useRouter()
  const { status, hydrated } = useSubscription()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedNode, setSelectedNode] = useState<BenefitNode | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const nodes = useMemo(() => buildNodes(), [])

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.22])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const isActive = hydrated && (status === 'active' || status === 'cancelling')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 z-50 w-full">
        <div className="mx-auto mt-4 flex h-14 max-w-5xl items-center justify-between rounded-full border border-white/10 bg-white/70 px-6 shadow-lg backdrop-blur-xl">
          <span className="text-base font-bold tracking-tight">{TENANT_CONFIG.brandName}</span>
          <div className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#highlights" className="transition-colors hover:text-foreground">Переваги</a>
            <a href="#faq" className="transition-colors hover:text-foreground">Умови</a>
          </div>
          {isActive ? (
            <Button size="sm" className="rounded-full" disabled>Мій кабінет</Button>
          ) : (
            <Button size="sm" className="rounded-full" disabled>Спробувати за 1 грн</Button>
          )}
        </div>
      </nav>

      <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-[oklch(0.11_0_0)] text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div className="absolute -left-40 -top-40 h-[560px] w-[560px] rounded-full bg-[oklch(0.66_0.17_48)] opacity-30 blur-[130px]" animate={{ x: [0, 50, 0], y: [0, 40, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute right-[-15%] top-1/4 h-[480px] w-[480px] rounded-full bg-[oklch(0.78_0.15_140)] opacity-15 blur-[120px]" animate={{ x: [0, -40, 0], y: [0, 50, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-[-20%] left-1/3 h-[420px] w-[420px] rounded-full bg-[oklch(0.7_0.12_20)] opacity-20 blur-[110px]" animate={{ x: [0, 30, 0], y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,black_10%,transparent_70%)]" />
          <Spotlight />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-20 text-center">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/70 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {TENANT_CONFIG.planName} · новий рівень шопінгу
          </motion.span>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-4xl text-6xl font-semibold leading-[0.98] tracking-tight md:text-7xl">
            Продуктовий шопінг
            <br />
            <span className="bg-gradient-to-r from-[oklch(0.78_0.17_48)] via-[oklch(0.7_0.17_48)] to-[oklch(0.6_0.17_48)] bg-clip-text text-transparent">переосмислений</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 max-w-xl text-lg text-white/55">
            Знижки, доставка, страхування та улюблені сервіси — все зібрано в одній підписці {TENANT_CONFIG.brandName}.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            {isActive ? (
              <Button size="lg" className="h-14 rounded-full px-8 text-base shadow-[0_0_40px_rgba(245,131,31,0.35)]" disabled>
                Перейти в кабінет
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button size="lg" className="h-14 rounded-full px-8 text-base shadow-[0_0_40px_rgba(245,131,31,0.35)]" disabled>
                Спробувати за 1 грн
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <br />
            <span className="text-sm text-white/45">1 грн перший місяць · 199 грн/місяць далі</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50, rotateX: 8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }} whileHover={{ rotateX: -2, rotateY: 2, scale: 1.01 }} style={{ perspective: 1000 }} className="mt-16 w-full max-w-3xl">
            <GlassCard className="p-8 md:p-10">
              <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
                <div className="text-left">
                  <p className="text-sm text-white/50">Тариф</p>
                  <p className="mt-1 text-2xl font-semibold">{TENANT_CONFIG.brandName}</p>
                  <p className="mt-3 text-4xl font-bold">1 грн<span className="ml-2 text-base font-normal text-white/50">перший місяць, потім 199 грн/міс</span></p>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    { icon: Percent, label: 'Знижки до 10%' },
                    { icon: Truck, label: 'Безкоштовна доставка' },
                    { icon: ShieldCheck, label: 'Страхування' },
                    { icon: Sparkles, label: 'Партнерські сервіси' },
                  ].map(({ icon: Icon, label }) => (
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
      </section>

      <section className="py-10">
        <div className="mx-auto grid max-w-5xl gap-4 px-6 md:grid-cols-3">
          {[
            { value: 35000, suffix: '+', label: 'грн вигоди на рік' },
            { value: 10, suffix: '%', label: 'знижка на покупки' },
            { value: 5, suffix: '', label: 'сервісів у підписці' },
          ].map((item) => (
            <GlassCard key={item.label} className="border-white/8 bg-white/60 p-5 text-center text-foreground shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              <Counter value={item.value} suffix={item.suffix} />
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section id="highlights" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="mb-14 max-w-2xl">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Усі переваги в одному просторі</h2>
          <p className="mt-4 text-muted-foreground">
            Ми зібрали вигоди з магазину, партнерські пропозиції, страхування і цифрові сервіси в єдину систему переваг. Натисніть на будь-який блок, щоб подивитися деталі.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger} className="grid auto-rows-[minmax(240px,auto)] gap-4 md:grid-cols-3">
          {nodes.map((node) => (
            <NodeCard key={`${node.kind}-${node.id}`} node={node} onOpen={setSelectedNode} />
          ))}
        </motion.div>
      </section>

      <section id="faq" className="relative overflow-hidden bg-[oklch(0.11_0_0)] py-32 text-white">
        <div className="pointer-events-none absolute inset-0">
          <motion.div className="absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[oklch(0.66_0.17_48)] opacity-25 blur-[150px]" animate={{ opacity: [0.2, 0.35, 0.2] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={fadeUp} className="relative mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
          <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">Почніть економити вже сьогодні</h2>
          <p className="mt-4 text-white/55">Перший місяць — 1 грн. Далі 199 грн/місяць.</p>
          {isActive ? (
            <Button size="lg" className="mt-8 h-14 rounded-full px-8 text-base shadow-[0_0_40px_rgba(245,131,31,0.35)]" disabled>Мій кабінет</Button>
          ) : (
            <Button size="lg" className="mt-8 h-14 rounded-full px-8 text-base shadow-[0_0_40px_rgba(245,131,31,0.35)]" disabled>Спробувати за 1 грн</Button>
          )}
        </motion.div>
      </section>

      <BenefitModal node={selectedNode} open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)} />
      <CheckoutSheet open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </div>
  )
}
