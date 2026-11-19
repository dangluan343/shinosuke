"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { soundFx } from "@/lib/audio";
import { NeoButton } from "@/components/ui/NeoButton";
import { NeoBadge } from "@/components/ui/NeoBadge";

type Move = "rock" | "scissors" | "paper";

interface MoveInfo {
  id: Move;
  label: string;
  emoji: string;
  beats: Move;
  losesTo: Move;
  color: string;
}

const MOVES: Record<Move, MoveInfo> = {
  rock: {
    id: "rock",
    label: "BÚA (ROCK)",
    emoji: "✊",
    beats: "scissors",
    losesTo: "paper",
    color: "bg-primary text-white",
  },
  scissors: {
    id: "scissors",
    label: "KÉO (SCISSORS)",
    emoji: "✌️",
    beats: "paper",
    losesTo: "rock",
    color: "bg-secondary text-white",
  },
  paper: {
    id: "paper",
    label: "BAO (PAPER)",
    emoji: "✋",
    beats: "rock",
    losesTo: "scissors",
    color: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
};

const SHIN_QUOTES = {
  idle: [
    "Dám đấu kéo búa bao với Shin-sama không? Thua là phải mua Chocobi đấy!",
    "Bạch Tuyết Shiro ơi ra xem anh bón hành cho người ta này~",
    "Bật mí nè: Lát nữa Shin sẽ ra Bao đó... có tin không thì tùy!",
  ],
  countdown: [
    "Jan... Ken... Pon!",
    "Oẳn... Tù... Tì...",
    "Ra cái gì ra cái này!",
  ],
  cheat: [
    "Ớ nhìn kìa! Có chị gái xinh đẹp mặc áo tắm đang đi tới!",
    "Hê hê hê~ Shin vừa đổi ý vào giây thứ 99 rồi nha!",
    "Úi giời ơi tay Shin bị chuột rút, ra lại cái này mới đúng!",
  ],
  win: [
    "Haha! Đã bảo rồi, tuổi gì ăn được Shin-sama!",
    "Lêu lêu~ Mẹ Misae ơi có người vừa bị con đánh bại nè!",
    "Thua rồi thì ngoan ngoãn nộp bánh Chocobi ra đây!",
  ],
  lose: [
    "Hic hic... Đại ca tha cho em, em tặng anh bánh Chocobi nè!",
    "Không tính! Gió thổi làm ngón tay Shin bị bay lệch hướng mà!",
    "Đau lòng quá... về nhà ăn snack cho đỡ buồn vậy!",
  ],
  draw: [
    "Aiko Desho! Lại hòa rồi, tâm linh tương thông quá vậy ta?",
    "Hòa hoài mỏi tay quá, làm hiệp nữa phân định thắng thua nào!",
  ],
};

export function JankenponGame() {
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [shinMove, setShinMove] = useState<Move | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [countdownText, setCountdownText] = useState<string>("Chọn chiêu để đấu!");
  const [result, setResult] = useState<"win" | "lose" | "draw" | null>(null);
  const [didCheat, setDidCheat] = useState<boolean>(false);
  const [dialogue, setDialogue] = useState<string>(
    "Dám đấu kéo búa bao với Shin-sama không? Thua là phải mua bánh Chocobi cho Shin đấy!"
  );

  // Stats
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [chocobiWon, setChocobiWon] = useState<number>(0);
  const [totalGames, setTotalGames] = useState<number>(0);

  // Load Saved Stats
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBest = localStorage.getItem("shin_janken_best_streak");
      const savedChocobi = localStorage.getItem("shin_janken_chocobi_won");
      if (savedBest) setBestStreak(parseInt(savedBest, 10) || 0);
      if (savedChocobi) setChocobiWon(parseInt(savedChocobi, 10) || 0);
    }
  }, []);

  // Title based on win streak
  const getTitle = () => {
    if (streak >= 10) return "👑 Huyền Thoại Bất Bại Trị Được Shin";
    if (streak >= 7) return "⚡ Siêu Nhân Hành Động Đệ Nhất";
    if (streak >= 5) return "🛡️ Đại Ca Đội Phòng Vệ Kasukabe";
    if (streak >= 3) return "⚔️ Khắc Tinh Của Cu Shin";
    if (streak >= 1) return "🔥 Đang Vào Cầu (On Fire)";
    return "🍼 Tân Binh Phố Kasukabe";
  };

  const handlePlay = (chosenMove: Move) => {
    if (isPlaying) return;

    soundFx.playClickPop();
    setIsPlaying(true);
    setPlayerMove(chosenMove);
    setShinMove(null);
    setResult(null);
    setDidCheat(false);

    // Countdown animation steps
    setCountdownText("JAN...");
    soundFx.playTroubleBoing();

    setTimeout(() => {
      setCountdownText("KEN...");
      soundFx.playTroubleBoing();
    }, 450);

    setTimeout(() => {
      setCountdownText("PON! 💥");

      // Decide Shin's move & Cheat Probability (30% chance to cheat)
      const moves: Move[] = ["rock", "scissors", "paper"];
      const willCheat = Math.random() < 0.32;
      let calculatedShinMove: Move;

      if (willCheat) {
        // Shin cheats to either win or draw!
        setDidCheat(true);
        // Shin picks the move that beats player
        calculatedShinMove = MOVES[chosenMove].losesTo;
        const randomCheatQuote =
          SHIN_QUOTES.cheat[Math.floor(Math.random() * SHIN_QUOTES.cheat.length)] ?? "Shin ăn gian nè!";
        setDialogue(randomCheatQuote);
      } else {
        // Honest random game
        calculatedShinMove = moves[Math.floor(Math.random() * moves.length)] ?? "rock";
      }

      setShinMove(calculatedShinMove);

      // Determine outcome
      if (chosenMove === calculatedShinMove) {
        // Draw
        setResult("draw");
        soundFx.playTroubleBoing();
        if (!willCheat) {
          const q = SHIN_QUOTES.draw[Math.floor(Math.random() * SHIN_QUOTES.draw.length)] ?? "Hòa rồi!";
          setDialogue(q);
        }
      } else if (MOVES[chosenMove].beats === calculatedShinMove) {
        // Player Wins!
        setResult("win");
        soundFx.playSparkleChime();
        setStreak((prev) => {
          const next = prev + 1;
          if (next > bestStreak) {
            setBestStreak(next);
            localStorage.setItem("shin_janken_best_streak", String(next));
          }
          return next;
        });

        setChocobiWon((prev) => {
          const next = prev + 1;
          localStorage.setItem("shin_janken_chocobi_won", String(next));
          return next;
        });

        const q = SHIN_QUOTES.lose[Math.floor(Math.random() * SHIN_QUOTES.lose.length)] ?? "Thua rồi!";
        setDialogue(q);
      } else {
        // Player Loses!
        setResult("lose");
        soundFx.playHitPepper();
        soundFx.playTroubleBoing();
        setStreak(0);

        if (!willCheat) {
          const q = SHIN_QUOTES.win[Math.floor(Math.random() * SHIN_QUOTES.win.length)] ?? "Shin thắng!";
          setDialogue(q);
        }
      }

      setTotalGames((g) => g + 1);
      setIsPlaying(false);
    }, 900);
  };

  const handleReset = () => {
    soundFx.playClickPop();
    setPlayerMove(null);
    setShinMove(null);
    setResult(null);
    setDidCheat(false);
    setCountdownText("Chọn chiêu để đấu!");
    setDialogue("Làm lại ván mới nào! Lần này Shin sẽ không nương tay đâu nhé!");
  };

  return (
    <div className="bg-surface neo-brutalist-border hard-shadow p-4 sm:p-8 max-w-4xl mx-auto space-y-6 select-none">
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-on-background pb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">✌️✊✋</span>
          <div>
            <h2 className="font-display-md text-2xl sm:text-3xl uppercase tracking-wider text-secondary">
              Oẳn Tù Tì với Shin
            </h2>
            <p className="font-caption text-xs font-bold text-on-surface-variant">
              Jankenpon Battle • Coi chừng Shin lật ngón ăn gian!
            </p>
          </div>
        </div>

        {/* Badges / Stats */}
        <div className="flex flex-wrap items-center gap-2">
          <NeoBadge variant="primary" rotate={-2} className="text-xs px-3 py-1 font-mono">
            🔥 STREAK: {streak}
          </NeoBadge>
          <NeoBadge variant="tertiary" rotate={2} className="text-xs px-3 py-1 font-mono">
            🏆 BEST: {bestStreak}
          </NeoBadge>
          <NeoBadge variant="secondary" rotate={0} className="text-xs px-3 py-1 font-mono">
            🍪 CHOCOBI: +{chocobiWon}
          </NeoBadge>
        </div>
      </div>

      {/* Title Rank Banner */}
      <div className="bg-surface-container-high neo-brutalist-border px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-label-bold uppercase">
        <span className="text-on-surface-variant">Danh hiệu hiện tại:</span>
        <span className="text-primary font-bold">{getTitle()}</span>
      </div>

      {/* Main Versus Arena */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
        {/* Left Side: PLAYER */}
        <div className="md:col-span-5 bg-[#f0f9ff] neo-brutalist-border p-5 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="font-display-md text-lg uppercase text-secondary">BẠN (PLAYER)</span>
            <span className="px-2 py-0.5 bg-secondary text-white text-[10px] font-bold rounded neo-brutalist-border">
              THÁCH ĐẤU
            </span>
          </div>

          {/* Player Current Selected Move Box */}
          <div className="w-28 h-28 mx-auto bg-white neo-brutalist-border hard-shadow flex items-center justify-center text-5xl transition-transform duration-200">
            {playerMove ? (
              <span className="animate-in zoom-in-50 duration-150">
                {MOVES[playerMove].emoji}
              </span>
            ) : (
              <span className="text-3xl text-outline opacity-40">❓</span>
            )}
          </div>

          <div className="font-label-bold text-xs uppercase text-on-surface-variant">
            {playerMove ? MOVES[playerMove].label : "CHƯA CHỌN CHIÊU"}
          </div>

          {/* Move Choices Buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {(["scissors", "rock", "paper"] as Move[]).map((m) => {
              const info = MOVES[m];
              const isSelected = playerMove === m;
              return (
                <button
                  key={m}
                  disabled={isPlaying}
                  onClick={() => handlePlay(m)}
                  className={`py-3 px-2 rounded-none neo-brutalist-border font-label-bold text-xs uppercase cursor-pointer select-none transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? "bg-secondary text-white hard-shadow -translate-y-1"
                      : "bg-white text-on-background hover:bg-tertiary-fixed hover:-translate-y-0.5"
                  } ${isPlaying ? "opacity-50 cursor-not-allowed" : "active:translate-y-0.5"}`}
                >
                  <span className="text-2xl">{info.emoji}</span>
                  <span className="text-[11px]">{info.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: VS & Countdown Banner */}
        <div className="md:col-span-1 flex flex-col items-center justify-center py-2">
          <div className="w-12 h-12 bg-primary text-white font-display-md text-xl rounded-full neo-brutalist-border hard-shadow flex items-center justify-center">
            VS
          </div>
        </div>

        {/* Right Side: SHIN-CHAN */}
        <div className="md:col-span-5 bg-[#fff8db] neo-brutalist-border p-5 text-center space-y-4 relative overflow-hidden">
          {didCheat && (
            <div className="absolute top-2 right-2 bg-error text-white text-[10px] font-label-bold px-2 py-0.5 neo-brutalist-border animate-bounce shadow-xs">
              🚨 ĂN GIAN!
            </div>
          )}

          <div className="flex items-center justify-center gap-2">
            <span className="font-display-md text-lg uppercase text-primary">SHIN-CHAN</span>
            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded neo-brutalist-border">
              ĐỐI THỦ
            </span>
          </div>

          {/* Shin-chan Avatar & Move Box */}
          <div className="flex justify-center items-center gap-4">
            {/* Shin Portrait */}
            <div className="w-20 h-20 rounded-full neo-brutalist-border overflow-hidden relative shadow-sm flex-shrink-0 bg-primary">
              <Image
                src="/images/squad-1-a-playful-and-mischievous-5-ye.jpg"
                alt="Shin-chan Opponent"
                fill
                className={`object-cover ${
                  result === "lose"
                    ? "scale-110" // Shin won
                    : result === "win"
                    ? "grayscale" // Shin lost
                    : ""
                }`}
              />
            </div>

            {/* Shin Move Display Box */}
            <div className="w-24 h-24 bg-white neo-brutalist-border hard-shadow flex items-center justify-center text-5xl">
              {isPlaying ? (
                <span className="animate-spin text-3xl">🎲</span>
              ) : shinMove ? (
                <span className="animate-in zoom-in-75 duration-150">
                  {MOVES[shinMove].emoji}
                </span>
              ) : (
                <span className="text-3xl text-outline opacity-40">❓</span>
              )}
            </div>
          </div>

          <div className="font-label-bold text-xs uppercase text-on-surface-variant">
            {isPlaying
              ? "SHIN ĐANG TÍNH CHIÊU..."
              : shinMove
              ? MOVES[shinMove].label
              : "CHỜ BẠN RA CHIÊU"}
          </div>

          {/* Shin Status */}
          <div className="pt-2 text-[11px] font-mono font-bold text-on-surface-variant">
            Tỉ lệ ăn gian: <span className="text-error font-bold">30%</span> (Đổi chiêu phút 89)
          </div>
        </div>
      </div>

      {/* Outcome Banner & Dialogue */}
      <div className="space-y-4">
        {/* Countdown / Result Flash Banner */}
        <div
          className={`py-3 px-4 neo-brutalist-border text-center font-display-md text-lg sm:text-2xl uppercase transition-colors ${
            result === "win"
              ? "bg-secondary text-white hard-shadow"
              : result === "lose"
              ? "bg-primary text-white hard-shadow"
              : result === "draw"
              ? "bg-tertiary-fixed text-on-tertiary-fixed hard-shadow"
              : "bg-surface-container text-on-surface"
          }`}
        >
          {result === "win" && "🎉 BẠN ĐÃ THẮNG SHIN! (+1 BÁNH CHOCOBI 🍪)"}
          {result === "lose" && (
            didCheat
              ? "😱 SHIN ĂN GIAN THẮNG BẠN! MẸ MISAE CỐC ĐẦU BẠN 'CỐC'!"
              : "😭 BẠN ĐÃ THUA CU SHIN! MẸ MISAE CỐC ĐẦU 'CỐC'!"
          )}
          {result === "draw" && "🤝 HÒA NHAU RỒI! (AIKO DESHO!)"}
          {!result && countdownText}
        </div>

        {/* Shin's Comic Dialogue Bubble */}
        <div className="bg-white neo-brutalist-border hard-shadow p-4 relative flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary neo-brutalist-border overflow-hidden flex-shrink-0 relative">
            <Image
              src="/images/squad-1-a-playful-and-mischievous-5-ye.jpg"
              alt="Shin speech"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-label-bold text-xs text-primary uppercase">Shin-chan nói:</span>
              {didCheat && (
                <span className="bg-error text-white font-label-bold text-[9px] px-1.5 py-0.2 rounded neo-brutalist-border uppercase">
                  Vừa lật kèo!
                </span>
              )}
            </div>
            <p className="font-body-md text-sm text-on-background italic">
              &ldquo;{dialogue}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Footer Controls & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t-[2px] border-on-background/20">
        <div className="text-xs text-on-surface-variant font-medium">
          Đã đấu: <strong>{totalGames}</strong> ván • Thưởng: <strong>+{chocobiWon}</strong> Chocobi ⭐
        </div>

        <NeoButton variant="white" size="sm" onClick={handleReset}>
          LÀM VÁN MỚI 🔄
        </NeoButton>
      </div>
    </div>
  );
}
