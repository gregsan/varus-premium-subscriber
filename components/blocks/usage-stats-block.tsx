'use client'

import { Truck, Coins, TrendingDown } from 'lucide-react'
import { BlockWrapper } from '@/components/block-wrapper'
import type { SubscriptionState } from '@/lib/subscription-store'

interface UsageStatsBlockProps {
  usage: SubscriptionState['usage']
}

export function UsageStatsBlock({ usage }: UsageStatsBlockProps) {
  const { deliveriesUsed, deliveriesLimit, bonusPointsEarned } = usage
  const savedAmount = Math.round(deliveriesUsed * 89 + bonusPointsEarned * 0.8)

  return (
    <BlockWrapper>
      <h3 className="font-bold text-base mb-4">Моя статистика</h3>
      <div className="space-y-4">
        {/* Deliveries */}
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center shrink-0 mt-0.5">
            <Truck className="h-4 w-4 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">Доставки цього місяця</p>
              {deliveriesLimit === null ? (
                <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Безліміт
                </span>
              ) : (
                <span className="text-sm font-bold text-primary">
                  {deliveriesUsed}/{deliveriesLimit}
                </span>
              )}
            </div>
            {deliveriesLimit !== null && (
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(100, (deliveriesUsed / deliveriesLimit) * 100)}%` }}
                />
              </div>
            )}
            {deliveriesLimit === null && (
              <p className="text-xs text-muted-foreground">Використано: {deliveriesUsed} доставок</p>
            )}
          </div>
        </div>

        {/* Bonus points */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <Coins className="h-4 w-4 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Бонусні бали цього місяця</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-primary text-base">{bonusPointsEarned.toLocaleString('uk-UA')}</span> балів
            </p>
          </div>
        </div>

        {/* Savings */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center shrink-0">
            <TrendingDown className="h-4 w-4 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Заощаджено цього місяця</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-primary text-base">{savedAmount.toLocaleString('uk-UA')} грн</span>
            </p>
          </div>
        </div>
      </div>
    </BlockWrapper>
  )
}
