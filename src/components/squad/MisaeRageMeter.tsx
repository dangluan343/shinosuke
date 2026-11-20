"use client";

import React, { useState } from "react";
import { soundFx } from "@/lib/audio";

interface MisaeRageMeterProps {
  onRageChange?: (rage: number) => void;
  onTickerUpdate?: (text: string) => void;
}

export function MisaeRageMeter({ onRageChange, onTickerUpdate }: MisaeRageMeterProps) {
  const [currentRage, setCurrentRage] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const handleAddRage = (amount: number, reason: string) => {
    soundFx.playBoingSpringSFX();

    const nextRage = Math.min(100, currentRage + amount);
    setCurrentRage(nextRage);
    if (onRageChange) onRageChange(nextRage);

    const tickerMsg = `🔥 Shin hành động: ${reason} (Nộ khí tăng +${amount}%)`;
    if (onTickerUpdate) onTickerUpdate(tickerMsg);

    if (nextRage >= 100) {
      handleMaxRage();
    } else if (nextRage >= 70) {
      soundFx.playAlarmWarningSFX();
    }
  };

  const handleMaxRage = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 700);

    soundFx.playThunderWhackImpactSFX();
    soundFx.playVoiceClip("misae", "vi");

    if (onTickerUpdate) {
      onTickerUpdate("💥 BÁO ĐỘNG ĐỎ: Nộ khí Misae chạm ngưỡng 100%! Chiêu thức 'Guri Guri' đã giáng xuống đầu Shin!");
    }
  };

  const handleReset = () => {
    setCurrentRage(0);
    if (onRageChange) onRageChange(0);

    soundFx.playCalmChimeSFX();
    soundFx.playVoiceClip("shinchan", "vi");

    if (onTickerUpdate) {
      onTickerUpdate("🌸 Shin hứa ngoan! Mẹ Misae đã hạ nhiệt nộ khí về 0%.");
    }
  };

  return (
    <section
      id="misae-meter-section"
      className={`mb-14 bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl overflow-hidden ${
        isShaking ? "shake-screen" : ""
      }`}
    >
      {/* Top Hazard Stripe */}
      <div className="hazard-stripe h-6 w-full border-b-[3px] border-black" />

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <span className="inline-block bg-primary text-white text-xs font-label-bold px-3 py-1 border-2 border-black uppercase mb-2 rounded shadow-[2px_2px_0px_0px_#000]">
              Version 3000 • Futaba Lab
            </span>
            <h2 className="font-display-lg text-2xl md:text-4xl text-error uppercase italic font-black tracking-tight drop-shadow-[2px_2px_0px_#000]">
              MÁY ĐO NỘ KHÍ MẸ MISAE
            </h2>
            <p className="text-xs md:text-sm font-body-md text-gray-600 font-semibold mt-1">
              Thử thách lòng can đảm của Shin: Bạn có dám chọc giận Misae chạm ngưỡng 100%?
            </p>
          </div>

          <div className="bg-tertiary-fixed border-[3px] border-black px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_#000] text-center shrink-0">
            <div className="text-[11px] font-label-bold text-black uppercase font-black">
              NỘ KHÍ HIỆN TẠI
            </div>
            <div
              id="misae-meter-val"
              className="text-3xl md:text-4xl font-display-lg font-black text-error drop-shadow-[1px_1px_0px_#000]"
            >
              {currentRage}%
            </div>
          </div>
        </div>

        {/* Meter Progress Bar */}
        <div className="w-full h-8 bg-surface-container-high border-[3px] border-black rounded-full overflow-hidden p-1 shadow-inner relative mb-6">
          <div
            id="misae-progress-bar"
            className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-600 rounded-full transition-all duration-300 relative"
            style={{ width: `${Math.max(5, currentRage)}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/70 animate-pulse" />
          </div>
        </div>

        {/* Action Buttons to Trigger Anger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            onClick={() => handleAddRage(20, "Shin kiên quyết không chịu ăn ớt chuông!")}
            className="bg-white border-[3px] border-black p-3.5 font-label-bold text-xs uppercase flex items-center justify-between hover:bg-yellow-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer shadow-[3px_3px_0px_#000] rounded-xl font-bold"
          >
            <span className="flex items-center gap-1.5">🥦 Không ăn ớt chuông</span>
            <span className="bg-primary text-white px-2 py-0.5 rounded text-[11px] font-black border border-black">
              +20%
            </span>
          </button>

          <button
            onClick={() => handleAddRage(25, "Shin múa mông Buriburi trước mặt cô hàng xóm!")}
            className="bg-white border-[3px] border-black p-3.5 font-label-bold text-xs uppercase flex items-center justify-between hover:bg-yellow-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer shadow-[3px_3px_0px_#000] rounded-xl font-bold"
          >
            <span className="flex items-center gap-1.5">🍑 Múa mông lắc lắc</span>
            <span className="bg-primary text-white px-2 py-0.5 rounded text-[11px] font-black border border-black">
              +25%
            </span>
          </button>

          <button
            onClick={() => handleAddRage(35, "Shin lấy son của mẹ vẽ mặt cho Shiro!")}
            className="bg-white border-[3px] border-black p-3.5 font-label-bold text-xs uppercase flex items-center justify-between hover:bg-yellow-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer shadow-[3px_3px_0px_#000] rounded-xl font-bold"
          >
            <span className="flex items-center gap-1.5">💄 Lấy son vẽ Shiro</span>
            <span className="bg-primary text-white px-2 py-0.5 rounded text-[11px] font-black border border-black">
              +35%
            </span>
          </button>

          <button
            onClick={handleReset}
            className="bg-white border-[3px] border-black p-3.5 font-label-bold text-xs uppercase flex items-center justify-between hover:bg-emerald-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer shadow-[3px_3px_0px_#000] rounded-xl font-bold"
          >
            <span className="flex items-center gap-1.5">🌸 Khen mẹ đẹp / Hứa ngoan</span>
            <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[11px] font-black border border-black">
              Hạ 0%
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
