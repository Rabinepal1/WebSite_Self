/**
 * Rabi Nepal 3D Portfolio — Unified WebGL Scene & Interactive Controller
 * Website: rabinepal.com.np
 */

document.addEventListener('DOMContentLoaded', () => {
  init3DScene();
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
 * 1. Three.js Full-Page 3D Engine
 * ----------------------------------------------------------- */
let camera, scene, renderer;
let terrainMesh, particleSystem;
let projectNodes = [];
let mouseX = 0, mouseY = 0;
let targetCamX = 0, targetCamY = 2, targetCamZ = 16;

function init3DScene() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070a12, 0.032);

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 16);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // A. Procedural Wireframe Horizon Grid
  const gridGeo = new THREE.PlaneGeometry(80, 80, 48, 48);
  const pos = gridGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = Math.sin(x * 0.18) * Math.cos(y * 0.18) * 2.2 + Math.sin(x * 0.35 + y * 0.25) * 1.2;
    pos.setZ(i, z);
  }
  gridGeo.computeVertexNormals();

  const gridMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });

  terrainMesh = new THREE.Mesh(gridGeo, gridMat);
  terrainMesh.rotation.x = -Math.PI / 2.2;
  terrainMesh.position.set(0, -6, -4);
  scene.add(terrainMesh);

  // B. Ambient Cybernetic Telemetry Orbiters
  const nodeSpecs = [
    { color: 0x06b6d4, pos: [-4.5, 2.5, -1] }, // Expedition platform
    { color: 0x3b82f6, pos: [4.5, 3.2, -2] },  // Spring Boot API
    { color: 0x10b981, pos: [0, -1.8, 2] },    // Zero-downtime infra
  ];

  nodeSpecs.forEach((spec) => {
    const nodeGroup = new THREE.Group();

    // Central Polyhedron
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: spec.color, wireframe: true });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    nodeGroup.add(coreMesh);

    // Orbit Ring
    const ringGeo = new THREE.RingGeometry(1.2, 1.25, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: spec.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    nodeGroup.add(ringMesh);

    nodeGroup.position.set(...spec.pos);
    scene.add(nodeGroup);
    projectNodes.push({ group: nodeGroup, ring: ringMesh });
  });

  // C. Atmospheric Data Particles
  const particleCount = 450;
  const pGeometry = new THREE.BufferGeometry();
  const pPositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    pPositions[i] = (Math.random() - 0.5) * 45;
    pPositions[i + 1] = (Math.random() - 0.5) * 35;
    pPositions[i + 2] = (Math.random() - 0.5) * 40;
  }
  pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));

  const pMaterial = new THREE.PointsMaterial({
    size: 0.08,
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.5,
  });
  particleSystem = new THREE.Points(pGeometry, pMaterial);
  scene.add(particleSystem);

  // Parallax tracking
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getElapsedTime();

    // Terrain slow forward drift
    terrainMesh.position.z = -4 + ((delta * 0.35) % 1.5);

    // Rotate telemetry nodes
    projectNodes.forEach((node, i) => {
      node.group.rotation.x = delta * (0.3 + i * 0.1);
      node.group.rotation.y = delta * (0.4 + i * 0.1);
      node.ring.rotation.z = delta * 0.7;
    });

    // Rotate particles
    particleSystem.rotation.y = delta * 0.02;

    // Smooth camera interpolation
    camera.position.x += (targetCamX + mouseX * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (targetCamY + mouseY * 1.2 - camera.position.y) * 0.05;
    camera.position.z += (targetCamZ - camera.position.z) * 0.05;
    camera.lookAt(targetCamX * 0.2, targetCamY * 0.2, 0);

    renderer.render(scene, camera);
  }
  animate();
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Global 3D Project Focus
window.focusProject3D = function (index) {
  const coords = [
    { x: -3.5, y: 2.0, z: 9 },  // Node 1: Satori Platform
    { x: 3.5, y: 2.2, z: 8.5 }, // Node 2: Spring Boot API
    { x: 0, y: -1.0, z: 10 },    // Node 3: Office Network
  ];
  if (coords[index]) {
    targetCamX = coords[index].x;
    targetCamY = coords[index].y;
    targetCamZ = coords[index].z;
  }
};

/* -------------------------------------------------------------
 * 2. Theme Toggle & Persistence
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

      // Adjust 3D Fog color depending on light/dark mode
      if (scene) {
        scene.fog.color.setHex(nextTheme === 'dark' ? 0x070a12 : 0xf8fafc);
      }
    });
  }
}

function updateThemeIcon(theme) {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  const icon = themeToggle.querySelector('i');
  if (!icon) return;
  icon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
}

/* -------------------------------------------------------------
 * 3. 3D Terminal Tilt Effect
 * ----------------------------------------------------------- */
function initTerminal3DTilt() {
  const card = document.querySelector('.avatar-card');
  const inner = document.querySelector('.avatar-inner');
  const badgeTR = document.querySelector('.badge-top-right');
  const badgeBL = document.querySelector('.badge-bottom-left');

  if (!card || !inner) return;
  const maxTilt = 12;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * (maxTilt * 2);
    const rotateX = -((y / rect.height) - 0.5) * (maxTilt * 2);

    inner.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
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
 * 4. Terminal Typing Code Animation
 * ----------------------------------------------------------- */
function initTerminalTypingAnimation() {
  const terminal = document.getElementById('typingTerminal');
  if (!terminal) return;

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
      { text: "'IT Operations Executive'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
      { text: '  company: ', cls: 'c-prop' },
      { text: "'Satori Adventure Nepal Pvt. Ltd.'", cls: 'c-str' },
      { text: ',', cls: 'c-sym' }
    ],
    [
      { text: '  period: ', cls: 'c-prop' },
      { text: "'2026-Jan-01 - Present'", cls: 'c-str' },
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
      { text: "    'Full-Stack Developer'", cls: 'c-str' }
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

  let lineIdx = 0, tokenIdx = 0, charIdx = 0;
  let accumulatedHTML = '';
  const typeSpeed = 22;
  const endHoldDelay = 3500;

  function typeChar() {
    if (lineIdx < codeLines.length) {
      const currentLine = codeLines[lineIdx];
      const currentToken = currentLine[tokenIdx];
      charIdx++;
      const currentTokenPartialText = currentToken.text.substring(0, charIdx);

      let currentLineHTML = '';
      for (let t = 0; t < tokenIdx; t++) {
        currentLineHTML += `<span class="${currentLine[t].cls}">${escapeHTML(currentLine[t].text)}</span>`;
      }
      currentLineHTML += `<span class="${currentToken.cls}">${escapeHTML(currentTokenPartialText)}</span>`;

      terminal.innerHTML = accumulatedHTML + currentLineHTML + '<span class="term-cursor"></span>';

      if (charIdx >= currentToken.text.length) {
        charIdx = 0;
        tokenIdx++;
        if (tokenIdx >= currentLine.length) {
          accumulatedHTML += currentLineHTML + '\n';
          tokenIdx = 0;
          lineIdx++;
        }
      }
      setTimeout(typeChar, typeSpeed);
    } else {
      terminal.innerHTML = accumulatedHTML + '<span class="term-cursor"></span>';
      setTimeout(() => {
        lineIdx = 0; tokenIdx = 0; charIdx = 0; accumulatedHTML = '';
        terminal.innerHTML = '<span class="term-cursor"></span>';
        setTimeout(typeChar, 400);
      }, endHoldDelay);
    }
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  typeChar();
}

/* -------------------------------------------------------------
 * 5. Typewriter Effect
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

  let phraseIndex = 0, charIndex = 0, isDeleting = false;
  const typingSpeed = 90, deletingSpeed = 45, holdDelay = 1800;

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
 * 6. Mobile Navigation
 * ----------------------------------------------------------- */
function initMobileNav() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  if (!mobileMenuBtn || !navLinks) return;

  mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* -------------------------------------------------------------
 * 7. Skills Filter
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
 * 8. Contact Form Mailer
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
    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('has-error'));
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    if (!nameInput.value.trim()) { showError(nameInput, 'nameError', 'Please enter your full name.'); isValid = false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'emailError', 'Please enter a valid email address.');
      isValid = false;
    }
    if (!subjectInput.value.trim()) { showError(subjectInput, 'subjectError', 'Please enter a subject.'); isValid = false; }
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError(messageInput, 'messageError', 'Please enter a message (at least 10 characters).');
      isValid = false;
    }

    if (!isValid) return;

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Preparing...</span>';

    setTimeout(() => {
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Thank you! Opening your email client to send your message to info@rabinepal.com.np...';

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
 * 9. Resume Summary Downloader
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

CORE COMPETENCIES:
• Backend Engineering: Advance Java, Spring Boot, Spring Security, JPA
• IT Operations: LAN/WAN, Firewalls, System Administration, Backups
• Web: HTML5, CSS3, Modern JavaScript (ES6+), React
• Databases: MySQL, PostgreSQL, Linux Hosting
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
 * 10. Scrollspy Navigation
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

        // Reset camera when at the top hero section
        if (id === 'hero') {
          targetCamX = 0; targetCamY = 2; targetCamZ = 16;
        }
      }
    });
  });
}
