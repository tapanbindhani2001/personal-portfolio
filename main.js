/* ══════════════════════════════════════════════════════
   TAPAN PORTFOLIO v2 — main.js
   Advanced animations, particles, 3D tilt, custom cursor
══════════════════════════════════════════════════════ */

/* ── Custom Cursor ────────────────────────────────── */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cx = e.clientX; cy = e.clientY;
  if (cursorDot) { cursorDot.style.left = cx + 'px'; cursorDot.style.top = cy + 'px'; }
});

function animateCursor() {
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a,button,.btn,.filter-btn,.skill-tab,.project-card,.social-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorRing) { cursorRing.style.width = '56px'; cursorRing.style.height = '56px'; cursorRing.style.borderColor = 'rgba(124,58,237,0.7)'; }
    if (cursorDot) cursorDot.style.transform = 'translate(-50%,-50%) scale(1.8)';
  });
  el.addEventListener('mouseleave', () => {
    if (cursorRing) { cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'rgba(124,58,237,0.4)'; }
    if (cursorDot) cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

/* ── Theme Toggle ────────────────────────────────── */
const html     = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn?.querySelector('.theme-icon');
const saved    = localStorage.getItem('portfolio-theme') || 'dark';
html.setAttribute('data-theme', saved);
updateIcon(saved);

themeBtn?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', next);
  updateIcon(next);
  themeIcon.style.transform = 'rotate(360deg)';
  setTimeout(() => { themeIcon.style.transform = ''; }, 500);
});

function updateIcon(t) { if (themeIcon) themeIcon.textContent = t === 'dark' ? '☀️' : '🌙'; }

/* ── Hamburger ────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger?.addEventListener('click', () => navLinks?.classList.toggle('open'));
navLinks?.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));

/* ── Navbar scroll ────────────────────────────── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 50) navbar?.classList.add('scrolled');
  else navbar?.classList.remove('scrolled');
  lastScroll = y;
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const pos = window.scrollY + 130;
  sections.forEach(s => {
    const top = s.offsetTop, bottom = top + s.offsetHeight;
    const id = s.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (pos >= top && pos < bottom) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link?.classList.add('active');
    }
  });
}

/* ── Particle Canvas ─────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas?.getContext('2d');
let particles = [], mouse = { x: -9999, y: -9999 };

function resizeCanvas() {
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function makeParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.45 + 0.08,
    hue: Math.random() > 0.55 ? '124,58,237' : (Math.random() > 0.5 ? '6,182,212' : '236,72,153'),
  };
}

function initParticles() {
  particles = [];
  const n = Math.floor((window.innerWidth * window.innerHeight) / 12000);
  for (let i = 0; i < n; i++) particles.push(makeParticle());
}

function drawParticles() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    // Mouse repel
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      const force = (120 - dist) / 120;
      p.vx += (dx / dist) * force * 0.3;
      p.vy += (dy / dist) * force * 0.3;
    }
    p.vx *= 0.98; p.vy *= 0.98; // friction
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    // Draw dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.hue},${p.opacity})`;
    ctx.fill();
    // Connect close particles
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const ddx = q.x - p.x, ddy = q.y - p.y;
      const d = Math.sqrt(ddx * ddx + ddy * ddy);
      if (d < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${p.hue},${0.07 * (1 - d / 110)})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  });
  requestAnimationFrame(drawParticles);
}

document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

if (canvas) {
  resizeCanvas(); initParticles(); drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); }, { passive: true });
}

/* ── Typed Text ─────────────────────────────── */
const typed   = document.getElementById('typed-text');
const phrases = [
  'Spring Boot APIs.',
  'microservices.',
  'secure backends.',
  'Go services.',
  'distributed systems.',
  'scalable architectures.',
  'event-driven systems.',
  'full-stack apps.',
];
let pi = 0, ci = 0, deleting = false;

function typeLoop() {
  if (!typed) return;
  const ph = phrases[pi];
  if (deleting) {
    typed.textContent = ph.slice(0, --ci);
    if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    setTimeout(typeLoop, 55);
  } else {
    typed.textContent = ph.slice(0, ++ci);
    if (ci === ph.length) { deleting = true; setTimeout(typeLoop, 2200); return; }
    setTimeout(typeLoop, 80);
  }
}
setTimeout(typeLoop, 1200);

/* ── Skill Bars Animation ────────────────────── */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
      const w = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = w + '%';
      }, i * 120);
    });
    barObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-feature-card').forEach(el => barObserver.observe(el));

/* ── Scroll Reveal ──────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Glass Card 3D Tilt ─────────────────────── */
function addTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const xRatio = (e.clientX - r.left) / r.width  - 0.5;
      const yRatio = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-yRatio * 6}deg) rotateY(${xRatio * 6}deg) translateY(-6px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
    // Reset transform BEFORE click so inner links always fire correctly
    card.addEventListener('mousedown', () => {
      card.style.transform = '';
    });
  });
}
addTilt('.project-card');
addTilt('.stat-card');
addTilt('.sd-card');

/* ── Projects Filter ────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (show) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = '';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      }, 150);
    });
    // Fix featured grid-column
    const featured = document.querySelector('.project-card.featured');
    if (featured) featured.style.gridColumn = (filter === 'personal') ? '1' : '';
  });
});

/* ── Photo Upload ───────────────────────────── */
const photoUpload   = document.getElementById('photo-upload');
const profilePhoto  = document.getElementById('profile-photo');
const photoInitials = document.getElementById('photo-initials');
const uploadHint    = document.querySelector('.photo-upload-hint');

function applyPhoto(src) {
  if (!profilePhoto) return;
  profilePhoto.src = src;
  profilePhoto.style.display = 'block';
  if (photoInitials) photoInitials.style.display = 'none';
  if (uploadHint) {
    uploadHint.style.opacity = '0';
    uploadHint.style.transform = 'translateX(-50%) scale(0.8)';
    setTimeout(() => { uploadHint.style.display = 'none'; }, 400);
  }
}

// On page load: show initials until a saved photo exists
const savedPhoto = localStorage.getItem('portfolio-photo');
if (savedPhoto) {
  applyPhoto(savedPhoto);
} else {
  // No saved photo — ensure initials are shown, img is hidden
  if (profilePhoto) profilePhoto.style.display = 'none';
  if (photoInitials) photoInitials.style.display = 'flex';
}

photoUpload?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    applyPhoto(ev.target.result);
    try { localStorage.setItem('portfolio-photo', ev.target.result); } catch(err) {}
  };
  reader.readAsDataURL(file);
});

/* ── Timeline line animation ────────────────── */
const timelineObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const before = entry.target.querySelector('.timeline')?.querySelector('::before');
      entry.target.querySelector('.timeline')?.style && (entry.target.querySelector('.timeline').style.setProperty('--line-h','100%'));
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('#experience').forEach(s => timelineObserver.observe(s));

/* ── Smooth scroll — only for # hash links ──── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

/* ── Hero photo mouse parallax ──────────────── */
const heroVisual = document.querySelector('.hero-visual');
let floatT = 0;
function heroFloat() {
  floatT += 0.008;
  if (heroVisual) {
    heroVisual.style.transform = `translateY(${Math.sin(floatT) * 12}px) rotateY(${Math.sin(floatT * 0.5) * 3}deg)`;
  }
  requestAnimationFrame(heroFloat);
}
heroFloat();

/* ── Ripple effect on buttons ───────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);
      width:${size}px;height:${size}px;top:${e.clientY-rect.top-size/2}px;left:${e.clientX-rect.left-size/2}px;
      transform:scale(0);animation:ripple 0.6s linear;pointer-events:none;`;
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
document.head.appendChild(rippleStyle);

/* ── Stagger skill chips ────────────────────── */
const chipObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.chip,.skill-chip').forEach((chip, i) => {
      chip.style.opacity = '0';
      chip.style.transform = 'translateY(12px) scale(0.9)';
      setTimeout(() => {
        chip.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
        chip.style.opacity = '1';
        chip.style.transform = '';
      }, i * 60);
    });
    chipObserver.unobserve(entry.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-category,.skill-chips').forEach(el => chipObserver.observe(el));

/* ── SD card stagger ────────────────────────── */
const sdObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const cards = entry.target.querySelectorAll('.sd-card');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        card.style.opacity = '1';
        card.style.transform = '';
      }, i * 100);
    });
    sdObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.system-design-grid').forEach(el => sdObserver.observe(el));

/* ── Floating code badge glow pulse ─────────── */
const codeBadge = document.querySelector('.code-badge');
if (codeBadge) {
  setInterval(() => {
    codeBadge.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4), 0 0 40px rgba(124,58,237,0.5)';
    setTimeout(() => { codeBadge.style.boxShadow = ''; }, 1000);
  }, 3000);
}

console.log('%c ⚡ Tapan Bindhani Portfolio ', 'background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;font-size:15px;padding:10px 20px;border-radius:10px;font-weight:800;font-family:monospace;');
console.log('%c Stack: Java · Spring Boot · Go · Microservices · Docker', 'color:#06b6d4;font-size:12px;padding:4px 10px;');

/* ═══════════════════════════════════════════════════════
   NEW INTERACTIVE LOGIC: SCROLL BAR, TOAST, MODAL, BACK-TO-TOP
═══════════════════════════════════════════════════════ */

// ── 1. Top Scroll Progress Bar & Back to Top ────────
const progressBar = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';
  }

  if (backToTopBtn) {
    if (scrollTop > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }
}, { passive: true });

backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── 2. Toast Notification Function ─────────────────
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
let toastTimer = null;

function showToast(msg) {
  if (!toast) return;
  if (toastText) toastText.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ── 3. 1-Click Copy Buttons ─────────────────────────
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    const textToCopy = btn.dataset.copy;
    if (!textToCopy) return;

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Email copied to clipboard! ✨');
      }).catch(() => {
        fallbackCopy(textToCopy);
      });
    } else {
      fallbackCopy(textToCopy);
    }
  });
});

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast('Email copied to clipboard! ✨');
  } catch (err) {
    showToast('Could not copy email');
  }
  document.body.removeChild(ta);
}

// ── 4. Project Deep-Dive Data & Modal ────────────────
const projectData = {
  inspyred: {
    icon: '🛡️',
    title: 'InspyreD — Security Orchestration Platform',
    subtitle: 'AI-Powered Automated Penetration Testing & Vulnerability Assessment',
    overview: 'InspyreD combines Large Language Models (LLMs) with specialized penetration testing binaries to perform comprehensive, goal-driven security audits with autonomous planning and feedback loops.',
    arch: `[User Goal] ──> [LLM Planner] ──> [Temporal Workflow Coordinator]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
        [pentest-agent: Worker]                [pentest-mcp: Host]
                 │                                       │
                 ▼                                       ▼
       [Knowledge Graph: Postgres]             [Tool Execution: Nmap/Sqlmap]`,
    challenges: [
      '<strong>Durable Workflow Orchestration:</strong> Used Temporal to manage long-running security scans with persistent state and automatic activity retries on failure.',
      '<strong>Tool Execution Protocol:</strong> Integrated Model Context Protocol (MCP) to standardize communication between the LLM brain and host security binaries.',
      '<strong>Dynamic Knowledge Graph:</strong> Architected relational PostgreSQL graph schemas to store discovered subdomains, open ports, and CVEs for adaptive LLM reflection.'
    ],
    tech: ['Go', 'Gin', 'Temporal.io', 'PostgreSQL', 'NATS', 'OpenAI API', 'SvelteKit', 'OpenTelemetry', 'Docker']
  },
  lifeos: {
    icon: '🌟',
    title: 'LifeOS — All-in-One Productivity Platform',
    subtitle: 'Unified Personal Operating System for Tasks, Habits, Finances & AI',
    overview: 'A complete full-stack productivity suite integrating Calendar, Task Management, Habit Streaks, Expense Tracking, Document Vault, and an AI assistant across web and mobile platforms.',
    arch: `[React Web / React Native Mobile] ──> [Spring Security + JWT Filter]
                                           │
                                           ▼
                                 [Spring Boot API Services]
                                           │
                                ┌──────────┴──────────┐
                                ▼                     ▼
                       [PostgreSQL Database]    [Cloud: AWS & Firebase]`,
    challenges: [
      '<strong>Stateless Authentication & RBAC:</strong> Implemented JWT token lifecycle with Spring Security filter chains and fine-grained endpoint authorization.',
      '<strong>Cross-Platform Synchronization:</strong> Designed unified REST API contracts consumed concurrently by React SPA and React Native mobile clients.',
      '<strong>Data Modeling:</strong> Optimized JPA entities with Hibernate indexing for high-frequency habit streaks and financial transaction aggregates.'
    ],
    tech: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'PostgreSQL', 'React', 'React Native', 'AWS', 'Firebase']
  },
  vynexbank: {
    icon: '🏦',
    title: 'VynexBank — Banking Microservices System',
    subtitle: 'High-Resilience Banking Application with Service Discovery & API Gateway',
    overview: 'A production-grade distributed banking management platform built on Spring Boot microservices, demonstrating service discovery, gateway routing, and transactional isolation.',
    arch: `[React Banking UI] ──> [Spring Cloud API Gateway (Port 8080)]
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
             [Auth Service]  [Account Svc]  [Transaction Svc]
                    │              │              │
                    └──────────────┴──────────────┘
                                   │
                      [Eureka Service Registry]
                                   │
                         [PostgreSQL Clusters]`,
    challenges: [
      '<strong>Dynamic Service Discovery:</strong> Configured Netflix Eureka for dynamic heartbeat registration and client-side load balancing.',
      '<strong>Centralized Routing:</strong> Built API Gateway with rate-limiting filters and centralized JWT validation to shield downstream services.',
      '<strong>Containerized Topology:</strong> Orchestrated multi-container stack with Docker Compose and healthcheck dependency chains.'
    ],
    tech: ['Java', 'Spring Boot', 'Spring Cloud', 'Netflix Eureka', 'API Gateway', 'PostgreSQL', 'React', 'Docker Compose']
  },
  vyp: {
    icon: '✅',
    title: 'VYP — Verify Your Provider',
    subtitle: 'Enterprise Healthcare Provider Credentialing & Verification Engine',
    overview: 'Enterprise data pipeline processing healthcare provider credentials from SFTP and MongoDB, verifying across multiple external REST endpoints and private sources, with automated PDF/XML/CSV reporting.',
    arch: `[SFTP / MongoDB] ──> [Validator Service] ──> [RabbitMQ Event Bus]
                                                      │
                                                      ▼
                                       [Task-Generator-Verifier]
                                        (REST / DB / Scrapers)
                                                      │
                                                      ▼
                                       [Verification-Completion]
                                         (PDF / XML / CSV Reports)`,
    challenges: [
      '<strong>Event-Driven Async Pipeline:</strong> Utilized RabbitMQ message queues to decouple high-volume screening batches and handle delayed retry policies.',
      '<strong>Distributed Lock Management:</strong> Employed ShedLock to avoid duplicate batch execution across horizontally scaled service instances.',
      '<strong>Database Versioning:</strong> Maintained database evolutions across environments using Liquibase changelogs.'
    ],
    tech: ['Java', 'Spring Boot 2.7', 'RabbitMQ', 'PostgreSQL', 'MongoDB', 'Liquibase', 'ShedLock', 'Docker', 'Jenkins', 'Gradle']
  }
};

const modalBackdrop = document.getElementById('project-modal');
const modalContainer = document.getElementById('modal-content-container');
const modalCloseBtn = document.getElementById('modal-close');

function openProjectModal(key) {
  const data = projectData[key];
  if (!data || !modalContainer || !modalBackdrop) return;

  const techHtml = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
  const challengeHtml = data.challenges.map(c => `<li>${c}</li>`).join('');

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div class="modal-icon">${data.icon}</div>
      <div>
        <h3 class="modal-title">${data.title}</h3>
        <p class="modal-subtitle">${data.subtitle}</p>
      </div>
    </div>
    <div class="modal-section-title">📌 Project Overview</div>
    <p class="modal-text">${data.overview}</p>
    
    <div class="modal-section-title">🏗️ System Architecture Flow</div>
    <pre class="modal-arch-box">${data.arch}</pre>
    
    <div class="modal-section-title">⚡ Key Engineering Solutions &amp; Challenges</div>
    <ul class="modal-bullets">
      ${challengeHtml}
    </ul>
    
    <div class="modal-section-title">🛠️ Technologies Used</div>
    <div class="modal-tech-wrap">
      ${techHtml}
    </div>
  `;

  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.btn-deepdive').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const key = btn.dataset.project;
    if (key) openProjectModal(key);
  });
});

modalCloseBtn?.addEventListener('click', closeProjectModal);

modalBackdrop?.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeProjectModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) {
    closeProjectModal();
  }
});
