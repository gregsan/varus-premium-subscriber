'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Smartphone, Check, Loader2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useSubscription } from '@/hooks/use-subscription'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { SubscriptionState } from '@/lib/subscription-store'

type Step = 'method' | 'card-form' | 'processing' | 'success'
type PaymentMethod = SubscriptionState['paymentMethod']

interface CheckoutContentProps {
  onClose: () => void
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

function CheckoutContent({ onClose }: CheckoutContentProps) {
  const router = useRouter()
  const { activateSubscription } = useSubscription()
  const [step, setStep] = useState<Step>('method')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')

  const runProcessing = (method: PaymentMethod) => {
    setSelectedMethod(method)
    setStep('processing')
    setTimeout(() => {
      activateSubscription(method)
      setStep('success')
      setTimeout(() => {
        onClose()
        router.push('/dashboard')
      }, 3000)
    }, 1800)
  }

  const handleMethodSelect = (type: 'card' | 'google_pay' | 'apple_pay') => {
    if (type === 'card') {
      setSelectedMethod({ type: 'card' })
      setStep('card-form')
    } else {
      runProcessing({ type })
    }
  }

  const handleCardSubmit = () => {
    const last4 = cardNumber.replace(/\s/g, '').slice(-4)
    runProcessing({ type: 'card', last4 })
  }

  const isCardValid =
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvc.length >= 3

  return (
    <div className="min-h-[300px]">
      <AnimatePresence mode="wait">
        {step === 'method' && (
          <motion.div
            key="method"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-xl font-extrabold mb-1">Оберіть спосіб оплати</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Перший місяць — <span className="font-bold text-primary">1 грн</span>, потім 199 грн/місяць
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleMethodSelect('card')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-accent transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <CreditCard className="h-5 w-5 text-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Банківська картка</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleMethodSelect('google_pay')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-accent transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Smartphone className="h-5 w-5 text-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Google Pay</p>
                  <p className="text-xs text-muted-foreground">Швидка оплата</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleMethodSelect('apple_pay')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-border hover:border-primary hover:bg-accent transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center shrink-0 text-foreground font-bold text-sm">
                  
                </div>
                <div className="text-left">
                  <p className="font-semibold">Apple Pay</p>
                  <p className="text-xs text-muted-foreground">Touch ID / Face ID</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'card-form' && (
          <motion.div
            key="card-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              onClick={() => setStep('method')}
              className="flex items-center gap-1 text-sm text-muted-foreground mb-4 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Назад
            </button>
            <h2 className="text-xl font-extrabold mb-1">Дані картки</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Буде списано <span className="font-bold text-primary">1 грн</span>
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Номер картки
                </label>
                <Input
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                  inputMode="numeric"
                  className="h-12 text-base font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Термін дії
                  </label>
                  <Input
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                      setExpiry(v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v)
                    }}
                    maxLength={5}
                    inputMode="numeric"
                    className="h-12 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    CVC
                  </label>
                  <Input
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    inputMode="numeric"
                    type="password"
                    className="h-12 text-base font-mono"
                  />
                </div>
              </div>
            </div>
            <Button
              className="w-full mt-5 h-12 rounded-full text-base font-bold"
              onClick={handleCardSubmit}
              disabled={!isCardValid}
            >
              Оплатити 1 грн
            </Button>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-12 gap-4"
          >
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="font-semibold text-lg">Обробляємо платіж…</p>
            <p className="text-sm text-muted-foreground">Будь ласка, зачекайте</p>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center text-center py-8 gap-4"
          >
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold mb-1">Вітаємо!</h2>
              <p className="text-lg font-semibold text-primary">Varus Premium активовано</p>
            </div>
            <div className="bg-accent rounded-2xl p-4 w-full text-left space-y-1">
              <p className="text-sm text-muted-foreground">Перший місяць: <span className="font-bold text-foreground">1 грн</span></p>
              <p className="text-sm text-muted-foreground">Потім: <span className="font-bold text-foreground">199 грн/місяць</span></p>
              <p className="text-sm text-muted-foreground">Скасувати будь-коли</p>
            </div>
            <Button
              className="w-full h-12 rounded-full text-base font-bold mt-2"
              onClick={() => { onClose(); router.push('/dashboard') }}
            >
              Перейти в кабінет
            </Button>
            <p className="text-xs text-muted-foreground">Або зачекайте — перенаправлення автоматично</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface CheckoutSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutSheet({ open, onOpenChange }: CheckoutSheetProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8 pt-6">
          <SheetHeader className="mb-2">
            <SheetTitle className="sr-only">Оформлення підписки</SheetTitle>
          </SheetHeader>
          <CheckoutContent onClose={() => onOpenChange(false)} />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="sr-only">Оформлення підписки</DialogTitle>
        </DialogHeader>
        <CheckoutContent onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
