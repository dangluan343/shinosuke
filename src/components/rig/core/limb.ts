import { polyline, type Vec } from './path';

/**
 * Chi "ống cao su" thon dần: đường tâm là Bezier bậc 2 từ a → b,
 * gối bị đẩy vuông góc ra `bend` đơn vị. Trả về đa giác kín cho đoạn [t0, t1].
 */
export function taperedLimb(
  a: Vec, b: Vec, wa: number, wb: number, bend: number, t0 = 0, t1 = 1, steps = 8,
): string {
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const k = { x: (a.x + b.x) / 2 + (-dy / len) * bend, y: (a.y + b.y) / 2 + (dx / len) * bend };
  const left: Vec[] = [], right: Vec[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = t0 + ((t1 - t0) * i) / steps, u = 1 - t;
    const x = u * u * a.x + 2 * u * t * k.x + t * t * b.x;
    const y = u * u * a.y + 2 * u * t * k.y + t * t * b.y;
    const tx = 2 * u * (k.x - a.x) + 2 * t * (b.x - k.x);
    const ty = 2 * u * (k.y - a.y) + 2 * t * (b.y - k.y);
    const tl = Math.hypot(tx, ty) || 1;
    const h = (wa + (wb - wa) * t) / 2;
    left.push({ x: x + (-ty / tl) * h, y: y + (tx / tl) * h });
    right.push({ x: x - (-ty / tl) * h, y: y - (tx / tl) * h });
  }
  return polyline([...left, ...right.reverse()]) + 'Z';
}

/** Độ gập gối để tổng chiều dài chi gần như không đổi khi hai đầu lại gần nhau. */
export function kneeBend(a: Vec, b: Vec, restLen: number, gain = 0.6, max = 14): number {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  if (d >= restLen) return 0;
  return Math.min(max, Math.sqrt((restLen / 2) ** 2 - (d / 2) ** 2) * gain);
}

/** IK hai đoạn: tìm khuỷu khi biết vai `s`, cổ tay `w` và độ dài hai đoạn. */
export function elbow(s: Vec, w: Vec, l1: number, l2: number, sign: 1 | -1): Vec {
  const dx = w.x - s.x, dy = w.y - s.y;
  const d = Math.hypot(dx, dy) || 1;
  const dc = Math.max(Math.abs(l1 - l2) + 0.01, Math.min(l1 + l2 - 0.01, d));
  const along = (l1 * l1 - l2 * l2 + dc * dc) / (2 * dc);
  const h = Math.sqrt(Math.max(0, l1 * l1 - along * along));
  const ux = dx / d, uy = dy / d;
  return { x: s.x + ux * along - uy * h * sign, y: s.y + uy * along + ux * h * sign };
}
