const EMAIL = "aliefbuscode@gmail.com";

const TABS = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/experience/", label: "Experience", icon: IconExperience },
  { href: "/learning/", label: "Learning", icon: IconLearning },
  { href: `mailto:${EMAIL}`, label: "Email", icon: IconEmail },
];

function isActive(href: string, currentPath: string) {
  if (href.startsWith("mailto:")) return false;
  return href === "/" ? currentPath === "/" : currentPath.startsWith(href);
}

export default function Nav({ currentPath }: { currentPath: string }) {
  return (
    <>
      <header className="nav">
        <div className="nav__row container">
          <a href="/" className="nav__wordmark">
            Alief Firmanda
          </a>

          <nav className="nav__links" aria-label="Primary">
            {TABS.slice(0, 3).map((tab) => (
              <a
                key={tab.href}
                href={tab.href}
                aria-current={isActive(tab.href, currentPath) ? "page" : undefined}
              >
                {tab.label}
              </a>
            ))}
            <a href={`mailto:${EMAIL}`} className="nav__cta">
              Email
            </a>
          </nav>
        </div>

        <hr className="rule" />
      </header>

      <nav className="tabbar" aria-label="Primary">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href, currentPath);
          return (
            <a
              key={tab.href}
              href={tab.href}
              className="tabbar__item"
              aria-current={active ? "page" : undefined}
            >
              <Icon />
              <span>{tab.label}</span>
            </a>
          );
        })}
      </nav>
    </>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M5.5 10v9.5h5V14h3v5.5h5V10" />
    </svg>
  );
}

function IconExperience() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="7" width="17" height="12.5" rx="1.5" />
      <path d="M8.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M3.5 13h17" />
    </svg>
  );
}

function IconLearning() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 6.5c-2-1.4-5-1.9-8-1.4v13c3-.5 6 0 8 1.4c2-1.4 5-1.9 8-1.4v-13c-3-.5-6 0-8 1.4Z" />
      <path d="M12 6.5v13" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="M4.5 7l7.5 6.5L19.5 7" />
    </svg>
  );
}
