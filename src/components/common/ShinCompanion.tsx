"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { soundFx } from "@/lib/audio";
import { ASSETS } from "@/constants/assets";

const SHIN_QUOTES = [
  "Chị gái xinh đẹp ơi có thích ăn ớt chuông không? Ho-ho-ho-i!",
  "Đang mơ thấy chị Nanako nắm tay đi dạo nè~",
  "Ngoáy mũi... ngoáy mũi... sao không thấy gì hết ta?",
  "Chocobi số 1 vũ trụ! Ai cho Shin một hộp đi!",
  "Action Mask! Hãy ban cho Shin sức mạnh siêu nhân!",
  "Mẹ Misae hung dữ sắp về rồi, mau giấu đồ chơi đi!",
];

const COSTUMES = [
  { id: "normal", name: "Đồ thường", icon: "👦", badge: "5 Tuổi", color: "bg-red-500" },
  { id: "kamen", name: "Action Mask", icon: "🦸", badge: "Siêu Nhân", color: "bg-emerald-600" },
  { id: "worm", name: "Sâu bướm", icon: "🐛", badge: "Lười Biếng", color: "bg-lime-500" },
  { id: "chocobi", name: "Mê Chocobi", icon: "⭐", badge: "Hảo Ngọt", color: "bg-amber-500" },
];

export function ShinCompanion() {
  const [isAsleep, setIsAsleep] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);
  const [costumeIdx, setCostumeIdx] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [wiggle, setWiggle] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Theo dõi thời gian không hoạt động (idle timer 9s)
  useEffect(() => {
    const resetIdle = () => {
      if (isAsleep) {
        // Tỉnh dậy kèm biểu cảm ngạc nhiên
        setIsAsleep(false);
        showRandomQuote("Oa! Đang ngủ ngon mà ai làm thức giấc zậy?!");
        soundFx.playTroubleBoing();
      }

      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setIsAsleep(true);
      }, 9000);
    };

    window.addEventListener("pointermove", resetIdle, { passive: true });
    window.addEventListener("keydown", resetIdle, { passive: true });

    // Khởi tạo timer đầu tiên
    idleTimerRef.current = setTimeout(() => {
      setIsAsleep(true);
    }, 9000);

    return () => {
      window.removeEventListener("pointermove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
    };
  }, [isAsleep]);

  const showRandomQuote = (customMsg?: string) => {
    const msg = customMsg || SHIN_QUOTES[Math.floor(Math.random() * SHIN_QUOTES.length)];
    setQuote(msg);
    if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current);
    quoteTimerRef.current = setTimeout(() => {
      setQuote(null);
    }, 3200);
  };

  const handlePetShin = () => {
    // Đổi trang phục & âm thanh
    setCostumeIdx((prev) => (prev + 1) % COSTUMES.length);
    setWiggle(true);
    setTimeout(() => setWiggle(false), 400);

    soundFx.playShinchanSFX();
    const currentCostume = COSTUMES[(costumeIdx + 1) % COSTUMES.length];
    showRandomQuote(`Biến hình: ${currentCostume.name}! ${currentCostume.icon}`);
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 left-4 z-40 w-12 h-12 bg-amber-300 border-[3px] border-black rounded-full shadow-[3px_3px_0px_#000] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
        title="Đánh thức Shin-chan"
        aria-label="Đánh thức Shin-chan"
      >
        <span className="text-xl">😴</span>
      </button>
    );
  }

  const currentCostume = COSTUMES[costumeIdx];

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 flex flex-col items-start select-none">
      {/* Comic Speech Bubble */}
      {quote && (
        <div className="mb-2 max-w-[220px] sm:max-w-[260px] bg-white border-[3px] border-black px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_#000] relative animate-bounce">
          <p className="font-body-md text-xs font-black text-black leading-snug">
            "{quote}"
          </p>
          <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-b-[3px] border-r-[3px] border-black transform rotate-45" />
        </div>
      )}

      {/* Shin-chan Avatar Card */}
      <div className="relative group">
        {/* Nút thu nhỏ */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMinimized(true);
          }}
          className="absolute -top-2 -right-2 z-20 w-5 h-5 bg-black text-white text-[10px] font-mono rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          title="Thu gọn"
        >
          ✕
        </button>

        {/* Khung nhân vật tương tác */}
        <div
          onClick={handlePetShin}
          className={`w-20 sm:w-24 bg-white border-[3px] border-black rounded-2xl p-1.5 shadow-[4px_4px_0px_#000] cursor-pointer hover:scale-105 active:scale-95 transition-all ${
            wiggle ? "animate-wiggle" : ""
          }`}
          title="Bấm vào để đổi đồ và chọc Shin!"
        >
          {/* Badge danh hiệu */}
          <div className="text-center mb-1">
            <span
              className={`text-[9px] font-label-bold text-white px-1.5 py-0.2 rounded border border-black ${currentCostume.color}`}
            >
              {currentCostume.badge}
            </span>
          </div>

          {/* Avatar Shin */}
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-amber-50 border-2 border-black">
            <Image
              src={ASSETS.characters.shinChan.src}
              alt="Shin-chan Companion"
              fill
              className="object-cover"
              sizes="96px"
            />

            {/* Hiệu ứng bong bóng mũi khi ngủ */}
            {isAsleep && (
              <div className="absolute top-2 right-2 flex flex-col items-center pointer-events-none">
                <span className="text-xs font-mono font-bold text-blue-600 animate-pulse">
                  Zzz...
                </span>
                <div className="w-4 h-4 rounded-full bg-cyan-200/80 border border-cyan-500 animate-ping" />
              </div>
            )}

            {/* Icon trang phục */}
            <div className="absolute bottom-1 left-1 bg-white/90 border border-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-[1px_1px_0px_#000]">
              {currentCostume.icon}
            </div>
          </div>

          <div className="text-center mt-1">
            <span className="font-mono text-[10px] font-black text-neutral-700 uppercase">
              {isAsleep ? "Đang ngủ 💤" : "Chọc Shin 👉"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShinCompanion;
