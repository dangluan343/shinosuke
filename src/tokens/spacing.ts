/**
 * Design Tokens: Spacing, Borders, Shadows & Animation Constants
 */
export const spacing: Record<string, string> = {
  unit: "8px",
  gutter: "24px",
  "section-gap": "80px",
  "margin-desktop": "64px",
  "margin-mobile": "16px",
};

export const borderRadius: Record<string, string> = {
  DEFAULT: "0.25rem",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
};

export const neoBrutalism = {
  borderWidth: "3px",
  borderColor: "#1e1b18",
  borderStyle: "solid",
  shadows: {
    base: "4px 4px 0px 0px #1e1b18",
    hover: "8px 8px 0px 0px #1e1b18",
    active: "0px 0px 0px 0px #1e1b18",
    large: "12px 12px 0px 0px #1e1b18",
    white: "6px 6px 0px 0px #ffffff",
  },
};
