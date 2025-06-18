// pages/index.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import {
  FaBrain,
  FaLightbulb,
  FaCalendarCheck,
  FaCommentDots,
  FaBars,
  FaRobot,
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaGithub
} from 'react-icons/fa';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initialize dark mode based on user preference or stored setting
  useEffect(() => {
    const isDark =
      localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    const mode = !darkMode;
    setDarkMode(mode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', mode.toString());
  };

  // Initialize particles.js after script load
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).particlesJS) {
      ;(window as any).particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 3,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out'
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' }
          }
        }
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>CareerMate - AI Interview Coach</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Load particles.js */}
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="afterInteractive"
      />

      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <FaBrain className="text-indigo-500 text-2xl mr-2" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Career<span className="text-indigo-500">Mate</span>
              </span>
              <div className="hidden md:flex ml-10 space-x-8">
                {['Home', 'Interview', 'Flashcards', 'Study Plan', 'Test','AI Tutor'].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="nav-link text-sm font-medium text-gray-500 dark:text-gray-300 hover:text-indigo-500"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center">
              <button
                onClick={toggleDarkMode}
                className="mr-4 text-gray-500 dark:text-gray-300 hover:text-indigo-500"
              >
                {darkMode ? '🌙' : '☀️'}
              </button>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Login
              </Link>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 px-4 pb-3">
            {['Home', 'Interview', 'Flashcards', 'Study Plan', 'Test', 'AI Tutor','Login'].map((item, idx) => (
              <Link
                key={idx}
                href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(/ /g, '-')}`}
                className="block py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500"
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white overflow-hidden">
        <div id="particles-js" className="absolute inset-0 z-0"></div>
        <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 lg:flex lg:items-center">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-extrabold gradient-text leading-tight">
              Where AI Meets Your Career Journey
            </h1>
            <p className="mt-4 text-lg text-gray-300">
              Unlock your potential with intelligent interview coaching, personalized learning, and real-time performance feedback.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="/interview"
                className="px-6 py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                Start Interview
              </Link>
              <Link
                href="/study-plan"
                className="px-6 py-3 rounded-md bg-white text-indigo-700 font-medium hover:bg-gray-100"
              >
                View Study Plan
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center items-center">
            <div className="glass-card p-10 text-center rounded-xl">
              <FaRobot className="text-6xl mb-4" />
              <h3 className="text-xl font-bold">AI-Powered Coaching</h3>
              <p className="mt-2 text-gray-200">Personalized feedback and guidance for your career journey</p>
            </div>
          </div>
        </section>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-blue-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-indigo-600 font-semibold uppercase">Features</h2>
            <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Everything you need to succeed
            </p>
            <p className="text-xl text-gray-500 dark:text-gray-300 mt-4">
              Our tools help you prepare efficiently and effectively.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <FaLightbulb className="text-white" />,
                title: 'Flashcard of the Day',
                desc:
                  'Daily curated flashcards. Today: "What is the difference between margin and padding in CSS?"',
                link: '/flashcards',
                linkText: 'View all flashcards'
              },
              {
                icon: <FaCalendarCheck className="text-white" />,
                title: "Today's Study Plan",
                desc: '30 min JavaScript, 2 mock interviews, 10 flashcards.',
                link: '/study-plan',
                linkText: 'View full plan'
              },
              {
                icon: <FaCommentDots className="text-white" />,
                title: 'Recent Answer Feedback',
                desc:
                  '"Your REST API answer was good, but mention status codes next time."',
                link: '/feedback',
                linkText: 'See all feedback'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="feature-card p-6 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition"
              >
                <div className="h-12 w-12 bg-indigo-500 flex items-center justify-center rounded-md">
                  {item.icon}
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-300">{item.desc}</p>
                <div className="mt-4">
                  <Link href={item.link} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    {item.linkText} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-4xl mx-auto text-center text-white px-4">
          <h2 className="text-4xl font-extrabold">Trusted by job seekers worldwide</h2>
          <p className="mt-3 text-xl text-indigo-200">Users report huge performance boosts.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { stat: '92%', label: 'Interview success rate' },
              { stat: '10K+', label: 'Practice questions' },
              { stat: '24/7', label: 'AI coach availability' }
            ].map((s, i) => (
              <div key={i}>
                <p className="text-5xl font-extrabold">{s.stat}</p>
                <p className="mt-2 text-indigo-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-4">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Ready to dive in?{' '}
            <span className="text-indigo-600 dark:text-indigo-400 block">
              Start your free today.
            </span>
          </h2>
          <div className="mt-8 lg:mt-0 flex gap-4">
            <Link
              href="/login"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium"
            >
              Get started
            </Link>
            <Link
              href="/interview"
              className="px-5 py-3 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md font-medium"
            >
              Live demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8 px-4">
          <div>
            <div className="flex items-center mb-4">
              <FaBrain className="text-indigo-500 text-2xl mr-2" />
              <span className="text-xl font-bold text-white">
                Career<span className="text-indigo-400">Mate</span>
              </span>
            </div>
            <p className="text-gray-300">
              Helping you land your dream job through AI-powered coaching and personalized
              learning.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Developed by <span className="text-indigo-400">Tahmid Al Kawsar Chowdhury</span>
            </p>
            <div className="flex space-x-4 mt-4 text-gray-400 hover:text-white">
              <a href="#">
                <FaTwitter />
              </a>
              <a href="#">
                <FaFacebookF />
              </a>
              <a href="#">
                <FaLinkedinIn />
              </a>
              <a href="https://github.com/tahmid-al">
                <FaGithub />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">  
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Solutions</h3>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li>
                    <Link href="/interview" className="hover:text-white">
                      Mock Interviews
                    </Link>
                  </li>
                  <li>
                    <Link href="/flashcards" className="hover:text-white">
                      Flashcards
                    </Link>
                  </li>
                  <li>
                    <Link href="/study-plan" className="hover:text-white">
                      Study Plans
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Support</h3>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Guides
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Company</h3>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Legal</h3>
                <ul className="mt-4 space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-400">
          &copy; 2023 CareerMate. All rights reserved.
        </div>
      </footer>
    </>
  );
}
