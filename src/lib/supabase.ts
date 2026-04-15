import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client for the website.
 *
 * Uses the anon key because the only table we touch from the website is
 * `data_deletion_requests`, which has an RLS policy allowing anon INSERT.
 * Email and reason are the only columns the client ever writes; pending
 * requests can't be read back by anon. No service-role key on the web.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // At import time in dev, warn but don't throw — the page will handle
  // missing env at request time with a graceful error.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing. Delete-account form will fail.",
  );
}

export const supabase = createClient(SUPABASE_URL ?? "", SUPABASE_ANON_KEY ?? "");
