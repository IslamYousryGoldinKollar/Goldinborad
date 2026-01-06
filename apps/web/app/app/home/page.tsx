'use client';

import Link from 'next/link';
import { useLocale } from '../../../app/i18n-provider';

export default function HomePage() {
  const { t } = useLocale();
  return (
    <div className="card-grid">
      <div className="card">
        <h2>{t('lrn.home.today_card')}</h2>
        <p>{t('lrn.today.title')}</p>
        <Link href="/app/today" data-testid="ELM-LRN-001-TODAY-OPEN" className="button">
          {t('lrn.home.open_today')}
        </Link>
      </div>
      <div className="card">
        <h2>{t('lrn.home.continue_mission')}</h2>
        <Link href="/app/missions/current" data-testid="ELM-LRN-001-CONTINUE-OPEN" className="button secondary">
          {t('lrn.home.continue_mission')}
        </Link>
      </div>
      <div className="card">
        <h2>{t('lrn.home.leaderboard')}</h2>
        <Link href="/app/leaderboard" data-testid="ELM-LRN-001-LEADERBOARD-OPEN" className="button">
          {t('lrn.home.leaderboard')}
        </Link>
      </div>
      <div className="card">
        <h2>{t('lrn.home.knowledge')}</h2>
        <Link href="/app/knowledge" data-testid="ELM-LRN-001-KNOWLEDGE-OPEN" className="button secondary">
          {t('lrn.home.knowledge')}
        </Link>
      </div>
      <div className="card">
        <h2>{t('lrn.home.self_awareness')}</h2>
        <Link href="/app/self-awareness" data-testid="ELM-LRN-001-SA-OPEN" className="button">
          {t('lrn.home.self_awareness')}
        </Link>
      </div>
      <div className="card">
        <h2>{t('lrn.home.rewards')}</h2>
        <Link href="/app/rewards" data-testid="ELM-LRN-001-REWARDS-OPEN" className="button secondary">
          {t('lrn.home.rewards')}
        </Link>
      </div>
      <div className="card">
        <h2>{t('lrn.home.team')}</h2>
        <Link href="/app/team" data-testid="ELM-LRN-001-TEAM-OPEN" className="button">
          {t('lrn.home.team')}
        </Link>
      </div>
    </div>
  );
}
