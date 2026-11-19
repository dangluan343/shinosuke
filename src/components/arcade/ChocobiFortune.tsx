"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { soundFx } from "@/lib/audio";
import { NeoBadge } from "@/components/ui/NeoBadge";
import { NeoButton } from "@/components/ui/NeoButton";
import { Sparkles, Download, Copy, Check, RotateCcw, History, Star, Heart, Flame } from "lucide-react";

export interface FortuneCardData {
  id: string;
  character: string;
  avatar: string;
  role: string;
  quoteVi: string;
  quoteJa: string;
  quoteRomaji: string;
  mischief: number; // 0-100
  snackLuck: number; // 0-100
  romance: number; // 0-100
  luckyNumber: number;
  luckySnack: string;
  themeColor: string;
  accentBg: string;
}

const FORTUNE_CARDS: FortuneCardData[] = [
  // 1-5: Shin-chan
  {
    id: "shin-1",
    character: "Shin-chan (Shinnosuke)",
    avatar: "🍑",
    role: "Đại Ca Kasukabe 5 Tuổi",
    quoteVi: "Ăn ớt chuông không chết được đâu, nhưng ăn bánh Chocobi thì trường sinh bất lão!",
    quoteJa: "ピーマン食べなくても死なないゾ！チョコビ最高！",
    quoteRomaji: "Piiman tabenakute mo shinanai zo! Chocobi saikou!",
    mischief: 99,
    snackLuck: 98,
    romance: 85,
    luckyNumber: 5,
    luckySnack: "Bánh Chocobi Hoàng Gia",
    themeColor: "bg-[#b7000c] text-white",
    accentBg: "#ffdad5",
  },
  {
    id: "shin-2",
    character: "Shin-chan (Shinnosuke)",
    avatar: "😘",
    role: "Chuyên Gia Ghẹo Chị Gái",
    quoteVi: "Hôm nay nếu gặp chị gái xinh đẹp, nhớ hỏi: 'Chị có thích ăn ớt chuông với Shin không?'",
    quoteJa: "きれいなおねいさん、オラとピーマン食べる？",
    quoteRomaji: "Kirei na oneesan, ora to piiman taberu?",
    mischief: 95,
    snackLuck: 90,
    romance: 99,
    luckyNumber: 18,
    luckySnack: "Bánh pudding dâu tây",
    themeColor: "bg-[#ec4899] text-white",
    accentBg: "#fce7f3",
  },
  {
    id: "shin-3",
    character: "Shin-chan (Shinnosuke)",
    avatar: "🍑",
    role: "Vũ Công Mông Buri Buri",
    quoteVi: "Lắc mông Buri Buri 3 lần trước khi làm việc khó, kết quả chưa biết nhưng mông sẽ rất khỏe!",
    quoteJa: "ぶりぶりざえもん参上だゾ！",
    quoteRomaji: "Buri Buri Zaemon sanjou da zo!",
    mischief: 100,
    snackLuck: 82,
    romance: 60,
    luckyNumber: 7,
    luckySnack: "Bánh bao nhân thịt nóng hổi",
    themeColor: "bg-[#f4e700] text-[#1e1b18]",
    accentBg: "#fef08a",
  },
  {
    id: "shin-4",
    character: "Shin-chan (Shinnosuke)",
    avatar: "🤪",
    role: "Bậc Thầy Chữa Ngại",
    quoteVi: "Cuộc đời ngắn ngủi lắm, thích ai thì cứ lại gần vẫy tay toe toét... rồi chạy mất hút!",
    quoteJa: "オラ、恥ずかしいゾ〜",
    quoteRomaji: "Ora, hazukashii zo~",
    mischief: 92,
    snackLuck: 86,
    romance: 92,
    luckyNumber: 23,
    luckySnack: "Bánh quy sôcôla Chocobi",
    themeColor: "bg-[#0b5eaf] text-white",
    accentBg: "#dbeafe",
  },
  {
    id: "shin-5",
    character: "Shin-chan (Shinnosuke)",
    avatar: "😴",
    role: "Triết Gia Ngủ Ngày",
    quoteVi: "Người lớn lúc nào cũng bảo Shin lười, nhưng Shin bận ngủ ngày để lớn nhanh mà lị!",
    quoteJa: "寝る子は育つって言うゾ〜",
    quoteRomaji: "Neru ko wa sodatsu tte iu zo~",
    mischief: 88,
    snackLuck: 94,
    romance: 55,
    luckyNumber: 55,
    luckySnack: "Sữa chua dâu hút một hơi",
    themeColor: "bg-[#2d7f36] text-white",
    accentBg: "#dcfce7",
  },

  // 6-9: Misae Nohara
  {
    id: "misae-1",
    character: "Mẹ Misae",
    avatar: "😡",
    role: "Nóc Nhà Kasukabe",
    quoteVi: "Bớt bày bừa lại và mau đi dọn phòng! Nếu không cục u trên đầu hôm nay sẽ cao thêm 5 phân!",
    quoteJa: "散らかすな！早く部屋を片付けなさい！",
    quoteRomaji: "Chirakasuna! Hayaku heya wo katadukenasai!",
    mischief: 12,
    snackLuck: 35,
    romance: 45,
    luckyNumber: 3,
    luckySnack: "Rau cải luộc không muối",
    themeColor: "bg-[#e60012] text-white",
    accentBg: "#fee2e2",
  },
  {
    id: "misae-2",
    character: "Mẹ Misae",
    avatar: "🥬",
    role: "Chiến Thần Săn Sale Siêu Thị",
    quoteVi: "Khung giờ vàng giảm giá 50% là chiến trường sinh tử! Ai chần chừ kẻ đó mất bắp cải rẻ!",
    quoteJa: "タイムセールは女の戦場よ！",
    quoteRomaji: "Taimu seeru wa onna no senjou yo!",
    mischief: 30,
    snackLuck: 75,
    romance: 40,
    luckyNumber: 88,
    luckySnack: "Bắp cải siêu giảm giá",
    themeColor: "bg-[#f59e0b] text-[#1e1b18]",
    accentBg: "#fef3c7",
  },
  {
    id: "misae-3",
    character: "Mẹ Misae",
    avatar: "💰",
    role: "Kho Quỹ Đen Bí Mật",
    quoteVi: "Tiền tiết kiệm vừa cất kỹ sau hũ trà... cầu trời hai bố con Shin đừng lục lọi trúng!",
    quoteJa: "へそくりが見つかりませんように…",
    quoteRomaji: "Hesokuri ga mitsukarimasen you ni...",
    mischief: 45,
    snackLuck: 60,
    romance: 50,
    luckyNumber: 99,
    luckySnack: "Trà thảo mộc giảm béo",
    themeColor: "bg-[#06b6d4] text-white",
    accentBg: "#cffafe",
  },
  {
    id: "misae-4",
    character: "Mẹ Misae",
    avatar: "💃",
    role: "Hội Viên Ăn Kiêng Nửa Vời",
    quoteVi: "Hôm nay quyết tâm tập thể dục giảm mỡ bụng... nhưng chiều lại làm hết 2 que kem vani!",
    quoteJa: "明日から本気でダイエットよ！",
    quoteRomaji: "Ashita kara honki de daietto yo!",
    mischief: 38,
    snackLuck: 88,
    romance: 68,
    luckyNumber: 21,
    luckySnack: "Kem ốc quế trà xanh",
    themeColor: "bg-[#8b5cf6] text-white",
    accentBg: "#ede9fe",
  },

  // 10-12: Hiroshi Nohara
  {
    id: "hiroshi-1",
    character: "Bố Hiroshi",
    avatar: "🧦",
    role: "Vũ Khí Sinh Học Tất Chân",
    quoteVi: "Tất chân của bố có mùi nồng nặc là vì bố đã dốc hết tâm huyết cày cuốc vì gia đình!",
    quoteJa: "父ちゃんの靴下は無敵だ！",
    quoteRomaji: "Tou-chan no kutsushita wa muteki da!",
    mischief: 50,
    snackLuck: 65,
    romance: 35,
    luckyNumber: 35,
    luckySnack: "Bia tươi lạnh & đậu nành edamame",
    themeColor: "bg-[#475569] text-white",
    accentBg: "#f1f5f9",
  },
  {
    id: "hiroshi-2",
    character: "Bố Hiroshi",
    avatar: "🍺",
    role: "Con Nợ Trả Góp 32 Năm",
    quoteVi: "Tiền nợ nhà còn đúng 32 năm nữa... nhưng tan ca hôm nay cứ làm một ly bia lạnh giải sầu đã!",
    quoteJa: "住宅ローンあと32年…生きてやる！",
    quoteRomaji: "Juutaku roon ato 32-nen... ikite yaru!",
    mischief: 35,
    snackLuck: 78,
    romance: 70,
    luckyNumber: 32,
    luckySnack: "Mực nướng xiên que thơm lừng",
    themeColor: "bg-[#d97706] text-white",
    accentBg: "#fef3c7",
  },
  {
    id: "hiroshi-3",
    character: "Bố Hiroshi",
    avatar: "💼",
    role: "Salaryman Cần Mẫn",
    quoteVi: "Người đàn ông chân chính không sợ tăng ca với sếp, chỉ sợ về nhà bị vợ tịch thu ví tiền!",
    quoteJa: "お小遣いアップしてくれ〜",
    quoteRomaji: "Okozukai appu shite kure~",
    mischief: 40,
    snackLuck: 68,
    romance: 58,
    luckyNumber: 10,
    luckySnack: "Cơm hộp bento giảm giá 30%",
    themeColor: "bg-[#0284c7] text-white",
    accentBg: "#e0f2fe",
  },

  // 13-15: Himawari Nohara
  {
    id: "hima-1",
    character: "Bé Himawari",
    avatar: "💎",
    role: "Thánh Nghiện Kim Cương & Trai Đẹp",
    quoteVi: "Thứ lấp lánh như hột xoàn và các anh chàng siêu đẹp trai mới là lẽ sống của đời em!",
    quoteJa: "キラキラ〜イケメン〜最高！",
    quoteRomaji: "Kira kira~ Ikemen~ saikou!",
    mischief: 96,
    snackLuck: 96,
    romance: 100,
    luckyNumber: 1,
    luckySnack: "Kẹo thạch hoa quả ánh vàng",
    themeColor: "bg-[#ec4899] text-white",
    accentBg: "#fce7f3",
  },
  {
    id: "hima-2",
    character: "Bé Himawari",
    avatar: "🍼",
    role: "Tay Đua Bò Siêu Tốc",
    quoteVi: "Ta-ta! Bò thật nhanh để chộp lấy chuỗi ngọc trai của mẹ trước khi bị anh hai cản đường!",
    quoteJa: "たいやき〜だゾ！キャッキャッ！",
    quoteRomaji: "Taiyaki~ da zo! Kyakya!",
    mischief: 90,
    snackLuck: 89,
    romance: 92,
    luckyNumber: 9,
    luckySnack: "Bánh bông lan trứng sữa mềm tan",
    themeColor: "bg-[#f59e0b] text-[#1e1b18]",
    accentBg: "#fef3c7",
  },
  {
    id: "hima-3",
    character: "Bé Himawari",
    avatar: "👶",
    role: "Tiểu Quỷ Lắm Chiêu",
    quoteVi: "Đừng tưởng em bé là dễ dụ! Đưa lắc tay vàng sáng choang đây rồi em cho ôm một cái!",
    quoteJa: "うきゃきゃ〜ダイヤちょうだい！",
    quoteRomaji: "Ukyakya~ daiya choudai!",
    mischief: 85,
    snackLuck: 92,
    romance: 95,
    luckyNumber: 77,
    luckySnack: "Sữa bột cao cấp đóng hộp",
    themeColor: "bg-[#b7000c] text-white",
    accentBg: "#fee2e2",
  },

  // 16-18: Shiro
  {
    id: "shiro-1",
    character: "Bạch Tuyết (Shiro)",
    avatar: "🐶",
    role: "Cục Bông Thông Minh Nhất Nhà",
    quoteVi: "Gâu gâu! (Dịch: Cậu chủ Shin lại mải xem TV quên cho tôi ăn rồi, ai qua cứu đói tôi với!)",
    quoteJa: "ワンワン！ご飯まだですか？",
    quoteRomaji: "Wan wan! Gohan mada desu ka?",
    mischief: 15,
    snackLuck: 42,
    romance: 50,
    luckyNumber: 4,
    luckySnack: "Thịt viên hầm mềm cho cún cưng",
    themeColor: "bg-[#ffffff] text-[#1e1b18]",
    accentBg: "#f8fafc",
  },
  {
    id: "shiro-2",
    character: "Bạch Tuyết (Shiro)",
    avatar: "☁️",
    role: "Kẹo Bông Gòn Tròn Vo",
    quoteVi: "Cuộn tròn thành cục kẹo bông gòn là kỹ năng sinh tồn tối thượng để trốn đi dạo trời mưa.",
    quoteJa: "わたあめ〜丸くなるワン！",
    quoteRomaji: "Wata ame~ maruku naru wan!",
    mischief: 20,
    snackLuck: 72,
    romance: 82,
    luckyNumber: 11,
    luckySnack: "Bánh quy giòn hình xương thơm lừng",
    themeColor: "bg-[#0284c7] text-white",
    accentBg: "#e0f2fe",
  },
  {
    id: "shiro-3",
    character: "Bạch Tuyết (Shiro)",
    avatar: "🐾",
    role: "Bảo Vệ Trung Thành Thầm Lặng",
    quoteVi: "Sống ở nhà Nohara đòi hỏi sự kiên nhẫn gấp 10 lần những chú cún bình thường khác!",
    quoteJa: "散歩に連れてってほしいワン…",
    quoteRomaji: "Sanpo ni tsuretette hoshii wan...",
    mischief: 10,
    snackLuck: 62,
    romance: 65,
    luckyNumber: 6,
    luckySnack: "Xúc xích dinh dưỡng Shiro",
    themeColor: "bg-[#2d7f36] text-white",
    accentBg: "#dcfce7",
  },

  // 19-21: Kazama
  {
    id: "kazama-1",
    character: "Kazama Tooru",
    avatar: "🎓",
    role: "Thiếu Gia Tinh Hoa Kasukabe",
    quoteVi: "Tôi là đứa trẻ ưu tú học trường chuyên, không đời nào dính vào mấy trò con bò của Shin... Ơ đừng thổi tai tôi!",
    quoteJa: "風間くんだ！エリートなんだぞ！",
    quoteRomaji: "Kazama-kun da! Eriito nan da zo!",
    mischief: 32,
    snackLuck: 72,
    romance: 66,
    luckyNumber: 100,
    luckySnack: "Bánh Macaron hương quả mọng Pháp",
    themeColor: "bg-[#0b5eaf] text-white",
    accentBg: "#dbeafe",
  },
  {
    id: "kazama-2",
    character: "Kazama Tooru",
    avatar: "🎀",
    role: "Fan Bí Mật Của Moe-P",
    quoteVi: "Thực ra trong cặp tôi giấu đầy huy hiệu Maho Shoujo Moe-P... Tuyệt đối đừng ai hé răng nhé!",
    quoteJa: "もえP大好きなんて絶対秘密だ！",
    quoteRomaji: "Moe-P daisuki nante zettai himitsu da!",
    mischief: 42,
    snackLuck: 68,
    romance: 88,
    luckyNumber: 42,
    luckySnack: "Kẹo dẻo phép thuật Moe-P",
    themeColor: "bg-[#ec4899] text-white",
    accentBg: "#fce7f3",
  },
  {
    id: "kazama-3",
    character: "Kazama Tooru",
    avatar: "📚",
    role: "Học Bá Bận Rộn",
    quoteVi: "Lịch trình hôm nay: Học thêm tiếng Anh, làm toán nâng cao... và giữ khoảng cách an toàn với Shinnosuke!",
    quoteJa: "塾の宿題が終わらないんだ！",
    quoteRomaji: "Juku no shukudai ga owaranai n da!",
    mischief: 22,
    snackLuck: 58,
    romance: 62,
    luckyNumber: 14,
    luckySnack: "Sandwich bò nướng hảo hạng",
    themeColor: "bg-[#475569] text-white",
    accentBg: "#f1f5f9",
  },

  // 22-24: Nene-chan
  {
    id: "nene-1",
    character: "Sakurada Nene",
    avatar: "👧",
    role: "Đạo Diễn Gia Đình Thực Tế",
    quoteVi: "Nào các bạn, hôm nay chúng ta lại chơi 'Gia đình thực tế đau thương tập 400': Chồng thất nghiệp, vợ nợ tiền!",
    quoteJa: "リアルおままごと始まるわよ！",
    quoteRomaji: "Riaru omamagoto hajimaru wa yo!",
    mischief: 86,
    snackLuck: 62,
    romance: 92,
    luckyNumber: 8,
    luckySnack: "Bánh crepe dâu tây kem sữa",
    themeColor: "bg-[#f43f5e] text-white",
    accentBg: "#ffe4e6",
  },
  {
    id: "nene-2",
    character: "Sakurada Nene",
    avatar: "🐰",
    role: "Quyền Vương Thỏ Bông",
    quoteVi: "Mỗi khi bực tức chuyện gì trong lòng, cứ dắt chú thỏ bông ra góc tối và tung liên hoàn quyền!",
    quoteJa: "ウサギさん、ごめんなさい！えいっ！",
    quoteRomaji: "Usagi-san, gomen nasai! Ei!",
    mischief: 92,
    snackLuck: 48,
    romance: 52,
    luckyNumber: 44,
    luckySnack: "Nước ép cam chua cay sảng khoái",
    themeColor: "bg-[#b7000c] text-white",
    accentBg: "#fee2e2",
  },
  {
    id: "nene-3",
    character: "Sakurada Nene",
    avatar: "💔",
    role: "Nữ Hoàng Phim Truyền Hình",
    quoteVi: "Tình yêu đích thực là phải kịch tính, giằng xé và đầy drama như phim truyền hình mẹ hay xem lúc 8 giờ tối!",
    quoteJa: "愛は修羅場なのよ！ドラマよ！",
    quoteRomaji: "Ai wa shuraba na no yo! Dorama yo!",
    mischief: 78,
    snackLuck: 76,
    romance: 96,
    luckyNumber: 27,
    luckySnack: "Bánh kem socola trái tim",
    themeColor: "bg-[#a855f7] text-white",
    accentBg: "#f3e8ff",
  },

  // 25-27: Bo-chan
  {
    id: "bo-1",
    character: "Bo-chan",
    avatar: "👃",
    role: "Bậc Thầy Nước Mũi Xoay Vần",
    quoteVi: "Nước mũi của Bo-chan không phải chất nhầy tầm thường... đó là con quay la bàn định hướng không gian!",
    quoteJa: "ボーちゃん、鼻水名人…くるくる…",
    quoteRomaji: "Boo-chan, hanamizu meijin... kurukuru...",
    mischief: 52,
    snackLuck: 82,
    romance: 42,
    luckyNumber: 33,
    luckySnack: "Bánh gạo nướng xì dầu giòn rụm",
    themeColor: "bg-[#06b6d4] text-white",
    accentBg: "#cffafe",
  },
  {
    id: "bo-2",
    character: "Bo-chan",
    avatar: "🪨",
    role: "Nhà Thám Hiểm Đá Cổ",
    quoteVi: "Hòn đá nhặt được bên vệ đường sáng nay có hình dáng hệt chiếc phi thuyền vũ trụ... Thật kỳ diệu.",
    quoteJa: "珍しい石を見つけた…宝物…",
    quoteRomaji: "Mezurashii ishi wo mitsuketa... takaramono...",
    mischief: 18,
    snackLuck: 92,
    romance: 32,
    luckyNumber: 66,
    luckySnack: "Khoai lang nướng than hoa mật ngọt",
    themeColor: "bg-[#64748b] text-white",
    accentBg: "#f1f5f9",
  },
  {
    id: "bo-3",
    character: "Bo-chan",
    avatar: "🧘",
    role: "Triết Nhân Kasukabe",
    quoteVi: "Im lặng là vàng, quan sát là bạc, và nước mũi nhỏ một giọt chuẩn xác là tác phẩm nghệ thuật.",
    quoteJa: "ふしぎな石…世界は広い…",
    quoteRomaji: "Fushigi na ishi... sekai wa hiroi...",
    mischief: 26,
    snackLuck: 86,
    romance: 36,
    luckyNumber: 80,
    luckySnack: "Bánh mì hạt óc chó bùi bùi",
    themeColor: "bg-[#2d7f36] text-white",
    accentBg: "#dcfce7",
  },

  // 28-30: Masao
  {
    id: "masao-1",
    character: "Satou Masao",
    avatar: "🍙",
    role: "Nắm Cơm Nhút Nhát",
    quoteVi: "Á á á! Shin lại lôi mình vào rắc rối nữa rồi! Đừng gọi tớ là Cơm Nắm Di Động nữa mà!",
    quoteJa: "ひいい〜！オニギリって言わないで！",
    quoteRomaji: "Hiiii~! Onigiri tte iwanaide!",
    mischief: 12,
    snackLuck: 52,
    romance: 32,
    luckyNumber: 2,
    luckySnack: "Cơm nắm Onigiri cá ngừ sốt mayo",
    themeColor: "bg-[#22c55e] text-[#1e1b18]",
    accentBg: "#dcfce7",
  },
  {
    id: "masao-2",
    character: "Satou Masao",
    avatar: "💌",
    role: "Trái Tim Yêu Đơn Phương",
    quoteVi: "Hôm nay định dũng cảm gửi thư tình cho tiểu thư Ai-chan... Ơ kìa, bạn ấy lại chạy sang ôm Shin rồi!",
    quoteJa: "ボクだって勇気があるんだ！愛ちゃん…",
    quoteRomaji: "Boku datte yuuki ga arun da! Ai-chan...",
    mischief: 16,
    snackLuck: 62,
    romance: 22,
    luckyNumber: 13,
    luckySnack: "Bánh su kem vani béo ngậy",
    themeColor: "bg-[#eab308] text-[#1e1b18]",
    accentBg: "#fef9c3",
  },
  {
    id: "masao-3",
    character: "Satou Masao",
    avatar: "💧",
    role: "Chiến Binh Mít Ướt",
    quoteVi: "Tuy đầu tôi tròn như quả dưa chuột và rất hay khóc, nhưng khi đồng đội gặp nạn tôi sẽ không bỏ chạy!",
    quoteJa: "強くなりたいよ〜かすかべ防衛隊！",
    quoteRomaji: "Tsuyoku naritai yo~ Kasukabe Boueitai!",
    mischief: 8,
    snackLuck: 71,
    romance: 42,
    luckyNumber: 50,
    luckySnack: "Bánh bông lan phô mai núng nính",
    themeColor: "bg-[#14b8a6] text-white",
    accentBg: "#ccfbf1",
  },

  // 31-32: Action Mask
  {
    id: "action-1",
    character: "Action Mask (Siêu Nhân)",
    avatar: "⚡",
    role: "Thần Tượng Công Lý Số 1",
    quoteVi: "Wahaha! Chính nghĩa luôn luôn chiến thắng! Hãy nạp đầy bánh Chocobi và tung Action Beam tiêu diệt cái xấu!",
    quoteJa: "アクションビーム！正義は勝つ！ワハハ！",
    quoteRomaji: "Action Biimu! Seigi wa katsu! Wahaha!",
    mischief: 62,
    snackLuck: 96,
    romance: 76,
    luckyNumber: 1,
    luckySnack: "Thanh năng lượng sôcôla Action",
    themeColor: "bg-[#b7000c] text-white",
    accentBg: "#fee2e2",
  },
  {
    id: "action-2",
    character: "Action Mask (Siêu Nhân)",
    avatar: "🦸",
    role: "Sứ Giả Bảo Vệ Trái Đất",
    quoteVi: "Hỡi các thiếu nhi Kasukabe dũng cảm! Không bao giờ được khuất phục trước quái vật và đống bài tập về nhà!",
    quoteJa: "負けるな子供たち！明日も地球を守るぞ！",
    quoteRomaji: "Makeruna kodomotachi! Ashita mo chikyuu wo mamoru zo!",
    mischief: 48,
    snackLuck: 91,
    romance: 72,
    luckyNumber: 77,
    luckySnack: "Bánh quy siêu nhân giòn tan số một",
    themeColor: "bg-[#0b5eaf] text-white",
    accentBg: "#dbeafe",
  },

  // 33: Enchou-sensei (Thầy Hiệu Trưởng)
  {
    id: "enchou-1",
    character: "Enchou-sensei",
    avatar: "🕶️",
    role: "Thầy Hiệu Trưởng Trái Tim Nhân Hậu",
    quoteVi: "Mặt tôi nhìn hơi giống trùm Mafia trên phim... nhưng thực chất tôi là một nhà giáo vô cùng yêu trẻ con mà!",
    quoteJa: "組長じゃなくて園長です！信じてください！",
    quoteRomaji: "Kumichou janakute enchou desu! Shinjite kudasai!",
    mischief: 22,
    snackLuck: 67,
    romance: 52,
    luckyNumber: 89,
    luckySnack: "Trà xanh Uji hảo hạng đắng ngọt",
    themeColor: "bg-[#f59e0b] text-[#1e1b18]",
    accentBg: "#fef3c7",
  },

  // 34: Matsuzaka-sensei (Cô Mai)
  {
    id: "matsuzaka-1",
    character: "Matsuzaka Ume",
    avatar: "👠",
    role: "Quý Cô Hàng Hiệu Tìm Chồng",
    quoteVi: "Hôm nay quyết tâm diện chiếc váy đắt đỏ nhất và đi săn đại gia môn đăng hộ đối ở buổi tiệc hẹn hò!",
    quoteJa: "合コンでいい男つかまえるわ！見てなさい！",
    quoteRomaji: "Goukon de ii otoko tsukamaeru wa! Mitenasai!",
    mischief: 66,
    snackLuck: 54,
    romance: 94,
    luckyNumber: 24,
    luckySnack: "Rượu vang nổ và phô mai cao cấp",
    themeColor: "bg-[#9333ea] text-white",
    accentBg: "#f3e8ff",
  },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: "rect" | "circle" | "star";
  rotation: number;
  vRot: number;
  alpha: number;
}

export function ChocobiFortune() {
  const [boxState, setBoxState] = useState<"idle" | "shaking" | "revealed">("idle");
  const [currentFortune, setCurrentFortune] = useState<FortuneCardData | null>(null);
  const [history, setHistory] = useState<FortuneCardData[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  // Load Fortune History from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shin_fortune_history");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setHistory(parsed.slice(0, 10));
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    return () => {
      if (animIdRef.current) {
        cancelAnimationFrame(animIdRef.current);
      }
    };
  }, []);

  // Save Fortune History
  const saveToHistory = (card: FortuneCardData) => {
    setHistory((prev) => {
      const updated = [card, ...prev.filter((c) => c.id !== card.id)].slice(0, 10);
      if (typeof window !== "undefined") {
        localStorage.setItem("shin_fortune_history", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Pure Canvas Confetti Cannon
  const triggerConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reset dimensions
    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    const colors = ["#b7000c", "#f4e700", "#0b5eaf", "#22c55e", "#ec4899", "#f59e0b", "#06b6d4", "#ffffff"];
    const shapes: Array<"rect" | "circle" | "star"> = ["rect", "circle", "star"];
    const newParticles: Particle[] = [];

    const centerX = canvas.width / 2;
    const centerY = canvas.height * 0.45;

    for (let i = 0; i < 90; i++) {
      const angle = (Math.PI * 2 * i) / 90 + (Math.random() - 0.5) * 0.5;
      const speed = 4 + Math.random() * 11;
      newParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5, // blast upwards
        size: Math.random() * 8 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 14,
        alpha: 1,
      });
    }

    particlesRef.current = newParticles;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        if (p.alpha <= 0.01) continue;

        aliveCount++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.98; // air drag
        p.rotation += p.vRot;
        p.alpha -= 0.012; // gradual fade

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // mini star
          ctx.beginPath();
          for (let s = 0; s < 5; s++) {
            ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + s * 72) * Math.PI) / 180) * p.size);
            ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (p.size / 2));
          }
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }

      if (aliveCount > 0) {
        animIdRef.current = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    animIdRef.current = requestAnimationFrame(render);
  }, []);

  // Shake & Draw Fortune Logic
  const handleShakeBox = () => {
    if (boxState === "shaking") return;

    setBoxState("shaking");
    setCopied(false);

    // Play rattle box sound
    soundFx.playRattleBox();
    const rattleTimer1 = setTimeout(() => soundFx.playRattleBox(), 300);
    const rattleTimer2 = setTimeout(() => soundFx.playRattleBox(), 650);

    // After 1100ms, pop open and reveal card
    setTimeout(() => {
      clearTimeout(rattleTimer1);
      clearTimeout(rattleTimer2);

      // Pick a random card (avoid duplicate of current if possible)
      let available = FORTUNE_CARDS;
      if (currentFortune && FORTUNE_CARDS.length > 1) {
        available = FORTUNE_CARDS.filter((c) => c.id !== currentFortune.id);
      }
      const picked = available[Math.floor(Math.random() * available.length)];

      setCurrentFortune(picked);
      setBoxState("revealed");
      saveToHistory(picked);

      soundFx.playSparkleChime();
      setTimeout(() => triggerConfetti(), 150);
    }, 1100);
  };

  // Reset to shake again
  const handleReset = () => {
    if (animIdRef.current) {
      cancelAnimationFrame(animIdRef.current);
      animIdRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setBoxState("idle");
    setCopied(false);
  };

  // Copy quote text to clipboard
  const handleCopyQuote = async () => {
    if (!currentFortune) return;
    const textToCopy = `🥠 Quẻ Bói Kasukabe Chocobi: "${currentFortune.quoteVi}" - Lời khuyên từ ${currentFortune.character}! (Số may mắn: #${currentFortune.luckyNumber}, Món ăn vặt: ${currentFortune.luckySnack})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      soundFx.playClickPop();
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  // Pure HTML5 Canvas Downloadable Polaroid Generator (640 x 860 px)
  const handleDownloadPolaroid = () => {
    if (!currentFortune) return;
    setIsExporting(true);
    soundFx.playSparkleChime();

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 860;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // 1. Polaroid White Photo Card Base
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Neo-Brutalist Border Outer
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#1e1b18";
    ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

    // Hard Shadow Bottom & Right
    ctx.fillStyle = "#1e1b18";
    ctx.fillRect(canvas.width - 12, 12, 12, canvas.height - 12);
    ctx.fillRect(12, canvas.height - 12, canvas.width - 12, 12);

    // 2. Top Header Banner
    ctx.fillStyle = "#f4e700"; // Tertiary yellow
    ctx.fillRect(24, 24, canvas.width - 48, 54);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1e1b18";
    ctx.strokeRect(24, 24, canvas.width - 48, 54);

    ctx.fillStyle = "#1e1b18";
    ctx.font = "bold 20px 'Space Grotesk', sans-serif, system-ui";
    ctx.fillText("CHOCOBI DAILY FORTUNE CARD 🥠", 40, 58);

    const dateStr = new Date().toLocaleDateString("vi-VN");
    ctx.font = "bold 14px 'Space Grotesk', sans-serif, system-ui";
    ctx.fillText(dateStr, canvas.width - 150, 58);

    // 3. Central Photo Box Frame
    const photoX = 24;
    const photoY = 96;
    const photoW = canvas.width - 48;
    const photoH = 370;

    ctx.fillStyle = currentFortune.accentBg || "#fff8f5";
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#1e1b18";
    ctx.strokeRect(photoX, photoY, photoW, photoH);

    // Photo Box Header: Character Avatar & Name
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(photoX + 16, photoY + 16, 68, 68);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#1e1b18";
    ctx.strokeRect(photoX + 16, photoY + 16, 68, 68);

    ctx.font = "40px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(currentFortune.avatar, photoX + 50, photoY + 64);
    ctx.textAlign = "left";

    // Character Name & Role
    ctx.fillStyle = "#1e1b18";
    ctx.font = "bold 24px 'Space Grotesk', sans-serif, system-ui";
    ctx.fillText(currentFortune.character.toUpperCase(), photoX + 100, photoY + 48);

    ctx.fillStyle = "#5f3f3b";
    ctx.font = "bold 15px 'Plus Jakarta Sans', sans-serif, system-ui";
    ctx.fillText(`★ ${currentFortune.role}`, photoX + 100, photoY + 74);

    const maxLineW = photoW - 48;

    // Japanese Quote
    ctx.fillStyle = "#1e1b18";
    ctx.font = "bold 16px 'Plus Jakarta Sans', 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif";
    ctx.fillText(`"${currentFortune.quoteJa}"`, photoX + 24, photoY + 120);

    // Romaji Subtitle with overflow safety
    ctx.font = "italic 13px 'Plus Jakarta Sans', sans-serif, system-ui";
    ctx.fillStyle = "#6b7280";
    let romaji = `(${currentFortune.quoteRomaji})`;
    while (ctx.measureText(romaji).width > maxLineW && romaji.length > 5) {
      romaji = romaji.slice(0, -5) + "...)";
    }
    ctx.fillText(romaji, photoX + 24, photoY + 144);

    // Vietnamese Big Quote Text Wrap with Adaptive Font Sizing
    const isLongQuote = currentFortune.quoteVi.length > 85;
    const quoteFontSize = isLongQuote ? 18 : 20;
    const lineHeight = isLongQuote ? 27 : 30;

    ctx.fillStyle = "#1e1b18";
    ctx.font = `bold ${quoteFontSize}px 'Plus Jakarta Sans', sans-serif, system-ui`;
    const quoteWords = `"${currentFortune.quoteVi}"`.split(" ");
    let line = "";
    let lineY = photoY + 182;

    for (let n = 0; n < quoteWords.length; n++) {
      const testLine = line + quoteWords[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineW && n > 0) {
        ctx.fillText(line, photoX + 24, lineY);
        line = quoteWords[n] + " ";
        lineY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, photoX + 24, lineY);

    // 4. Stats Section (Meters & Lucky Info)
    const statsY = 485;

    // Stat 1: Mischief
    ctx.fillStyle = "#1e1b18";
    ctx.font = "bold 15px 'Space Grotesk', sans-serif, system-ui";
    ctx.fillText(`🔥 NGHỊCH NGỢM: ${currentFortune.mischief}%`, 24, statsY);
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(24, statsY + 8, canvas.width - 48, 14);
    ctx.fillStyle = "#b7000c";
    ctx.fillRect(24, statsY + 8, ((canvas.width - 48) * currentFortune.mischief) / 100, 14);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#1e1b18";
    ctx.strokeRect(24, statsY + 8, canvas.width - 48, 14);

    // Stat 2: Snack Luck
    ctx.fillStyle = "#1e1b18";
    ctx.fillText(`🍪 MAY MẮN ĂN VẶT: ${currentFortune.snackLuck}%`, 24, statsY + 45);
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(24, statsY + 53, canvas.width - 48, 14);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(24, statsY + 53, ((canvas.width - 48) * currentFortune.snackLuck) / 100, 14);
    ctx.strokeRect(24, statsY + 53, canvas.width - 48, 14);

    // Stat 3: Romance Radar
    ctx.fillStyle = "#1e1b18";
    ctx.fillText(`💖 RADA TÌNH DUYÊN: ${currentFortune.romance}%`, 24, statsY + 90);
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(24, statsY + 98, canvas.width - 48, 14);
    ctx.fillStyle = "#ec4899";
    ctx.fillRect(24, statsY + 98, ((canvas.width - 48) * currentFortune.romance) / 100, 14);
    ctx.strokeRect(24, statsY + 98, canvas.width - 48, 14);

    // 5. Lucky Pill Badges
    const badgeY = statsY + 145;

    // Lucky Number Badge
    ctx.fillStyle = "#0b5eaf";
    ctx.fillRect(24, badgeY, 260, 48);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#1e1b18";
    ctx.strokeRect(24, badgeY, 260, 48);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px 'Space Grotesk', sans-serif, system-ui";
    ctx.fillText(`⭐ CON SỐ MAY MẮN: #${currentFortune.luckyNumber}`, 36, badgeY + 30);

    // Lucky Snack Badge with text length safety
    ctx.fillStyle = "#2d7f36";
    ctx.fillRect(300, badgeY, canvas.width - 324, 48);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#1e1b18";
    ctx.strokeRect(300, badgeY, canvas.width - 324, 48);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Plus Jakarta Sans', sans-serif, system-ui";
    let snackText = `🍪 ${currentFortune.luckySnack}`;
    const maxSnackW = canvas.width - 324 - 24;
    while (ctx.measureText(snackText).width > maxSnackW && snackText.length > 5) {
      snackText = snackText.slice(0, -4) + "...";
    }
    ctx.fillText(snackText, 312, badgeY + 30);

    // 6. Polaroid Bottom Footer Seal
    ctx.fillStyle = "#1e1b18";
    ctx.font = "bold 13px 'Space Grotesk', sans-serif, system-ui";
    ctx.fillText("SHINOSUKE FAN HUB 🕹️ KASUKABE ARCADE SPECIAL EDITION", 24, canvas.height - 30);

    ctx.fillStyle = "#b7000c";
    ctx.font = "bold 12px 'Space Grotesk', sans-serif, system-ui";
    ctx.fillText("AUTHENTIC MEME STAMP ✓", canvas.width - 200, canvas.height - 30);

    // Export to PNG Download with DOM attachment for cross-browser mobile support
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `chocobi-fortune-${currentFortune.id}-${Date.now()}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsExporting(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Box Header & History Drawer Toggle */}
      <div className="bg-surface neo-brutalist-border hard-shadow p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <NeoBadge variant="tertiary" rotate={2} className="px-2.5 py-0.5 text-xs">
              34 QUẺ MAY MẮN SONG NGỮ 🥠
            </NeoBadge>
            <span className="font-label-bold text-xs bg-surface-container-high px-2 py-0.5 neo-brutalist-border">
              {FORTUNE_CARDS.length} Quẻ Cà Khịa
            </span>
          </div>
          <h2 className="font-display-md text-2xl sm:text-3xl uppercase tracking-tight text-on-background">
            Hộp Bói Quẻ Cà Khịa Chocobi 🦖
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-xl">
            Rút quẻ bói may mắn mỗi ngày từ hộp bánh khủng long Chocobi! Lời khuyên bá đạo song ngữ Nhật - Việt,
            đo chỉ số quậy phá, độ hên ăn vặt và xuất ảnh Polaroid kỷ niệm.
          </p>
        </div>

        {/* History Toggle Button */}
        <button
          onClick={() => setShowHistory((prev) => !prev)}
          className="px-4 py-2 bg-surface neo-brutalist-border hard-shadow hover:bg-tertiary-fixed font-label-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto"
        >
          <History className="w-4 h-4" />
          <span>Lịch Sử ({history.length})</span>
        </button>
      </div>

      {/* History Drawer Modal / Dropdown */}
      {showHistory && (
        <div className="bg-surface-container-low neo-brutalist-border hard-shadow p-5 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b-2 border-on-background pb-2">
            <h3 className="font-display-md text-sm uppercase text-on-background flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Các quẻ bạn đã rút gần đây
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs font-bold underline uppercase cursor-pointer"
            >
              Đóng
            </button>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-on-surface-variant italic py-2">
              Bạn chưa rút quẻ nào trong phiên này. Hãy bấm lắc hộp Chocobi ngay bên dưới nhé!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {history.map((card, idx) => (
                <div
                  key={`${card.id}-${idx}`}
                  onClick={() => {
                    setCurrentFortune(card);
                    setBoxState("revealed");
                    setShowHistory(false);
                  }}
                  className="p-3 bg-surface neo-brutalist-border hover:bg-yellow-50 cursor-pointer transition-all text-left space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{card.avatar}</span>
                    <span className="font-label-bold text-[10px] bg-on-background text-white px-1.5 py-0.2">
                      #{card.luckyNumber}
                    </span>
                  </div>
                  <h4 className="font-label-bold text-xs truncate">{card.character}</h4>
                  <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                    "{card.quoteVi}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="relative bg-surface neo-brutalist-border hard-shadow p-6 sm:p-10 min-h-[480px] flex flex-col items-center justify-center overflow-hidden">
        {/* Pure Canvas Confetti Layer */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-30 w-full h-full"
        />

        {/* STATE 1 & 2: IDLE OR SHAKING BOX */}
        {boxState !== "revealed" && (
          <div className="flex flex-col items-center justify-center space-y-8 z-10 max-w-md text-center">
            {/* Chocobi 3D Hexagonal Box Illustration */}
            <div
              className={`relative transition-transform duration-100 ${
                boxState === "shaking" ? "animate-bounce scale-110" : "hover:scale-105"
              }`}
            >
              {/* Star Badges */}
              <div className="absolute -top-4 -left-6 z-20 animate-spin">
                <span className="text-3xl">⭐</span>
              </div>
              <div className="absolute -bottom-2 -right-6 z-20 animate-pulse">
                <span className="text-3xl">✨</span>
              </div>

              {/* The Iconic Green Hexagonal Chocobi Box */}
              <div
                className={`w-44 h-56 sm:w-52 sm:h-64 bg-[#22c55e] neo-brutalist-border hard-shadow-lg flex flex-col items-center justify-between p-4 relative select-none cursor-pointer transition-all ${
                  boxState === "shaking" ? "-rotate-6 shadow-none" : "rotate-1"
                }`}
                onClick={handleShakeBox}
              >
                {/* Box Top Lid Pattern */}
                <div className="w-full bg-[#16a34a] neo-brutalist-border py-1 text-center">
                  <span className="font-label-bold text-[10px] sm:text-xs text-white uppercase tracking-wider">
                    ★ CHOCOBI ★ チョコビ
                  </span>
                </div>

                {/* Pink Dinosaur Waniyama-san Centerpiece */}
                <div className="space-y-1 text-center">
                  <div className="text-5xl sm:text-6xl filter drop-shadow-[2px_2px_0px_#000]">
                    🦖
                  </div>
                  <span className="inline-block px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-bold text-[10px] neo-brutalist-border uppercase">
                    Waniyama-san
                  </span>
                </div>

                {/* Box Bottom Biscuit Badge */}
                <div className="w-full bg-white neo-brutalist-border py-1 text-center">
                  <span className="font-display-md text-xs uppercase text-[#b7000c] font-black">
                    🍪 100% MISCHIEF
                  </span>
                </div>
              </div>
            </div>

            {/* Instruction & Action Button */}
            <div className="space-y-3">
              <h3 className="font-display-md text-xl sm:text-2xl uppercase text-on-background">
                {boxState === "shaking" ? "ĐANG LẮC RỘM RỘP... 🌀" : "BẤM VÀO HỘP ĐỂ RÚT QUẺ!"}
              </h3>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-sm">
                Lắc đều để đánh thức khủng long Waniyama-san và nhận thông điệp vũ trụ từ biệt đội Kasukabe.
              </p>

              <button
                onClick={handleShakeBox}
                disabled={boxState === "shaking"}
                className="px-6 py-3.5 bg-primary text-white font-label-bold text-sm uppercase neo-brutalist-border hard-shadow hover:bg-red-700 hard-shadow-active transition-all cursor-pointer disabled:opacity-50"
              >
                {boxState === "shaking" ? "Đang Lắc Hộp..." : "LẮC HỘP RÚT QUẺ 🥠"}
              </button>
            </div>
          </div>
        )}

        {/* STATE 3: REVEALED POLAROID CARD */}
        {boxState === "revealed" && currentFortune && (
          <div className="w-full max-w-xl z-20 space-y-6 animate-in zoom-in-95 duration-300">
            {/* The Neo-Brutalist Polaroid Card */}
            <div className="bg-white neo-brutalist-border hard-shadow-lg p-5 sm:p-7 space-y-5 relative">
              {/* Card Header Stamp */}
              <div className="flex items-center justify-between border-b-2 border-on-background pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed font-label-bold text-xs neo-brutalist-border uppercase">
                    KASUKABE FORTUNE #
                    {currentFortune.luckyNumber}
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant">
                    {new Date().toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopyQuote}
                    className="p-1.5 bg-surface neo-brutalist-border hover:bg-tertiary-fixed transition-colors cursor-pointer"
                    title="Sao chép nội dung quẻ"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Character Frame & Bilingual Quote */}
              <div
                className="p-4 sm:p-5 neo-brutalist-border space-y-3"
                style={{ backgroundColor: currentFortune.accentBg }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white neo-brutalist-border flex items-center justify-center text-3xl shrink-0">
                    {currentFortune.avatar}
                  </div>
                  <div>
                    <h3 className="font-display-md text-lg sm:text-xl uppercase leading-tight text-on-background font-black">
                      {currentFortune.character}
                    </h3>
                    <p className="font-label-bold text-xs text-on-surface-variant">
                      ★ {currentFortune.role}
                    </p>
                  </div>
                </div>

                {/* Japanese Original */}
                <div className="bg-white/70 neo-brutalist-border p-2.5 space-y-0.5">
                  <p className="font-body-md text-xs italic font-semibold text-on-background">
                    "{currentFortune.quoteJa}"
                  </p>
                  <p className="font-body-md text-[11px] text-gray-500">
                    ({currentFortune.quoteRomaji})
                  </p>
                </div>

                {/* Vietnamese Translation / Advice */}
                <div className="pt-1">
                  <p className="font-display-md text-base sm:text-lg uppercase text-on-background leading-snug font-bold">
                    "{currentFortune.quoteVi}"
                  </p>
                </div>
              </div>

              {/* 3 Stat Meters */}
              <div className="space-y-2.5 pt-1">
                {/* Meter 1: Mischief */}
                <div>
                  <div className="flex justify-between text-xs font-label-bold mb-1">
                    <span className="flex items-center gap-1 text-primary">
                      <Flame className="w-3.5 h-3.5 fill-current" /> Chỉ Số Quậy Phá
                    </span>
                    <span>{currentFortune.mischief}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high neo-brutalist-border overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-700"
                      style={{ width: `${currentFortune.mischief}%` }}
                    />
                  </div>
                </div>

                {/* Meter 2: Snack Luck */}
                <div>
                  <div className="flex justify-between text-xs font-label-bold mb-1">
                    <span className="flex items-center gap-1 text-[#22c55e]">
                      <Star className="w-3.5 h-3.5 fill-current" /> Độ May Mắn Ăn Vặt
                    </span>
                    <span>{currentFortune.snackLuck}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high neo-brutalist-border overflow-hidden">
                    <div
                      className="h-full bg-[#22c55e] transition-all duration-700"
                      style={{ width: `${currentFortune.snackLuck}%` }}
                    />
                  </div>
                </div>

                {/* Meter 3: Romance Radar */}
                <div>
                  <div className="flex justify-between text-xs font-label-bold mb-1">
                    <span className="flex items-center gap-1 text-[#ec4899]">
                      <Heart className="w-3.5 h-3.5 fill-current" /> Rada Tình Duyên
                    </span>
                    <span>{currentFortune.romance}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-high neo-brutalist-border overflow-hidden">
                    <div
                      className="h-full bg-[#ec4899] transition-all duration-700"
                      style={{ width: `${currentFortune.romance}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Lucky Number & Snack Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 bg-secondary text-white neo-brutalist-border flex items-center justify-between">
                  <span className="font-label-bold text-xs uppercase">Số May Mắn:</span>
                  <span className="font-display-md text-base font-black">
                    #{currentFortune.luckyNumber}
                  </span>
                </div>

                <div className="p-2.5 bg-[#2d7f36] text-white neo-brutalist-border flex items-center justify-between">
                  <span className="font-label-bold text-xs uppercase">Món Ăn Vặt:</span>
                  <span className="font-label-bold text-xs truncate max-w-[150px]">
                    🍪 {currentFortune.luckySnack}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar: Download Polaroid & Shake Again */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleDownloadPolaroid}
                disabled={isExporting}
                className="w-full sm:w-auto px-5 py-3 bg-[#f59e0b] text-[#1e1b18] font-label-bold text-xs sm:text-sm uppercase neo-brutalist-border hard-shadow hover:bg-yellow-400 hard-shadow-active flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? "Đang Xuất Thẻ..." : "TẢI THẺ POLAROID (PNG)"}</span>
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-3 bg-surface text-on-surface font-label-bold text-xs sm:text-sm uppercase neo-brutalist-border hard-shadow hover:bg-tertiary-fixed hard-shadow-active flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>LẮC QUẺ KHÁC 🥠</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
