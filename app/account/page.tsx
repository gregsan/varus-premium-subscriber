'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  User,
  CreditCard,
  ChevronLeft,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  HelpCircle,
  FileText,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { MobileFrame } from '@/components/mobile-frame'
import { BlockWrapper } from '@/components/block-wrapper'
import { useSubscription } from '@/hooks/use-subscription'
import Link from 'next/link'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso)
  )
}

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso)
  )
}

const MOCK_USER = {
  name: 'Олексій Коваленко',
  email: 'o.kovalenko@email.ua',
  phone: '+380 98 123 45 67',
  initials: 'ОК',
}

const FAQ = [
  {
    q: 'Як скасувати підписку?',
    a: 'Перейдіть в розділ "Скасування підписки" нижче на цій сторінці. Ви можете скасувати м\'яко (підписка діє до кінця оплаченого періоду) або миттєво.',
  },
  {
    q: 'Коли відбудеться наступне списання?',
    a: 'Наступне списання відбудеться через місяць після активації. Точну дату ви бачите в розділі "Підписка" на цій сторінці.',
  },
  {
    q: 'Чи можна змінити спосіб оплати?',
    a: 'Так, натисніть "Змінити" поруч зі способом оплати. Нова картка буде використана при наступному списанні.',
  },
  {
    q: 'Що відбувається з бонусними балами при скасуванні?',
    a: 'При м\'якому скасуванні бали залишаються активними до кінця оплаченого місяця. При миттєвому скасуванні бали анулюються.',
  },
]

export default function AccountPage() {
  const router = useRouter()
  const {
    status,
    hydrated,
    nextBillingDate,
    paymentMethod,
    billingHistory,
    cancelSubscription,
    resumeSubscription,
  } = useSubscription()

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelMode, setCancelMode] = useState<'soft' | 'immediate'>('soft')

  useEffect(() => {
    if (hydrated && status === 'none') {
      router.replace('/subscribe')
    }
  }, [hydrated, status, router])

  if (!hydrated) return null
  if (status === 'none') return null

  const handleCancel = () => {
    if (cancelMode === 'immediate') {
      cancelSubscription({ immediate: true })
      setCancelDialogOpen(false)
      router.replace('/subscribe')
    } else {
      cancelSubscription({ immediate: false })
      setCancelDialogOpen(false)
    }
  }

  const paymentLabel =
    paymentMethod?.type === 'card'
      ? `Картка •••• ${paymentMethod.last4 ?? '****'}`
      : paymentMethod?.type === 'google_pay'
      ? 'Google Pay'
      : paymentMethod?.type === 'apple_pay'
      ? 'Apple Pay'
      : '—'

  return (
    <MobileFrame>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-2 px-4 py-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Назад">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-bold text-base">Акаунт</h1>
        </div>
      </div>

      <div className="px-4 pb-10 pt-4 space-y-4">

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border bg-card shadow-sm p-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-lg shrink-0">
              {MOCK_USER.initials}
            </div>
            <div>
              <p className="font-extrabold text-base">{MOCK_USER.name}</p>
              <p className="text-sm text-muted-foreground">{MOCK_USER.email}</p>
              <p className="text-sm text-muted-foreground">{MOCK_USER.phone}</p>
            </div>
          </div>
        </motion.div>

        {/* Subscription card */}
        <BlockWrapper>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-accent-foreground" />
            </div>
            <h3 className="font-bold text-base">Підписка</h3>
          </div>

          {status === 'cancelling' && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Підписку скасовано</p>
                  <p className="text-xs text-destructive/80">
                    Діє до {formatDate(nextBillingDate)}
                  </p>
                </div>
              </div>
              <Button
                className="w-full mt-3 rounded-full"
                onClick={resumeSubscription}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Відновити підписку
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Тариф</span>
              <span className="font-semibold text-sm">Varus Premium</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Вартість</span>
              <span className="font-semibold text-sm">199 грн/місяць</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Наступне списання</span>
              <span className="font-semibold text-sm">{formatDate(nextBillingDate)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Спосіб оплати</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{paymentLabel}</span>
                <button
                  type="button"
                  onClick={() => alert('Зміна картки — демо-функція')}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  Змінити
                </button>
              </div>
            </div>
          </div>
        </BlockWrapper>

        {/* Billing history */}
        <BlockWrapper>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <FileText className="h-4 w-4 text-accent-foreground" />
            </div>
            <h3 className="font-bold text-base">Історія платежів</h3>
          </div>
          {billingHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Платежів поки немає</p>
          ) : (
            <ul className="divide-y divide-border">
              {billingHistory.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{formatShortDate(item.date)}</p>
                    <p className="text-xs text-muted-foreground">Varus Premium</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{item.amount} грн</p>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                        item.status === 'paid'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {item.status === 'paid' ? 'Оплачено' : 'Повернення'}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </BlockWrapper>

        {/* Cancel subscription */}
        {status !== 'cancelling' && (
          <BlockWrapper>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-destructive" />
              </div>
              <h3 className="font-bold text-base">Скасування підписки</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Ви можете скасувати підписку м&apos;яко (залишиться активною до {formatDate(nextBillingDate)}) або миттєво.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-full text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
              onClick={() => setCancelDialogOpen(true)}
            >
              Скасувати підписку
            </Button>
          </BlockWrapper>
        )}

        {/* Support */}
        <BlockWrapper>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-accent-foreground" />
            </div>
            <h3 className="font-bold text-base">Підтримка</h3>
          </div>
          <div className="space-y-2 mb-4">
            <Button
              variant="outline"
              className="w-full rounded-full justify-start gap-2"
              onClick={() => alert('Чат підтримки — демо-функція')}
            >
              <MessageCircle className="h-4 w-4" />
              Написати в чат підтримки
            </Button>
            <button
              type="button"
              onClick={() => alert('Умови використання — демо')}
              className="text-sm text-primary underline-offset-2 hover:underline px-1"
            >
              Умови використання
            </button>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Часті питання
            </p>
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-sm text-left leading-relaxed">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </BlockWrapper>
      </div>

      {/* Cancel dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-extrabold">Скасувати підписку?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-5">
            Оберіть спосіб скасування:
          </p>

          {/* Demo-only toggle */}
          <div className="bg-muted/50 border border-border rounded-xl p-3 mb-5 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Demo-only контрол
            </p>
            <button
              type="button"
              onClick={() => setCancelMode('soft')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left ${
                cancelMode === 'soft'
                  ? 'border-primary bg-accent'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                cancelMode === 'soft' ? 'border-primary' : 'border-muted-foreground'
              }`}>
                {cancelMode === 'soft' && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">М&apos;яке скасування</p>
                <p className="text-xs text-muted-foreground">Діє до {formatDate(nextBillingDate)}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setCancelMode('immediate')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors text-left ${
                cancelMode === 'immediate'
                  ? 'border-destructive bg-destructive/5'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                cancelMode === 'immediate' ? 'border-destructive' : 'border-muted-foreground'
              }`}>
                {cancelMode === 'immediate' && (
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">Миттєве скасування</p>
                <p className="text-xs text-muted-foreground">Підписка припиняється негайно</p>
              </div>
            </button>
          </div>

          <div className="space-y-2">
            <Button
              className={`w-full rounded-full ${cancelMode === 'immediate' ? 'bg-destructive hover:bg-destructive/90' : ''}`}
              onClick={handleCancel}
            >
              {cancelMode === 'soft' ? 'Скасувати (до кінця місяця)' : 'Скасувати негайно'}
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full"
              onClick={() => setCancelDialogOpen(false)}
            >
              Залишити підписку
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MobileFrame>
  )
}
