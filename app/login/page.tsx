import { redirect } from "next/navigation";
import { SetupIssue } from "@/components/SetupIssue";
import { getCurrentUser } from "@/lib/auth/server";
import { hasSupabaseEnv } from "@/lib/my-helper/env";
import { signIn, signUp } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!hasSupabaseEnv()) {
    return <SetupIssue message="Supabase is not configured, so login cannot run yet." />;
  }

  const query = await searchParams;
  const redirectTo = typeof query.redirectTo === "string" ? query.redirectTo : "/";
  const message = typeof query.message === "string" ? query.message : "";
  const user = await getCurrentUser();

  if (user) {
    redirect(redirectTo);
  }

  return (
    <main className="page-shell narrow auth-page">
      <section className="form-panel">
        <div>
          <p className="eyebrow">Account access</p>
          <h1>Log in to my-helper</h1>
          <p className="muted">
            Use your email and password to post requests, create provider profiles, and manage leads.
          </p>
        </div>
        {message ? <p className="notice inline-notice">{message}</p> : null}
        <form className="auth-form" action={signIn}>
          <input name="redirectTo" type="hidden" value={redirectTo} />
          <label>
            Email
            <input name="email" type="email" required placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input name="password" type="password" required minLength={6} placeholder="At least 6 characters" />
          </label>
          <div className="auth-actions">
            <button className="primary-button" type="submit">Log in</button>
            <button className="secondary-button" formAction={signUp} type="submit">Create account</button>
          </div>
        </form>
      </section>
    </main>
  );
}
