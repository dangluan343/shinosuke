"use client";

import React from "react";
import Image from "next/image";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { ASSETS } from "@/constants/assets";
import { soundFx } from "@/lib/audio";

interface Character {
  id: string;
  name: string;
  colorName: string;
  badge?: string;
  image: string;
  mischief: number;
  mischiefColor: string;
  quote: string;
}

const DEFENSE_GROUP: Character[] = [
  {
    id: "shin",
    name: "Shin-chan",
    colorName: "text-primary",
    badge: "THE BOSS",
    image: ASSETS.characters.shinChan.src,
    mischief: 98,
    mischiefColor: "bg-primary",
    quote: '"Hey, Action Mask! Wait for meeeee!"',
  },
  {
    id: "kazama",
    name: "Kazama-kun",
    colorName: "text-secondary",
    image: ASSETS.characters.kazama.src,
    mischief: 15,
    mischiefColor: "bg-secondary",
    quote: '"I am a refined gentleman from a high-class family!"',
  },
  {
    id: "nene",
    name: "Nene-chan",
    colorName: "text-error",
    image: ASSETS.characters.nene.src,
    mischief: 75,
    mischiefColor: "bg-error",
    quote: '"Time to play Real House! I\'m the mother, you\'re the salaryman!"',
  },
  {
    id: "masao",
    name: "Masao-kun",
    colorName: "text-on-surface-variant",
    image: ASSETS.characters.masao.src,
    mischief: 10,
    mischiefColor: "bg-on-surface-variant",
    quote: '"Why does this always happen to me? *cries*"',
  },
  {
    id: "bo",
    name: "Bo-chan",
    colorName: "text-tertiary",
    image: ASSETS.characters.boChan.src,
    mischief: 30,
    mischiefColor: "bg-tertiary",
    quote: '"Bo... found a nice rock... Bo."',
  },
  {
    id: "shiro",
    name: "Shiro",
    colorName: "text-primary",
    image: ASSETS.characters.shiro.src,
    mischief: 5,
    mischiefColor: "bg-primary",
    quote: '"Woof! (The only responsible one here)"',
  },
];

const NOHARA_CLAN = [
  {
    name: "Misae",
    colorName: "text-secondary",
    image: ASSETS.characters.misae.src,
    quote: '"Shin-chan! Stop showing your butt to the neighbors!"',
    badgeText: "Mischief Manager Level: 100",
    badgeBg: "bg-secondary-fixed",
  },
  {
    name: "Hiroshi",
    colorName: "text-tertiary",
    image: ASSETS.characters.hiroshi.src,
    quote: '"My socks... they\'re more powerful than any weapon."',
    badgeText: "Smelly Feet Level: OVER 9000",
    badgeBg: "bg-tertiary-fixed",
  },
  {
    name: "Himawari",
    colorName: "text-primary",
    image: ASSETS.characters.himawari.src,
    quote: '"Da-da! *points at shiny diamonds*"',
    badgeText: "Shiny Radar: ACTIVATED",
    badgeBg: "bg-primary-fixed",
  },
];

export default function SquadPage() {
  const handleCardClick = (name: string, quote: string) => {
    soundFx.playTroubleBoing();
    alert(`📢 ${name}: ${quote}`);
  };

  const handleRollCall = () => {
    soundFx.playActionBeam();
    alert("⚡ ĐỘI PHÒNG VỆ KASUKABE TẬP HỢP ĐẦY ĐỦ! SẴN SÀNG CHIẾN ĐẤU CHỐNG LẠI SỰ NHÀM CHÁN! ⚡");
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container flex flex-col justify-between">
      <TopNavBar />

      <main className="relative px-margin-mobile md:px-margin-desktop py-section-gap max-w-7xl mx-auto w-full flex-grow space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <NeoBadge variant="tertiary" rotate={-2} className="px-4 py-1.5 text-xs">
            Futaba Kindergarten Legends
          </NeoBadge>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase italic text-on-background drop-shadow-[3px_3px_0px_#b7000c] leading-none">
            Kasukabe Defense Group
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Protecting the world from boredom, one diaper at a time! Meet the legends of Futaba
            Kindergarten.
          </p>
        </div>

        {/* Character Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {DEFENSE_GROUP.map((c) => (
            <div
              key={c.id}
              onClick={() => handleCardClick(c.name, c.quote)}
              className="bg-surface neo-brutalist-border hard-shadow p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#1e1b18] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              {/* Badge if boss */}
              {c.badge && (
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary rotate-12 flex items-center justify-center neo-brutalist-border z-10 select-none">
                  <span className="text-on-primary font-label-bold text-center text-xs leading-tight">
                    {c.badge}
                  </span>
                </div>
              )}

              {/* Character Image Frame */}
              <div className="w-full aspect-square neo-brutalist-border overflow-hidden relative bg-white">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Info */}
              <div className="space-y-3">
                <h2 className={`font-headline-sm text-headline-sm uppercase ${c.colorName}`}>
                  {c.name}
                </h2>

                <div className="flex items-center gap-2">
                  <span className="font-label-bold text-xs uppercase">Mischief:</span>
                  <div className="flex-1 h-4 bg-surface-container neo-brutalist-border overflow-hidden relative">
                    <div
                      className={`h-full comic-hatch ${c.mischiefColor}`}
                      style={{ width: `${c.mischief}%` }}
                    />
                  </div>
                  <span className="font-mono font-bold text-xs">{c.mischief}%</span>
                </div>

                <p className="italic font-body-md text-sm text-on-surface-variant line-clamp-2">
                  {c.quote}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* Nohara Clan Section */}
        <section className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase italic text-secondary drop-shadow-[2px_2px_0px_#001b3b] leading-none">
              The Nohara Clan
            </h2>
            <p className="font-body-md text-on-surface-variant">
              The most chaotic family in Japan residing at 904-2 Kasukabe!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {NOHARA_CLAN.map((n) => (
              <div
                key={n.name}
                onClick={() => handleCardClick(n.name, n.quote)}
                className="bg-surface neo-brutalist-border hard-shadow p-6 sm:p-8 flex flex-col gap-4 cursor-pointer hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#1e1b18] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all group"
              >
                <div className="w-full h-48 neo-brutalist-border overflow-hidden relative bg-white">
                  <Image
                    src={n.image}
                    alt={n.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className={`font-headline-sm text-headline-sm uppercase ${n.colorName}`}>
                  {n.name}
                </h3>
                <p className="italic font-body-md text-sm text-on-surface-variant flex-grow">
                  {n.quote}
                </p>
                <div
                  className={`${n.badgeBg} p-3 neo-brutalist-border font-label-bold text-xs uppercase text-center`}
                >
                  {n.badgeText}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Action Button */}
        <button
          onClick={handleRollCall}
          className="fixed bottom-6 right-6 md:bottom-12 md:right-12 w-16 h-16 bg-primary text-on-primary neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active rounded-full flex items-center justify-center z-50 cursor-pointer"
          aria-label="Add or Roll Call"
          title="Roll Call Đội Kasukabe! ⚡"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </main>

      <Footer />
    </div>
  );
}
