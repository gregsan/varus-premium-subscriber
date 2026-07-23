'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Check, ChevronRight } from 'lucide-react'
import { BlockWrapper } from '@/components/block-wrapper'
import { DIGITAL_SERVICES, type DigitalService } from '@/lib/paywall-data'
import { useIsMobile } from '@/hooks/use-is-mobile'
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

function ServiceDetails({ item }: { item: DigitalService }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <div
          className="h-14 w-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shrink-0"
          style={{ backgroundColor: item.color }}
        >
          {item.initials}
        </div>
        <div>
          <h3 className="font-extrabold text-xl">{item.name}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Що входить у підписку
      </p>
      <ul className="space-y-2">
        {item.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DigitalServicesBlock() {
  const [selected, setSelected] = useState<DigitalService | null>(null)
  const isMobile = useIsMobile()

  return (
    <>
      <BlockWrapper>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center">
            <Box className="h-4 w-4 text-accent-foreground" />
          </div>
          <h3 className="font-bold text-base">Підписки на цифрові сервіси</h3>
        </div>
        <ul className="divide-y divide-border">
          {DIGITAL_SERVICES.map((svc, i) => (
            <motion.li
              key={svc.id}
              custom={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.35, ease: 'easeOut' }}
            >
              <button
                type="button"
                onClick={() => setSelected(svc)}
                className="w-full flex items-center gap-3 py-3 hover:bg-muted/40 -mx-1 px-1 rounded-lg transition-colors"
              >
                <div
                  className="h-9 w-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ backgroundColor: svc.color }}
                >
                  {svc.initials}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{svc.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{svc.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            </motion.li>
          ))}
        </ul>
      </BlockWrapper>

      {isMobile ? (
        <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-8 pt-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="sr-only">{selected?.name}</SheetTitle>
            </SheetHeader>
            {selected && <ServiceDetails item={selected} />}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-w-sm rounded-2xl p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="sr-only">{selected?.name}</DialogTitle>
            </DialogHeader>
            {selected && <ServiceDetails item={selected} />}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
