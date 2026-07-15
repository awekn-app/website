'use client';

// awekn.com/reset-password (2026-07-16). The password-recovery landing page.
//
// Supabase emails a verify link whose redirect lands here (or on the site root,
// from which components/RecoveryRedirect.tsx forwards it) with the recovery
// session in the URL fragment: #access_token=...&type=recovery. Before this
// page, that link dead-ended on the marketing landing page - password reset was
// broken for every user whose link fell back to the Site URL (dashboard-
// triggered resets, the old bare emails, any non-app client). This page reads
// the recovery token and lets the user set a new password via the Supabase auth
// REST API. No SDK, no server; the publishable key below is public by design.

import { useEffect, useState } from 'react';

const SUPABASE_URL = 'https://ggibohelhxqkyeyqrlub.supabase.co';
// Supabase PUBLISHABLE key - explicitly public (shipped in every client). RLS is
// the real boundary; this only authorises the gateway. Safe to embed.
const SUPABASE_ANON = 'sb_publishable_VLoO3b7QNGP0pXAp_SVfXw_mNjlQmqQ';

type Phase = 'checking' | 'ready' | 'submitting' | 'done' | 'invalid';

export default function ResetPassword() {
  const [phase, setPhase] = useState<Phase>('checking');
  const [token, setToken] = useState<string | null>(null);
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = (window.location.hash || '').replace(/^#/, '');
    const params = new URLSearchParams(raw);
    const at = params.get('access_token');
    const type = params.get('type');
    if (at && type === 'recovery') {
      setToken(at);
      setPhase('ready');
      // strip the token from the address bar / history immediately
      try { window.history.replaceState(null, '', window.location.pathname); } catch {}
    } else {
      setPhase('invalid');
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (pw.length < 8) { setError('Use at least 8 characters.'); return; }
    if (pw !== confirm) { setError('The two passwords do not match.'); return; }
    if (!token) { setPhase('invalid'); return; }
    setPhase('submitting');
    try {
      const res = await fetch(SUPABASE_URL + '/auth/v1/user', {
        method: 'PUT',
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as Record<string, unknown>));
        const msg = String((body as Record<string, string>).msg
          || (body as Record<string, string>).error_description
          || (body as Record<string, string>).message
          || '');
        if (res.status === 401 || res.status === 403 || /expired|invalid|jwt|token/i.test(msg)) {
          setError('This reset link has expired. Open the app and request a new one from Settings, Account, Change password.');
        } else {
          setError(msg || 'Could not update the password. Please try again.');
        }
        setPhase('ready');
        return;
      }
      setPhase('done');
    } catch {
      setError('Network error. Check your connection and try again.');
      setPhase('ready');
    }
  }

  return (
    <main style={S.wrap}>
      <div style={S.card}>
        <div style={S.wordmark}>awekn</div>

        {phase === 'checking' && (
          <p style={S.dim}>checking your link...</p>
        )}

        {phase === 'invalid' && (
          <>
            <h1 style={S.h1}>link expired</h1>
            <p style={S.body}>
              This password reset link is no longer valid. Open the awekn app and
              request a fresh one from <b style={S.b}>Settings &rarr; Account &rarr; Change password</b>.
            </p>
            <a href="https://apps.apple.com/in/app/awekn-lifting-gym-log-diet/id6762414034" style={S.ghost}>Get the app</a>
          </>
        )}

        {phase === 'done' && (
          <>
            <div style={S.check}>&#10003;</div>
            <h1 style={S.h1}>you&apos;re set</h1>
            <p style={S.body}>
              Your password is updated. Open awekn and sign in with your email and
              new password. Your Google or Apple sign-in still works too.
            </p>
            <a href="https://apps.apple.com/in/app/awekn-lifting-gym-log-diet/id6762414034" style={S.cta}>Open awekn</a>
          </>
        )}

        {(phase === 'ready' || phase === 'submitting') && (
          <form onSubmit={submit}>
            <h1 style={S.h1}>set a new password</h1>
            <p style={S.body}>Choose a password for your awekn account.</p>

            <label style={S.label}>new password</label>
            <div style={S.inputRow}>
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                autoComplete="new-password"
                autoFocus
                style={S.input}
                placeholder="at least 8 characters"
              />
            </div>

            <label style={S.label}>confirm password</label>
            <div style={S.inputRow}>
              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                style={S.input}
                placeholder="re-enter it"
              />
            </div>

            <button type="button" onClick={() => setShow((v) => !v)} style={S.showBtn}>
              {show ? 'hide' : 'show'} password
            </button>

            {error && <p style={S.error}>{error}</p>}

            <button type="submit" disabled={phase === 'submitting'} style={{ ...S.cta, opacity: phase === 'submitting' ? 0.6 : 1 }}>
              {phase === 'submitting' ? 'saving...' : 'set password'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

const S: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100dvh', background: 'var(--bg, #0C0C0C)', color: 'var(--text, #D6D6D6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    fontFamily: 'var(--font-display), Inter, system-ui, sans-serif',
  },
  card: { width: '100%', maxWidth: 400, textAlign: 'center' },
  wordmark: { fontSize: 22, letterSpacing: 8, color: 'var(--champagne, #E9EAF0)', marginBottom: 34, fontWeight: 400 },
  h1: { fontSize: 26, fontWeight: 300, color: 'var(--champagne, #E9EAF0)', margin: '0 0 10px', letterSpacing: -0.4, textTransform: 'lowercase' },
  body: { fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-dim, #8E8E93)', margin: '0 0 22px' },
  b: { color: 'var(--text, #D6D6D6)', fontWeight: 500 },
  dim: { color: 'var(--text-faint, #545458)', fontSize: 14 },
  label: { display: 'block', textAlign: 'left', fontSize: 11, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--text-faint, #545458)', margin: '0 0 7px' },
  inputRow: { marginBottom: 16 },
  input: {
    width: '100%', boxSizing: 'border-box', padding: '14px 15px', borderRadius: 12,
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border, rgba(255,255,255,0.10))',
    color: 'var(--champagne, #E9EAF0)', fontSize: 16, outline: 'none',
  },
  showBtn: { background: 'none', border: 'none', color: 'var(--text-dim, #8E8E93)', fontSize: 12.5, cursor: 'pointer', padding: '2px 0', marginBottom: 18, textAlign: 'left', display: 'block' },
  cta: {
    display: 'block', width: '100%', boxSizing: 'border-box', padding: '15px 18px', borderRadius: 12, marginTop: 6,
    background: 'linear-gradient(180deg, var(--emerald-bright, #3EE0A6), var(--emerald-deep, #27B384))',
    color: '#06231A', fontSize: 15.5, fontWeight: 600, border: 'none', cursor: 'pointer', textDecoration: 'none', textAlign: 'center',
  },
  ghost: { display: 'inline-block', marginTop: 8, color: 'var(--champagne, #E9EAF0)', fontSize: 14, textDecoration: 'none', borderBottom: '1px solid var(--border, rgba(255,255,255,0.2))', paddingBottom: 2 },
  check: { fontSize: 40, color: 'var(--emerald, #34D399)', marginBottom: 8, lineHeight: 1 },
  error: { color: '#E0855A', fontSize: 13.5, lineHeight: 1.5, textAlign: 'left', margin: '0 0 14px' },
};
