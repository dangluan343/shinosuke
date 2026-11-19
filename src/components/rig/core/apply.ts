/** Một khung hình = thuộc tính cần đặt cho từng bộ phận (theo `data-part`). */
export type Frame = Record<string, Record<string, string>>;
export type Applier = (frame: Frame) => void;

/**
 * Trả về hàm ghi một Frame thẳng vào DOM (không qua React state).
 * Nhiều phần tử có thể dùng chung một `data-part`; giá trị không đổi thì bỏ qua.
 * Danh sách phần tử được lấy MỘT lần lúc tạo: các phần tử có `data-part` phải luôn
 * nằm trong DOM (ẩn bằng CSS chứ không gỡ ra), nếu không chúng sẽ đứng im.
 */
export function makeApplier(root: Element): Applier {
  const parts = new Map<string, Element[]>();
  root.querySelectorAll('[data-part]').forEach((el) => {
    const key = el.getAttribute('data-part')!;
    if (!parts.has(key)) parts.set(key, []);
    parts.get(key)!.push(el);
  });
  const last = new Map<string, string>();
  return (frame: Frame) => {
    for (const name in frame) {
      const els = parts.get(name);
      if (!els) continue;
      const attrs = frame[name];
      for (const attr in attrs) {
        const key = name + '|' + attr;
        const val = attrs[attr];
        if (last.get(key) === val) continue;
        last.set(key, val);
        for (const el of els) el.setAttribute(attr, val);
      }
    }
  };
}
