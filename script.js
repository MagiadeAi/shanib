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

    videoCards.forEach(card => {
        const video = card.querySelector('video');

        // Ensure videos are paused initially
        if (video) video.pause();

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

        // Fallback for mobile: play on click
        card.addEventListener('click', () => {
            if (window.innerWidth <= 768 && video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    });

});
