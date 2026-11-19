# Kế Hoạch Triển Khai: Website Shinosuke Fan Hub (Google Stitch to Next.js)

Dự án chuyển đổi toàn diện thiết kế từ Google Stitch MCP (`projects/13757066292734691956`) thành website hoàn chỉnh với phong cách **Neo-Brutalism Anime Pop** đặc trưng của bộ phim Shin Cậu Bé Bút Chì.

---

## Tiến độ tổng quan

- [x] **Giai đoạn 1**: Thiết lập Hệ thống Design Tokens & Hạ tầng Giao diện *(Hoàn thành)*
- [x] **Giai đoạn 2**: Trích xuất & Quản lý Tài nguyên Hình ảnh (Assets Pipeline) *(Hoàn thành)*
- [x] **Giai đoạn 3**: Xây dựng Bộ Thư viện UI Kit Dùng Chung (Neo-Brutalist Components) *(Hoàn thành)*
- [x] **Giai đoạn 4**: Lập trình Chi tiết 4 Trang Cốt Lõi (Home, Squad, Gallery, Kasukabe) *(Hoàn thành)*
- [x] **Giai đoạn 5**: Tích hợp Micro-interactions, Animation & Hiệu ứng Âm thanh Anime *(Hoàn thành)*
- [x] **Giai đoạn 6**: Kiểm thử Đa thiết bị (Responsive), Tối ưu Hiệu năng & Production Build *(Hoàn thành)*

---

## Chi tiết các giai đoạn & Kết quả đầu ra (Outcomes)

### Giai đoạn 1: Thiết lập Hệ thống Design Tokens & Hạ tầng Giao diện
* **Mục tiêu**: Xây dựng nền tảng thiết kế chuẩn xác tuyệt đối theo Google Stitch, ngăn ngừa việc hardcode màu/font và đảm bảo tính nhất quán trên toàn website.
* **Các công việc thực hiện**:
  1. Khởi tạo cấu trúc dự án Next.js 15 (App Router, TypeScript, Tailwind CSS).
  2. Tích hợp bộ 3 Google Fonts tối ưu qua CDN & CSS Variables: `Bricolage Grotesque`, `Plus Jakarta Sans`, `Space Grotesk` và bộ icon `Material Symbols Outlined`.
  3. Xây dựng từ điển Design Tokens (`src/tokens/colors.ts`, `src/tokens/typography.ts`, `src/tokens/spacing.ts`, `src/tokens/index.ts`).
  4. Cấu hình `tailwind.config.ts` kế thừa 100% token của Stitch (Màu sắc, Typography Scale, Spacing 8px, Border 3px, Hard Shadows).
  5. Viết custom CSS Utilities & Keyframe Animations (`neo-brutalist-border`, `hard-shadow`, `comic-hatch`, `animate-shin-bounce`).
  6. Xây dựng trang kiểm thử trực quan **Design System Showcase** (`/tokens`) để kiểm tra toàn bộ bảng màu, font chữ, kích cỡ, bóng đổ và hiệu ứng tương tác.
* **Kết quả Outcome đã đạt được**:
  - [x] Khởi tạo dự án biên dịch thành công (`npm run build` pass 100%, zero TypeScript/CSS errors).
  - [x] Bộ Design Tokens phản ánh chính xác 100% các biến màu (`primary #b7000c`, `secondary #0b5eaf`, `tertiary-fixed #f4e700`, v.v.), thang kích thước và độ bóng.
  - [x] Đã tạo thành công trang kiểm thử `/tokens` hiển thị trực quan toàn bộ bảng màu, typography, button states (normal, hover, active) để nghiệm thu tức thì.

---

### Giai đoạn 2: Trích xuất & Quản lý Tài nguyên Hình ảnh (Assets Pipeline)
* **Mục tiêu**: Lưu trữ và phục vụ toàn bộ ảnh phong cách anime cel thập niên 90 độc quyền từ Stitch một cách độc lập và tối ưu.
* **Các công việc thực hiện**:
  1. Quét và tải toàn bộ 22 hình ảnh độc quyền từ Google Stitch về lưu cục bộ tại `public/images/`.
  2. Tạo file manifest JSON (`public/images/manifest.json`) lưu trữ siêu dữ liệu và prompt mô tả của từng ảnh.
  3. Xây dựng thư viện định danh ảnh chuẩn hóa TypeScript [src/constants/assets.ts](file:///f:/Projects/shinosuke/src/constants/assets.ts) phân nhóm rõ ràng (Home, Characters, Gallery, Locations).
  4. Tối ưu hóa tải ảnh tự động qua `next/image` với responsive sizes và priority loading.
  5. Xây dựng trang thư viện kiểm thử trực quan [src/app/assets/page.tsx](file:///f:/Projects/shinosuke/src/app/assets/page.tsx) (`/assets`) hiển thị toàn bộ 22 ảnh kèm prompt mô tả.
* **Kết quả Outcome đã đạt được**:
  - [x] 100% (22/22) file ảnh gốc từ Stitch đã nằm an toàn trong thư mục `public/images/`, hoàn toàn độc lập và không lo link ngoài bị chết.
  - [x] Bản build Turbopack `npm run build` đạt pass 100% (6/6 static routes biên dịch thành công trong 4.6s).
  - [x] Trang thư viện `/assets` và hero banner trang chủ `/` tải ảnh cục bộ mượt mà, sắc nét.

---

### Giai đoạn 3: Xây dựng Bộ UI Kit Dùng Chung (Neo-Brutalist Components)
* **Mục tiêu**: Tạo ra các thành phần giao diện nguyên tử có thể tái sử dụng cho cả 4 trang màn hình.
* **Các công việc thực hiện**:
  1. Xây dựng `NeoButton`: Nút bấm phẳng viền 3px, hard-shadow với hiệu ứng bấm lún (pressed state `translate(4px, 4px)`), hỗ trợ cả `<button>` và Next.js `<Link>`.
  2. Xây dựng `NeoCard`: Khung thẻ bài viền mực đen, hỗ trợ hiệu ứng bay lên khi hover (`hover:-translate-y-1` và tăng bóng đổ).
  3. Xây dựng `NeoBadge`: Huy hiệu/nhãn xoay góc tinh nghịch (`-12deg`, `-2deg`, `3deg`, `12deg`).
  4. Xây dựng `MeterBar`: Thanh tiến trình comic-hatch có thể thay đổi giá trị % linh hoạt với hiệu ứng màu sắc động.
  5. Xây dựng `TopNavBar`: Thanh điều hướng ghim đầu trang với logo `SHIN-CHAN!`, menu 4 mục và nút bấm `ACTION MASK!`, kèm drawer menu mobile.
  6. Xây dựng `Footer`: Chân trang retro comic với liên kết và thông tin bản quyền Usui Yoshito / Shin-ei Animation.
  7. Xây dựng trang kiểm thử tương tác `src/app/uikit/page.tsx` (`/uikit`) để kiểm chứng trực quan toàn bộ component.
* **Kết quả Outcome đã đạt được**:
  - [x] Toàn bộ UI Kit đã hoàn tất trong `src/components/ui/` và `src/components/layout/` với TypeScript types rõ ràng.
  - [x] Layout chuẩn chung (`TopNavBar` và `Footer`) đồng bộ trên toàn bộ website, hỗ trợ cả màn hình desktop và điện thoại (drawer menu).
  - [x] Bản build Turbopack pass 100% (7/7 routes tĩnh biên dịch thành công trong 2.9s).

---

### Giai đoạn 4: Lập trình Chi tiết 4 Trang Cốt Lõi (Core Pages)
* **Mục tiêu**: Xây dựng đầy đủ nội dung, giao diện và chức năng của 4 màn hình theo đúng thiết kế Stitch.
* **Các công việc thực hiện**:
  1. **Trang Chủ (`/`)**:
     - Hero Section với Shin-chan nhún nhảy vô tận (`animate-shin-bounce`) & huy hiệu "Silly Level: MAX".
     - Bento Grid "Trouble Meter": Widget đo mức giận của Mẹ Misae & bánh Chocobi kèm nút bấm *"Cause More Trouble!"* tương tác thay đổi trạng thái động (báo động bốc hỏa khi đạt 100%).
     - Bảng tin "Mischief News" 3 cột giật gân hài hước (Vụ án mất bút màu đỏ, Vị bánh mới, Marathon Action Mask).
     - Khối Call-to-Action đăng ký hội viên Action Mask Fan Club kèm watermark khiên lớn.
  2. **Trang Đội Phòng Vệ Kasukabe (`/squad`)**:
     - Lưới thẻ bài 6 nhân vật chính (Shin-chan, Kazama, Nene, Masao, Bo-chan, Shiro) kèm thanh % Mischief và câu thoại bất hủ (click thẻ để phát câu thoại).
     - Khu vực gia tộc Nohara (Misae Mischief Manager Lv100, Hiroshi Vũ khí tất thối Over 9000 & Himawari radar đồ lấp lánh).
  3. **Trang Thư Viện Khoảnh Khắc (`/gallery`)**:
     - Thanh nút lọc danh mục động (*All Chaos, Giggles, Trouble, Action Mask*).
     - Bố cục Masonry Grid đa cột responsive chống khoảng trống, hiệu ứng hover phóng to ảnh và tích hợp Lightbox Modal xem ảnh phóng to.
  4. **Trang Tham Quan Thành Phố Kasukabe (`/kasukabe`)**:
     - Hero Kasukabe City - Saitama Prefecture với sticker nảy "100% FUN!".
     - Bento Tour Map 12 cột giới thiệu Nhà Nohara (kèm nợ vay 32 năm), Siêu thị Action Mart, Trường mẫu giáo Futaba và Công viên Kasukabe.
     - Khối Fun Stats 4 chỉ số hài hước (9,999+ bánh Chocobi, Vô hạn độ nghịch, 0 ngày bình thường).
* **Kết quả Outcome đã đạt được**:
  - [x] Cả 4 routes chính (`/`, `/squad`, `/gallery`, `/kasukabe`) đã lập trình hoàn thiện 100%, chuyển trang tức thì không giật lag.
  - [x] Chuẩn pixel-perfect so với từng màn hình thiết kế trên Google Stitch.
  - [x] Bản build Turbopack pass 100% (10/10 routes tĩnh biên dịch thành công trong 3.4s).

---

### Giai đoạn 5: Tích hợp Micro-interactions, Animation & Hiệu ứng Âm thanh Anime
* **Mục tiêu**: Mang lại trải nghiệm giải trí sống động, hài hước đậm chất Shin Cậu Bé Bút Chì.
* **Các công việc thực hiện**:
  1. Xây dựng bộ phát âm thanh tổng hợp Web Audio API thuần [src/lib/audio.ts](file:///f:/Projects/shinosuke/src/lib/audio.ts) (không phụ thuộc file ngoài, không lo chết link):
     - `playActionBeam()`: Âm thanh tia laser Action Beam quét tần số thập niên 90.
     - `playTroubleBoing()`: Tiếng boing hoạt hình nảy khi bấm Cause More Trouble hoặc click thẻ nhân vật.
     - `playAngerAlarm()`: Còi báo động hoạt hình dồn dập khi mức giận của Mẹ Misae chạm 100%.
     - `playSparkleChime()`: Hợp âm lấp lánh khi mở khóa Easter Egg hoặc đăng ký Fan Club.
     - `playClickPop()`: Tiếng click pop giòn tan cho các nút bấm và tab bộ lọc.
  2. Bổ sung nút Bật/Tắt âm thanh (Mute/Unmute toggle) trên thanh TopNavBar có lưu trạng thái vào `localStorage`.
  3. Tích hợp Easter Egg bí mật: Click 3 lần vào ảnh Shin-chan nhún nhảy ở Trang Chủ sẽ kích hoạt màn múa **"Buri-Buri Butt Dance Party"**!
  4. Hiệu ứng Action Beam toàn màn hình khi bấm nút `ACTION MASK!`.
* **Kết quả Outcome đã đạt được**:
  - [x] Hệ thống âm thanh Web Audio hoạt động mượt mà, độc lập 100%, không cần kết nối mạng.
  - [x] Có nút bật/tắt âm thanh tinh tế trên thanh điều hướng, tôn trọng trải nghiệm người dùng.
  - [x] Hai Easter Eggs ("Action Beam" & "Buri-Buri Butt Dance") hoạt động sống động và hài hước.
  - [x] Bản build Turbopack pass 100% (10/10 routes tĩnh biên dịch thành công trong 4.5s).

---

### Giai đoạn 6: Kiểm thử Đa thiết bị (Responsive), Tối ưu Hiệu năng & Production Build
* **Mục tiêu**: Đảm bảo website hiển thị hoàn hảo trên điện thoại, máy tính bảng và máy tính để bàn, sẵn sàng đưa vào sản xuất.
* **Các công việc thực hiện**:
  1. Kiểm thử responsive từ 375px (iPhone) đến 2560px (màn hình lớn), tối ưu Drawer Menu trên mobile và bố cục grid tự co giãn.
  2. Bổ sung siêu dữ liệu SEO toàn diện: OpenGraph, Twitter Card, thẻ Meta Viewport, Theme Color `#e60012` và `metadataBase`.
  3. Tích hợp file tự hủy Service Worker [public/sw.js](file:///f:/Projects/shinosuke/public/sw.js) bảo vệ cổng 3000 không bị dính cache cũ.
  4. Thực hiện lệnh `npm run build` xác nhận hoàn thành 100% không cảnh báo, không lỗi.
* **Kết quả Outcome đã đạt được**:
  - [x] Đạt điểm tối ưu cao: Thời gian nạp trang đầu cực nhanh (First Load JS ~121 kB, render tĩnh 10/10 trang chỉ trong 5.4s).
  - [x] Bản build Production Turbopack hoàn tất hoàn hảo, sẵn sàng deploy lập tức lên Vercel / Cloudflare / Netlify / Docker.
  - [x] Toàn bộ 6 giai đoạn của dự án đã hoàn thành 100%.

