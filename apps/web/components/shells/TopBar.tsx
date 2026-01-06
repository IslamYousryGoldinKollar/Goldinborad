import Link from 'next/link';
import { LanguageSwitch } from '../shared/LanguageSwitch';

export function TopBar() {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/app/home" data-testid="ELM-GLOBAL-LOGO" aria-label="Goldinkollar">
          Goldinkollar
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" data-testid="ELM-GLOBAL-TOPBAR-SEARCH" className="button secondary">
          Search
        </button>
        <button type="button" data-testid="ELM-GLOBAL-TOPBAR-NOTIFS" className="button secondary">
          Notifications
        </button>
        <button type="button" data-testid="ELM-GLOBAL-TOPBAR-POINTS" className="button secondary">
          Points
        </button>
        <LanguageSwitch />
      </div>
    </div>
  );
}
