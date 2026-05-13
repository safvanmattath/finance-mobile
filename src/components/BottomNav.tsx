import { Icon, type IconName } from "@/components/Icon";

const items: { id: "home" | "transfers" | "analytics" | "profile"; label: string; icon: IconName }[] =
  [
    { id: "home", label: "Home", icon: "home" },
    { id: "transfers", label: "Transfers", icon: "list" },
    { id: "analytics", label: "Analytics", icon: "chart" },
    { id: "profile", label: "Profile", icon: "user" },
  ];

export function BottomNav({
  active,
  onChange,
}: {
  active: (typeof items)[number]["id"];
  onChange: (id: (typeof items)[number]["id"]) => void;
}) {
  return (
    <nav
      className="bottom-nav"
      role="navigation"
      aria-label="Primary"
    >
      {items.map((it) => {
        const is = it.id === active;
        return (
          <button
            key={it.id}
            type="button"
            className={`bottom-nav__btn${is ? " bottom-nav__btn--active" : ""}`}
            onClick={() => onChange(it.id)}
            aria-current={is ? "page" : undefined}
          >
            <Icon name={it.icon} size={24} />
            <span>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
