import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { TopBar } from './TopBar';
import { useLocale } from '../../app/i18n-provider';
import { clsx } from 'clsx';

const navLinks = [
  { href: '/app/home', id: 'ELM-LRN-NAV-HOME', labelKey: 'lrn.home.title' },
  { href: '/app/today', id: 'ELM-LRN-NAV-TODAY', labelKey: 'lrn.today.title' },
  { href: '/app/leaderboard', id: 'ELM-LRN-NAV-LEADERBOARD', labelKey: 'lrn.home.leaderboard', flag: 'FF.LRN.LEADERBOARD' },
  { href: '/app/knowledge', id: 'ELM-LRN-NAV-KB', labelKey: 'lrn.home.knowledge' }
];

export function LearnerShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { t, dir } = useLocale();

  return (
    <div className="layout" dir={dir}>
      <TopBar />
      <div className="shell">
        <nav className="sidebar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx('nav-link', pathname.startsWith(link.href) && 'active')}
              data-testid={link.id}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
