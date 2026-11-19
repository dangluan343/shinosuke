"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { ASSETS } from "@/constants/assets";
import { soundFx } from "@/lib/audio";

interface StarParticle {
  id: number;
  top: string;
  left: string;
  rotation: string;
  size: string;
}

export default function HomePage() {
  // Trouble Meter Interactive State
  const [angerLevel, setAngerLevel] = useState(85);
  const [chocobiStock, setChocobiStock] = useState(12);

  // Email Newsletter State
  const [email, setEmail] = useState("");

  // Floating Star Particles
  const [stars, setStars] = useState<StarParticle[]>([]);

  // Shin-chan Butt Dance Easter Egg
  const [buttDanceActive, setButtDanceActive] = useState(false);
  const [isSuperSpeed, setIsSuperSpeed] = useState(false);

  useEffect(() => {
    // Generate 6 atmospheric stars
    const generatedStars: StarParticle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 85 + 5)}%`,
      left: `${Math.floor(Math.random() * 90 + 5)}%`,
      rotation: `rotate(${Math.floor(Math.random() * 360)}deg)`,
      size: i % 2 === 0 ? "text-3xl" : "text-4xl",
    }));
    setStars(generatedStars);
  }, []);

  const handleIncreaseTrouble = () => {
    let nextAnger = angerLevel + Math.floor(Math.random() * 12 + 6);
    let nextChocobi = Math.max(0, chocobiStock - Math.floor(Math.random() * 6 + 2));

    if (nextAnger >= 100) {
      soundFx.playAngerAlarm();
      alert("🚨 ÔI KHÔNG! Mẹ Misae đang bốc hỏa cực độ! Mau trốn đi trước khi ăn đòn! 🚨");
      setAngerLevel(20);
      setChocobiStock(85);
    } else {
      soundFx.playTroubleBoing();
      setAngerLevel(nextAnger);
      setChocobiStock(nextChocobi);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    soundFx.playSparkleChime();
    alert(`🎉 CHÚC MỪNG CHIẾN BINH NHÍ! Email "${email}" đã gia nhập Action Mask Fan Club thành công!`);
    setEmail("");
  };

  const triggerButtDance = () => {
    soundFx.playTroubleBoing();
    setButtDanceActive(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container relative overflow-x-hidden">
      {/* TopNavBar */}
      <TopNavBar />

      {/* Atmospheric Star Floaters */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute opacity-20 text-primary transition-transform duration-1000"
            style={{
              top: star.top,
              left: star.left,
              transform: star.rotation,
            }}
          >
            <span className={`material-symbols-outlined ${star.size}`}>star</span>
          </div>
        ))}
      </div>

      <main className="w-full relative z-10">
        {/* ============================================================== */}
        {/* 1. HERO SECTION                                                */}
        {/* ============================================================== */}
        <section className="relative px-margin-mobile md:px-margin-desktop py-section-gap overflow-hidden bg-surface-container-low border-b-[3px] border-on-background">
          <div className="absolute inset-0 opacity-10 hatch-pattern pointer-events-none"></div>

          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-section-gap items-center relative z-10">
            {/* Left Content */}
            <div className="space-y-8">
              <NeoBadge variant="tertiary" rotate={-2} className="px-4 py-2 text-sm">
                NEW TROUBLE AHEAD!
              </NeoBadge>

              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background tracking-tighter leading-none">
                HEY, HEY, HEY! <br />
                <span className="text-primary underline decoration-[8px] decoration-secondary">
                  WELCOME
                </span>{" "}
                TO MY WORLD!
              </h1>

              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                Join Shinnosuke Nohara for another day of high-energy mischief, chocolate stars, and
                Action Mask adventures in Kasukabe!
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <NeoButton
                  variant="primary"
                  size="lg"
                  href="/gallery"
                  onClick={() => soundFx.playClickPop()}
                >
                  Let&apos;s Play!
                </NeoButton>
                <NeoButton
                  variant="white"
                  size="lg"
                  href="/squad"
                  onClick={() => soundFx.playClickPop()}
                >
                  The Squad
                </NeoButton>
                <button
                  onClick={triggerButtDance}
                  className="px-6 py-3.5 bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active font-label-bold text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer select-none"
                  title="Mở điệu múa lắc mông huyền thoại! 🍑"
                >
                  <span className="text-lg">🍑</span>
                  <span>Điệu Múa Lắc Mông!</span>
                </button>
              </div>
            </div>

            {/* Right Visual Image */}
            <div className="flex justify-center relative select-none">
              <div
                onClick={triggerButtDance}
                title="Bấm vào tui để xem Điệu Múa Lắc Mông! 🍑"
                className="w-full max-w-[480px] aspect-square bg-secondary-container neo-brutalist-border hard-shadow rotate-[3deg] relative overflow-hidden cursor-pointer hover:rotate-0 transition-transform duration-300"
              >
                <Image
                  src={ASSETS.home.hero.src}
                  alt={ASSETS.home.hero.alt}
                  fill
                  className="object-cover animate-shin-bounce"
                  priority
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>

              {/* Bouncing Round Badge (Click to trigger butt dance) */}
              <div
                onClick={triggerButtDance}
                title="Bấm xem điệu múa! 🍑"
                className="absolute -bottom-8 -left-6 sm:-bottom-10 sm:-left-10 w-36 h-36 sm:w-40 sm:h-40 bg-tertiary-container neo-brutalist-border hard-shadow rounded-full flex items-center justify-center -rotate-12 z-20 cursor-pointer hover:scale-105 transition-transform"
              >
                <span className="font-label-bold text-center text-sm sm:text-base text-on-tertiary-container uppercase">
                  Silly <br /> Level: MAX 🍑
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. BENTO GRID: MISCHIEF & METERS                               */}
        {/* ============================================================== */}
        <section className="px-margin-mobile md:px-margin-desktop py-section-gap max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Widget 1: Trouble Meter (Col-span 2) */}
            <div className="md:col-span-2 bg-white neo-brutalist-border hard-shadow p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="font-headline-md text-headline-md text-on-background uppercase">
                    Trouble Meter
                  </h2>
                  <span className="material-symbols-outlined text-4xl text-primary">warning</span>
                </div>
                <p className="font-body-md text-on-surface-variant mt-2">
                  How much mischief is Shin-chan causing today?
                </p>
              </div>

              <div className="space-y-6">
                {/* Misae Anger Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between font-label-bold">
                    <span>Misae&apos;s Anger Level</span>
                    <span className="font-mono text-primary font-bold">{angerLevel}%</span>
                  </div>
                  <div className="w-full h-10 bg-surface-container neo-brutalist-border relative overflow-hidden">
                    <div
                      className="h-full bg-primary hatch-pattern transition-all duration-700 ease-out"
                      style={{ width: `${angerLevel}%` }}
                    />
                  </div>
                </div>

                {/* Chocobi Meter */}
                <div className="space-y-2">
                  <div className="flex justify-between font-label-bold">
                    <span>Chocobi Supply</span>
                    <span className="font-mono text-secondary font-bold">{chocobiStock}%</span>
                  </div>
                  <div className="w-full h-10 bg-surface-container neo-brutalist-border relative overflow-hidden">
                    <div
                      className="h-full bg-secondary hatch-pattern transition-all duration-700 ease-out"
                      style={{ width: `${chocobiStock}%` }}
                    />
                  </div>
                </div>
              </div>

              <NeoButton
                variant="tertiary"
                size="lg"
                fullWidth
                onClick={handleIncreaseTrouble}
              >
                Cause More Trouble!
              </NeoButton>
            </div>

            {/* Widget 2: Daily Giggle Card */}
            <div
              onClick={() => soundFx.playTroubleBoing()}
              className="bg-tertiary-fixed-dim neo-brutalist-border hard-shadow p-6 sm:p-8 flex flex-col space-y-4 cursor-pointer hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 bg-white neo-brutalist-border rounded-lg flex items-center justify-center rotate-6 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl">
                  sentiment_very_satisfied
                </span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-tertiary-fixed">
                Daily Giggle
              </h3>
              <p className="font-body-md text-on-tertiary-fixed flex-grow text-lg italic">
                &ldquo;Hey Misae, do you want to play a game? It&apos;s called &lsquo;Where did I hide the
                laundry?&rsquo;&rdquo;
              </p>
              <div className="pt-4 border-t-2 border-on-tertiary-fixed-variant border-dashed">
                <p className="font-caption text-on-tertiary-fixed-variant italic">
                  - Shinnosuke, 8:42 AM
                </p>
              </div>
            </div>

            {/* Widget 3: Mischief News Feed (Col-span 3) */}
            <div className="md:col-span-3 bg-surface-container-high neo-brutalist-border hard-shadow p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="px-6 py-2 bg-on-background text-white font-label-bold uppercase -rotate-2 select-none">
                  Mischief News
                </div>
                <div className="h-[3px] flex-grow bg-on-background"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* News 1 */}
                <div
                  onClick={() => soundFx.playClickPop()}
                  className="space-y-4 group cursor-pointer"
                >
                  <div className="aspect-video bg-white neo-brutalist-border overflow-hidden group-hover:-translate-y-1 transition-transform relative">
                    <Image
                      src={ASSETS.home.newsNoharaHouse.src}
                      alt={ASSETS.home.newsNoharaHouse.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <span className="font-caption text-primary uppercase font-bold tracking-wide">
                    Local Alert
                  </span>
                  <h4 className="font-headline-sm text-headline-sm leading-tight hover:underline">
                    The Great Crayon Shortage in Kasukabe
                  </h4>
                  <p className="font-body-md text-on-surface-variant">
                    Authorities report all red crayons have mysteriously vanished from local
                    kindergartens...
                  </p>
                </div>

                {/* News 2 */}
                <div
                  onClick={() => soundFx.playSparkleChime()}
                  className="space-y-4 group cursor-pointer"
                >
                  <div className="aspect-video bg-white neo-brutalist-border overflow-hidden group-hover:-translate-y-1 transition-transform relative">
                    <Image
                      src={ASSETS.home.newsChocobi.src}
                      alt={ASSETS.home.newsChocobi.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <span className="font-caption text-secondary uppercase font-bold tracking-wide">
                    Food &amp; Snacks
                  </span>
                  <h4 className="font-headline-sm text-headline-sm leading-tight hover:underline">
                    New Chocobi Flavor Released Today!
                  </h4>
                  <p className="font-body-md text-on-surface-variant">
                    The limited edition &lsquo;Action Blue&rsquo; flavor promises a cosmic explosion of
                    sugar and fun...
                  </p>
                </div>

                {/* News 3 */}
                <div
                  onClick={() => soundFx.playActionBeam()}
                  className="space-y-4 group cursor-pointer"
                >
                  <div className="aspect-video bg-white neo-brutalist-border overflow-hidden group-hover:-translate-y-1 transition-transform relative">
                    <Image
                      src={ASSETS.home.newsActionMask.src}
                      alt={ASSETS.home.newsActionMask.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                  </div>
                  <span className="font-caption text-tertiary uppercase font-bold tracking-wide">
                    TV Specials
                  </span>
                  <h4 className="font-headline-sm text-headline-sm leading-tight hover:underline">
                    Action Mask Marathon This Weekend
                  </h4>
                  <p className="font-body-md text-on-surface-variant">
                    Don&apos;t miss 48 hours of non-stop action, justice, and the legendary Action
                    Beam!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. CALL TO ACTION: ACTION MASK FAN CLUB                        */}
        {/* ============================================================== */}
        <section className="px-margin-mobile md:px-margin-desktop py-section-gap mb-16 max-w-7xl mx-auto">
          <div className="bg-secondary-container neo-brutalist-border hard-shadow p-8 sm:p-12 relative overflow-hidden">
            {/* Giant Background Shield Watermark */}
            <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none select-none">
              <span className="material-symbols-outlined text-[180px] sm:text-[240px]">shield</span>
            </div>

            <div className="relative z-10 max-w-2xl space-y-6">
              <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-secondary-container leading-none uppercase">
                Join the Action Mask Fan Club
              </h2>
              <p className="font-body-lg text-on-secondary-container">
                Get exclusive access to secret missions, limited edition stickers, and your very own
                Action Mask cape! Are you brave enough?
              </p>

              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 pt-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR HERO EMAIL"
                  required
                  className="flex-grow px-6 py-4 neo-brutalist-border font-label-bold text-on-background bg-white focus:outline-none focus:ring-4 focus:ring-primary uppercase text-sm"
                />
                <NeoButton variant="primary" size="lg" type="submit">
                  Sign Me Up!
                </NeoButton>
              </form>

              <p className="font-caption text-on-secondary-fixed-variant">
                By joining, you agree to always fight for justice (and snacks).
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Easter Egg Modal: Real Butt Dance Anime Artwork */}
      {buttDanceActive && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={() => setButtDanceActive(false)}
        >
          <div
            className="bg-tertiary-fixed neo-brutalist-border p-6 sm:p-8 shadow-[12px_12px_0px_0px_#1e1b18] max-w-lg w-full text-center space-y-5 rotate-[-2deg]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <NeoBadge variant="primary" rotate={-2}>
                Buri Buri Zaaemon Approved
              </NeoBadge>
              <button
                onClick={() => setButtDanceActive(false)}
                className="w-9 h-9 bg-white neo-brutalist-border hard-shadow flex items-center justify-center font-label-bold text-base cursor-pointer hover:bg-error hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <h3 className="font-display-lg text-3xl sm:text-4xl uppercase text-primary leading-none">
              BURI-BURI BUTT DANCE! 🍑
            </h3>

            {/* The Actual Butt Dance GIF with Wiggle Animation */}
            <div className="relative w-full aspect-[4/3] neo-brutalist-border overflow-hidden bg-black shadow-inner flex items-center justify-center">
              <Image
                src={ASSETS.gallery[0].src}
                alt={ASSETS.gallery[0].alt}
                fill
                unoptimized
                className={`object-contain ${
                  isSuperSpeed ? "animate-butt-wiggle-fast" : "animate-butt-wiggle"
                }`}
              />
            </div>

            <p className="font-body-md text-sm text-on-tertiary-fixed-variant italic">
              &ldquo;Lắc lắc lắc~ Buri Buri~ Mẹ Misae ơi xem con lắc mông này!&rdquo;
            </p>

            {/* Interactive Speed & Sound Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundFx.playTroubleBoing();
                  setIsSuperSpeed(!isSuperSpeed);
                }}
                className="px-4 py-2.5 bg-primary text-on-primary neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active font-label-bold text-xs uppercase cursor-pointer"
              >
                {isSuperSpeed ? "🐢 Lắc Bình Thường" : "🚀 Lắc Siêu Tốc (Super Speed)!"}
              </button>

              <button
                onClick={() => soundFx.playTroubleBoing()}
                className="px-4 py-2.5 bg-secondary text-on-secondary neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active font-label-bold text-xs uppercase cursor-pointer"
              >
                🔊 Thêm Tiếng Boing!
              </button>

              <button
                onClick={() => setButtDanceActive(false)}
                className="px-4 py-2.5 bg-white text-on-background neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active font-label-bold text-xs uppercase cursor-pointer"
              >
                Xong rồi (Đóng)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
