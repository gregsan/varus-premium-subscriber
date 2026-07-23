'use client'

import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface BlockWrapperProps {
  children: ReactNode
  className?: string
}

const wrapperVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

export function BlockWrapper({ children, className = '' }: BlockWrapperProps) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={wrapperVariants}
      className={`rounded-2xl border border-border bg-card shadow-sm p-5 ${className}`}
    >
      {children}
    </motion.section>
  )
}
