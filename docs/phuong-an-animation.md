# Phương án vector hoá và animation nhân vật (Next.js)

Ảnh tham chiếu: [pose-a-back-sway.png](../reference/pose-a-back-sway.png) (675×1200) và [pose-b-butt-walk.png](../reference/pose-b-butt-walk.png) (450×800).

Hướng chốt: **vẽ lại tay bằng path SVG ít điểm neo → rig theo nhóm có tâm xoay → điều khiển bằng GSAP trên SVG inline trong một client component của Next.js**. Mỗi ảnh là một rig riêng (Rig A, Rig B) vì khác góc nhìn; trong mỗi rig, mọi tư thế giữ nguyên một góc nhìn.

---

## 0. Phân tích hai ảnh

### Ảnh A — đứng quay lưng, lắc hông

| Hạng mục | Quan sát |
|---|---|
| Góc nhìn | Từ sau lưng, thân hơi xoay 3/4; đầu ngoảnh sang phải gần như nghiêng hẳn (thấy má phồng, tai, một vệt lông mày) |
| Tư thế | Hai tay chống hông, ngón cái móc vào cạp quần kéo lên; lưng trần; hai chân khép, kiễng gót; trọng tâm ở giữa |
| Điểm nhấn | Mông trong quần tím là khối lớn nhất → là "diễn viên chính" của chuyển động |
| Biểu cảm | 3 vệt má hồng; **không thấy miệng và mắt** (bị má che) |
| Nét | Viền đen đều ~4 px (ở cỡ ảnh gốc), đầu nét tròn, tô phẳng, không bóng đổ |
| Màu đo được | Nền `#EAE8FD` · viền/tóc `#000000` · da `#F9CDB3` · quần `#C29FED` · tất trắng · má hồng đỏ cam (ước lượng `#E8605A`) |
| Khung bao nhân vật | khoảng x 170–530, y 315–930 (≈ 360×615) |

Hành động đọc ra: điệu **lắc mông trêu** — hông đưa ngang trái/phải, thân trên giữ tương đối yên, đầu ngoảnh lại nhìn.

### Ảnh B — chổng mông bò/đi

| Hạng mục | Quan sát |
|---|---|
| Góc nhìn | Nhìn ngang (profile), nhân vật hướng sang trái |
| Tư thế | Gập người, mông chổng cao nhất hình; đầu cúi thấp phía trước; hai tay khoanh dưới cằm; hai chân ngắn kiễng mũi, chân gần và chân xa lệch nhau nửa bước |
| Điểm nhấn | Khối quần xanh hình trái tim nghiêng chiếm ~50% diện tích |
| Biểu cảm | Miệng há cười to (khoang miệng đỏ sẫm + lưỡi), má hồng, không thấy mắt |
| Nét | Viền **xanh đen** mảnh ~2 px, tóc xám đậm chứ không đen tuyệt đối |
| Màu đo được | Nền `#C6ADEF` · quần `#3D5FB6` · tóc `#3A3E3F` · da `#FFD4C2` · áo xanh nhạt ≈ `#9CD8F0` · miệng `#884741` · giày xanh bạc hà (ước lượng `#A8D8B8`) |
| Khung bao nhân vật | x 86–356, y 404–640 (≈ 270×236) |

Hành động đọc ra: **chổng mông vừa đi vừa cười**, tiến về phía đầu (sang trái) bằng những bước kiễng ngắn — chuyển động chính là mông nảy theo nhịp bước.

### Ba điều rút ra ảnh hưởng tới toàn bộ phương án

1. **Hai ảnh khác phong cách** (viền đen dày vs viền xanh mảnh, tóc đen vs xám, tỉ lệ đầu/thân khác). Cần chọn một bộ token chung (màu viền, độ dày nét, màu da, tóc) nếu hai animation xuất hiện trên cùng trang. Đề xuất: lấy theo ảnh A (viền đen, nét dày) vì đọc rõ hơn ở cỡ nhỏ.
2. **Ảnh A không có miệng.** Yêu cầu "miệng cười" buộc phải vẽ thêm một biến thể đầu (xem mục 1.4) — đây là phần không có ảnh tham chiếu.
3. **Hình rất đơn giản**: mỗi tư thế chỉ ~15–18 mảng tô phẳng. Đây là điều kiện lý tưởng để vẽ tay bằng path ít điểm và morph mượt.

---

## 1. Trace thành vector, tách bộ phận, vẽ nhiều tư thế cùng góc nhìn

### 1.1 Chọn cách trace

| Cách | Kết quả | Kết luận |
|---|---|---|
| Auto-trace (Image Trace, potrace, vtracer) | Viền bị biến thành mảng tô, hàng trăm điểm neo, các bộ phận dính liền, không có phần bị che | Chỉ dùng làm lớp lót để đo |
| **Vẽ lại bằng pen tool đè lên ảnh** (Figma / Illustrator / Inkscape) | Mỗi bộ phận một path riêng, 6–14 điểm neo, viền là `stroke` thật | **Chọn** |
| Viết path SVG trực tiếp bằng code rồi so chồng với ảnh | Nhanh để ra prototype, cần 2–3 vòng chỉnh | Dùng cho bản dựng đầu, tinh chỉnh tay sau |

Quy tắc vẽ bắt buộc:

- **Viền là `stroke`, không expand thành shape.** Một giá trị `stroke-width` chung, `stroke-linecap: round`, `stroke-linejoin: round`. Khi hình biến dạng, độ dày nét vẫn đều.
- **Ít điểm neo nhất có thể**, toàn điểm trơn (tay nắm đối xứng). Mỗi điểm thừa là một chỗ có thể rung khi morph.
- **Vẽ cả phần bị che** ("phần chìm"): đùi kéo dài vào trong quần, lưng kéo xuống dưới cạp quần, cổ nằm dưới đầu, bắp tay chui vào dưới vai. Khi xoay khớp sẽ không hở nền.
- Upscale ảnh gốc 2–4 lần trước khi vẽ đè (ảnh hiện tại nhỏ, viền bị nhoè do nén).
- Đặt tên layer theo quy ước cố định (`a-hip`, `a-leg-l`, `b-mouth`…), xuất SVG giữ `id`, tối ưu bằng SVGO nhưng **tắt** `mergePaths`, `collapseGroups`, `cleanupIds`.

Hệ toạ độ: Rig A dùng `viewBox="0 0 480 720"`, Rig B dùng `viewBox="0 0 400 320"`; nhân vật nằm giữa, chừa ~15% lề mỗi phía cho biên độ chuyển động.

### 1.2 Tách bộ phận — Rig A (thứ tự từ dưới lên)

| Nhóm | Thành phần | Tâm xoay | Kỹ thuật chuyển động |
|---|---|---|---|
| `a-shadow` | elip bóng dưới chân (thêm mới) | — | scale |
| `a-leg-l`, `a-leg-r` | ống chân (da) | hốc hông trong quần → mắt cá | **ống cao su** (xem 1.5) |
| `a-foot-l`, `a-foot-r` | tất + bàn chân kiễng | mũi chân | xoay (nhấc gót) |
| `a-torso` | lưng, đường sống lưng, vai | giữa cạp quần | xoay + dịch |
| `a-hip` | thân quần, 2 nét cong má mông, nếp nhăn, gấu quần | giữa cạp quần | xoay + dịch + **morph** |
| `a-arm-l`, `a-arm-r` | cánh tay gập khuỷu | vai → cổ tay | ống cao su |
| `a-hand-l`, `a-hand-r` | bàn tay nắm cạp quần | — | là **con của `a-hip`** (tay luôn dính quần) |
| `a-head` | mặt + má, tai, tóc, lông mày, 3 vệt má hồng | gáy | xoay; thay cả nhóm khi quay mặt |

### 1.3 Tách bộ phận — Rig B

| Nhóm | Thành phần | Tâm xoay | Kỹ thuật |
|---|---|---|---|
| `b-shadow` | bóng | — | scale |
| `b-leg-far`, `b-leg-near` | chân + tất + giày | hốc hông → mắt cá | ống cao su + xoay bàn chân |
| `b-shirt` | áo (thân trên) | eo | xoay nhẹ |
| `b-hip` | quần (khối tim nghiêng), đường chia mông | eo | **morph** squash/stretch + xoay |
| `b-arm-far`, `b-arm-near` | hai cẳng tay khoanh | vai | xoay rất nhỏ |
| `b-head` | mặt, tai, tóc, má hồng | cổ | xoay (gật gù) |
| `b-mouth` | khoang miệng + lưỡi | — | swap 3 hình / morph |

### 1.4 Vẽ nhiều tư thế cùng góc nhìn

Không vẽ từng khung hình. Chỉ vẽ **tư thế khoá (key pose)** ở hai đầu biên độ, phần giữa do máy nội suy. Ba mức kỹ thuật, dùng mức thấp nhất đủ dùng:

1. **Biến đổi cứng** (xoay/dịch/co giãn quanh tâm) — đầu, bàn chân, thân, cả cụm.
2. **Morph path** — quần/mông, thân khi nghiêng, miệng.
3. **Swap hình** — bàn tay, miệng khác hẳn nhau, đầu quay mặt.

**Luật vàng cho morph:** cùng một bộ phận ở mọi tư thế phải có *cùng số điểm neo, cùng thứ tự, cùng điểm bắt đầu, cùng chiều vẽ*. Cách làm: vẽ tư thế chuẩn → nhân bản → **chỉ kéo điểm neo và tay nắm**, tuyệt đối không thêm/xoá điểm. Làm đúng thì nội suy là tuyến tính từng điểm, không bao giờ xoắn hình.

Bộ key pose cần có:

| Mã | Tư thế | Nguồn | Kỹ thuật | Khả thi |
|---|---|---|---|---|
| A0 | Đứng chuẩn | Trace trực tiếp ảnh A | — | Cao |
| A1 / A2 | Hông lệch hết trái / hết phải | Kéo điểm từ A0 | morph `a-hip` + ống cao su | Cao |
| A3 | Nhún xuống (lấy đà) | Suy từ A0 | chân tự gập nhờ ống cao su | Cao |
| A4 / A5 | Nhấc gót trái / phải | Xoay `a-foot` quanh mũi chân | xoay | Cao |
| A6 | Đầu quay nghiêng, **miệng cười** | **Vẽ mới, không có ảnh** | swap nhóm `a-head` | Trung bình |
| A7 | Miệng: mỉm / cười hở / há | Vẽ mới | swap hoặc morph | Trung bình |
| A8 | Giật mình (phản ứng khi bị chọc) | Vẽ mới tay + lông mày | swap | Trung bình |
| B0 | Chuẩn | Trace trực tiếp ảnh B | — | Cao |
| B1 / B2 | Mông hạ (squash) / mông nhô (stretch) | Kéo điểm từ B0 | morph `b-hip` | Cao |
| B3 / B4 | Chân gần chạm trước / chân xa chạm trước | Suy từ B0 | ống cao su | Cao |
| B5 | Miệng: há to (ảnh gốc) / vừa / khép cười | 1 có sẵn, 2 vẽ mới | swap | Cao |
| B6 | Ngoái đầu nhìn con trỏ | **Vẽ mới** | swap `b-head` | Thấp–trung bình |

Về "miệng cười" ở Rig A: vì ảnh gốc mặt quay đi, có hai lớp giải pháp dùng song song — (a) má hồng đậm lên + má phồng nảy + chữ "hehe" bật ra khi đang lắc; (b) mỗi 4 giây đầu quay hẳn sang nghiêng (A6) lộ miệng cười rồi quay lại.

### 1.5 Kỹ thuật ống cao su cho tay và chân

Tay nối vai (thuộc thân) với bàn tay (thuộc quần); chân nối hông với bàn chân **ghim trên sàn**. Hai đầu chuyển động độc lập nên không thể dùng một hình cứng. Giải pháp:

- Mỗi chi là một đường cong 3 điểm (gốc – khuỷu/gối – ngọn), vẽ bằng **hai stroke chồng nhau**: nét đen dày ở dưới, nét màu da mỏng hơn ở trên. Chỗ nối với thân tự liền mạch, không lộ viền cắt ngang.
- Mỗi tick tính lại điểm khuỷu/gối từ hai đầu (IK hai đoạn rút gọn: trung điểm đẩy vuông góc ra ngoài một đoạn sao cho tổng chiều dài không đổi).
- Hệ quả: chỉ cần di chuyển hông, **đầu gối tự gập, chân tự nhịp** mà không phải key tay.

---

## 2. Chọn thao tác và kịch bản animation

### 2.1 Công nghệ

| Lựa chọn | Hợp khi | Nhận xét |
|---|---|---|
| **SVG inline + GSAP** (core, MorphSVG, `@gsap/react`) | Dựng và chỉnh hoàn toàn bằng code | **Chọn.** Toàn bộ plugin GSAP miễn phí từ bản 3.13; timeline, morph, `quickTo` cho con trỏ |
| Rive | Có animator làm trong Rive editor | Xương + mesh + state machine rất mạnh, nhưng file `.riv` phải dựng tay trong editor; để làm phương án B |
| Lottie (After Effects) | Animation phát thẳng, ít tương tác | Tương tác con trỏ hạn chế |
| CSS keyframes thuần | Chỉ xoay/dịch | Animate thuộc tính `d` bằng CSS không đồng đều giữa trình duyệt |

### 2.2 Nguyên tắc chọn chuyển động

- Một bộ phận **dẫn** (hông/mông), các bộ phận khác **theo sau lệch pha** (thân → đầu → má mông rung). Lệch pha 60–120 ms là thứ tạo cảm giác sống.
- Mọi dao động đi theo cung tròn (xoay quanh tâm), không trượt thẳng.
- Squash & stretch giữ thể tích: `scaleY = 1 / scaleX`.
- Lớp vòng lặp chồng nhau có chu kỳ khác nhau (lắc 1 s, thở 3 s, chớp/nhướng mày ngẫu nhiên 2–5 s) để không thấy "lặp máy".

### 2.3 Kịch bản A — "Lắc hông"

Nhịp 120 BPM: 1 phách = 0,5 s. Một lượt lắc trái→phải→trái = 2 phách = **1,0 s (60 khung ở 60 fps)**.

Bảng kênh chuyển động trong một lượt lắc (đơn vị theo viewBox 480×720):

| Kênh | Chuyển động | Biên độ | Trễ so với hông | Easing |
|---|---|---|---|---|
| Hông `a-hip` | dịch X + xoay + morph A1↔A2 | ±14, ±6° | 0 | `sine.inOut` |
| Má mông | lò xo rung phụ, bên lên cao bị ép dẹt | 4–6% | +70 ms | lò xo tắt dần |
| Thân `a-torso` | xoay ngược chiều hông | ∓3°, dịch ±4 | +50 ms | `sine.inOut` |
| Đầu `a-head` | xoay theo thân, gật nhẹ đúng phách | ±4° | +110 ms | `sine.inOut` |
| Nhún | cả thân trên hạ xuống ở mỗi đầu biên (2 lần/lượt) | 6 | 0 | `power2.out` |
| **Chân nhịp** | chân không chịu lực nhấc gót: hông sang phải → gót **trái** nhấc | xoay bàn chân 12° | 0 | `power1.inOut` |
| Gối | tự gập do ống cao su | — | — | — |
| Bóng | scaleX theo hông, to ra khi nhún | ±8% | 0 | — |

Mốc khung trong một lượt (60 fps):

| Khung | Trạng thái |
|---|---|
| 0 | Hông đi ngang qua giữa, tốc độ lớn nhất, thân cao nhất |
| 15 | **Hết phải**: hông +14, +6°, nhún −6, gót trái nhấc; má mông trễ ~4 khung, đầu trễ ~7 khung |
| 30 | Qua giữa, hai gót chạm |
| 45 | **Hết trái**: đối xứng, gót phải nhấc |
| 60 | = khung 0 |

Câu nhạc 8 phách (4 s) lặp lại:

| Phách | Diễn biến |
|---|---|
| Mở đầu (chạy 1 lần, 0,6 s) | Nhún lấy đà 0,3 s, hai tay kéo cạp quần lên 4 đơn vị → bật lên 0,3 s |
| 1–8 | 4 lượt lắc đều tốc độ (1 lượt/giây) |
| 6–8 | Điểm nhấn không đổi tốc độ: má hồng đậm lên, gật đầu và nhướng mày 1 nhịp, rồi má hồng nhạt dần |

> Đã bỏ đoạn "lắc nhanh gấp 4" và tăng tốc khi rê chuột theo góp ý ngày 2026-11-19: hoạt ảnh phải chạy đều tốc độ.

Trạng thái của Rig A: `idle` (thở, đổi trọng tâm chậm) → `dance` (vòng lặp trên) → `tease` (phách 8) → `poked` (bị click: giật mình, bật lên, che mông) → về `dance`. Chuyển trạng thái bằng cách hoà tham số trong 0,2–0,3 s, không cắt.

### 2.4 Kịch bản B — "Chổng mông đi"

Một chu kỳ bước (2 bước) = **0,8 s (48 khung)**. Nhân vật di chuyển sang trái.

| Kênh | Chuyển động | Biên độ | Ghi chú |
|---|---|---|---|
| Chân gần / chân xa | bước kiễng xen kẽ: chạm → nhấc → lướt qua | bước 18 đơn vị | lệch pha nửa chu kỳ |
| Mông `b-hip` | nảy lên 2 lần/chu kỳ, morph B1↔B2, xoay | cao ±7, ±5°, giãn 6% | diễn viên chính |
| Áo `b-shirt` | theo mông, xoay nhẹ | ±2° | trễ 30 ms |
| Đầu `b-head` | gật gù ngược pha với mông | ±3° | trễ 50 ms |
| Miệng | há – khép 3 lần/chu kỳ | swap 3 hình | cố ý lệch nhịp với bước cho tự nhiên |
| Tay khoanh | rung rất nhẹ theo đầu | ±1° | — |
| Tịnh tiến | cả rig trượt trái 36 đơn vị/chu kỳ (= 45 đơn vị/s) | — | **bằng đúng 2 × độ dài bước để chân không trượt sàn** |

Mốc khung (60 fps): 0 chân gần chạm trước, mông thấp nhất (squash) · 12 lướt qua, mông cao nhất (stretch) · 24 chân xa chạm trước, mông thấp · 36 lướt qua, mông cao · 48 = 0.

Câu chuyện lặp: đi đều tốc độ hết chiều ngang → chạm mép thì chậm lại, nhún nhẹ, lật gương (`scaleX(-1)`, hợp lệ vì là góc nhìn ngang) → đi tiếp theo hướng ngược lại. Miệng cười một nhịp mỗi bước. Bấm vào nhân vật: cười to một hơi rồi quay đầu. Con trỏ chặn trước mặt: quay đầu.

> Đã bỏ màn "lắc mông nhanh 6 cái" và tăng tốc khi rê chuột theo góp ý ngày 2026-11-19: hoạt ảnh phải chạy đều tốc độ.

### 2.5 Khả năng đáp ứng khung hình

- **Số hình phải vẽ:** Rig A 9 key pose/biến thể, Rig B 7. Toàn bộ khung trung gian do nội suy tạo ra, nên không có giới hạn số khung: 60 fps, 120 fps trên màn hình tần số cao đều liên tục.
- **Phong cách "on twos":** nếu muốn chất hoạt hình truyền thống, ép các kênh swap (miệng, tay) nhảy bậc 12 fps bằng `steps()`, còn thân vẫn chạy mượt.
- **Ngân sách hiệu năng:** mỗi rig ~30–40 node SVG, ~6 path morph mỗi tick. Mức này nhẹ so với ngân sách 16,6 ms/khung trên máy tính và điện thoại tầm trung; cần đo lại trên thiết bị thật ở mục 4.
- **Khung màn hình:** SVG co giãn theo `viewBox` nên sắc nét ở mọi kích thước; nét viền giữ độ dày tương đối nhờ cùng scale. Dưới ~120 px chiều cao thì bỏ nếp nhăn quần và nét chuyển động.

---

## 3. Làm mượt vector khi animate, tương tác con trỏ

### 3.1 Kiến trúc: một bộ tham số, một hàm vẽ

Mọi nguồn chuyển động (vòng lặp, lò xo, con trỏ) chỉ **ghi vào một object tham số**; mỗi tick có đúng một hàm đọc tham số và cập nhật DOM. Đây là thứ quyết định độ mượt khi nhiều chuyển động chồng nhau, vì không có hai tween nào giành cùng một thuộc tính.

```ts
// Mỗi tham số = nền (timeline) + cộng thêm (tương tác) + lò xo
type RigAParams = {
  hipX: number; hipRot: number; hipMorph: number; // -1 = A1, 0 = A0, 1 = A2
  dip: number; torsoRot: number; headRot: number;
  heelL: number; heelR: number;
  cheekJiggle: number; blush: number;
  face: 'back' | 'profile'; mouth: 0 | 1 | 2;
};

gsap.ticker.add(() => {
  stepSprings(params, gsap.ticker.deltaRatio()); // độc lập tốc độ khung hình
  render(params);                                 // setAttribute trực tiếp qua ref, không qua React state
});
```

Cấu trúc thư mục đề xuất:

```
app/page.tsx                      server component, chỉ đặt <RigA/> <RigB/>
components/rig/RigA.tsx           'use client' – SVG inline + useGSAP
components/rig/rigA.paths.ts      chuỗi path cho từng key pose
components/rig/rigA.timeline.ts   kịch bản (mục 2.3)
components/rig/core/              spring.ts · limb.ts (ống cao su) · pointer.ts · lerpPath.ts
```

SVG được render sẵn trên server ở tư thế chuẩn → không nháy hình, không lệch bố cục, vẫn hiển thị khi JS chưa tải.

### 3.2 Danh sách kỹ thuật làm mượt

| Vấn đề | Cách xử lý |
|---|---|
| Morph bị xoắn, giật | Path cùng cấu trúc điểm (luật vàng 1.4); nội suy tuyến tính từng toạ độ. Nếu dùng MorphSVG thì cố định `shapeIndex`, `type: "linear"` |
| Nét viền dày mỏng khi co giãn | `vector-effect: non-scaling-stroke` trên mọi path có viền |
| Hở, gãy ở khớp | Phần chìm chồng lấn + ống cao su hai stroke + đầu nét tròn |
| Chuyển động "máy" | `sine.inOut` cho con lắc; lò xo tắt dần (giá trị khởi điểm: độ cứng ~170, giảm chấn ~14, chỉnh bằng mắt) cho má mông, đầu, tóc; lệch pha giữa các kênh |
| Giật khi đổi trạng thái | Hoà tham số 0,2–0,3 s; không `kill` rồi chạy lại timeline từ đầu |
| Tâm xoay lệch giữa trình duyệt | Dùng `svgOrigin` của GSAP theo toạ độ viewBox, không dùng `transform-origin` phần trăm |
| Mờ, răng cưa | `shape-rendering: geometricPrecision`; không đặt `will-change: transform` lên phần tử con của SVG; không dùng `filter` trên node đang động |
| Tụt khung | Cập nhật DOM qua ref ngoài vòng render của React; dừng ticker khi rig ra khỏi màn hình (`IntersectionObserver`) hoặc tab ẩn |
| Người dùng tắt chuyển động | `prefers-reduced-motion`: chỉ giữ nhịp thở rất nhẹ, tắt lắc nhanh và di chuyển |

### 3.3 Tương tác con trỏ

Nền tảng chung: dùng Pointer Events (chuột + cảm ứng một mã), đổi toạ độ màn hình sang toạ độ viewBox bằng `getScreenCTM().inverse()`, gom sự kiện vào tick, làm trễ bằng `gsap.quickTo` hoặc lò xo để chuyển động luôn "đuổi theo" chứ không dính cứng con trỏ.

| Tương tác | Rig | Hành vi | Độ khó |
|---|---|---|---|
| Nhìn theo | A, B | Đầu xoay về phía con trỏ, giới hạn ±8°; ở A, con trỏ sang hẳn bên trái thì lật nhóm đầu để ngoảnh sang trái | Thấp |
| Nghiêng theo | A | Vị trí X của con trỏ cộng thêm vào `hipX` (±10) — hông "ngả" về phía chuột | Thấp |
| Hover lên mông | A, B | Lắc nhanh hơn (`timeScale` 1 → 1,6), má hồng đậm, con trỏ thành bàn tay | Thấp |
| **Chọc (click/tap)** | A, B | Đẩy xung lực vào lò xo má mông theo hướng từ điểm click, lõm rồi nảy; chuyển `poked`: giật mình → cười | Trung bình |
| **Kéo – thả** | A, B | Giữ và kéo mông: hình giãn theo tay (giới hạn 25%), thả ra bật lại rung tắt dần; dùng `setPointerCapture` | Trung bình |
| Lắc chuột nhanh | A | Vận tốc con trỏ → tempo điệu nhảy | Thấp |
| Đuổi | B | Con trỏ lại gần phía sau < 120 px → `flee`; chặn phía trước → `turn` | Trung bình |
| Cuộn trang | B | Tiến độ bước gắn với cuộn (ScrollTrigger `scrub`), bò ngang theo trang | Thấp |
| Bỏ mặc 5 s | A | Tự chạy `tease` để gọi chú ý | Thấp |

Cảm ứng: không có hover nên chạm = chọc, giữ = kéo; đặt `touch-action: pan-y` để không chặn cuộn dọc. Bàn phím: rig là một `<button>` có `aria-label`, Enter/Space kích hoạt phản ứng chọc; SVG có `role="img"` và `<title>`.

---

## 4. Quy trình và checklist hoàn thiện

Thời lượng là ước lượng sơ bộ cho một người làm, chưa đo thực tế.

### Giai đoạn 0 — Nền (≈ 0,5 ngày)

- [ ] Chốt phạm vi sử dụng và quyền hình ảnh (xem Rủi ro)
- [ ] Chốt token phong cách chung: màu viền, `stroke-width`, da, tóc
- [ ] Khởi tạo Next.js (App Router, TypeScript), cài `gsap`, `@gsap/react`
- [ ] Trang `/lab` hiển thị rig chồng lên ảnh gốc độ mờ 50% để so

### Giai đoạn 1 — Vector (≈ 1–2 ngày)

- [ ] A0 và B0 khớp ảnh gốc khi so chồng (lệch viền ≤ 2 px ở cỡ ảnh gốc)
- [ ] Mọi bộ phận là path riêng có `id` đúng quy ước; có đủ phần chìm
- [ ] Viền là stroke, một độ dày; mỗi path ≤ 14 điểm neo
- [ ] Các key pose A1–A5, B1–B4 dựng bằng cách kéo điểm, **số điểm khớp** (có script kiểm tra tự động)
- [ ] Các hình vẽ mới: A6, A7, A8, B5, B6

### Giai đoạn 2 — Rig (≈ 1 ngày)

- [ ] Tâm xoay từng nhóm đúng (xoay thử ±30° không hở nền)
- [ ] Ống cao su tay/chân: di chuyển hông thì gối gập, tay vẫn dính cạp quần
- [ ] `render(params)` thuần: cùng tham số → cùng hình
- [ ] Thanh trượt debug cho từng tham số trên `/lab`

### Giai đoạn 3 — Animation (≈ 1–2 ngày)

- [ ] Kịch bản A: vòng lắc 1 s khép kín không giật ở điểm nối, có chân nhịp và phách 8 cười
- [ ] Kịch bản B: chân không trượt sàn, vòng đi – dừng lắc – đi tiếp
- [ ] Lò xo phụ (má mông, đầu) ổn định ở 30/60/120 fps
- [ ] Chuyển trạng thái nào cũng hoà mượt, không nhảy hình

### Giai đoạn 4 — Tương tác (≈ 1 ngày)

- [ ] Nhìn theo, nghiêng theo, hover
- [ ] Chọc và kéo – thả, có giới hạn biến dạng
- [ ] Cảm ứng và bàn phím hoạt động tương đương
- [ ] Đuổi / cuộn trang cho Rig B

### Giai đoạn 5 — Hoàn thiện (≈ 1 ngày)

- [ ] 60 fps ổn định trên Chrome, Safari, Firefox và một điện thoại Android tầm trung
- [ ] Dừng khi ra khỏi màn hình / tab ẩn; tôn trọng `prefers-reduced-motion`
- [ ] Không lệch bố cục khi tải; hiển thị đúng khi tắt JS
- [ ] Sắc nét từ 120 px đến toàn màn hình
- [ ] JS của rig nằm trong chunk riêng, không chặn trang

### Đánh giá khả năng hoàn thiện

| Hạng mục | Khả năng | Lý do |
|---|---|---|
| Vector hoá hai tư thế gốc | Cao | Hình phẳng, ít mảng, có ảnh để so chồng |
| Lắc hông + chân nhịp (A) | Cao | Chỉ cần biến đổi cứng, một morph và ống cao su |
| Chổng mông đi (B) | Cao | Chu kỳ bước đơn giản, chân ngắn nên sai số ít lộ |
| Mượt 60 fps trên web | Cao | Số node nhỏ, không filter |
| Tương tác nhìn theo, hover, chọc | Cao | Chỉ cộng thêm vào tham số có sẵn |
| Kéo – thả biến dạng | Trung bình | Cần tinh chỉnh lò xo và giới hạn để không vỡ hình |
| Miệng cười ở Rig A, ngoái đầu ở Rig B | Trung bình | Phải vẽ mới không có ảnh tham chiếu; độ "đúng chất" phụ thuộc tay vẽ |
| Chi tiết nhỏ (ngón tay, nếp quần) giống hệt bản gốc | Trung bình | Dựng bằng code đạt gần đúng; muốn y hệt cần chỉnh tay trong Figma/Illustrator |
| Xoay sang góc nhìn khác (chính diện, 3/4 trước) | Ngoài phạm vi | Mỗi góc nhìn là một rig mới |

### Rủi ro

- **Quyền hình ảnh:** nhân vật thuộc bản quyền Crayon Shin-chan, và ảnh A có watermark của một tác giả fan-art trên TikTok. Dùng để học/thử nghiệm cá nhân thì ít vấn đề; đưa lên website công khai hoặc thương mại thì cần giấy phép, hoặc đổi sang nhân vật tự thiết kế (toàn bộ quy trình trên giữ nguyên).
- **Lệch phong cách giữa hai rig** nếu không chốt token ở giai đoạn 0.
- **Safari:** kiểm tra sớm `vector-effect` và tâm xoay SVG, không để tới cuối.
