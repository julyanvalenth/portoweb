// ===================== RENDER HELPERS =====================
function svgArrow(size = 13) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 11L11 2M11 2H4M11 2V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ===================== POPULATE PROFILE =====================
function loadProfile() {
  const d = PORTFOLIO.profile;

  document.querySelector('.nav-logo').textContent = d.name;
  document.querySelector('.hero-badge span').textContent = d.badge;
  document.querySelector('.hero-name').textContent = d.name;

  document.querySelector('.hero-desc p').innerHTML = d.description
    .replace('Software Engineering', '<span class="accent">Software Engineering</span>')
    .replace('mobile application', '<span class="accent">mobile application</span>');

  const socialsEl = document.querySelector('.hero-social-links');
  socialsEl.innerHTML = [
    { label: 'LinkedIn',  url: d.socials.linkedin  },
    { label: 'GitHub',    url: d.socials.github    },
    { label: 'Instagram', url: d.socials.instagram },
  ].map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="hero-social-link">${s.label}</a>`).join('');

  const bioEls = document.querySelectorAll('.about-bio');
  d.bio.forEach((text, i) => { if (bioEls[i]) bioEls[i].textContent = text; });

  document.querySelector('.about-statement').innerHTML =
    `I'm a <span class="accent">passionate developer</span> who turns ideas into real mobile products. I focus on <span class="accent">clean code</span>, sharp solutions, and seamless user experience.`;

  document.querySelector('.btn-cv').href = d.cv_url;

  document.querySelector('.footer-mini').textContent = "// LET'S CONNECT";
  document.querySelector('.footer-heading').textContent = d.footer.heading;
  document.querySelector('.btn-say-hello').href = `mailto:${d.footer.email}`;

  document.querySelector('.modal-contact-email').textContent = d.email;
}

// ===================== POPULATE SKILLS =====================
function loadSkills() {
  const el = document.querySelector('.skills-list');
  el.innerHTML = PORTFOLIO.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
}

// ===================== POPULATE PROJECTS =====================
function loadProjects() {
  const grid = document.querySelector('.projects-grid');
  grid.innerHTML = PORTFOLIO.projects.map(p => {
    const imgHtml = p.image
      ? '<img src="' + p.image + '" alt="' + p.title + ' preview" class="project-thumb-img" loading="lazy" />'
      : '';
    const thumbClass = p.image ? 'project-thumb has-image' : 'project-thumb';
    return `
    <div class="project-card fade-in">
      <div class="${thumbClass}">
        ${imgHtml}
        <span class="project-num">${p.number}</span>
        <div class="project-icon">
          <div class="project-icon-box">${svgArrow(22)}</div>
          <span class="project-preview-label">PROJECT PREVIEW</span>
        </div>
      </div>
      <div class="project-body">
        <div class="project-meta">
          <h3 class="project-title">${p.title}</h3>
          <span class="project-year">${p.year}</span>
        </div>
        <p class="project-desc">${p.description}</p>
        <div class="project-footer">
          <span class="project-tags">${p.tags.join(' · ')}</span>
          <a href="${p.link}" target="_blank" rel="noopener" class="project-link-btn" aria-label="View project">
            ${svgArrow(13)}
          </a>
        </div>
      </div>
    </div>
  `}).join('');
  observeFadeIn();
}

// ===================== POPULATE EDUCATION =====================
function loadEducation() {
  const list = document.querySelector('.edu-list');
  list.innerHTML = PORTFOLIO.education.map(e => `
    <div class="edu-item fade-in">
      <div class="edu-period">${e.period}</div>
      <div class="edu-right">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-school">${e.institution} — ${e.major}</div>
        ${e.description ? `<p class="edu-desc">${e.description}</p>` : ''}
      </div>
    </div>
  `).join('');
  observeFadeIn();
}

// ===================== POPULATE ORGANIZATIONS =====================
function loadOrganizations() {
  const list = document.querySelector('.org-list');
  list.innerHTML = PORTFOLIO.organizations.map(o => `
    <div class="edu-item fade-in">
      <div class="edu-period">${o.period}</div>
      <div class="edu-right">
        <div class="edu-degree">${o.role}</div>
        <ul class="edu-activities">
          ${o.activities.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
    </div>
  `).join('');
  observeFadeIn();
}

// ===================== CONTACT FORM (Formspree) =====================
function initContactForm() {
  const overlay   = document.querySelector('.modal-overlay');
  const form      = document.querySelector('#contact-form');
  const msgEl     = document.querySelector('.form-msg');
  const submitBtn = document.querySelector('.btn-submit');

  document.querySelectorAll('[data-open-contact]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    form.reset();
    msgEl.className = 'form-msg';
    msgEl.textContent = '';
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || name.length < 2) { showError('Name must be at least 2 characters.'); return; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { showError('Please enter a valid email.'); return; }
    if (!message || message.length < 10) { showError('Message must be at least 10 characters.'); return; }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('https://formspree.io/f/REPLACE_WITH_YOUR_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (res.ok) {
        msgEl.className = 'form-msg success';
        msgEl.textContent = "Message sent! I'll get back to you soon.";
        form.reset();
        setTimeout(closeModal, 2800);
      } else {
        msgEl.className = 'form-msg error';
        msgEl.textContent = 'Something went wrong. Please try again.';
      }
    } catch {
      msgEl.className = 'form-msg error';
      msgEl.textContent = 'Network error — please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  function showError(msg) {
    const el = document.querySelector('.form-error');
    if (el) { el.textContent = msg; el.classList.add('visible'); }
  }
}

// ===================== INTERSECTION OBSERVER (fade-in) =====================
function observeFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ===================== SMOOTH SCROLL NAV =====================
function initNav() {
  document.querySelectorAll('a[data-scroll]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const sections = ['hero', 'about', 'projects', 'education', 'organizations', 'footer'];
  const navLinks = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[data-scroll="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
}

// ===================== HERO SEE MY WORK =====================
function initHeroCta() {
  document.querySelector('.hero-cta').addEventListener('click', () => {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
  });
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadSkills();
  loadProjects();
  loadEducation();
  loadOrganizations();
  initContactForm();
  initNav();
  initHeroCta();
  observeFadeIn();
});
