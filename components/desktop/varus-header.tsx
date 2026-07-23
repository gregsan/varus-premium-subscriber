
import Link from 'next/link'
import { Heart, User, RefreshCw } from 'lucide-react'
import { TENANT_CONFIG } from '@/lib/tenant-config'

/**
 * Desktop-only top header, styled after varus.ua storefront header.
 * Hidden below the md breakpoint — mobile keeps the existing MobileFrame flow.
 * No search bar per product decision.
 */
export function VarusHeader() {
  return (
    <header className="hidden md:block w-full border-b border-border bg-background">
      {/* Top row: logo, nav, address pill, icons */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-primary">
            <span className="text-primary">VARUS</span>
            <span className="text-muted-foreground">.UA</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-foreground/80">
            <span className="cursor-default">Клієнтам</span>
            <span className="cursor-default">Партнерам</span>
            <span className="cursor-default">Робота</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-sm text-accent-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Обери адресу
          </button>

          <button aria-label="Оновити" className="rounded-full p-2 hover:bg-secondary">
            <RefreshCw className="h-5 w-5" />
          </button>
          <button aria-label="Список бажань" className="rounded-full p-2 hover:bg-secondary">
            <Heart className="h-5 w-5" />
          </button>
          <Link
            href="/account"
            className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium hover:bg-secondary"
          >
            <User className="h-5 w-5" />
            Кабінет
          </Link>
        </div>
      </div>

      {/* Second row: category-style nav, kept generic for the Premium subscriber area */}
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-6 border-t border-border px-6 text-sm text-foreground/70">
        <span className="font-semibold text-foreground">{TENANT_CONFIG.brandName}</span>
        <Link href="/dashboard" className="hover:text-primary">Кабінет підписки</Link>
        <Link href="/account" className="hover:text-primary">Налаштування</Link>
      </div>
    </header>
  )
}
