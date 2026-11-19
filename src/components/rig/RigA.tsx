'use client';

import { useRef, type Ref } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { makeApplier } from './core/apply';
import { clamp, smoothPath } from './core/path';
import { Playback } from './core/playback';
import { Spring } from './core/spring';
import { useRigCore, type RigHandle } from './core/useRig';
import * as S from './rigA.shapes';
import { computePose, REST, TUNE, type RigState, type TuneA } from './rigA.pose';

gsap.registerPlugin(useGSAP);

const C = S.COLORS;
const TAU = Math.PI * 2;
const ARMS = [['l', S.ARM_L], ['r', S.ARM_R]] as const;

// Hình tĩnh (chỉ biến đổi cứng theo nhóm) – dựng một lần.
const D = {
  hair: smoothPath(S.HAIR),
  brow: smoothPath(S.BROW),
  face: smoothPath(S.FACE),
  cheek: smoothPath(S.CHEEK, false),
  ear: smoothPath(S.EAR),
  earLines: S.EAR_LINES.map((l) => smoothPath(l, false)),
  torso: smoothPath(S.TORSO),
  neck: smoothPath(S.NECK_PATCH),
  footL: smoothPath(S.FOOT_L),
  footR: smoothPath(S.FOOT_R),
};

const line = {
  fill: 'none',
  stroke: C.line,
  strokeWidth: S.STROKE,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;
const outlined = (fill: string) => ({ ...line, fill }) as const;
/** Hai lượt vẽ của khối da: lượt viền (đen, nở ra ngoài) rồi lượt màu phủ lên. */
const solid = (pass: 'outline' | 'fill') =>
  pass === 'outline'
    ? ({ fill: C.line, stroke: C.line, strokeWidth: S.STROKE * 2, strokeLinejoin: 'round' } as const)
    : ({ fill: C.skin } as const);
const ball = (r: number, pass: 'outline' | 'fill') =>
  pass === 'outline' ? { r: r + S.STROKE, fill: C.line } : { r, fill: C.skin };
const PASSES = ['outline', 'fill'] as const;
/** Chi vẽ bằng stroke: lớp viền đen rộng hơn nằm dưới, lớp màu da nằm trên. */
const hose = (width: number, pass: 'outline' | 'fill', cap: 'round' | 'butt' = 'round') =>
  ({
    fill: 'none',
    stroke: pass === 'outline' ? C.line : C.skin,
    strokeWidth: pass === 'outline' ? width + S.STROKE * 2 : width,
    strokeLinecap: cap,
    strokeLinejoin: 'round',
  }) as const;

export type RigView = 'none' | 'only' | 'onion' | 'difference';

export type RigAProps = {
  className?: string;
  /** Chồng ảnh gốc để kiểm tra: chỉ ảnh, mờ 55% hoặc chế độ "difference" (khớp = đen). */
  reference?: RigView;
  /** Play/Pause. Dừng thì đứng yên đúng khung đang hiển thị; chạy lại thì tiếp tục từ đó. */
  playing?: boolean;
  /** Tư thế chỉnh tay – chỉ áp dụng khi đang dừng. */
  pose?: Partial<RigState>;
  /** Cấu hình chuyển động – áp dụng ngay, cả khi đang chạy. */
  tune?: Partial<TuneA>;
  ref?: Ref<RigHandle<RigState>>;
};

export default function RigA({ className, reference = 'none', playing = true, pose, tune, ref }: RigAProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const hipRef = useRef<SVGGElement>(null);
  const core = useRigCore({ ref, playing, pose, tune, rest: REST, defaults: TUNE, compute: computePose });
  const frame = core.initialFrame;
  const part = (name: string) => ({ 'data-part': name, ...frame[name] });
  /** Bắp tay → khuỷu → cẳng tay → cổ tay → nắm tay, cho một lượt vẽ. */
  const armParts = (side: 'l' | 'r', arm: S.Arm, pass: 'outline' | 'fill') => (
    <g key={side}>
      <path {...part(`arm-${side}-upper`)} {...solid(pass)} />
      <circle {...part(`arm-${side}-elbow`)} {...ball(arm.wElbow / 2, pass)} />
      <path {...part(`arm-${side}-fore`)} {...solid(pass)} />
      <circle {...part(`arm-${side}-wrist`)} {...ball(arm.wWrist / 2, pass)} />
      <path {...part(`arm-${side}-hand`)} {...hose(arm.wWrist, pass)} />
      <circle {...part(`fist-${side}`)} {...ball(arm.rFist, pass)} />
    </g>
  );

  useGSAP(
    (_ctx, contextSafe) => {
      const svg = svgRef.current;
      const hipEl = hipRef.current;
      if (!svg || !hipEl || !contextSafe) return;

      const apply = makeApplier(svg);
      core.applyRef.current = apply;
      const pb = new Playback(core.playingRef.current);
      core.playbackRef.current = pb;
      const T = pb.track.bind(pb);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const ampScale = reduce ? 0.3 : 1;

      // Kênh nền do timeline điều khiển.
      const base = { phase: 0, extraDip: 0, jump: 0, nod: 0, brow: 0, blush: 0, hover: 0 };
      // Kênh phụ: lò xo đuổi theo kênh nền.
      const follow = new Spring(140, 9);
      const hem = new Spring(110, 9);
      const head = new Spring(90, 11);
      const lean = new Spring(60, 12);
      const poke = new Spring(260, 9);
      const ptr = { nx: 0 };

      // Câu nhạc 4 giây, tốc độ lắc ĐỀU: 4 lượt × 1 s. Phách cuối chỉ thêm điểm nhấn
      // (má hồng, gật đầu, nhướng mày) chứ không đổi tốc độ.
      const tl = T(gsap.timeline({ repeat: -1, defaults: { ease: 'none' } }));
      tl.to(base, { phase: 4, duration: 4 }, 0)
        .to(base, { blush: 1, duration: 0.4, ease: 'sine.inOut' }, 2.8)
        .to(base, { nod: 1, duration: 0.25, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 3)
        .to(base, { brow: 1, duration: 0.25, repeat: 1, yoyo: true, ease: 'sine.inOut' }, 3)
        .to(base, { blush: 0, duration: 0.45, ease: 'sine.inOut' }, 3.5);

      // Mở đầu: nhún lấy đà.
      T(
        gsap.timeline()
          .to(base, { extraDip: 8, duration: 0.35, ease: 'sine.inOut' })
          .to(base, { extraDip: 0, duration: 0.45, ease: 'sine.inOut' }),
      );

      const tick = (_time: number, deltaMs: number) => {
        if (!pb.running) return;
        const t = core.tuneRef.current;
        tl.timeScale(Math.max(0.05, t.tempo * (reduce ? 0.5 : 1)));
        const dt = Math.min(deltaMs, 100) / 1000;
        const sway = Math.sin(base.phase * TAU) * ampScale;
        follow.target = sway;
        hem.target = sway;
        follow.step(dt);
        hem.step(dt);
        poke.step(dt);
        lean.target = ptr.nx * t.leanAmp;
        lean.step(dt);
        head.target = -sway * 2 + ptr.nx * 5 + base.nod * 5;
        head.step(dt);
        const up = Math.max(sway, 0);
        const down = Math.min(sway, 0);
        const s: RigState = {
          sway,
          dip: t.dipDepth * sway * sway + base.extraDip,
          jump: base.jump,
          lean: lean.x,
          heelL: up + 0.6 * down, // hông sang phải → chân trái hết chịu lực → nhấc gót
          heelR: -down - 0.6 * up,
          jig: follow.x - sway + poke.x,
          hemLag: hem.x - sway,
          headRot: head.x,
          brow: base.brow,
          blush: Math.max(base.blush, base.hover),
        };
        core.stateRef.current = s;
        apply(computePose(s, t));
      };
      gsap.ticker.add(tick);

      // ── Tương tác (không làm gì khi đang dừng) ──
      const onMove = (e: PointerEvent) => {
        const r = svg.getBoundingClientRect();
        ptr.nx = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2), -1, 1);
      };
      const onLeaveWindow = () => { ptr.nx = 0; };
      const onEnter = contextSafe(() => {
        if (!pb.running) return;
        T(gsap.to(base, { hover: 1, duration: 0.3, overwrite: 'auto' }));
      });
      const onLeave = contextSafe(() => {
        if (!pb.running) return;
        T(gsap.to(base, { hover: 0, duration: 0.5, overwrite: 'auto' }));
      });
      const pokeIt = contextSafe((dir: number) => {
        if (!pb.running) return;
        poke.v += dir * 5; // xung lực nhẹ vào lò xo mông
        T(
          gsap.timeline()
            .to(base, { jump: -12, duration: 0.25, ease: 'sine.out' })
            .to(base, { jump: 0, duration: 0.45, ease: 'sine.inOut' }),
        );
      });
      const onDown = (e: PointerEvent) => {
        const r = hipEl.getBoundingClientRect();
        pokeIt(e.clientX < r.left + r.width / 2 ? 1 : -1);
      };
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        pokeIt(1);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeaveWindow);
      hipEl.addEventListener('pointerenter', onEnter);
      hipEl.addEventListener('pointerleave', onLeave);
      hipEl.addEventListener('pointerdown', onDown);
      hipEl.addEventListener('keydown', onKey);

      // Ra khỏi khung nhìn thì dừng; quay lại thì chỉ chạy tiếp nếu người dùng đang Play.
      const io = new IntersectionObserver(([entry]) => pb.setVisible(entry.isIntersecting));
      io.observe(svg);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        core.applyRef.current = null;
        core.playbackRef.current = null;
        window.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
        hipEl.removeEventListener('pointerenter', onEnter);
        hipEl.removeEventListener('pointerleave', onLeave);
        hipEl.removeEventListener('pointerdown', onDown);
        hipEl.removeEventListener('keydown', onKey);
      };
    },
    { scope: svgRef },
  );

  // Ảnh gốc và rig luôn nằm trong DOM; đổi chế độ xem chỉ đổi CSS để vòng tick không mất phần tử.
  const rigStyle =
    reference === 'only'
      ? ({ visibility: 'hidden' } as const)
      : reference === 'difference'
        ? ({ mixBlendMode: 'difference' } as const)
        : reference === 'onion'
          ? { opacity: 0.55 }
          : undefined;

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox={`${S.VIEWBOX.x} ${S.VIEWBOX.y} ${S.VIEWBOX.w} ${S.VIEWBOX.h}`}
      role="img"
      aria-label="Nhân vật đứng quay lưng lắc hông"
      style={{ touchAction: 'pan-y', shapeRendering: 'geometricPrecision', display: 'block' }}
    >
      {reference !== 'none' && (
        <image href="/reference/pose-a-back-sway.png" width={S.REF_SIZE.w} height={S.REF_SIZE.h} />
      )}
      {(
        <g style={rigStyle}>
          <ellipse {...part('shadow')} cx={S.SHADOW.cx} cy={S.SHADOW.cy} ry={S.SHADOW.ry} fill="#5b46a8" opacity={0.16} />

          {/* Chân: ống thon, đầu trên chìm trong quần, đầu dưới ghim vào bàn chân */}
          <path {...part('leg-l-skin')} {...outlined(C.skin)} />
          <path {...part('leg-l-sock')} {...outlined(C.sock)} />
          <path {...part('leg-r-skin')} {...outlined(C.skin)} />
          <path {...part('leg-r-sock')} {...outlined(C.sock)} />
          <g {...part('foot-l')}>
            <path d={D.footL} {...outlined(C.sock)} />
          </g>
          <g {...part('foot-r')}>
            <path d={D.footR} {...outlined(C.sock)} />
          </g>

          {/* Đầu – lớp sau: mặt nằm dưới vai */}
          <g {...part('head')}>
            <path d={D.face} {...outlined(C.skin)} />
            <path d={D.cheek} {...line} />
            <g data-part="blush" stroke={C.blush} strokeLinecap="round" opacity={frame.blush.opacity} strokeWidth={frame.blush['stroke-width']}>
              {S.BLUSH.map(([a, b], i) => (
                <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
              ))}
            </g>
          </g>

          {/* Thân + tay, lượt 1: viền đen của cả khối */}
          <g>
            <g {...part('torso')}>
              <path d={D.torso} {...solid('outline')} />
            </g>
            {ARMS.map(([side, arm]) => armParts(side, arm, 'outline'))}
          </g>
          {/* Lượt 2: màu da phủ lên – chỗ nối tay và thân tự liền mạch */}
          <g>
            <g {...part('torso')}>
              <path d={D.torso} fill={C.skin} />
              <path d={D.neck} fill={C.skin} />
              <line x1={S.SPINE[0].x} y1={S.SPINE[0].y} x2={S.SPINE[1].x} y2={S.SPINE[1].y} {...line} />
            </g>
            {ARMS.map(([side, arm]) => armParts(side, arm, 'fill'))}
          </g>

          {/* Hông / quần: mọi path được dựng lại mỗi tick từ cùng một bộ điểm */}
          <g
            ref={hipRef}
            {...part('hip')}
            role="button"
            tabIndex={0}
            aria-label="Chọc mông"
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            <path {...part('hip-outline')} {...outlined(C.shorts)} />
            {S.HIP_LINES.map((_, i) => (
              <path key={i} {...part(`hip-line-${i}`)} {...line} />
            ))}
          </g>

          {/* Bàn tay nắm cạp quần: nửa dưới cẳng tay vẽ lại phía trên quần */}
          <g style={{ pointerEvents: 'none' }}>
            {PASSES.map((pass) =>
              ARMS.map(([side, arm]) => (
                <g key={pass + side}>
                  <path {...part(pass === 'outline' ? `hand-${side}` : `hand-${side}-fill`)} {...solid(pass)} />
                  <circle {...part(`arm-${side}-wrist`)} {...ball(arm.wWrist / 2, pass)} />
                  <path {...part(`arm-${side}-hand`)} {...hose(arm.wWrist, pass)} />
                  {arm.thumb && <path {...part(`thumb-${side}`)} {...hose(arm.wThumb, pass)} />}
                  <circle {...part(`fist-${side}`)} {...ball(arm.rFist, pass)} />
                </g>
              )),
            )}
          </g>

          {/* Đầu – lớp trước: tóc phủ lên vai và lưng */}
          <g {...part('head')}>
            <path d={D.hair} fill={C.line} />
            <g {...part('brow')}>
              <path d={D.brow} fill={C.line} />
            </g>
            <path d={D.ear} {...outlined(C.skin)} />
            {D.earLines.map((d, i) => (
              <path key={i} d={d} {...line} />
            ))}
          </g>
        </g>
      )}
    </svg>
  );
}
