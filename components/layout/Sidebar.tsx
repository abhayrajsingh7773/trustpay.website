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
  Circle,
  ChevronRight,
  Shield,
  MessageSquareHeart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SystemStatusWidget from './SystemStatusWidget';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Make Payment', href: '/payment', icon: Send },
  { label: 'Transactions', href: '/transactions', icon: List },
  { label: 'Risk Analysis', href: '/analysis', icon: ShieldAlert },
  { label: 'Behavior Profile', href: '/profile', icon: User },
  { label: 'Network Analysis', href: '/network', icon: Network },
  { label: 'App Feedback', href: '/feedback', icon: MessageSquareHeart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-red-500/10 border border-red-500/30 rounded flex items-center justify-center">
            <Shield size={14} className="text-red-400" />
          </div>
          <span className="font-bold text-[15px] tracking-wide text-white">TRUSTPAY</span>
        </Link>
        <p className="text-[10px] text-[var(--text-muted)] mt-1.5 ml-[38px] tracking-wide">
          Payment Risk Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="label-section px-2 mb-3">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-2.5 py-2 rounded text-[13.5px] transition-all duration-150 group relative',
                active
                  ? 'bg-red-500/10 text-red-400 border-l-2 border-red-400 pl-[9px]'
                  : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--surface-2)]'
              )}
            >
              <Icon size={15} className={cn(active ? 'text-red-400' : 'text-current')} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={12} className="text-red-400/50" />}
            </Link>
          );
        })}
      </nav>

      {/* System Status + Profile */}
      <div className="border-t border-[var(--border)] px-3 py-3 space-y-3">
        <SystemStatusWidget />
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center text-[11px] font-bold text-red-400">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white truncate">Ayush Sharma</p>
            <p className="text-[10px] text-[var(--text-muted)] truncate">ayush.sharma@okaxis</p>
          </div>
          <Circle size={8} className="text-emerald-400 fill-emerald-400 flex-shrink-0" />
        </Link>
      </div>
    </aside>
  );
}
