'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RedeemCodeScreenProps {
  onClose: () => void
}

export function RedeemCodeScreen({ onClose }: RedeemCodeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
    >
      <div className="w-full max-w-[560px] flex flex-col items-center px-6 gap-6">
        <div className="w-full flex justify-between items-center">
          <h2 className="text-xl font-extrabold">Ваш купон</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground">Покажіть касиру для отримання знижки</p>
        </div>

        {/* Mock barcode */}
        <div className="w-full bg-white rounded-2xl border border-border p-6 flex flex-col items-center gap-4">
          <div className="flex gap-0.5 items-end h-20">
            {Array.from({ length: 52 }).map((_, i) => (
              <div
                key={i}
                className="bg-foreground"
                style={{
                  width: i % 3 === 0 ? 3 : i % 5 === 0 ? 2 : 1,
                  height: i % 7 === 0 ? 80 : i % 4 === 0 ? 64 : 72,
                }}
              />
            ))}
          </div>
          <p className="font-mono text-sm tracking-[0.2em] text-muted-foreground">
            VP-2024-001-DEMO
          </p>
        </div>

        {/* Mock QR */}
        <div className="w-36 h-36 bg-white rounded-2xl border border-border flex items-center justify-center">
          <svg viewBox="0 0 80 80" className="w-28 h-28" aria-label="QR-code placeholder">
            {/* corners */}
            <rect x="0" y="0" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="8" y="8" width="12" height="12" fill="currentColor" />
            <rect x="52" y="0" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="60" y="8" width="12" height="12" fill="currentColor" />
            <rect x="0" y="52" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="4" />
            <rect x="8" y="60" width="12" height="12" fill="currentColor" />
            {/* inner dots */}
            {[36, 40, 44, 48].map((x) =>
              [36, 40, 44, 48].map((y) => (
                <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill="currentColor" />
              ))
            )}
          </svg>
        </div>

        <div className="text-center">
          <p className="font-bold text-lg text-primary">Varus Premium</p>
          <p className="text-xs text-muted-foreground">Знижка до 10% на всі товари</p>
        </div>

        <Button variant="outline" className="w-full rounded-full" onClick={onClose}>
          Закрити
        </Button>
      </div>
    </motion.div>
  )
}
