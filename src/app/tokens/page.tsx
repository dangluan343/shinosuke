import React from "react";
import Link from "next/link";
import { colors } from "@/tokens/colors";

export default function TokensShowcasePage() {
  const brandColors = [
    { name: "primary", hex: colors.primary, text: "#fff", role: "Shin-chan Red (Brand / Primary Action)" },
    { name: "primary-container", hex: colors["primary-container"], text: "#fff", role: "Vibrant Red Container" },
    { name: "secondary", hex: colors.secondary, text: "#fff", role: "Action Blue (Active / Kazama-kun)" },
    { name: "secondary-container", hex: colors["secondary-container"], text: "#003b74", role: "Light Sky Blue Banner" },
    { name: "tertiary-fixed", hex: colors["tertiary-fixed"], text: "#1f1c00", role: "Shin-chan Shorts Yellow (High Attention)" },
    { name: "tertiary", hex: colors.tertiary, text: "#fff", role: "Olive / Bo-chan Accent" },
    { name: "on-background (ink)", hex: colors["on-background"], text: "#fff", role: "Comic Ink Border & Hard Shadow" },
    { name: "background", hex: colors.background, text: "#1e1b18", role: "Warm Light Paper Background" },
    { name: "error", hex: colors.error, text: "#fff", role: "Misae Anger Alert Red" },
  ];

  const typographyScales = [
    { token: "text-display-lg", font: "Bricolage Grotesque", size: "48px / 56px", weight: "800", sample: "HEY, HEY, HEY! WELCOME!" },
    { token: "text-display-lg-mobile", font: "Bricolage Grotesque", size: "36px / 42px", weight: "800", sample: "Kasukabe Defense Group" },
    { token: "text-headline-md", font: "Bricolage Grotesque", size: "32px / 40px", weight: "700", sample: "Trouble Meter & News" },
    { token: "text-headline-sm", font: "Bricolage Grotesque", size: "24px / 32px", weight: "700", sample: "Action Mask Marathon Weekend" },
    { token: "text-body-lg", font: "Plus Jakarta Sans", size: "18px / 28px", weight: "500", sample: "Join Shinnosuke Nohara for another day of high-energy mischief and chocolate stars." },
    { token: "text-body-md", font: "Plus Jakarta Sans", size: "16px / 24px", weight: "400", sample: "Authorities report all red crayons have mysteriously vanished from local kindergartens..." },
    { token: "text-label-bold", font: "Space Grotesk", size: "14px / 20px", weight: "700", sample: "ACTION MASK! FAN CLUB REGISTER" },
    { token: "text-caption", font: "Plus Jakarta Sans", size: "12px / 16px", weight: "600", sample: "Photo by Shin-chan (he stole Hiroshi's camera)" },
  ];

  return (
    <div className="min-h-screen bg-background text-on-background p-6 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <header className="bg-primary text-on-primary neo-brutalist-border hard-shadow p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border rounded-full font-label-bold text-xs uppercase mb-3 -rotate-2">
            Design System Phase 1 Verification
          </div>
          <h1 className="font-display-lg text-display-lg leading-none tracking-tight">
            SHINOSUKE DESIGN TOKENS
          </h1>
          <p className="font-body-md mt-2 text-primary-fixed">
            Hệ thống Design Tokens chuẩn hóa từ Google Stitch MCP: Colors, Typography, Spacing, Shadows & Borders.
          </p>
        </div>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-on-background neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active font-label-bold uppercase text-sm"
        >
          Trang Chủ (Home)
        </Link>
      </header>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 bg-tertiary-fixed neo-brutalist-border flex items-center justify-center font-label-bold">1</span>
          <h2 className="font-headline-md text-headline-md uppercase">Core Color Palette Tokens</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandColors.map((c) => (
            <div
              key={c.name}
              className="neo-brutalist-border hard-shadow bg-white p-5 flex flex-col justify-between space-y-4"
            >
              <div
                className="w-full h-24 neo-brutalist-border flex items-center justify-center font-label-bold text-sm"
                style={{ backgroundColor: c.hex, color: c.text }}
              >
                {c.hex.toUpperCase()}
              </div>
              <div>
                <div className="font-label-bold text-base text-primary uppercase">{c.name}</div>
                <div className="font-body-md text-sm text-on-surface-variant mt-1">{c.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Hierarchy Tokens */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 bg-secondary-container neo-brutalist-border flex items-center justify-center font-label-bold">2</span>
          <h2 className="font-headline-md text-headline-md uppercase">Typography Scale Tokens</h2>
        </div>
        <div className="bg-white neo-brutalist-border hard-shadow divide-y-[3px] divide-on-background">
          {typographyScales.map((t) => (
            <div key={t.token} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="md:w-1/3">
                <span className="font-label-bold text-sm text-secondary bg-secondary-fixed px-2 py-1 neo-brutalist-border inline-block mb-1">
                  {t.token}
                </span>
                <div className="font-caption text-xs text-on-surface-variant">
                  {t.font} • {t.size} • Weight {t.weight}
                </div>
              </div>
              <div className="md:w-2/3">
                <p className={`${t.token} text-on-background truncate`}>{t.sample}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Neo-Brutalist Effects & Elevation Tokens */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="w-8 h-8 bg-primary-fixed neo-brutalist-border flex items-center justify-center font-label-bold">3</span>
          <h2 className="font-headline-md text-headline-md uppercase">Elevation & Effect Tokens</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hard Shadow Base */}
          <div className="bg-white neo-brutalist-border hard-shadow p-6 space-y-3">
            <span className="font-label-bold text-primary">.hard-shadow</span>
            <p className="font-body-md text-sm">
              Đổ bóng đen góc vuông <code>4px 4px 0px #1e1b18</code>, viền đen 3px.
            </p>
            <div className="h-16 bg-surface-container neo-brutalist-border flex items-center justify-center font-label-bold text-xs uppercase">
              Base Static Shadow
            </div>
          </div>

          {/* Interactive Hover / Active States */}
          <div className="bg-white neo-brutalist-border hard-shadow p-6 space-y-3">
            <span className="font-label-bold text-secondary">Interactive Pop State</span>
            <p className="font-body-md text-sm">
              Rê chuột để nổi lên (hover: <code>-2px, -2px</code>), click để lún xuống (active: <code>+4px, +4px</code>).
            </p>
            <button className="w-full py-3 bg-primary text-on-primary neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active font-label-bold uppercase text-sm">
              Test Click Me!
            </button>
          </div>

          {/* Comic Hatch Pattern */}
          <div className="bg-white neo-brutalist-border hard-shadow p-6 space-y-3">
            <span className="font-label-bold text-tertiary">.comic-hatch</span>
            <p className="font-body-md text-sm">
              Hoa văn sọc chéo 45 độ phong cách bản in truyện tranh anime cel 90s.
            </p>
            <div className="w-full h-16 bg-surface-container-high comic-hatch neo-brutalist-border flex items-center justify-center font-label-bold text-xs uppercase">
              Hatch Texture
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Prototype Widget (Trouble Meter) */}
      <section className="bg-surface-container-low neo-brutalist-border hard-shadow p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-background uppercase">
              Trouble Meter Token Test
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant">
              Kiểm thử khả năng kết hợp các token: progress bar, hatch pattern, responsive buttons.
            </p>
          </div>
          <span className="material-symbols-outlined text-4xl text-primary">warning</span>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="flex justify-between font-label-bold text-sm">
            <span>Misae&apos;s Anger Level</span>
            <span className="text-primary">85%</span>
          </div>
          <div className="w-full h-8 bg-surface-container neo-brutalist-border overflow-hidden">
            <div className="h-full bg-primary hatch-pattern w-[85%]"></div>
          </div>

          <div className="flex justify-between font-label-bold text-sm">
            <span>Chocobi Supply</span>
            <span className="text-secondary">12%</span>
          </div>
          <div className="w-full h-8 bg-surface-container neo-brutalist-border overflow-hidden">
            <div className="h-full bg-secondary hatch-pattern w-[12%]"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

