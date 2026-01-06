'use client';

import Link from 'next/link';
import { useLocale } from '../../../app/i18n-provider';

const sampleTasks = [
  { id: 'um-1', title: 'Read handbook', type: 'digital', points: 25 },
  { id: 'um-2', title: 'Upload ID photo', type: 'physical', points: 40 }
];

export default function TodayPage() {
  const { t } = useLocale();

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h1>{t('lrn.today.title')}</h1>
        <button className="button secondary" data-testid="ELM-LRN-014-REFRESH" type="button">
          {t('lrn.today.refresh')}
        </button>
      </header>
      <div className="task-list">
        {sampleTasks.map((task) => (
          <article className="task-card" key={task.id} data-testid={`ELM-LRN-014-TASK-OPEN__${task.id}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3>{task.title}</h3>
                <p className="badge">{task.type}</p>
              </div>
              <span className="badge">{task.points} pts</span>
            </div>
            <div className="task-actions">
              <Link
                href={`/app/missions/${task.id}`}
                data-testid={`ELM-LRN-014-TASK-OPEN__${task.id}`}
                className="button"
              >
                View
              </Link>
              <button
                type="button"
                className="button secondary"
                data-testid={`ELM-LRN-014-TASK-RESCHEDULE__${task.id}`}
              >
                Reschedule
              </button>
              <button type="button" className="button" data-testid={`ELM-LRN-014-TASK-CLAIMDONE__${task.id}`}>
                Claim done
              </button>
              <button type="button" className="button secondary" data-testid={`ELM-LRN-014-TASK-MORE__${task.id}`}>
                More
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
