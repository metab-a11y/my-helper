import type { User } from "@supabase/supabase-js";

type AppShellProps = {
  children: React.ReactNode;
  user: User | null;
};

const navItems = [
  { href: "/", label: "Home" },
  { href: "/requests", label: "Requests" },
  { href: "/providers", label: "Providers" },
  { href: "/leads", label: "Leads" },
];

export function AppShell({ children, user }: AppShellProps) {
  return (
    <>
      <input className="nav-toggle" id="nav-toggle" type="checkbox" />
      <header className="site-header">
        <div className="header-left">
          <label className="hamburger" htmlFor="nav-toggle" aria-label="Open navigation">
            <span />
            <span />
            <span />
          </label>
          <a className="brand" href="/">my-helper</a>
        </div>
        <nav className="top-nav" aria-label="Primary">
          {navItems.slice(1).map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className="account-area">
          {user ? (
            <>
              <span title={user.email || "Signed in"}>{user.email}</span>
              <form action="/auth/logout" method="post">
                <button className="nav-button" type="submit">Log out</button>
              </form>
            </>
          ) : (
            <a className="nav-button" href="/login">Log in</a>
          )}
        </div>
      </header>
      <label className="nav-backdrop" htmlFor="nav-toggle" aria-label="Close navigation" />
      <aside className="side-nav" aria-label="Sidebar">
        <div className="side-nav-header">
          <a className="brand" href="/">my-helper</a>
          <label className="close-nav" htmlFor="nav-toggle" aria-label="Close navigation">x</label>
        </div>
        <nav aria-label="Main sections">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className="side-account">
          {user ? (
            <>
              <span>{user.email}</span>
              <form action="/auth/logout" method="post">
                <button className="secondary-button" type="submit">Log out</button>
              </form>
            </>
          ) : (
            <a className="primary-button" href="/login">Log in</a>
          )}
        </div>
      </aside>
      <div className="app-frame">
        {children}
      </div>
    </>
  );
}
