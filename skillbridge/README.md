# SkillBridge — Student Freelancing & Hiring Platform

A complete frontend website for **SkillBridge** — a platform where students sell skills, companies hire talent, and users buy premium career guides.

---

## Project Structure

```
skillbridge/
├── index.html              ← Landing page (homepage)
├── login.html              ← Login page (split-screen)
├── signup.html             ← Signup page with role selection
├── explore.html            ← Browse and filter student talent
├── student-profile.html    ← Individual student profile
├── hire.html               ← Hire flow / post a project
├── premium-guides.html     ← Buy premium career guides
├── dashboard.html          ← Student + client dashboard
├── payment.html            ← Standalone checkout page
│
├── css/
│   ├── style.css           ← Global styles, design tokens, all components
│   ├── auth.css            ← Login/signup specific styles
│   ├── dashboard.css       ← Dashboard sidebar and widget styles
│   └── payment.css         ← Payment modal and checkout styles
│
├── js/
│   ├── main.js             ← Navbar, animations, category/testimonial data, explore filters
│   ├── auth.js             ← Login/signup validation and form logic
│   ├── dashboard.js        ← Dashboard widgets, charts, dummy data rendering
│   ├── payment.js          ← Payment method tabs, card formatting, pay flow
│   └── modal.js            ← Generic modal system, payment modal, toast notifications
│
├── assets/
│   ├── images/             ← Image assets (add your own)
│   └── icons/              ← SVG icons (add your own)
│
└── README.md
```

---

## Running the Project

### Option 1: Open directly in browser (simplest)

1. Open **VS Code**
2. Navigate to the `skillbridge/` folder
3. Double-click `index.html` OR right-click → **Open with Live Server**

### Option 2: VS Code Live Server extension (recommended)

1. Install the **Live Server** extension in VS Code
2. Open `skillbridge/index.html`
3. Click **"Go Live"** in the bottom status bar
4. The site opens at `http://127.0.0.1:5500/index.html`

### Option 3: Simple HTTP server (Python)

```bash
cd skillbridge
python -m http.server 3000
# Open http://localhost:3000
```

### Option 4: Node.js serve

```bash
npm install -g serve
cd skillbridge
serve .
```

---

## Pages Overview

| Page | File | Description |
|------|------|-------------|
| Landing | `index.html` | Hero, categories, benefits, guides preview, testimonials |
| Login | `login.html` | Split-screen login with form validation |
| Sign Up | `signup.html` | Role-based signup (student or company) |
| Explore | `explore.html` | Searchable, filterable talent marketplace |
| Student Profile | `student-profile.html` | Full student profile with portfolio + reviews |
| Hire | `hire.html` | Project posting form + hire flow |
| Premium Guides | `premium-guides.html` | Career guide store with payment modal |
| Dashboard | `dashboard.html` | Student + client dashboard with metrics |
| Payment | `payment.html` | Standalone checkout page |

---

## Features Implemented

### UI/UX
- Responsive design (desktop, tablet, mobile)
- Mobile hamburger menu with smooth animation
- CSS custom properties (design tokens)
- Scroll-triggered animations
- Smooth hover effects on all interactive elements
- Toast notifications
- Modal popup system
- Focus states and keyboard navigation
- ARIA labels for accessibility

### Pages
- **Hero section** with floating profile card
- **Stats counter** with animated count-up
- **Category grid** dynamically rendered from JS data
- **Talent grid** with live search + 4-way filtering
- **Split-screen auth pages** with role selection
- **Password strength meter**
- **Portfolio grid** with hover overlay
- **Dashboard** with stat cards, chart, skill bars, activity feed
- **Student/Client dashboard toggle**
- **Payment modal** with 4 payment methods (Card, Apple Pay, Google Pay, PayPal)
- **Card number formatter** (groups into 4s)
- **Promo code system** (try: `SKILL20`, `STUDENT10`, `WELCOME15`)
- **Payment success animation**

---

## Demo Credentials (Frontend Only)

For the login demo, any email with `@` and password with 6+ characters will succeed.

**Promo codes to test:**
- `SKILL20` — 20% off
- `STUDENT10` — 10% off
- `WELCOME15` — 15% off

---

## Backend Integration Guide

The frontend is structured for easy backend connection. Look for `TODO:` comments throughout the JS files.

### Authentication

```javascript
// In js/auth.js — replace simulation block with:
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
.then(res => res.json())
.then(data => {
  localStorage.setItem('sb_token', data.token);
  window.location.href = 'dashboard.html';
});
```

### API Endpoints to Build

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/signup` | POST | User registration |
| `/api/auth/logout` | POST | User logout |
| `/api/me` | GET | Current user profile |
| `/api/students` | GET | List students with filters |
| `/api/students/:id` | GET | Individual student profile |
| `/api/categories` | GET | Skill categories |
| `/api/projects` | POST | Post a new project |
| `/api/projects/draft` | POST | Save project draft |
| `/api/guides` | GET | Premium guides list |
| `/api/payments/initiate` | POST | Start payment session |
| `/api/payments/confirm` | POST | Confirm payment (webhook) |
| `/api/payments/record` | POST | Record successful payment |
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/dashboard/earnings` | GET | Earnings chart data |
| `/api/dashboard/activity` | GET | Activity feed |
| `/api/saved-profiles` | POST | Save/unsave a student profile |
| `/api/upload` | POST | File upload (project briefs) |

### Payment Gateway

Replace the simulation in `js/payment.js` `initPayButton()`:

```javascript
// Stripe example
const stripe = Stripe('pk_live_YOUR_KEY');
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
    billing_details: { name: cardHolder }
  }
});
```

### Dashboard Data

Replace dummy data arrays in `js/dashboard.js` with API calls:

```javascript
// Replace STUDENT_STATS, CHART_DATA, etc. with:
fetch('/api/dashboard/stats', {
  headers: { Authorization: `Bearer ${localStorage.getItem('sb_token')}` }
})
.then(res => res.json())
.then(data => renderStats(data, 'studentStats'));
```

---

## Design System

### Colors

```css
--primary:        #2563EB   /* Brand blue */
--primary-dark:   #1D4ED8   /* Hover states */
--primary-light:  #3B82F6   /* Lighter blue */
--primary-xlight: #EFF6FF   /* Backgrounds */
--success:        #10B981   /* Green */
--warning:        #F59E0B   /* Amber */
--danger:         #EF4444   /* Red */
```

### Typography

- **Display (headings):** Plus Jakarta Sans 600/700/800
- **Body:** Inter 400/500/600/700

### Key Classes

- `.btn .btn-primary` — Primary button
- `.btn .btn-secondary` — Outlined button
- `.btn .btn-ghost` — Subtle button
- `.btn .btn-lg / .btn-sm` — Size variants
- `.card` — Base card with hover effect
- `.badge .badge-primary/success/warning/gray` — Status badges
- `.section-label` — Uppercase label chip
- `.section-title` — H2 section heading

---

## Tech Stack

- **HTML5** — Semantic markup, ARIA accessibility
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — Modular, no dependencies
- **Google Fonts** — Inter + Plus Jakarta Sans

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Known Limitations (Frontend Only)

- No real authentication — session data stored in `sessionStorage`
- No real payments — simulation only
- No real file uploads — UI only
- All data is hardcoded in JS arrays (ready to replace with API calls)

---

## Extending the Project

1. **Add a new page** — Copy an existing `.html`, update nav links, add new JS in `js/`
2. **Add a new API endpoint** — Find the `TODO:` comment in the relevant JS file
3. **Change the color scheme** — Edit CSS variables in `:root` in `css/style.css`
4. **Add real images** — Place in `assets/images/` and update `src` attributes

---

*Built with SkillBridge — connecting ambitious students with forward-thinking companies.*
