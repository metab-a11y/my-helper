export function SetupIssue({ message }: { message: string }) {
  return (
    <main className="page-shell">
      <section className="setup-issue">
        <p className="eyebrow">Setup issue</p>
        <h1>The app is deployed, but it cannot read the database yet.</h1>
        <p>{message}</p>
        <div className="setup-checklist">
          <strong>Check these in Vercel and Supabase:</strong>
          <span>NEXT_PUBLIC_SUPABASE_URL is the full https://...supabase.co URL.</span>
          <span>NEXT_PUBLIC_SUPABASE_ANON_KEY is set for Production.</span>
          <span>The Supabase SQL migrations 0001, 0002, and 0003 have run successfully.</span>
        </div>
      </section>
    </main>
  );
}
