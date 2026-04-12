/* eslint-disable @next/next/no-img-element */
'use client';

import React, { JSX } from 'react';
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUp
} from 'lucide-react';

// --- Courses Data (Expanded for more content) ---
const COURSES_1 = [
  'Java Full Stack', 'Python Full Stack', '.NET Full Stack', 'MERN Stack', 'MEAN Stack', 'PHP Full Stack', 'Advanced Java', 'Advanced Python'
];
const COURSES_2 = [
  'Data Analytics', 'Data Science', 'Power BI', 'Tableau', 'SQL & Databases', 'Big Data (Hadoop)', 'Spark', 'ETL / Data Warehousing'
];
const COURSES_3 = [
  'Generative AI / LLMs', 'Machine Learning', 'Deep Learning', 'NLP (Transformers)', 'Computer Vision', 'AI Ops', 'Reinforcement Learning', 'MLOps'
];
const COURSES_4 = [
  'Cloud (AWS)', 'Azure', 'Google Cloud', 'DevOps (CI/CD)', 'Kubernetes', 'Docker', 'Cloud Security', 'SRE'
];
const COURSES_5 = [
  'Cyber Security', 'Ethical Hacking', 'Network (CCNA)', 'System Admin', 'Blockchain', 'IoT', 'Embedded Systems', 'RPA'
];

// --- Navigation Links (Added About, Blog, etc.) ---
const COMPANY_LINKS = [
  { name: 'About Us', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Careers', href: '/careers' },
  { name: 'FAQs', href: '/faqs' },
  { name: 'Contact Us', href: '/contact' },
  { name: 'Student Success', href: '/success' },
];

const QUICK_LINKS = [
  { name: 'Live Classes', href: '/live' },
  { name: 'Self-Paced Courses', href: '/self-paced' },
  { name: 'Certifications', href: '/certifications' },
  { name: 'Corporate Training', href: '/corporate' },
  { name: 'Placement Assistance', href: '/placement' },
  { name: 'Free Resources', href: '/resources' },
];

const LEGAL_LINKS = [
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Refund Policy', href: '/refund' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Sitemap', href: '/sitemap' },
];


export default function Footer(): JSX.Element {
  return (
    <footer className="bg-neutral-950 text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">

        {/* === SECTION 1: Brand, Address & Quick Links (3-column layout) === */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 pb-10 md:pb-12 border-b border-neutral-800">

          {/* 1. Brand / Contact (Col-span 1 on MD, Col-span 2 on LG) */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="flex items-start gap-3">
              {/* Logo Placeholder */}

              <div>
                <img
                  src="/logo.png"   // public/brand/ folder me rakho
                  alt="Rex Galaxy Academy Logo"
                  className="w-auto h-20 object-contain rounded-lg shadow-lg"
                />
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                  Practical, industry-aligned training — upskill fast, get certified and hired.
                </p>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a aria-label="Facebook" href="#" className="p-2 bg-neutral-800/70 rounded-full text-white hover:bg-orange-600 transition"><Facebook size={18} /></a>
              <a aria-label="Instagram" href="#" className="p-2 bg-neutral-800/70 rounded-full text-white hover:bg-orange-600 transition"><Instagram size={18} /></a>
              <a aria-label="Youtube" href="#" className="p-2 bg-neutral-800/70 rounded-full text-white hover:bg-orange-600 transition"><Youtube size={18} /></a>
              <a aria-label="Linkedin" href="#" className="p-2 bg-neutral-800/70 rounded-full text-white hover:bg-orange-600 transition"><Linkedin size={18} /></a>
            </div>

            {/* Contact Address */}
            <address className="not-italic text-sm text-gray-400 mt-6 space-y-3 border-l-2 border-orange-500 pl-4">
              <div className="flex items-center gap-2"><MapPin size={16} /><span className='hover:text-white transition'>123 Rex St, Tech Park, Metro City - 500001</span></div>
              <div className="flex items-center gap-2"><Phone size={16} /><a className="hover:text-white transition" href="tel:+911234567890">+91 12345 67890 (24/7 Support)</a></div>
              <div className="flex items-center gap-2"><Mail size={16} /><a className="hover:text-white transition" href="mailto:contact@rexgalaxy.com">contact@rexgalaxy.com</a></div>
            </address>
          </div>

          {/* 2. Company & Quick Links (Stacked) */}
          <div className="md:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-12">

            {/* Company Links */}
            <div>
              <h4 className="text-md font-bold text-orange-500 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                {COMPANY_LINKS.map(link => (
                  <li key={link.name}><a href={link.href} className="hover:text-white transition">{link.name}</a></li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-md font-bold text-orange-500 mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                {QUICK_LINKS.map(link => (
                  <li key={link.name}><a href={link.href} className="hover:text-white transition">{link.name}</a></li>
                ))}
              </ul>
            </div>

            {/* Legal Links (Shorter column) */}
            <div>
              <h4 className="text-md font-bold text-orange-500 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-300">
                {LEGAL_LINKS.map(link => (
                  <li key={link.name}><a href={link.href} className="hover:text-white transition">{link.name}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        {/* === SECTION 2: Course Categories (Full width) === */}
        <div className="pt-10 md:pt-12">
          <h4 className="text-xl font-extrabold text-white mb-6 border-b border-neutral-800 pb-3">Popular Courses by Domain</h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
            {/* Full Stack */}
            <div>
              <h5 className="text-sm font-semibold text-sky-400 mb-3">Full Stack Dev</h5>
              <ul className="space-y-2 text-xs text-gray-400">
                {COURSES_1.map(item => <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>)}
              </ul>
            </div>

            {/* Data Analytics */}
            <div>
              <h5 className="text-sm font-semibold text-sky-400 mb-3">Data Analytics</h5>
              <ul className="space-y-2 text-xs text-gray-400">
                {COURSES_2.map(item => <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>)}
              </ul>
            </div>

            {/* AI / ML */}
            <div>
              <h5 className="text-sm font-semibold text-sky-400 mb-3">AI & Machine Learning</h5>
              <ul className="space-y-2 text-xs text-gray-400">
                {COURSES_3.map(item => <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>)}
              </ul>
            </div>

            {/* Cloud & Infra */}
            <div>
              <h5 className="text-sm font-semibold text-sky-400 mb-3">Cloud & DevOps</h5>
              <ul className="space-y-2 text-xs text-gray-400">
                {COURSES_4.map(item => <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>)}
              </ul>
            </div>

            {/* Others */}
            <div>
              <h5 className="text-sm font-semibold text-sky-400 mb-3">Emerging Tech</h5>
              <ul className="space-y-2 text-xs text-gray-400">
                {COURSES_5.map(item => <li key={item}><a href="#" className="hover:text-white transition">{item}</a></li>)}
              </ul>
            </div>
          </div>
        </div>


        {/* === SECTION 3: Bottom Bar (Copyright & Back to Top) === */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-500 text-center md:text-left">
            © {new Date().getFullYear()} Rex Galaxy Academy. All rights reserved. | Powered by Rex Digital
          </div>

          <button
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg hover:bg-orange-700 transition duration-300"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}