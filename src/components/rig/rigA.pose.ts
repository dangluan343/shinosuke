import { applyXf, clamp, lerp, polyline, smoothPath, xfAttr, type Pt, type Vec, type Xf } from './core/path';
import { elbow, kneeBend, taperedLimb } from './core/limb';
import type { Frame } from './core/apply';
import * as S from './rigA.shapes';

/** Toàn bộ trạng thái của rig. Mọi nguồn chuyển động chỉ ghi vào đây. */
export type RigState = {
  sway: number; // −1 (hết trái) … 1 (hết phải)
  dip: number; // nhún xuống, px
  jump: number; // bật lên khi bị chọc, px (âm = lên)
  lean: number; // nghiêng theo con trỏ, px
  heelL: number; // −1 (gót hạ) … 1 (gót nhấc)
  heelR: number;
  jig: number; // rung phụ của mông (lò xo)
  hemLag: number; // gấu quần trễ theo hông
  headRot: number; // độ, cộng thêm vào hướng của thân
  brow: number; // 0…1 lông mày nhướng
  blush: number; // 0…1 má hồng đậm thêm
};

export const REST: RigState = {
  sway: 0, dip: 0, jump: 0, lean: 0, heelL: 0, heelR: 0, jig: 0, hemLag: 0, headRot: 0, brow: 0, blush: 0,
};

/**
 * Cấu hình chuyển động mặc định. Mọi giá trị được đọc lại mỗi khung hình,
 * nên chỉnh trên trang lab là thấy ngay, kể cả khi đang chạy.
 */
export const TUNE = {
  hipX: 10, // px
  hipRot: 4.5, // độ
  torsoRot: 1.2, // thân xoay ngược hông; để nhỏ vì tay rất ngắn so với khoảng vai–cạp quần
  torsoFollow: 0.7, // thân dịch theo hông bao nhiêu phần
  armStretch: 0.7, // 0 = xương cứng (khuỷu dễ bật), 1 = co giãn hoàn toàn (góc khuỷu không đổi)
  heelLift: 0.11, // bàn chân dài thêm khi nhấc gót
  footTurn: 5, // độ
  dipDepth: 6, // px: nhún ở mỗi đầu biên lắc
  jigAmp: 9, // px: mông văng trễ theo lò xo
  hemAmp: 12, // px: gấu quần văng trễ
  leanAmp: 7, // px: ngả theo con trỏ
  tempo: 1, // nhân tốc độ cả điệu nhảy
};
export type TuneA = typeof TUNE;

const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

const armRest = (arm: S.Arm) => {
  const l1 = dist(arm.shoulder, arm.elbowRest);
  const l2 = dist(arm.elbowRest, arm.wrist);
  const a = elbow(arm.shoulder, arm.wrist, l1, l2, 1);
  const b = elbow(arm.shoulder, arm.wrist, l1, l2, -1);
  const sign: 1 | -1 = dist(a, arm.elbowRest) < dist(b, arm.elbowRest) ? 1 : -1;
  return { l1, l2, sign, d0: dist(arm.shoulder, arm.wrist) };
};
const ARM_L_REST = armRest(S.ARM_L);
const ARM_R_REST = armRest(S.ARM_R);
const LEG_L_REST = dist(S.LEG_L.socket, S.LEG_L.ankle);
const LEG_R_REST = dist(S.LEG_R.socket, S.LEG_R.ankle);

function deformHip(p: Pt, s: RigState, t: TuneA): Pt {
  const v = clamp((p.y - S.HIP_PIVOT.y) / 160, 0, 1); // 0 ở cạp, 1 ở gấu
  return {
    x: p.x + s.jig * t.jigAmp * Math.sin(Math.PI * v * 0.9) + s.hemLag * t.hemAmp * v * v,
    y: p.y - Math.abs(s.jig) * 3 * v,
    c: p.c,
  };
}

function footPose(leg: typeof S.LEG_L, heel: number, outward: 1 | -1, t: TuneA) {
  const sy = 1 + t.heelLift * heel;
  const deg = heel > 0 ? t.footTurn * heel * outward : 0;
  const r = (deg * Math.PI) / 180;
  const lx = leg.ankle.x - leg.toe.x;
  const ly = (leg.ankle.y - leg.toe.y) * sy;
  const ankle = {
    x: leg.toe.x + lx * Math.cos(r) - ly * Math.sin(r),
    y: leg.toe.y + lx * Math.sin(r) + ly * Math.cos(r),
  };
  const transform =
    `translate(${leg.toe.x} ${leg.toe.y}) rotate(${deg.toFixed(2)}) ` +
    `scale(1 ${sy.toFixed(4)}) translate(${-leg.toe.x} ${-leg.toe.y})`;
  return { ankle, transform };
}

function legPose(leg: typeof S.LEG_L, rest: number, hip: Xf, ankle: Vec) {
  const a = applyXf(hip, leg.socket);
  const bend = kneeBend(a, ankle, rest) * leg.bendSign;
  return {
    skin: taperedLimb(a, ankle, leg.wTop, leg.wBottom, bend, 0, leg.sockAt),
    sock: taperedLimb(a, ankle, leg.wTop, leg.wBottom, bend, leg.sockAt, 1),
  };
}

const dot = (p: Vec) => ({ cx: p.x.toFixed(1), cy: p.y.toFixed(1) });

function armPose(frame: Frame, side: 'l' | 'r', arm: S.Arm, rest: typeof ARM_L_REST, torso: Xf, hip: Xf, t: TuneA) {
  const s = applyXf(torso, arm.shoulder);
  const w = applyXf(hip, arm.wrist);
  const fist = applyXf(hip, arm.fist);
  // IK mềm: hai đoạn tay co giãn theo khoảng vai–cổ tay nên khuỷu không bật ra khi bị nén.
  const k = Math.pow(dist(s, w) / rest.d0, t.armStretch);
  const e = elbow(s, w, rest.l1 * k, rest.l2 * k, rest.sign);
  const fore = (t0: number) => taperedLimb(e, w, arm.wForeTop, arm.wWrist, 0, t0, 1, 1);
  frame[`arm-${side}-upper`] = { d: taperedLimb(s, e, arm.wShoulder, arm.wElbow, 0, 0, 1, 1) };
  frame[`arm-${side}-elbow`] = dot(e);
  frame[`arm-${side}-fore`] = { d: fore(0) };
  frame[`arm-${side}-wrist`] = dot(w);
  frame[`arm-${side}-hand`] = { d: polyline([w, fist]) };
  frame[`fist-${side}`] = dot(fist);
  // Phần vẽ lại phía trên quần: lớp màu bắt đầu sớm hơn lớp viền để phủ kín mép cắt.
  frame[`hand-${side}`] = { d: fore(0.55) };
  frame[`hand-${side}-fill`] = { d: fore(0.42) };
  if (arm.thumb) frame[`thumb-${side}`] = { d: polyline([fist, applyXf(hip, arm.thumb)]) };
}

/** Hàm thuần: cùng trạng thái + cấu hình → cùng hình. Dùng cho cả SSR lẫn mỗi tick. */
export function computePose(s: RigState, t: TuneA = TUNE): Frame {
  const hipX = s.sway * t.hipX + s.lean;
  const hipY = s.dip + s.jump;
  const hip: Xf = { tx: hipX, ty: hipY, deg: -s.sway * t.hipRot, cx: S.HIP_PIVOT.x, cy: S.HIP_PIVOT.y };
  const torso: Xf = {
    tx: hipX * t.torsoFollow,
    ty: hipY * 0.85,
    deg: s.sway * t.torsoRot,
    cx: S.HIP_PIVOT.x,
    cy: S.HIP_PIVOT.y,
  };
  const neck = applyXf(torso, S.NECK);
  const head: Xf = {
    tx: neck.x - S.NECK.x,
    ty: neck.y - S.NECK.y,
    deg: torso.deg * 0.5 + s.headRot,
    cx: S.NECK.x,
    cy: S.NECK.y,
  };

  const footL = footPose(S.LEG_L, s.heelL, -1, t);
  const footR = footPose(S.LEG_R, s.heelR, 1, t);
  const legL = legPose(S.LEG_L, LEG_L_REST, hip, footL.ankle);
  const legR = legPose(S.LEG_R, LEG_R_REST, hip, footR.ankle);

  const frame: Frame = {
    hip: { transform: xfAttr(hip) },
    torso: { transform: xfAttr(torso) },
    head: { transform: xfAttr(head) },
    'hip-outline': { d: smoothPath(S.HIP_OUTLINE.map((p) => deformHip(p, s, t))) },
    'leg-l-skin': { d: legL.skin },
    'leg-l-sock': { d: legL.sock },
    'leg-r-skin': { d: legR.skin },
    'leg-r-sock': { d: legR.sock },
    'foot-l': { transform: footL.transform },
    'foot-r': { transform: footR.transform },
    brow: { transform: `translate(0 ${(-4 * s.brow).toFixed(2)})` },
    blush: { opacity: (0.85 + 0.15 * clamp(s.blush, 0, 1)).toFixed(3), 'stroke-width': (4.5 + 2 * clamp(s.blush, 0, 1)).toFixed(2) },
    shadow: {
      transform: `translate(${(hipX * 0.6).toFixed(1)} 0)`,
      rx: (S.SHADOW.rx * (1 + s.dip * 0.01 + s.jump * 0.012)).toFixed(1),
    },
  };
  armPose(frame, 'l', S.ARM_L, ARM_L_REST, torso, hip, t);
  armPose(frame, 'r', S.ARM_R, ARM_R_REST, torso, hip, t);
  S.HIP_LINES.forEach((line, i) => {
    frame[`hip-line-${i}`] = { d: smoothPath(line.map((p) => deformHip(p, s, t)), false) };
  });
  return frame;
}
