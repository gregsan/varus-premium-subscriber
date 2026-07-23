'use client'

import { useState } from 'react'
import { Shield, Check, FileText, Clock } from 'lucide-react'
import { BlockWrapper } from '@/components/block-wrapper'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { INSURANCE_TYPES } from '@/lib/dashboard-data'
import type { SubscriptionState } from '@/lib/subscription-store'

type InsuranceView = 'info' | 'activate-form' | 'activate-success' | 'claim-form' | 'claim-success'

interface InsuranceDashboardBlockProps {
  insurance: SubscriptionState['insurance']
  onActivate: () => void
  onSubmitClaim: () => void
}

export function InsuranceDashboardBlock({
  insurance,
  onActivate,
  onSubmitClaim,
}: InsuranceDashboardBlockProps) {
  const [view, setView] = useState<InsuranceView>('info')
  const [claimType, setClaimType] = useState('')
  const [claimDesc, setClaimDesc] = useState('')

  const handleActivate = () => {
    onActivate()
    setView('activate-success')
  }

  const handleSubmitClaim = () => {
    onSubmitClaim()
    setView('claim-success')
  }

  // Already submitted claim
  if (insurance.claimSubmitted) {
    return (
      <BlockWrapper>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="h-4 w-4 text-accent-foreground" />
          </div>
          <h3 className="font-bold text-base">Страхування</h3>
        </div>
        <div className="flex items-center gap-3 bg-muted rounded-xl p-4">
          <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
          <div>
            <p className="font-semibold text-sm">Заявка на розгляді</p>
            <p className="text-xs text-muted-foreground">Ми зв&apos;яжемось з вами протягом 2–3 робочих днів</p>
          </div>
        </div>
      </BlockWrapper>
    )
  }

  // Policy active — show claim option
  if (insurance.policyActive) {
    if (view === 'claim-form') {
      return (
        <BlockWrapper>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
              <Shield className="h-4 w-4 text-accent-foreground" />
            </div>
            <h3 className="font-bold text-base">Страховий випадок</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Тип випадку
              </label>
              <Select value={claimType} onValueChange={setClaimType}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Оберіть тип..." />
                </SelectTrigger>
                <SelectContent>
                  {INSURANCE_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Опис ситуації
              </label>
              <Textarea
                placeholder="Опишіть, що сталось..."
                value={claimDesc}
                onChange={(e) => setClaimDesc(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => setView('info')}
              >
                Скасувати
              </Button>
              <Button
                className="flex-1 rounded-full"
                disabled={!claimType || claimDesc.length < 10}
                onClick={handleSubmitClaim}
              >
                Подати заявку
              </Button>
            </div>
          </div>
        </BlockWrapper>
      )
    }

    return (
      <BlockWrapper>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="h-4 w-4 text-accent-foreground" />
          </div>
          <h3 className="font-bold text-base">Страхування</h3>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4">
          <Check className="h-4 w-4 text-primary shrink-0" />
          <span className="text-sm font-semibold text-primary">Страховий поліс активний</span>
        </div>
        <Button
          variant="outline"
          className="w-full rounded-full"
          onClick={() => setView('claim-form')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Подати заявку на страховий випадок
        </Button>
      </BlockWrapper>
    )
  }

  // Policy not active
  if (view === 'activate-form') {
    return (
      <BlockWrapper>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="h-4 w-4 text-accent-foreground" />
          </div>
          <h3 className="font-bold text-base">Оформити страховку</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Підтвердіть оформлення базового страхового полісу, що включений у вашу підписку Varus Premium.
          Страхування покриває медичні випадки та нещасні випадки.
        </p>
        <ul className="space-y-1.5 mb-5">
          {['Медичне страхування', 'Страхування від нещасного випадку', 'Підтримка 24/7'].map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 rounded-full" onClick={() => setView('info')}>
            Скасувати
          </Button>
          <Button className="flex-1 rounded-full" onClick={handleActivate}>
            Підтвердити
          </Button>
        </div>
      </BlockWrapper>
    )
  }

  return (
    <BlockWrapper>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
          <Shield className="h-4 w-4 text-accent-foreground" />
        </div>
        <h3 className="font-bold text-base">Страхування</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Медичне страхування та страхування від нещасного випадку входять у вашу підписку. Оформте поліс зараз безкоштовно.
      </p>
      <Button className="w-full rounded-full" onClick={() => setView('activate-form')}>
        <Shield className="h-4 w-4 mr-2" />
        Оформити страховку
      </Button>
    </BlockWrapper>
  )
}
