'use client';

// RecoveryRedirect (2026-07-16). Supabase password-recovery links redirect to the
// project's Site URL (awekn.com root) with the recovery session in the URL
// fragment: #access_token=...&type=recovery. Mounted app-wide in layout.tsx, this
// forwards any such landing to /reset-password (preserving the fragment) so the
// link never dead-ends on the marketing page. Fixes the "reset email opened
// awekn.com and nothing happened" bug for every non-app client.

import { useEffect } from 'react';

export default function RecoveryRedirect() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    const path = window.location.pathname || '/';
    if (
      path !== '/reset-password' &&
      /type=recovery/.test(hash) &&
      /access_token=/.test(hash)
    ) {
      window.location.replace('/reset-password' + hash);
    }
  }, []);
  return null;
}
