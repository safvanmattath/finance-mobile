import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/Icon";

export function StatCard({
  title,
  value,
  hint,
  icon,
  tone = "neutral",
}: {
  title: string;
  value: string;
  hint?: string;
  icon: IconName;
  tone?: "good" | "bad" | "neutral" | "accent";
}) {
  return (
    <article className={`stat stat--${tone}`} aria-label={title}>
      <div className="stat__top">
        <span className="stat__title">{title}</span>
        <span className="stat__icon" aria-hidden>
          <Icon name={icon} size={20} />
        </span>
      </div>
      <p className="stat__value">{value}</p>
      {hint ? <p className="stat__hint">{hint}</p> : null}
    </article>
  );
}

export function Screen({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="screen">
      <header className="screen__header">
        <div>
          <h1 className="screen__title">{title}</h1>
          {subtitle ? <p className="screen__sub">{subtitle}</p> : null}
        </div>
        {actions ? <div className="screen__actions">{actions}</div> : null}
      </header>
      <div className="screen__body">{children}</div>
    </div>
  );
}
