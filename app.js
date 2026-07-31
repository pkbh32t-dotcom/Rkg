/* ==========================================================================
   Happy Girlfriends Day Harshita - Interactive App Logic & Web Audio Synthesizer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- State Variables ---
    let carouselAngle = 0;
    let isAutoPlaying = true;
    let autoPlayInterval = null;
    let isDragging = false;
    let startX = 0;
    let currentAngle = 0;

    // --- DOM Elements ---
    const carousel = document.getElementById('carousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const autoPlayBtn = document.getElementById('autoPlayBtn');
    const cells = document.querySelectorAll('.carousel-cell');

    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const envelope = document.getElementById('envelope');

    const reasonCard = document.getElementById('reasonCard');
    const reasonIcon = document.getElementById('reasonIcon');
    const reasonText = document.getElementById('reasonText');
    const reasonCounter = document.getElementById('reasonCounter');

    const celebrateBtn = document.getElementById('celebrateBtn');
    const musicToggle = document.getElementById('musicToggle');
    const musicText = document.getElementById('musicText');
    const themeToggle = document.getElementById('themeToggle');
    const themeText = document.getElementById('themeText');

    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    const uploaderToggle = document.getElementById('uploaderToggle');
    const uploaderContent = document.getElementById('uploaderContent');
    const photoInputs = document.querySelectorAll('.photo-input');
    const resetPhotosBtn = document.getElementById('resetPhotosBtn');

    // ==========================================
    // 1. 3D Carousel & Drag Controls
    // ==========================================

    function updateCarousel() {
        carousel.style.transform = `rotateY(${carouselAngle}deg)`;
    }

    function rotateNext() {
        carouselAngle -= 90;
        updateCarousel();
    }

    function rotatePrev() {
        carouselAngle += 90;
        updateCarousel();
    }

    function startAutoPlay() {
        if (!autoPlayInterval) {
            autoPlayInterval = setInterval(rotateNext, 3500);
            isAutoPlaying = true;
            autoPlayBtn.innerHTML = '⏸ Pause Spin';
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            isAutoPlaying = false;
            autoPlayBtn.innerHTML = '▶ Auto Spin';
        }
    }

    autoPlayBtn.addEventListener('click', () => {
        if (isAutoPlaying) {
            stopAutoPlay();
        } else {
            rotateNext();
            startAutoPlay();
        }
    });

    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        rotatePrev();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        rotateNext();
    });

    // Touch & Mouse Dragging for Carousel
    const scene = document.querySelector('.scene');

    scene.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        currentAngle = carouselAngle;
        stopAutoPlay();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        carouselAngle = currentAngle + deltaX * 0.4;
        updateCarousel();
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            // Snap to nearest 90 degrees
            carouselAngle = Math.round(carouselAngle / 90) * 90;
            updateCarousel();
        }
    });

    // Touch support for mobile
    scene.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        currentAngle = carouselAngle;
        stopAutoPlay();
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const deltaX = e.touches[0].clientX - startX;
        carouselAngle = currentAngle + deltaX * 0.4;
        updateCarousel();
    });

    window.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            carouselAngle = Math.round(carouselAngle / 90) * 90;
            updateCarousel();
        }
    });

    startAutoPlay();

    // ==========================================
    // 2. Lightbox Modal for Photo Details
    // ==========================================

    cells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            // Prevent drag from triggering modal click
            if (Math.abs(e.clientX - startX) > 10) return;
            const img = cell.querySelector('img');
            const caption = cell.getAttribute('data-caption') || 'Special Memory ❤️';
            lightboxImg.src = img.src;
            lightboxCaption.textContent = caption;
            lightboxModal.classList.add('active');
        });
    });

    lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
    });

    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('active');
        }
    });

    // ==========================================
    // 3. Interactive Envelope & Love Letter
    // ==========================================

    envelope.addEventListener('click', () => {
        envelope.classList.toggle('open');
        if (envelope.classList.contains('open')) {
            createBurstEffect(envelope.offsetLeft + 160, envelope.offsetTop + 110);
            document.getElementById('envelopeHint').textContent = 'Scroll inside to read your letter! 💌';
        } else {
            document.getElementById('envelopeHint').textContent = 'Click the seal to open your special love letter 💌';
        }
    });

    // ==========================================
    // 4. "Reasons Why I Love You" Card Deck
    // ==========================================

    const reasons = [
        { icon: '🌟', text: 'Your irresistible smile brightens up even my darkest days.' },
        { icon: '🐸', text: 'How cute, goofy, and playful you are with your funny poses & plushies.' },
        { icon: '🍕', text: 'How food always tastes 100x better when we share a meal together.' },
        { icon: '👑', text: 'Your kindness, warmth, and the way you care so deeply for the people you love.' },
        { icon: '💖', text: 'How you make ordinary moments feel like absolute magic.' },
        { icon: '📸', text: 'Your effortless beauty — literally stunning in every single selfie!' },
        { icon: '🎶', text: 'How effortless it is to talk to you for hours about everything and nothing.' },
        { icon: '❤️', text: 'Simply because you are HARSHITA — my favorite human in the entire universe.' }
    ];

    let currentReasonIndex = 0;

    reasonCard.addEventListener('click', () => {
        // Animate card click
        reasonCard.style.transform = 'rotateY(90deg)';
        setTimeout(() => {
            currentReasonIndex = (currentReasonIndex + 1) % reasons.length;
            const current = reasons[currentReasonIndex];
            reasonIcon.textContent = current.icon;
            reasonText.textContent = current.text;
            reasonCounter.textContent = `Card ${currentReasonIndex + 1} of ${reasons.length}`;
            reasonCard.style.transform = 'rotateY(0deg)';
        }, 250);
    });

    // ==========================================
    // 5. Celebration Cannon (Confetti & Hearts)
    // ==========================================

    celebrateBtn.addEventListener('click', () => {
        triggerCelebration();
        playChime();
    });

    function triggerCelebration() {
        for (let i = 0; i < 60; i++) {
            createFloatingHeart(true);
            createConfettiParticle();
        }
    }

    function createConfettiParticle() {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = (Math.random() * 8 + 6) + 'px';
        confetti.style.height = (Math.random() * 14 + 8) + 'px';
        const colors = ['#ff4d8d', '#ffbe76', '#ff758c', '#ffffff', '#e2c0e8', '#ffd166'];
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '3px';
        confetti.style.zIndex = '999';
        confetti.style.pointerEvents = 'none';

        const fallDuration = Math.random() * 3 + 2;
        const rotateDeg = Math.random() * 720;
        confetti.style.transition = `transform ${fallDuration}s linear, top ${fallDuration}s linear, opacity ${fallDuration}s ease`;

        document.body.appendChild(confetti);

        requestAnimationFrame(() => {
            confetti.style.top = '105vh';
            confetti.style.transform = `rotate(${rotateDeg}deg) translateX(${Math.random() * 100 - 50}px)`;
        });

        setTimeout(() => confetti.remove(), fallDuration * 1000);
    }

    function createBurstEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            const spark = document.createElement('div');
            spark.innerHTML = '❤️';
            spark.style.position = 'fixed';
            spark.style.left = x + 'px';
            spark.style.top = y + 'px';
            spark.style.fontSize = (Math.random() * 1 + 0.8) + 'rem';
            spark.style.pointerEvents = 'none';
            spark.style.zIndex = '1000';
            spark.style.transition = 'all 1s cubic-bezier(0.1, 0.8, 0.3, 1)';

            document.body.appendChild(spark);

            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * 120 + 30;

            requestAnimationFrame(() => {
                spark.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
                spark.style.opacity = '0';
            });

            setTimeout(() => spark.remove(), 1000);
        }
    }

    // ==========================================
    // 6. Interactive Canvas Particle Background
    // ==========================================

    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 100;
            this.size = Math.random() * 15 + 8;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = Math.sin(this.y * 0.01) * 0.5;
            this.opacity = Math.random() * 0.6 + 0.3;
            this.char = Math.random() > 0.3 ? '❤️' : '✨';
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.02) * 0.6;
            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.font = `${this.size}px sans-serif`;
            ctx.fillText(this.char, this.x, this.y);
        }
    }

    const particles = Array.from({ length: 35 }, () => new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    function createFloatingHeart(burst = false) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.bottom = '-20px';
        heart.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '2';
        heart.style.opacity = '1';
        heart.style.transition = 'transform 6s linear, opacity 6s ease';

        document.body.appendChild(heart);

        requestAnimationFrame(() => {
            heart.style.transform = `translateY(-110vh) scale(${Math.random() * 1.5 + 0.8})`;
            heart.style.opacity = '0';
        });

        setTimeout(() => heart.remove(), 6000);
    }

    setInterval(() => createFloatingHeart(false), 900);

    // ==========================================
    // 7. Web Audio Romantic Synthesizer
    // ==========================================

    let audioCtx = null;
    let isPlayingMusic = false;
    let musicInterval = null;

    function playNote(freq, type = 'sine', duration = 1.5) {
        if (!audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch(e) {}
    }

    function playChime() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => playNote(freq, 'triangle', 1.2), idx * 120);
        });
    }

    function startRomanticMusic() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const chordProgression = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [220.00, 261.63, 329.63, 392.00], // Am7
            [174.61, 220.00, 261.63, 349.23], // Fmaj7
            [196.00, 246.94, 293.66, 392.00]  // G7
        ];

        let chordIdx = 0;
        let noteStep = 0;

        musicInterval = setInterval(() => {
            const currentChord = chordProgression[chordIdx];
            const noteFreq = currentChord[noteStep % currentChord.length];
            playNote(noteFreq, 'sine', 2.0);

            noteStep++;
            if (noteStep % 4 === 0) {
                chordIdx = (chordIdx + 1) % chordProgression.length;
            }
        }, 500);

        isPlayingMusic = true;
        musicText.textContent = 'Pause Music';
    }

    function stopRomanticMusic() {
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
        isPlayingMusic = false;
        musicText.textContent = 'Play Music';
    }

    musicToggle.addEventListener('click', () => {
        if (isPlayingMusic) {
            stopRomanticMusic();
        } else {
            startRomanticMusic();
        }
    });

    // ==========================================
    // 8. Custom Photo Upload & Local Storage
    // ==========================================

    uploaderToggle.addEventListener('click', () => {
        uploaderContent.classList.toggle('hidden');
    });

    photoInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            const slotIndex = parseInt(e.target.getAttribute('data-slot'));
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    const img = cells[slotIndex].querySelector('img');
                    img.src = dataUrl;
                    try {
                        localStorage.setItem(`custom_photo_${slotIndex}`, dataUrl);
                    } catch(err) {}
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Load saved custom photos if present
    function loadSavedPhotos() {
        cells.forEach((cell, idx) => {
            const saved = localStorage.getItem(`custom_photo_${idx}`);
            if (saved) {
                const img = cell.querySelector('img');
                img.src = saved;
            }
        });
    }
    loadSavedPhotos();

    resetPhotosBtn.addEventListener('click', () => {
        const defaults = ['harshita_1.jpg', 'harshita_2.jpg', 'harshita_3.jpg', 'harshita_4.jpg'];
        cells.forEach((cell, idx) => {
            localStorage.removeItem(`custom_photo_${idx}`);
            const img = cell.querySelector('img');
            img.src = defaults[idx];
        });
        alert('Photos reset to default!');
    });

    // ==========================================
    // 9. Theme Switcher (Midnight / Sunset)
    // ==========================================

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('theme-midnight')) {
            document.body.classList.remove('theme-midnight');
            document.body.classList.add('theme-sunset');
            themeText.textContent = 'Midnight Mode';
        } else {
            document.body.classList.remove('theme-sunset');
            document.body.classList.add('theme-midnight');
            themeText.textContent = 'Sunset Mode';
        }
    });

});
