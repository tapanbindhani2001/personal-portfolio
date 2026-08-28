/* ═════════════════════════════════════════════════════════════
   TAPAN BINDHANI — MODERN BENTO JS
   Features: GSAP ScrollTrigger, Lucide Icons, Spotlight Physics
═════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Initialize Lucide Icons ────────────────────────────
  if (window.lucide) {
    lucide.createIcons();
  }

  // ── 2. Theme Toggling (Dark / Light) ──────────────────────
  const html = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = theme === 'dark'
      ? '<i data-lucide="sun"></i>'
      : '<i data-lucide="moon"></i>';
    if (window.lucide) lucide.createIcons();
  }

  // ── 3. Mobile Hamburger Menu ──────────────────────────────
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  hamburgerBtn?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
    });
  });

  // ── 4. Mouse-Follow Spotlight Physics on Bento Cards ──────
  document.querySelectorAll('.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ── 5. Scroll Progress Bar & Back to Top ──────────────────
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 450) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    // Active Nav Link on Scroll
    const sections = document.querySelectorAll('section[id], header[id]');
    const scrollPos = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navLink?.classList.add('active');
      }
    });
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Smooth scroll for nav anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── 6. Typewriter Effect ──────────────────────────────────
  const typedEl = document.getElementById('typed-text');
  const phrases = [
    'microservices.',
    'Spring Boot APIs.',
    'Go services.',
    'distributed systems.',
    'event-driven queues.',
    'scalable backends.'
  ];
  let pIdx = 0, cIdx = 0, isDeleting = false;

  function typeLoop() {
    if (!typedEl) return;
    const currentPhrase = phrases[pIdx];

    if (isDeleting) {
      typedEl.textContent = currentPhrase.slice(0, --cIdx);
      if (cIdx === 0) {
        isDeleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
      setTimeout(typeLoop, 50);
    } else {
      typedEl.textContent = currentPhrase.slice(0, ++cIdx);
      if (cIdx === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeLoop, 2000);
        return;
      }
      setTimeout(typeLoop, 80);
    }
  }
  setTimeout(typeLoop, 1000);

  // ── 7. 1-Click Copy with Toast ────────────────────────────
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(text) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  document.querySelectorAll('.copy-pill-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const copyVal = btn.dataset.copy;
      if (!copyVal) return;

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(copyVal).then(() => {
          showToast('Email copied to clipboard! ✨');
        }).catch(() => fallbackCopy(copyVal));
      } else {
        fallbackCopy(copyVal);
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
    } catch (e) {
      showToast('Could not copy email');
    }
    document.body.removeChild(ta);
  }

  // ── 8. Project Architecture Deep-Dive Modal ───────────────
  const projectDatabase = {
    inspyred: {
      title: 'InspyreD — Security Orchestration Platform',
      subtitle: 'AI-Driven Automated Penetration Testing & Vulnerability Mapping',
      overview: 'InspyreD coordinates Large Language Models (LLMs) with host security binaries to execute autonomous, multi-phase vulnerability assessments with continuous feedback loops.',
      arch: `[User Goal] ──> [LLM Planner] ──> [Temporal Workflow Engine]
                                      │
                  ┌───────────────────┴───────────────────┐
                  ▼                                       ▼
         [Worker: pentest-agent]                 [MCP Protocol: Host Tools]
                  │                                       │
                  ▼                                       ▼
        [Knowledge Graph: Postgres]             [Nmap / Sqlmap / Nuclei]`,
      challenges: [
        '<strong>Durable Workflow Orchestration:</strong> Leveraged Temporal.io to manage long-running multi-hour penetration testing pipelines with state recovery across worker restarts.',
        '<strong>Model Context Protocol (MCP):</strong> Standardized communication layer between LLM agents and operating system tools without arbitrary shell risks.',
        '<strong>Adaptive Knowledge Graph:</strong> Architected relational PostgreSQL models to track attack surface entities (ports, CVEs, endpoints) for autonomous reflection.'
      ],
      tech: ['Go', 'Gin', 'Temporal.io', 'PostgreSQL', 'NATS', 'OpenAI API', 'SvelteKit', 'Docker', 'OpenTelemetry']
    },
    lifeos: {
      title: 'LifeOS — All-in-One Productivity Platform',
      subtitle: 'Unified Personal Operating System with Calendar, Tasks, Finances & AI',
      overview: 'Full-stack productivity ecosystem bringing together calendar events, task boards, habit streaks, expense tracking, document vault, and an embedded AI assistant across web and mobile clients.',
      arch: `[React Web / React Native] ──> [Spring Security + JWT Filter]
                                            │
                                            ▼
                                  [Spring Boot REST Services]
                                            │
                                 ┌──────────┴──────────┐
                                 ▼                     ▼
                        [PostgreSQL DB]          [AWS / Firebase]`,
      challenges: [
        '<strong>Stateless JWT Security & RBAC:</strong> Configured custom Spring Security filter chains with refresh token rotation and granular endpoint authorization.',
        '<strong>Unified REST API Design:</strong> Built consistent API schemas consumed concurrently by React SPA web clients and React Native mobile apps.',
        '<strong>Database Indexing:</strong> Structured PostgreSQL schemas with JPA/Hibernate indexing for instant habit streak analytics and financial aggregates.'
      ],
      tech: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'PostgreSQL', 'React', 'React Native', 'AWS', 'Firebase']
    },
    vynexbank: {
      title: 'VynexBank — Banking Microservices',
      subtitle: 'High-Resilience Distributed Banking Architecture with Service Discovery',
      overview: 'Production-grade distributed banking management platform built on Spring Boot microservices, demonstrating API Gateway routing, Eureka service discovery, and containerized clustering.',
      arch: `[React Banking Dashboard] ──> [Spring Cloud API Gateway]
                                           │
                     ┌─────────────────────┼─────────────────────┐
                     ▼                     ▼                     ▼
              [Auth Service]         [Account Svc]        [Transaction Svc]
                     │                     │                     │
                     └─────────────────────┴─────────────────────┘
                                           │
                               [Eureka Service Registry]
                                           │
                                 [PostgreSQL Clusters]`,
      challenges: [
        '<strong>Dynamic Discovery:</strong> Configured Netflix Eureka for automated heartbeat health checks, load-balancing, and zero-downtime service registration.',
        '<strong>Gateway Filtering:</strong> Built centralized Spring Cloud API Gateway filters for request rate limiting, correlation tracing, and header validation.',
        '<strong>Containerized Topology:</strong> Packaged all services with Docker Compose using health checks and container dependency chains.'
      ],
      tech: ['Java', 'Spring Boot', 'Spring Cloud', 'Netflix Eureka', 'API Gateway', 'PostgreSQL', 'React', 'Docker Compose']
    },
    vyp: {
      title: 'VYP — Verify Your Provider',
      subtitle: 'Enterprise Healthcare Credentialing & Verification Pipeline',
      overview: 'Enterprise data pipeline screening healthcare provider credentials from SFTP/MongoDB across diverse external REST verification endpoints, powered by an asynchronous RabbitMQ queue engine.',
      arch: `[SFTP / MongoDB Records] ──> [Validator Service] ──> [RabbitMQ Event Bus]
                                                               │
                                                               ▼
                                                [Task-Generator-Verifier]
                                                 (REST / DB / Scrapers)
                                                               │
                                                               ▼
                                                [Verification Reports]
                                                  (PDF / XML / CSV)`,
      challenges: [
        '<strong>Asynchronous Event Pipeline:</strong> Decoupled high-volume screening batches with RabbitMQ message queues to handle rate-limited third-party endpoints.',
        '<strong>Distributed Execution Locking:</strong> Imployed ShedLock across clustered microservice instances to prevent duplicate batch task runs.',
        '<strong>Database Versioning:</strong> Maintained production schema evolutions and rollback scripts cleanly with Liquibase changelogs.'
      ],
      tech: ['Java', 'Spring Boot 2.7', 'RabbitMQ', 'PostgreSQL', 'MongoDB', 'Liquibase', 'ShedLock', 'Docker', 'Jenkins', 'Gradle']
    }
  };

  const modalBackdrop = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  function openModal(key) {
    const data = projectDatabase[key];
    if (!data || !modalContent || !modalBackdrop) return;

    const techPills = data.tech.map(t => `<span class="tech-pill">${t}</span>`).join('');
    const challengeItems = data.challenges.map(c => `<li>${c}</li>`).join('');

    modalContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span class="project-badge badge-pro" style="margin-bottom:8px;display:inline-block;">Architecture Deep-Dive</span>
        <h2 style="font-size:1.6rem;font-weight:800;letter-spacing:-0.5px;margin-bottom:4px;">${data.title}</h2>
        <p style="font-family:var(--font-mono);font-size:0.85rem;color:var(--accent-light);">${data.subtitle}</p>
      </div>

      <div style="font-size:0.92rem;color:var(--text-muted);line-height:1.75;margin-bottom:18px;">
        ${data.overview}
      </div>

      <h4 style="font-size:0.95rem;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
        <i data-lucide="git-branch" style="width:16px;height:16px;color:var(--primary-light);"></i>
        <span>System Topology Flow</span>
      </h4>
      <pre class="arch-box">${data.arch}</pre>

      <h4 style="font-size:0.95rem;font-weight:700;margin-top:20px;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
        <i data-lucide="zap" style="width:16px;height:16px;color:var(--amber);"></i>
        <span>Engineering Challenges &amp; Solutions</span>
      </h4>
      <ul class="timeline-points" style="padding-left:18px;margin-bottom:20px;">
        ${challengeItems}
      </ul>

      <h4 style="font-size:0.95rem;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
        <i data-lucide="layers" style="width:16px;height:16px;color:var(--accent-light);"></i>
        <span>Tech Stack</span>
      </h4>
      <div class="skill-tag-cloud" style="margin-top:8px;">
        ${techPills}
      </div>
    `;

    if (window.lucide) lucide.createIcons();
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.btn-architecture').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const key = btn.dataset.project;
      if (key) openModal(key);
    });
  });

  modalClose?.addEventListener('click', closeModal);

  modalBackdrop?.addEventListener('click', e => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('open')) {
      closeModal();
    }
  });

  // ── 9. GSAP Smooth Stagger Animations ─────────────────────
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.from('.hero-headline, .hero-tagline, .hero-type-wrap, .hero-bio, .hero-actions, .hero-social-row', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power3.out'
    });

    gsap.from('.hero-avatar-wrap', {
      opacity: 0,
      scale: 0.9,
      duration: 1.1,
      ease: 'power3.out',
      delay: 0.2
    });

    // Bento Cards Scroll Stagger with clean post-animation reset
    document.querySelectorAll('.about-bento-grid, .skills-grid, .projects-grid').forEach(grid => {
      gsap.from(grid.querySelectorAll('.bento-card'), {
        scrollTrigger: {
          trigger: grid,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 28,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
        clearProps: 'all'
      });
    });

    // Timeline cards
    gsap.from('.timeline-card', {
      scrollTrigger: {
        trigger: '.timeline-wrap',
        start: 'top 85%'
      },
      opacity: 0,
      x: -30,
      duration: 0.9,
      ease: 'power3.out'
    });
  }

});
