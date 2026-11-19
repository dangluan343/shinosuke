/** Lò xo tắt dần, tích phân bước cố định nên không phụ thuộc tốc độ khung hình. */
export class Spring {
  x: number;
  v = 0;
  target: number;
  constructor(public k: number, public c: number, x = 0) {
    this.x = x;
    this.target = x;
  }
  step(dt: number) {
    const h = 1 / 240;
    let left = Math.min(dt, 0.1);
    while (left > 1e-6) {
      const s = Math.min(h, left);
      const a = -this.k * (this.x - this.target) - this.c * this.v;
      this.v += a * s;
      this.x += this.v * s;
      left -= s;
    }
    return this.x;
  }
}
