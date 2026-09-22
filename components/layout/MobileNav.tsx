'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Send,
  List,
  ShieldAlert,
  User,
  Network,
  MessageSquareHeart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Pay', href: '/payment', icon: Send },
  { label: 'History', href: '/transactions', icon: List },
  { label: 'Analysis', href: '/analysis', icon: ShieldAlert },
  { label: 'Feedback', href: '/feedback', icon: MessageSquareHeart },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--surface)] border-t border-[var(--border)]">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors',
                active ? 'text-red-400' : 'text-[var(--text-muted)]'
              )}
            >
              <Icon size={18} />
              <span className="text-[9px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
