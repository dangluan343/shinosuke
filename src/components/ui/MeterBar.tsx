import React from "react";
import { clsx } from "clsx";

export type MeterVariant = "primary" | "secondary" | "tertiary" | "error" | "gray";

export interface MeterBarProps {
  label: string;
  value: number; // 0 - 100
  variant?: MeterVariant;
  height?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const fillStyles: Record<MeterVariant, string> = {
  primary: "bg-primary text-on-primary",
  secondary: "bg-secondary text-on-secondary",
  tertiary: "bg-tertiary-container text-on-tertiary-container",
  error: "bg-error text-on-error",
  gray: "bg-on-surface-variant text-white",
};

const heightStyles = {
  sm: "h-4",
  md: "h-8",
  lg: "h-10",
};

export const MeterBar: React.FC<MeterBarProps> = ({
  label,
  value,
  variant = "primary",
  height = "md",
  showValue = true,
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx("w-full space-y-2 select-none", className)}>
      <div className="flex justify-between items-center font-label-bold text-sm">
        <span>{label}</span>
        {showValue && <span className="font-mono font-bold">{clampedValue}%</span>}
      </div>
      <div
        className={clsx(
          "w-full bg-surface-container neo-brutalist-border relative overflow-hidden",
          heightStyles[height]
        )}
      >
        <div
          className={clsx(
            "h-full hatch-pattern transition-all duration-500 ease-out",
            fillStyles[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};

