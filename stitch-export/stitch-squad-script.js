
    let audioCtx = null;
    let meterSoundEnabled = true;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function toggleMeterSound() {
        meterSoundEnabled = !meterSoundEnabled;
        const icon = document.getElementById('sfx-icon');
        const text = document.getElementById('sfx-text');
        if (icon && text) {
            icon.textContent = meterSoundEnabled ? 'volume_up' : 'volume_off';
            text.textContent = meterSoundEnabled ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT';
        }
    }

    // Minigame Synthesizers via Web Audio API
    function playBoingSpringSFX() {
        if (!meterSoundEnabled) return;
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.18);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.35);

        g.gain.setValueAtTime(0.25, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
    }

    function playAlarmWarningSFX() {
        if (!meterSoundEnabled) return;
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        for (let i = 0; i < 2; i++) {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sawtooth';
            const t = now + (i * 0.14);
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.linearRampToValueAtTime(1200, t + 0.08);
            g.gain.setValueAtTime(0.2, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.11);
        }
    }

    function playCalmChimeSFX() {
        if (!meterSoundEnabled) return;
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'triangle';
            const t = now + (idx * 0.08);
            osc.frequency.setValueAtTime(freq, t);
            g.gain.setValueAtTime(0.18, t);
            g.gain.exponentialRampToValueAtTime(0.005, t + 0.3);
            osc.connect(g);
            g.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.32);
        });
    }

    function playThunderWhackImpactSFX() {
        if (!meterSoundEnabled) return;
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // Big Whack
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
        g.gain.setValueAtTime(0.5, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.46);

        // Thunder rumbling noise
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(350, now);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.5);
    }

    // ========================================================
    // MISAE RAGE-O-METER GAME STATE ENGINE
    // ========================================================
    const rageStages = [
        {
            max: 20,
            title: "CẤP 1: MẸ DỊU DÀNG & NHÂN TỪ",
            badge: "AN TOÀN",
            badgeClass: "bg-green-200 text-green-900 border-black",
            icon: "🧘‍♀️",
            desc: '"Shin-chan ngoan nào, mau rửa tay xà phòng rồi vào ăn bữa tối mẹ vừa nấu xong nhé con trai yêu quý!"',
            quoteJp: "しんちゃん、手洗ってご飯食べなさい〜",
            punishment: "Trạng thái: An toàn cho mông Shin",
            colorClass: "from-emerald-500 to-green-500",
            voice: "Shin-chan ngoan nào, mẹ nấu bữa tối xong rồi đó!"
        },
        {
            max: 45,
            title: "CẤP 2: BẮT ĐẦU NỔI GÂN XANH",
            badge: "CẢNH BÁO",
            badgeClass: "bg-yellow-200 text-yellow-900 border-black",
            icon: "💢",
            desc: '"Thằng bé này lại vứt cặp sách lung tung nữa rồi! Mau dọn ngay cho mẹ, đừng để mẹ phải nói lần thứ hai đấy nhé!"',
            quoteJp: "もう〜！ランドセル投げっぱなしにしないで！",
            punishment: "Cảnh báo: Bắt đầu sưng trán",
            colorClass: "from-yellow-400 to-amber-500",
            voice: "Này Shinnosuke! Mau cất đồ đạc ngay cho mẹ!"
        },
        {
            max: 70,
            title: "CẤP 3: GẦM RA LỬA & BỐC KHÓI ĐẦU",
            badge: "NGUY HIỂM",
            badgeClass: "bg-orange-300 text-orange-900 border-black",
            icon: "🌋",
            desc: '"Không ăn ớt chuông mà lại đòi xem chị gái mặc áo tắm hả?! Shin-chan, mẹ đếm từ 1 đến 3, mau ngồi nghiêm chỉnh lại ngay!"',
            quoteJp: "ピーマン残して水着のお姉さん見たいとか何言ってんの！",
            punishment: "Hình phạt: Chuẩn bị cốc đầu cảnh cáo!",
            colorClass: "from-orange-500 to-red-500",
            voice: "Mẹ đếm từ một đến ba! Mau ăn hết đĩa ớt chuông cho mẹ!"
        },
        {
            max: 90,
            title: "CẤP 4: NẮM ĐẤM XOAY CUỒNG KHAI HỎA",
            badge: "CỰC KỲ KHẨN CẤP",
            badgeClass: "bg-red-400 text-white border-black animate-pulse",
            icon: "🥊🔥",
            desc: '"NẮM ĐẤM XOAY CUỒNG NGHIỀN THÁI DƯƠNG (Guri Guri Attack)! Hôm nay con không được ăn bánh gấu Chocobi nữa!"',
            quoteJp: "グリグリグリ〜ッ！チョコビはお預けよ！！",
            punishment: "Hậu quả: Nghiền thái dương đau điếng!",
            colorClass: "from-red-600 to-red-700",
            voice: "Ăn đấm xoay cuồng này! Hôm nay đừng hòng ăn bánh Chocobi!"
        },
        {
            max: 100,
            title: "CẤP 5: QUỶ DỮ TỨC GIẬN - KASUKABE CHẤN ĐỘNG!",
            badge: "MAX NỘ OVER 9000%",
            badgeClass: "bg-red-600 text-white border-black animate-ping",
            icon: "👹⚡",
            desc: '"SHINNOSUKEÊÊÊÊÊ! HÔM NAY CẢ BỐ VÀ CON ĐỀU PHẢI RA NGOÀI SÂN NGỦ HẾT CHO TÔI! KHÔNG THỂ THA THỨ ĐƯỢC NỮA RỒI!!!"',
            quoteJp: "しんのすけぇぇぇーっ！絶対に許さないわよーっ！！",
            punishment: "Tận thế: Sưng ba cục ổi, nhà bay nóc!",
            colorClass: "from-red-700 to-black",
            voice: "Shinnosuke! Hôm nay mẹ sẽ cho con biết tay!"
        }
    ];

    let currentRage = 0;
    let pokeCount = 0;
    let bumpsCount = 0;

    function updateRageUI() {
        const fill = document.getElementById('rage-progress-fill');
        const indicator = document.getElementById('rage-fill-indicator');
        const percentNum = document.getElementById('rage-percent-num');
        const countPokedEl = document.getElementById('count-poked');
        const countBumpsEl = document.getElementById('count-bumps');
        const flash = document.getElementById('rage-screen-flash');
        const titleBadge = document.getElementById('shin-title');

        if (fill) {
            fill.style.width = Math.min(100, Math.max(5, currentRage)) + '%';
        }
        if (indicator) {
            indicator.textContent = currentRage + '%';
        }
        if (percentNum) {
            percentNum.textContent = currentRage + '%';
            if (currentRage >= 90) {
                percentNum.classList.add('text-red-600', 'animate-pulse');
            } else {
                percentNum.classList.remove('animate-pulse');
            }
        }
        if (countPokedEl) countPokedEl.textContent = pokeCount;
        if (countBumpsEl) countBumpsEl.textContent = bumpsCount + ' 🥊';

        // Update Title according to performance
        if (titleBadge) {
            if (bumpsCount >= 6) {
                titleBadge.textContent = "Vua Lì Đòn Kasukabe";
            } else if (bumpsCount >= 3) {
                titleBadge.textContent = "Thánh Chọc Điên Mẹ";
            } else if (pokeCount >= 5) {
                titleBadge.textContent = "Chuyên Gia Quậy Phá";
            } else {
                titleBadge.textContent = "Bé Ngoan Kasukabe";
            }
        }

        // Determine Stage
        let currentStage = rageStages[0];
        for (let stage of rageStages) {
            if (currentRage <= stage.max) {
                currentStage = stage;
                break;
            }
        }
        if (currentRage >= 95) currentStage = rageStages[4];

        const levelTitle = document.getElementById('level-title');
        const levelBadge = document.getElementById('level-badge');
        const levelIcon = document.getElementById('level-icon');
        const levelDesc = document.getElementById('level-desc');
        const levelQuoteJp = document.getElementById('level-quote-jp');
        const levelPunish = document.getElementById('level-punishment');

        if (levelTitle) levelTitle.textContent = currentStage.title;
        if (levelIcon) levelIcon.textContent = currentStage.icon;
        if (levelDesc) levelDesc.textContent = currentStage.desc;
        if (levelQuoteJp) levelQuoteJp.textContent = currentStage.quoteJp;
        if (levelPunish) levelPunish.textContent = currentStage.punishment;
        if (levelBadge) {
            levelBadge.className = `text-[11px] font-label-bold border-2 px-2 py-0.5 rounded shadow-[1px_1px_0px_#000] ${currentStage.badgeClass}`;
            levelBadge.textContent = currentStage.badge;
        }

        // High rage visual flash effect
        if (flash) {
            if (currentRage >= 75) {
                flash.style.opacity = (currentRage / 100).toString();
            } else {
                flash.style.opacity = '0';
            }
        }
    }

    function addMisaeRage(amount, reasonType, messageText) {
        pokeCount++;
        playBoingSpringSFX();

        currentRage = Math.min(100, currentRage + amount);
        updateRageUI();
        updateTicker(`🔥 Shin hành động: ${messageText} (Nộ khí tăng +${amount}%)`);

        if (currentRage >= 100) {
            triggerMaxRageEvent();
        } else if (currentRage >= 70) {
            playAlarmWarningSFX();
        }
    }

    function calmMisaeRage(amount) {
        if (currentRage === 0) {
            updateTicker("Mẹ Misae đang hoàn toàn vui vẻ, không cần nịnh thêm!");
            return;
        }
        currentRage = Math.max(0, currentRage - amount);
        playCalmChimeSFX();
        updateRageUI();
        updateTicker(`💖 Shin nịnh: "Mẹ Misae hôm nay trông trẻ đẹp như thiếu nữ 18!" (Nộ khí giảm -${amount}%)`);
        speakVoice("Mẹ ơi mẹ xinh đẹp nhất quả đất, cho con ăn bánh chocobi nha!", 1.25, 1.4);
    }

    function resetRageMeter() {
        currentRage = 0;
        updateRageUI();
        closeMaxRageModal();
        playCalmChimeSFX();
        updateTicker("Đã làm hòa! Nộ khí Mẹ Misae trở về 0%. Shin hứa ngoan (nhưng sẽ tái phạm sớm thôi)!");
    }

    function triggerMaxRageEvent() {
        bumpsCount++;
        updateRageUI();

        // Screen Shake Animation on body
        const appBody = document.getElementById('app-body');
        if (appBody) {
            appBody.classList.remove('shake-screen');
            void appBody.offsetWidth; // trigger reflow
            appBody.classList.add('shake-screen');
        }

        // Sound effect: Thunder whack & rage yell
        playThunderWhackImpactSFX();
        speakVoice("SHINNOSUKE! ĂN NẮM ĐẤM QUAY CUỒNG NÀY!", 1.3, 1.4);

        // Show Modal
        const modal = document.getElementById('max-rage-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }

        // Highlight Misae character card too
        const misaeCard = document.getElementById('card-misae');
        if (misaeCard) {
            misaeCard.classList.add('speaking-card');
            setTimeout(() => misaeCard.classList.remove('speaking-card'), 4000);
        }

        updateTicker("💥 BÁO ĐỘNG ĐỎ: Nộ khí Misae chạm ngưỡng 100%! Chiêu thức 'Guri Guri' đã giáng xuống đầu Shin!");
    }

    function closeMaxRageModal() {
        const modal = document.getElementById('max-rage-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Audio SFX Synthesizers via Web Audio API for Cards
    function playShinchanSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);

        for (let i = 0; i < 3; i++) {
            const chuckle = ctx.createOscillator();
            const g = ctx.createGain();
            chuckle.type = 'sine';
            const t = now + 0.7 + (i * 0.12);
            chuckle.frequency.setValueAtTime(520 + (i * 40), t);
            chuckle.frequency.exponentialRampToValueAtTime(260, t + 0.08);
            g.gain.setValueAtTime(0.25, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
            chuckle.connect(g);
            g.connect(ctx.destination);
            chuckle.start(t);
            chuckle.stop(t + 0.09);
        }
    }

    function playMisaeRageSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

        const boing = ctx.createOscillator();
        const boingGain = ctx.createGain();
        boing.type = 'sine';
        boing.frequency.setValueAtTime(240, now + 0.1);
        boing.frequency.exponentialRampToValueAtTime(700, now + 0.4);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        boingGain.gain.setValueAtTime(0.3, now + 0.1);
        boingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        boing.connect(boingGain);
        boingGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
        boing.start(now + 0.1);
        boing.stop(now + 0.45);
    }

    function playHiroshiSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.7);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.75);

        for (let i = 0; i < 4; i++) {
            const pop = ctx.createOscillator();
            const popGain = ctx.createGain();
            pop.type = 'triangle';
            const pt = now + 0.4 + (i * 0.08);
            pop.frequency.setValueAtTime(900 + (Math.random() * 400), pt);
            popGain.gain.setValueAtTime(0.12, pt);
            popGain.gain.exponentialRampToValueAtTime(0.001, pt + 0.05);
            pop.connect(popGain);
            popGain.connect(ctx.destination);
            pop.start(pt);
            pop.stop(pt + 0.06);
        }
    }

    function playKazamaSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            const t = now + (i * 0.1);
            o.frequency.setValueAtTime(440, t);
            o.frequency.exponentialRampToValueAtTime(620, t + 0.06);
            g.gain.setValueAtTime(0.18, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.07);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(t);
            o.stop(t + 0.08);
        }
    }

    function playNeneSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [0, 0.15, 0.3].forEach((offset, idx) => {
            const punch = ctx.createOscillator();
            const g = ctx.createGain();
            punch.type = 'square';
            const t = now + offset;
            punch.frequency.setValueAtTime(160 + idx * 20, t);
            punch.frequency.exponentialRampToValueAtTime(60, t + 0.09);
            g.gain.setValueAtTime(0.28, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            punch.connect(g);
            g.connect(ctx.destination);
            punch.start(t);
            punch.stop(t + 0.11);
        });
    }

    function playMasaoSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.linearRampToValueAtTime(420, now + 0.15);
        osc.frequency.linearRampToValueAtTime(330, now + 0.3);
        osc.frequency.linearRampToValueAtTime(390, now + 0.45);
        osc.frequency.linearRampToValueAtTime(280, now + 0.7);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.72);
    }

    function playBochanSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const stone = ctx.createOscillator();
        const stoneGain = ctx.createGain();
        stone.type = 'sine';
        stone.frequency.setValueAtTime(110, now);
        stoneGain.gain.setValueAtTime(0.25, now);
        stoneGain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        stone.connect(stoneGain);
        stoneGain.connect(ctx.destination);
        stone.start(now);
        stone.stop(now + 0.65);

        const sniff = ctx.createOscillator();
        const sniffG = ctx.createGain();
        sniff.type = 'triangle';
        sniff.frequency.setValueAtTime(200, now + 0.2);
        sniff.frequency.exponentialRampToValueAtTime(650, now + 0.45);
        sniffG.gain.setValueAtTime(0.15, now + 0.2);
        sniffG.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        sniff.connect(sniffG);
        sniffG.connect(ctx.destination);
        sniff.start(now + 0.2);
        sniff.stop(now + 0.47);
    }

    function playShiroSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [0, 0.22].forEach(delay => {
            const bark = ctx.createOscillator();
            const g = ctx.createGain();
            bark.type = 'sawtooth';
            const t = now + delay;
            bark.frequency.setValueAtTime(680, t);
            bark.frequency.exponentialRampToValueAtTime(320, t + 0.12);
            g.gain.setValueAtTime(0.25, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
            bark.connect(g);
            g.connect(ctx.destination);
            bark.start(t);
            bark.stop(t + 0.14);
        });
    }

    function playHimawariSFX() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const freqs = [784, 988, 1175, 1568, 2093];
        freqs.forEach((f, i) => {
            const ch = ctx.createOscillator();
            const g = ctx.createGain();
            ch.type = 'sine';
            const t = now + (i * 0.08);
            ch.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0.18, t);
            g.gain.exponentialRampToValueAtTime(0.005, t + 0.25);
            ch.connect(g);
            g.connect(ctx.destination);
            ch.start(t);
            ch.stop(t + 0.26);
        });
    }

    function playActionMaskBeam() {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.4);
        osc.frequency.setValueAtTime(1400, now + 0.4);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.85);

        g.gain.setValueAtTime(0.3, now);
        g.gain.exponentialRampToValueAtTime(0.01, now + 0.85);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.9);

        updateTicker("⚡ ACTION BEAM! WHA-HA-HA! Công lý luôn chiến thắng!");
        speakVoice("Action Beam! Oa ha ha ha! Công lý luôn chiến thắng!", 1.2, 1.4);
    }

    // Voice lines data repository
    const characterData = {
        shinchan: {
            name: "Shin-chan",
            text: "Ora Shin-chan da zo! Chị gái xinh đẹp ơi có thích ăn ớt chuông không? Ho-ho-ho-i!",
            rate: 1.25,
            pitch: 1.5,
            sfx: playShinchanSFX,
            bubbleId: "bubble-shinchan",
            cardId: "card-shinchan",
            eqId: "eq-shinchan"
        },
        misae: {
            name: "Misae",
            text: "SHIN-CHAN! Lại không dọn đồ chơi hả?! Có tin mẹ cho ăn nắm đấm quay cuồng không?!",
            rate: 1.2,
            pitch: 1.35,
            sfx: playMisaeRageSFX,
            bubbleId: "bubble-misae",
            cardId: "card-misae",
            eqId: "eq-misae"
        },
        hiroshi: {
            name: "Hiroshi",
            text: "Haizz... Mùi tất chân 32 năm tiền nhà này sẽ cứu rỗi thế giới! Cạn ly bia thôi!",
            rate: 0.9,
            pitch: 0.75,
            sfx: playHiroshiSFX,
            bubbleId: "bubble-hiroshi",
            cardId: "card-hiroshi",
            eqId: "eq-hiroshi"
        },
        kazama: {
            name: "Kazama-kun",
            text: "Shin-chan, đừng có thổi vào tai tớ nữa mà! Xấu hổ chết đi được! Tớ phải đi học thêm!",
            rate: 1.15,
            pitch: 1.3,
            sfx: playKazamaSFX,
            bubbleId: "bubble-kazama",
            cardId: "card-kazama",
            eqId: "eq-kazama"
        },
        nene: {
            name: "Nene-chan",
            text: "Chơi trò Gia Đình Thực Tế nào! Đưa thỏ bông đây mau! Bóp bóp!",
            rate: 1.2,
            pitch: 1.45,
            sfx: playNeneSFX,
            bubbleId: "bubble-nene",
            cardId: "card-nene",
            eqId: "eq-nene"
        },
        masao: {
            name: "Masao-kun",
            text: "Sao lúc nào người chịu trận cũng là tớ chứ... Shin-chan đừng kéo quần tớ hu hu!",
            rate: 1.05,
            pitch: 1.2,
            sfx: playMasaoSFX,
            bubbleId: "bubble-masao",
            cardId: "card-masao",
            eqId: "eq-masao"
        },
        bochan: {
            name: "Bo-chan",
            text: "Bo... vừa tìm thấy một hòn đá có hình dáng giống cô Yoshinaga... Bo.",
            rate: 0.85,
            pitch: 0.85,
            sfx: playBochanSFX,
            bubbleId: "bubble-bochan",
            cardId: "card-bochan",
            eqId: "eq-bochan"
        },
        shiro: {
            name: "Shiro",
            text: "Gâu! Gâu gâu! Shin-chan lại quên cho tớ ăn cơm rồi! Gâu gâu!",
            rate: 1.3,
            pitch: 1.6,
            sfx: playShiroSFX,
            bubbleId: "bubble-shiro",
            cardId: "card-shiro",
            eqId: "eq-shiro"
        },
        himawari: {
            name: "Himawari",
            text: "Ta-da! Kira-kira! Trai đẹp và kim cương sáng lấp lánh đâu rồi!",
            rate: 1.4,
            pitch: 1.7,
            sfx: playHimawariSFX,
            bubbleId: "bubble-himawari",
            cardId: "card-himawari",
            eqId: "eq-himawari"
        }
    };

    let activeTimeout = null;

    function triggerCharacterVoice(key) {
        const char = characterData[key];
        if (!char) return;

        stopAllVisuals();

        if (typeof char.sfx === 'function') {
            char.sfx();
        }

        speakVoice(char.text, char.rate, char.pitch);

        const card = document.getElementById(char.cardId);
        const bubble = document.getElementById(char.bubbleId);
        const eq = document.getElementById(char.eqId);
        const globalViz = document.getElementById('global-visualizer');

        if (card) card.classList.add('speaking-card');
        if (bubble) bubble.classList.add('active');
        if (eq) {
            eq.classList.remove('hidden');
            eq.classList.add('flex');
        }
        if (globalViz) globalViz.classList.remove('hidden');

        updateTicker(`🎙️ Đang phát: ${char.name} — "${char.text}"`);

        clearTimeout(activeTimeout);
        activeTimeout = setTimeout(() => {
            stopAllVisuals();
            updateTicker("Sẵn sàng! Bấm vào bất kỳ nhân vật nào để tiếp tục nghe giọng.");
        }, 4500);
    }

    function speakVoice(text, rate = 1.0, pitch = 1.0) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = rate;
        utterance.pitch = pitch;

        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VN'));
        const jaVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));

        if (viVoice) {
            utterance.voice = viVoice;
        } else if (jaVoice) {
            utterance.voice = jaVoice;
        }

        window.speechSynthesis.speak(utterance);
    }

    function stopAllVisuals() {
        document.querySelectorAll('.character-card').forEach(c => c.classList.remove('speaking-card'));
        document.querySelectorAll('.comic-bubble').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('[id^="eq-"]').forEach(eq => {
            eq.classList.add('hidden');
            eq.classList.remove('flex');
        });
        const globalViz = document.getElementById('global-visualizer');
        if (globalViz) globalViz.classList.add('hidden');
    }

    function stopAllAudio() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        stopAllVisuals();
        updateTicker("Đã dừng âm thanh.");
    }

    function updateTicker(text) {
        const ticker = document.getElementById('ticker-text');
        if (ticker) ticker.innerText = text;
    }

    function playDuoBicker() {
        triggerCharacterVoice('shinchan');
        updateTicker("🔥 Khẩu chiến: Shin-chan trêu chọc mẹ Misae!");
        setTimeout(() => {
            triggerCharacterVoice('misae');
            updateTicker("💥 Khẩu chiến: Misae tung chiêu 'Nắm đấm quay cuồng' phạt Shin!");
        }, 2200);
    }

    function playRandomVoice() {
        const keys = Object.keys(characterData);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        triggerCharacterVoice(randomKey);
        
        const card = document.getElementById(characterData[randomKey].cardId);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }

    // Initialize Minigame state on start
    window.addEventListener('DOMContentLoaded', () => {
        updateRageUI();
    });
