export type Vec = { x: number; y: number };
/** Điểm neo; `c` = góc nhọn (không làm trơn qua điểm này). */
export type Pt = Vec & { c?: boolean };

export const P = (x: number, y: number, c = false): Pt => ({ x, y, c });

const f = (n: number) => Math.round(n * 10) / 10;

/**
 * Dựng path Bezier trơn đi qua các điểm neo (Catmull-Rom → cubic).
 * Số lệnh và thứ tự luôn giống nhau với cùng một mảng điểm, nên mọi biến dạng
 * của mảng điểm đều cho ra path "cùng cấu trúc" – morph không bao giờ xoắn.
 */
export function smoothPath(pts: Pt[], closed = true): string {
  const n = pts.length;
  if (n < 2) return '';
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1 = p1.c ? p1 : { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = p2.c ? p2 : { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += `C${f(c1.x)} ${f(c1.y)} ${f(c2.x)} ${f(c2.y)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return closed ? d + 'Z' : d;
}

export const polyline = (pts: Vec[]) => 'M' + pts.map((p) => `${f(p.x)} ${f(p.y)}`).join('L');

/** Biến đổi nhóm: xoay `deg` quanh tâm (cx, cy) rồi dịch (tx, ty). */
export type Xf = { tx: number; ty: number; deg: number; cx: number; cy: number };

export const xfAttr = (t: Xf) =>
  `translate(${f(t.tx)} ${f(t.ty)}) rotate(${Math.round(t.deg * 100) / 100} ${t.cx} ${t.cy})`;

export function applyXf(t: Xf, p: Vec): Vec {
  const r = (t.deg * Math.PI) / 180;
  const c = Math.cos(r), s = Math.sin(r);
  const dx = p.x - t.cx, dy = p.y - t.cy;
  return { x: t.cx + dx * c - dy * s + t.tx, y: t.cy + dx * s + dy * c + t.ty };
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
