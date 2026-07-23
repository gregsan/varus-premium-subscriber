export type SubscriptionStatus = 'none' | 'active' | 'cancelling' | 'expired'

export interface SubscriptionState {
  status: SubscriptionStatus
  planId: string
  startedAt: string | null
  nextBillingDate: string | null
  cancelAtPeriodEnd: boolean
  paymentMethod: { type: 'card' | 'google_pay' | 'apple_pay'; last4?: string } | null
  usage: {
    deliveriesUsed: number
    deliveriesLimit: number | null
    bonusPointsEarned: number
  }
  activatedServices: string[]
  insurance: {
    policyActive: boolean
    claimSubmitted: boolean
  }
  billingHistory: Array<{
    id: string
    date: string
    amount: number
    status: 'paid' | 'refunded'
  }>
}

export const DEFAULT_STATE: SubscriptionState = {
  status: 'none',
  planId: 'varus-premium',
  startedAt: null,
  nextBillingDate: null,
  cancelAtPeriodEnd: false,
  paymentMethod: null,
  usage: {
    deliveriesUsed: 0,
    deliveriesLimit: null,
    bonusPointsEarned: 0,
  },
  activatedServices: [],
  insurance: {
    policyActive: false,
    claimSubmitted: false,
  },
  billingHistory: [],
}
