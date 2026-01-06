'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useLocale } from '../../i18n-provider';

export default function LoginPage() {
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.includes('@')) {
      setMessage(t('pub.login.domain_blocked'));
      return;
    }
    setMessage(t('pub.login.submit'));
  };

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 12 }}>
      <h1>{t('pub.login.title')}</h1>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label htmlFor="email">{t('pub.login.email_label')}</label>
          <input
            id="email"
            type="email"
            value={email}
            data-testid="ELM-PUB-001-EMAIL"
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }}
          />
          <label htmlFor="password">{t('pub.login.password_label')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              data-testid="ELM-PUB-001-PASSWORD"
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', flex: 1 }}
            />
            <button
              type="button"
              className="button secondary"
              data-testid="ELM-PUB-001-SHOWPASS"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button type="submit" className="button" data-testid="ELM-PUB-001-SUBMIT">
            {t('pub.login.submit')}
          </button>
          <Link href="/forgot" data-testid="ELM-PUB-001-FORGOT">
            {t('pub.login.forgot')}
          </Link>
          {message && <p role="status">{message}</p>}
        </div>
      </form>
    </main>
  );
}
