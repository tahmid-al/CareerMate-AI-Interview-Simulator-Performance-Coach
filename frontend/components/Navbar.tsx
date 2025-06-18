// components/Navbar.tsx

import Link from "next/link";
import { useState, useEffect } from "react";
import { FaBrain, FaBars } from "react-icons/fa";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const isDark =
      localStorage.getItem("darkMode") === "true" ||
      (!localStorage.getItem("darkMode") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    const mode = !darkMode;
    setDarkMode(mode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", mode.toString());
  };

  const navItems = ["Home", "Interview", "Flashcards", "Study Plan", "Test", "AI Tutor"];

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-indigo-500 text-2xl mr-2"><FaBrain /></span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Career<span className="text-indigo-500">Mate</span>
            </span>
            <div className="hidden md:flex ml-10 space-x-8">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/ /g, "-")}`}
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
              {darkMode ? "🌙" : "☀️"}
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
          {[...navItems, "Login"].map((item, idx) => (
            <Link
              key={idx}
              href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/ /g, "-")}`}
              className="block py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
