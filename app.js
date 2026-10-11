/**
 * Gowtham K — AI/ML Engineer & Data Analyst Portfolio
 * Interactive Experience Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initTypingEffect();
  initNavigation();
  initSkillsFilter();
  initProjectModals();
  initResumeModal();
  initContactForm();
  initBackToTop();
});

/* ===================================================================
   1. INTERACTIVE BACKGROUND PARTICLES CANVAS
   =================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);
  const maxDistance = 140;

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.8 + 0.8;
      this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, 0.45)' : 'rgba(121, 40, 202, 0.35)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse collision repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 2.5;
          this.y -= dirY * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================================================
   2. TYPING EFFECT
   =================================================================== */
function initTypingEffect() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  const roles = [
    'AI/ML Engineer',
    'Data Analyst',
    'B.Tech (AI & DS) — CGPA: 7.81',
    'Deepfake Audio Detection Researcher',
    'Greensoft & NoviTech Intern',
    'CARE College Of Engineering'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 75;
  const deleteSpeed = 40;
  const pauseEnd = 2000;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      typedEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typedEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === currentRole.length) {
      delay = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}

/* ===================================================================
   3. NAVIGATION & SCROLLSPY
   =================================================================== */
function initNavigation() {
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Header scroll shadow
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active section scroll spy
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ===================================================================
   4. SKILLS FILTER SYSTEM
   =================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('#skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('#skills-grid .skill-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ===================================================================
   5. PROJECT MODALS & CASE STUDIES
   =================================================================== */
const projectData = {
  deepfake: {
    title: 'Enhancing Deepfake Audio Detection Using Room Impulse Response-Based Acoustic Analysis Compared with Conventional Speech Detection Methods',
    image: 'assets/images/deepfake_audio.jpg',
    category: 'Final Year Capstone Research & Audio AI',
    overview: 'As generative voice models and voice cloning software become indistinguishable to the human ear, conventional frequency-based detection (such as standard MFCCs and spectrogram analysis) frequently misses nuanced synthetic artifacts. This research investigates the use of Room Impulse Response (RIR) spatial acoustic analysis to identify deepfake speech by detecting physically inconsistent acoustic reflections and unnatural phase shifts that synthetic engines fail to replicate.',
    architecture: [
      'Engineered an acoustic simulation pipeline measuring Room Impulse Response (RIR) reverberation signatures.',
      'Extracted high-dimensional audio features including Mel-spectrograms, harmonic distortion maps, and phase coherence vectors using Python & Librosa.',
      'Trained binary classification models comparing synthetic cloned voices against authentic speech recordings.',
      'Demonstrated superior resilience over conventional speech detection baselines across diverse acoustic environments.'
    ],
    techStack: ['Python', 'Room Impulse Response (RIR)', 'Librosa', 'Audio DSP', 'PyTorch / ML', 'Scikit-Learn', 'SQL'],
    githubUrl: 'https://github.com/Gowtham2449/Gowtham2449'
  },
  railway: {
    title: 'Railway Track Crack Detection System',
    image: 'assets/images/railway_crack.jpg',
    category: 'Computer Vision & Transportation Safety AI',
    overview: 'An automated computer vision and IoT sensor inspection platform that scans railway track surfaces in real-time to detect minute cracks, rail fissures, and structural wear before catastrophic derailments can occur.',
    architecture: [
      'Developed real-time computer vision detection using Python, OpenCV, and deep learning classification pipelines.',
      'Achieved >94% confidence accuracy on crack identification under varying outdoor sunlight and track weathering conditions.',
      'Integrated sensor telemetry (vibration frequency, acoustic sensors, and thermal monitors) to correlate physical stress with visual fissures.',
      'Engineered an automated alert logging system storing GPS/kilometer tags into a SQL database for maintenance crews.'
    ],
    techStack: ['Python', 'Computer Vision', 'OpenCV', 'Deep Learning', 'IoT Telemetry', 'SQL Database'],
    githubUrl: 'https://github.com/Gowtham2449/Gowtham2449'
  },
  groundwater: {
    title: 'Ground Water Level Monitoring System',
    image: 'assets/images/groundwater.jpg',
    category: 'Environmental IoT & Data Analytics Platform',
    overview: 'A smart environmental telemetry and predictive analytics dashboard that monitors real-time borehole water table depths, tracks aquifer depletion velocity, and predicts 30-day water level fluctuations.',
    architecture: [
      'Connected ultrasonic and hydrostatic pressure sensors to log continuous water table depth and battery levels.',
      'Designed a predictive regression analytics engine in Python projecting 30-day aquifer depletion trends (R² = 0.91).',
      'Created a geospatial sensor mapping dashboard displaying active borehole nodes with color-coded depletion warnings.',
      'Implemented automated threshold alarms to alert local water management authorities when levels drop below critical reserve depths.'
    ],
    techStack: ['Python', 'Data Analytics', 'IoT Sensor Telemetry', 'Machine Learning Regression', 'SQL', 'Frontend Dashboard'],
    githubUrl: 'https://github.com/Gowtham2449/Gowtham2449'
  }
};

function initProjectModals() {
  const modalBackdrop = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-project-content');
  const closeBtn = document.getElementById('close-project-modal');
  const triggers = document.querySelectorAll('.preview-project-trigger');

  if (!modalBackdrop || !modalContent) return;

  function openProject(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalContent.innerHTML = `
      <img src="${data.image}" alt="${data.title}" class="modal-project-img">
      <span class="project-flag" style="position:static; display:inline-block; margin-bottom:0.75rem;">${data.category}</span>
      <h2 class="modal-project-title">${data.title}</h2>
      <p class="modal-project-desc">${data.overview}</p>
      
      <h3 class="modal-section-title">Key Technical & Research Highlights</h3>
      <ul class="modal-list">
        ${data.architecture.map(item => `<li>${item}</li>`).join('')}
      </ul>

      <h3 class="modal-section-title">Technologies Used</h3>
      <div class="project-tags" style="margin-bottom:1.5rem;">
        ${data.techStack.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>

      <div class="modal-actions">
        <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>View on GitHub</span>
        </a>
      </div>
    `;

    modalBackdrop.classList.add('active');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('active');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const pId = trigger.getAttribute('data-project');
      openProject(pId);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================================================
   6. RESUME MODAL & PRINT FUNCTIONALITY
   =================================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-modal');
  const printResumeBtn = document.getElementById('print-resume-btn');

  if (!resumeModal) return;

  function openResume() {
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResume() {
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResume);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResume);

  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('active')) {
      closeResume();
    }
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* ===================================================================
   7. CONTACT FORM & CLIPBOARD TOAST
   =================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  const emailVal = 'kgowtham1407@gmail.com';

  // Copy Email to Clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailVal).then(() => {
        if (copyText) copyText.textContent = 'Copied!';
        showToast('Email (kgowtham1407@gmail.com) copied to clipboard!', 'success');
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy';
        }, 2500);
      }).catch(() => {
        showToast('Failed to copy. Please manually select the email.', 'error');
      });
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-contact-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>Sending...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        showToast('Thank you! Your message has been sent to Gowtham K.', 'success');
      }, 1000);
    });
  }
}

/* ===================================================================
   8. TOAST NOTIFICATION UTILITY
   =================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

/* ===================================================================
   9. BACK TO TOP BUTTON
   =================================================================== */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top-btn');
  if (!topBtn) return;

  topBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
