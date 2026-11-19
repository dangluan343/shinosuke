'use client';

import { useImperativeHandle, useLayoutEffect, useMemo, useRef, useState, type Ref } from 'react';
import type { Applier, Frame } from './apply';
import type { Playback } from './playback';

/** Điều khiển rig từ bên ngoài (trang lab): đọc trạng thái đang hiển thị để đóng băng đúng khung đó. */
export type RigHandle<St> = { getState(): St };

export type RigCoreOptions<St, Tu> = {
  ref?: Ref<RigHandle<St>>;
  playing: boolean;
  pose?: Partial<St>;
  tune?: Partial<Tu>;
  rest: St;
  defaults: Tu;
  compute: (s: St, t: Tu) => Frame;
};

/**
 * Phần dùng chung của mọi rig.
 *
 * Quy tắc "một người ghi": React chỉ vẽ khung hình ĐẦU TIÊN (cho SSR). Sau khi mount,
 * mọi thuộc tính của bộ phận chỉ được ghi qua `applyRef` – bởi vòng tick khi đang chạy,
 * hoặc bởi layout effect bên dưới khi đang dừng (chỉnh tư thế / cấu hình bằng tay).
 * Nhờ vậy Play/Pause không nháy hình và không có giá trị nào bị kẹt.
 */
export function useRigCore<St extends object, Tu extends object>(o: RigCoreOptions<St, Tu>) {
  const { ref, playing, pose, tune, rest, defaults, compute } = o;
  const tuneAll = useMemo(() => ({ ...defaults, ...tune }) as Tu, [defaults, tune]);
  const tuneRef = useRef(tuneAll);
  tuneRef.current = tuneAll;

  const [initialFrame] = useState(() => compute({ ...rest, ...pose } as St, tuneAll));
  const stateRef = useRef<St>({ ...rest, ...pose } as St);
  const applyRef = useRef<Applier | null>(null);
  const playbackRef = useRef<Playback | null>(null);
  const playingRef = useRef(playing);

  useImperativeHandle(ref, () => ({ getState: () => ({ ...stateRef.current }) }), []);

  useLayoutEffect(() => {
    playingRef.current = playing;
    playbackRef.current?.setPlaying(playing);
  }, [playing]);

  // Đang dừng: vẽ lại theo tư thế chỉnh tay (nếu có) hoặc giữ nguyên khung đang đứng, với cấu hình mới.
  useLayoutEffect(() => {
    if (playing) return;
    const s = pose ? ({ ...rest, ...pose } as St) : stateRef.current;
    stateRef.current = s;
    applyRef.current?.(compute(s, tuneAll));
  }, [playing, pose, tuneAll, rest, compute]);

  return { initialFrame, tuneRef, stateRef, applyRef, playbackRef, playingRef };
}
