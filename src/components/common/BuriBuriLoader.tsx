"use client";

import React, { useState, useEffect } from "react";
import RigB from "@/components/rig/RigB";

interface BuriBuriLoaderProps {
  /** Text hiển thị bên dưới thanh loading */
  text?: string;
  /** Chế độ toàn màn hình cố định */
  fullScreen?: boolean;
  /** Cho phép tự động ẩn sau một khoảng thời gian (ms) */
  autoDismissMs?: number;
  /** Callback khi đóng loader */
  onDismiss?: () => void;
}

export function BuriBuriLoader({
  text = "Buri Buri! Đang nạp bánh Chocobi...",
  fullScreen = true,
  autoDismissMs,
  onDismiss,
}: BuriBuriLoaderProps) {
  const [progress, setProgress] = useState(15);
  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Tự động tăng progress giả lập cho mượt mà
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!autoDismissMs) return;

    const timer = setTimeout(() => {
      setProgress(100);
      setFading(true);
      const closeTimer = setTimeout(() => {
        setDismissed(true);
        if (onDismiss) onDismiss();
      }, 400);
      return () => clearTimeout(closeTimer);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  const handleSkip = () => {
    setProgress(100);
    setFading(true);
    setTimeout(() => {
      setDismissed(true);
      if (onDismiss) onDismiss();
    }, 300);
  };

  if (dismissed) return null;

  return (
    <div
      id="buri-buri-loader"
      className={`${
        fullScreen
          ? "fixed inset-0 z-[99999] w-screen h-screen flex flex-col items-center justify-center bg-[#FFF9E8]"
          : "relative w-full py-12 flex flex-col items-center justify-center bg-[#FFF9E8] rounded-2xl border-[3px] border-black"
      } select-none overflow-hidden transition-opacity duration-400 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
        transform: fading ? "scale(1.02)" : "scale(1)",
      }}
    >
      {/* Background Comic Dots */}
      <div className="absolute inset-0 comic-dots pointer-events-none opacity-15" />

      {/* Decorative Comic Rays in Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg, #1e1b18 0deg 8deg, transparent 8deg 24deg)",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl px-4 flex flex-col items-center">
        {/* Top Comic Logo */}
        <div className="mb-4 text-center">
          <span className="font-display-lg text-4xl sm:text-5xl md:text-6xl text-primary font-black uppercase italic tracking-tighter drop-shadow-[4px_4px_0px_#ffd200] stroke-black">
            SHIN-CHAN!
          </span>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="bg-tertiary-fixed text-black text-xs font-label-bold px-3 py-0.5 border-2 border-black rounded-full shadow-[2px_2px_0px_#000]">
              ふたば幼稚園 • KASUKABE DEFENSE GROUP
            </span>
          </div>
        </div>

        {/* Comic Speech Bubble */}
        <div className="mb-2 relative bg-white border-[3px] border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_0px_#000] text-center max-w-md transform rotate-[-1.5deg]">
          <p className="font-body-md text-xs sm:text-sm font-extrabold text-black">
            "Chờ Shin một xíu nha! Đang bận lắc mông kiếm chị gái đẹp nè~ Ho-ho-ho-i!"
          </p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-[3px] border-r-[3px] border-black transform rotate-45" />
        </div>

        {/* ── STAGE CHO RIG B LẮC MÔNG CHẠY QUA CHẠY LẠI ── */}
        <div className="w-full relative py-2 overflow-hidden">
          <RigB roam className="w-full" />
          
          {/* Dashed Road Line */}
          <div className="w-full h-1 border-b-4 border-dashed border-black/35 mt-[-6px] mb-4" />
        </div>

        {/* Loading Progress Section */}
        <div className="w-full max-w-md space-y-3 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-primary text-white text-xs sm:text-sm font-label-bold px-4 py-1.5 border-[3px] border-black rounded-lg shadow-[3px_3px_0px_#000] uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping" />
            <span>{text}</span>
          </div>

          {/* Neo-Brutalist Progress Bar */}
          <div className="relative w-full h-7 bg-white border-[3px] border-black rounded-xl p-0.5 shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-primary to-yellow-400 rounded-lg border-r-2 border-black transition-all duration-300 relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              {/* Striped hazard pattern inside bar */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #000 0px, #000 8px, transparent 8px, transparent 16px)",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-xs font-black text-black drop-shadow-[1px_1px_0px_#fff]">
                {Math.min(progress, 100)}%
              </span>
            </div>
          </div>

          {/* Interactive Hint & Skip Button */}
          <div className="flex items-center justify-between text-xs text-neutral-600 font-semibold px-1 pt-1">
            <span className="flex items-center gap-1">
              <span>💡</span>
              <span className="italic">Bấm vào Shin-chan để nghe cười!</span>
            </span>
            <button
              onClick={handleSkip}
              className="font-label-bold text-xs uppercase underline underline-offset-2 hover:text-primary transition-colors cursor-pointer"
            >
              Bỏ qua &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BuriBuriLoader;
