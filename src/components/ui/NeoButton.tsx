"use client";

import React from "react";
import Link from "next/link";
import { clsx } from "clsx";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "white" | "dark" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-container",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-container",
  white: "bg-white text-on-background hover:bg-surface-container-low",
  dark: "bg-on-background text-white hover:bg-inverse-surface",
  outline: "bg-transparent text-on-background hover:bg-surface-container-lowest",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-xs font-label-bold",
  md: "px-6 py-2.5 text-sm font-label-bold",
  lg: "px-8 py-3.5 text-base font-label-bold tracking-wide",
};

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = "primary",
  size = "md",
  href,
  icon,
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = clsx(
    "inline-flex items-center justify-center gap-2 uppercase select-none transition-all duration-150 cursor-pointer",
    "neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active",
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
