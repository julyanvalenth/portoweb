const API = '/api';

// ===================== FETCH HELPERS =====================
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ===================== RENDER HELPERS =====================
function svgArrow(size = 13) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 11L11 2M11 2H4M11 2V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function svgDownload(size = 15) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 2v7m0 0L5 6.5m2.5 2.5L10 6.5M3 11h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ===================== POPULATE PROFILE (HERO + NAV + ABOUT) =====================
async function loadProfile() {
  try {
    const { data } = await fetchJSON(`${API}/profile`);

    // NAV
    document.querySelector('.nav-logo').textContent = data.name;

    // HERO
    document.querySelector('.hero-badge span').textContent = data.badge;
    document.querySelector('.hero-name').textContent = data.name;

    const descEl = document.querySelector('.hero-desc p');
    descEl.innerHTML = data.description.replace(
      'Software Engineering', '<span class="accent">Software Engineering</span>'
    ).replace(
      'mobile application', '<span class="accent">mobile application</span>'
    );

    document.querySelector('.hero-role').innerHTML =
      `<p>Tech Interest</p><p class="bold">&amp; Developer</p>`;

    // Social links
    const socials = [
      { label: 'LinkedIn',  url: data.socials.linkedin },
      { label: 'GitHub',    url: data.socials.github },
      { label: 'Instagram', url: data.socials.instagram },
    ];
    const socialsEl = document.querySelector('.hero-social-links');
    socialsEl.innerHTML = socials.map(s =>
      `<a href="${s.url}" target="_blank" class="hero-social-link">${s.label}</a>`
    ).join('');

    // ABOUT
    const bioEls = document.querySelectorAll('.about-bio');
    data.bio.forEach((text, i) => { if (bioEls[i]) bioEls[i].textContent = text; });

    // About statement
    document.querySelector('.about-statement').innerHTML =
      `I'm a <span class="accent">passionate developer</span> who turns ideas into real mobile products. I focus on <span class="accent">clean code</span>, sharp solutions, and seamless user experience.`;

    // CV link
    document.querySelector('.btn-cv').href = data.cv_url;

    // FOOTER
    document.querySelector('.footer-mini').textContent = "// LET'S CONNECT";
    document.querySelector('.footer-heading').textContent = data.footer.heading;
    document.querySelector('.btn-say-hello').href = `mailto:${data.footer.email}`;

    // Contact email in modal
    document.querySelector('.modal-contact-email').textContent = data.email;

  } catch (err) {
    console.error('loadProfile:', err);
  }
}

// ===================== POPULATE SKILLS =====================
async function loadSkills() {
  try {
    const { data } = await fetchJSON(`${API}/profile/skills`);
    const el = document.querySelector('.skills-list');
    el.innerHTML = data.map(s => `<span class="skill-tag">${s}</span>`).join('');
  } catch (err) {
    console.error('loadSkills:', err);
  }
}

// ===================== POPULATE PROJECTS =====================
async function loadProjects() {
  try {
    const { data } = await fetchJSON(`${API}/projects`);
    const grid = document.querySelector('.projects-grid');

    grid.innerHTML = data.map(p => `
      <div class="project-card fade-in">
        <div class="project-thumb">
          <span class="project-num">${p.number}</span>
          <div class="project-icon">
            <div class="project-icon-box">
              ${svgArrow(22)}
            </div>
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
            <a href="${p.link}" target="_blank" class="project-link-btn" aria-label="View project">
              ${svgArrow(13)}
            </a>
          </div>
        </div>
      </div>
    `).join('');

    observeFadeIn();
  } catch (err) {
    console.error('loadProjects:', err);
  }
}

// ===================== POPULATE EDUCATION =====================
async function loadEducation() {
  try {
    const { data } = await fetchJSON(`${API}/education`);
    const list = document.querySelector('.edu-list');

    list.innerHTML = data.map(e => `
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
  } catch (err) {
    console.error('loadEducation:', err);
  }
}

// ===================== POPULATE ORGANIZATIONS =====================
async function loadOrganizations() {
  try {
    const { data } = await fetchJSON(`${API}/organizations`);
    const list = document.querySelector('.org-list');

    list.innerHTML = data.map(o => `
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
  } catch (err) {
    console.error('loadOrganizations:', err);
  }
}

// ===================== CONTACT FORM =====================
function initContactForm() {
  const overlay = document.querySelector('.modal-overlay');
  const form    = document.querySelector('#contact-form');
  const msgEl   = document.querySelector('.form-msg');
  const submitBtn = document.querySelector('.btn-submit');

  // Open modal
  document.querySelectorAll('[data-open-contact]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    form.reset();
    msgEl.className = 'form-msg';
    msgEl.textContent = '';
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          json.errors.forEach(err => showError(err));
        }
        msgEl.className = 'form-msg error';
        msgEl.textContent = json.errors ? json.errors[0] : 'Something went wrong.';
      } else {
        msgEl.className = 'form-msg success';
        msgEl.textContent = json.message;
        form.reset();
        setTimeout(closeModal, 2800);
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
    const errEls = document.querySelectorAll('.form-error');
    errEls.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.textContent = msg;
        el.classList.add('visible');
      }
    });
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
    msgEl.className = 'form-msg';
    msgEl.textContent = '';
  }
}

// ===================== INTERSECTION OBSERVER (fade-in) =====================
function observeFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
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

  // Active nav highlighting
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

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) obs.observe(el);
  });
}

// ===================== HERO SEE MY WORK SCROLL =====================
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
