/* ============================================================
   SkillBridge - Main JS (main.js)
   Navbar, hero animations, categories, testimonials, general UI
   ============================================================ */

// ── Namespace ────────────────────────────────────────────────
const SkillBridge = window.SkillBridge || {};
window.SkillBridge = SkillBridge;

/* ── Navbar ─────────────────────────────────────────────────── */
SkillBridge.Navbar = (function () {
  const navbar      = document.querySelector('.navbar');
  const hamburger   = document.querySelector('.navbar__hamburger');
  const mobileMenu  = document.querySelector('.navbar__mobile');

  function init() {
    if (!navbar) return;
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (hamburger) hamburger.addEventListener('click', toggleMobile);
    // Close mobile menu on link click
    document.querySelectorAll('.navbar__mobile-link').forEach(link => {
      link.addEventListener('click', closeMobile);
    });
    // Close on outside click
    document.addEventListener('click', function (e) {
      if (mobileMenu && mobileMenu.classList.contains('open')) {
        if (!navbar.contains(e.target)) closeMobile();
      }
    });
    setActiveLink();
  }

  function handleScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function toggleMobile() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
  }

  function closeMobile() {
    if (!hamburger || !mobileMenu) return;
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  function setActiveLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === path || (path === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  return { init };
})();

/* ── Scroll Animations ──────────────────────────────────────── */
SkillBridge.ScrollAnimations = (function () {
  function init() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    // Use IntersectionObserver if available
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const delay = el.dataset.delay || 0;
              setTimeout(() => {
                el.classList.add('animated');
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
              }, delay);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        if (!el.dataset.delay) el.dataset.delay = i * 80;
        observer.observe(el);
      });
    }
  }

  return { init };
})();

/* ── Stats Counter Animation ────────────────────────────────── */
SkillBridge.StatsCounter = (function () {
  function init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach(el => observer.observe(el));
    }
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count.replace(/\D/g, ''), 10);
    const suffix   = el.dataset.count.replace(/[\d,]/g, '');
    const duration = 1800;
    const step     = target / (duration / 16);
    let   current  = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 16);
  }

  return { init };
})();

/* ── Category Cards ─────────────────────────────────────────── */
SkillBridge.Categories = (function () {
  // TODO: Replace with API call → GET /api/categories
  const CATEGORIES = [
    { icon: '💻', title: 'Web Development',         count: '1,240 students', slug: 'web-dev'       },
    { icon: '🎨', title: 'Graphic Design',           count: '870 students',  slug: 'graphic-design' },
    { icon: '📱', title: 'Social Media Marketing',  count: '650 students',  slug: 'social-media'   },
    { icon: '✏️', title: 'UI/UX Design',             count: '920 students',  slug: 'ui-ux'          },
    { icon: '🎬', title: 'Video Editing',            count: '480 students',  slug: 'video-editing'  },
    { icon: '📊', title: 'Data Analysis',            count: '390 students',  slug: 'data-analysis'  },
    { icon: '✍️', title: 'Content Writing',          count: '710 students',  slug: 'writing'        },
    { icon: '🤖', title: 'AI & Machine Learning',    count: '340 students',  slug: 'ai-ml'          },
    { icon: '📷', title: 'Photography',              count: '290 students',  slug: 'photography'    },
    { icon: '🔊', title: 'Audio & Music',            count: '210 students',  slug: 'audio-music'    },
  ];

  function init() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    renderCategories(grid, CATEGORIES);
  }

  function renderCategories(container, data) {
    container.innerHTML = data.map(cat => `
      <a href="explore.html?category=${cat.slug}" class="category-card" data-animate>
        <div class="category-card__icon">${cat.icon}</div>
        <div class="category-card__title">${cat.title}</div>
        <div class="category-card__count">${cat.count}</div>
      </a>
    `).join('');
  }

  return { init, CATEGORIES };
})();

/* ── Testimonials ───────────────────────────────────────────── */
SkillBridge.Testimonials = (function () {
  // TODO: Replace with API call → GET /api/testimonials
  const TESTIMONIALS = [
    {
      text: "SkillBridge helped me land my first real freelance project while still in my second year. The platform is incredibly easy to use and the companies are genuinely interested in student talent.",
      name: "Sarah M.",
      role: "Computer Science Student, UCL",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&fit=crop&crop=face",
      stars: 5
    },
    {
      text: "As a startup founder, finding affordable, high-quality talent through SkillBridge has been a game-changer. We saved over 60% on our web project compared to traditional agencies.",
      name: "James T.",
      role: "Founder, TechStart London",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&fit=crop&crop=face",
      stars: 5
    },
    {
      text: "The premium CV guide was worth every penny. I went from getting ignored to landing interviews at top firms within three weeks. The LinkedIn strategy alone tripled my profile views.",
      name: "Aisha K.",
      role: "MBA Graduate, King's College",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&fit=crop&crop=face",
      stars: 5
    },
    {
      text: "I've hired three students through SkillBridge and all three delivered exceptional work on time. The verification process gives me confidence that I'm working with serious, skilled individuals.",
      name: "Michael R.",
      role: "Marketing Director, BrandCo",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&fit=crop&crop=face",
      stars: 5
    },
    {
      text: "The platform completely changed my perspective on what's possible as a student. I'm now earning enough to cover my tuition while building a real portfolio that employers actually care about.",
      name: "David L.",
      role: "Design Student, UAL",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80&fit=crop&crop=face",
      stars: 5
    },
    {
      text: "SkillBridge connected us with an amazing UI/UX student who redesigned our entire app in two weeks. The quality was outstanding and the process was seamless from brief to delivery.",
      name: "Emma W.",
      role: "Product Manager, FinTech Co",
      avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80&fit=crop&crop=face",
      stars: 5
    }
  ];

  function init() {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    renderTestimonials(grid, TESTIMONIALS);
  }

  function renderTestimonials(container, data) {
    container.innerHTML = data.map(t => `
      <div class="testimonial-card" data-animate>
        <div class="testimonial-card__stars">${'★'.repeat(t.stars)}</div>
        <p class="testimonial-card__text">${t.text}</p>
        <div class="testimonial-card__author">
          <div class="testimonial-card__avatar" style="overflow:hidden;flex-shrink:0">
            <img src="${t.avatarUrl}" alt="${t.name}" loading="lazy"
              style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />
          </div>
          <div>
            <div class="testimonial-card__name">${t.name}</div>
            <div class="testimonial-card__role">${t.role}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  return { init };
})();

/* ── Guide Cards on Homepage ────────────────────────────────── */
SkillBridge.GuidePreview = (function () {
  // TODO: Replace with API call → GET /api/guides?featured=true
  const GUIDES = [
    {
      emoji: '📄',
      title: 'CV Optimization',
      desc: 'Transform your CV into an interview magnet with proven templates and ATS-beating strategies.',
      price: '£19',
      originalPrice: '£39',
      id: 'cv-optimization',
      guideKey: 'guide-cv-optimization'
    },
    {
      emoji: '💼',
      title: 'LinkedIn Mastery',
      desc: 'Build a LinkedIn profile that attracts recruiters and grows your professional network organically.',
      price: '£24',
      originalPrice: '£49',
      id: 'linkedin-mastery',
      guideKey: 'guide-linkedin-mastery'
    },
    {
      emoji: '🎯',
      title: 'Interview Prep Kit',
      desc: 'Master behavioural and technical interviews with real question banks and expert answer frameworks.',
      price: '£29',
      originalPrice: '£59',
      id: 'interview-prep',
      guideKey: 'guide-interview-prep'
    },
    {
      emoji: '🚀',
      title: 'Freelance Starter Kit',
      desc: 'Everything you need to land your first client, price your work correctly and deliver like a pro.',
      price: '£34',
      originalPrice: '£69',
      id: 'freelance-kit',
      guideKey: 'guide-freelance-starter'
    }
  ];

  function init() {
    const grid = document.getElementById('guidesGrid');
    if (!grid) return;

    if (window.SB) {
      SB.GuidesAPI.getAll()
        .then(data => {
          const guides = (data.guides || []).map(g => ({
            emoji: g.emoji, title: g.title, desc: g.description,
            price: '£' + g.price, originalPrice: '£' + g.originalPrice,
            id: g.key, guideKey: g.key
          }));
          renderGuides(grid, guides.length ? guides : GUIDES);
        })
        .catch(() => renderGuides(grid, GUIDES));
    } else {
      renderGuides(grid, GUIDES);
    }
  }

  function renderGuides(container, data) {
    container.innerHTML = data.map(g => `
      <div class="guide-card" data-animate>
        <div class="guide-card__header">
          <span class="guide-card__emoji">${g.emoji}</span>
          <div class="guide-card__title">${g.title}</div>
          <div class="guide-card__desc">${g.desc}</div>
        </div>
        <div class="guide-card__footer">
          <div class="guide-card__price">
            ${g.price}<span>${g.originalPrice}</span>
          </div>
          <button class="btn btn-primary btn-sm"
            data-modal-trigger="payment"
            data-item-id="${g.id}"
            data-item-name="${g.title}"
            data-item-price="${g.price}"
            data-guide-key="${g.guideKey}">
            Buy Now
          </button>
        </div>
      </div>
    `).join('');

    // Re-bind payment triggers after render
    if (window.SkillBridge.PaymentModal) {
      window.SkillBridge.PaymentModal.bindTriggers();
    }
  }

  return { init, GUIDES };
})();

/* ── Smooth Scroll for anchor links ─────────────────────────── */
SkillBridge.SmoothScroll = (function () {
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
  return { init };
})();

/* ── Tooltip ────────────────────────────────────────────────── */
SkillBridge.Tooltip = (function () {
  function init() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      el.addEventListener('mouseenter', showTooltip);
      el.addEventListener('mouseleave', hideTooltip);
    });
  }

  function showTooltip(e) {
    const existing = document.querySelector('.sb-tooltip');
    if (existing) existing.remove();

    const tip  = document.createElement('div');
    tip.className = 'sb-tooltip';
    tip.textContent = e.currentTarget.dataset.tooltip;
    tip.style.cssText = `
      position: fixed; background: #1E293B; color: #fff;
      padding: 6px 12px; border-radius: 6px; font-size: 12px;
      pointer-events: none; z-index: 9999; white-space: nowrap;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(tip);

    const rect = e.currentTarget.getBoundingClientRect();
    tip.style.top  = (rect.top - tip.offsetHeight - 8) + 'px';
    tip.style.left = (rect.left + rect.width / 2 - tip.offsetWidth / 2) + 'px';
  }

  function hideTooltip() {
    const tip = document.querySelector('.sb-tooltip');
    if (tip) tip.remove();
  }

  return { init };
})();

/* ── Explore Page - Talent Filter ───────────────────────────── */
SkillBridge.ExploreFilter = (function () {
  // TODO: Replace with API call → GET /api/students?filters=...
  const STUDENTS = [
    {
      id: 1, initials: 'AJ', color: 'linear-gradient(135deg,#667EEA,#764BA2)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&fit=crop&crop=face',
      name: 'Alex Johnson', role: 'Full Stack Developer',
      university: 'UCL', desc: 'Building scalable web apps with React and Node.js. Available for short and long-term projects.',
      skills: ['React','Node.js','MongoDB','TypeScript'], rate: '£35/hr', rating: 4.9, reviews: 24,
      category: 'web-dev', workType: 'remote', budget: 'mid'
    },
    {
      id: 2, initials: 'SM', color: 'linear-gradient(135deg,#F093FB,#F5576C)',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&fit=crop&crop=face',
      name: 'Sophie Martinez', role: 'UI/UX Designer',
      university: 'RCA', desc: 'Creating beautiful, user-centered digital experiences backed by research and data.',
      skills: ['Figma','Prototyping','User Research','Framer'], rate: '£40/hr', rating: 5.0, reviews: 18,
      category: 'ui-ux', workType: 'remote', budget: 'mid'
    },
    {
      id: 3, initials: 'MK', color: 'linear-gradient(135deg,#4FACFE,#00F2FE)',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80&fit=crop&crop=face',
      name: 'Michael Kim', role: 'Data Analyst',
      university: 'Imperial', desc: 'Transforming raw data into actionable business insights using Python and advanced visualisations.',
      skills: ['Python','SQL','Power BI','Machine Learning'], rate: '£45/hr', rating: 4.8, reviews: 31,
      category: 'data-analysis', workType: 'hybrid', budget: 'high'
    },
    {
      id: 4, initials: 'EW', color: 'linear-gradient(135deg,#43E97B,#38F9D7)',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&q=80&fit=crop&crop=face',
      name: 'Emma Williams', role: 'Graphic Designer',
      university: 'UAL', desc: 'Award-winning designs for brands of all sizes — from startup logos to full brand identities.',
      skills: ['Illustrator','Photoshop','Branding','Print'], rate: '£28/hr', rating: 4.7, reviews: 42,
      category: 'graphic-design', workType: 'remote', budget: 'low'
    },
    {
      id: 5, initials: 'DL', color: 'linear-gradient(135deg,#FA709A,#FEE140)',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80&fit=crop&crop=face',
      name: 'Daniel Lee', role: 'Video Editor',
      university: 'Goldsmiths', desc: 'Cinematic video editing for YouTube, social media, and corporate content with fast turnaround.',
      skills: ['Premiere Pro','After Effects','DaVinci','Motion'], rate: '£32/hr', rating: 4.6, reviews: 15,
      category: 'video-editing', workType: 'remote', budget: 'mid'
    },
    {
      id: 6, initials: 'RB', color: 'linear-gradient(135deg,#A18CD1,#FBC2EB)',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80&fit=crop&crop=face',
      name: 'Rachel Brown', role: 'Social Media Manager',
      university: 'KCL', desc: 'Growing brand audiences through strategic content, community management, and paid campaigns.',
      skills: ['Instagram','TikTok','Copywriting','Analytics'], rate: '£25/hr', rating: 4.9, reviews: 38,
      category: 'social-media', workType: 'remote', budget: 'low'
    },
    {
      id: 7, initials: 'TC', color: 'linear-gradient(135deg,#96FBC4,#F9F586)',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&q=80&fit=crop&crop=face',
      name: 'Tom Chen', role: 'Backend Developer',
      university: 'Oxford', desc: 'Building reliable APIs and microservices with Go and Python. Clean code, excellent documentation.',
      skills: ['Go','Python','AWS','Docker'], rate: '£50/hr', rating: 4.9, reviews: 12,
      category: 'web-dev', workType: 'remote', budget: 'high'
    },
    {
      id: 8, initials: 'IA', color: 'linear-gradient(135deg,#FDDB92,#D1FDFF)',
      avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&q=80&fit=crop&crop=face',
      name: 'Isabelle Adams', role: 'Content Strategist',
      university: 'Edinburgh', desc: 'Crafting SEO-driven content strategies that convert readers into customers and drive organic growth.',
      skills: ['SEO','Copywriting','Blogging','HubSpot'], rate: '£22/hr', rating: 4.8, reviews: 27,
      category: 'writing', workType: 'remote', budget: 'low'
    }
  ];

  let filtered = [...STUDENTS];

  function init() {
    const grid = document.getElementById('talentGrid');
    if (!grid) return;

    if (window.SB) {
      loadFromAPI({});
    } else {
      renderTalent(filtered);
    }
    bindFilters();
    bindSearch();
  }

  function loadFromAPI(filters) {
    const grid = document.getElementById('talentGrid');
    if (grid) grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--gray-400)">Loading…</div>';
    SB.StudentsAPI.getAll(filters)
      .then(data => {
        const students = (data.students || []).map(s => ({
          id: s._id, initials: s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase(),
          color: 'linear-gradient(135deg,#667EEA,#764BA2)',
          avatarUrl: s.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&fit=crop&crop=face',
          name: s.name, role: s.bio ? s.bio.split('.')[0] : (s.category || 'Student'),
          university: s.university || '', desc: s.bio || '',
          skills: s.skills || [], rate: s.rate || '£30/hr',
          rating: s.rating || 4.5, reviews: s.reviewCount || 0,
          category: s.category || '', workType: s.workType || 'remote',
          budget: s.rateValue <= 30 ? 'low' : s.rateValue <= 45 ? 'mid' : 'high'
        }));
        filtered = students.length ? students : [...STUDENTS];
        renderTalent(filtered);
        const count = document.getElementById('talentCount');
        if (count) count.textContent = `${filtered.length} student${filtered.length !== 1 ? 's' : ''} found`;
      })
      .catch(() => { filtered = [...STUDENTS]; renderTalent(filtered); });
  }

  function renderTalent(data) {
    const grid = document.getElementById('talentGrid');
    if (!grid) return;

    if (!data.length) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem 1rem;color:var(--gray-400)">
          <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
          <p style="font-size:1.1rem;font-weight:600;color:var(--gray-600)">No students found</p>
          <p>Try adjusting your filters or search term.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = data.map(s => `
      <div class="talent-card" data-animate>
        <div class="talent-card__header">
          <div class="talent-card__avatar" style="overflow:hidden;background:${s.color}">
            <img src="${s.avatarUrl}" alt="${s.name}" loading="lazy"
              style="width:100%;height:100%;object-fit:cover;border-radius:50%;display:block" />
          </div>
          <div>
            <div class="talent-card__name">${s.name}</div>
            <div class="talent-card__role">${s.role}</div>
            <div class="talent-card__university">
              🎓 ${s.university}
            </div>
          </div>
        </div>
        <p class="talent-card__desc">${s.desc}</p>
        <div class="talent-card__skills">
          ${s.skills.map(sk => `<span class="talent-card__skill">${sk}</span>`).join('')}
        </div>
        <div class="talent-card__footer">
          <div class="talent-card__rate">${s.rate} <span>hourly</span></div>
          <div class="talent-card__rating">⭐ ${s.rating} (${s.reviews})</div>
        </div>
        <div class="talent-card__actions">
          <a href="student-profile.html?id=${s.id}" class="btn btn-ghost btn-sm">View Profile</a>
          <a href="hire.html?student=${s.id}" class="btn btn-primary btn-sm">Hire</a>
        </div>
      </div>
    `).join('');
  }

  function bindFilters() {
    ['filterCategory','filterUniversity','filterWorkType','filterBudget'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', applyFilters);
    });

    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) clearBtn.addEventListener('click', clearFilters);
  }

  function bindSearch() {
    const searchInput = document.getElementById('talentSearch');
    if (searchInput) {
      searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) searchBtn.addEventListener('click', applyFilters);
  }

  function applyFilters() {
    const query    = (document.getElementById('talentSearch')?.value || '').toLowerCase();
    const category = document.getElementById('filterCategory')?.value || '';
    const uni      = document.getElementById('filterUniversity')?.value || '';
    const workType = document.getElementById('filterWorkType')?.value || '';
    const budget   = document.getElementById('filterBudget')?.value || '';

    if (window.SB) {
      loadFromAPI({ search: query, category, university: uni, workType, budget });
      return;
    }

    // Fallback: filter static data
    filtered = STUDENTS.filter(s => {
      const matchQuery    = !query || s.name.toLowerCase().includes(query) || s.role.toLowerCase().includes(query) || s.skills.some(sk => sk.toLowerCase().includes(query));
      const matchCat      = !category || s.category === category;
      const matchUni      = !uni || s.university === uni;
      const matchWorkType = !workType || s.workType === workType;
      const matchBudget   = !budget || s.budget === budget;
      return matchQuery && matchCat && matchUni && matchWorkType && matchBudget;
    });

    renderTalent(filtered);
    const count = document.getElementById('talentCount');
    if (count) count.textContent = `${filtered.length} student${filtered.length !== 1 ? 's' : ''} found`;
  }

  function clearFilters() {
    ['filterCategory','filterUniversity','filterWorkType','filterBudget'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const search = document.getElementById('talentSearch');
    if (search) search.value = '';
    if (window.SB) { loadFromAPI({}); return; }
    filtered = [...STUDENTS];
    renderTalent(filtered);
  }

  return { init, STUDENTS };
})();

/* ── Utility: Debounce ──────────────────────────────────────── */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ── Init on DOM ready ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  SkillBridge.Navbar.init();
  SkillBridge.ScrollAnimations.init();
  SkillBridge.StatsCounter.init();
  SkillBridge.Categories.init();
  SkillBridge.Testimonials.init();
  SkillBridge.GuidePreview.init();
  SkillBridge.SmoothScroll.init();
  SkillBridge.Tooltip.init();
  SkillBridge.ExploreFilter.init();
});
