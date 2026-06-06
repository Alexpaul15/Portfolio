/* =============================================
   PAUL ALEX SAMUEL — Portfolio Scripts
   ============================================= */

'use strict';

/* Enable progressive enhancement — content visible without JS */
document.documentElement.classList.add('js');

/* ---- CUSTOM CURSOR ---- */
(function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mx = -100, my = -100, fx = -100, fy = -100;
    let rafId;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animateCursor() {
        cursor.style.left = mx + 'px';
        cursor.style.top  = my + 'px';
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        follower.style.left = fx + 'px';
        follower.style.top  = fy + 'px';
        rafId = requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .project-card, .about-card, .skill-block, .cert-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '16px';
            cursor.style.height = '16px';
            follower.style.width = '52px';
            follower.style.height = '52px';
            follower.style.borderColor = 'rgba(99,102,241,.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            follower.style.width = '36px';
            follower.style.height = '36px';
            follower.style.borderColor = 'rgba(99,102,241,.4)';
        });
    });
})();

/* ---- NAVBAR SCROLL ---- */
(function initNavbar() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ---- HAMBURGER ---- */
(function initHamburger() {
    const btn = document.getElementById('hamburger');
    const links = document.getElementById('navLinks');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('.nav-link').forEach(a =>
        a.addEventListener('click', () => links.classList.remove('open'))
    );
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') links.classList.remove('open');
    });
})();

/* ---- TYPEWRITER ---- */
(function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const phrases = [
        'Generative AI Systems',
        'RAG Pipelines',
        'Multi-Agent Architectures',
        'LLM-Powered Products',
        'Document AI Solutions',
        'Text-to-SQL Engines',
    ];

    let phraseIdx = 0, charIdx = 0, deleting = false, pauseTimer = null;

    function type() {
        const phrase = phrases[phraseIdx];

        if (!deleting) {
            el.textContent = phrase.slice(0, charIdx + 1);
            charIdx++;
            if (charIdx === phrase.length) {
                deleting = true;
                pauseTimer = setTimeout(type, 2000);
                return;
            }
            pauseTimer = setTimeout(type, 60);
        } else {
            el.textContent = phrase.slice(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                deleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                pauseTimer = setTimeout(type, 400);
                return;
            }
            pauseTimer = setTimeout(type, 35);
        }
    }
    type();
})();

/* ---- ANIMATED COUNTERS ---- */
(function initCounters() {
    const statNums = document.querySelectorAll('.hero-stat-num[data-target]');
    if (!statNums.length) return;

    let started = false;

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function runCounters() {
        if (started) return;
        started = true;

        statNums.forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1800;
            const startTime = performance.now();

            function step(now) {
                const t = Math.min((now - startTime) / duration, 1);
                el.textContent = Math.round(easeOut(t) * target);
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        });
    }

    const hero = document.querySelector('.hero-stats');
    if (!hero) return;
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { runCounters(); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(hero);
})();

/* ---- PARTICLE CANVAS ---- */
(function initCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const PARTICLE_COUNT = 70;
    const particles = [];

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x  = Math.random() * canvas.width;
            this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
            this.r  = Math.random() * 1.8 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = -(Math.random() * 0.5 + 0.2);
            this.alpha = Math.random() * 0.5 + 0.2;
            this.color = Math.random() > 0.5
                ? `rgba(99,102,241,${this.alpha})`
                : `rgba(168,85,247,${this.alpha})`;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -5) this.reset(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    const CONNECT_DIST = 110;

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < CONNECT_DIST) {
                    const opacity = (1 - d / CONNECT_DIST) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241,${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    let animId;
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animId = requestAnimationFrame(loop);
    }
    loop();

    // Pause when hero is not visible for perf
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!animId) loop();
            } else {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }, { threshold: 0 });
        obs.observe(heroSection);
    }
})();

/* ---- SCROLL REVEAL ---- */
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    els.forEach((el, i) => {
        el.style.transitionDelay = (i % 4) * 0.08 + 's';
        obs.observe(el);
    });

    // Fallback: ensure content is never permanently hidden
    setTimeout(() => {
        els.forEach(el => el.classList.add('visible'));
    }, 2500);
})();

/* ---- ACTIVE NAV LINK ---- */
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;

    function update() {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
        });
        links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
})();

/* ---- SMOOTH ANCHOR SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    });
});

/* ---- CONSOLE EASTER EGG ---- */
console.log(
    '%c Paul Alex Samuel — AI Engineer ',
    'background: linear-gradient(135deg,#6366f1,#a855f7); color:#fff; font-size:14px; font-weight:bold; padding:8px 16px; border-radius:8px;'
);
console.log('%c github.com/Alexpaul15', 'color:#6366f1; font-size:12px;');
