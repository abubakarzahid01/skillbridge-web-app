/* ============================================================
   student-profile.js
   Reads ?id= from URL and populates the profile page with
   the matching student data from the static students array.
   ============================================================ */

const STUDENTS = [
  {
    id: 1, initials: 'AJ', color: 'linear-gradient(135deg,#667EEA,#764BA2)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&fit=crop&crop=face',
    name: 'Alex Johnson', role: 'Full Stack Developer',
    university: 'UCL, Computer Science', location: 'London, UK',
    desc: "I'm a third-year Computer Science student at UCL with a passion for building scalable web applications. I specialise in React and Node.js, and I've helped over 20 businesses bring their digital products to life.\n\nI care deeply about clean code, user experience, and delivering projects on time. Whether you need a complete web app, an API integration, or a performance audit, I bring the same level of care and professionalism to every project.",
    skills: ['React','Node.js','TypeScript','MongoDB','PostgreSQL','AWS','Docker','REST APIs','GraphQL','Tailwind CSS','Next.js','Git / GitHub'],
    rate: '£35/hr', rating: 4.9, reviews: 24, projects: 20
  },
  {
    id: 2, initials: 'SM', color: 'linear-gradient(135deg,#F093FB,#F5576C)',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&fit=crop&crop=face',
    name: 'Sophie Martinez', role: 'UI/UX Designer',
    university: 'RCA, Design', location: 'London, UK',
    desc: "I'm a UI/UX Designer at the Royal College of Art with a passion for creating intuitive digital experiences. I combine user research, wireframing, and high-fidelity prototyping to deliver designs that are both beautiful and functional.\n\nI've worked with startups and established brands to redesign their products and significantly improve user satisfaction and conversion rates.",
    skills: ['Figma','Prototyping','User Research','Framer','Sketch','Adobe XD','Wireframing','Design Systems','Usability Testing','Interaction Design'],
    rate: '£40/hr', rating: 5.0, reviews: 18, projects: 15
  },
  {
    id: 3, initials: 'MK', color: 'linear-gradient(135deg,#4FACFE,#00F2FE)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&fit=crop&crop=face',
    name: 'Michael Kim', role: 'Data Analyst',
    university: 'Imperial College, Data Science', location: 'London, UK',
    desc: "Data Analyst at Imperial College London specialising in turning complex datasets into clear, actionable insights. I work with Python, SQL, and modern BI tools to help businesses make data-driven decisions.\n\nFrom building dashboards to training machine learning models, I bring analytical rigour and strong communication skills to every project.",
    skills: ['Python','SQL','Power BI','Machine Learning','Pandas','NumPy','Tableau','R','Statistics','Data Visualisation'],
    rate: '£45/hr', rating: 4.8, reviews: 31, projects: 25
  },
  {
    id: 4, initials: 'EW', color: 'linear-gradient(135deg,#43E97B,#38F9D7)',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&fit=crop&crop=face',
    name: 'Emma Williams', role: 'Graphic Designer',
    university: 'UAL, Graphic Design', location: 'London, UK',
    desc: "Award-winning Graphic Designer from UAL with a passion for creating visual identities that resonate. I've designed logos, brand kits, and marketing materials for startups and established companies across various industries.\n\nI focus on delivering clean, memorable designs that communicate your brand values effectively across all platforms.",
    skills: ['Illustrator','Photoshop','Branding','Print Design','InDesign','Typography','Logo Design','Packaging','Brand Identity','Motion Graphics'],
    rate: '£28/hr', rating: 4.7, reviews: 42, projects: 35
  },
  {
    id: 5, initials: 'DL', color: 'linear-gradient(135deg,#FA709A,#FEE140)',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&fit=crop&crop=face',
    name: 'Daniel Lee', role: 'Video Editor',
    university: 'Goldsmiths, Media', location: 'London, UK',
    desc: "Video Editor at Goldsmiths with a cinematic eye and fast turnaround. I specialise in YouTube content, corporate videos, and social media reels that engage and convert.\n\nWith experience in colour grading, motion graphics, and sound design, I deliver polished final products that make your brand stand out in a crowded digital landscape.",
    skills: ['Premiere Pro','After Effects','DaVinci Resolve','Motion Graphics','Colour Grading','Sound Design','YouTube','Social Media','Storytelling','Animation'],
    rate: '£32/hr', rating: 4.6, reviews: 15, projects: 18
  },
  {
    id: 6, initials: 'RB', color: 'linear-gradient(135deg,#A18CD1,#FBC2EB)',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80&fit=crop&crop=face',
    name: 'Rachel Brown', role: 'Social Media Manager',
    university: 'KCL, Marketing', location: 'London, UK',
    desc: "Social Media Manager at King's College London with a proven track record of growing brand audiences organically and through paid campaigns. I manage multi-platform strategies across Instagram, TikTok, LinkedIn, and Twitter.\n\nI combine data analytics with creative storytelling to build communities that convert followers into loyal customers.",
    skills: ['Instagram','TikTok','Copywriting','Analytics','LinkedIn Ads','Content Planning','Community Management','Paid Social','SEO','Email Marketing'],
    rate: '£25/hr', rating: 4.9, reviews: 38, projects: 30
  },
  {
    id: 7, initials: 'TC', color: 'linear-gradient(135deg,#96FBC4,#F9F586)',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80&fit=crop&crop=face',
    name: 'Tom Chen', role: 'Backend Developer',
    university: 'Oxford, Computer Science', location: 'Oxford, UK',
    desc: "Backend Developer at Oxford building reliable, high-performance APIs and microservices. I specialise in Go and Python with a strong focus on clean architecture, test coverage, and documentation.\n\nI've built systems that handle thousands of concurrent users and have a deep understanding of distributed systems, cloud infrastructure, and DevOps practices.",
    skills: ['Go','Python','AWS','Docker','Kubernetes','PostgreSQL','Redis','REST APIs','gRPC','CI/CD'],
    rate: '£50/hr', rating: 4.9, reviews: 12, projects: 14
  },
  {
    id: 8, initials: 'IA', color: 'linear-gradient(135deg,#FDDB92,#D1FDFF)',
    avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&q=80&fit=crop&crop=face',
    name: 'Isabelle Adams', role: 'Content Strategist',
    university: 'Edinburgh, English Literature', location: 'Edinburgh, UK',
    desc: "Content Strategist at the University of Edinburgh with a talent for crafting SEO-driven content that drives organic traffic and converts readers into customers. I develop full content strategies, editorial calendars, and long-form articles.\n\nMy work has helped clients rank on page one of Google and grow their email lists by thousands of subscribers.",
    skills: ['SEO','Copywriting','Blogging','HubSpot','Content Strategy','Email Marketing','WordPress','Keyword Research','Analytics','Social Media'],
    rate: '£22/hr', rating: 4.8, reviews: 27, projects: 22
  }
];

function loadProfile() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const student = STUDENTS.find(s => s.id === id) || STUDENTS[0];

  // Name & title
  document.querySelector('.profile-info__name').textContent = student.name;
  document.querySelector('.profile-info__role').textContent = student.role;
  document.title = student.name + ' | SkillBridge';

  // Meta items
  const metaItems = document.querySelectorAll('.profile-info__meta-item');
  if (metaItems[0]) metaItems[0].textContent = '🎓 ' + student.university;
  if (metaItems[1]) metaItems[1].textContent = '📍 ' + student.location;
  if (metaItems[2]) metaItems[2].textContent = '⭐ ' + student.rating + ' (' + student.reviews + ' reviews)';

  // Avatar
  const avatarImg = document.querySelector('.profile-avatar img');
  if (avatarImg) {
    avatarImg.src = student.avatarUrl;
    avatarImg.alt = student.name;
  }
  const avatarDiv = document.querySelector('.profile-avatar');
  if (avatarDiv) avatarDiv.style.background = student.color;

  // Rate on Hire button
  const hireBtn = document.querySelector('.profile-header__actions .btn-primary');
  if (hireBtn) hireBtn.textContent = 'Hire Now, ' + student.rate;

  // About bio
  const bioParagraphs = document.querySelectorAll('.profile-section p');
  const bioLines = student.desc.split('\n\n');
  if (bioParagraphs[0]) bioParagraphs[0].textContent = bioLines[0] || '';
  if (bioParagraphs[1]) bioParagraphs[1].textContent = bioLines[1] || '';

  // Skills
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) {
    skillsGrid.innerHTML = student.skills
      .map(sk => `<span class="skill-tag" role="listitem">${sk}</span>`)
      .join('');
  }

  // Sidebar rate card
  const priceNum = document.querySelector('.sidebar-card__price-num');
  if (priceNum) priceNum.textContent = student.rate.replace('/hr','');

  // Sidebar stat: projects completed
  const sidebarStats = document.querySelectorAll('.sidebar-stat__value');
  if (sidebarStats[0]) sidebarStats[0].textContent = student.projects + '+';
}

document.addEventListener('DOMContentLoaded', loadProfile);
