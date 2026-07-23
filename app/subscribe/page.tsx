'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Zap,
  MousePointer2,
  Package,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileFrame } from '@/components/mobile-frame'
import { RetailBenefitsBlock } from '@/components/paywall/retail-benefits-block'
import { PartnerOffersBlock } from '@/components/paywall/partner-offers-block'
import { InsuranceBlock } from '@/components/paywall/insurance-block'
import { DigitalServicesBlock } from '@/components/paywall/digital-services-block'
import { CheckoutSheet } from '@/components/checkout/checkout-sheet'
import { useSubscription } from '@/hooks/use-subscription'

const PERKS = [
  { icon: Package, label: 'Знижки' },
  { icon: Truck, label: 'Доставка' },
  { icon: Shield, label: 'Страхування' },
  { icon: Zap, label: 'Сервіси' },
]

export default function SubscribePage() {
  const router = useRouter()
  const { status, hydrated } = useSubscription()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const offersRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'active' || status === 'cancelling') {
      // show banner instead — handled inline below
    }
  }, [status])

  const scrollToOffers = () => {
    offersRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const isActive = hydrated && (status === 'active' || status === 'cancelling')

  return (
    <MobileFrame>
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 pt-6 pb-4 space-y-4"
      >
        {/* Banner card */}
        <div
          className="relative rounded-3xl overflow-hidden min-h-[360px] flex flex-col justify-between p-6"
          style={{
            background: 'linear-gradient(155deg, #ffe8c8 0%, #ffd199 30%, #f5a44a 60%, #e07020 100%)',
          }}
        >
          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,255,255,0.35) 0%, transparent 70%)',
            }}
          />

          {/* Decorative carousel arrows */}
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center">
              <ChevronLeft className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="h-8 w-8 rounded-full bg-white/30 flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-3">
            <h1 className="text-4xl font-extrabold text-white drop-shadow-sm tracking-tight">
              ВСІ ПЕРЕВАГИ
            </h1>
            <span className="bg-[#2563EB] text-white font-extrabold text-sm px-4 py-1.5 rounded-full">
              В ОДНІЙ ПІДПИСЦІ
            </span>
            <p className="text-sm text-white/90 max-w-[240px] leading-relaxed">
              Один тариф — безліч вигод для твого щоденного життя
            </p>
          </div>

          {/* Mascot placeholder */}
          {/* Replace with <Image src="/mascot.png" ... /> when ready */}
          <div className="relative z-10 h-24 w-24 mx-auto rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center">
            <span className="text-3xl">🛒</span>
          </div>

          <div className="relative z-10 flex justify-center mt-2">
            <Button
              onClick={scrollToOffers}
              className="rounded-full bg-[#F5831F] hover:bg-[#F5831F]/90 text-white font-bold shadow-lg gap-2"
            >
              <MousePointer2 className="h-4 w-4" />
              Дивитись переваги
            </Button>
          </div>
        </div>

        {/* Offer card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45, ease: 'easeOut' }}
          className="rounded-3xl border border-border bg-card shadow-md p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
              Преміум тариф
            </span>
          </div>

          <div>
            <h2 className="text-[28px] font-extrabold leading-tight">Varus Premium</h2>
          </div>

          <div className="flex items-baseline gap-1 flex-wrap">
            <span className="text-4xl font-extrabold text-primary">1 грн</span>
            <span className="text-sm text-muted-foreground">перший місяць, потім</span>
            <span className="font-bold">199 грн/місяць</span>
          </div>

          <div className="flex items-center gap-2 bg-accent border border-primary/20 rounded-xl px-3 py-2">
            <Zap className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm font-semibold text-foreground">35 000+ грн/рік загальної вигоди</span>
          </div>

          <p className="text-sm text-muted-foreground">
            Всі переваги преміум-клієнта в одній підписці
          </p>

          <div className="grid grid-cols-4 gap-2">
            {PERKS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {isActive ? (
            <div className="space-y-2">
              <div className="rounded-xl bg-accent border border-primary/20 p-3 text-sm font-semibold text-center text-primary">
                У вас вже є активна підписка
              </div>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => router.push('/dashboard')}
              >
                Перейти в кабінет
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                className="w-full h-12 rounded-full font-bold text-base"
                onClick={() => setCheckoutOpen(true)}
              >
                Спробувати за 1 грн
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={scrollToOffers}
              >
                Дізнатися більше
              </Button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Content blocks */}
      <div ref={offersRef} className="px-4 pb-36 space-y-4">
        <RetailBenefitsBlock />
        <PartnerOffersBlock />
        <InsuranceBlock />
        <DigitalServicesBlock />
      </div>

      {/* Sticky CTA bar */}
      {!isActive && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className="w-full max-w-[560px] pointer-events-auto">
            <div className="mx-0 border-t border-border bg-background/95 px-5 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md">
              <Button
                className="w-full h-12 rounded-full font-bold text-base"
                onClick={() => setCheckoutOpen(true)}
              >
                Спробувати за 1 грн
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Перший місяць — 1 грн. Потім 199 грн/місяць. Скасувати будь-коли.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <CheckoutSheet open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </MobileFrame>
  )
}
