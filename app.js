/**
 * Application Controller for Ashween Singh Saini (Gabruu.Saini)
 * Personal About Me & Computer Science Platform: gabruu-saini.online -> linking to https://cs.gabruu-saini.online
 */

(function () {
  'use strict';

  // 1. Cosmic Boot Splash Screen (~600ms)
  const bootLoader = document.getElementById('app-boot-loader');
  if (bootLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        bootLoader.classList.add('fade-out');
        setTimeout(() => {
          bootLoader.style.display = 'none';
        }, 400);
      }, 600);
    });

    // Fallback if load event already fired or took too long
    setTimeout(() => {
      if (bootLoader && bootLoader.style.display !== 'none') {
        bootLoader.classList.add('fade-out');
        setTimeout(() => {
          bootLoader.style.display = 'none';
        }, 400);
      }
    }, 1500);
  }

  // 2. Navbar Scroll Observer & Mobile Drawer
  const navbar = document.getElementById('floating-navbar');
  const btnMobileMenu = document.getElementById('btn-mobile-menu');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  if (btnMobileMenu && mobileDrawer) {
    btnMobileMenu.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      btnMobileMenu.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        btnMobileMenu.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Reflect-Style Spotlight Effect on Glass Panels
  const spotlightElements = document.querySelectorAll('.glass-panel, .grid-cell, .spotlight-card, .cert-card, .narrative-card');
  document.addEventListener('mousemove', e => {
    spotlightElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    });
  }, { passive: true });

  // 4. Framed Personal Console Tabs
  const tabButtons = document.querySelectorAll('.console-tab-btn');
  const tabPanels = document.querySelectorAll('.console-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const activePanel = document.getElementById(`panel-${targetTab}`);
      if (activePanel) {
        activePanel.classList.add('active');
      }
    });
  });

  // 5. Personal Console Interactive Terminal Emulator (whoami.sh)
  const termInput = document.getElementById('term-cmd-input');
  const termOutput = document.getElementById('term-output-body');
  const presetPills = document.querySelectorAll('.term-preset-pill');

  const COMMAND_RESPONSES = {
    help: `Available commands:
  <span class="cmd-hl">whoami</span>    - Ashween Singh Saini personal bio & location
  <span class="cmd-hl">cs</span>        - Inspect live ISC CS Suite (https://cs.gabruu-saini.online)
  <span class="cmd-hl">certs</span>     - Display verified CompTIA Network+, PenTest+ & Cisco CCNA credentials
  <span class="cmd-hl">stack</span>     - Active programming languages, runtimes & toolchain
  <span class="cmd-hl">clear</span>     - Clear terminal buffer`,

    whoami: `[IDENTITY & PROFILE: <span class="term-green">VERIFIED</span>]
  Full Name        : Ashween Singh Saini
  Callsign / Brand : Gabruu.Saini
  Location         : Hoshiarpur, Punjab, India (31.5273° N, 75.9149° E)
  Role Focus       : Computer Science Student • Rust Systems • Offensive Security
  Philosophy       : "Understand the layer beneath. Write deterministic, resilient software."
  Active Focus     : ISC Class 12 Computer Science Theory & Systems Architecture`,

    cs: `[PLATFORM STATUS: <span class="term-green">HEALTHY 100%</span>]
  Live Platform    : <a href="https://cs.gabruu-saini.online" target="_blank" rel="noopener noreferrer" class="term-link">https://cs.gabruu-saini.online ↗</a>
  Target Exam Date : 17 March 2027 • Confirmed (Active Countdown)
  Repository Scope : 53 Verified Production Java Solutions (2017–2026 Archive)
  Architecture     : Rust Axum 0.7 + Tokio + Portable-PTY sandbox daemon
  Edge Layer       : Cloudflare Workers edge caching & routing
  Validation Suite : 100% pass (cargo run -- --check in 7.53ms)
  Clean Codebase   : 0 package src declarations; standalone javac compliant`,

    certs: `[VERIFIED PROFESSIONAL CREDENTIALS]
  1. CompTIA Network+  - Network Infrastructure, Routing & Subnetting (N10-008)
  2. Cisco CCNA        - Enterprise IP Connectivity, VLANs & Security (200-301)
  3. CompTIA PenTest+  - Offensive Penetration Testing & Vulnerability Assessment (PT0-002)`,

    stack: `[ENGINEERING ARSENAL & TOOLCHAIN]
  Languages        : Rust (Async/Axum), Java (ISC Board Spec), Kotlin, Python, C/C++, Bash
  Systems / OS     : CachyOS Linux (KDE Plasma), KVM/QEMU hypervisors, systemd
  Cloud & Edge     : Cloudflare Workers, Edge KV, D1, zero-trust tunnels
  Security Audit   : Wireshark, Nmap, Burp Suite, Ghidra, OWASP Top 10 auditing`
  };

  function appendTerminalOutput(cmd, output) {
    if (!termOutput) return;

    if (cmd.toLowerCase() === 'clear') {
      termOutput.innerHTML = '';
      return;
    }

    const entry = document.createElement('div');
    entry.className = 'term-entry';
    entry.innerHTML = `
      <div class="term-entry-cmd">
        <span class="term-prompt">gabruu@saini:~$</span>
        <span class="term-user-text">${escapeHtml(cmd)}</span>
      </div>
      <div class="term-entry-result">${output}</div>
    `;
    termOutput.appendChild(entry);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  if (termInput) {
    termInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const val = termInput.value.trim();
        if (!val) return;
        termInput.value = '';

        const resp = COMMAND_RESPONSES[val.toLowerCase()] ||
          `Command not recognized: "${escapeHtml(val)}". Type <span class="cmd-hl">help</span> for available commands.`;
        appendTerminalOutput(val, resp);
      }
    });
  }

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.dataset.cmd;
      if (cmd && COMMAND_RESPONSES[cmd]) {
        appendTerminalOutput(cmd, COMMAND_RESPONSES[cmd]);
      }
    });
  });

  // 6. Active Navbar Link Highlight via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));

})();
