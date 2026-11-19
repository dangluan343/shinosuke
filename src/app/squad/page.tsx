"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { ASSETS } from "@/constants/assets";
import { soundFx } from "@/lib/audio";
import { MisaeRageMeter } from "@/components/squad/MisaeRageMeter";
import { SoundboardBar } from "@/components/squad/SoundboardBar";

interface CharacterVoice {
  id: string;
  name: string;
  japaneseTitle?: string;
  colorName: string;
  badge?: string;
  image: string;
  mischief: number;
  mischiefColor: string;
  quoteVi: string;
  quoteJp: string;
  rate: number;
  pitch: number;
  playSfx: () => void;
}

interface ClanMember {
  id: string;
  name: string;
  japaneseTitle?: string;
  colorName: string;
  image: string;
  quoteVi: string;
  quoteJp: string;
  badgeText: string;
  badgeBg: string;
  rate: number;
  pitch: number;
  playSfx: () => void;
}

const DEFENSE_GROUP: CharacterVoice[] = [
  {
    id: "shinchan",
    name: "Shin-chan",
    japaneseTitle: "Nohara Shinnosuke (5 tuổi)",
    colorName: "text-primary",
    badge: "THE BOSS",
    image: ASSETS.characters.shinChan.src,
    mischief: 98,
    mischiefColor: "bg-primary",
    quoteVi: "Ora Shin-chan da zo! Chị gái xinh đẹp ơi có thích ăn ớt chuông không? Ho-ho-ho-i!",
    quoteJp: "オラしんのすけだゾ〜！ピーマンは嫌いだゾ〜！",
    rate: 1.25,
    pitch: 1.5,
    playSfx: () => soundFx.playShinchanSFX(),
  },
  {
    id: "kazama",
    name: "Kazama-kun",
    japaneseTitle: "Toru Kazama",
    colorName: "text-secondary",
    image: ASSETS.characters.kazama.src,
    mischief: 15,
    mischiefColor: "bg-secondary",
    quoteVi: "Shin-chan, đừng có thổi vào tai tớ nữa mà! Xấu hổ chết đi được! Tớ phải đi học thêm tiếng Anh rồi!",
    quoteJp: "しんのすけ！耳に息を吹きかけるなよ〜！",
    rate: 1.15,
    pitch: 1.3,
    playSfx: () => soundFx.playKazamaSFX(),
  },
  {
    id: "nene",
    name: "Nene-chan",
    japaneseTitle: "Sakurada Nene",
    colorName: "text-error",
    image: ASSETS.characters.nene.src,
    mischief: 75,
    mischiefColor: "bg-error",
    quoteVi: "Chơi trò Gia Đình Thực Tế nào! Đưa thỏ bông đây mau! Bóp bóp xả giận!",
    quoteJp: "リアルおままごとやるわよ！ウサギさん持ってきなさい！",
    rate: 1.2,
    pitch: 1.45,
    playSfx: () => soundFx.playNeneSFX(),
  },
  {
    id: "masao",
    name: "Masao-kun",
    japaneseTitle: "Sato Masao (Củ hành tây)",
    colorName: "text-on-surface-variant",
    image: ASSETS.characters.masao.src,
    mischief: 10,
    mischiefColor: "bg-on-surface-variant",
    quoteVi: "Sao lúc nào người chịu trận cũng là tớ chứ... Shin-chan đừng kéo quần tớ hu hu!",
    quoteJp: "どうしてボクばっかり…ズボン引っ張らないで〜！",
    rate: 1.05,
    pitch: 1.2,
    playSfx: () => soundFx.playMasaoSFX(),
  },
  {
    id: "bochan",
    name: "Bo-chan",
    japaneseTitle: "Bo-chan",
    colorName: "text-tertiary",
    image: ASSETS.characters.boChan.src,
    mischief: 30,
    mischiefColor: "bg-tertiary",
    quoteVi: "Bo... vừa tìm thấy một hòn đá có hình dáng giống cô Yoshinaga... Bo.",
    quoteJp: "ボーちゃん…よしなが先生に似た石見つけた…ボー。",
    rate: 0.85,
    pitch: 0.85,
    playSfx: () => soundFx.playBochanSFX(),
  },
  {
    id: "shiro",
    name: "Shiro",
    japaneseTitle: "Bạch Tuyết thông minh",
    colorName: "text-primary",
    image: ASSETS.characters.shiro.src,
    mischief: 5,
    mischiefColor: "bg-primary",
    quoteVi: "Gâu! Gâu gâu! Shin-chan lại quên cho tớ ăn cơm rồi! Cuộn tròn làm kẹo bông gòn đây! Gâu gâu!",
    quoteJp: "ワン！わたあめの術〜！ご飯まだ〜？",
    rate: 1.3,
    pitch: 1.6,
    playSfx: () => soundFx.playShiroSFX(),
  },
];

const NOHARA_CLAN: ClanMember[] = [
  {
    id: "misae",
    name: "Misae Nohara",
    japaneseTitle: "Nohara Misae (29 tuổi)",
    colorName: "text-secondary",
    image: ASSETS.characters.misae.src,
    quoteVi: "SHIN-CHAN! Lại không dọn đồ chơi hả?! Có tin mẹ cho ăn nắm đấm xoay cuồng nghiền thái dương không?!",
    quoteJp: "しんのすけ！グリグリ攻撃をお見舞いするわよ！！",
    badgeText: "Mischief Manager Level: 100",
    badgeBg: "bg-secondary-fixed",
    rate: 1.2,
    pitch: 1.35,
    playSfx: () => soundFx.playMisaeRageSFX(),
  },
  {
    id: "hiroshi",
    name: "Hiroshi Nohara",
    japaneseTitle: "Nohara Hiroshi (Trụ cột 32 năm nợ nhà)",
    colorName: "text-tertiary",
    image: ASSETS.characters.hiroshi.src,
    quoteVi: "Haizz... Mùi tất chân 32 năm tiền nhà này sẽ cứu rỗi thế giới! Cạn ly bia sau ngày làm việc vất vả nào!",
    quoteJp: "ああ〜今日も残業疲れた…ビールがうまい！",
    badgeText: "Smelly Feet Level: OVER 9000",
    badgeBg: "bg-tertiary-fixed",
    rate: 0.9,
    pitch: 0.75,
    playSfx: () => soundFx.playHiroshiSFX(),
  },
  {
    id: "himawari",
    name: "Himawari Nohara",
    japaneseTitle: "Nohara Himawari (0 tuổi)",
    colorName: "text-primary",
    image: ASSETS.characters.himawari.src,
    quoteVi: "Ta-da! Kira-kira! Trai đẹp và kim cương sáng lấp lánh đâu rồi! Ta-ya-ya!",
    quoteJp: "たいやー！キラキラ〜イケメンどこ〜？",
    badgeText: "Shiny Radar: ACTIVATED",
    badgeBg: "bg-primary-fixed",
    rate: 1.4,
    pitch: 1.7,
    playSfx: () => soundFx.playHimawariSFX(),
  },
];

export default function SquadPage() {
  const [tickerText, setTickerText] = useState(
    "Đang sẵn sàng! Bấm vào bất kỳ thẻ nhân vật nào dưới đây để kích hoạt giọng lồng tiếng."
  );
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play Character Voice (both Synthesizer SFX + Speech Synthesis)
  const triggerVoice = (
    id: string,
    name: string,
    textVi: string,
    rate: number,
    pitch: number,
    playSfx: () => void
  ) => {
    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    setSpeakingId(id);
    setTickerText(`🎙️ Đang phát: ${name} — "${textVi}"`);

    // Play Web Audio API synthetic SFX
    playSfx();

    // Play Web Speech Synthesis
    soundFx.speakVoice(textVi, rate, pitch, () => {
      // Keep highlighted a moment
      timerRef.current = setTimeout(() => {
        setSpeakingId(null);
        setTickerText("Sẵn sàng! Bấm vào bất kỳ nhân vật nào để tiếp tục nghe giọng.");
      }, 800);
    });

    // Fallback timer if speech ends or not supported
    timerRef.current = setTimeout(() => {
      setSpeakingId((prev) => (prev === id ? null : prev));
    }, 4500);
  };

  const handleStopAudio = () => {
    soundFx.stopSpeech();
    if (timerRef.current) clearTimeout(timerRef.current);
    setSpeakingId(null);
    setTickerText("Đã dừng âm thanh.");
  };

  const handleDuoBicker = () => {
    // 1. Shin provocative line
    const shin = DEFENSE_GROUP[0];
    triggerVoice(shin.id, shin.name, shin.quoteVi, shin.rate, shin.pitch, shin.playSfx);
    setTickerText("🔥 Khẩu chiến: Shin-chan trêu chọc mẹ Misae!");

    // 2. Misae counter attack after 2.3s
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const misae = NOHARA_CLAN[0];
      triggerVoice(misae.id, misae.name, misae.quoteVi, misae.rate, misae.pitch, misae.playSfx);
      setTickerText("💥 Khẩu chiến: Misae tung chiêu 'Nắm đấm xoay cuồng' phạt Shin!");
    }, 2400);
  };

  const handleRandomVoice = () => {
    const allChars: (CharacterVoice | ClanMember)[] = [...DEFENSE_GROUP, ...NOHARA_CLAN];
    const picked = allChars[Math.floor(Math.random() * allChars.length)];
    triggerVoice(
      picked.id,
      picked.name,
      picked.quoteVi,
      picked.rate,
      picked.pitch,
      picked.playSfx
    );

    // Scroll smoothly to target card
    if (typeof document !== "undefined") {
      const el = document.getElementById(`card-${picked.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleRollCall = () => {
    soundFx.playActionBeam();
    setTickerText("⚡ ACTION BEAM! Đội Phòng Vệ Kasukabe tập hợp đầy đủ!");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      soundFx.stopSpeech();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container flex flex-col justify-between">
      <TopNavBar />

      <main className="relative px-margin-mobile md:px-margin-desktop py-section-gap max-w-7xl mx-auto w-full flex-grow space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-tertiary-fixed px-4 py-1.5 border-[3px] border-on-background shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs md:text-sm font-label-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            <span>🔊 TƯƠNG TÁC ÂM THANH - BẤM VÀO NHÂN VẬT ĐỂ NGHE GIỌNG NÓI!</span>
          </div>

          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase italic text-on-background drop-shadow-[3px_3px_0px_#b7000c] leading-none">
            Kasukabe Defense Group
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Protecting the world from boredom, one diaper at a time! Meet the legends of Futaba
            Kindergarten and listen to their iconic quotes with live synthesized sound effects.
          </p>
        </div>

        {/* 1. Kasukabe Soundboard Vibes Bar */}
        <SoundboardBar
          tickerText={tickerText}
          isPlaying={speakingId !== null}
          onDuoBicker={handleDuoBicker}
          onRandomVoice={handleRandomVoice}
          onStopAudio={handleStopAudio}
        />

        {/* 2. Misae Rage Meter Interactive Minigame */}
        <MisaeRageMeter
          onTickerUpdate={(msg) => setTickerText(msg)}
        />

        {/* 3. Kasukabe Defense Group Character Bento Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎒</span>
              <h2 className="font-display-lg text-xl md:text-2xl uppercase italic text-on-background">
                Đội Phòng Vệ Mầm Non Futaba
              </h2>
            </div>
            <NeoBadge variant="secondary" rotate={2} className="text-xs">
              6 Thành Viên
            </NeoBadge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {DEFENSE_GROUP.map((c) => {
              const isSpeaking = speakingId === c.id;
              return (
                <div
                  key={c.id}
                  id={`card-${c.id}`}
                  onClick={() =>
                    triggerVoice(c.id, c.name, c.quoteVi, c.rate, c.pitch, c.playSfx)
                  }
                  className={`character-card bg-surface neo-brutalist-border hard-shadow p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden group select-none ${
                    isSpeaking ? "speaking-card" : ""
                  }`}
                >
                  {/* Boss badge */}
                  {c.badge && (
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary rotate-12 flex items-center justify-center neo-brutalist-border z-10 select-none shadow-[2px_2px_0px_#000]">
                      <span className="text-on-primary font-label-bold text-center text-xs leading-tight">
                        {c.badge}
                      </span>
                    </div>
                  )}

                  {/* Floating Comic Speech Bubble (visible on hover and active speech) */}
                  <div className={`comic-bubble top-6 left-6 right-6 ${isSpeaking ? "active" : ""}`}>
                    <div className="text-[11px] font-bold text-primary uppercase">
                      📢 {c.japaneseTitle || c.name}:
                    </div>
                    <p className="font-label-bold text-xs md:text-sm text-on-background leading-snug">
                      "{c.quoteVi}"
                    </p>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {c.quoteJp}
                    </span>
                  </div>

                  {/* Character Image Frame */}
                  <div className="w-full aspect-square neo-brutalist-border overflow-hidden relative bg-white group-hover:border-primary transition-colors">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Equalizer Indicator overlay on bottom right */}
                    <div
                      className={`absolute bottom-2 right-2 text-white text-[11px] font-label-bold px-2 py-1 border-[2px] border-black flex items-center gap-1 shadow-[2px_2px_0px_#000] rounded transition-all ${
                        isSpeaking ? "bg-error animate-pulse" : "bg-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isSpeaking ? "graphic_eq" : "volume_up"}
                      </span>
                      <span>{isSpeaking ? "Đang nói..." : "Bấm nghe"}</span>
                    </div>
                  </div>

                  {/* Info Header & Mischief bar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-headline-sm text-headline-sm uppercase ${c.colorName}`}>
                        {c.name}
                      </h3>
                      {c.japaneseTitle && (
                        <span className="text-[11px] font-mono text-neutral-500 font-bold">
                          {c.japaneseTitle}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-label-bold text-xs uppercase">Mischief:</span>
                      <div className="flex-1 h-4 bg-surface-container neo-brutalist-border overflow-hidden relative rounded">
                        <div
                          className={`h-full comic-hatch ${c.mischiefColor} transition-all duration-300`}
                          style={{ width: `${c.mischief}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-xs">{c.mischief}%</span>
                    </div>

                    <p className="italic font-body-md text-sm text-on-surface-variant line-clamp-2">
                      "{c.quoteVi}"
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Nohara Clan Section */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase italic text-secondary drop-shadow-[2px_2px_0px_#001b3b] leading-none">
              The Nohara Clan
            </h2>
            <p className="font-body-md text-on-surface-variant">
              Gia đình hỗn loạn nhưng ấm áp nhất Nhật Bản tại số nhà 904-2 Kasukabe!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {NOHARA_CLAN.map((n) => {
              const isSpeaking = speakingId === n.id;
              return (
                <div
                  key={n.id}
                  id={`card-${n.id}`}
                  onClick={() =>
                    triggerVoice(n.id, n.name, n.quoteVi, n.rate, n.pitch, n.playSfx)
                  }
                  className={`character-card bg-surface neo-brutalist-border hard-shadow p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden group select-none ${
                    isSpeaking ? "speaking-card" : ""
                  }`}
                >
                  {/* Floating Comic Speech Bubble */}
                  <div className={`comic-bubble top-6 left-6 right-6 ${isSpeaking ? "active" : ""}`}>
                    <div className="text-[11px] font-bold text-primary uppercase">
                      📢 {n.japaneseTitle || n.name}:
                    </div>
                    <p className="font-label-bold text-xs md:text-sm text-on-background leading-snug">
                      "{n.quoteVi}"
                    </p>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {n.quoteJp}
                    </span>
                  </div>

                  {/* Character Image */}
                  <div className="w-full h-52 neo-brutalist-border overflow-hidden relative bg-white group-hover:border-primary transition-colors rounded">
                    <Image
                      src={n.image}
                      alt={n.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Audio status badge */}
                    <div
                      className={`absolute bottom-2 right-2 text-white text-[11px] font-label-bold px-2 py-1 border-[2px] border-black flex items-center gap-1 shadow-[2px_2px_0px_#000] rounded transition-all ${
                        isSpeaking ? "bg-error animate-pulse" : "bg-primary"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isSpeaking ? "graphic_eq" : "volume_up"}
                      </span>
                      <span>{isSpeaking ? "Đang nói..." : "Bấm nghe"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className={`font-headline-sm text-headline-sm uppercase ${n.colorName}`}>
                      {n.name}
                    </h3>
                    <span className="text-[11px] font-mono text-neutral-500 font-bold">
                      {n.japaneseTitle}
                    </span>
                  </div>

                  <p className="italic font-body-md text-sm text-on-surface-variant flex-grow line-clamp-2">
                    "{n.quoteVi}"
                  </p>

                  <div
                    className={`${n.badgeBg} p-3 neo-brutalist-border font-label-bold text-xs uppercase text-center shadow-[2px_2px_0px_#000] rounded`}
                  >
                    {n.badgeText}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Floating Action Button: Roll Call / Action Beam */}
        <button
          onClick={handleRollCall}
          className="fixed bottom-6 right-6 md:bottom-12 md:right-12 w-16 h-16 bg-primary text-on-primary neo-brutalist-border hard-shadow hard-shadow-hover hard-shadow-active rounded-full flex items-center justify-center z-50 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          aria-label="Roll Call Đội Kasukabe"
          title="⚡ Roll Call: Bắn Action Beam!"
        >
          <span className="material-symbols-outlined text-3xl">bolt</span>
        </button>
      </main>

      <Footer />
    </div>
  );
}
