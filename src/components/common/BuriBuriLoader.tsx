"use client";

import React, { useState, useEffect } from "react";
import RigB from "@/components/rig/RigB";

interface BuriBuriLoaderProps {
  /** Text hiển thị bên dưới thanh loading (nếu không set sẽ tự động nhảy theo tiến trình) */
  text?: string;
  /** Chế độ toàn màn hình cố định */
  fullScreen?: boolean;
  /** Cho phép tự động ẩn sau một khoảng thời gian (ms) - mặc định 3800ms */
  autoDismissMs?: number;
  /** Callback khi đóng loader */
  onDismiss?: () => void;
}

export function BuriBuriLoader({
  text,
  fullScreen = true,
  autoDismissMs = 3800,
  onDismiss,
}: BuriBuriLoaderProps) {
  const [progress, setProgress] = useState(5);
  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Tiến trình chạy mượt mà theo đúng thời lượng autoDismissMs
  useEffect(() => {
    const totalTime = autoDismissMs || 3800;
    const activeTime = Math.max(1000, totalTime - 600);
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(Math.floor((elapsed / activeTime) * 100), 98);
      setProgress(rawPct);

      if (rawPct >= 98) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [autoDismissMs]);

  // Tự động kết thúc và fade out
  useEffect(() => {
    if (!autoDismissMs) return;

    const timer = setTimeout(() => {
      setProgress(100);
      const fadeTimer = setTimeout(() => {
        setFading(true);
        const closeTimer = setTimeout(() => {
          setDismissed(true);
          if (onDismiss) onDismiss();
        }, 450);
        return () => clearTimeout(closeTimer);
      }, 300);
      return () => clearTimeout(fadeTimer);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  const handleSkip = () => {
    setProgress(100);
    setFading(true);
    setTimeout(() => {
      setDismissed(true);
      if (onDismiss) onDismiss();
    }, 250);
  };

  // Các câu thoại vui nhộn thay đổi theo tiến trình loading
  const getSpeechBubble = () => {
    if (progress < 35) {
      return '"Chờ Shin một xíu nha! Đang bận lắc mông kiếm chị gái đẹp nè~ Ho-ho-ho-i!"';
    }
    if (progress < 75) {
      return '"Lắc lắc... sang trái rồi sang phải... Ôi cái mông quyến rũ của tớ chưa kìa! He-he-he!"';
    }
    return '"Woa! Nạp đầy bánh Chocobi rồi! Cùng quẩy tung Kasukabe thôi nào! ⚡"';
  };

  // Status badge text
  const getStatusText = () => {
    if (text) return text;
    if (progress < 35) return "⚡ Buri Buri! Đang nạp bánh Chocobi...";
    if (progress < 75) return "💃 Shin đang mải lắc mông kiếm chị Nanako...";
    return "🎉 Nạp 100% năng lượng! Chuẩn bị vào trang...";
  };

  if (dismissed) return null;

  return (
    <div
      id="buri-buri-loader"
      className={`${
        fullScreen
          ? "fixed inset-0 z-[99999] w-screen h-screen flex flex-col items-center justify-center bg-[#FFF9E8]"
          : "relative w-full py-12 flex flex-col items-center justify-center bg-[#FFF9E8] rounded-2xl border-[3px] border-black"
      } select-none overflow-hidden transition-all duration-500 ${
        fading ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
      }`}
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
        <div className="mb-3 text-center">
          <span className="font-display-lg text-4xl sm:text-5xl md:text-6xl text-primary font-black uppercase italic tracking-tighter drop-shadow-[4px_4px_0px_#ffd200] stroke-black">
            SHIN-CHAN!
          </span>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="bg-tertiary-fixed text-black text-xs font-label-bold px-3 py-0.5 border-2 border-black rounded-full shadow-[2px_2px_0px_#000]">
              ふたば幼稚園 • KASUKABE DEFENSE GROUP
            </span>
          </div>
        </div>

        {/* Dynamic Comic Speech Bubble */}
        <div className="mb-2 relative bg-white border-[3px] border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0px_0px_#000] text-center max-w-md transform rotate-[-1.5deg] min-h-[44px] flex items-center justify-center">
          <p className="font-body-md text-xs sm:text-sm font-extrabold text-black transition-all">
            {getSpeechBubble()}
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
            <span>{getStatusText()}</span>
          </div>

          {/* Neo-Brutalist Progress Bar */}
          <div className="relative w-full h-7 bg-white border-[3px] border-black rounded-xl p-0.5 shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-primary to-yellow-400 rounded-lg border-r-2 border-black transition-all duration-200 relative overflow-hidden"
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
