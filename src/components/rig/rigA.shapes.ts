import { P, type Pt, type Vec } from './core/path';

/**
 * Rig A – đứng quay lưng. Toạ độ giữ nguyên hệ pixel của ảnh gốc
 * (reference/pose-a-back-sway.png, 675×1200) để so chồng trực tiếp.
 */
export const VIEWBOX = { x: 110, y: 265, w: 480, h: 720 };
export const REF_SIZE = { w: 675, h: 1200 };

export const COLORS = {
  line: '#000000',
  skin: '#FFD3B5',
  shorts: '#C29FED',
  sock: '#FFFFFF',
  blush: '#EE9A90',
  bg: '#EAE8FD',
};
export const STROKE = 4.5;

// ── Tâm xoay ────────────────────────────────────────────────────────────────
export const HIP_PIVOT: Vec = { x: 318, y: 628 }; // giữa cạp quần
export const NECK: Vec = { x: 395, y: 525 };

// ── Đầu ─────────────────────────────────────────────────────────────────────
/**
 * Ba mảng tóc – lông mày – mặt CHỒNG LẤN lên nhau ở chỗ tiếp giáp (không chỉ chạm mép),
 * nên không hở nền và lông mày vẫn nhúc nhích riêng được.
 * Cung ngoài của tóc lấy mẫu đều 26 điểm theo đường bao của ảnh gốc.
 */
export const HAIR: Pt[] = [
  P(348, 323), P(325.5, 321.5), P(301.6, 321), P(279.3, 325), P(257.8, 331.2), P(238.3, 342),
  P(220.5, 355.5), P(205.3, 372.7), P(193.3, 391.7), P(184, 411.8), P(177.7, 433.3),
  P(174, 455.7), P(174.5, 479.5), P(179, 501.7), P(186.5, 522.5), P(197.9, 541.9),
  P(212.5, 557.5), P(231.3, 570), P(252, 578), P(273.5, 582), P(297.1, 583), P(320.3, 581),
  P(342.5, 576.5), P(363.2, 568.8), P(382.6, 557.4), P(398, 541, true),
  P(400, 517, true), P(374, 514, true), P(368, 490), P(372, 460), P(378, 431, true),
  P(366, 341, true), P(372, 336, true), P(362, 326), // hai điểm cuối chui dưới lông mày
];
export const BROW: Pt[] = [
  P(348, 323), P(355.3, 315.7), P(365.7, 318), P(376.1, 322.1), P(385.7, 327.7),
  P(395.1, 334.1), P(403.2, 342.2), P(406, 353), P(399, 361, true), P(382, 345), P(368, 338.5),
  P(354, 336, true), P(342, 328, true), // gốc lông mày chui vào trong tóc
];
export const FACE: Pt[] = [
  P(380, 330, true), // chui dưới lông mày
  P(400, 366), P(412, 372.5), P(425.7, 376), P(454.3, 368), P(482.9, 369.9), P(507, 386),
  P(522.4, 411.4), P(526, 441), P(518.3, 469.7), P(500.1, 492.9), P(468.2, 515.8),
  P(438, 531, true), P(425, 552, true), P(380, 552, true), P(360, 500, true), P(360, 336, true),
];
export const CHEEK: Pt[] = [P(442, 418), P(445, 442), P(457, 467), P(481, 488), P(498, 495)];
export const EAR: Pt[] = [
  P(374, 434, true), P(389, 434), P(394, 439), P(394, 466), P(399, 472), P(418, 477),
  P(427, 487), P(424, 499), P(414, 502), P(401, 498), P(391, 502), P(378, 502), P(366, 497),
  P(361, 486), P(364, 472), P(371, 464, true),
];
export const EAR_LINES: Pt[][] = [
  [P(378, 470), P(373, 478), P(373, 489)],
  [P(391, 490), P(403, 496)],
];
export const BLUSH: [Vec, Vec][] = [
  [{ x: 403, y: 412 }, { x: 407, y: 453 }],
  [{ x: 416, y: 402 }, { x: 418, y: 425 }],
  [{ x: 427, y: 389 }, { x: 430, y: 410 }],
  [{ x: 438, y: 387 }, { x: 439, y: 402 }],
  [{ x: 452, y: 383 }, { x: 448, y: 400 }],
];

// ── Thân + tay ──────────────────────────────────────────────────────────────
/**
 * Thân, toạ độ theo mép màu da (viền đen vẽ bên ngoài mép này).
 * Quy tắc khớp vai: gốc bắp tay nằm CHÌM hẳn trong thân, và ở chỗ đường vai gặp mép
 * trên của bắp tay hai đường gần thẳng hàng (lệch ~10°) – nên bắp tay xoay vài độ
 * đường bao vẫn liền, không sinh khía lõm. Đỉnh (470,545) và (466,566) nằm trong bắp tay.
 */
export const TORSO: Pt[] = [
  P(248, 652, true), P(248, 588, true), P(244, 584, true), P(236, 560, true),
  P(400, 522, true), P(420, 527, true), P(431, 530), P(441, 535), P(451.5, 539.5), P(462, 543),
  P(470, 545, true), P(466, 566, true), P(445, 571.5), P(434, 573), P(425, 578, true),
  P(416, 606), P(413, 652, true),
];
export const SPINE: [Vec, Vec] = [{ x: 317, y: 610 }, { x: 317, y: 630 }];

/** Miếng da nối cổ với lưng: che đoạn viền của thân nằm ngay dưới tai. */
export const NECK_PATCH: Pt[] = [
  P(399, 510, true), P(414, 513, true), P(414, 524, true), P(405, 531, true), P(399, 531, true),
];

/**
 * Tay: vai nằm trong hệ của thân; cổ tay, nắm tay, ngón cái nằm trong hệ của hông
 * (tay luôn dính cạp quần). Khuỷu được giải IK mỗi tick.
 * Bắp tay và cẳng tay là hình thang thon dần; gốc bắp tay cắm sâu vào trong thân.
 */
export type Arm = {
  shoulder: Vec; elbowRest: Vec; wrist: Vec; fist: Vec;
  wShoulder: number; wElbow: number; wForeTop: number; wWrist: number; rFist: number;
  thumb: Vec | null; wThumb: number;
};
export const ARM_L: Arm = {
  shoulder: { x: 240.4, y: 566 },
  elbowRest: { x: 200, y: 582.5 },
  wrist: { x: 231, y: 622 },
  fist: { x: 232, y: 628 },
  wShoulder: 38, wElbow: 27, wForeTop: 22, wWrist: 14, rFist: 8.5,
  thumb: null, wThumb: 0,
};
export const ARM_R: Arm = {
  shoulder: { x: 444, y: 557 },
  elbowRest: { x: 479, y: 559.5 },
  wrist: { x: 436, y: 611 },
  fist: { x: 433, y: 621 },
  wShoulder: 26, wElbow: 26, wForeTop: 23, wWrist: 12, rFist: 11.5,
  thumb: { x: 430, y: 598 }, wThumb: 11,
};

// ── Hông / quần (mọi điểm đều đi qua hàm biến dạng mỗi tick) ────────────────
export const HIP_OUTLINE: Pt[] = [
  P(245, 606, true), P(262, 622), P(282, 630), P(300, 633), P(337, 634), P(363, 630),
  P(383, 624), P(398, 623), P(413, 629), P(426, 636), P(444, 631, true),
  P(445, 655), P(445, 685), P(443, 714, true), P(451, 738), P(461, 765, true),
  P(441, 770), P(418, 772), P(400, 778), P(377, 786), P(337, 789), P(307, 790), P(260, 787),
  P(244, 782), P(200, 772), P(172, 760, true), P(196, 733, true), P(198, 707), P(201, 683),
  P(206, 667), P(217, 655), P(226, 640),
];
export const HIP_LINES: Pt[][] = [
  [P(283, 668), P(293, 683)], // chữ Y phía trên khe mông
  [P(307, 668), P(293, 683)],
  [P(293, 683), P(288, 697), P(286, 713), P(288, 730), P(297, 747), P(310, 762), P(330, 772)],
  [P(308, 764), P(308, 788)], // đường chia hai ống quần
  [P(237, 760), P(257, 767), P(277, 768), P(297, 765)], // nếp dưới mông trái
  [P(199, 728), P(202, 743)],
  [P(443, 712), P(441, 724)],
  [P(248, 643), P(252, 662), P(257, 678)], // nếp nhăn cạp quần
  [P(263, 643), P(268, 650), P(277, 654), P(300, 658), P(332, 658)],
  [P(277, 640), P(278, 652)],
  [P(287, 642), P(287, 655)],
  [P(312, 647), P(305, 657)],
  [P(348, 657), P(370, 655), P(387, 648)],
  [P(427, 643), P(412, 663), P(397, 679)],
];

/** Đẩy mọi điểm ra xa trọng tâm `px` đơn vị (nới hình cho khớp mép ngoài của viền). */
function grow(pts: Pt[], px: number): Pt[] {
  const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
  const cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
  return pts.map((p) => {
    const d = Math.hypot(p.x - cx, p.y - cy) || 1;
    return { ...p, x: p.x + ((p.x - cx) / d) * px, y: p.y + ((p.y - cy) / d) * px };
  });
}

// ── Chân ────────────────────────────────────────────────────────────────────
/**
 * Hai đầu chân đều là "phần chìm": đầu trên cắm sâu ~47 đơn vị vào trong quần
 * (gấu quần ở y≈787), đầu dưới cắm ~18 đơn vị vào trong bàn chân. Chân nằm dưới
 * quần và dưới bàn chân nên hông bật lên hay chân đổi góc cũng không lộ khớp.
 */
export const LEG_L = {
  socket: { x: 275, y: 740 }, // trong hệ của hông
  ankle: { x: 287.8, y: 880 }, // trong hệ của bàn chân, nằm trong lòng bàn chân
  toe: { x: 288, y: 924 }, // ghim trên sàn
  wTop: 45, wBottom: 17, sockAt: 0.643, bendSign: 1,
};
export const LEG_R = {
  socket: { x: 374, y: 740 },
  ankle: { x: 345.2, y: 876 },
  toe: { x: 348, y: 925 },
  wTop: 70, wBottom: 10, sockAt: 0.662, bendSign: -1,
};
export const FOOT_L: Pt[] = grow([
  P(287, 862), P(280, 868), P(277, 893), P(275, 917), P(280, 924), P(292, 926), P(300, 920),
  P(301, 903), P(297, 880), P(293, 867),
], 4);
export const FOOT_R: Pt[] = grow([
  P(345, 866), P(337, 866), P(330, 871), P(330, 882), P(335, 900), P(338, 914), P(343, 923),
  P(350, 926), P(356, 921), P(354, 908), P(352, 890), P(353, 874),
], 4);
export const SHADOW = { cx: 318, cy: 931, rx: 82, ry: 8 };
