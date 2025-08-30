'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'صفحه اصلی' },
  { id: 'overview', label: 'معرفی' },
  { id: 'how-it-works', label: 'نحوه کار' },
  { id: 'use-cases', label: 'کاربردها' },
  { id: 'features', label: 'قابلیت‌ها' },
  { id: 'platforms', label: 'پلتفرم‌ها' },
  { id: 'deployment', label: 'استقرار' },
  { id: 'integrations', label: 'یکپارچگی' },
  { id: 'comparison', label: 'مقایسه' },
  { id: 'trust', label: 'اعتماد' },
  { id: 'faq', label: 'سوالات' },
  { id: 'contact', label: 'تماس' }
];

export function VerticalNav() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isNavHovered, setIsNavHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate the header height (assuming it's around 80px)
      const headerHeight = 80;
      const targetPosition = element.offsetTop - headerHeight;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = 800; // Increased duration for smoother feel
      let start: number | null = null;
      
      const easeInOutCubic = (t: number): number => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      
      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition + distance * easedProgress);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        } else {
          // Update active section after animation completes
          setActiveSection(sectionId);
        }
      };
      
      requestAnimationFrame(animation);
    }
  };

  return (
    <div 
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40"
      onMouseEnter={() => setIsNavHovered(true)}
      onMouseLeave={() => setIsNavHovered(false)}
    >
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.5 }}
        className="relative h-screen flex items-center"
      >
        {/* Section Indicators */}
        <div className="relative flex flex-col justify-center h-full">
          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            
            return (
              <div
                key={section.id}
                className="relative mb-3 last:mb-0"
              >
                {/* Section Circle */}
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`relative w-3 h-3 rounded-full transition-all duration-300 cursor-pointer z-10 ${
                    isActive 
                      ? 'bg-blue-600 scale-125 shadow-md shadow-blue-600/30' 
                      : 'bg-slate-400 hover:bg-slate-500 hover:scale-110'
                  }`}
                >
                  {/* Active Ring */}
                  {isActive && (
                    <motion.div
                      layoutId="activeRing"
                      className="absolute inset-0 rounded-full border border-blue-600"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>

                {/* Section Label Tooltip - Show when nav is hovered and clickable */}
                <AnimatePresence>
                  {isNavHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 15, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 15, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-lg px-2.5 py-1 shadow-xl whitespace-nowrap cursor-pointer hover:bg-slate-800/90 transition-colors duration-200"
                      onClick={() => scrollToSection(section.id)}
                    >
                      <span className="text-xs font-medium text-white">
                        {section.label}
                      </span>
                      {/* Tooltip Arrow */}
                      <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 w-0 h-0 border-l-3 border-l-slate-900/90 border-t-3 border-t-transparent border-b-3 border-b-transparent"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
