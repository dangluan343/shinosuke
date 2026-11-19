import React from "react";
import { clsx } from "clsx";

export type CardVariant = "white" | "surface" | "primary" | "secondary" | "tertiary" | "high";

export interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  shadowSize?: "base" | "large";
}

const variantStyles: Record<CardVariant, string> = {
  white: "bg-white text-on-background",
  surface: "bg-surface text-on-background",
  primary: "bg-primary-fixed-dim text-on-primary-fixed",
  secondary: "bg-secondary-container text-on-secondary-container",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
  high: "bg-surface-container-high text-on-surface",
};

export const NeoCard: React.FC<NeoCardProps> = ({
  variant = "white",
  hoverable = false,
  shadowSize = "base",
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "neo-brutalist-border p-6",
        shadowSize === "large" ? "shadow-[8px_8px_0px_0px_#1e1b18]" : "hard-shadow",
        variantStyles[variant],
        hoverable && "transition-transform duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#1e1b18]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

