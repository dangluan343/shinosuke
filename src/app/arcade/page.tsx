"use client";

import React, { useState } from "react";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { PepperDodgerGame } from "@/components/arcade/PepperDodgerGame";
import { JankenponGame } from "@/components/arcade/JankenponGame";
import { MemeSoundboard } from "@/components/arcade/MemeSoundboard";
import { ChocobiFortune } from "@/components/arcade/ChocobiFortune";

export default function ArcadePage() {
  const [activeTab, setActiveTab] = useState<"dodger" | "janken" | "soundboard" | "fortune">("dodger");

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-tertiary-fixed selection:text-on-background">
      <TopNavBar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Arcade Hero Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-[3px] border-on-background">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <NeoBadge variant="secondary" rotate={-2} className="px-3 py-1 text-xs">
                KASUKABE ARCADE ZONE 🕹️
              </NeoBadge>
              <NeoBadge variant="tertiary" rotate={2} className="px-3 py-1 text-xs animate-bounce">
                NEW RELEASE ⭐
              </NeoBadge>
            </div>

            <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase italic text-on-background drop-shadow-[2px_2px_0px_#b7000c] leading-none">
              Giggles & Games
            </h1>

            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Khu vui chơi giải trí tấu hài độc quyền của Shin Cậu Bé Bút Chì và biệt đội Kasukabe! Né ớt chuông, oẳn tù tì ăn gian, bấm soundboard và rút quẻ bói hôm nay.
            </p>
          </div>

          {/* Navigation Game Tabs */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setActiveTab("dodger")}
              className={`px-4 py-2.5 rounded-none neo-brutalist-border font-label-bold text-xs uppercase cursor-pointer select-none transition-all flex items-center gap-2 ${
                activeTab === "dodger"
                  ? "bg-primary text-white hard-shadow -translate-x-0.5 -translate-y-0.5"
                  : "bg-surface text-on-surface hover:bg-tertiary-fixed"
              }`}
            >
              <span>🫑</span> Né Ớt Chuông
            </button>

            <button
              onClick={() => setActiveTab("janken")}
              className={`px-4 py-2.5 rounded-none neo-brutalist-border font-label-bold text-xs uppercase cursor-pointer select-none transition-all flex items-center gap-2 ${
                activeTab === "janken"
                  ? "bg-secondary text-white hard-shadow -translate-x-0.5 -translate-y-0.5"
                  : "bg-surface text-on-surface hover:bg-tertiary-fixed"
              }`}
            >
              <span>✌️</span> Oẳn Tù Tì
            </button>

            <button
              onClick={() => setActiveTab("soundboard")}
              className={`px-4 py-2.5 rounded-none neo-brutalist-border font-label-bold text-xs uppercase cursor-pointer select-none transition-all flex items-center gap-2 ${
                activeTab === "soundboard"
                  ? "bg-tertiary-fixed text-on-tertiary-fixed hard-shadow -translate-x-0.5 -translate-y-0.5"
                  : "bg-surface text-on-surface hover:bg-tertiary-fixed"
              }`}
            >
              <span>📢</span> Soundboard
            </button>

            <button
              onClick={() => setActiveTab("fortune")}
              className={`px-4 py-2.5 rounded-none neo-brutalist-border font-label-bold text-xs uppercase cursor-pointer select-none transition-all flex items-center gap-2 ${
                activeTab === "fortune"
                  ? "bg-surface-container-high text-on-surface hard-shadow -translate-x-0.5 -translate-y-0.5"
                  : "bg-surface text-on-surface hover:bg-tertiary-fixed"
              }`}
            >
              <span>🥠</span> Bói Chocobi
            </button>
          </div>
        </header>

        {/* Tab 1: Pepper Dodger Game */}
        {activeTab === "dodger" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <PepperDodgerGame />
          </section>
        )}

        {/* Tab 2: Jankenpon Battle Game */}
        {activeTab === "janken" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <JankenponGame />
          </section>
        )}

        {/* Tab 3: Kasukabe Meme Soundboard */}
        {activeTab === "soundboard" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <MemeSoundboard />
          </section>
        )}

        {/* Tab 4: Chocobi Fortune Cookie */}
        {activeTab === "fortune" && (
          <section className="space-y-6 animate-in fade-in duration-300">
            <ChocobiFortune />
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

