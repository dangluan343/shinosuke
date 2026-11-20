"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { Footer } from "@/components/layout/Footer";
import { ASSETS } from "@/constants/assets";
import { soundFx } from "@/lib/audio";
import { MisaeRageMeter } from "@/components/squad/MisaeRageMeter";
import { SoundboardBar } from "@/components/squad/SoundboardBar";
import { ActionBeamOverlay } from "@/components/squad/ActionBeamOverlay";

interface CharacterVoice {
  id: string;
  name: string;
  japaneseTitle?: string;
  colorName: string;
  cardBadge?: string;
  cardBadgeClass?: string;
  bossRibbon?: string;
  image: string;
  bgFrame: string;
  hoverBorder: string;
  btnBg: string;
  mischief: number;
  mischiefColor: string;
  quoteVi: string;
  quoteJp: string;
  tagline: string;
}

const DEFENSE_GROUP: CharacterVoice[] = [
  {
    id: "shinchan",
    name: "Shin-chan",
    japaneseTitle: "Nohara Shinnosuke (5 tuổi)",
    colorName: "text-primary",
    cardBadge: "5 Tuổi",
    cardBadgeClass: "bg-red-100 text-primary border-primary",
    bossRibbon: "THE BOSS",
    image: ASSETS.characters.shinChan.src,
    bgFrame: "bg-amber-100",
    hoverBorder: "group-hover:border-primary",
    btnBg: "bg-primary",
    mischief: 98,
    mischiefColor: "bg-primary",
    quoteVi: "Ora Shin-chan da zo! Chị gái xinh đẹp ơi có thích ăn ớt chuông không? Ho-ho-ho-i! He-he-he!",
    quoteJp: "オラしんのすけだゾ〜！ピーマンは嫌いだゾ〜！",
    tagline: '"Hey, Action Mask! Wait for meeeee!"',
  },
  {
    id: "kazama",
    name: "Kazama-kun",
    japaneseTitle: "Kazama Tooru (Thiếu gia học giả)",
    colorName: "text-secondary",
    cardBadge: "Lớp Hướng Dương",
    cardBadgeClass: "bg-blue-100 text-secondary border-secondary",
    image: ASSETS.characters.kazama.src,
    bgFrame: "bg-blue-100",
    hoverBorder: "group-hover:border-secondary",
    btnBg: "bg-secondary",
    mischief: 15,
    mischiefColor: "bg-secondary",
    quoteVi: "Shin-chan, đừng có thổi vào tai tớ nữa mà! Xấu hổ chết đi được! Tớ phải đi học thêm tiếng Anh rồi!",
    quoteJp: "しんのすけ！耳に息を吹きかけるなよ〜！",
    tagline: '"I am a refined gentleman from a high-class family!"',
  },
  {
    id: "nene",
    name: "Nene-chan",
    japaneseTitle: "Nene-chan (Công chúa dấm đài)",
    colorName: "text-pink-600",
    cardBadge: "Thỏ Bông Nổi Giận",
    cardBadgeClass: "bg-pink-100 text-pink-700 border-pink-500",
    image: ASSETS.characters.nene.src,
    bgFrame: "bg-pink-100",
    hoverBorder: "group-hover:border-pink-500",
    btnBg: "bg-pink-600",
    mischief: 75,
    mischiefColor: "bg-pink-600",
    quoteVi: "Chơi trò Gia Đình Thực Tế nào! Đưa thỏ bông đây! Bop bop!",
    quoteJp: "リアルおままごとやるわよ！ウサギさん持ってきなさい！",
    tagline: '"Time to play Real House! You\'re the salaryman!"',
  },
  {
    id: "masao",
    name: "Masao-kun",
    japaneseTitle: "Masao-kun (Củ hành tây)",
    colorName: "text-emerald-800",
    cardBadge: "Onigiri Tròn Vo",
    cardBadgeClass: "bg-emerald-100 text-emerald-800 border-emerald-600",
    image: ASSETS.characters.masao.src,
    bgFrame: "bg-emerald-100",
    hoverBorder: "group-hover:border-emerald-600",
    btnBg: "bg-emerald-700",
    mischief: 20,
    mischiefColor: "bg-emerald-600",
    quoteVi: "Oa oa oa! Shin-chan đừng kéo tụt quần tớ nữa! Tớ sợ lắm!",
    quoteJp: "どうしてボクばっかり…ズボン引っ張らないで〜！",
    tagline: '"Why does this always happen to me? *cries*"',
  },
  {
    id: "bochan",
    name: "Bo-chan",
    japaneseTitle: "Bo-chan (Thần đá)",
    colorName: "text-amber-800",
    cardBadge: "Thần Đá Kasukabe",
    cardBadgeClass: "bg-amber-100 text-amber-800 border-amber-600",
    image: ASSETS.characters.boChan.src,
    bgFrame: "bg-amber-100",
    hoverBorder: "group-hover:border-amber-600",
    btnBg: "bg-amber-600",
    mischief: 10,
    mischiefColor: "bg-amber-600",
    quoteVi: "Bo... tớ tìm thấy một hòn đá hình mũi tên kỳ diệu... Bo...",
    quoteJp: "ボーちゃん…よしなが先生に似た石見つけた…ボー。",
    tagline: '"Bo... found a nice rock... Bo."',
  },
  {
    id: "shiro",
    name: "Shiro",
    japaneseTitle: "Bạch Tuyết (Shiro)",
    colorName: "text-blue-700",
    cardBadge: "Kẹo Bông Gòn",
    cardBadgeClass: "bg-cyan-100 text-blue-800 border-blue-600",
    image: ASSETS.characters.shiro.src,
    bgFrame: "bg-cyan-50",
    hoverBorder: "group-hover:border-cyan-500",
    btnBg: "bg-blue-600",
    mischief: 5,
    mischiefColor: "bg-blue-600",
    quoteVi: "Gâu! Gâu gâu! Shin-chan mau đổ hạt vào bát cho tớ đi!",
    quoteJp: "ワン！わたあめの術〜！ご飯まだ〜？",
    tagline: '"Woof! (The only responsible one here)"',
  },
];

interface NoharaMember {
  id: string;
  name: string;
  japaneseTitle?: string;
  colorName: string;
  cardBadge: string;
  cardBadgeClass: string;
  image: string;
  bgFrame: string;
  hoverBorder: string;
  btnBg: string;
  quoteVi: string;
  quoteJp: string;
  tagline: string;
}

const NOHARA_CLAN: NoharaMember[] = [
  {
    id: "misae",
    name: "Misae",
    japaneseTitle: "Mẹ Misae",
    colorName: "text-error",
    cardBadge: "29 Tuổi (Tâm hồn 20)",
    cardBadgeClass: "bg-red-100 text-error border-error",
    image: ASSETS.characters.misae.src,
    bgFrame: "bg-red-50",
    hoverBorder: "group-hover:border-error",
    btnBg: "bg-error",
    quoteVi: "SHIN-CHAN! Lại không chịu dọn đồ chơi hả?! Cốc đầu sấm sét!",
    quoteJp: "しんのすけ！グリグリ攻撃をお見舞いするわよ！！",
    tagline: '"Shin-chan! Stop showing your butt to the neighbors!"',
  },
  {
    id: "hiroshi",
    name: "Hiroshi",
    japaneseTitle: "Bố Hiroshi",
    colorName: "text-amber-800",
    cardBadge: "Trưởng Phòng Futaba",
    cardBadgeClass: "bg-amber-100 text-amber-800 border-amber-700",
    image: ASSETS.characters.hiroshi.src,
    bgFrame: "bg-amber-50",
    hoverBorder: "group-hover:border-amber-600",
    btnBg: "bg-amber-700",
    quoteVi: "Haizz... Mùi tất chân 32 năm tiền nhà này sẽ cứu thế giới! Bia ngon quá!",
    quoteJp: "ああ〜今日も残業疲れた…ビールがうまい！",
    tagline: '"My socks... they\'re more powerful than any weapon."',
  },
  {
    id: "himawari",
    name: "Himawari",
    japaneseTitle: "Bé Himawari",
    colorName: "text-pink-600",
    cardBadge: "0 Tuổi • Mê Hột Xoàn",
    cardBadgeClass: "bg-pink-100 text-pink-600 border-pink-400",
    image: ASSETS.characters.himawari.src,
    bgFrame: "bg-pink-50",
    hoverBorder: "group-hover:border-pink-500",
    btnBg: "bg-pink-600",
    quoteVi: "Ta-ya! Kira-kira! Kim cương lấp lánh và trai đẹp đâu rồi?!",
    quoteJp: "たいやー！キラキラ〜イケメンどこ〜？",
    tagline: '"Da-da! *points at shiny diamonds*"',
  },
];

export default function SquadPage() {
  const [tickerText, setTickerText] = useState(
    'Đang sẵn sàng! Bấm nút "ACTION BEAM" hoặc bấm vào thẻ nhân vật để nghe giọng.'
  );
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [voiceLang, setVoiceLang] = useState<"vi" | "ja">("vi");
  const [isBeamActive, setIsBeamActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play Character Voice
  const triggerVoice = (
    id: string,
    name: string,
    quoteVi: string,
    quoteJp: string
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    soundFx.stopVoiceClip();

    setSpeakingId(id);
    const currentLine = voiceLang === "vi" ? quoteVi : quoteJp;
    setTickerText(
      `🎙️ [${voiceLang === "vi" ? "Tiếng Việt" : "Tiếng Nhật"}]: ${name} — "${currentLine}"`
    );

    soundFx.playVoiceClip(id, voiceLang, () => {
      timerRef.current = setTimeout(() => {
        setSpeakingId(null);
        setTickerText('Sẵn sàng! Bấm vào bất kỳ nhân vật nào để tiếp tục nghe giọng.');
      }, 500);
    });

    timerRef.current = setTimeout(() => {
      setSpeakingId((prev) => (prev === id ? null : prev));
    }, 6000);
  };

  const handleStopAudio = () => {
    soundFx.stopVoiceClip();
    soundFx.stopSpeech();
    if (timerRef.current) clearTimeout(timerRef.current);
    setSpeakingId(null);
    setTickerText("Đã dừng âm thanh!");
  };

  const handleDuoBicker = () => {
    const shin = DEFENSE_GROUP[0];
    triggerVoice(shin.id, shin.name, shin.quoteVi, shin.quoteJp);
    setTickerText("🔥 Khẩu chiến: Shin-chan trêu chọc mẹ Misae!");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const misae = NOHARA_CLAN[0];
      triggerVoice(misae.id, misae.name, misae.quoteVi, misae.quoteJp);
      setTickerText('💥 Khẩu chiến: Misae tung chiêu "Cốc đầu sấm sét" phạt Shin!');
    }, 3000);
  };

  const handleRandomVoice = () => {
    const allChars = [...DEFENSE_GROUP, ...NOHARA_CLAN];
    const picked = allChars[Math.floor(Math.random() * allChars.length)];
    triggerVoice(picked.id, picked.name, picked.quoteVi, picked.quoteJp);

    if (typeof document !== "undefined") {
      const el = document.getElementById(`card-${picked.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleTriggerActionBeam = () => {
    setIsBeamActive(true);
    setTickerText("⚡ SIÊU NHÂN HÀNH ĐỘNG BAY NGANG MÀN HÌNH BẮN ACTION BEAM! ⚡");
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      soundFx.stopVoiceClip();
      soundFx.stopSpeech();
    };
  }, []);

  return (
    <div
      id="app-body"
      className={`min-h-screen bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container flex flex-col justify-between relative overflow-x-hidden ${
        isBeamActive ? "beam-shake" : ""
      }`}
    >
      {/* Background Comic Dots */}
      <div className="fixed inset-0 comic-dots pointer-events-none z-0" />

      {/* Cinematic Action Kamen Beam Overlay */}
      <ActionBeamOverlay
        isActive={isBeamActive}
        onComplete={() => {
          setIsBeamActive(false);
          setTickerText("Action Beam hoàn tất! Bấm lại nút để triệu hồi Siêu Nhân bay ngang màn hình tiếp.");
        }}
      />

      <TopNavBar />

      <main className="relative z-10 px-4 md:px-12 py-10 max-w-7xl mx-auto w-full flex-grow">
        {/* Hero Section */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-tertiary-fixed px-4 py-1.5 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] text-xs md:text-sm font-label-bold uppercase tracking-wider rounded-lg">
            <span className="w-3 h-3 rounded-full bg-primary border border-black animate-ping" />
            <span className="text-black font-extrabold">
              🔊 TƯƠNG TÁC ÂM THANH - BẤM VÀO NHÂN VẬT ĐỂ NGHE GIỌNG NÓI!
            </span>
          </div>
          <h1 className="font-display-lg text-4xl md:text-6xl uppercase italic text-black font-black tracking-tight drop-shadow-[3px_3px_0px_#ffd200]">
            KASUKABE DEFENSE GROUP
          </h1>
          <p className="font-body-md text-sm md:text-base font-semibold text-on-surface-variant max-w-2xl mx-auto">
            Protecting the world from boredom, one diaper at a time! Meet the legends of Futaba
            Kindergarten and listen to their iconic quotes.
          </p>
        </div>

        {/* 1. Kasukabe Soundboard Section */}
        <SoundboardBar
          tickerText={tickerText}
          isPlaying={speakingId !== null}
          voiceLang={voiceLang}
          onToggleLang={() => setVoiceLang((prev) => (prev === "vi" ? "ja" : "vi"))}
          onActionBeam={handleTriggerActionBeam}
          onDuoBicker={handleDuoBicker}
          onRandomVoice={handleRandomVoice}
          onStopAudio={handleStopAudio}
        />

        {/* 2. Kasukabe Kids Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {DEFENSE_GROUP.map((c) => {
            const isSpeaking = speakingId === c.id;
            const mainQuote = voiceLang === "vi" ? c.quoteVi : c.quoteJp;
            const subQuote = voiceLang === "vi" ? c.quoteJp : c.quoteVi;

            return (
              <div
                key={c.id}
                id={`card-${c.id}`}
                onClick={() => triggerVoice(c.id, c.name, c.quoteVi, c.quoteJp)}
                className={`character-card bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden group select-none ${
                  isSpeaking ? "speaking-card" : ""
                }`}
              >
                {/* Boss Ribbon Badge */}
                {c.bossRibbon && (
                  <div className="absolute -top-3 -right-3 w-24 h-24 bg-primary text-white rotate-12 flex items-center justify-center border-[3px] border-black z-20 shadow-[2px_2px_0px_#000]">
                    <span className="font-label-bold text-xs uppercase font-black text-center leading-none mt-2 mr-2">
                      THE
                      <br />
                      BOSS
                    </span>
                  </div>
                )}

                {/* Floating Comic Speech Bubble */}
                <div
                  id={`bubble-${c.id}`}
                  className={`comic-bubble top-4 left-4 right-4 ${isSpeaking ? "active" : ""}`}
                >
                  <div className={`text-[11px] font-bold uppercase ${c.colorName}`}>
                    📢 {c.japaneseTitle || c.name}:
                  </div>
                  <p className="font-label-bold text-xs md:text-sm text-black leading-snug">
                    "{mainQuote}"
                  </p>
                  <span className="text-[10px] text-gray-500 font-mono">{subQuote}</span>
                </div>

                {/* Character Image Frame */}
                <div
                  className={`w-full aspect-square border-[3px] border-black rounded-xl overflow-hidden relative ${c.hoverBorder} transition-colors ${c.bgFrame}`}
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover block group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div
                    className={`absolute bottom-2.5 right-2.5 ${c.btnBg} text-white text-[11px] font-label-bold px-2.5 py-1 border-[2px] border-black rounded-md flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isSpeaking ? "graphic_eq" : "volume_up"}
                    </span>
                    <span>{isSpeaking ? "ĐANG PHÁT" : "BẤM NGHE"}</span>
                  </div>
                </div>

                {/* Info & Mischief */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className={`font-display-lg text-2xl font-black uppercase tracking-tight ${c.colorName}`}>
                      {c.name}
                    </h2>
                    {c.cardBadge && (
                      <span
                        className={`text-xs px-2.5 py-0.5 border-2 font-label-bold rounded-md ${c.cardBadgeClass}`}
                      >
                        {c.cardBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-label-bold text-xs uppercase text-gray-700">Mischief:</span>
                    <div className="flex-1 h-4 bg-surface-container-high border-[2px] border-black rounded-full overflow-hidden relative">
                      <div
                        className={`h-full ${c.mischiefColor} comic-hatch transition-all duration-300`}
                        style={{ width: `${c.mischief}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono font-bold ${c.colorName}`}>{c.mischief}%</span>
                  </div>

                  <p className="italic font-body-md text-xs md:text-sm text-gray-600 font-medium">
                    {c.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Nohara Clan Section Header */}
        <div className="mt-16 text-center mb-8">
          <div className="inline-block bg-tertiary-fixed text-black text-xs font-label-bold px-3 py-1 border-2 border-black uppercase rounded shadow-[2px_2px_0px_#000] mb-2">
            Gia Đình Nohara Huyền Thoại
          </div>
          <h2 className="font-display-lg text-3xl md:text-5xl uppercase italic text-black font-black drop-shadow-[3px_3px_0px_#e60012]">
            THE NOHARA CLAN
          </h2>
          <p className="font-body-md text-xs md:text-sm font-bold uppercase tracking-wider text-gray-600 mt-1">
            Nhấp Để Nghe Khẩu Chiến Nảy Lửa Giữa Các Thành Viên
          </p>
        </div>

        {/* 4. Nohara Clan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-14">
          {NOHARA_CLAN.map((n) => {
            const isSpeaking = speakingId === n.id;
            const mainQuote = voiceLang === "vi" ? n.quoteVi : n.quoteJp;
            const subQuote = voiceLang === "vi" ? n.quoteJp : n.quoteVi;

            return (
              <div
                key={n.id}
                id={`card-${n.id}`}
                onClick={() => triggerVoice(n.id, n.name, n.quoteVi, n.quoteJp)}
                className={`character-card bg-white border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden group select-none ${
                  isSpeaking ? "speaking-card" : ""
                }`}
              >
                {/* Floating Comic Speech Bubble */}
                <div
                  id={`bubble-${n.id}`}
                  className={`comic-bubble top-4 left-4 right-4 ${isSpeaking ? "active" : ""}`}
                >
                  <div className={`text-[11px] font-bold uppercase ${n.colorName}`}>
                    📢 {n.japaneseTitle || n.name}:
                  </div>
                  <p className="font-label-bold text-xs md:text-sm text-black leading-snug">
                    "{mainQuote}"
                  </p>
                  <span className="text-[10px] text-gray-500 font-mono">{subQuote}</span>
                </div>

                {/* Character Image Frame */}
                <div
                  className={`w-full aspect-square border-[3px] border-black rounded-xl overflow-hidden relative ${n.hoverBorder} transition-colors ${n.bgFrame}`}
                >
                  <Image
                    src={n.image}
                    alt={n.name}
                    fill
                    className="object-cover block group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div
                    className={`absolute bottom-2.5 right-2.5 ${n.btnBg} text-white text-[11px] font-label-bold px-2.5 py-1 border-[2px] border-black rounded-md flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isSpeaking ? "graphic_eq" : "volume_up"}
                    </span>
                    <span>{isSpeaking ? "ĐANG PHÁT" : "BẤM NGHE"}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className={`font-display-lg text-2xl font-black uppercase tracking-tight ${n.colorName}`}>
                      {n.name}
                    </h2>
                    <span
                      className={`text-xs px-2.5 py-0.5 border-2 font-label-bold rounded-md ${n.cardBadgeClass}`}
                    >
                      {n.cardBadge}
                    </span>
                  </div>
                  <p className="italic font-body-md text-xs md:text-sm text-gray-600 font-medium">
                    {n.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. Misae Anger Meter Interactive Section */}
        <MisaeRageMeter onTickerUpdate={(msg) => setTickerText(msg)} />

        {/* Floating Action Button: Action Beam Flying Summoner */}
        <button
          onClick={handleTriggerActionBeam}
          className="fixed bottom-6 right-6 md:bottom-12 md:right-12 w-16 h-16 bg-primary text-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rounded-full flex items-center justify-center z-50 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          aria-label="Triệu hồi Siêu Nhân Hành Động Action Beam"
          title="⚡ ACTION BEAM: Triệu hồi Siêu Nhân bay ngang màn hình!"
        >
          <span className="material-symbols-outlined text-3xl animate-bounce">bolt</span>
        </button>
      </main>

      <Footer />
    </div>
  );
}
