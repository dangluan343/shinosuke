"use client";

import React from "react";

interface SoundboardBarProps {
  tickerText: string;
  isPlaying: boolean;
  voiceLang: "vi" | "ja";
  onToggleLang: () => void;
  onDuoBicker: () => void;
  onRandomVoice: () => void;
  onStopAudio: () => void;
}

export function SoundboardBar({
  tickerText,
  isPlaying,
  voiceLang,
  onToggleLang,
  onDuoBicker,
  onRandomVoice,
  onStopAudio,
}: SoundboardBarProps) {
  return (
    <section
      id="soundboard-section"
      className="bg-surface-container border-[3px] border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 rounded-2xl"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Title & Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 bg-primary rounded-xl border-[3px] border-on-background flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
            <span className="material-symbols-outlined text-3xl">volume_up</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-headline-sm text-lg md:text-xl uppercase text-on-background tracking-tight">
                KASUKABE SOUNDBOARD VIBES
              </h3>
              <button
                onClick={onToggleLang}
                className="text-xs font-label-bold px-2.5 py-1 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000] cursor-pointer transition-all bg-yellow-300 hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5"
                title="Bấm để chuyển đổi ngôn ngữ lồng tiếng"
              >
                <span>{voiceLang === "vi" ? "🇻🇳 Giọng: Tiếng Việt" : "🇯🇵 Giọng: Tiếng Nhật"}</span>
                <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-mono font-bold">
                  ĐỔI
                </span>
              </button>
            </div>
            <p className="text-xs md:text-sm font-caption text-on-surface-variant">
              Audio voice lines chân thực từ Crayon Shin-chan • Bấm "Bấm nghe" trên từng thẻ nhân vật!
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-wrap gap-2.5 items-center justify-center w-full md:w-auto">
          <button
            onClick={onDuoBicker}
            className="bg-error text-on-error px-4 py-2 border-[3px] border-on-background shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-label-bold text-xs md:text-sm uppercase flex items-center gap-1.5 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">sports_kabaddi</span>
            <span>Shin &amp; Misae Khẩu Chiến</span>
          </button>

          <button
            onClick={onRandomVoice}
            className="bg-tertiary text-on-tertiary px-3.5 py-2 border-[3px] border-on-background shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-label-bold text-xs md:text-sm uppercase flex items-center gap-1.5 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">casino</span>
            <span>Giọng ngẫu nhiên</span>
          </button>

          <button
            onClick={onStopAudio}
            className="bg-surface text-on-background px-4 py-2 border-[3px] border-on-background shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-label-bold text-xs md:text-sm uppercase flex items-center gap-1.5 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">stop_circle</span>
            <span>Dừng tiếng</span>
          </button>
        </div>
      </div>

      {/* Soundboard Ticker & Live Equalizer */}
      <div className="mt-4 bg-white border-[2px] border-on-background p-3 rounded-xl flex items-center justify-between text-xs md:text-sm font-label-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2 truncate flex-1 mr-3">
          <span className="material-symbols-outlined text-primary text-base flex-shrink-0">
            graphic_eq
          </span>
          <span className="truncate text-on-background">{tickerText}</span>
        </div>

        {/* Dynamic Visualizer EQ Bars */}
        <div
          className={`flex items-end gap-1 h-5 w-16 justify-end flex-shrink-0 ${
            isPlaying ? "opacity-100" : "opacity-30"
          }`}
        >
          <span className={`w-1.5 bg-primary rounded-full h-2 ${isPlaying ? "eq-bar-1" : ""}`} />
          <span className={`w-1.5 bg-secondary rounded-full h-4 ${isPlaying ? "eq-bar-2" : ""}`} />
          <span className={`w-1.5 bg-tertiary rounded-full h-3 ${isPlaying ? "eq-bar-3" : ""}`} />
          <span className={`w-1.5 bg-error rounded-full h-5 ${isPlaying ? "eq-bar-4" : ""}`} />
        </div>
      </div>
    </section>
  );
}
