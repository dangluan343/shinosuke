"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { soundFx } from "@/lib/audio";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { Volume2, VolumeX, Play, Square, Music, Sparkles } from "lucide-react";

type Category = "all" | "shin" | "action" | "family" | "retro";

interface SoundPad {
  id: string;
  key: string;
  label: string;
  sublabel: string;
  comicText: string;
  emoji: string;
  color: string;
  hoverColor: string;
  category: "shin" | "action" | "family" | "retro";
  play: () => void;
}

const SOUND_PADS: SoundPad[] = [
  {
    id: "buri-buri",
    key: "1",
    label: "Buri Buri Dance",
    sublabel: "Lắc mông vũ đạo",
    comicText: "🍑 LẮC MÔNG LẮC MÔNG~",
    emoji: "🍑",
    color: "bg-tertiary-fixed text-on-tertiary-fixed",
    hoverColor: "hover:bg-yellow-300",
    category: "shin",
    play: () => soundFx.playBuriBuriWiggle(),
  },
  {
    id: "action-beam",
    key: "2",
    label: "Action Beam!",
    sublabel: "Tia sáng hành động",
    comicText: "⚡ WAHAHA! ACTION BEAM!",
    emoji: "⚡",
    color: "bg-secondary text-white",
    hoverColor: "hover:bg-blue-600",
    category: "action",
    play: () => soundFx.playActionBeam(),
  },
  {
    id: "action-boom",
    key: "3",
    label: "Action Explosion",
    sublabel: "Cú nổ siêu nhân",
    comicText: "💥 BÙM CHÍU ĐÌ ĐÙNG!",
    emoji: "💥",
    color: "bg-primary text-white",
    hoverColor: "hover:bg-red-600",
    category: "action",
    play: () => soundFx.playActionExplosion(),
  },
  {
    id: "misae-roar",
    key: "4",
    label: "Misae Rage Roar",
    sublabel: "Sư tử Hà Đông gầm",
    comicText: "😡 SHINNOSUKE ĐỨNG LẠI MAU!!",
    emoji: "😡",
    color: "bg-[#e60012] text-white",
    hoverColor: "hover:bg-red-700",
    category: "family",
    play: () => soundFx.playMisaeRoar(),
  },
  {
    id: "chocobi-crunch",
    key: "5",
    label: "Chocobi Crunch",
    sublabel: "Cắn bánh rồm rộp",
    comicText: "🍪 RỒM RỘP~ BÁNH CHOCOBI!",
    emoji: "🍪",
    color: "bg-[#2d7f36] text-white",
    hoverColor: "hover:bg-green-700",
    category: "shin",
    play: () => soundFx.playChocobiCrunch(),
  },
  {
    id: "shiro-bark",
    key: "6",
    label: "Shiro Bark",
    sublabel: "Bạch Tuyết gâu gâu",
    comicText: "🐶 GÂU GÂU! CỤC KẸO BÔNG!",
    emoji: "🐶",
    color: "bg-[#ffffff] text-on-background",
    hoverColor: "hover:bg-gray-100",
    category: "family",
    play: () => soundFx.playShiroBark(),
  },
  {
    id: "flirt-whistle",
    key: "7",
    label: "Flirt Whistle",
    sublabel: "Huýt sáo ghẹo chị gái",
    comicText: "😘 HUÝT SÁO~ CHỊ GÁI XINH ĐẸP!",
    emoji: "😘",
    color: "bg-[#ec4899] text-white",
    hoverColor: "hover:bg-pink-600",
    category: "shin",
    play: () => soundFx.playFlirtWhistle(),
  },
  {
    id: "comic-slap",
    key: "8",
    label: "Comic Slap",
    sublabel: "Cốc đầu nổi cục u",
    comicText: "💢 BỐP! NỔI CỤC U TO TƯỚNG!",
    emoji: "💢",
    color: "bg-[#f59e0b] text-on-background",
    hoverColor: "hover:bg-amber-500",
    category: "family",
    play: () => soundFx.playComicSlap(),
  },
  {
    id: "trouble-boing",
    key: "9",
    label: "Trouble Boing",
    sublabel: "Bật tưng nghịch dại",
    comicText: "🌀 BOING! LẠI NGHỊCH DẠI RỒI!",
    emoji: "🌀",
    color: "bg-[#06b6d4] text-white",
    hoverColor: "hover:bg-cyan-600",
    category: "shin",
    play: () => soundFx.playTroubleBoing(),
  },
  {
    id: "anger-alarm",
    key: "0",
    label: "Anger Siren",
    sublabel: "Báo động khẩn cấp",
    comicText: "🚨 TÈ TEE! MẸ ĐANG ĐẾN!!",
    emoji: "🚨",
    color: "bg-[#b91c1c] text-white",
    hoverColor: "hover:bg-red-800",
    category: "family",
    play: () => soundFx.playAngerAlarm(),
  },
  {
    id: "chocobi-sparkle",
    key: "Q",
    label: "Chocobi Sparkle",
    sublabel: "Hào quang lấp lánh",
    comicText: "✨ TING TING~ THẦN TÀI TỚI!",
    emoji: "✨",
    color: "bg-[#facc15] text-on-background",
    hoverColor: "hover:bg-yellow-400",
    category: "retro",
    play: () => soundFx.playSparkleChime(),
  },
  {
    id: "game-over",
    key: "W",
    label: "Game Over Sad",
    sublabel: "Toang rồi Misae ơi",
    comicText: "💀 BỤP... TOANG THẬT RỒI!",
    emoji: "💀",
    color: "bg-[#475569] text-white",
    hoverColor: "hover:bg-slate-700",
    category: "retro",
    play: () => soundFx.playGameOver(),
  },
];

const IDLE_EQ_LEVELS = [12, 18, 12, 22, 15, 12, 20, 14];

/**
 * Isolated Equalizer Visualizer:
 * Zero re-renders on the parent Soundboard, zero rAF loop when idle!
 */
const EqualizerVisualizer = memo(function EqualizerVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const [levels, setLevels] = useState<number[]>(IDLE_EQ_LEVELS);

  useEffect(() => {
    if (!isPlaying) {
      setLevels(IDLE_EQ_LEVELS);
      return;
    }

    let animId: number;
    let lastUpdate = 0;
    const intervalMs = 80; // 12.5 FPS authentic retro chiptune bounce

    const tick = (now: number) => {
      if (now - lastUpdate >= intervalMs) {
        lastUpdate = now;
        setLevels([
          Math.floor(20 + Math.random() * 75),
          Math.floor(15 + Math.random() * 85),
          Math.floor(35 + Math.random() * 65),
          Math.floor(40 + Math.random() * 60),
          Math.floor(25 + Math.random() * 75),
          Math.floor(30 + Math.random() * 70),
          Math.floor(15 + Math.random() * 85),
          Math.floor(20 + Math.random() * 80),
        ]);
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  return (
    <div className="flex items-end gap-1 h-8 px-3 py-1 bg-on-background rounded-none neo-brutalist-border">
      {levels.map((lvl, idx) => (
        <div
          key={idx}
          className="w-1.5 bg-tertiary-fixed transition-all duration-75 rounded-none"
          style={{ height: `${lvl}%` }}
        />
      ))}
    </div>
  );
});

export function MemeSoundboard() {
  const [activePadId, setActivePadId] = useState<string | null>(null);
  const [activeComicText, setActiveComicText] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [soundCount, setSoundCount] = useState<number>(0);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [bgmVolume, setBgmVolume] = useState<number>(0.16);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync BGM state & clean up on unmount
  useEffect(() => {
    setIsBgmPlaying(soundFx.isBgmPlaying());
    setBgmVolume(soundFx.getBgmVolume());
    setIsMuted(soundFx.isMuted());

    const unsubscribe = soundFx.onBgmStateChange((playing) => {
      setIsBgmPlaying(playing);
    });

    return () => {
      unsubscribe();
      // Cleanly stop BGM when user leaves the soundboard to avoid phantom background music
      soundFx.stopBgm();
    };
  }, []);

  // Trigger sound logic
  const triggerPad = useCallback((pad: SoundPad) => {
    pad.play();
    setActivePadId(pad.id);
    setActiveComicText(pad.comicText);
    setSoundCount((prev) => prev + 1);

    setTimeout(() => {
      setActivePadId((curr) => (curr === pad.id ? null : curr));
    }, 450);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid capturing shortcuts if typing in an input / textarea / select
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
      ) {
        return;
      }

      const keyUpper = e.key.toUpperCase();
      const matched = SOUND_PADS.find((p) => p.key === keyUpper);
      if (matched) {
        e.preventDefault();
        triggerPad(matched);
      } else if (e.key === " " && !e.repeat) {
        // Spacebar toggles BGM if not focusing an interactive button
        if (target instanceof HTMLButtonElement) {
          return;
        }
        e.preventDefault();
        soundFx.toggleBgm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerPad]);

  const handleToggleBgm = () => {
    soundFx.toggleBgm();
  };

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setBgmVolume(vol);
    soundFx.setBgmVolume(vol);
  };

  const filteredPads = SOUND_PADS.filter((pad) => {
    if (selectedCategory === "all") return true;
    return pad.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Soundboard Header & BGM Player Console */}
      <div className="bg-surface neo-brutalist-border hard-shadow p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-on-background pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <NeoBadge variant="tertiary" rotate={-2} className="px-2.5 py-0.5 text-xs">
                RETRO MEME DECK 📻
              </NeoBadge>
              <span className="font-label-bold text-xs bg-surface-container-high px-2 py-0.5 neo-brutalist-border">
                {soundCount} Lần Bấm 💥
              </span>
            </div>
            <h2 className="font-display-md text-2xl sm:text-3xl uppercase tracking-tight text-on-background">
              Kasukabe Meme Soundboard 📢
            </h2>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
              12 Sound Pad bựa lòi phong cách 90s Anime. Bấm chuột trực tiếp hoặc gõ phím tắt{" "}
              <kbd className="px-1.5 py-0.5 bg-surface-container-high neo-brutalist-border text-xs font-bold">1-9</kbd>,{" "}
              <kbd className="px-1.5 py-0.5 bg-surface-container-high neo-brutalist-border text-xs font-bold">0</kbd>,{" "}
              <kbd className="px-1.5 py-0.5 bg-surface-container-high neo-brutalist-border text-xs font-bold">Q</kbd>,{" "}
              <kbd className="px-1.5 py-0.5 bg-surface-container-high neo-brutalist-border text-xs font-bold">W</kbd>!
            </p>
          </div>

          {/* Comic Feedback Balloon */}
          <div className="min-h-[52px] min-w-[240px] flex items-center justify-center p-3 bg-tertiary-fixed neo-brutalist-border hard-shadow -rotate-1">
            <span className="font-label-bold text-xs sm:text-sm uppercase text-on-background text-center animate-pulse">
              {activeComicText || "👉 Bấm phím bất kỳ để tạo meme!"}
            </span>
          </div>
        </div>

        {/* 8-bit Chiptune BGM Control Bar */}
        <div className="bg-surface-container-low neo-brutalist-border p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className={`w-10 h-10 neo-brutalist-border flex items-center justify-center transition-all ${
                isBgmPlaying ? "bg-primary text-white animate-spin" : "bg-surface text-on-surface"
              }`}
            >
              <Music className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-bold text-xs uppercase text-primary">
                  {isBgmPlaying ? "ĐANG PHÁT LOOPING" : "TẠM DỪNG"}
                </span>
                <span className="text-[10px] bg-tertiary-fixed px-1.5 py-0.2 neo-brutalist-border font-bold">
                  8-BIT SYNTH
                </span>
              </div>
              <p className="font-display-md text-xs sm:text-sm uppercase text-on-background">
                🎵 Kasukabe Morning Walk
              </p>
            </div>
          </div>

          {/* Equalizer Visualizer */}
          <EqualizerVisualizer isPlaying={isBgmPlaying || !!activePadId} />

          {/* BGM Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Play / Stop Button */}
            <button
              onClick={handleToggleBgm}
              className={`px-4 py-2 neo-brutalist-border font-label-bold text-xs uppercase flex items-center gap-2 transition-all cursor-pointer hard-shadow-active ${
                isBgmPlaying
                  ? "bg-secondary text-white hard-shadow"
                  : "bg-surface text-on-surface hard-shadow hover:bg-tertiary-fixed"
              }`}
            >
              {isBgmPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" /> Dừng Nhạc
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Phát BGM (Phím Space)
                </>
              )}
            </button>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 bg-surface neo-brutalist-border px-2 py-1">
              <button
                onClick={handleToggleMute}
                title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                className="cursor-pointer text-on-surface hover:text-primary transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-primary" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="0.4"
                step="0.02"
                value={isMuted ? 0 : bgmVolume}
                onChange={handleVolumeChange}
                disabled={isMuted}
                className="w-16 accent-primary cursor-pointer"
                title="BGM Volume"
              />
            </div>
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap gap-2 pt-1">
          {(
            [
              { id: "all", label: "Tất Cả (12)", icon: "✨" },
              { id: "shin", label: "Cu Shin", icon: "🍑" },
              { id: "action", label: "Action Mask", icon: "⚡" },
              { id: "family", label: "Gia Đình & Shiro", icon: "🐶" },
              { id: "retro", label: "Arcade Retro", icon: "👾" },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 neo-brutalist-border font-label-bold text-xs uppercase cursor-pointer transition-all ${
                selectedCategory === cat.id
                  ? "bg-on-background text-white hard-shadow -translate-x-0.5 -translate-y-0.5"
                  : "bg-surface-container text-on-surface hover:bg-tertiary-fixed"
              }`}
            >
              <span className="mr-1">{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 12-Pad Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPads.map((pad) => {
          const isActive = activePadId === pad.id;
          return (
            <button
              key={pad.id}
              onClick={() => triggerPad(pad)}
              className={`relative p-5 neo-brutalist-border hard-shadow-hover hard-shadow-active text-left transition-all cursor-pointer flex flex-col justify-between min-h-[145px] select-none ${
                pad.color
              } ${pad.hoverColor} ${
                isActive
                  ? "ring-4 ring-on-background scale-[0.98] translate-x-1 translate-y-1 shadow-none"
                  : "hard-shadow"
              }`}
            >
              {/* Keyboard Shortcut Badge */}
              <div className="flex items-start justify-between w-full">
                <span className="text-3xl sm:text-4xl filter drop-shadow-[2px_2px_0px_#000]">
                  {pad.emoji}
                </span>
                <span className="px-2 py-0.5 bg-on-background text-white font-label-bold text-xs neo-brutalist-border uppercase shadow-sm">
                  [{pad.key}]
                </span>
              </div>

              {/* Sound Title & Description */}
              <div className="mt-3 space-y-0.5">
                <h3 className="font-display-md text-sm sm:text-base uppercase leading-tight font-black">
                  {pad.label}
                </h3>
                <p className="font-body-md text-xs opacity-90 leading-tight">
                  {pad.sublabel}
                </p>
              </div>

              {/* Active Soundwave Indicator */}
              {isActive && (
                <div className="absolute top-2 right-12 flex items-center gap-0.5 bg-on-background text-tertiary-fixed px-1.5 py-0.5 rounded-none text-[10px] font-mono animate-bounce">
                  <span>PLAYING</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Tip footer */}
      <div className="p-4 bg-surface-container neo-brutalist-border text-center text-xs font-body-md text-on-surface-variant flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-primary shrink-0" />
        <span>
          Mẹo vui: Nhấn phím số liên tục để tạo chuỗi remix âm thanh dồn dập hài hước!
        </span>
      </div>
    </div>
  );
}
