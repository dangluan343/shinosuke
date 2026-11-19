import React from "react";
import { clsx } from "clsx";

export type BadgeVariant = "primary" | "secondary" | "tertiary" | "white" | "dark" | "outline";

export interface NeoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  rotate?: -12 | -6 | -2 | 0 | 2 | 3 | 6 | 12;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
  white: "bg-white text-on-background",
  dark: "bg-on-background text-white",
  outline: "bg-surface text-on-surface border border-on-background",
};

const rotateStyles: Record<number, string> = {
  [-12]: "-rotate-12",
  [-6]: "-rotate-6",
  [-2]: "-rotate-2",
  [0]: "rotate-0",
  [2]: "rotate-2",
  [3]: "rotate-3",
  [6]: "rotate-6",
  [12]: "rotate-12",
};

export const NeoBadge: React.FC<NeoBadgeProps> = ({
  variant = "tertiary",
  rotate = 0,
  size = "md",
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center font-label-bold uppercase rounded-full neo-brutalist-border select-none",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3.5 py-1 text-xs",
        variantStyles[variant],
        rotateStyles[rotate] || "rotate-0",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

