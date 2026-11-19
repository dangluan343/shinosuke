import type gsap from 'gsap';

type Anim = gsap.core.Animation;

/**
 * Gom mọi tween/timeline cấp cao nhất của một rig để Play/Pause cùng lúc
 * mà KHÔNG reset: dừng ở đâu, chạy tiếp từ đó.
 *
 * Mọi `gsap.to / gsap.timeline / gsap.fromTo` trong rig phải đi qua `track()`,
 * kể cả các tween tạo trong trình xử lý sự kiện (hover, chọc, quay đầu…).
 * Tween con nằm trong một timeline thì không cần track – timeline cha lo.
 */
export class Playback {
  private items = new Set<Anim>();
  private held: Anim[] = [];
  private visible = true;
  private playing: boolean;

  constructor(playing: boolean) {
    this.playing = playing;
  }

  /** Rig có đang chạy không (đang Play VÀ đang nằm trong khung nhìn). */
  get running() {
    return this.playing && this.visible;
  }

  track<A extends Anim>(a: A): A {
    this.items.add(a);
    if (!this.running) this.hold(a);
    return a;
  }

  setPlaying(v: boolean) {
    this.playing = v;
    this.sync();
  }

  setVisible(v: boolean) {
    this.visible = v;
    this.sync();
  }

  private hold(a: Anim) {
    if (!a.paused() && a.totalProgress() < 1) {
      a.pause();
      this.held.push(a);
    }
  }

  private sync() {
    if (this.running) {
      for (const a of this.held.splice(0)) a.resume();
    } else {
      for (const a of this.items) this.hold(a);
    }
    // dọn các tween đã xong
    for (const a of this.items) if (a.totalProgress() >= 1) this.items.delete(a);
  }
}
