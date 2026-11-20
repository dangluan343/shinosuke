"use client";

import React from "react";

interface SoundboardBarProps {
  tickerText: string;
  isPlaying: boolean;
  voiceLang: "vi" | "ja";
  onToggleLang: () => void;
  onActionBeam: () => void;
  onDuoBicker: () => void;
  onRandomVoice: () => void;
  onStopAudio: () => void;
}

export function SoundboardBar({
  tickerText,
  isPlaying,
  voiceLang,
  onToggleLang,
  onActionBeam,
  onDuoBicker,
  onRandomVoice,
  onStopAudio,
}: SoundboardBarProps) {
  return (
    <section
      id="soundboard-section"
      className="mb-14 bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 md:p-6 rounded-2xl relative overflow-hidden"
    >
      <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-tertiary-fixed rounded-full opacity-30 pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
        {/* Left info */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto">
          <div className="w-14 h-14 bg-primary text-white rounded-xl border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] shrink-0">
            <span className="material-symbols-outlined text-3xl">volume_up</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-primary text-white text-[10px] font-label-bold px-2 py-0.5 border border-black uppercase rounded">
                Interactive
              </span>
              <h3 className="font-display-lg text-xl md:text-2xl uppercase text-black font-extrabold tracking-tight">
                KASUKABE SOUNDBOARD VIBES
              </h3>
              <button
                onClick={onToggleLang}
                className="text-xs font-label-bold px-2.5 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer transition-all bg-yellow-300 hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
                title="Bấm để chuyển đổi ngôn ngữ lồng tiếng"
              >
                <span>{voiceLang === "vi" ? "🇻🇳 Tiếng Việt" : "🇯🇵 Tiếng Nhật"}</span>
                <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-mono font-bold">
                  ĐỔI
                </span>
              </button>
            </div>
            <p className="text-xs md:text-sm font-caption text-gray-600 font-semibold mt-0.5">
              Audio voice lines chân thực từ Crayon Shin-chan • Bấm "BẤM NGHE" trên từng thẻ nhân vật!
            </p>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex flex-wrap gap-2.5 items-center justify-start lg:justify-end w-full lg:w-auto">
          <button
            onClick={onActionBeam}
            className="bg-primary text-white px-4 py-2.5 border-[3px] border-black shadow-[3px_3px_0px_0px_#000] font-label-bold text-xs md:text-sm uppercase flex items-center gap-1.5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer rounded-lg"
          >
            <span className="material-symbols-outlined text-base">bolt</span>
            <span>Bắn Action Beam Bay</span>
          </button>

          <button
            onClick={onDuoBicker}
            className="bg-tertiary-fixed text-black px-4 py-2.5 border-[3px] border-black shadow-[3px_3px_0px_0px_#000] font-label-bold text-xs md:text-sm uppercase flex items-center gap-1.5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer rounded-lg"
          >
            <span className="material-symbols-outlined text-base">sports_kabaddi</span>
            <span>Shin &amp; Misae Khẩu Chiến</span>
          </button>

          <button
            onClick={onRandomVoice}
            className="bg-secondary-container text-white px-3.5 py-2.5 border-[3px] border-black shadow-[3px_3px_0px_0px_#000] font-label-bold text-xs md:text-sm uppercase flex items-center gap-1.5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer rounded-lg"
          >
            <span className="material-symbols-outlined text-base">casino</span>
            <span>Ngẫu Nhiên</span>
          </button>

          <button
            onClick={onStopAudio}
            className="bg-surface-container-high text-black px-4 py-2.5 border-[3px] border-black shadow-[3px_3px_0px_0px_#000] font-label-bold text-xs md:text-sm uppercase flex items-center gap-1.5 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000] transition-all cursor-pointer rounded-lg"
          >
            <span className="material-symbols-outlined text-base">stop_circle</span>
            <span>Dừng tiếng</span>
          </button>
        </div>
      </div>

      {/* Soundboard Ticker */}
      <div
        id="sound-ticker"
        className="mt-4 bg-tertiary-fixed/20 border-[3px] border-black p-3.5 rounded-xl flex items-center justify-between text-xs md:text-sm font-label-bold shadow-[3px_3px_0px_0px_#000]"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
          <span className="material-symbols-outlined text-primary text-xl shrink-0">graphic_eq</span>
          <span className="truncate text-on-background font-bold" id="ticker-text">
            {tickerText}
          </span>
        </div>

        {/* Global animated EQ visualizer */}
        <div
          className={`flex items-end gap-1 h-5 w-16 justify-end shrink-0 transition-opacity ${
            isPlaying ? "opacity-100" : "opacity-35"
          }`}
          id="global-visualizer"
        >
          <span className={`w-1.5 bg-primary rounded-full h-2 border border-black ${isPlaying ? "eq-bar-1" : ""}`} />
          <span className={`w-1.5 bg-secondary rounded-full h-4 border border-black ${isPlaying ? "eq-bar-2" : ""}`} />
          <span className={`w-1.5 bg-tertiary rounded-full h-3 border border-black ${isPlaying ? "eq-bar-3" : ""}`} />
          <span className={`w-1.5 bg-emerald-500 rounded-full h-5 border border-black ${isPlaying ? "eq-bar-4" : ""}`} />
        </div>
      </div>
    </section>
  );
}
