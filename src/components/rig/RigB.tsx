'use client';

import { useId, useRef, type Ref } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { makeApplier } from './core/apply';
import { clamp, smoothPath } from './core/path';
import { Playback } from './core/playback';
import { Spring } from './core/spring';
import { useRigCore, type RigHandle } from './core/useRig';
import * as S from './rigB.shapes';
import { computePoseB, REST_B, TUNE_B, type RigBState, type TuneB } from './rigB.pose';

gsap.registerPlugin(useGSAP);

const C = S.COLORS;
const TAU = Math.PI * 2;

const D = {
  face: smoothPath(S.FACE),
  mouth: smoothPath(S.MOUTH),
  hair: smoothPath(S.HAIR),
  ear: smoothPath(S.EAR),
  earLine: smoothPath(S.EAR_LINE, false),
  shirt: smoothPath(S.SHIRT),
  shoes: { near: smoothPath(S.LEG_NEAR.shoe), far: smoothPath(S.LEG_FAR.shoe) },
  soles: { near: smoothPath(S.LEG_NEAR.sole), far: smoothPath(S.LEG_FAR.sole) },
};
const LEGS = [
  ['leg-far', S.LEG_FAR, 'far'],
  ['leg-near', S.LEG_NEAR, 'near'],
] as const;
const PASSES = ['outline', 'fill'] as const;

/** Nét viền mảnh ~2,2 px như ảnh gốc, màu viền theo từng mảng. */
const stroke = (color: string = C.line) =>
  ({ fill: 'none', stroke: color, strokeWidth: S.STROKE, strokeLinecap: 'round', strokeLinejoin: 'round' }) as const;
const outlined = (fill: string, color: string = C.line) => ({ ...stroke(color), fill }) as const;
/** Hai lượt vẽ của khối da (đùi + gối + ống chân): lượt viền nở ra ngoài, rồi lượt màu phủ lên. */
const solid = (pass: 'outline' | 'fill') =>
  pass === 'outline'
    ? ({ fill: C.skinLine, stroke: C.skinLine, strokeWidth: S.STROKE * 2, strokeLinejoin: 'round' } as const)
    : ({ fill: C.skin } as const);
const ball = (r: number, pass: 'outline' | 'fill') =>
  pass === 'outline' ? { r: r + S.STROKE, fill: C.skinLine } : { r, fill: C.skin };

export type RigView = 'none' | 'only' | 'onion' | 'difference';

export type RigBProps = {
  className?: string;
  /** Chồng ảnh gốc để kiểm tra: chỉ ảnh, mờ 55% hoặc chế độ "difference" (khớp = đen). */
  reference?: RigView;
  /** Play/Pause. Dừng thì đứng yên đúng khung đang hiển thị; chạy lại thì tiếp tục từ đó. */
  playing?: boolean;
  /** Tư thế chỉnh tay – chỉ áp dụng khi đang dừng. */
  pose?: Partial<RigBState>;
  /** Cấu hình chuyển động – áp dụng ngay, cả khi đang chạy. */
  tune?: Partial<TuneB>;
  /** Chạy qua lại trong khung cha và tự lật khi chạm mép. Tắt = đi tại chỗ. */
  roam?: boolean;
  ref?: Ref<RigHandle<RigBState>>;
};

export default function RigB({ className, reference = 'none', playing = true, pose, tune, roam = false, ref }: RigBProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const clipId = `face-clip-${useId().replace(/:/g, '')}`;
  const core = useRigCore({ ref, playing, pose, tune, rest: REST_B, defaults: TUNE_B, compute: computePoseB });
  const frame = core.initialFrame;
  const part = (name: string) => ({ 'data-part': name, ...frame[name] });

  useGSAP(
    (_ctx, contextSafe) => {
      const svg = svgRef.current;
      if (!svg || !contextSafe) return;
      const stage = stageRef.current;
      const mover = moverRef.current;
      const roaming = roam && !!stage && !!mover;

      const apply = makeApplier(svg);
      core.applyRef.current = apply;
      const pb = new Playback(core.playingRef.current);
      core.playbackRef.current = pb;
      const T = pb.track.bind(pb);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Tốc độ đi luôn đều: không có trạng thái tăng tốc hay lắc giật.
      const st = { phase: 0, walk: 0, hop: 0, laugh: 0, flip: -1, hover: 0 };
      const speed = reduce ? 0.5 : 1;
      const jig = new Spring(160, 12);
      let dir: 1 | -1 = -1; // 1 = đi sang trái (như hình vẽ), −1 = đi sang phải (lật gương)
      let mode: 'walk' | 'busy' = 'walk';
      let x = 0, maxX = 0, unitPx = 1;
      let lastTurn = 0;

      const measure = () => {
        if (!roaming) return;
        const w = mover.offsetWidth;
        maxX = Math.max(0, stage.clientWidth - w);
        unitPx = w / S.VIEWBOX.w;
        x = clamp(x, 0, maxX);
      };
      measure();
      T(gsap.to(st, { walk: 1, duration: 0.4, ease: 'power1.out' }));

      /** Quay đầu: chậm bước → nhún nhẹ + lật gương → đi tiếp theo hướng mới (nhịp mềm, không giật). */
      const turn = () => {
        if (mode !== 'walk') return;
        mode = 'busy';
        lastTurn = performance.now();
        const next = (dir === 1 ? -1 : 1) as 1 | -1;
        T(
          gsap.timeline({ onComplete: () => { mode = 'walk'; } })
            .to(st, { walk: 0, duration: 0.25, ease: 'sine.inOut' })
            .to(st, { hop: -6, duration: 0.25, ease: 'sine.out' })
            .to(st, { flip: next, duration: 0.5, ease: 'sine.inOut' }, '<')
            .add(() => { dir = next; })
            .to(st, { hop: 0, duration: 0.25, ease: 'sine.in' }, '-=0.25')
            .to(st, { walk: 1, duration: 0.3, ease: 'sine.inOut' }),
        );
      };

      /** Bấm vào nhân vật: cười to một hơi (đều nhịp); khi đang chạy qua lại thì quay đầu. */
      const react = () => {
        T(gsap.timeline().to(st, { laugh: 1, duration: 0.3, ease: 'sine.out' }).to(st, { laugh: 0, duration: 0.6, ease: 'sine.inOut' }, '+=0.3'));
        if (roaming) turn();
      };

      const tick = (_time: number, deltaMs: number) => {
        if (!pb.running) return;
        const t = core.tuneRef.current;
        const dt = Math.min(deltaMs, 100) / 1000;
        if (mode === 'walk') {
          const dphi = (dt / Math.max(0.2, t.cycle)) * speed * st.walk;
          st.phase += dphi;
          if (roaming && maxX > 8) {
            // Thân tiến đúng 2 × step mỗi chu kỳ = quãng chân trụ trượt lùi → chân không trượt sàn.
            x -= dir * dphi * 2 * t.step * unitPx;
            if (dir === 1 && x <= 0) { x = 0; turn(); }
            else if (dir === -1 && x >= maxX) { x = maxX; turn(); }
          }
        }
        jig.target = Math.sin(2 * TAU * st.phase) * 0.3 * st.walk;
        jig.step(dt);
        const ha = Math.sin(TAU * st.phase + 0.8); // cười một nhịp mỗi bước, đều theo nhịp đi
        const s: RigBState = {
          phase: st.phase - Math.floor(st.phase), // chỉ phần lẻ: hình lặp lại sau mỗi chu kỳ, thanh trượt 0…1 hiển thị đúng
          walk: st.walk,
          wag: 0,
          jig: jig.x,
          mouth: Math.max(st.laugh, 0.45 + 0.55 * ha * ha * st.walk + 0.55 * (1 - st.walk)),
          nod: Math.sin(2 * TAU * st.phase + 0.6) * 0.6 * st.walk,
          hop: st.hop,
          blush: Math.max(st.hover, st.laugh),
        };
        core.stateRef.current = s;
        apply(computePoseB(s, t));
        if (roaming) mover.style.transform = `translate3d(${x.toFixed(1)}px,0,0) scaleX(${st.flip.toFixed(3)})`;
      };
      gsap.ticker.add(tick);

      // ── Tương tác (không làm gì khi đang dừng) ──
      const onEnter = contextSafe(() => {
        if (!pb.running) return;
        T(gsap.to(st, { hover: 1, duration: 0.3, overwrite: 'auto' }));
      });
      const onLeave = contextSafe(() => {
        if (!pb.running) return;
        T(gsap.to(st, { hover: 0, duration: 0.5, overwrite: 'auto' }));
      });
      const onDown = contextSafe(() => {
        if (pb.running) react();
      });
      const onKey = contextSafe((e: KeyboardEvent) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        if (pb.running) react();
      });
      /** Con trỏ chặn ngay trước mặt → quay đầu chạy hướng ngược lại. */
      const onMove = contextSafe((e: PointerEvent) => {
        if (!pb.running || !roaming || mode !== 'walk' || performance.now() - lastTurn < 1200) return;
        const r = svg.getBoundingClientRect();
        if (e.clientY < r.top - 30 || e.clientY > r.bottom + 30) return;
        const ahead = dir === 1 ? r.left - e.clientX : e.clientX - r.right;
        if (ahead > 0 && ahead < 90) turn();
      });
      svg.addEventListener('pointerenter', onEnter);
      svg.addEventListener('pointerleave', onLeave);
      svg.addEventListener('pointerdown', onDown);
      svg.addEventListener('keydown', onKey);
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('resize', measure);

      const io = new IntersectionObserver(([entry]) => pb.setVisible(entry.isIntersecting));
      io.observe(roaming ? stage : svg);

      return () => {
        gsap.ticker.remove(tick);
        io.disconnect();
        core.applyRef.current = null;
        core.playbackRef.current = null;
        svg.removeEventListener('pointerenter', onEnter);
        svg.removeEventListener('pointerleave', onLeave);
        svg.removeEventListener('pointerdown', onDown);
        svg.removeEventListener('keydown', onKey);
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('resize', measure);
      };
    },
    { scope: svgRef, dependencies: [roam] },
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

  const svg = (
    <svg
      ref={svgRef}
      className={roam ? undefined : className}
      viewBox={`${S.VIEWBOX.x} ${S.VIEWBOX.y} ${S.VIEWBOX.w} ${S.VIEWBOX.h}`}
      role="button"
      tabIndex={0}
      aria-label="Nhân vật chổng mông vừa đi vừa cười – bấm để cười và quay đầu"
      style={{
        touchAction: 'pan-y',
        shapeRendering: 'geometricPrecision',
        display: 'block',
        width: '100%',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {reference !== 'none' && (
        <image href="/reference/pose-b-butt-walk.png" width={S.REF_SIZE.w} height={S.REF_SIZE.h} />
      )}
      <g style={rigStyle}>
        <ellipse {...part('shadow')} cx={S.SHADOW.cx} cy={S.SHADOW.cy} ry={S.SHADOW.ry} fill="#4a3a8f" opacity={0.18} />

        {/* Chân xa rồi chân gần: đùi + gối + ống chân (hai lượt) → tất → giày */}
        {LEGS.map(([name, leg, key]) => (
          <g key={name}>
            {PASSES.map((pass) => (
              <g key={pass}>
                <path {...part(`${name}-thigh`)} {...solid(pass)} />
                <circle {...part(`${name}-knee`)} {...ball(leg.wKnee / 2, pass)} />
                <path {...part(`${name}-shin`)} {...solid(pass)} />
              </g>
            ))}
            <path {...part(`${name}-sock`)} {...outlined(C.sock)} />
            <g {...part(`${name}-foot`)}>
              <path d={D.shoes[key]} {...outlined(C.shoe)} />
              <path d={D.soles[key]} {...outlined(C.sole)} />
            </g>
          </g>
        ))}

        {/* Thân: nắm tay sau → áo → nắm tay trước */}
        <g {...part('body')}>
          <ellipse {...S.FIST_BACK} {...outlined(C.skin, C.skinLine)} />
          <path d={D.shirt} {...outlined(C.shirt, C.shirtLine)} />
          <line x1={S.SHIRT_SEAM[0].x} y1={S.SHIRT_SEAM[0].y} x2={S.SHIRT_SEAM[1].x} y2={S.SHIRT_SEAM[1].y} {...stroke(C.shirtLine)} />
          <ellipse {...S.FIST_FRONT} {...outlined(C.skin, C.skinLine)} />
        </g>

        {/* Đầu: da mặt → miệng (cắt theo da mặt) → viền mặt đè lên → má hồng → tóc → tai */}
        <g {...part('head')}>
          <clipPath id={clipId}>
            <path d={D.face} />
          </clipPath>
          <path d={D.face} fill={C.skin} />
          <g clipPath={`url(#${clipId})`}>
            <g {...part('mouth')}>
              <path d={D.mouth} {...outlined(C.mouth, C.mouthLine)} strokeWidth={S.STROKE * 1.1} />
            </g>
          </g>
          <path d={D.face} {...stroke(C.skinLine)} />
          <g data-part="blush" stroke={C.blush} strokeWidth={2} strokeLinecap="round" opacity={frame.blush.opacity}>
            {S.BLUSH.map(([a, b], i) => (
              <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            ))}
          </g>
          <path d={D.hair} {...outlined(C.hair, C.line)} />
          <path d={D.ear} {...outlined(C.skin, C.skinLine)} />
          <path d={D.earLine} {...stroke(C.skinLine)} />
        </g>

        {/* Hông / quần: phủ lên áo, tóc và gốc chân */}
        <g {...part('hip')}>
          <path {...part('hip-outline')} {...outlined(C.shorts, C.shortsLine)} />
          {S.HIP_LINES.map((_, i) => (
            <path key={i} {...part(`hip-line-${i}`)} {...stroke(C.shortsLine)} />
          ))}
        </g>
      </g>
    </svg>
  );

  if (!roam) return svg;
  return (
    <div ref={stageRef} className={className} style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div
        ref={moverRef}
        style={{
          position: 'relative',
          width: 'min(320px, 62vw)',
          transform: 'scaleX(-1)',
          transformOrigin: '50% 50%',
          willChange: 'transform',
        }}
      >
        {svg}
      </div>
    </div>
  );
}
