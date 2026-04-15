"use server";

import { supabase } from "@/lib/supabase";

export interface DeletionRequestState {
  ok: boolean;
  message: string;
}

/**
 * Server Action — user submits the delete-account form.
 *
 * Inserts a row into `data_deletion_requests` (anon can INSERT via RLS
 * policy, cannot read). Returns a serializable result for the client
 * form to show a success or error message.
 *
 * We process these requests manually within 7 business days (per the
 * commitment shown on the public delete-account page). A future admin
 * dashboard will let us mark rows processed / rejected.
 */
export async function submitDeletionRequest(
  _prev: DeletionRequestState | null,
  formData: FormData,
): Promise<DeletionRequestState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const reason = String(formData.get("reason") ?? "").trim();
  const confirm = formData.get("confirm");

  if (!email) {
    return { ok: false, message: "Email address is required." };
  }

  // Basic email shape check — Supabase also enforces this at RLS
  // policy level, but early validation gives better UX.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  if (email.length > 320) {
    return { ok: false, message: "Email address is too long." };
  }

  if (confirm !== "on") {
    return {
      ok: false,
      message: "Please confirm that you understand this action is permanent.",
    };
  }

  const { error } = await supabase
    .from("data_deletion_requests")
    .insert({
      email,
      reason: reason.length > 0 ? reason.slice(0, 2000) : null,
    });

  if (error) {
    // Don't leak internal details to the user; log server-side only.
    // eslint-disable-next-line no-console
    console.error("[delete-account] insert failed:", error.message);
    return {
      ok: false,
      message:
        "We couldn't submit your request right now. Please email areeb@awekn.com instead.",
    };
  }

  return {
    ok: true,
    message:
      "Request received. We'll process your deletion within 7 business days and send a confirmation email when it's done.",
  };
}
