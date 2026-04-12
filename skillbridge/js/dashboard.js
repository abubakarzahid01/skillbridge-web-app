/* ============================================================
   SkillBridge - Dashboard JS (dashboard.js)
   Sidebar toggle, stats, charts, widgets, dummy data
   ============================================================ */

/* ── Dashboard namespace ────────────────────────────────────── */
const SkillBridgeDash = (function () {

  /* ── Sidebar toggle (mobile) ─────────────────────────────── */
  function initSidebar() {
    const toggle   = document.querySelector('.sidebar-toggle');
    const sidebar  = document.querySelector('.sidebar');
    const overlay  = document.getElementById('sidebarOverlay');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('visible');
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
      });
    }

    // Highlight active nav link
    const path = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar__nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === path) link.classList.add('active');
    });
  }

  /* ── Tab switcher (Student / Client) ─────────────────────── */
  function initDashTabs() {
    const tabs       = document.querySelectorAll('.dash-tab');
    const studentView = document.getElementById('studentDash');
    const clientView  = document.getElementById('clientDash');

    if (!tabs.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const mode = this.dataset.tab;
        if (studentView) studentView.style.display = (mode === 'student') ? '' : 'none';
        if (clientView)  clientView.style.display  = (mode === 'client')  ? '' : 'none';
      });
    });
  }

  /* ── Stat Cards ─────────────────────────────────────────────
     TODO: Replace STUDENT_STATS / CLIENT_STATS with API response
     GET /api/dashboard/stats → { completedProjects, totalEarnings, ... }
  ─────────────────────────────────────────────────────────── */
  const STUDENT_STATS = [
    { icon: '✅', label: 'Completed Projects', value: '24',    change: '+3 this month',  dir: 'up',   cls: 'blue'   },
    { icon: '💰', label: 'Total Earnings',      value: '£3,240', change: '+£480 this month', dir: 'up', cls: 'green'  },
    { icon: '⭐', label: 'Skill Score',          value: '92/100', change: '+8 points',      dir: 'up',  cls: 'purple' },
    { icon: '🔨', label: 'Active Projects',     value: '3',    change: '2 due this week', dir: 'down', cls: 'amber'  }
  ];

  const CLIENT_STATS = [
    { icon: '📋', label: 'Posted Projects',    value: '12',   change: '+2 this month',   dir: 'up',   cls: 'blue'   },
    { icon: '👥', label: 'Active Hires',        value: '5',    change: '3 ongoing',       dir: 'up',   cls: 'green'  },
    { icon: '💸', label: 'Total Spent',         value: '£8,400', change: '+£1,200 this month', dir: 'up', cls: 'purple' },
    { icon: '❤️', label: 'Saved Talent',        value: '18',   change: '+4 this week',    dir: 'up',   cls: 'amber'  }
  ];

  function renderStats(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(s => `
      <div class="dash-stat-card dash-stat-card--${s.cls}">
        <div class="dash-stat-card__icon">${s.icon}</div>
        <div class="dash-stat-card__value">${s.value}</div>
        <div class="dash-stat-card__label">${s.label}</div>
        <span class="dash-stat-card__change dash-stat-card__change--${s.dir}">
          ${s.dir === 'up' ? '↑' : '↓'} ${s.change}
        </span>
      </div>
    `).join('');
  }

  /* ── Earnings Chart ─────────────────────────────────────────
     TODO: Replace CHART_DATA with API response
     GET /api/dashboard/earnings?period=6months
  ─────────────────────────────────────────────────────────── */
  const CHART_DATA = {
    labels: ['Nov','Dec','Jan','Feb','Mar','Apr'],
    earnings: [420, 680, 540, 820, 710, 960],
    projects: [3, 5, 4, 6, 5, 7]
  };

  function renderEarningsChart() {
    const container = document.getElementById('earningsChart');
    if (!container) return;

    const maxVal = Math.max(...CHART_DATA.earnings);
    const bars   = CHART_DATA.earnings;

    container.innerHTML = `
      <div class="chart-placeholder">
        <div style="width:100%;padding:var(--space-4)">
          <div style="display:flex;align-items:flex-end;gap:12px;height:150px;padding:0 8px">
            ${bars.map((val, i) => {
              const pct    = (val / maxVal) * 100;
              const isLast = i === bars.length - 1;
              return `
                <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px">
                  <span style="font-size:10px;color:var(--gray-500);font-weight:600">£${val}</span>
                  <div style="width:100%;height:${pct}%;background:${isLast ? 'var(--primary)' : 'rgba(37,99,235,0.2)'};
                    border-radius:6px 6px 0 0;transition:all .3s;cursor:pointer;min-height:8px"
                    title="${CHART_DATA.labels[i]}: £${val}"
                    onmouseenter="this.style.background='var(--primary)'"
                    onmouseleave="this.style.background='${isLast ? 'var(--primary)' : 'rgba(37,99,235,0.2)'}'">
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="display:flex;gap:12px;padding:8px 8px 0;">
            ${CHART_DATA.labels.map(l => `
              <div style="flex:1;text-align:center;font-size:11px;color:var(--gray-400)">${l}</div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /* ── Skills Progress ─────────────────────────────────────────
     TODO: Replace with API → GET /api/dashboard/skills
  ─────────────────────────────────────────────────────────── */
  const SKILLS_DATA = [
    { name: 'React / Frontend',  pct: 88, color: 'var(--primary)'  },
    { name: 'Node.js / Backend', pct: 74, color: '#8B5CF6'         },
    { name: 'UI/UX Design',      pct: 65, color: 'var(--accent)'   },
    { name: 'TypeScript',        pct: 80, color: 'var(--success)'  },
    { name: 'Database / SQL',    pct: 71, color: 'var(--warning)'  }
  ];

  function renderSkillsProgress() {
    const container = document.getElementById('skillsProgress');
    if (!container) return;

    container.innerHTML = `
      <div class="skill-progress-list">
        ${SKILLS_DATA.map(s => `
          <div class="skill-progress-item">
            <div class="skill-progress-item__header">
              <span class="skill-progress-item__name">${s.name}</span>
              <span class="skill-progress-item__percent">${s.pct}%</span>
            </div>
            <div class="skill-progress-item__bar">
              <div class="skill-progress-item__fill"
                style="width:0%;background:${s.color}"
                data-target="${s.pct}">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Animate bars after a short delay
    setTimeout(() => {
      container.querySelectorAll('.skill-progress-item__fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
        bar.style.transition = 'width 1.2s ease';
      });
    }, 400);
  }

  /* ── Recent Projects ─────────────────────────────────────────
     TODO: Replace with API → GET /api/dashboard/projects?limit=5
  ─────────────────────────────────────────────────────────── */
  const RECENT_PROJECTS = [
    { icon: '🛒', iconBg: '#EFF6FF', title: 'E-Commerce Redesign',   meta: 'BrandCo · Completed',       status: 'completed' },
    { icon: '📊', iconBg: '#F0FDF4', title: 'Analytics Dashboard',   meta: 'FinTech Co · In Progress',  status: 'active'    },
    { icon: '📱', iconBg: '#FFF7ED', title: 'Mobile App UI Kit',      meta: 'StartupX · In Review',      status: 'review'    },
    { icon: '🌐', iconBg: '#F5F3FF', title: 'Landing Page Rebuild',   meta: 'AgencyBig · Completed',    status: 'completed' },
    { icon: '🎨', iconBg: '#FFF1F2', title: 'Brand Identity Pack',    meta: 'LocalBiz · Negotiating',   status: 'pending'   },
  ];

  const STATUS_MAP = {
    completed: { label: 'Completed', cls: 'badge-success'  },
    active:    { label: 'Active',    cls: 'badge-primary'  },
    review:    { label: 'In Review', cls: 'badge-warning'  },
    pending:   { label: 'Pending',   cls: 'badge-gray'     }
  };

  function renderRecentProjects() {
    const container = document.getElementById('recentProjects');
    if (!container) return;

    container.innerHTML = `
      <div class="project-list">
        ${RECENT_PROJECTS.map(p => {
          const s = STATUS_MAP[p.status] || STATUS_MAP.pending;
          return `
            <div class="project-item">
              <div class="project-item__icon" style="background:${p.iconBg}">${p.icon}</div>
              <div>
                <div class="project-item__title">${p.title}</div>
                <div class="project-item__meta">${p.meta}</div>
              </div>
              <div class="project-item__status">
                <span class="badge ${s.cls}">${s.label}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  /* ── Activity Feed ───────────────────────────────────────────
     TODO: Replace with API → GET /api/dashboard/activity?limit=8
  ─────────────────────────────────────────────────────────── */
  const ACTIVITY = [
    { icon: '💬', iconBg: '#EFF6FF', text: '<strong>BrandCo</strong> left a 5-star review on your last project.',     time: '10 min ago'  },
    { icon: '💰', iconBg: '#F0FDF4', text: '<strong>£480</strong> payment received from FinTech Co.',                   time: '2 hours ago' },
    { icon: '📩', iconBg: '#FFF7ED', text: 'New message from <strong>StartupX</strong> about your proposal.',          time: '5 hours ago' },
    { icon: '🎉', iconBg: '#F5F3FF', text: 'You completed the <strong>Analytics Dashboard</strong> milestone.',         time: 'Yesterday'   },
    { icon: '⭐', iconBg: '#FFFBEB', text: 'Your skill score increased to <strong>92/100</strong>.',                    time: '2 days ago'  },
    { icon: '📋', iconBg: '#FFF1F2', text: '<strong>AgencyBig</strong> posted a new project that matches your skills.', time: '3 days ago'  },
  ];

  function renderActivityFeed() {
    const container = document.getElementById('activityFeed');
    if (!container) return;

    container.innerHTML = `
      <div class="activity-feed">
        ${ACTIVITY.map(a => `
          <div class="activity-item">
            <div class="activity-item__icon" style="background:${a.iconBg}">${a.icon}</div>
            <div class="activity-item__text">
              <div class="activity-item__title">${a.text}</div>
              <div class="activity-item__time">${a.time}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ── Recommended Opportunities ───────────────────────────────
     TODO: Replace with API → GET /api/dashboard/recommended
  ─────────────────────────────────────────────────────────── */
  const RECOMMENDED = [
    { icon: '🛍️', title: 'Shopify Store Redesign', desc: 'E-commerce brand needs fresh UI', rate: '£800 fixed', tags: ['React','Shopify'] },
    { icon: '📈', title: 'Marketing Analytics', desc: 'Data visualisation for dashboard', rate: '£45/hr', tags: ['Python','Tableau']     },
    { icon: '🎨', title: 'Brand Refresh Project', desc: 'Full branding package needed', rate: '£1,200 fixed', tags: ['Figma','Branding'] },
    { icon: '🤖', title: 'Chatbot Integration', desc: 'AI assistant for SaaS platform', rate: '£55/hr', tags: ['OpenAI','Node.js']       },
  ];

  function renderRecommended() {
    const container = document.getElementById('recommendedGrid');
    if (!container) return;

    container.innerHTML = RECOMMENDED.map(r => `
      <a href="hire.html" class="recommended-card">
        <div class="recommended-card__icon">${r.icon}</div>
        <div class="recommended-card__title">${r.title}</div>
        <div class="recommended-card__desc">${r.desc}</div>
        <div class="recommended-card__meta">
          <span class="recommended-card__rate">${r.rate}</span>
          <span style="font-size:11px;color:var(--gray-400)">${r.tags.join(' · ')}</span>
        </div>
      </a>
    `).join('');
  }

  /* ── Client: Posted Projects ─────────────────────────────────
     TODO: Replace with API → GET /api/client/projects
  ─────────────────────────────────────────────────────────── */
  const POSTED_PROJECTS = [
    { icon: '💻', title: 'Website Rebuild',       meta: 'Posted 3 days ago · 12 proposals', tags: ['React','CSS'],          budget: '£1,500' },
    { icon: '📊', title: 'SEO & Analytics Setup', meta: 'Posted 1 week ago · 8 proposals',  tags: ['SEO','Analytics'],      budget: '£600'   },
    { icon: '🎨', title: 'Logo & Brand Package',  meta: 'Posted 2 weeks ago · 22 proposals',tags: ['Illustrator','Branding'],budget: '£800'   },
  ];

  function renderPostedProjects() {
    const container = document.getElementById('postedProjects');
    if (!container) return;

    container.innerHTML = POSTED_PROJECTS.map(p => `
      <div class="posted-project">
        <div class="posted-project__icon">${p.icon}</div>
        <div style="flex:1">
          <div class="posted-project__title">${p.title}</div>
          <div class="posted-project__meta">${p.meta}</div>
          <div class="posted-project__tags">
            ${p.tags.map(t => `<span class="badge badge-gray">${t}</span>`).join('')}
          </div>
        </div>
        <div class="posted-project__actions">
          <span style="font-weight:700;color:var(--primary);font-size:.9rem">${p.budget}</span>
          <button class="btn btn-ghost btn-sm">Edit</button>
          <button class="btn btn-primary btn-sm">View Proposals</button>
        </div>
      </div>
    `).join('');
  }

  /* ── Client: Saved Talent ─────────────────────────────────── */
  const SAVED_TALENT = [
    { initials:'AJ', color:'linear-gradient(135deg,#667EEA,#764BA2)', name:'Alex Johnson',  role:'Full Stack Dev',   rate:'£35/hr' },
    { initials:'SM', color:'linear-gradient(135deg,#F093FB,#F5576C)', name:'Sophie Martinez',role:'UI/UX Designer',  rate:'£40/hr' },
    { initials:'MK', color:'linear-gradient(135deg,#4FACFE,#00F2FE)', name:'Michael Kim',   role:'Data Analyst',    rate:'£45/hr' },
    { initials:'EW', color:'linear-gradient(135deg,#43E97B,#38F9D7)', name:'Emma Williams', role:'Graphic Designer', rate:'£28/hr' },
  ];

  function renderSavedTalent() {
    const container = document.getElementById('savedTalent');
    if (!container) return;

    container.innerHTML = `
      <div class="saved-talent-list">
        ${SAVED_TALENT.map(t => `
          <a href="student-profile.html" class="saved-talent-item">
            <div class="saved-talent-item__avatar" style="background:${t.color}">${t.initials}</div>
            <div>
              <div class="saved-talent-item__name">${t.name}</div>
              <div class="saved-talent-item__role">${t.role}</div>
            </div>
            <div class="saved-talent-item__rate">${t.rate}</div>
          </a>
        `).join('')}
      </div>
    `;
  }

  /* ── Budget Overview (client) ────────────────────────────── */
  function renderBudgetOverview() {
    const container = document.getElementById('budgetOverview');
    if (!container) return;

    const BUDGET_DATA = [
      { cls: 'spent',  label: 'Total Spent',   value: '£8,400', pct: 70 },
      { cls: 'active', label: 'Active Budget',  value: '£2,100', pct: 35 },
      { cls: 'saved',  label: 'Budget Saved',   value: '£1,500', pct: 25 },
    ];

    container.innerHTML = `
      <div class="budget-overview">
        ${BUDGET_DATA.map(b => `
          <div class="budget-item budget-item--${b.cls}">
            <div class="budget-item__header">
              <span class="budget-item__label">${b.label}</span>
              <span class="budget-item__value">${b.value}</span>
            </div>
            <div class="budget-item__bar">
              <div class="budget-item__fill" style="width:${b.pct}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ── Profile Completion Widget ───────────────────────────── */
  function renderProfileCompletion() {
    const bar     = document.querySelector('.sidebar__progress-fill');
    const percent = document.querySelector('.sidebar__profile-completion-percent');
    const value   = 72; // TODO: replace with user.profileCompletion from API

    if (bar)     {
      setTimeout(() => { bar.style.width = value + '%'; }, 600);
    }
    if (percent) percent.textContent = value + '%';
  }

  /* ── Greeting ────────────────────────────────────────────── */
  function renderGreeting(name) {
    const el = document.getElementById('dashGreeting');
    if (!el) return;
    const hour  = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    el.textContent = `${greet}, ${(name || 'there').split(' ')[0]} 👋`;
  }

  /* ── Load real user data from API ────────────────────────── */
  function loadFromAPI() {
    if (!window.SB) return;
    if (!SB.Auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return;
    }
    SB.DashboardAPI.get()
      .then(data => {
        const u = data.user || {};
        renderGreeting(u.name);

        // Update sidebar avatar/name if elements exist
        const sidebarName  = document.querySelector('.sidebar__user-name');
        const sidebarEmail = document.querySelector('.sidebar__user-email');
        const sidebarAvatar = document.querySelector('.sidebar__avatar');
        if (sidebarName)  sidebarName.textContent  = u.name  || '';
        if (sidebarEmail) sidebarEmail.textContent  = u.email || '';
        if (sidebarAvatar && u.avatar) {
          sidebarAvatar.innerHTML = `<img src="${u.avatar}" alt="${u.name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover">`;
        }

        // Update real stats if available
        const s = data.stats || {};
        if (s.projectsDone !== undefined) {
          const statValues = document.querySelectorAll('#studentStats .dash-stat-card__value');
          if (statValues[0]) statValues[0].textContent = s.projectsDone;
          if (statValues[2]) statValues[2].textContent = s.rating ? s.rating.toFixed(1) + '/5.0' : '—';
        }

        // Render hire requests in activity feed if present
        if (data.hireRequests && data.hireRequests.length) {
          const feed = document.getElementById('activityFeed');
          if (feed) {
            const extra = data.hireRequests.slice(0,3).map(r => `
              <div class="activity-item">
                <div class="activity-item__icon" style="background:#EFF6FF">📩</div>
                <div class="activity-item__text">
                  <div class="activity-item__title">Hire request from <strong>${r.companyName}</strong> — ${r.projectTitle}</div>
                  <div class="activity-item__time">${new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
              </div>`).join('');
            feed.querySelector('.activity-feed')?.insertAdjacentHTML('afterbegin', extra);
          }
        }
      })
      .catch(() => {
        // Use cached user data as fallback
        const user = SB.Auth.getUser();
        if (user) renderGreeting(user.name);
      });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    initSidebar();
    initDashTabs();
    renderStats(STUDENT_STATS, 'studentStats');
    renderStats(CLIENT_STATS, 'clientStats');
    renderEarningsChart();
    renderSkillsProgress();
    renderRecentProjects();
    renderActivityFeed();
    renderRecommended();
    renderPostedProjects();
    renderSavedTalent();
    renderBudgetOverview();
    renderProfileCompletion();
    // Load name from localStorage immediately — no API wait needed
    try {
      const cached = JSON.parse(localStorage.getItem('sb_user') || 'null');
      if (cached && cached.name) {
        renderGreeting(cached.name);
        const sidebarName = document.querySelector('.sidebar__user-name');
        if (sidebarName) sidebarName.textContent = cached.name;
        const sidebarRole = document.querySelector('.sidebar__user-role');
        if (sidebarRole && cached.role) sidebarRole.textContent = cached.role;
      } else {
        renderGreeting();
      }
    } catch(e) { renderGreeting(); }
    loadFromAPI();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', SkillBridgeDash.init);
