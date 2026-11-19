"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoCard } from "@/components/ui/NeoCard";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { MeterBar } from "@/components/ui/MeterBar";

export default function UIKitPage() {
  const [troubleLevel, setTroubleLevel] = useState(85);
  const [chocobiStock, setChocobiStock] = useState(25);

  const handleTroubleClick = () => {
    setTroubleLevel((prev) => {
      const next = prev + 10;
      if (next >= 100) {
        alert("🚨 BÁO ĐỘNG ĐỎ: Mẹ Misae đang cầm chổi đuổi tới nơi rồi! Trốn mau! 🚨");
        return 20;
      }
      return next;
    });
    setChocobiStock((prev) => Math.max(0, prev - 5));
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-between">
      <TopNavBar />

      <main className="flex-grow p-6 md:p-12 space-y-12 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border hard-shadow p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <NeoBadge variant="primary" rotate={-2} className="mb-3">
              Phase 3 Outcome Verification
            </NeoBadge>
            <h1 className="font-display-lg text-display-lg leading-none tracking-tight">
              NEO-BRUTALIST UI KIT
            </h1>
            <p className="font-body-md mt-2 text-on-tertiary-fixed-variant">
              Bộ thành phần nguyên tử dùng chung: NeoButton, NeoCard, NeoBadge, MeterBar, TopNavBar, Footer.
            </p>
          </div>
          <div className="flex gap-3">
            <NeoButton variant="white" size="sm" href="/tokens">
              Tokens
            </NeoButton>
            <NeoButton variant="secondary" size="sm" href="/assets">
              Assets
            </NeoButton>
          </div>
        </header>

        {/* 1. NeoButton Showcase */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 bg-primary text-on-primary neo-brutalist-border flex items-center justify-center font-label-bold">
              1
            </span>
            <h2 className="font-headline-md text-headline-md uppercase">
              NeoButton (Variants & Sizes)
            </h2>
          </div>
          <NeoCard variant="white" className="space-y-6">
            <div>
              <h3 className="font-label-bold text-sm text-on-surface-variant mb-3 uppercase">
                Color Variants (Clickable & Active Push State)
              </h3>
              <div className="flex flex-wrap gap-4">
                <NeoButton variant="primary" onClick={() => alert("Primary button clicked!")}>
                  Primary (Red)
                </NeoButton>
                <NeoButton variant="secondary" onClick={() => alert("Secondary button clicked!")}>
                  Secondary (Blue)
                </NeoButton>
                <NeoButton variant="tertiary" onClick={() => alert("Tertiary button clicked!")}>
                  Tertiary (Yellow)
                </NeoButton>
                <NeoButton variant="white" onClick={() => alert("White button clicked!")}>
                  White Button
                </NeoButton>
                <NeoButton variant="dark" onClick={() => alert("Dark button clicked!")}>
                  Dark Ink Button
                </NeoButton>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-on-background/20">
              <h3 className="font-label-bold text-sm text-on-surface-variant mb-3 uppercase">
                Sizes (Small, Medium, Large)
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <NeoButton size="sm" variant="primary">
                  Small (sm)
                </NeoButton>
                <NeoButton size="md" variant="secondary">
                  Medium (md)
                </NeoButton>
                <NeoButton size="lg" variant="tertiary">
                  Large Hero (lg)
                </NeoButton>
              </div>
            </div>
          </NeoCard>
        </section>

        {/* 2. NeoBadge & Stickers */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 bg-secondary text-on-secondary neo-brutalist-border flex items-center justify-center font-label-bold">
              2
            </span>
            <h2 className="font-headline-md text-headline-md uppercase">
              NeoBadge & Rotate Stickers
            </h2>
          </div>
          <NeoCard variant="surface" className="flex flex-wrap items-center gap-4">
            <NeoBadge variant="primary" rotate={-6}>
              THE BOSS
            </NeoBadge>
            <NeoBadge variant="tertiary" rotate={3}>
              Silly Level: MAX
            </NeoBadge>
            <NeoBadge variant="secondary" rotate={-2}>
              Action Mask Club
            </NeoBadge>
            <NeoBadge variant="white" rotate={6}>
              Kasukabe 100% Fun
            </NeoBadge>
            <NeoBadge variant="dark" rotate={-12}>
              Secret Mission
            </NeoBadge>
          </NeoCard>
        </section>

        {/* 3. NeoCard Variations */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border flex items-center justify-center font-label-bold">
              3
            </span>
            <h2 className="font-headline-md text-headline-md uppercase">
              NeoCard (Elevations & Hover Pop)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <NeoCard variant="white" hoverable className="space-y-2">
              <span className="font-label-bold text-primary">Variant: White (Hoverable)</span>
              <p className="font-body-md text-sm text-on-surface-variant">
                Rê chuột lên để thấy hiệu ứng nổi bổng <code>-translate-y-1</code> và tăng bóng đổ.
              </p>
            </NeoCard>
            <NeoCard variant="secondary" hoverable className="space-y-2">
              <span className="font-label-bold">Variant: Secondary</span>
              <p className="font-body-md text-sm">
                Nền xanh tươi sáng dùng cho các hộp thông điệp nổi bật và banner Hero.
              </p>
            </NeoCard>
            <NeoCard variant="tertiary" hoverable className="space-y-2">
              <span className="font-label-bold">Variant: Tertiary</span>
              <p className="font-body-md text-sm text-on-tertiary-fixed-variant">
                Màu vàng tươi phong cách quần của Shin, thu hút sự chú ý tức thì.
              </p>
            </NeoCard>
          </div>
        </section>

        {/* 4. MeterBar Dynamic Widget */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="w-8 h-8 bg-primary text-on-primary neo-brutalist-border flex items-center justify-center font-label-bold">
              4
            </span>
            <h2 className="font-headline-md text-headline-md uppercase">
              MeterBar (Interactive Progress Bars)
            </h2>
          </div>
          <NeoCard variant="white" className="space-y-6 max-w-2xl">
            <MeterBar
              label="Misae's Anger Level (Mức độ cáu của Mẹ)"
              value={troubleLevel}
              variant={troubleLevel > 70 ? "error" : "primary"}
              height="lg"
            />

            <MeterBar
              label="Chocobi Supply (Kho bánh socola sao)"
              value={chocobiStock}
              variant="secondary"
              height="md"
            />

            <div className="pt-2 flex gap-4">
              <NeoButton variant="primary" onClick={handleTroubleClick}>
                Quậy thêm chút nữa! (+10% Anger)
              </NeoButton>
              <NeoButton
                variant="white"
                onClick={() => {
                  setTroubleLevel(30);
                  setChocobiStock(80);
                }}
              >
                Reset lại về ban đầu
              </NeoButton>
            </div>
          </NeoCard>
        </section>
      </main>

      <Footer />
    </div>
  );
}

