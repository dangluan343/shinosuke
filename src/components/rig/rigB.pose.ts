import { applyXf, clamp, P, smoothPath, xfAttr, type Pt, type Vec, type Xf } from './core/path';
import { elbow, taperedLimb } from './core/limb';
import type { Frame } from './core/apply';
import * as S from './rigB.shapes';

/** Toàn bộ trạng thái của Rig B. Mọi nguồn chuyển động chỉ ghi vào đây. */
export type RigBState = {
  phase: number; // pha chu kỳ bước, 1 đơn vị = 2 bước
  walk: number; // 0 = đứng ở tư thế chuẩn … 1 = đang đi
  wag: number; // −1…1 vẫy mông khi dừng lại lắc
  jig: number; // nảy phụ của mông (lò xo)
  mouth: number; // 0 = gần khép … 1 = há to như ảnh gốc
  nod: number; // −1…1 gật đầu
  hop: number; // nhảy lên khi quay đầu, px (âm = lên)
  blush: number; // 0…1
};

export const REST_B: RigBState = { phase: 0, walk: 0, wag: 0, jig: 0, mouth: 1, nod: 0, hop: 0, blush: 0 };

/**
 * Cấu hình chuyển động mặc định. Mọi giá trị được đọc lại mỗi khung hình,
 * nên chỉnh trên trang lab là thấy ngay, kể cả khi đang chạy.
 */
export const TUNE_B = {
  step: 16, // độ dài một bước (px ảnh gốc); mỗi chu kỳ thân đi được 2 × step
  lift: 6, // bàn chân nhấc cao
  bounce: 6, // thân nảy lên giữa hai lần chạm đất
  hipRot: 3.5, // độ: mông hất lên khi nảy
  wagRot: 7, // độ: vẫy mông
  nod: 3, // độ
  shoeTip: 12, // độ: mũi giày chúi xuống khi nhấc
  squash: 0.07, // mông giãn/dẹt theo nhịp nảy
  cycle: 0.8, // giây cho một chu kỳ (2 bước)
};
export type TuneB = typeof TUNE_B;

const TAU = Math.PI * 2;
const LEG_STRETCH = 0.7; // IK mềm: 0 = xương cứng, 1 = co giãn hoàn toàn
const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
const frac = (v: number) => v - Math.floor(v);
const dot = (p: Vec) => ({ cx: p.x.toFixed(1), cy: p.y.toFixed(1) });

const U = { x: 0.64, y: -0.77 }; // trục "mông chổng lên": co giãn dọc trục này, bù thể tích theo trục vuông góc
function deformHip(p: Pt, s: RigBState, t: TuneB): Pt {
  const k = 1 + t.squash * s.jig;
  const vx = p.x - S.HIP_CENTER.x, vy = p.y - S.HIP_CENTER.y;
  const a = (vx * U.x + vy * U.y) * k;
  const b = (-vx * U.y + vy * U.x) / k;
  return { x: S.HIP_CENTER.x + a * U.x - b * U.y, y: S.HIP_CENTER.y + a * U.y + b * U.x, c: p.c };
}

/** Độ dài đùi, ống chân và chiều gập gối lúc nghỉ – để IK giữ đúng dáng gối chụm. */
const legRest = (leg: S.Leg) => {
  const l1 = dist(leg.socket, leg.knee);
  const l2 = dist(leg.knee, leg.ankle);
  const a = elbow(leg.socket, leg.ankle, l1, l2, 1);
  const b = elbow(leg.socket, leg.ankle, l1, l2, -1);
  const sign: 1 | -1 = dist(a, leg.knee) < dist(b, leg.knee) ? 1 : -1;
  return { l1, l2, sign, d0: dist(leg.socket, leg.ankle) };
};
const NEAR_REST = legRest(S.LEG_NEAR);
const FAR_REST = legRest(S.LEG_FAR);

/**
 * Một bàn chân trong hệ của thân. Nhân vật đi sang trái (−x):
 * nửa đầu chu kỳ chân trụ trượt đều từ trước ra sau (đúng bằng quãng thân tiến),
 * nửa sau nhấc lên và đưa về phía trước.
 */
function footStep(p: number, walk: number, t: TuneB) {
  const half = t.step / 2;
  if (p < 0.5) return { dx: (-half + t.step * (p / 0.5)) * walk, lift: 0, rot: 0 };
  const u = (p - 0.5) / 0.5;
  const e = (1 - Math.cos(Math.PI * u)) / 2;
  const arc = Math.sin(Math.PI * u);
  return { dx: (half - t.step * e) * walk, lift: t.lift * arc * walk, rot: -t.shoeTip * arc * walk };
}

/**
 * Vớ: phủ phần dưới ống chân, mép trên bo tròn (vồng lên về phía gối, hai góc tròn).
 * Đầu dưới kéo quá cổ chân để chìm hẳn trong giày.
 */
function sockPath(knee: Vec, ankle: Vec, wa: number, wb: number, t0: number, bulge = 3.2): string {
  const dx = ankle.x - knee.x, dy = ankle.y - knee.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const at = (t: number, side: number, back = 0): Pt => {
    const w = (wa + (wb - wa) * t) / 2;
    return P(knee.x + dx * t + nx * w * side - ux * back, knee.y + dy * t + ny * w * side - uy * back);
  };
  const end = 1.18;
  return smoothPath([
    { ...at(end, 1), c: true },
    at(t0 + 0.14, 1),
    at(t0, 0.82, 0.6),
    at(t0, 0, bulge),
    at(t0, -0.82, 0.6),
    at(t0 + 0.14, -1),
    { ...at(end, -1), c: true },
  ]);
}

function legPose(frame: Frame, name: string, leg: S.Leg, rest: typeof NEAR_REST, hip: Xf, p: number, walk: number, t: TuneB) {
  const step = footStep(p, walk, t);
  const ankle = { x: leg.ankle.x + step.dx, y: leg.ankle.y - step.lift };
  const a = applyXf(hip, leg.socket);
  const k = Math.pow(dist(a, ankle) / rest.d0, LEG_STRETCH);
  const knee = elbow(a, ankle, rest.l1 * k, rest.l2 * k, rest.sign);
  frame[`${name}-thigh`] = { d: taperedLimb(a, knee, leg.wHip, leg.wKnee, 0, 0, 1, 1) };
  frame[`${name}-knee`] = dot(knee);
  frame[`${name}-shin`] = { d: taperedLimb(knee, ankle, leg.wKnee, leg.wAnkle, 0, 0, 1, 1) };
  frame[`${name}-sock`] = { d: sockPath(knee, ankle, leg.wKnee, leg.wAnkle, leg.sockAt) };
  frame[`${name}-foot`] = {
    transform: `translate(${step.dx.toFixed(2)} ${(-step.lift).toFixed(2)}) rotate(${step.rot.toFixed(2)} ${leg.ankle.x} ${leg.ankle.y})`,
  };
}

/** Hàm thuần: cùng trạng thái + cấu hình → cùng hình. Dùng cho cả SSR lẫn mỗi tick. */
export function computePoseB(s: RigBState, t: TuneB = TUNE_B): Frame {
  const up = ((1 - Math.cos(2 * TAU * s.phase)) / 2) * s.walk; // 0 khi chân chạm đất, 1 giữa hai bước
  const y = -t.bounce * up + s.hop;
  const hip: Xf = {
    tx: 0, ty: y,
    deg: -t.hipRot * up + t.wagRot * s.wag,
    cx: S.HIP_PIVOT.x, cy: S.HIP_PIVOT.y,
  };
  const body: Xf = { tx: 0, ty: y * 0.55, deg: 0, cx: S.HIP_PIVOT.x, cy: S.HIP_PIVOT.y };
  const head: Xf = { tx: 0, ty: y * 0.4, deg: t.nod * s.nod + 1.5 * up, cx: S.NECK.x, cy: S.NECK.y };
  const m = 0.4 + 0.6 * clamp(s.mouth, 0, 1);
  const blush = clamp(s.blush, 0, 1);

  const frame: Frame = {
    hip: { transform: xfAttr(hip) },
    body: { transform: xfAttr(body) },
    head: { transform: xfAttr(head) },
    'hip-outline': { d: smoothPath(S.HIP_OUTLINE.map((p) => deformHip(p, s, t))) },
    mouth: { transform: `translate(${S.MOUTH_HINGE_X} 0) scale(${m.toFixed(3)} 1) translate(${-S.MOUTH_HINGE_X} 0)` },
    blush: { opacity: (0.8 + 0.2 * blush).toFixed(3) },
    shadow: { rx: (S.SHADOW.rx * (1 - 0.1 * up + s.hop * 0.01)).toFixed(1) },
  };
  S.HIP_LINES.forEach((line, i) => {
    frame[`hip-line-${i}`] = { d: smoothPath(line.map((p) => deformHip(p, s, t)), false) };
  });
  legPose(frame, 'leg-near', S.LEG_NEAR, NEAR_REST, hip, frac(s.phase), s.walk, t);
  legPose(frame, 'leg-far', S.LEG_FAR, FAR_REST, hip, frac(s.phase + 0.5), s.walk, t);
  return frame;
}
