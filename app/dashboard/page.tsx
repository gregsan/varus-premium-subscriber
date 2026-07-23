'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Barcode, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileFrame } from '@/components/mobile-frame'
import { UsageStatsBlock } from '@/components/blocks/usage-stats-block'
import { PartnerServicesBlock } from '@/components/blocks/partner-services-block'
import { InsuranceDashboardBlock } from '@/components/blocks/insurance-dashboard-block'
import { RetailBenefitsDashboardBlock } from '@/components/blocks/retail-benefits-dashboard-block'
import { RedeemCodeScreen } from '@/components/blocks/redeem-code-screen'
import { useSubscription } from '@/hooks/use-subscription'
import { TENANT_CONFIG } from '@/lib/tenant-config'
import Link from 'next/link'

// Block registry — maps dashboardBlocks config to components
function DashboardBlocks({
  blocks,
}: {
  blocks: typeof TENANT_CONFIG.dashboardBlocks
}) {
  const {
    usage,
    activatedServices,
    insurance,
    activateService,
    activateInsurance,
    submitInsuranceClaim,
  } = useSubscription()

  const [redeemOpen, setRedeemOpen] = useState(false)

  const blockMap: Record<string, React.ReactNode> = {
    'usage-stats': <UsageStatsBlock key="usage-stats" usage={usage} />,
    'redeem-coupon': (
      <motion.div
        key="redeem-coupon"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Button
          className="w-full h-14 rounded-2xl font-bold text-base gap-2"
          variant="outline"
          onClick={() => setRedeemOpen(true)}
        >
          <Barcode className="h-5 w-5" />
          Показати купон на касі
        </Button>
      </motion.div>
    ),
    'partner-services': (
      <PartnerServicesBlock
        key="partner-services"
        activatedServices={activatedServices}
        onActivate={activateService}
      />
    ),
    'insurance': (
      <InsuranceDashboardBlock
        key="insurance"
        insurance={insurance}
        onActivate={activateInsurance}
        onSubmitClaim={submitInsuranceClaim}
      />
    ),
    'retail-benefits': <RetailBenefitsDashboardBlock key="retail-benefits" />,
  }

  return (
    <>
      {blocks.map((b) => blockMap[b] ?? null)}
      <AnimatePresence>
        {redeemOpen && <RedeemCodeScreen key="redeem" onClose={() => setRedeemOpen(false)} />}
      </AnimatePresence>
    </>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { status, hydrated } = useSubscription()

  useEffect(() => {
    if (hydrated && status === 'none') {
      router.replace('/subscribe')
    }
  }, [hydrated, status, router])

  if (!hydrated) return null
  if (status === 'none') return null

  return (
    <MobileFrame>
      {/* Status header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">Varus Premium активний</span>
          </div>
          <Link href="/account">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Налаштування">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8 pt-4 space-y-4">
        <DashboardBlocks blocks={TENANT_CONFIG.dashboardBlocks} />
      </div>
    </MobileFrame>
  )
}
