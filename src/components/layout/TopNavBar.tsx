"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { NeoButton } from "@/components/ui/NeoButton";
import { soundFx } from "@/lib/audio";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Squad", href: "/squad" },
  { label: "Giggles", href: "/gallery" },
  { label: "Kasukabe", href: "/kasukabe" },
];

const DEV_LINKS = [
  { label: "Tokens", href: "/tokens" },
  { label: "Assets", href: "/assets" },
  { label: "UI Kit", href: "/uikit" },
];

export const TopNavBar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);

  useEffect(() => {
    setIsMuted(soundFx.isMuted());
  }, []);

  const handleToggleSound = () => {
    const nextMuted = soundFx.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundFx.playSparkleChime();
    }
  };

  const handleActionMask = () => {
    soundFx.playActionBeam();
    setEasterEggActive(true);
    setTimeout(() => setEasterEggActive(false), 2500);
  };

  return (
    <>
      <nav className="flex justify-between items-center w-full px-4 sm:px-6 md:px-16 py-3.5 sticky top-0 z-50 border-b-[3px] border-on-background bg-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] select-none">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => soundFx.playClickPop()}
            className="font-display-lg text-2xl sm:text-3xl md:text-4xl text-primary uppercase italic tracking-tighter drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:scale-105 transition-transform"
          >
            SHIN-CHAN!
          </Link>
        </div>

        {/* Desktop Main Links */}
        <div className="hidden lg:flex gap-8 items-center">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => soundFx.playClickPop()}
                className={clsx(
                  "font-label-bold text-sm tracking-wide transition-all hover:translate-x-[2px] hover:translate-y-[2px]",
                  isActive
                    ? "text-secondary border-b-[3px] border-secondary pb-0.5"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Dev Verification Shortcuts & Actions */}
        <div className="flex items-center gap-3">
          {/* Sound FX Toggle Button */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? "Bật âm thanh (Sound Unmute)" : "Tắt âm thanh (Mute Sound)"}
            className="w-10 h-10 bg-white neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active flex items-center justify-center cursor-pointer transition-transform"
            aria-label="Toggle Sound"
          >
            <span className={clsx("material-symbols-outlined text-xl", isMuted ? "text-outline" : "text-primary")}>
              {isMuted ? "volume_off" : "volume_up"}
            </span>
          </button>

          {/* Dev Verification Quick Links */}
          <div className="hidden xl:flex items-center gap-2 pr-2 border-r-2 border-on-background/20">
            {DEV_LINKS.map((dev) => {
              const isDevActive = pathname === dev.href;
              return (
                <Link
                  key={dev.href}
                  href={dev.href}
                  onClick={() => soundFx.playClickPop()}
                  className={clsx(
                    "px-2.5 py-1 text-xs font-label-bold neo-brutalist-border rounded",
                    isDevActive
                      ? "bg-secondary text-white hard-shadow"
                      : "bg-surface-container-high text-on-surface hover:bg-white"
                  )}
                >
                  {dev.label}
                </Link>
              );
            })}
          </div>

          {/* Action Mask Hero Button */}
          <NeoButton
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
            onClick={handleActionMask}
          >
            ACTION MASK!
          </NeoButton>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => {
              soundFx.playClickPop();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 neo-brutalist-border bg-white hard-shadow hard-shadow-active text-on-background flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed top-[65px] left-0 w-full bg-surface border-b-[3px] border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4 z-40">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      soundFx.playClickPop();
                      setMobileMenuOpen(false);
                    }}
                    className={clsx(
                      "px-4 py-2 font-label-bold text-base uppercase neo-brutalist-border",
                      isActive
                        ? "bg-secondary text-white hard-shadow"
                        : "bg-white text-on-background hover:bg-surface-container"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t-2 border-dashed border-on-background/30 flex gap-2">
              {DEV_LINKS.map((dev) => (
                <Link
                  key={dev.href}
                  href={dev.href}
                  onClick={() => {
                    soundFx.playClickPop();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 text-center py-2 bg-surface-container text-xs font-label-bold neo-brutalist-border"
                >
                  {dev.label}
                </Link>
              ))}
            </div>

            <NeoButton
              variant="primary"
              size="md"
              fullWidth
              onClick={() => {
                setMobileMenuOpen(false);
                handleActionMask();
              }}
            >
              ACTION MASK!
            </NeoButton>
          </div>
        )}
      </nav>

      {/* Easter Egg Full-Screen Banner Overlay */}
      {easterEggActive && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-xs animate-in fade-in zoom-in duration-200">
          <div className="bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border p-8 shadow-[12px_12px_0px_0px_#b7000c] text-center max-w-lg mx-4 rotate-[-3deg] animate-bounce">
            <div className="text-5xl mb-3">⚡ 🦸‍♂️ ⚡</div>
            <h2 className="font-display-lg text-4xl uppercase text-primary leading-none mb-2">
              ACTION BEAM FIRE!
            </h2>
            <p className="font-label-bold text-lg uppercase text-secondary">
              WA-HA-HA-HA! CÔNG LÝ ĐÃ CHIẾN THẮNG!
            </p>
          </div>
        </div>
      )}
    </>
  );
};
