# Kế Hoạch Triển Khai: Khu Vui Chơi Kasukabe Arcade & Meme Zone 🕹️🍑

Dự án mở rộng tính năng tương tác giải trí mang đậm chất **Shin Cậu Bé Bút Chì**, kết hợp phong cách **Neo-Brutalism Anime Pop** với trải nghiệm game arcade, soundboard và quẻ bói tương tác.

Nhánh Git: `feature/interactive-fun-zone`

---

## 📋 Tiến độ tổng quan

- [x] **Giai đoạn 1**: Minigame "Shin Né Ớt Chuông Ăn Chocobi" (Green Pepper Dodger Arcade) *(Hoàn thành)*
- [x] **Giai đoạn 2**: Minigame "Oẳn Tù Tì Ăn Gian với Shin" (Jankenpon Battle) *(Hoàn thành)*
- [ ] **Giai đoạn 3**: Bàn phím âm thanh "Kasukabe Meme Soundboard" & 8-bit Lo-Fi BGM
- [ ] **Giai đoạn 4**: Hộp Bói Quẻ Cà Khịa "Chocobi Daily Fortune Cookie" & Xuất thẻ Polaroid
- [ ] **Giai đoạn 5**: Thiết kế Hub Trang `/arcade`, Tích hợp Menu Navigation & Kiểm thử Tổng thể

---

## 🎯 Chi tiết từng giai đoạn & Kết quả đầu ra (Outcomes)

### Giai đoạn 1: Minigame "Shin Né Ớt Chuông Ăn Chocobi" (Green Pepper Dodger)
* **Mục tiêu**: Xây dựng một game 2D Arcade hoàn chỉnh chạy mượt mà trên Canvas HTML5/React, hỗ trợ cả bàn phím (Desktop) và nút ảo cảm ứng (Mobile).
* **Các công việc thực hiện**:
  1. Lập trình vòng lặp game (Game Loop `requestAnimationFrame`) với điểm số, thời gian, và độ khó tăng dần.
  2. Tạo sprite nhân vật cu Shin chạy qua lại (phím `←` `→` hoặc kéo chuột/chạm).
  3. Tạo các vật phẩm rơi tự do từ trên trời:
     - 🫑 **Ớt chuông xanh (Kẻ thù số 1)**: Né tránh! Nếu dính sẽ bị trừ 1 tim (Shin có 3 tim/mạng) kèm hiệu ứng rung màn hình và âm thanh khóc thét.
     - 🍪 **Bánh Chocobi (+10 điểm)**: Ăn để tăng điểm combo và hồi thanh năng lượng.
     - 🥛 **Hộp sữa tươi (+5 điểm)**: Hồi máu/tăng tốc độ chạy.
     - ⚡ **Action Mask Badge (+50 điểm & Bất tử 5s)**: Shin biến thành Siêu nhân Hành động, húc bay mọi ớt chuông!
  4. Hiệu ứng âm thanh bằng Web Audio API thuần (tiếng nhặt bánh chít chít, tiếng ớt rơi bụp, còi báo động).
  5. Màn hình Game Over bựa: Mẹ Misae bắt Shin ăn hết bát ớt chuông, lưu điểm cao (High Score) vào `localStorage`.
* **Kết quả Outcome đã đạt được**:
  - [x] Đã tạo xong component game `src/components/arcade/PepperDodgerGame.tsx` mượt mà 60fps trên Canvas/React.
  - [x] Đã tích hợp 3 phương thức điều khiển: Bàn phím (`←` `→`, `A` `D`), Rê chuột/Chạm cảm ứng, và Cụm nút ảo to rõ trên Mobile.
  - [x] Tích hợp trọn bộ 4 SFX arcade bằng Web Audio API trong `src/lib/audio.ts` (`playHitPepper`, `playPowerUp`, `playGameOver`, `playSparkleChime`).
  - [x] Đã thiết lập route `/arcade` (`src/app/arcade/page.tsx`) và gắn link trên `TopNavBar` + Banner Teaser trên Trang chủ.
  - [x] Lưu và hiển thị kỷ lục High Score tự động bằng `localStorage`.
  - [x] Build tĩnh thành công 11/11 routes (`npm run build` pass 100%).

---

### Giai đoạn 2: Minigame "Oẳn Tù Tì Ăn Gian với Shin" (Jankenpon Battle)
* **Mục tiêu**: Tái hiện trò chơi oẳn tù tì kinh điển của Shin-chan với tính cách ranh mãnh và các phản ứng lầy lội.
* **Các công việc thực hiện**:
  1. Giao diện song đấu (Versus Arena): Người chơi chọn Kéo ✌️ - Búa ✊ - Bao ✋.
  2. Logic AI "Ăn Gian" đặc sản của cu Shin:
     - 70% trường hợp: Chơi công bằng.
     - 30% trường hợp: Shin đổi chiêu ở giây thứ 99 kèm điệu cười "Hê hê hê~" và câu thoại bựa.
  3. Phản ứng kết quả:
     - **Thắng:** Shin quỳ gối xin tha, thưởng bánh Chocobi (cộng trực tiếp vào kho Chocobi toàn trang).
     - **Thua:** Mẹ Misae xuất hiện cốc đầu "CỐC!" nổi cục u to tướng kèm âm thanh nảy tưng tưng.
     - **Hòa:** Cả 2 cùng ngoáy mũi nhìn nhau.
  4. Hệ số Win Streak (chuỗi thắng liên tiếp) và danh hiệu ("Vua Oẳn Tù Tì Kasukabe").
* **Kết quả Outcome đã đạt được**:
  - [x] Đã tạo xong component game `src/components/arcade/JankenponGame.tsx` giao diện đối kháng Neo-Brutalism.
  - [x] Tích hợp logic AI Shin-chan ăn gian (30% cơ hội lật chiêu ở giây 99 kèm thoại bựa và còi báo động).
  - [x] Hệ thống lời thoại ngẫu nhiên sinh động (15+ câu thoại lầy lội theo diễn biến thắng/thua/hòa/ăn gian).
  - [x] Thống kê chuỗi thắng (Win Streak), kỷ lục Best Streak, danh hiệu Kasukabe ("Tân Binh" -> "Huyền Thoại Bất Bại").
  - [x] Tích hợp mượt mà vào Tab 2 của trang `/arcade`.
  - [x] Kiểm tra TypeScript pass 100% không lỗi.

---

### Giai đoạn 3: Bàn phím âm thanh "Kasukabe Meme Soundboard" & 8-bit Lo-Fi BGM
* **Mục tiêu**: Tạo một trung tâm âm thanh sống động với các âm thanh và câu thoại iconic nhất của vũ trụ Crayon Shin-chan.
* **Các công việc thực hiện**:
  1. Thiết kế lưới các Sound Pad phong cách Neo-Brutalist rực rỡ với hiệu ứng ấn thụt phím (`hard-shadow-active`).
  2. Bổ sung các preset âm thanh mới trong `src/lib/audio.ts`:
     - Buri Buri Dance Wiggle (Lắc mông)
     - Action Beam Explosion (Tia laser nổ)
     - Misae Rage Roar (Tiếng thét sư tử Hà Đông)
     - Chocobi Crunch (Cắn bánh giòn tan)
     - Shiro Cotton Ball (Bạch Tuyết gâu gâu)
     - Flirt Whistle (Huýt sáo ghẹo chị gái xinh đẹp)
     - Boing Jump & Slap
  3. Lập trình bộ phát nhạc nền Chiptune / 8-bit Anime BGM nhẹ nhàng, vui nhộn bằng Web Audio Synthesizer thuần (có nút Play/Pause/Mute trên thanh điều khiển).
* **Kết quả Outcome cần đạt**:
  - Bấm nút âm thanh phát ngay lập tức (<5ms latency), không phụ thuộc mạng.
  - Có thể chơi nhạc nền lặp (looping) không gián đoạn.

---

### Giai đoạn 4: Hộp Bói Quẻ Cà Khịa "Chocobi Daily Fortune Cookie" & Xuất thẻ Polaroid
* **Mục tiêu**: Tính năng rút quẻ may mắn mỗi ngày mang lại tiếng cười và khả năng chia sẻ.
* **Các công việc thực hiện**:
  1. Xây dựng ngân hàng dữ liệu 30+ quẻ bói song ngữ Việt - Nhật dí dỏm của Shin, mẹ Misae, bố Hiroshi, Nene, Bo-chan, Kazama, Masao, Action Mask.
  2. Animation mở nắp hộp bánh Chocobi 3D rung lắc và bung pháo hoa giấy confetti (pure canvas).
  3. Hiển thị quẻ bói dưới dạng thẻ bài Polaroid phong cách Neo-Brutalism với:
     - Chỉ số may mắn (Mischief Index, Snack Luck, Romance Radar).
     - Lời khuyên "bá đạo" trong ngày.
     - Con số may mắn của Shin.
  4. Nút bấm "Lắc quẻ khác" hoặc "Lưu quẻ bói" chia sẻ.
* **Kết quả Outcome cần đạt**:
  - Trải nghiệm mở hộp bánh kịch tính với âm thanh và pháo giấy rực rỡ.
  - Quẻ bói đa dạng, ngẫu nhiên và thông minh.

---

### Giai đoạn 5: Thiết kế Hub Trang `/arcade`, Tích hợp Menu Navigation & Kiểm thử Toàn diện
* **Mục tiêu**: Tích hợp toàn bộ các tính năng trên thành một Hub giải trí thống nhất tại `/arcade`, kết nối mượt mà với toàn bộ hệ thống.
* **Các công việc thực hiện**:
  1. Lập trình trang `src/app/arcade/page.tsx` với bố cục Bento Grid tabbed hoặc all-in-one mượt mà.
  2. Cập nhật `TopNavBar` thêm tab "Arcade 🕹️" với hiệu ứng badge nhấp nháy thu hút.
  3. Thêm Banner "Kasukabe Fun Arcade" tại trang chủ (`/`) để người chơi khám phá.
  4. Cập nhật Footer và Sitemap.
  5. Chạy kiểm tra Responsive trên mọi độ phân giải (Mobile 375px đến Desktop 4K).
  6. Kiểm tra `npm run build` đạt 100% không lỗi.
* **Kết quả Outcome cần đạt**:
  - Toàn bộ 4 tính năng hoạt động trơn tru trong một trang `/arcade`.
  - Điều hướng mượt mà giữa các trang, không vỡ layout.
  - Bản build sản xuất pass 100%.

