import { P, type Pt, type Vec } from './core/path';

/**
 * Rig B – chổng mông đi. Toạ độ giữ nguyên hệ pixel của ảnh gốc
 * (reference/pose-b-butt-walk.png, 450×800); nhân vật hướng sang TRÁI.
 *
 * Áp dụng bài học Rig A (docs/bai-hoc-rig.md):
 *  - hai đầu chân cắm sâu trong quần và trong giày;
 *  - các mảng kề nhau chồng lấn (điểm có ghi "chìm");
 *  - đường bao tròn lấy mẫu dày, đều theo chiều dài cung từ ảnh.
 */
export const VIEWBOX = { x: 60, y: 385, w: 330, h: 275 };
export const REF_SIZE = { w: 450, h: 800 };

/**
 * Màu đo trực tiếp từ ảnh gốc. Viền KHÔNG đen tuyệt đối: mỗi mảng có màu viền riêng
 * (xám tím ở da, xanh than ở quần, nâu đỏ ở miệng) và chỉ dày ~2,2 px.
 */
export const COLORS = {
  line: '#33303F', // viền chung (giày, tất, tóc)
  skinLine: '#3E2E36', // viền mặt, tai, tay, chân
  shortsLine: '#2A3165',
  shirtLine: '#372A30',
  mouthLine: '#4E2620',
  hair: '#3B3D3E',
  skin: '#FFD3B5',
  shorts: '#3D5FB6',
  shirt: '#A0E3F4',
  sock: '#FFFFFF',
  shoe: '#D1ECCD',
  sole: '#A9C3AE',
  mouth: '#95403D',
  blush: '#E3A194',
  bg: '#C6ADEF',
};
export const STROKE = 2.2;

// ── Tâm xoay ────────────────────────────────────────────────────────────────
export const HIP_PIVOT: Vec = { x: 200, y: 515 }; // eo: chỗ quần gặp áo
export const HIP_CENTER: Vec = { x: 275, y: 500 }; // tâm khối mông (co giãn quanh đây)
export const NECK: Vec = { x: 165, y: 500 };
export const MOUTH_HINGE_X = 104;

// ── Đầu ─────────────────────────────────────────────────────────────────────
export const FACE: Pt[] = [
  P(146, 424, true), // chìm dưới chỏm tóc
  P(134, 434), P(128, 443), P(114, 446), P(103, 453), P(94, 463), P(88.5, 475), P(88, 488),
  P(91, 499), P(99, 508), P(112, 516), P(127, 521), P(138, 520), P(145, 515), P(150, 505),
  P(153, 493),
  P(158, 478, true), P(160, 440, true), // chìm dưới tai và tóc
];
/**
 * Miệng hình hạt đậu, góc dưới trái NHẬP vào viền mặt. Hai điểm "ngoài" nằm hẳn ngoài mặt:
 * khi vẽ, miệng bị cắt theo mảng da của mặt rồi viền mặt vẽ đè lên – không bị trùng hai nét.
 */
export const MOUTH: Pt[] = [
  P(110.5, 473), P(114, 473.5), P(117.5, 476.5), P(120, 481), P(121.8, 486), P(122.3, 491),
  P(122.2, 497), P(121, 502), P(118.5, 506.5), P(115, 510.5), P(111.5, 514),
  P(107, 519, true), P(96, 512, true), // ngoài mặt
  P(102.5, 506), P(105.5, 502.5), P(107.2, 498), P(107.2, 493), P(106.2, 488), P(105.2, 483),
  P(105.5, 478), P(107.5, 474.5),
];
export const BLUSH: [Vec, Vec][] = [
  [{ x: 106.5, y: 455 }, { x: 105.5, y: 459.5 }],
  [{ x: 114.5, y: 455 }, { x: 112.5, y: 460 }],
  [{ x: 123, y: 455.5 }, { x: 121.5, y: 460 }],
  [{ x: 128.5, y: 456.5 }, { x: 128, y: 459.5 }],
];
export const HAIR: Pt[] = [
  P(180, 404), P(168, 406), P(158, 410), P(147, 415), P(137, 422, true), P(141, 426),
  P(147, 428, true), P(149, 437), P(148, 448), P(154, 457), P(161, 467), P(162, 479),
  P(153, 486), P(159, 490), P(167, 484), P(178, 479), P(188, 476), P(199, 472), // mép dưới thật: tóc phủ lên áo
  P(210, 470), P(222, 471), P(236, 471), P(250, 470, true), P(264, 452, true), // chìm dưới quần
  P(247, 443), P(242, 432), P(235, 423), P(226, 415), P(215, 410), P(204, 406), P(193, 404),
];
export const EAR: Pt[] = [
  P(147, 446), P(140, 452), P(141, 464), P(144, 474), P(137, 482), P(135, 490), P(141, 493),
  P(150, 487), P(158, 480), P(162, 470), P(161, 462), P(155, 458), P(150, 452),
];
export const EAR_LINE: Pt[] = [P(152, 462), P(156, 468), P(155, 476)]; // nếp vành tai

// ── Thân: áo + hai nắm tay khoanh dưới cằm ─────────────────────────────────
export const SHIRT: Pt[] = [
  P(214, 458, true), P(197, 466), P(184, 471), P(171, 475), P(160, 483), // chìm dưới tóc
  P(147, 500), P(141, 514), // chìm dưới mặt và nắm tay trước
  P(142, 527, true), P(149, 537), P(161, 542), P(174, 546), P(183, 548, true),
  P(185, 558), P(188, 572), P(198, 583), P(209, 590), P(223, 591, true),
  P(245, 575, true), P(250, 500, true), // chìm dưới quần
];
export const SHIRT_SEAM: [Vec, Vec] = [{ x: 181, y: 521 }, { x: 181.5, y: 547 }];
export const FIST_FRONT = { cx: 134, cy: 523, rx: 10.5, ry: 12 };
export const FIST_BACK = { cx: 153, cy: 546.5, rx: 12, ry: 10 };

// ── Hông / quần: 40 điểm lấy mẫu đều; mọi điểm đi qua hàm biến dạng mỗi tick ─
export const HIP_OUTLINE: Pt[] = [
  P(296, 427), P(283, 431), P(271, 437), P(262, 447), P(255, 459), P(252, 467, true),
  P(238, 465), P(224, 466), P(212, 471), P(201, 480), P(192, 491), P(186, 502), P(183, 515),
  P(184, 530), P(186, 543), P(192, 555), P(199, 566), P(203, 579, true), P(212, 585),
  P(225, 585), P(239, 584), P(251, 580), P(264, 575), P(274, 571), P(280.5, 568.5, true), P(283, 566.5, true), P(299, 563),
  P(313, 560), P(325, 555), P(338, 550, true), P(333, 538, true), P(342, 525), P(349, 513),
  P(353, 501), P(356, 487), P(354, 474), P(350, 461), P(343, 449), P(334, 439), P(323, 432),
  P(310, 428),
];
export const HIP_LINES: Pt[][] = [
  [P(252, 467), P(262, 470), P(272, 477), P(280, 487), P(284, 498)], // khe giữa hai mông
  // Đường chia hai ống quần: chéo xuống rồi thẳng đứng chạm tới gấu
  [P(303, 535), P(292, 545), P(282, 554), P(280, 560), P(280.5, 567.5)],
  [P(303, 545), P(294, 549), P(285, 552)], // nếp gấp ống quần xa
];

/**
 * Chân hai đoạn: đùi (khớp háng → gối) và ống chân (gối → cổ chân), giải IK mỗi tick.
 * Đúng như ảnh: hai đùi CHỤM vào, hai gối gần chạm nhau ngay dưới gấu quần, rồi
 * ống chân TOẢ ra hai bên xuống giày. Khớp háng chìm sâu trong quần, cổ chân chìm trong giày.
 */
export type Leg = {
  socket: Vec; knee: Vec; ankle: Vec;
  wHip: number; wKnee: number; wAnkle: number;
  sockAt: number; // vớ bắt đầu ở đâu trên ống chân (0 = ngay gối, 1 = cổ chân); gối luôn nằm ở phần da
  shoe: Pt[]; sole: Pt[];
};
export const LEG_NEAR: Leg = {
  socket: { x: 240, y: 556 },
  knee: { x: 250, y: 590 },
  ankle: { x: 232, y: 612 },
  wHip: 26, wKnee: 20, wAnkle: 15, sockAt: 0.46,
  shoe: [
    P(231, 602), P(224, 606), P(217, 613), P(217, 625), P(221, 638), P(236, 638), P(242, 630),
    P(240, 620), P(241, 610), P(238, 604),
  ],
  sole: [P(219, 619), P(225, 615), P(232, 616), P(236, 624), P(238, 637), P(222, 638)],
};
export const LEG_FAR: Leg = {
  socket: { x: 283, y: 552 },
  knee: { x: 264, y: 585 },
  ankle: { x: 279, y: 607 },
  wHip: 26, wKnee: 19, wAnkle: 14, sockAt: 0.42,
  shoe: [
    P(283, 592), P(277, 598), P(272, 607), P(269, 615), P(262, 620, true), P(272, 627),
    P(285, 629), P(291, 620), P(294, 606), P(289, 597),
  ],
  sole: [P(283, 598), P(279, 608), P(277, 618), P(275, 627), P(285, 628), P(290, 619), P(293, 607), P(289, 599)],
};
export const SHADOW = { cx: 255, cy: 641, rx: 58, ry: 5 };
