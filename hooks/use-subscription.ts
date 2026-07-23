'use client'

import { useState, useEffect, useCallback } from 'react'
import { DEFAULT_STATE, type SubscriptionState } from '@/lib/subscription-store'

const STORAGE_KEY = 'varus_subscription_state'

function loadState(): SubscriptionState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATE
    return JSON.parse(raw) as SubscriptionState
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state: SubscriptionState) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(DEFAULT_STATE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setState(loadState())
    setHydrated(true)
  }, [])

  const update = useCallback((updater: (prev: SubscriptionState) => SubscriptionState) => {
    setState(prev => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }, [])

  const activateSubscription = useCallback(
    (paymentMethod: SubscriptionState['paymentMethod']) => {
      const now = new Date()
      const nextBilling = addMonths(now, 1)
      update(() => ({
        status: 'active',
        planId: 'varus-premium',
        startedAt: now.toISOString(),
        nextBillingDate: nextBilling.toISOString(),
        cancelAtPeriodEnd: false,
        paymentMethod,
        usage: {
          deliveriesUsed: 7,
          deliveriesLimit: null,
          bonusPointsEarned: 1240,
        },
        activatedServices: [],
        insurance: {
          policyActive: false,
          claimSubmitted: false,
        },
        billingHistory: [
          {
            id: 'inv-001',
            date: now.toISOString(),
            amount: 1,
            status: 'paid',
          },
        ],
      }))
    },
    [update]
  )

  const cancelSubscription = useCallback(
    ({ immediate }: { immediate: boolean }) => {
      if (immediate) {
        update(() => ({ ...DEFAULT_STATE }))
      } else {
        update(prev => ({
          ...prev,
          status: 'cancelling',
          cancelAtPeriodEnd: true,
        }))
      }
    },
    [update]
  )

  const resumeSubscription = useCallback(() => {
    update(prev => ({
      ...prev,
      status: 'active',
      cancelAtPeriodEnd: false,
    }))
  }, [update])

  const activateService = useCallback(
    (serviceId: string) => {
      update(prev => ({
        ...prev,
        activatedServices: prev.activatedServices.includes(serviceId)
          ? prev.activatedServices
          : [...prev.activatedServices, serviceId],
      }))
    },
    [update]
  )

  const activateInsurance = useCallback(() => {
    update(prev => ({
      ...prev,
      insurance: { ...prev.insurance, policyActive: true },
    }))
  }, [update])

  const submitInsuranceClaim = useCallback(() => {
    update(prev => ({
      ...prev,
      insurance: { ...prev.insurance, claimSubmitted: true },
    }))
  }, [update])

  const isServiceActive = useCallback(
    (serviceId: string) => state.activatedServices.includes(serviceId),
    [state.activatedServices]
  )

  return {
    ...state,
    hydrated,
    activateSubscription,
    cancelSubscription,
    resumeSubscription,
    activateService,
    activateInsurance,
    submitInsuranceClaim,
    isServiceActive,
  }
}
