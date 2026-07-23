import { type ReactNode } from 'react'

interface MobileFrameProps {
  children: ReactNode
  className?: string
}

export function MobileFrame({ children, className = '' }: MobileFrameProps) {
  return (
    <div className="min-h-screen bg-secondary flex justify-center">
      <div
        className={`relative w-full max-w-[560px] bg-background shadow-2xl min-h-screen flex flex-col ${className}`}
      >
        {children}
      </div>
    </div>
  )
}
