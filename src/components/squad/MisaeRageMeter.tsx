"use client";

import React, { useState } from "react";
import { soundFx } from "@/lib/audio";

interface RageStage {
  max: number;
  title: string;
  badge: string;
  badgeClass: string;
  icon: string;
  desc: string;
  quoteJp: string;
  punishment: string;
  colorClass: string;
  voice: string;
}

const RAGE_STAGES: RageStage[] = [
  {
    max: 20,
    title: "CẤP 1: MẸ DỊU DÀNG & NHÂN TỪ",
    badge: "AN TOÀN",
    badgeClass: "bg-green-200 text-green-900 border-black",
    icon: "🧘‍♀️",
    desc: '"Shin-chan ngoan nào, mau rửa tay xà phòng rồi vào ăn bữa tối mẹ vừa nấu xong nhé con trai yêu quý!"',
    quoteJp: "しんちゃん、手洗ってご飯食べなさい〜",
    punishment: "Trạng thái: An toàn cho mông Shin",
    colorClass: "from-emerald-500 to-green-500",
    voice: "Shin-chan ngoan nào, mau rửa tay rồi vào ăn tối nha con!",
  },
  {
    max: 45,
    title: "CẤP 2: BẮT ĐẦU NỔI GÂN XANH",
    badge: "CẢNH BÁO",
    badgeClass: "bg-yellow-200 text-yellow-900 border-black",
    icon: "💢",
    desc: '"Thằng bé này lại vứt cặp sách lung tung nữa rồi! Mau dọn ngay cho mẹ, đừng để mẹ phải nói lần thứ hai đấy nhé!"',
    quoteJp: "もう〜！ランドセル投げっぱなしにしないで！",
    punishment: "Cảnh báo: Bắt đầu sưng trán",
    colorClass: "from-yellow-400 to-amber-500",
    voice: "Này Shinnosuke! Mau cất đồ đạc ngay cho mẹ!",
  },
  {
    max: 70,
    title: "CẤP 3: GẦM RA LỬA & BỐC KHÓI ĐẦU",
    badge: "NGUY HIỂM",
    badgeClass: "bg-orange-300 text-orange-900 border-black",
    icon: "🌋",
    desc: '"Không ăn ớt chuông mà lại đòi xem chị gái mặc áo tắm hả?! Shin-chan, mẹ đếm từ 1 đến 3, mau ngồi nghiêm chỉnh lại ngay!"',
    quoteJp: "ピーマン残して水着のお姉さん見たいとか何言ってんの！",
    punishment: "Hình phạt: Chuẩn bị cốc đầu cảnh cáo!",
    colorClass: "from-orange-500 to-red-500",
    voice: "Mẹ đếm từ một đến ba! Mau ăn hết đĩa ớt chuông cho mẹ!",
  },
  {
    max: 90,
    title: "CẤP 4: NẮM ĐẤM XOAY CUỒNG KHAI HỎA",
    badge: "CỰC KỲ KHẨN CẤP",
    badgeClass: "bg-red-400 text-white border-black animate-pulse",
    icon: "🥊🔥",
    desc: '"NẮM ĐẤM XOAY CUỒNG NGHIỀN THÁI DƯƠNG (Guri Guri Attack)! Hôm nay con không được ăn bánh gấu Chocobi nữa!"',
    quoteJp: "グリグリグリ〜ッ！チョコビはお預けよ！！",
    punishment: "Hậu quả: Nghiền thái dương đau điếng!",
    colorClass: "from-red-600 to-red-700",
    voice: "Ăn nắm đấm xoay cuồng này! Hôm nay đừng hòng ăn bánh Chocobi!",
  },
  {
    max: 100,
    title: "CẤP 5: QUỶ DỮ TỨC GIẬN - KASUKABE CHẤN ĐỘNG!",
    badge: "MAX NỘ OVER 9000%",
    badgeClass: "bg-red-600 text-white border-black animate-ping",
    icon: "👹⚡",
    desc: '"SHINNOSUKEÊÊÊÊÊ! HÔM NAY CẢ BỐ VÀ CON ĐỀU PHẢI RA NGOÀI SÂN NGỦ HẾT CHO TÔI! KHÔNG THỂ THA THỨ ĐƯỢC NỮA RỒI!!!"',
    quoteJp: "しんのすけぇぇぇーっ！絶対に許さないわよーっ！！",
    punishment: "Tận thế: Sưng ba cục ổi, nhà bay nóc!",
    colorClass: "from-red-700 to-black",
    voice: "Shinnosuke! Hôm nay mẹ sẽ cho con biết tay!",
  },
];

interface MisaeRageMeterProps {
  onRageChange?: (rage: number) => void;
  onTickerUpdate?: (text: string) => void;
}

export function MisaeRageMeter({ onRageChange, onTickerUpdate }: MisaeRageMeterProps) {
  const [currentRage, setCurrentRage] = useState(0);
  const [pokeCount, setPokeCount] = useState(0);
  const [bumpsCount, setBumpsCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMaxModal, setShowMaxModal] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  // Compute current stage
  let stage = RAGE_STAGES[0];
  for (const s of RAGE_STAGES) {
    if (currentRage <= s.max) {
      stage = s;
      break;
    }
  }
  if (currentRage >= 95) stage = RAGE_STAGES[4];

  // Shin title based on stats
  let shinTitle = "Bé Ngoan Kasukabe";
  if (bumpsCount >= 6) {
    shinTitle = "Vua Lì Đòn Kasukabe";
  } else if (bumpsCount >= 3) {
    shinTitle = "Thánh Chọc Điên Mẹ";
  } else if (pokeCount >= 5) {
    shinTitle = "Chuyên Gia Quậy Phá";
  }

  const handleAddRage = (amount: number, reason: string, voiceQuote: string) => {
    const nextPoke = pokeCount + 1;
    setPokeCount(nextPoke);

    if (soundEnabled) {
      soundFx.playBoingSpringSFX();
    }

    const nextRage = Math.min(100, currentRage + amount);
    setCurrentRage(nextRage);
    if (onRageChange) onRageChange(nextRage);

    const tickerMsg = `🔥 Shin hành động: ${reason} (Nộ khí tăng +${amount}%)`;
    if (onTickerUpdate) onTickerUpdate(tickerMsg);

    if (nextRage >= 100) {
      handleMaxRage();
    } else if (nextRage >= 70 && soundEnabled) {
      soundFx.playAlarmWarningSFX();
    }
  };

  const handleMaxRage = () => {
    const nextBumps = bumpsCount + 1;
    setBumpsCount(nextBumps);
    setShowMaxModal(true);

    // Screen Shake
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 700);

    if (soundEnabled) {
      soundFx.playThunderWhackImpactSFX();
      soundFx.speakVoice("SHINNOSUKE! ĂN NẮM ĐẤM QUAY CUỒNG NÀY!", 1.3, 1.4);
    }

    if (onTickerUpdate) {
      onTickerUpdate("💥 BÁO ĐỘNG ĐỎ: Nộ khí Misae chạm ngưỡng 100%! Chiêu thức 'Guri Guri' đã giáng xuống đầu Shin!");
    }
  };

  const handleCalm = (amount: number) => {
    if (currentRage === 0) {
      if (onTickerUpdate) onTickerUpdate("Mẹ Misae đang hoàn toàn vui vẻ, không cần nịnh thêm!");
      return;
    }

    const nextRage = Math.max(0, currentRage - amount);
    setCurrentRage(nextRage);
    if (onRageChange) onRageChange(nextRage);

    if (soundEnabled) {
      soundFx.playCalmChimeSFX();
      soundFx.speakVoice("Mẹ ơi mẹ xinh đẹp nhất quả đất, cho con ăn bánh chocobi nha!", 1.25, 1.4);
    }

    if (onTickerUpdate) {
      onTickerUpdate(`💖 Shin nịnh: "Mẹ Misae hôm nay trông trẻ đẹp như thiếu nữ 18!" (Nộ khí giảm -${amount}%)`);
    }
  };

  const handleReset = () => {
    setCurrentRage(0);
    setShowMaxModal(false);
    if (onRageChange) onRageChange(0);

    if (soundEnabled) {
      soundFx.playCalmChimeSFX();
    }

    if (onTickerUpdate) {
      onTickerUpdate("Đã làm hòa! Nộ khí Mẹ Misae trở về 0%. Shin hứa ngoan (nhưng sẽ sớm nghịch lại)!");
    }
  };

  return (
    <section
      id="misae-rage-meter-section"
      className={`relative bg-surface border-[3px] border-on-background shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 md:p-8 space-y-6 overflow-hidden ${
        isShaking ? "shake-screen" : ""
      }`}
    >
      {/* Background Warning Flash when rage >= 75% */}
      {currentRage >= 75 && (
        <div
          className="absolute inset-0 bg-red-500/10 pointer-events-none transition-opacity duration-300 z-0 animate-pulse"
          style={{ opacity: currentRage / 100 }}
        />
      )}

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-error text-white rounded-xl border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-3xl">local_fire_department</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display-lg text-xl md:text-2xl uppercase italic text-on-background">
                MÁY ĐO NỘ KHÍ MẸ MISAE
              </h2>
              <span className="hidden sm:inline-block bg-yellow-300 text-black border-2 border-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                Interactive Minigame
              </span>
            </div>
            <p className="text-xs md:text-sm text-on-surface-variant font-medium">
              Chọc giận mẹ Misae và quan sát các cấp độ biến hình đáng sợ nhất Kasukabe!
            </p>
          </div>
        </div>

        {/* Status Badges & Sound Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white border-2 border-black px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span>Chọc: <strong className="text-primary">{pokeCount}</strong></span>
            <span>|</span>
            <span>U đầu: <strong className="text-error">{bumpsCount} 🥊</strong></span>
          </div>

          <div className="bg-yellow-200 border-2 border-black px-3 py-1 rounded-lg text-xs font-label-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            🏆 <span>{shinTitle}</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-3 py-1 border-2 border-black rounded-lg text-xs font-label-bold flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all ${
              soundEnabled ? "bg-primary text-white" : "bg-neutral-200 text-neutral-600"
            }`}
            title="Bật/Tắt âm thanh hiệu ứng"
          >
            <span className="material-symbols-outlined text-sm">
              {soundEnabled ? "volume_up" : "volume_off"}
            </span>
            <span>{soundEnabled ? "SFX: BẬT" : "SFX: TẮT"}</span>
          </button>
        </div>
      </div>

      {/* Main Meter Grid: Visual Thermometer + Shin Actions */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Gauge & Current Stage Details (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container border-[3px] border-black p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          {/* Progress Bar & Percentage Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs md:text-sm font-label-bold">
              <span className="uppercase flex items-center gap-1.5">
                <span>Nồng độ giận dữ:</span>
                <span className={`text-[11px] font-label-bold border-2 px-2 py-0.5 rounded shadow-[1px_1px_0px_#000] ${stage.badgeClass}`}>
                  {stage.badge}
                </span>
              </span>
              <span className={`font-mono text-xl font-black ${currentRage >= 80 ? "text-red-600 animate-pulse" : "text-black"}`}>
                {currentRage}%
              </span>
            </div>

            {/* Thick Comic Gauge */}
            <div className={`h-8 bg-white border-[3px] border-black rounded-full overflow-hidden p-1 shadow-inner relative ${currentRage >= 90 ? "gauge-fire" : ""}`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out flex items-center justify-end pr-2 text-white font-mono text-xs font-bold ${
                  currentRage >= 85
                    ? "bg-gradient-to-r from-orange-500 via-red-600 to-black danger-stripe"
                    : currentRage >= 50
                    ? "bg-gradient-to-r from-yellow-400 to-red-500 comic-hatch"
                    : "bg-gradient-to-r from-emerald-400 to-green-500"
                }`}
                style={{ width: `${Math.min(100, Math.max(6, currentRage))}%` }}
              >
                {currentRage >= 15 && <span>{currentRage}%</span>}
              </div>
            </div>

            {/* Gauge Marks */}
            <div className="flex justify-between text-[10px] font-mono text-neutral-500 px-1 font-bold">
              <span>0% (Bình yên)</span>
              <span>25% (Nhăn mặt)</span>
              <span>50% (Bốc khói)</span>
              <span>75% (Gầm thét)</span>
              <span>100% (Tận thế)</span>
            </div>
          </div>

          {/* Current Stage Card */}
          <div className="bg-white border-2 border-black p-4 rounded-xl space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between gap-2 border-b border-neutral-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{stage.icon}</span>
                <h3 className="font-headline-sm text-sm md:text-base font-black text-error uppercase">
                  {stage.title}
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold bg-neutral-100 border border-black px-2 py-0.5 rounded">
                {stage.punishment}
              </span>
            </div>

            <p className="font-body-md text-xs md:text-sm text-neutral-800 italic leading-relaxed">
              {stage.desc}
            </p>
            <p className="text-[11px] font-mono text-neutral-500">
              🇯🇵 {stage.quoteJp}
            </p>
          </div>
        </div>

        {/* Right Column: Shin-chan Mischief Triggers (5 cols) */}
        <div className="lg:col-span-5 bg-white border-[3px] border-black p-5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <h3 className="font-label-bold text-xs md:text-sm uppercase flex items-center gap-1.5 text-on-background">
              <span>HÀNH ĐỘNG CỦA SHIN-CHAN:</span>
            </h3>
            <span className="text-[10px] font-bold bg-neutral-200 px-1.5 py-0.5 rounded">
              Bấm để chọc
            </span>
          </div>

          {/* Action Buttons List */}
          <div className="space-y-2">
            {/* Action 1 */}
            <button
              onClick={() => handleAddRage(15, 'Shin nhảy điệu lắc mông "Buri-Buri" trước mặt mẹ', "Buri buri buri~")}
              className="w-full text-left bg-surface hover:bg-yellow-100 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:scale-125 transition-transform">🍑</span>
                <div>
                  <div className="font-label-bold text-xs md:text-sm text-black group-hover:text-primary">
                    Lắc mông "Buri-Buri" trêu mẹ
                  </div>
                  <div className="text-[10px] text-neutral-500">Khoe mông đào tròn xoe trơ trẽn</div>
                </div>
              </div>
              <span className="bg-yellow-200 text-black border border-black px-2 py-0.5 rounded font-mono font-bold text-xs">
                +15%
              </span>
            </button>

            {/* Action 2 */}
            <button
              onClick={() => handleAddRage(20, "Giấu đĩa ớt chuông xuống gầm bàn", "Con ghét ớt chuông lắm!")}
              className="w-full text-left bg-surface hover:bg-yellow-100 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:scale-125 transition-transform">🫑</span>
                <div>
                  <div className="font-label-bold text-xs md:text-sm text-black group-hover:text-primary">
                    Giấu đĩa ớt chuông xuống gầm bàn
                  </div>
                  <div className="text-[10px] text-neutral-500">Chê ỏng chê eo món mẹ kì công nấu</div>
                </div>
              </div>
              <span className="bg-orange-200 text-orange-950 border border-black px-2 py-0.5 rounded font-mono font-bold text-xs">
                +20%
              </span>
            </button>

            {/* Action 3 */}
            <button
              onClick={() => handleAddRage(25, "Lấy son Chanel đắt tiền vẽ râu mèo lên mặt", "Mẹ nhìn con đẹp trai chưa này!")}
              className="w-full text-left bg-surface hover:bg-red-50 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:scale-125 transition-transform">💄</span>
                <div>
                  <div className="font-label-bold text-xs md:text-sm text-black group-hover:text-primary">
                    Lấy son Chanel vẽ râu mèo
                  </div>
                  <div className="text-[10px] text-neutral-500">Thỏi son mẹ nhịn ăn 3 tháng mới mua</div>
                </div>
              </div>
              <span className="bg-red-200 text-red-950 border border-black px-2 py-0.5 rounded font-mono font-bold text-xs">
                +25%
              </span>
            </button>

            {/* Action 4 */}
            <button
              onClick={() => handleAddRage(15, "Quên dọn đồ chơi xém mẹ vấp ngã", "Đồ chơi rải đầy phòng khách")}
              className="w-full text-left bg-surface hover:bg-yellow-100 border-2 border-black p-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:scale-125 transition-transform">🤖</span>
                <div>
                  <div className="font-label-bold text-xs md:text-sm text-black group-hover:text-primary">
                    Quên dọn đồ chơi xém mẹ ngã!
                  </div>
                  <div className="text-[10px] text-neutral-500">Misae giẫm trúng chân gấu quái vật</div>
                </div>
              </div>
              <span className="bg-yellow-200 text-black border border-black px-2 py-0.5 rounded font-mono font-bold text-xs">
                +15%
              </span>
            </button>

            {/* Action 5 - DANGER NUKE */}
            <button
              onClick={() => handleAddRage(40, 'Nói hớ: "Bà thím béo 3 ngấn mỡ!"', "CÂM MIỆNG LẠI THẰNG BÉ KIA! MẸ ĐANG ĂN KIÊNG MÀ!")}
              className="w-full text-left bg-red-100 hover:bg-red-200 border-[3px] border-primary p-2.5 rounded-xl shadow-[3px_3px_0px_0px_#930007] hover:shadow-[1px_1px_0px_0px_#930007] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:scale-125 transition-transform">💣</span>
                <div>
                  <div className="font-label-bold text-xs md:text-sm text-primary font-black flex items-center gap-1">
                    <span>Nói hớ: "Bà thím béo 3 ngấn mỡ!"</span>
                    <span className="bg-red-600 text-white text-[9px] px-1 rounded uppercase">Chí mạng</span>
                  </div>
                  <div className="text-[10px] text-red-900 font-bold">Chạm trúng nỗi đau giảm cân thất bại!</div>
                </div>
              </div>
              <span className="bg-red-600 text-white border-2 border-black px-2 py-0.5 rounded font-mono font-black text-xs">
                +40% 🔥
              </span>
            </button>
          </div>

          {/* Calm down & Kiss-up buttons */}
          <div className="pt-2 border-t-2 border-dashed border-black flex gap-2">
            <button
              onClick={() => handleCalm(30)}
              className="flex-1 bg-secondary-fixed hover:bg-secondary text-on-secondary-fixed hover:text-white border-2 border-black p-2 rounded-lg font-label-bold text-xs uppercase flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-base">sentiment_very_satisfied</span>
              <span>Khen Mẹ Hoa Hậu (-30%)</span>
            </button>
            <button
              onClick={handleReset}
              className="bg-white hover:bg-neutral-100 border-2 border-black p-2 rounded-lg font-label-bold text-xs uppercase flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-base">cleaning_services</span>
              <span>Hứa Ngoan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Max Rage Alert Modal (Chiêu thức Guri Guri) */}
      {showMaxModal && (
        <div className="relative z-20 border-[4px] border-black bg-yellow-400 p-5 rounded-2xl shadow-[8px_8px_0px_0px_#000] danger-stripe overflow-hidden animate-bounce-short">
          <div className="bg-white border-[3px] border-black p-5 rounded-xl space-y-3 relative z-10">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-2 text-error">
                <span className="material-symbols-outlined text-3xl font-black animate-spin">electric_bolt</span>
                <h3 className="font-display-lg text-lg md:text-xl uppercase italic text-error">
                  🚨 BÁO ĐỘNG ĐỎ KASUKABE: NỘ KHÍ VƯỢT MỨC 100%!
                </h3>
              </div>
              <button
                onClick={() => setShowMaxModal(false)}
                className="bg-black text-white px-3 py-1 font-bold text-xs rounded border border-black hover:bg-neutral-800"
              >
                ĐÓNG ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 space-y-2">
                <p className="font-headline-sm text-sm md:text-base text-red-600 uppercase font-black">
                  🥊 CHIÊU THỨC KHAI HỎA: "NẮM ĐẤM XOAY CUỒNG NGHIỀN THÁI DƯƠNG!"
                </p>
                <p className="font-body-md text-xs md:text-sm text-neutral-800">
                  Shin-chan đã thành công chọc giận mẹ Misae tới đỉnh điểm! Cả khu phố Futaba rung chuyển dữ dội. Shin đã lĩnh trọn ba cục ổi to tướng trên đầu!
                </p>
                <div className="inline-block bg-yellow-200 border-2 border-black px-3 py-1 rounded font-label-bold text-xs text-black">
                  🏆 Danh hiệu mới mở khóa: <strong className="text-primary font-black">"{shinTitle}"</strong>
                </div>
              </div>
              <div className="text-center p-3 bg-red-100 border-2 border-black rounded-xl space-y-2">
                <div className="text-4xl animate-bounce">⚡🥊⚡</div>
                <div className="font-mono text-[11px] font-bold text-red-800">SÁT THƯƠNG: OVER 9000</div>
                <button
                  onClick={handleReset}
                  className="w-full bg-error text-white font-label-bold text-xs py-2 border-2 border-black uppercase shadow-[2px_2px_0px_#000] hover:bg-red-700 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Băng bó đầu Shin &amp; Chơi lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
