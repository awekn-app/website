"use client";

import { useActionState } from "react";
import { submitDeletionRequest, type DeletionRequestState } from "./actions";

/**
 * Delete-account request form — client component.
 *
 * Collects email + optional reason + required confirmation, then submits
 * to the `submitDeletionRequest` server action. Uses React 19's
 * `useActionState` for the pending/result state.
 */
export function DeletionRequestForm() {
  const [state, formAction, pending] = useActionState<
    DeletionRequestState | null,
    FormData
  >(submitDeletionRequest, null);

  if (state?.ok) {
    return (
      <div className="deletion-success">
        <h3>Request received</h3>
        <p>{state.message}</p>
        <p className="deletion-small">
          Lost access to your email? Contact us directly at{" "}
          <a href="mailto:areeb@awekn.com">areeb@awekn.com</a>.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="deletion-form" noValidate>
      <label className="deletion-label" htmlFor="email">
        Email address on your account
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="deletion-input"
      />

      <label className="deletion-label" htmlFor="reason">
        Reason (optional)
      </label>
      <textarea
        id="reason"
        name="reason"
        rows={3}
        maxLength={2000}
        placeholder="Why are you leaving? This helps us improve awekn."
        className="deletion-textarea"
      />

      <label className="deletion-checkbox">
        <input type="checkbox" name="confirm" required />
        <span>
          I understand that deleting my account is <strong>permanent</strong> and
          that all my workouts, photos, notes, and records will be erased.
        </span>
      </label>

      {state && !state.ok ? (
        <p className="deletion-error">{state.message}</p>
      ) : null}

      <button type="submit" disabled={pending} className="deletion-submit">
        {pending ? "Submitting…" : "Request deletion"}
      </button>

      <p className="deletion-small">
        We&apos;ll process your request within 7 business days and send a
        confirmation email when your account has been deleted.
      </p>
    </form>
  );
}
