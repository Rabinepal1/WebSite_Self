/**
 * Rabi Nepal Portfolio — Interactive Client Controller
 * Sourced from rabinepal.com.np & styled after jibanneupane.com.np
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypewriter();
  initMobileNav();
  initSkillsFilter();
  initContactForm();
  initResumeDownloader();
  initSmoothScrollSpy();
  initTerminal3DTilt();
  initTerminalTypingAnimation();
  
});

/* -------------------------------------------------------------
 * 1. Dark / Light Theme Toggle & Persistence
 * ----------------------------------------------------------- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlTag = document.documentElement;
  const savedTheme = localStorage.getItem('rabi_portfolio_theme') || 'dark';

  htmlTag.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlTag.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlTag.setAttribute('data-theme', nextTheme);
      localStorage.setItem('rabi_portfolio_theme', nextTheme);
      updateThemeIcon(nextTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');
  if (!icon) return;

  if (theme === 'dark') {
    icon.className = 'fa-solid fa-moon';
  } else {
    icon.className = 'fa-solid fa-sun';
  }
}

/* -------------------------------------------------------------
 * 1. Interactive 3D Mouse Parallax Movement
 * ----------------------------------------------------------- */
function initTerminal3DTilt() {
  const card = document.querySelector('.avatar-card');
  const inner = document.querySelector('.avatar-inner');
  const badgeTR = document.querySelector('.badge-top-right');
  const badgeBL = document.querySelector('.badge-bottom-left');

  if (!card || !inner) return;

  const maxTilt = 12; // Degrees of tilt

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate rotation (-maxTilt to +maxTilt)
    const rotateY = ((x / rect.width) - 0.5) * (maxTilt * 2);
    const rotateX = -((y / rect.height) - 0.5) * (maxTilt * 2);

    inner.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;

    // Counter-shift badges for parallax depth effect
    if (badgeTR) badgeTR.style.transform = `translate3d(${(-rotateY * 1.5).toFixed(1)}px, ${(-rotateX * 1.5).toFixed(1)}px, 30px)`;
    if (badgeBL) badgeBL.style.transform = `translate3d(${(rotateY * 1.5).toFixed(1)}px, ${(rotateX * 1.5).toFixed(1)}px, 30px)`;
  });

  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    if (badgeTR) badgeTR.style.transform = 'translate3d(0, 0, 0)';
    if (badgeBL) badgeBL.style.transform = 'translate3d(0, 0, 0)';
  });
}

/* -------------------------------------------------------------
 * 2. Start-to-End Live Typing Animation Loop
 * ----------------------------------------------------------- */
function initTerminalTypingAnimation() {
  const terminal = document.getElementById('typingTerminal');
  if (!terminal) return;

  // Exact code lines and tokens from your screenshot
  const codeLines = [
    [
      { text: 'const ', cls: 'c-keyword' },
      { text: 'engineer', cls: 'c-var' },
      { text: ' = {', cls: 'c-sym' }
    ],
    [
      { text: '  name: ', cls: 'c-prop' },
      { text: "'Rabi Nepal'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
      { text: '  role: ', cls: 'c-prop' },
      { text: "'CEO'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
      { text: '  company: ', cls: 'c-prop' },
      { text: "'Tarpa Infotech Pvt. Ltd.'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
      { text: '  period: ', cls: 'c-prop' },
      { text: "'2019-July-01 - Present'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
      { text: '  specialization: [', cls: 'c-prop' }
    ],
    [
      { text: "    'Advance Java'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
      { text: "    'Spring Boot Architecture'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
      { text: "    'IT Infrastructure & Security'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
        {text: "    'Full-Stack Developer'", cls: 'c-str'},
    ],

    [
      { text: '  ],', cls: 'c-sym' }
    ],
    [
      { text: '  availability: ', cls: 'c-prop' },
      { text: 'true', cls: 'c-bool' }
    ],
    [
      { text: '};', cls: 'c-sym' }
    ]
  ];

  let lineIdx = 0;
  let tokenIdx = 0;
  let charIdx = 0;
  let accumulatedHTML = '';
  const typeSpeed = 22;      // milliseconds per character
  const endHoldDelay = 3500; // milliseconds to pause when finished typing before restarting

  function typeChar() {
    if (lineIdx < codeLines.length) {
      const currentLine = codeLines[lineIdx];
      const currentToken = currentLine[tokenIdx];

      charIdx++;
      const currentTokenPartialText = currentToken.text.substring(0, charIdx);

      // Rebuild the current line up to current character
      let currentLineHTML = '';
      for (let t = 0; t < tokenIdx; t++) {
        currentLineHTML += `<span class="${currentLine[t].cls}">${escapeHTML(currentLine[t].text)}</span>`;
      }
      currentLineHTML += `<span class="${currentToken.cls}">${escapeHTML(currentTokenPartialText)}</span>`;

      // Render accumulated lines + active line + cursor
      terminal.innerHTML = accumulatedHTML + currentLineHTML + '<span class="term-cursor"></span>';

      // Move to next token or character
      if (charIdx >= currentToken.text.length) {
        charIdx = 0;
        tokenIdx++;
        if (tokenIdx >= currentLine.length) {
          // Finish line
          accumulatedHTML += currentLineHTML + '\n';
          tokenIdx = 0;
          lineIdx++;
        }
      }

      setTimeout(typeChar, typeSpeed);
    } else {
      // Completed full typing animation
      terminal.innerHTML = accumulatedHTML + '<span class="term-cursor"></span>';
      
      // Pause then restart loop from start to end
      setTimeout(() => {
        lineIdx = 0;
        tokenIdx = 0;
        charIdx = 0;
        accumulatedHTML = '';
        terminal.innerHTML = '<span class="term-cursor"></span>';
        setTimeout(typeChar, 400);
      }, endHoldDelay);
    }
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Start initial typing
  typeChar();
}


/* -------------------------------------------------------------
 * 2. Dynamic Typewriter Effect for Hero
 * ----------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typewriter');
  if (!target) return;

  const phrases = [
    'Advance Java Backends.',
    'Spring Boot Microservices.',
    'Reliable IT Infrastructure.',
    'Enterprise Web Solutions.',
    'High-Availability Systems.'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const holdDelay = 1800;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(type, holdDelay);
        return;
      }
    } else {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
  }

  type();
}

/* -------------------------------------------------------------
 * 3. Mobile Navigation Menu
 * ----------------------------------------------------------- */
function initMobileNav() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!mobileMenuBtn || !navLinks) return;

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close nav on click of any nav anchor
  navLinks.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/* -------------------------------------------------------------
 * 4. Technical Stack Filter Tabs
 * ----------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter-nav .filter-btn');
  const skillCards = document.querySelectorAll('#skillsGrid .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 5. Contact Form Client-side Validation & Fallback Mailer
 * ----------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const subjectInput = document.getElementById('userSubject');
    const messageInput = document.getElementById('userMessage');

    let isValid = true;

    // Reset errors
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'nameError', 'Please enter your full name.');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'emailError', 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'subjectError', 'Please enter a subject.');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'messageError', 'Please enter a message (at least 10 characters).');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending / preparing mailto fallback
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Preparing...</span>';

    setTimeout(() => {
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Thank you! Opening your email client to send your message directly to info@rabinepal.com.np...';

      // Launch default email client
      const mailtoUri = `mailto:info@rabinepal.com.np?subject=${encodeURIComponent(subjectInput.value.trim())}&body=${encodeURIComponent(
        `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
      )}`;

      window.location.href = mailtoUri;

      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';
      form.reset();
    }, 700);
  });
}

function showError(inputEl, errorId, message) {
  const group = inputEl.closest('.form-group');
  const errorEl = document.getElementById(errorId);
  if (group) group.classList.add('has-error');
  if (errorEl) errorEl.textContent = message;
}

/* -------------------------------------------------------------
 * 6. Dynamic CV / Resume Summary Exporter
 * ----------------------------------------------------------- */
function initResumeDownloader() {
  const resumeBtn = document.getElementById('downloadResumeBtn');
  if (!resumeBtn) return;

  resumeBtn.addEventListener('click', () => {
    const resumeText = `=====================================================
RABI NEPAL — CURRICULUM VITAE SUMMARY
Email: info@rabinepal.com.np
Portfolio: rabinepal.com.np
Location: Kathmandu / Bagmati, Nepal
=====================================================

PROFESSIONAL SUMMARY:
IT Operations Executive and Software Developer specializing in 
Advanced Java and Spring Boot ecosystems, enterprise networking, 
cloud deployments, and systems reliability engineering.

CURRENT ROLE:
• IT Operations Executive — Satori Adventure Nepal Pvt. Ltd.
  Duration: 2026 Jan 01 – Till Present
  Responsibilities:
  - Lead company-wide technical operations, IT network infrastructure, and system security.
  - Maintain expedition booking platforms and digital workflow services.
  - Implement automated offsite backups and system disaster recovery.

CORE COMPETENCIES:
• Backend Engineering:
  - Advance Java (Multithreading, OOP, Collections, Lambdas, JDBC)
  - Spring Boot (Spring MVC, REST APIs, JPA / Hibernate, Spring Security)
• IT Operations & Systems:
  - LAN/WAN Routing, Firewalls, System Administration, Hardware Maintenance
  - Network Security, Automated Cloud/RAID Backups, Disaster Recovery
• Web & Frontend:
  - HTML5, CSS3, Modern JavaScript (ES6+), Responsive UI Architecture
• Databases & Tools:
  - MySQL, PostgreSQL, Git & GitHub, Linux Administration

PROJECT HIGHLIGHTS:
1. Satori Adventure IT Ops & Expedition Workflow Portal
2. Enterprise Inventory & Service REST API (Spring Boot & PostgreSQL)
3. Zero-Downtime Office Infrastructure & Automated Backup Deployment

=====================================================
Generated from Rabi Nepal Portfolio.
=====================================================`;

    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = 'Rabi_Nepal_Resume_Summary.txt';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  });
}

/* -------------------------------------------------------------
 * 7. Active Scrollspy for Navigation Highlighting
 * ----------------------------------------------------------- */
function initSmoothScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links .nav-item');

  window.addEventListener('scroll', () => {
    let scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  });
}