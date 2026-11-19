'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { clsx } from 'clsx';
import { NeoBadge } from '@/components/ui/NeoBadge';
import { NeoButton } from '@/components/ui/NeoButton';
import { NeoCard } from '@/components/ui/NeoCard';
import RigA from '../RigA';
import RigB from '../RigB';
import type { RigHandle } from '../core/useRig';
import type { RigState } from '../rigA.pose';
import type { RigBState } from '../rigB.pose';
import { RIGS, type Param, type RigId } from './params';
import styles from './rig-lab.module.css';

type Values = Record<string, number>;
/** Chỉ các chế độ có rig đang chuyển động: rig riêng, hoặc rig đè lên ảnh gốc để so. */
type View = 'none' | 'onion' | 'difference';

const VIEWS: { id: View; label: string; hint: string }[] = [
  { id: 'none', label: 'Rig', hint: 'Chỉ rig đang chuyển động' },
  { id: 'onion', label: 'Chồng mờ', hint: 'Rig mờ 55% đè lên ảnh gốc' },
  { id: 'difference', label: 'Sai khác', hint: 'Chỗ khớp ảnh gốc hiện màu đen' },
];

const digits = (step: number) => (step >= 1 ? 0 : step >= 0.1 ? 1 : step >= 0.01 ? 2 : 3);
const fmt = (v: number, step: number) =>
  v.toLocaleString('vi-VN', { minimumFractionDigits: digits(step), maximumFractionDigits: digits(step) });
const withUnit = (v: number, prm: Param) => `${fmt(v, prm.step)}${prm.unit ? ` ${prm.unit}` : ''}`;

/** Một thông số: tên, khoá trong code, giá trị, mặc định, thanh trượt và mục đích. */
function ParamRow({
  prm,
  value,
  disabled,
  onChange,
}: {
  prm: Param;
  value: number;
  disabled?: boolean;
  onChange: (v: number | undefined) => void;
}) {
  const id = `prm-${prm.key}`;
  const changed = Math.abs(value - prm.def) > prm.step / 2;
  const fill = ((value - prm.min) / (prm.max - prm.min)) * 100;
  return (
    <div className="py-3 border-b-2 border-dashed border-on-background/15 last:border-b-0">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-label-bold text-sm text-on-background">
          {prm.label}
        </label>
        <span
          className={clsx(
            'font-mono text-sm font-bold tabular-nums px-1.5',
            changed ? 'bg-tertiary-fixed text-on-tertiary-fixed border-2 border-on-background' : 'text-on-background',
          )}
        >
          {withUnit(value, prm)}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-label-bold text-on-surface-variant">
        <code className="px-1.5 py-px bg-surface-container border-2 border-on-background/70 text-on-background">{prm.key}</code>
        <span>mặc định {withUnit(prm.def, prm)}</span>
        {changed && !disabled && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="inline-flex items-center gap-0.5 text-secondary hover:text-primary underline underline-offset-2"
          >
            <span className="material-symbols-outlined text-sm leading-none">undo</span>
            về mặc định
          </button>
        )}
      </div>
      <input
        id={id}
        type="range"
        min={prm.min}
        max={prm.max}
        step={prm.step}
        value={value}
        disabled={disabled}
        aria-describedby={`${id}-purpose`}
        onChange={(e) => onChange(Number(e.target.value))}
        className={clsx(styles.range, 'mt-2')}
        style={{ '--fill': `${fill}%` } as CSSProperties}
      />
      <p id={`${id}-purpose`} className="mt-1 font-body-md text-xs leading-5 text-on-surface-variant">
        {prm.purpose}
      </p>
    </div>
  );
}

function SectionTitle({ n, color, children }: { n: number; color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className={clsx('w-8 h-8 shrink-0 neo-brutalist-border flex items-center justify-center font-label-bold', color)}>{n}</span>
      <h2 className="font-headline-sm text-headline-sm uppercase">{children}</h2>
    </div>
  );
}

export default function RigLab({ initialRig = 'a' }: { initialRig?: RigId }) {
  const [rigId, setRigId] = useState<RigId>(initialRig);
  const [playing, setPlaying] = useState(false);
  const [view, setView] = useState<View>('none');
  const [poses, setPoses] = useState<Record<RigId, Values>>({ a: {}, b: {} });
  const [tunes, setTunes] = useState<Record<RigId, Values>>({ a: {}, b: {} });
  const [runKey, setRunKey] = useState(0);
  const [copied, setCopied] = useState<'' | 'ok' | 'manual'>('');
  const [panelOpen, setPanelOpen] = useState(false);

  // Esc đóng ngăn kéo thông số trên mobile.
  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanelOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panelOpen]);
  const rigARef = useRef<RigHandle<RigState>>(null);
  const rigBRef = useRef<RigHandle<RigBState>>(null);
  const codeRef = useRef<HTMLPreElement>(null);

  const spec = RIGS[rigId];
  const pose = poses[rigId];
  const tune = tunes[rigId];
  const value = (vals: Values, prm: Param) => vals[prm.key] ?? prm.def;

  const selectRig = (id: RigId) => {
    setRigId(id);
    window.history.replaceState(null, '', `?rig=${id}`);
  };

  /** Pause đóng băng ĐÚNG khung đang hiển thị (đọc trạng thái từ rig) để chỉnh tay tiếp từ đó. */
  const togglePlay = useCallback(() => {
    if (playing) {
      const snap = (rigId === 'a' ? rigARef.current?.getState() : rigBRef.current?.getState()) as Values | undefined;
      if (snap) setPoses((p) => ({ ...p, [rigId]: snap }));
      setPlaying(false);
    } else {
      setPlaying(true);
    }
  }, [playing, rigId]);

  // Phím cách = Play/Pause (trừ khi đang gõ hoặc đang đứng trên nút / thanh trượt / rig).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const el = e.target as HTMLElement | null;
      if (el?.closest('input, textarea, select, button, a, [role="button"]')) return;
      e.preventDefault();
      togglePlay();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlay]);

  const setPoseValue = (key: string, v: number | undefined) =>
    setPoses((p) => {
      const next = { ...p[rigId] };
      if (v === undefined) delete next[key];
      else next[key] = v;
      return { ...p, [rigId]: next };
    });
  const setTuneValue = (key: string, v: number | undefined) =>
    setTunes((t) => {
      const next = { ...t[rigId] };
      if (v === undefined) delete next[key];
      else next[key] = v;
      return { ...t, [rigId]: next };
    });
  const resetPose = () => {
    setPlaying(false);
    setPoses((p) => ({ ...p, [rigId]: {} }));
  };
  const resetTune = () => setTunes((t) => ({ ...t, [rigId]: {} }));

  const changedTune = spec.tune.filter((prm) => Math.abs(value(tune, prm) - prm.def) > prm.step / 2).length;
  const code = useMemo(() => {
    const name = rigId === 'a' ? 'TUNE' : 'TUNE_B';
    const file = rigId === 'a' ? 'rigA.pose.ts' : 'rigB.pose.ts';
    const lines = spec.tune.map((prm) => {
      const v = Number((tune[prm.key] ?? prm.def).toFixed(digits(prm.step) + 1));
      const mark = Math.abs(v - prm.def) > prm.step / 2 ? ` // đã đổi, mặc định ${prm.def}` : '';
      return `  ${prm.key}: ${v},${mark}`;
    });
    return `// ${file}\nexport const ${name} = {\n${lines.join('\n')}\n};`;
  }, [rigId, spec, tune]);

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(code);
      setCopied('ok');
    } catch {
      // Địa chỉ mạng LAN (http) không có clipboard API: bôi đen sẵn để người dùng tự Ctrl+C.
      const el = codeRef.current;
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      setCopied('manual');
    }
    window.setTimeout(() => setCopied(''), 2500);
  };

  const rigEl =
    rigId === 'a' ? (
      <RigA
        key={`a-${runKey}`}
        ref={rigARef}
        className="block w-full h-auto max-h-[68vh]"
        reference={view}
        playing={playing}
        pose={pose}
        tune={tune}
      />
    ) : (
      <RigB key={`b-${runKey}`} ref={rigBRef} reference={view} playing={playing} pose={pose} tune={tune} />
    );

  return (
    <main className="flex-grow p-4 sm:p-6 md:p-12 space-y-10 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="bg-tertiary-fixed text-on-tertiary-fixed neo-brutalist-border hard-shadow p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <NeoBadge variant="primary" rotate={-2} className="mb-3">
            Animation Lab
          </NeoBadge>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg leading-none tracking-tight uppercase">Rig Lab</h1>
          <p className="font-body-md mt-2 text-on-tertiary-fixed-variant max-w-2xl">
            So rig với ảnh gốc, chạy thử animation và chỉnh từng thông số. Số đo <b>px</b> là pixel của ảnh gốc.
          </p>
        </div>
        <div className="flex flex-wrap gap-3" role="tablist" aria-label="Chọn rig">
          {(['a', 'b'] as const).map((id) => (
            <NeoButton
              key={id}
              role="tab"
              aria-selected={rigId === id}
              variant={rigId === id ? 'secondary' : 'white'}
              size="sm"
              onClick={() => selectRig(id)}
            >
              {RIGS[id].name}
            </NeoButton>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-8 items-start">
        {/* Cột trái: sân khấu */}
        <div className="space-y-10 min-w-0">
          <section className="space-y-5">
            <SectionTitle n={1} color="bg-primary text-on-primary">
              Sân khấu – {spec.short}
            </SectionTitle>
            <p className="font-body-md text-sm text-on-surface-variant -mt-2">{spec.description}</p>

            {/* Khung hình + điều khiển phát gắn liền phía trên */}
            <div className="neo-brutalist-border hard-shadow bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b-[3px] border-on-background">
                <div className="flex items-center gap-2.5">
                  <NeoButton
                    variant={playing ? 'dark' : 'primary'}
                    size="sm"
                    onClick={togglePlay}
                    aria-pressed={playing}
                    aria-label={playing ? 'Pause' : 'Play'}
                    className="min-w-[104px]"
                    icon={<span className="material-symbols-outlined text-xl leading-none">{playing ? 'pause' : 'play_arrow'}</span>}
                  >
                    {playing ? 'Pause' : 'Play'}
                  </NeoButton>
                  <NeoButton
                    variant="white"
                    size="sm"
                    onClick={() => setRunKey((k) => k + 1)}
                    title="Chạy lại animation từ khung đầu tiên"
                    aria-label="Chạy lại từ đầu"
                    icon={<span className="material-symbols-outlined text-lg leading-none">replay</span>}
                  >
                    <span className="hidden sm:inline">Chạy lại</span>
                  </NeoButton>
                  <NeoButton
                    variant="white"
                    size="sm"
                    onClick={resetPose}
                    title="Dừng và đưa rig về tư thế giống ảnh gốc"
                    aria-label="Reset về tư thế chuẩn"
                    icon={<span className="material-symbols-outlined text-lg leading-none">restart_alt</span>}
                  >
                    <span className="hidden sm:inline">Reset</span>
                  </NeoButton>
                </div>
                <div className="flex neo-brutalist-border w-fit" role="radiogroup" aria-label="Chế độ xem">
                  {VIEWS.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      role="radio"
                      aria-checked={view === v.id}
                      title={v.hint}
                      onClick={() => setView(v.id)}
                      className={clsx(
                        'px-2.5 py-1 font-label-bold text-[11px] uppercase border-r-[3px] border-on-background last:border-r-0 transition-colors',
                        view === v.id ? 'bg-secondary text-on-secondary' : 'bg-white text-on-background hover:bg-surface-container-low',
                      )}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className={clsx(styles.stage, 'relative overflow-hidden')} style={{ '--stage-bg': spec.bg } as CSSProperties}>
                <NeoBadge variant={playing ? 'primary' : 'white'} size="sm" className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                  {playing ? 'Đang chạy' : 'Đang dừng'}
                </NeoBadge>
                {rigEl}
              </div>
            </div>
            <p className="font-caption text-xs text-on-surface-variant -mt-2">
              {VIEWS.find((v) => v.id === view)?.hint} · Phím cách: Play/Pause · Reset: dừng và về tư thế giống ảnh gốc
            </p>
          </section>

          {rigId === 'b' && (
            <section className="space-y-5">
              <SectionTitle n={4} color="bg-secondary-container text-on-secondary-container">
                Sân chạy qua lại
              </SectionTitle>
              <p className="font-body-md text-sm text-on-surface-variant -mt-2">
                Cùng cấu hình chuyển động ở trên, nhưng chạy ngang hết khung và tự lật khi chạm mép. Đưa chuột chặn trước mặt
                để đuổi quay lại; bấm vào nhân vật để cười rồi quay đầu.
              </p>
              <div className={clsx(styles.stage, 'neo-brutalist-border hard-shadow py-6')} style={{ '--stage-bg': spec.bg } as CSSProperties}>
                <RigB key={`roam-${runKey}`} roam playing={playing} tune={tune} />
              </div>
            </section>
          )}

          <section className="space-y-5">
            <SectionTitle n={rigId === 'b' ? 5 : 4} color="bg-on-background text-white">
              Cấu hình hiện tại
            </SectionTitle>
            <p className="font-body-md text-sm text-on-surface-variant -mt-2">
              Dán khối này vào file tương ứng để giữ cấu hình đã chỉnh làm mặc định.
            </p>
            <div className="relative">
              <pre
                ref={codeRef}
                className="bg-inverse-surface text-inverse-on-surface neo-brutalist-border hard-shadow p-5 overflow-x-auto text-xs leading-5 font-mono select-all"
              >
                {code}
              </pre>
              <NeoButton
                variant="tertiary"
                size="sm"
                onClick={copy}
                className="absolute top-3 right-3"
                icon={<span className="material-symbols-outlined text-base leading-none">content_copy</span>}
              >
                {copied === 'ok' ? 'Đã sao chép' : copied === 'manual' ? 'Đã bôi đen – nhấn Ctrl+C' : 'Sao chép'}
              </NeoButton>
            </div>
          </section>
        </div>

        {/* Mobile: panel thu thành một nút nổi, bấm mới mở */}
        {!panelOpen && (
          <div className="lg:hidden fixed bottom-4 right-4 z-30">
            <NeoButton
              variant="tertiary"
              onClick={() => setPanelOpen(true)}
              aria-expanded={false}
              aria-controls="rig-lab-panel"
              icon={<span className="material-symbols-outlined text-xl leading-none">tune</span>}
            >
              Điều chỉnh
            </NeoButton>
          </div>
        )}

        {/* Cột phải: thông số. Desktop: cột dính bên phải. Mobile: ngăn kéo đáy màn hình. */}
        <aside
          id="rig-lab-panel"
          aria-label="Bảng điều chỉnh thông số"
          className={clsx(
            'space-y-8',
            panelOpen
              ? 'fixed inset-x-0 bottom-0 z-40 max-h-[65vh] overflow-y-auto bg-background border-t-[3px] border-on-background shadow-[0_-8px_0_0_rgba(30,27,24,0.15)] px-4 pb-6'
              : 'hidden',
            'lg:block lg:sticky lg:inset-auto lg:top-24 lg:z-auto lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:bg-transparent lg:border-t-0 lg:shadow-none lg:px-0 lg:pr-2 lg:pb-2',
          )}
        >
          <div className="lg:hidden sticky top-0 z-10 -mx-4 px-4 py-3 bg-background border-b-[3px] border-on-background flex items-center justify-between gap-3">
            <span className="font-label-bold text-sm uppercase">Điều chỉnh thông số</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pause' : 'Play'}
                className={clsx(
                  'w-10 h-10 neo-brutalist-border hard-shadow hard-shadow-active flex items-center justify-center',
                  playing ? 'bg-on-background text-white' : 'bg-primary text-on-primary',
                )}
              >
                <span className="material-symbols-outlined text-xl">{playing ? 'pause' : 'play_arrow'}</span>
              </button>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Đóng bảng điều chỉnh"
                className="w-10 h-10 bg-white neo-brutalist-border hard-shadow hard-shadow-active flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>
          <section className="space-y-4">
            <SectionTitle n={2} color="bg-tertiary-fixed text-on-tertiary-fixed">
              Tư thế
            </SectionTitle>
            <NeoCard variant="white" className="!p-4">
              <div
                className={clsx(
                  'flex items-start gap-2 p-3 border-2 border-on-background font-body-md text-xs leading-5',
                  playing ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-secondary-fixed text-on-secondary-fixed',
                )}
              >
                <span className="material-symbols-outlined text-lg leading-none">{playing ? 'lock' : 'tune'}</span>
                {playing
                  ? 'Đang chạy: tư thế do animation điều khiển. Bấm Pause để đóng băng đúng khung hiện tại rồi chỉnh tay từ đó.'
                  : 'Chỉnh tay từng kênh của khung đang đứng. Bấm Play để animation chạy tiếp từ chỗ đã dừng.'}
              </div>
              {spec.pose.map((prm) => (
                <ParamRow
                  key={`${rigId}-${prm.key}`}
                  prm={prm}
                  value={value(pose, prm)}
                  disabled={playing}
                  onChange={(v) => setPoseValue(prm.key, v)}
                />
              ))}
            </NeoCard>
          </section>

          <section className="space-y-4">
            <SectionTitle n={3} color="bg-secondary-container text-on-secondary-container">
              Cấu hình chuyển động
            </SectionTitle>
            <NeoCard variant="white" className="!p-4">
              <div className="flex items-start justify-between gap-3 p-3 border-2 border-on-background bg-tertiary-fixed text-on-tertiary-fixed font-body-md text-xs leading-5">
                <span>Áp dụng ngay, kể cả khi đang chạy. {changedTune > 0 ? `${changedTune} thông số đã đổi.` : 'Đang dùng mặc định.'}</span>
                {changedTune > 0 && (
                  <button type="button" onClick={resetTune} className="font-label-bold underline underline-offset-2 whitespace-nowrap hover:text-primary">
                    Khôi phục tất cả
                  </button>
                )}
              </div>
              {spec.tune.map((prm) => (
                <ParamRow key={`${rigId}-${prm.key}`} prm={prm} value={value(tune, prm)} onChange={(v) => setTuneValue(prm.key, v)} />
              ))}
            </NeoCard>
          </section>
        </aside>
      </div>
    </main>
  );
}
