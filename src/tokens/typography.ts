/**
 * Design Tokens: Typography Scale & Font Configuration
 * Configured with Bricolage Grotesque, Plus Jakarta Sans, and Space Grotesk
 */
export const fontFamilies = {
  display: ["var(--font-bricolage)", "sans-serif"],
  headline: ["var(--font-bricolage)", "sans-serif"],
  body: ["var(--font-jakarta)", "sans-serif"],
  label: ["var(--font-space)", "sans-serif"],
  caption: ["var(--font-jakarta)", "sans-serif"],
};

export type FontConfig = [
  fontSize: string,
  configuration: {
    lineHeight?: string;
    letterSpacing?: string;
    fontWeight?: string | number;
  }
];

export const fontSize: Record<string, FontConfig> = {
  // Display Sizes (Headlines, Hero)
  "display-lg": [
    "48px",
    {
      lineHeight: "56px",
      letterSpacing: "-0.02em",
      fontWeight: "800",
    },
  ],
  "display-lg-mobile": [
    "36px",
    {
      lineHeight: "42px",
      fontWeight: "800",
    },
  ],

  // Headlines
  "headline-md": [
    "32px",
    {
      lineHeight: "40px",
      fontWeight: "700",
    },
  ],
  "headline-sm": [
    "24px",
    {
      lineHeight: "32px",
      fontWeight: "700",
    },
  ],

  // Body Content
  "body-lg": [
    "18px",
    {
      lineHeight: "28px",
      fontWeight: "500",
    },
  ],
  "body-md": [
    "16px",
    {
      lineHeight: "24px",
      fontWeight: "400",
    },
  ],

  // Labels & Badges
  "label-bold": [
    "14px",
    {
      lineHeight: "20px",
      fontWeight: "700",
    },
  ],

  // Small Captions
  caption: [
    "12px",
    {
      lineHeight: "16px",
      fontWeight: "600",
    },
  ],
};
