# Bài học từ Rig A — quy tắc cho mọi rig sau

Rig A phải sửa bốn lần sau phản hồi: vai gãy ở `sway = 0.99`, lộ khớp chân–quần và chân–bàn chân khi chạy animation, vai vẫn gãy ở tư thế chuẩn, và hở nền giữa lông mày với tóc. Nguyên nhân chung: bản đầu chỉ được so khớp với ảnh gốc ở **tư thế chuẩn**. Các quy tắc dưới đây đã áp dụng cho Rig B ngay từ bản vẽ đầu.

## 1. Khớp

| Lỗi đã gặp | Nguyên nhân | Quy tắc |
|---|---|---|
| Lộ đầu trên của chân khi hông bật lên; lộ mép cắt của tất ở miệng bàn chân | Đầu chi chỉ chìm ~15 đơn vị, mép cắt phẳng nằm sát mép nhìn thấy | **Hai đầu chi chìm sâu** trong hình cha, sâu ≥ 2 lần biên độ di chuyển lớn nhất. Rig A: gốc chân chìm 47 trong quần, cổ chân chìm 14–18 trong bàn chân. Rig B: 27–33 và 12–14 |
| Vai "gãy": một khía lõm trước cục bắp tay | Đỉnh vai của thân chĩa thẳng vào tâm khớp, cắt đầu tròn của bắp tay gần 90° | Ở khớp, **mép hình cha và mép chi gần thẳng hàng** (lệch ≤ ~15°); gốc chi nằm chìm hẳn trong hình cha. Không vẽ góc nhọn của hình cha tại khớp |
| Khuỷu bật ra, tay gập gãy ở biên | Thân xoay ngược hông mạnh trong khi tay rất ngắn; xương cứng | **Chi ngắn → chuyển động tương đối nhỏ** (giảm xoay ngược từ 2,5° xuống 1,2°) và dùng **IK mềm**: hai đoạn co giãn theo khoảng cách hai đầu |
| Khuỷu trông như "cục tròn" | Cẳng tay rộng đều, hẹp hơn đầu tròn ở khuỷu | Dùng **đoạn thon dần** (`taperedLimb`), bề rộng đầu đoạn sau ≈ đường kính khớp |

## 2. Mảng hình

- **Các mảng kề nhau phải chồng lấn**, không chỉ chạm mép. Tóc – lông mày – mặt của Rig A chỉ chạm nhau ở một điểm nên hở nền. Mỗi mảng phải có vài điểm "chìm" nằm trong mảng vẽ sau nó.
- **Thứ tự lớp phải nhất quán với phần chìm.** Ở Rig B, tóc từng có điểm chìm nằm trong vùng áo trong khi tóc lại vẽ *trên* áo → che mất áo. Khi đổi thứ tự lớp phải rà lại mọi điểm chìm.
- **Đường bao tròn lấy mẫu dày và đều theo chiều dài cung** từ ảnh gốc (script cv2), không chọn tay vài điểm thưa: đầu của Rig A từ 16 điểm chọn tay lên 26 điểm lấy mẫu thì mới tròn như ảnh.
- **Phân biệt hai hệ toạ độ**: "mép màu" (cho khối da vẽ hai lượt, viền nằm ngoài) và "tâm nét viền" (cho hình có `stroke` ở giữa). Lẫn hai hệ làm hình nhỏ đi 2–3 px.

## 3. Kỹ thuật vẽ

- **Khối da vẽ hai lượt**: lượt viền (đen, nở ra ngoài 1 nét) cho cả khối, rồi lượt màu phủ lên. Chỗ tay nối thân tự liền mạch, không có viền cắt ngang.
- Phần vẽ lại phía trên lớp khác (bàn tay trên cạp quần): **lượt màu bắt đầu sớm hơn lượt viền** để phủ kín mép cắt, không còn đường chỉ mờ.
- **Không dùng `vector-effect: non-scaling-stroke`**: nó tính độ dày nét theo pixel màn hình, nên khi rig phóng to trên lab, nét đó mảnh hơn hẳn các nét khác.

## 4. Bài học từ Rig B

| Lỗi | Quy tắc |
|---|---|
| Viền dày 3 px, đen tuyệt đối, trong khi ảnh gốc ~2,2 px và có màu | **Đo độ dày và màu viền từ ảnh trước khi vẽ** (lát cắt vuông góc qua mép, lấy độ rộng nửa đỉnh). Mỗi mảng có thể có màu viền riêng |
| Miệng có viền riêng chồng lên viền mặt → trùng hai nét | Phần tử nằm sát mép mảng cha thì **cắt theo mảng cha (clipPath) rồi vẽ viền cha đè lên** |
| Bịa thêm chi tiết không có trong ảnh (lưỡi màu sáng) | Chỉ vẽ cái ảnh có; cần thêm thì hỏi trước |
| Đường chia hai ống quần dừng giữa chừng | Đường gấp/nếp phải chạy tới mép (gấu) như ảnh, nếu không người xem không đọc ra cấu trúc |
| Chân một đoạn thẳng nên không có dáng gối chụm | Chi có khớp ở giữa phải dựng **hai đoạn + IK**, với vị trí khớp lúc nghỉ lấy từ ảnh |
| Vớ dài, mép trên phẳng, khớp gối nằm ngay mép vớ | Khớp phải nằm ở phần da lộ ra; vớ ngắn, mép trên bo tròn |
| Đoạn "lắc nhanh gấp 8" và tăng tốc khi rê chuột làm hoạt ảnh giật | **Giữ tốc độ đều**: điểm nhấn bằng biên độ/biểu cảm, không bằng đổi tốc độ đột ngột |

## 5. Quy trình kiểm tra trước khi báo xong

1. So chồng ở tư thế chuẩn bằng chế độ "Sai khác" trên trang lab `/rig-lab` (chọn Rig A hoặc Rig B).
2. Kéo **từng tham số về hai đầu biên** và nhìn riêng từng khớp.
3. Thử **tổ hợp xấu nhất** (ví dụ Rig A: `sway ±0.99` + `jump −18` + `hemLag ±0.6`; Rig B: `walk 1` + `hop −14` + `wag ±1` + `jig ±1.5`).
4. Tab ẩn không chạy `requestAnimationFrame`: animation chạy thật chỉ kiểm tra được khi khung trình duyệt đang hiển thị.
