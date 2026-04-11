// utils/seed.js — Populate MongoDB with initial guides + demo students
// Run from backend folder: node utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Guide    = require('../models/Guide');
const User     = require('../models/User');

// ── Guides data ───────────────────────────────────────────────────
const GUIDES = [
  {
    key: 'guide-cv-optimization', emoji: '📄', isFeatured: true,
    title: 'CV Optimization Guide',
    description: 'Transform your CV into an interview magnet with proven templates and ATS-beating strategies.',
    price: 19, originalPrice: 39,
    features: ['12 professional CV templates', 'ATS optimisation checklist', 'Before & after examples', 'Industry-specific tailoring guide', 'Cover letter templates included']
  },
  {
    key: 'guide-linkedin-mastery', emoji: '💼',
    title: 'LinkedIn Mastery Guide',
    description: 'Build a LinkedIn profile that attracts recruiters daily and grow your network strategically.',
    price: 24, originalPrice: 49,
    features: ['Profile optimisation framework', 'Headline & summary formulas', 'Connection outreach scripts', 'Content strategy playbook']
  },
  {
    key: 'guide-interview-prep', emoji: '🎯',
    title: 'Interview Prep Kit',
    description: 'Master behavioural and technical interviews with real question banks and expert answer frameworks.',
    price: 29, originalPrice: 59,
    features: ['200+ real interview questions', 'STAR method answer framework', 'Technical interview prep', 'Salary negotiation scripts', 'Mock interview recording tips']
  },
  {
    key: 'guide-freelance-starter', emoji: '🚀',
    title: 'Freelance Starter Kit',
    description: 'Everything you need to land your first client, price your work correctly and deliver like a pro.',
    price: 34, originalPrice: 69,
    features: ['Pricing calculator template', 'Winning proposal templates', 'Freelance contract template', 'Client onboarding checklist', 'Invoice & payment guide']
  },
  {
    key: 'guide-portfolio-building', emoji: '🎨',
    title: 'Portfolio Builder Guide',
    description: 'Build a portfolio that makes hiring managers stop scrolling.',
    price: 22, originalPrice: 44,
    features: ['Portfolio structure blueprint', 'Case study writing framework', 'Platform recommendations', 'Personal brand positioning']
  },
  {
    key: 'guide-remote-work', emoji: '🌍',
    title: 'Remote Work Mastery',
    description: 'Thrive in remote and hybrid environments from day one.',
    price: 21, originalPrice: 42,
    features: ['Remote productivity systems', 'Async communication templates', 'Home office setup guide', 'Remote interview strategy', 'Work-life balance framework']
  }
];

// ── Demo students data ────────────────────────────────────────────
const STUDENTS = [
  {
    name: 'Alex Johnson', email: 'alex@demo.com', password: 'demo123456',
    role: 'student', university: 'UCL',
    bio: 'Building scalable web apps with React and Node.js. Available for short and long-term projects.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    rate: '£35/hr', rateValue: 35, rating: 4.9, reviewCount: 24,
    category: 'web-dev', workType: 'remote', isAvailable: true, projectsDone: 24,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&fit=crop&crop=face'
  },
  {
    name: 'Sophie Martinez', email: 'sophie@demo.com', password: 'demo123456',
    role: 'student', university: 'RCA',
    bio: 'Creating beautiful, user-centered digital experiences backed by research and data.',
    skills: ['Figma', 'Prototyping', 'User Research', 'Framer'],
    rate: '£40/hr', rateValue: 40, rating: 5.0, reviewCount: 18,
    category: 'ui-ux', workType: 'remote', isAvailable: true, projectsDone: 18,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80&fit=crop&crop=face'
  },
  {
    name: 'Michael Kim', email: 'michael@demo.com', password: 'demo123456',
    role: 'student', university: 'Imperial',
    bio: 'Transforming raw data into actionable business insights using Python and advanced visualisations.',
    skills: ['Python', 'SQL', 'Power BI', 'Machine Learning'],
    rate: '£45/hr', rateValue: 45, rating: 4.8, reviewCount: 31,
    category: 'data-analysis', workType: 'hybrid', isAvailable: true, projectsDone: 31,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&fit=crop&crop=face'
  },
  {
    name: 'Emma Williams', email: 'emma@demo.com', password: 'demo123456',
    role: 'student', university: 'UAL',
    bio: 'Award-winning designs for brands of all sizes — from startup logos to full brand identities.',
    skills: ['Illustrator', 'Photoshop', 'Branding', 'Print'],
    rate: '£28/hr', rateValue: 28, rating: 4.7, reviewCount: 42,
    category: 'graphic-design', workType: 'remote', isAvailable: true, projectsDone: 42,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&fit=crop&crop=face'
  },
  {
    name: 'Daniel Lee', email: 'daniel@demo.com', password: 'demo123456',
    role: 'student', university: 'Goldsmiths',
    bio: 'Cinematic video editing for YouTube, social media, and corporate content with fast turnaround.',
    skills: ['Premiere Pro', 'After Effects', 'DaVinci', 'Motion'],
    rate: '£32/hr', rateValue: 32, rating: 4.6, reviewCount: 15,
    category: 'video-editing', workType: 'remote', isAvailable: true, projectsDone: 15,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80&fit=crop&crop=face'
  },
  {
    name: 'Rachel Brown', email: 'rachel@demo.com', password: 'demo123456',
    role: 'student', university: 'KCL',
    bio: 'Growing brand audiences through strategic content, community management, and paid campaigns.',
    skills: ['Instagram', 'TikTok', 'Copywriting', 'Analytics'],
    rate: '£25/hr', rateValue: 25, rating: 4.9, reviewCount: 38,
    category: 'social-media', workType: 'remote', isAvailable: true, projectsDone: 38,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80&fit=crop&crop=face'
  },
  {
    name: 'Tom Chen', email: 'tom@demo.com', password: 'demo123456',
    role: 'student', university: 'Oxford',
    bio: 'Building reliable APIs and microservices with Go and Python. Clean code, excellent documentation.',
    skills: ['Go', 'Python', 'AWS', 'Docker'],
    rate: '£50/hr', rateValue: 50, rating: 4.9, reviewCount: 12,
    category: 'web-dev', workType: 'remote', isAvailable: true, projectsDone: 12,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80&fit=crop&crop=face'
  },
  {
    name: 'Isabelle Adams', email: 'isabelle@demo.com', password: 'demo123456',
    role: 'student', university: 'Edinburgh',
    bio: 'Crafting SEO-driven content strategies that convert readers into customers and drive organic growth.',
    skills: ['SEO', 'Copywriting', 'Blogging', 'HubSpot'],
    rate: '£22/hr', rateValue: 22, rating: 4.8, reviewCount: 27,
    category: 'writing', workType: 'remote', isAvailable: true, projectsDone: 27,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&q=80&fit=crop&crop=face'
  }
];

// ── Run seed ──────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Clear old demo data
    await Guide.deleteMany({});
    await User.deleteMany({ email: { $regex: /@demo\.com$/ } });
    console.log('🗑️  Cleared old seed data');

    // Insert guides
    await Guide.insertMany(GUIDES);
    console.log(`✅ Seeded ${GUIDES.length} guides`);

    // Insert demo students (password gets hashed by pre-save hook)
    for (const student of STUDENTS) {
      await User.create(student);
    }
    console.log(`✅ Seeded ${STUDENTS.length} demo students`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('   Demo student login: alex@demo.com / demo123456\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
