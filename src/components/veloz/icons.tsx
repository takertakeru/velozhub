/**
 * VelozHub line icons, ported from the design prototype (`veloz-icons.jsx`).
 * Stroke-based, 24x24, inherit currentColor. The brand mark lives separately in
 * `@/components/veloz/brand` since it is used outside the booking feature too.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Stroke({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Home(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </Stroke>
  );
}

export function Calendar(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
      <path d="M4 9.5h16" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </Stroke>
  );
}

export function Plus(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Stroke>
  );
}

export function Car(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11" />
      <path d="M4 11h16v5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H7.5v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
      <circle cx={7.5} cy={14} r={0.6} />
      <circle cx={16.5} cy={14} r={0.6} />
    </Stroke>
  );
}

export function Sun(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx={12} cy={12} r={4} />
      <path d="M12 2v2.5" />
      <path d="M12 19.5V22" />
      <path d="M2 12h2.5" />
      <path d="M19.5 12H22" />
      <path d="M4.9 4.9l1.8 1.8" />
      <path d="M17.3 17.3l1.8 1.8" />
      <path d="M19.1 4.9l-1.8 1.8" />
      <path d="M6.7 17.3l-1.8 1.8" />
    </Stroke>
  );
}

export function Moon(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
    </Stroke>
  );
}

export function Chevron(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M9 6l6 6-6 6" />
    </Stroke>
  );
}

export function ChevronL(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Stroke>
  );
}

export function Close(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </Stroke>
  );
}

export function Edit(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 20h4L19 9a2 2 0 0 0-3-3L5 16v4z" />
      <path d="M14.5 7.5l3 3" />
    </Stroke>
  );
}

export function Trash(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </Stroke>
  );
}

export function Alert(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M12 3.5 21 19H3z" />
      <path d="M12 10v4" />
      <circle cx={12} cy={16.6} r={0.6} />
    </Stroke>
  );
}

export function Check(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M5 12.5 10 17.5 19 7" />
    </Stroke>
  );
}

export function CheckCircle(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx={12} cy={12} r={8.5} />
      <path d="M8.5 12.2 11 14.7 15.6 9.5" />
    </Stroke>
  );
}

export function Lock(props: IconProps) {
  return (
    <Stroke {...props}>
      <rect x={5} y={11} width={14} height={9} rx={2} />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Stroke>
  );
}

export function LogOut(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" />
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
    </Stroke>
  );
}

export function Clock(props: IconProps) {
  return (
    <Stroke {...props}>
      <circle cx={12} cy={12} r={8.2} />
      <path d="M12 7.5V12l3 2" />
    </Stroke>
  );
}

export function Refresh(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 4v5h-5" />
    </Stroke>
  );
}

export function Fuel(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M3 22h12" />
      <path d="M4 9h10" />
      <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
      <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" />
    </Stroke>
  );
}

export function Chart(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M4 20h16" />
      <path d="M7 20v-6" />
      <path d="M12 20v-10" />
      <path d="M17 20v-4" />
    </Stroke>
  );
}

export function Bell(props: IconProps) {
  return (
    <Stroke {...props}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10.5 20a1.5 1.5 0 0 0 3 0" />
    </Stroke>
  );
}

