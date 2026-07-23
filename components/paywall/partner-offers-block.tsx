'use client'

import { motion } from 'framer-motion'
import { Handshake } from 'lucide-react'
import { BlockWrapper } from '@/components/block-wrapper'
import { PARTNER_OFFERS } from '@/lib/paywall-data'

export function PartnerOffersBlock() {
  return (
    <BlockWrapper>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
          <Handshake className="h-4 w-4 text-accent-foreground" />
        </div>
        <h3 className="font-bold text-base">Пропозиції партнерів</h3>
      </div>
      <ul className="divide-y divide-border">
        {PARTNER_OFFERS.map((item, i) => (
          <motion.li
            key={item.id}
            custom={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
            className="flex items-center gap-3 py-3"
          >
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="flex-1 text-sm">{item.label}</span>
            <span className="font-semibold text-sm text-primary">{item.value}</span>
          </motion.li>
        ))}
      </ul>
    </BlockWrapper>
  )
}
