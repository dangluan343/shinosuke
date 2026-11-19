import { REST, TUNE } from '../rigA.pose';
import { REST_B, TUNE_B } from '../rigB.pose';

/**
 * Mô tả từng thông số trên trang lab: tên, đơn vị, khoảng chỉnh và MỤC ĐÍCH.
 * Số đo "px" là pixel của ảnh gốc (rig dùng chung hệ toạ độ với ảnh).
 */
export type Param = {
  key: string;
  label: string;
  unit?: string;
  min: number;
  max: number;
  step: number;
  def: number;
  purpose: string;
};

export type RigId = 'a' | 'b';

export type RigSpec = {
  id: RigId;
  name: string;
  short: string;
  description: string;
  bg: string;
  reference: string;
  pose: Param[];
  tune: Param[];
};

const p = (def: Record<string, number>, key: string, rest: Omit<Param, 'key' | 'def'>): Param => ({ key, def: def[key], ...rest });

export const RIG_A: RigSpec = {
  id: 'a',
  name: 'Rig A · Lắc hông',
  short: 'Rig A',
  description: 'Đứng quay lưng, tay chống hông, lắc mông theo nhịp; chân nhấc gót luân phiên.',
  bg: '#EAE8FD',
  reference: '/reference/pose-a-back-sway.png',
  pose: [
    p(REST, 'sway', { label: 'Lắc hông', min: -1, max: 1, step: 0.01, purpose: 'Kênh chính của điệu nhảy: −1 là hông dồn hết sang trái, 1 là hết sang phải. Thân, đầu, tay, chân đều tính theo giá trị này.' }),
    p(REST, 'dip', { label: 'Nhún', unit: 'px', min: 0, max: 14, step: 0.1, purpose: 'Hạ cả người xuống. Khi chạy, mỗi đầu biên lắc nhún một lần.' }),
    p(REST, 'jump', { label: 'Bật lên', unit: 'px', min: -20, max: 0, step: 0.1, purpose: 'Cả người bật lên (âm là lên trên) – dùng khi bị chọc vào mông.' }),
    p(REST, 'lean', { label: 'Ngả theo chuột', unit: 'px', min: -10, max: 10, step: 0.1, purpose: 'Hông ngả thêm về phía con trỏ chuột.' }),
    p(REST, 'heelL', { label: 'Gót trái', min: -1, max: 1, step: 0.01, purpose: 'Nhấc gót chân trái (1) hoặc ấn gót xuống (−1). Khi chạy: hông sang phải thì chân trái hết chịu lực và nhấc gót – tạo nhịp chân.' }),
    p(REST, 'heelR', { label: 'Gót phải', min: -1, max: 1, step: 0.01, purpose: 'Như gót trái, cho chân phải: nhấc khi hông dồn sang trái.' }),
    p(REST, 'jig', { label: 'Rung mông', min: -1, max: 1, step: 0.01, purpose: 'Độ lệch của lò xo phụ: mông văng trễ sau hông rồi bật lại.' }),
    p(REST, 'hemLag', { label: 'Gấu quần trễ', min: -1, max: 1, step: 0.01, purpose: 'Gấu quần văng chậm hơn cạp quần mỗi khi đổi chiều lắc.' }),
    p(REST, 'headRot', { label: 'Xoay đầu', unit: '°', min: -12, max: 12, step: 0.1, purpose: 'Đầu nghiêng thêm so với thân. Khi chạy, đầu xoay ngược hông và gật theo phách.' }),
    p(REST, 'brow', { label: 'Nhướng mày', min: 0, max: 1, step: 0.01, purpose: 'Lông mày nhích lên – dùng ở phách cuối của câu nhạc.' }),
    p(REST, 'blush', { label: 'Má hồng', min: 0, max: 1, step: 0.01, purpose: 'Vệt má hồng đậm và dày hơn – ở phách cuối mỗi câu nhạc hoặc khi rê chuột lên quần.' }),
  ],
  tune: [
    p(TUNE, 'tempo', { label: 'Tốc độ', unit: '×', min: 0.25, max: 2, step: 0.05, purpose: 'Nhân tốc độ của cả điệu nhảy. 1 = một lượt lắc mỗi giây (khoảng 120 BPM).' }),
    p(TUNE, 'hipX', { label: 'Biên độ lắc ngang', unit: 'px', min: 0, max: 20, step: 0.5, purpose: 'Hông dịch sang mỗi bên bao nhiêu khi lắc hết cỡ (lắc hông = ±1).' }),
    p(TUNE, 'hipRot', { label: 'Độ nghiêng hông', unit: '°', min: 0, max: 10, step: 0.1, purpose: 'Hông xoay bao nhiêu độ ở hai đầu biên.' }),
    p(TUNE, 'torsoRot', { label: 'Thân xoay ngược', unit: '°', min: 0, max: 4, step: 0.1, purpose: 'Thân xoay ngược chiều hông để giữ thăng bằng. Giữ nhỏ: tay rất ngắn, xoay lớn sẽ làm khuỷu gãy.' }),
    p(TUNE, 'torsoFollow', { label: 'Thân đi theo hông', min: 0, max: 1, step: 0.01, purpose: '0 = thân đứng yên khi hông lắc, 1 = thân dịch đúng bằng hông.' }),
    p(TUNE, 'armStretch', { label: 'Độ co giãn của tay', min: 0, max: 1, step: 0.01, purpose: 'Khi hông kéo cổ tay đi: 0 = xương cứng (khuỷu dễ bật ra), 1 = tay co giãn hoàn toàn, góc khuỷu không đổi.' }),
    p(TUNE, 'dipDepth', { label: 'Độ nhún mỗi nhịp', unit: 'px', min: 0, max: 14, step: 0.5, purpose: 'Mức nhún ở hai đầu biên lắc khi animation chạy.' }),
    p(TUNE, 'jigAmp', { label: 'Biên độ rung mông', unit: 'px', min: 0, max: 18, step: 0.5, purpose: 'Mông văng xa bao nhiêu theo lò xo phụ.' }),
    p(TUNE, 'hemAmp', { label: 'Biên độ văng gấu quần', unit: 'px', min: 0, max: 24, step: 0.5, purpose: 'Gấu quần văng trễ xa bao nhiêu khi đổi chiều.' }),
    p(TUNE, 'heelLift', { label: 'Độ kiễng khi nhấc gót', min: 0, max: 0.25, step: 0.005, purpose: 'Bàn chân dài thêm bao nhiêu phần khi gót nhấc lên – tạo cảm giác kiễng chân.' }),
    p(TUNE, 'footTurn', { label: 'Bàn chân xoay ra', unit: '°', min: 0, max: 15, step: 0.5, purpose: 'Bàn chân xoay ra ngoài bao nhiêu khi nhấc gót.' }),
    p(TUNE, 'leanAmp', { label: 'Mức ngả theo chuột', unit: 'px', min: 0, max: 15, step: 0.5, purpose: 'Hông ngả tối đa bao nhiêu khi con trỏ ở sát mép màn hình.' }),
  ],
};

export const RIG_B: RigSpec = {
  id: 'b',
  name: 'Rig B · Chổng mông đi',
  short: 'Rig B',
  description: 'Chổng mông đi bằng những bước kiễng ngắn, vừa đi vừa cười; tự lật khi chạm mép.',
  bg: '#C6ADEF',
  reference: '/reference/pose-b-butt-walk.png',
  pose: [
    p(REST_B, 'phase', { label: 'Pha bước', min: 0, max: 1, step: 0.005, purpose: 'Vị trí trong một chu kỳ 2 bước. 0 = chân gần bắt đầu chống, 0,5 = chân xa bắt đầu chống.' }),
    p(REST_B, 'walk', { label: 'Mức đi', min: 0, max: 1, step: 0.01, purpose: 'Trộn giữa tư thế đứng (0, giống ảnh gốc) và tư thế đang bước (1). Kéo lên 1 rồi chỉnh "Pha bước" để xem từng khung của bước đi.' }),
    p(REST_B, 'wag', { label: 'Vẫy mông', min: -1, max: 1, step: 0.01, purpose: 'Mông xoay sang hai bên. Chỉ dùng khi chỉnh tay – animation đi đều không vẫy.' }),
    p(REST_B, 'jig', { label: 'Nảy mông', min: -1.5, max: 1.5, step: 0.01, purpose: 'Mông giãn dọc (dương) hoặc dẹt xuống (âm) – squash & stretch theo nhịp bước.' }),
    p(REST_B, 'mouth', { label: 'Há miệng', min: 0, max: 1, step: 0.01, purpose: '0 = gần khép, 1 = há to như ảnh gốc. Khi chạy, miệng cười một nhịp mỗi bước.' }),
    p(REST_B, 'nod', { label: 'Gật đầu', min: -1, max: 1, step: 0.01, purpose: 'Đầu gật lên xuống theo bước.' }),
    p(REST_B, 'hop', { label: 'Nhảy', unit: 'px', min: -14, max: 0, step: 0.1, purpose: 'Cả người nhảy lên (âm là lên trên) – khi quay đầu đổi hướng.' }),
    p(REST_B, 'blush', { label: 'Má hồng', min: 0, max: 1, step: 0.01, purpose: 'Má hồng đậm hơn – khi bấm vào nhân vật hoặc khi rê chuột lên người.' }),
  ],
  tune: [
    p(TUNE_B, 'cycle', { label: 'Thời gian 2 bước', unit: 's', min: 0.3, max: 1.6, step: 0.05, purpose: 'Một chu kỳ gồm 2 bước. Nhỏ = đi nhanh hơn.' }),
    p(TUNE_B, 'step', { label: 'Độ dài bước', unit: 'px', min: 6, max: 28, step: 0.5, purpose: 'Mỗi bước dài bao nhiêu. Tốc độ chạy ngang tự tính theo bước (2 bước mỗi chu kỳ) để chân không trượt trên sàn.' }),
    p(TUNE_B, 'lift', { label: 'Nhấc chân', unit: 'px', min: 0, max: 14, step: 0.5, purpose: 'Bàn chân nhấc cao bao nhiêu khi đưa về phía trước.' }),
    p(TUNE_B, 'shoeTip', { label: 'Mũi giày chúi', unit: '°', min: 0, max: 25, step: 0.5, purpose: 'Mũi giày chúi xuống bao nhiêu khi chân đang nhấc.' }),
    p(TUNE_B, 'bounce', { label: 'Nảy thân', unit: 'px', min: 0, max: 14, step: 0.5, purpose: 'Thân nảy lên giữa hai lần chân chạm đất.' }),
    p(TUNE_B, 'hipRot', { label: 'Hất mông', unit: '°', min: 0, max: 10, step: 0.1, purpose: 'Mông hất lên bao nhiêu độ mỗi nhịp nảy.' }),
    p(TUNE_B, 'squash', { label: 'Co giãn mông', min: 0, max: 0.2, step: 0.005, purpose: 'Mông giãn/dẹt bao nhiêu theo nhịp nảy (squash & stretch). 0 = cứng như đá.' }),
    p(TUNE_B, 'nod', { label: 'Biên độ gật đầu', unit: '°', min: 0, max: 8, step: 0.1, purpose: 'Đầu gật bao nhiêu độ theo bước.' }),
    p(TUNE_B, 'wagRot', { label: 'Biên độ vẫy mông', unit: '°', min: 0, max: 15, step: 0.5, purpose: 'Mông xoay tối đa bao nhiêu khi kéo thanh "Vẫy mông" hết cỡ.' }),
  ],
};

export const RIGS: Record<RigId, RigSpec> = { a: RIG_A, b: RIG_B };
