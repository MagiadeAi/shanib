// script.js

document.addEventListener("DOMContentLoaded", () => {

    // --- SCROLL REVEAL ANIMATIONS ---
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 11, 13, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(11, 11, 13, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- STAT COUNTER ANIMATION ---
    const counters = document.querySelectorAll('.impact-number');
    const speed = 200; // The lower the slower

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');

                const updateCount = () => {
                    // Get current value (removing any non-digit chars if present)
                    const count = +counter.innerText.replace(/\D/g, '');
                    // Calculate increment step
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 15);
                    } else {
                        counter.innerText = target;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(startCounters, { threshold: 0.8 });
    counters.forEach(counter => counterObserver.observe(counter));

    // --- VIDEO HOVER TO PLAY ---
    const videoCards = document.querySelectorAll('.video-card');

    // Helper: mute all videos and reset all sound buttons to muted state
    function muteAllVideos() {
        videoCards.forEach(c => {
            const v = c.querySelector('video');
            const btn = c.querySelector('.sound-toggle');
            if (v) v.muted = true;
            if (btn) {
                btn.classList.remove('is-unmuted');
                const iconMuted   = btn.querySelector('.icon-muted');
                const iconUnmuted = btn.querySelector('.icon-unmuted');
                if (iconMuted)   iconMuted.style.display   = '';
                if (iconUnmuted) iconUnmuted.style.display = 'none';
            }
        });
    }

    videoCards.forEach(card => {
        const video = card.querySelector('video');
        const soundBtn = card.querySelector('.sound-toggle');

        // Ensure videos are muted & paused initially
        if (video) { video.muted = true; video.pause(); }

        card.addEventListener('mouseenter', () => {
            // Only auto-play on desktop (width > 768px)
            if (window.innerWidth > 768 && video) {
                video.play().catch(e => console.error("Video play failed:", e));
            }
        });

        card.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768 && video) {
                video.pause();
                video.currentTime = 0; // Reset to beginning
            }
        });

        // Fallback for mobile: play on click (but not if sound button was clicked)
        card.addEventListener('click', (e) => {
            if (e.target.closest('.sound-toggle')) return; // handled below
            if (window.innerWidth <= 768 && video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });

        // --- SOUND TOGGLE LOGIC ---
        if (soundBtn && video) {
            soundBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // don't trigger card play/pause

                const isCurrentlyMuted = video.muted;

                if (isCurrentlyMuted) {
                    // Unmute this video, mute all others first
                    muteAllVideos();
                    video.muted = false;
                    soundBtn.classList.add('is-unmuted');
                    soundBtn.querySelector('.icon-muted').style.display   = 'none';
                    soundBtn.querySelector('.icon-unmuted').style.display = '';

                    // Make sure it's actually playing so sound is heard
                    if (video.paused) {
                        video.play().catch(err => console.warn('Autoplay blocked:', err));
                    }
                } else {
                    // Already unmuted → mute it
                    video.muted = true;
                    soundBtn.classList.remove('is-unmuted');
                    soundBtn.querySelector('.icon-muted').style.display   = '';
                    soundBtn.querySelector('.icon-unmuted').style.display = 'none';
                }
            });

            // When this video ends or pauses, also reset sound icon
            video.addEventListener('pause', () => {
                if (!video.muted) return; // only if we externally muted
            });
        }
    });

    // --- WORK FILTER TABS ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const allVideoCards = document.querySelectorAll('.work-grid .video-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            allVideoCards.forEach(card => {
                const video = card.querySelector('video');
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden');
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                }
            });
        });
    });

});

