"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { ASSETS } from "@/constants/assets";

const STATS = [
  { value: "9,999+", label: "Chocobis Eaten" },
  { value: "∞", label: "Mischief Levels" },
  { value: "32yr", label: "Mortgage Left" },
  { value: "0", label: "Normal Days" },
];

export default function KasukabeCityPage() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(`📬 Đã đăng ký thành công! Shiro sẽ chuyển phát thư mật Kasukabe tới ${email}! 🐾`);
    setEmail("");
  };

  const handleExploreClick = () => {
    const el = document.getElementById("grand-tour");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container flex flex-col justify-between">
      <TopNavBar />

      <main className="w-full flex-grow">
        {/* ============================================================== */}
        {/* 1. HERO SECTION                                                */}
        {/* ============================================================== */}
        <section className="px-margin-mobile md:px-margin-desktop py-section-gap bg-secondary-container relative overflow-hidden border-b-[3px] border-on-background">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter items-center relative z-10">
            {/* Left Description */}
            <div className="space-y-6">
              <NeoBadge variant="tertiary" rotate={-2} className="px-4 py-1.5 text-xs">
                Saitama Prefecture
              </NeoBadge>

              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-secondary-container leading-none uppercase">
                Welcome to <br />
                <span className="text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  Kasukabe City!
                </span>
              </h1>

              <p className="font-body-lg text-body-lg text-on-secondary-container max-w-md">
                The most chaotic town in Japan, where mischief is a way of life and every street corner
                has a story of a five-year-old making adults cry (with laughter).
              </p>

              <div className="flex gap-4 pt-2">
                <NeoButton variant="dark" size="lg" onClick={handleExploreClick}>
                  Start Exploring ↓
                </NeoButton>
              </div>
            </div>

            {/* Right Photo Frame */}
            <div className="relative">
              <div className="bg-white neo-brutalist-border p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="w-full aspect-video relative neo-brutalist-border overflow-hidden bg-surface-container">
                  <Image
                    src={ASSETS.locations.cityPanorama.src}
                    alt={ASSETS.locations.cityPanorama.alt}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <p className="font-caption text-caption mt-3 italic text-center text-on-surface-variant">
                  Photo by: Shin-chan (he stole Hiroshi&apos;s camera)
                </p>
              </div>

              {/* 100% Fun Floating Sticker */}
              <div className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-28 h-28 sm:w-32 sm:h-32 bg-primary neo-brutalist-border rounded-full flex items-center justify-center rotate-12 shadow-lg animate-bounce select-none">
                <span className="text-white font-label-bold text-center leading-tight text-xs sm:text-sm">
                  100%<br />FUN!
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. BENTO MAP TOUR                                              */}
        {/* ============================================================== */}
        <section id="grand-tour" className="px-margin-mobile md:px-margin-desktop py-section-gap bg-surface">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b-[3px] border-on-background/20">
              <div>
                <NeoBadge variant="primary" rotate={-2} className="mb-2">
                  Official Town Map
                </NeoBadge>
                <h2 className="font-headline-md text-headline-md text-primary uppercase">
                  The Grand Tour
                </h2>
                <p className="font-body-md text-on-surface-variant mt-1">
                  Don&apos;t get lost! Here are the most important spots in town.
                </p>
              </div>
              <div className="flex items-center gap-2 font-label-bold text-sm bg-surface-container px-4 py-2 neo-brutalist-border">
                <div className="w-3.5 h-3.5 bg-primary border-2 border-on-background rounded-full animate-ping" />
                <span>Mischief Zones Active</span>
              </div>
            </div>

            {/* Bento Grid Layout (12 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              {/* Card 1: Nohara House (Col-span 8) */}
              <div className="md:col-span-8 bg-surface-container-low neo-brutalist-border p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all group">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-1/2 aspect-video relative overflow-hidden neo-brutalist-border bg-white flex-shrink-0">
                    <Image
                      src={ASSETS.locations.noharaResidence.src}
                      alt={ASSETS.locations.noharaResidence.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="w-full md:w-1/2 space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-2xl">home</span>
                      <h3 className="font-headline-sm text-headline-sm uppercase">Nohara House</h3>
                    </div>
                    <p className="font-body-md text-sm text-on-surface-variant">
                      Ground zero for most trouble. Features a 32-year mortgage (sorry Hiroshi!), a
                      fridge full of Chocobi, and a very tired dog named Shiro.
                    </p>
                    <div className="bg-tertiary-container/30 p-3 neo-brutalist-border border-l-4">
                      <p className="font-caption text-xs italic">
                        &ldquo;Stay away from the snacks or Misae will give you the &lsquo;Noogie of
                        Death&rsquo;!&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Action Mart / Supermarket (Col-span 4) */}
              <div className="md:col-span-4 bg-tertiary-fixed neo-brutalist-border p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all space-y-4">
                <div className="flex items-center gap-2 text-on-tertiary-fixed">
                  <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                  <h3 className="font-headline-sm text-headline-sm uppercase">Supermarket</h3>
                </div>
                <div className="aspect-video relative neo-brutalist-border overflow-hidden bg-white">
                  <Image
                    src={ASSETS.locations.actionMart.src}
                    alt={ASSETS.locations.actionMart.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="font-body-md text-sm text-on-tertiary-fixed">
                  Where Misae hunts for 50% discount sales and Shin-chan gets lost in the candy aisle.
                  Famous for &lsquo;Radish Disasters&rsquo;.
                </p>
              </div>

              {/* Card 3: Futaba Kindergarten (Col-span 6) */}
              <div className="md:col-span-6 bg-secondary-fixed neo-brutalist-border p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="material-symbols-outlined text-2xl">school</span>
                    <h3 className="font-headline-sm text-headline-sm uppercase">Futaba Kindergarten</h3>
                  </div>
                  <span className="bg-white px-3 py-1 neo-brutalist-border font-label-bold text-xs rounded-full">
                    HQ
                  </span>
                </div>
                <p className="font-body-md text-sm">
                  Run by &lsquo;The Boss&rsquo; (Principal Takakura). Home to the Sunflower and Rose
                  classes. Don&apos;t be fooled by the principal&apos;s face—he&apos;s actually a sweetheart!
                </p>
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="bg-primary/20 aspect-video neo-brutalist-border flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-3xl">child_care</span>
                  </div>
                  <div className="bg-secondary/20 aspect-video neo-brutalist-border flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary text-3xl">toys</span>
                  </div>
                  <div className="bg-tertiary/20 aspect-video neo-brutalist-border flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-3xl">mood_bad</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Kasukabe Park (Col-span 6) */}
              <div className="md:col-span-6 bg-surface-container-highest neo-brutalist-border p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-1.5 transition-all">
                <div className="comic-hatch absolute inset-0 opacity-15 pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-2xl">park</span>
                    <h3 className="font-headline-sm text-headline-sm uppercase">Kasukabe Park</h3>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex-1 space-y-3">
                      <p className="font-body-md text-sm text-on-surface-variant">
                        The legendary secret meeting spot for the Kasukabe Defense Group. Features a
                        slide that has seen too many &lsquo;butt-alien&rsquo; dances.
                      </p>
                      <button
                        onClick={() => alert("🚨 BÁO CÁO TUẦN TRA: Công viên hôm nay an toàn, chưa thấy quái vật, chỉ thấy Shin-chan đang lắc mông! 🚨")}
                        className="text-primary font-label-bold text-xs uppercase flex items-center gap-1.5 hover:underline cursor-pointer"
                      >
                        Check Patrol Schedule →
                      </button>
                    </div>
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full neo-brutalist-border bg-white flex-shrink-0 flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform">
                      <span className="material-symbols-outlined text-5xl text-primary">potted_plant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. FUN STATS SECTION                                           */}
        {/* ============================================================== */}
        <section className="bg-primary px-margin-mobile md:px-margin-desktop py-section-gap border-y-[3px] border-on-background select-none">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-gutter text-center">
            {STATS.map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="text-white font-display-lg text-4xl sm:text-5xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  {s.value}
                </div>
                <div className="font-label-bold text-xs uppercase bg-white text-on-background border-2 border-on-background px-3 py-1 inline-block neo-brutalist-border">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. FAN CLUB NEWSLETTER CTA                                     */}
        {/* ============================================================== */}
        <section className="px-margin-mobile md:px-margin-desktop py-section-gap max-w-4xl mx-auto">
          <div className="bg-surface neo-brutalist-border p-8 sm:p-12 shadow-[12px_12px_0px_0px_rgba(11,94,175,1)] relative">
            <div className="absolute -top-5 -left-5 bg-secondary text-white px-4 py-2 neo-brutalist-border rotate-[-5deg]">
              <span className="font-label-bold text-xs uppercase">JOIN THE CLUB!</span>
            </div>

            <div className="text-center space-y-6">
              <h3 className="font-headline-md text-headline-md uppercase text-primary">
                Action Mask Fan Club
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
                Get the latest rumors from Kasukabe and exclusive Action Mask updates delivered by
                Shiro&apos;s express delivery!
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your hero email..."
                  required
                  className="flex-grow neo-brutalist-border p-3.5 focus:outline-none focus:ring-2 focus:ring-secondary text-sm font-label-bold bg-white"
                />
                <NeoButton variant="primary" size="md" type="submit">
                  Sign Up
                </NeoButton>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

