import type { SVGProps } from "react";

const S = ({
  s: size = 22,
  className,
  ...rest
}: SVGProps<SVGSVGElement> & { s?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className={className}
    {...rest}
  />
);

export type IconName =
  | "home"
  | "list"
  | "chart"
  | "user"
  | "plus"
  | "search"
  | "filter"
  | "wallet"
  | "arrowUp"
  | "arrowDown"
  | "check"
  | "x"
  | "edit"
  | "trash"
  | "download"
  | "trendUp"
  | "trendDown"
  | "minus"
  | "calendar"
  | "note"
  | "bank"
  | "piggy"
  | "receipt"
  | "shield"
  | "spark"
  | "clock"
  | "more"
  | "alert";

export function Icon({
  name,
  size = 22,
  className,
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const c = className;
  switch (name) {
    case "home":
      return (
        <S s={size} className={c}>
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 10v10h14V10" />
        </S>
      );
    case "list":
      return (
        <S s={size} className={c}>
          <path d="M8 6h13M8 12h13M8 18h13" />
          <path d="M3 6h.01M3 12h.01M3 18h.01" />
        </S>
      );
    case "chart":
      return (
        <S s={size} className={c}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 16v-5M12 16V8M16 16v-3" />
        </S>
      );
    case "user":
      return (
        <S s={size} className={c}>
          <path d="M20 21a8 8 0 0 0-16 0" />
          <path d="M12 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
        </S>
      );
    case "plus":
      return (
        <S s={size} className={c}>
          <path d="M12 5v14M5 12h14" />
        </S>
      );
    case "search":
      return (
        <S s={size} className={c}>
          <path d="m21 21-4.3-4.3" />
          <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
        </S>
      );
    case "filter":
      return (
        <S s={size} className={c}>
          <path d="M4 5h16l-6 7v6l-4 2v-8L4 5Z" />
        </S>
      );
    case "wallet":
      return (
        <S s={size} className={c}>
          <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
          <path d="M16 12h3" />
        </S>
      );
    case "arrowUp":
      return (
        <S s={size} className={c}>
          <path d="M12 19V5M5 12l7-7 7 7" />
        </S>
      );
    case "arrowDown":
      return (
        <S s={size} className={c}>
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </S>
      );
    case "check":
      return (
        <S s={size} className={c}>
          <path d="M20 6 9 17l-5-5" />
        </S>
      );
    case "x":
      return (
        <S s={size} className={c}>
          <path d="M18 6 6 18M6 6l12 12" />
        </S>
      );
    case "edit":
      return (
        <S s={size} className={c}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4L16.5 3.5Z" />
        </S>
      );
    case "trash":
      return (
        <S s={size} className={c}>
          <path d="M3 6h18M8 6V4h8v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <path d="M10 11v6M14 11v6" />
        </S>
      );
    case "download":
      return (
        <S s={size} className={c}>
          <path d="M12 3v12M8 11l4 4 4-4" />
          <path d="M4 21h16" />
        </S>
      );
    case "trendUp":
      return (
        <S s={size} className={c}>
          <path d="M22 7l-8.5 8.5-5-5L2 17" />
          <path d="M16 7h6v6" />
        </S>
      );
    case "trendDown":
      return (
        <S s={size} className={c}>
          <path d="M22 17l-8.5-8.5-5 5L2 7" />
          <path d="M16 17h6v-6" />
        </S>
      );
    case "minus":
      return (
        <S s={size} className={c}>
          <path d="M5 12h14" />
        </S>
      );
    case "calendar":
      return (
        <S s={size} className={c}>
          <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
        </S>
      );
    case "note":
      return (
        <S s={size} className={c}>
          <path d="M4 4h12l4 4v12H4V4Z" />
          <path d="M8 13h8M8 17h6" />
        </S>
      );
    case "bank":
      return (
        <S s={size} className={c}>
          <path d="M3 10h18L12 3 3 10Z" />
          <path d="M5 10v8M9 10v8M15 10v8M19 10v8M4 22h16" />
        </S>
      );
    case "piggy":
      return (
        <S s={size} className={c}>
          <path d="M19 11c1.5 1.2 2 3.5 2 6H5c0-2.5.5-4.8 2-6" />
          <path d="M7 11V9a5 5 0 0 1 9.6-2" />
          <path d="M7 17v2M17 17v2" />
        </S>
      );
    case "receipt":
      return (
        <S s={size} className={c}>
          <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" />
          <path d="M9 7h6M9 11h6" />
        </S>
      );
    case "shield":
      return (
        <S s={size} className={c}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        </S>
      );
    case "spark":
      return (
        <S s={size} className={c}>
          <path d="M9 11 12 2l1 9 9 1-9 1-1 9-1-9-9-1 9-1Z" />
        </S>
      );
    case "clock":
      return (
        <S s={size} className={c}>
          <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10Z" />
          <path d="M12 6v6l4 2" />
        </S>
      );
    case "more":
      return (
        <S s={size} className={c}>
          <path d="M12 5h.01M12 12h.01M12 19h.01" />
        </S>
      );
    case "alert":
      return (
        <S s={size} className={c}>
          <path d="M12 9v4M12 17h.01" />
          <path d="M10.3 3.2 1.8 18a2 2 0 0 0 1.7 3h16a2 2 0 0 0 1.7-3L13.7 3.2a2 2 0 0 0-3.4 0Z" />
        </S>
      );
    default:
      return <S s={size} className={c} />;
  }
}
