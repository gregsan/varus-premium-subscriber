
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  User,
  ShoppingBag,
  Ticket,
  Heart,
  Bell,
  Eye,
  MessageSquare,
  CreditCard,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: typeof User
}

const NAV_ITEMS: NavItem[] = [
  { href: '/account', label: 'Профіль', icon: User },
  { href: '/dashboard', label: 'Моя підписка', icon: Ticket },
  { href: '/dashboard#purchases', label: 'Мої покупки', icon: ShoppingBag },
  { href: '/dashboard#wishlist', label: 'Мої списки', icon: Heart },
  { href: '/dashboard#viewed', label: 'Вже переглянуто', icon: Eye },
  { href: '/dashboard#reviews', label: 'Відгуки', icon: MessageSquare },
  { href: '/account#billing', label: 'Платіжні картки', icon: CreditCard },
]

/**
 * Desktop-only left sidebar, mirrors the varus.ua account layout screenshot.
 * Rendered alongside VarusHeader, only visible from md breakpoint up.
 */
export function DashboardSidebar({ userName, userPhone }: { userName: string; userPhone: string }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex items-center gap-3 border-b border-border p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
          <User className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{userName}</p>
          <p className="text-sm text-muted-foreground">{userPhone}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href.split('#')[0]) && href.startsWith(pathname)
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-accent text-accent-foreground' : 'text-foreground/80 hover:bg-secondary'
              )}
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-secondary">
          <LogOut className="h-4.5 w-4.5" />
          Вийти з кабінету
        </button>
      </div>
    </aside>
  )
}
