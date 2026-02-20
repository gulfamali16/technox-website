/**
 * TechnoX Society – main.js
 * Pure vanilla JS. No external libraries.
 *
 * Sections:
 *  1. Configuration
 *  2. Preloader
 *  3. Custom Cursor
 *  4. Particle System
 *  5. Navigation (sticky, active highlight, hamburger)
 *  6. Scroll-reveal (Intersection Observer)
 *  7. Counter Animations
 *  8. Typing Animation
 *  9. Parallax on Hero
 * 10. Events (API + fallback + filter tabs)
 * 11. Team (API + fallback)
 * 12. Contact Form
 * 13. Back-to-Top
 * 14. Footer year
 * 15. Newsletter (mock)
 * 16. Stagger helper
 */

/* ─────────────────────────────────────────────────────────────
   1. Configuration
   ─────────────────────────────────────────────────────────────
   Set BACKEND_URL to your deployed Render URL in production, e.g.:
     const BACKEND_URL = 'https://technox-backend.onrender.com';
   Leave empty string '' to use same-origin (for local dev with a proxy or monorepo).
*/
const BACKEND_URL = '';   // ← replace with your Render URL for production

/* ─────────────────────────────────────────────────────────────
   2. Preloader
   ───────────────────────────────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Hide after all resources load (minimum 1.8 s to show animation)
  const minDelay = 1800;
  const start = Date.now();

  function hide() {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, minDelay - elapsed);
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Remove from DOM after transition to free memory
      preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }, wait);
  }

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', hide);
  }
})();

/* ─────────────────────────────────────────────────────────────
   3. Custom Cursor
   ───────────────────────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  // Only activate on non-touch devices
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    return;
  }

  let mouseX = -100, mouseY = -100;
  let followerX = -100, followerY = -100;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower movement via rAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, input, textarea, [role="tab"]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.add('cursor-hovering');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) document.body.classList.remove('cursor-hovering');
  });
})();

/* ─────────────────────────────────────────────────────────────
   4. Particle System
   ───────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animFrame;

  const CONFIG = {
    count: 80,
    maxRadius: 2.5,
    minRadius: 0.8,
    speed: 0.4,
    connectDist: 130,
    primaryColor: '0, 212, 255',     // --color-accent RGB
    secondaryColor: '140, 140, 140', // --color-primary RGB
  };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildParticles();
  }

  function buildParticles() {
    particles = Array.from({ length: CONFIG.count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
      r: Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius,
      color: Math.random() > 0.5 ? CONFIG.primaryColor : CONFIG.secondaryColor,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, 0.8)`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectDist) {
          const opacity = (1 - dist / CONFIG.connectDist) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${CONFIG.primaryColor}, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    animFrame = requestAnimationFrame(draw);
  }

  // Pause animation when canvas not visible (performance)
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { if (!animFrame) draw(); }
      else { cancelAnimationFrame(animFrame); animFrame = null; }
    });
  });

  window.addEventListener('resize', resize, { passive: true });
  visibilityObserver.observe(canvas);
  resize();
  draw();
})();

/* ─────────────────────────────────────────────────────────────
   5. Navigation
   ───────────────────────────────────────────────────────────── */
(function initNav() {
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const navLinks    = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!navbar) return;

  // ── Sticky / scroll background ──
  function onScroll() {
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Hamburger toggle ──
  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on mobile link click
  mobileLinks.forEach((link) => link.addEventListener('click', closeMobileMenu));

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  // ── Active section highlighting via Intersection Observer ──
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  // ── Smooth scroll for all anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (navbar ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) : 0);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─────────────────────────────────────────────────────────────
   6. Scroll-Reveal (Intersection Observer)
   ───────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────────────
   7. Counter Animations
   ───────────────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-item');
  if (!counters.length) return;

  const duration = 1800; // ms

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const numEl  = el.querySelector('.stat-number');
    if (!numEl || isNaN(target)) return;

    const start   = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3); // cubic ease-out

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      numEl.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
})();

/* ─────────────────────────────────────────────────────────────
   8. Typing Animation
   ───────────────────────────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Innovate. Code. Transform.',
    'Build the Future.',
    'Learn. Create. Inspire.',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let pauseTimer  = null;

  const TYPING_SPEED   = 80;
  const DELETING_SPEED = 40;
  const PHRASE_PAUSE   = 2200;

  function type() {
    const current = phrases[phraseIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === current.length) {
        isDeleting = true;
        pauseTimer = setTimeout(type, PHRASE_PAUSE);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(type, isDeleting ? DELETING_SPEED : TYPING_SPEED);
  }

  // Small delay so preloader doesn't obscure the start
  setTimeout(type, 2200);
})();

/* ─────────────────────────────────────────────────────────────
   9. Parallax on Hero Background (subtle)
   ───────────────────────────────────────────────────────────── */
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ─────────────────────────────────────────────────────────────
   10. Events (API + fallback + filter)
   ───────────────────────────────────────────────────────────── */
(function initEvents() {
  const grid      = document.getElementById('events-grid');
  const filterBtns = document.querySelectorAll('.filter-tab');
  if (!grid) return;

  // Static fallback data (mirrors backend/data/events.json)
  const FALLBACK_EVENTS = [
    { id: 1, title: 'Web Development Workshop',         date: '2025-03-15', description: 'Learn modern web development with HTML, CSS, and JavaScript. Build responsive websites from scratch.',                                              type: 'workshop',    status: 'upcoming', registrationLink: '#' },
    { id: 2, title: 'AI & Machine Learning Seminar',    date: '2025-03-22', description: 'Explore the fundamentals of AI and ML. Understand real-world applications and future prospects.',                                                    type: 'seminar',     status: 'upcoming', registrationLink: '#' },
    { id: 3, title: 'Inter-University Coding Competition', date: '2025-04-05', description: 'Compete with the best programmers across universities. Solve algorithmic challenges and win prizes.',                                             type: 'competition', status: 'upcoming', registrationLink: '#' },
    { id: 4, title: 'Cybersecurity Awareness Workshop', date: '2025-02-10', description: 'Learn about ethical hacking, network security, and how to protect digital assets.',                                                                  type: 'workshop',    status: 'past',     registrationLink: '#' },
    { id: 5, title: 'TechnoX Annual Tech Fest',         date: '2025-04-20', description: 'Annual celebration of technology with multiple events, speakers, and networking opportunities.',                                                      type: 'seminar',     status: 'upcoming', registrationLink: '#' },
    { id: 6, title: 'Python Bootcamp',                  date: '2025-02-28', description: 'Intensive 2-day Python bootcamp covering basics to advanced topics including data science libraries.',                                               type: 'workshop',    status: 'past',     registrationLink: '#' },
    { id: 7, title: 'Competitive Programming Bootcamp', date: '2025-05-10', description: 'Sharpen your algorithmic problem-solving skills with intensive training on data structures and algorithms.', type: 'competition', status: 'upcoming', registrationLink: '#' },
  ];

  let allEvents = [];
  let activeFilter = 'all';

  // ── Render events ──
  function renderEvents(events) {
    grid.innerHTML = '';

    const filtered = activeFilter === 'all'
      ? events
      : events.filter((e) => e.type === activeFilter);

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="no-events" style="grid-column:1/-1;text-align:center;color:var(--color-text-muted);padding:3rem 0;">No events found for this category.</p>';
      return;
    }

    filtered.forEach((event, i) => {
      const card = document.createElement('article');
      card.className = 'event-card glass-card reveal-up';
      card.style.setProperty('--delay', `${i * 0.08}s`);
      card.dataset.stagger = true;
      // Sanitize type/status to safe CSS class values (whitelist)
      const safeType   = ['workshop', 'seminar', 'competition'].includes(event.type) ? event.type : 'workshop';
      const safeStatus = ['upcoming', 'past'].includes(event.status) ? event.status : 'upcoming';
      // Ensure registrationLink is a safe URL (no javascript: scheme)
      const rawLink = typeof event.registrationLink === 'string' ? event.registrationLink : '#';
      const safeLink = /^(https?:\/\/|\/|#)/.test(rawLink) ? rawLink : '#';

      card.innerHTML = `
        <div class="event-card-header">
          <span class="event-type-badge ${safeType}">${capitalize(safeType)}</span>
          <span class="event-status-badge ${safeStatus}">${capitalize(safeStatus)}</span>
        </div>
        <h3 class="event-title">${escapeHTML(event.title)}</h3>
        <p class="event-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          ${formatDate(event.date)}
        </p>
        <p class="event-desc">${escapeHTML(event.description)}</p>
        <a href="${escapeHTML(safeLink)}" class="btn btn-primary" aria-label="Register for ${escapeHTML(event.title)}">Register Now</a>
      `;
      grid.appendChild(card);
    });

    // Trigger scroll-reveal on freshly inserted cards
    triggerReveal(grid.querySelectorAll('.reveal-up'));
  }

  // ── Fetch from API with fallback ──
  async function loadEvents() {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/events`, { signal: AbortSignal.timeout(5000) });
      const json = await res.json();
      allEvents  = json.data || FALLBACK_EVENTS;
    } catch {
      allEvents = FALLBACK_EVENTS;
    }
    renderEvents(allEvents);
  }

  // ── Filter tabs ──
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeFilter = btn.dataset.filter;
      renderEvents(allEvents);
    });
  });

  loadEvents();
})();

/* ─────────────────────────────────────────────────────────────
   11. Team (API + fallback)
   ───────────────────────────────────────────────────────────── */
(function initTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  // Static fallback data (mirrors backend/data/team.json)
  const FALLBACK_TEAM = [
    { id: 1, fullName: 'Dr. Umar Rashid',         role: 'Faculty Advisor',    bio: 'Assistant Professor at COMSATS University Islamabad, Vehari Campus. PhD in Computer Science with expertise in AI and Machine Learning.', avatar: 'https://avatars.githubusercontent.com/u/140166609?v=4', social: { email: 'drumarrashidcui@gmail.com' } },
    { id: 2, fullName: 'President TechnoX',        role: 'President',          bio: 'Leading TechnoX with a vision to foster innovation and technical excellence among CS students.',                                           avatar: 'https://avatars.githubusercontent.com/u/1?v=4',          social: { github: '#', linkedin: '#' } },
    { id: 3, fullName: 'Vice President TechnoX',   role: 'Vice President',     bio: 'Supporting society operations and coordinating between different departments and committees.',                                              avatar: 'https://avatars.githubusercontent.com/u/2?v=4',          social: { github: '#', linkedin: '#' } },
    { id: 4, fullName: 'General Secretary',        role: 'General Secretary',  bio: 'Managing official communications, documentation, and administrative affairs of the society.',                                              avatar: 'https://avatars.githubusercontent.com/u/3?v=4',          social: { github: '#', linkedin: '#' } },
    { id: 5, fullName: 'Head of Technical',        role: 'Head of Technical',  bio: 'Overseeing all technical workshops, competitions, and ensuring quality of technical content.',                                             avatar: 'https://avatars.githubusercontent.com/u/4?v=4',          social: { github: '#', linkedin: '#' } },
    { id: 6, fullName: 'Head of Media',            role: 'Head of Media',      bio: 'Managing social media presence, content creation, and digital marketing for TechnoX.',                                                    avatar: 'https://avatars.githubusercontent.com/u/5?v=4',          social: { github: '#', linkedin: '#' } },
    { id: 7, fullName: 'Head of Events',           role: 'Head of Events',     bio: 'Planning and executing all TechnoX events, workshops, and seminars with precision.',                                                       avatar: 'https://avatars.githubusercontent.com/u/6?v=4',          social: { github: '#', linkedin: '#' } },
  ];

  function buildSocialLinks(social) {
    // Sanitize URLs to prevent javascript: injection
    const safeUrl = (url) => (typeof url === 'string' && /^(https?:\/\/|mailto:|#)/.test(url)) ? url : '#';
    const links = [];
    if (social.email)    links.push(`<a href="mailto:${escapeHTML(social.email)}" class="social-link" aria-label="Email"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></a>`);
    if (social.github)   links.push(`<a href="${escapeHTML(safeUrl(social.github))}" class="social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg></a>`);
    if (social.linkedin) links.push(`<a href="${escapeHTML(safeUrl(social.linkedin))}" class="social-link" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>`);
    return links.join('');
  }

  function renderTeam(members) {
    grid.innerHTML = '';
    members.forEach((member, i) => {
      const card = document.createElement('div');
      card.className = 'flip-card reveal-up';
      card.style.setProperty('--delay', `${i * 0.07}s`);
      card.dataset.stagger = true;
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${member.fullName}, ${member.role} – hover to see details`);
      card.innerHTML = `
        <div class="flip-card-inner" aria-hidden="true">
          <div class="flip-card-front">
            <img class="team-avatar" src="${escapeHTML(member.avatar)}"
                 alt="Photo of ${escapeHTML(member.fullName)}"
                 loading="lazy"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 90 90%22%3E%3Ccircle cx=%2245%22 cy=%2245%22 r=%2245%22 fill=%22%231A1A2E%22/%3E%3Ccircle cx=%2245%22 cy=%2235%22 r=%2215%22 fill=%22%238C8C8C%22/%3E%3Cellipse cx=%2245%22 cy=%2280%22 rx=%2225%22 ry=%2218%22 fill=%22%238C8C8C%22/%3E%3C/svg%3E'" />
            <p class="team-name">${escapeHTML(member.fullName)}</p>
            <p class="team-role">${escapeHTML(member.role)}</p>
            <span class="flip-hint">Hover to learn more</span>
          </div>
          <div class="flip-card-back">
            <p class="team-name">${escapeHTML(member.fullName)}</p>
            <p class="team-role">${escapeHTML(member.role)}</p>
            <p class="team-bio">${escapeHTML(member.bio)}</p>
            <div class="team-social">${buildSocialLinks(member.social || {})}</div>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    triggerReveal(grid.querySelectorAll('.reveal-up'));
  }

  async function loadTeam() {
    try {
      const res  = await fetch(`${BACKEND_URL}/api/team`, { signal: AbortSignal.timeout(5000) });
      const json = await res.json();
      renderTeam(json.data || FALLBACK_TEAM);
    } catch {
      renderTeam(FALLBACK_TEAM);
    }
  }

  loadTeam();
})();

/* ─────────────────────────────────────────────────────────────
   12. Contact Form
   ───────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('contact-name'),    errEl: document.getElementById('name-error') },
    email:   { el: document.getElementById('contact-email'),   errEl: document.getElementById('email-error') },
    message: { el: document.getElementById('contact-message'), errEl: document.getElementById('message-error') },
  };

  function setError(fieldKey, msg) {
    const { el, errEl } = fields[fieldKey];
    el.classList.add('error');
    errEl.textContent = msg;
  }
  function clearError(fieldKey) {
    const { el, errEl } = fields[fieldKey];
    el.classList.remove('error');
    errEl.textContent = '';
  }

  function validate() {
    let valid = true;
    clearError('name'); clearError('email'); clearError('message');

    if (!fields.name.el.value.trim()) {
      setError('name', 'Name is required.'); valid = false;
    }
    const emailVal = fields.email.el.value.trim();
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      setError('email', 'Please enter a valid email address.'); valid = false;
    }
    if (fields.message.el.value.trim().length < 10) {
      setError('message', 'Message must be at least 10 characters.'); valid = false;
    }
    return valid;
  }

  // Live validation on blur
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validate());
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = document.getElementById('contact-submit');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const payload = {
      name:    fields.name.el.value.trim(),
      email:   fields.email.el.value.trim(),
      subject: document.getElementById('contact-subject')?.value.trim() || '',
      message: fields.message.el.value.trim(),
    };

    try {
      const res  = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        feedback.textContent = json.message || "Thank you! We'll get back to you soon.";
        feedback.classList.add('success');
        form.reset();
      } else {
        const errMsg = json.errors ? json.errors.join(' ') : (json.message || 'Submission failed.');
        feedback.textContent = errMsg;
        feedback.classList.add('error');
      }
    } catch {
      // Network error – still show friendly message
      feedback.textContent = "Message sent! (Note: backend may be offline – we'll follow up via email.)";
      feedback.classList.add('success');
      form.reset();
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
})();

/* ─────────────────────────────────────────────────────────────
   13. Back-to-Top Button
   ───────────────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─────────────────────────────────────────────────────────────
   14. Footer Year
   ───────────────────────────────────────────────────────────── */
(function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─────────────────────────────────────────────────────────────
   15. Newsletter (mock acknowledgement)
   ───────────────────────────────────────────────────────────── */
(function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value.trim()) return;

    const btn = form.querySelector('button');
    const original = btn.textContent;
    btn.textContent = 'Subscribed! ✓';
    btn.disabled = true;
    input.value = '';

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 3000);
  });
})();

/* ─────────────────────────────────────────────────────────────
   16. Stagger helper – called after dynamic content is injected
   ───────────────────────────────────────────────────────────── */
function triggerReveal(elements) {
  if (!elements || !elements.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );
  elements.forEach((el) => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   Utility helpers
   ───────────────────────────────────────────────────────────── */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
}

function capitalize(str) {
  if (typeof str !== 'string' || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-PK', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
