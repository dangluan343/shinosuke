/**
 * Design Tokens: Color Palette (Google Stitch x Shinosuke Theme)
 * Inspired by Shin-chan's iconic anime styling (Red shirt, yellow shorts, blue shoes)
 * with Material 3 token semantics and Neo-brutalist ink borders.
 */
export const colors: Record<string, string> = {
  // Brand & Action Primary (Red)
  primary: "#b7000c",
  "primary-container": "#e60012",
  "primary-fixed": "#ffdad5",
  "primary-fixed-dim": "#ffb4aa",
  "on-primary": "#ffffff",
  "on-primary-container": "#fff7f6",
  "on-primary-fixed": "#410001",
  "on-primary-fixed-variant": "#930007",
  "inverse-primary": "#ffb4aa",

  // Secondary & Accents (Blue / Kazama)
  secondary: "#0b5eaf",
  "secondary-container": "#6ba7fd",
  "secondary-fixed": "#d5e3ff",
  "secondary-fixed-dim": "#a7c8ff",
  "on-secondary": "#ffffff",
  "on-secondary-container": "#003b74",
  "on-secondary-fixed": "#001b3b",
  "on-secondary-fixed-variant": "#004788",

  // Tertiary & Comic Pop (Yellow / Gold)
  tertiary: "#666000",
  "tertiary-container": "#b9ae00",
  "tertiary-fixed": "#f4e700",
  "tertiary-fixed-dim": "#d6ca00",
  "on-tertiary": "#ffffff",
  "on-tertiary-container": "#454100",
  "on-tertiary-fixed": "#1f1c00",
  "on-tertiary-fixed-variant": "#4d4800",

  // Surfaces & Backgrounds
  background: "#fff8f5",
  surface: "#fff8f5",
  "surface-bright": "#fff8f5",
  "surface-dim": "#e1d8d4",
  "surface-variant": "#e9e1dc",
  "surface-container-lowest": "#ffffff",
  "surface-container-low": "#fbf2ed",
  "surface-container": "#f5ece7",
  "surface-container-high": "#efe6e2",
  "surface-container-highest": "#e9e1dc",
  "surface-tint": "#c0000d",

  // Ink, Text & Neo-Brutalist Border Outline
  "on-background": "#1e1b18",
  "on-surface": "#1e1b18",
  "on-surface-variant": "#5f3f3b",
  outline: "#946e69",
  "outline-variant": "#e9bcb6",
  "inverse-surface": "#34302c",
  "inverse-on-surface": "#f8efea",

  // Error & Alert States (Misae's Anger / Nene-chan)
  error: "#ba1a1a",
  "error-container": "#ffdad6",
  "on-error": "#ffffff",
  "on-error-container": "#93000a",

  // Pure Values for Convenience
  white: "#ffffff",
  black: "#000000",
  ink: "#1e1b18",
};

export type ColorToken = keyof typeof colors;
