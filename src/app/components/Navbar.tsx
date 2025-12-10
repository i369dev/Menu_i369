
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Page } from '../types';
import { Language, translations } from '../utils/translations';
import { useContent } from '../context/ContentContext';

interface NavbarProps {
    activePage: Page;
    setPage: (page: Page) => void;
    textColor: string;
    isFirstLoad?: boolean;
    language: Language;
    isDetailView?: boolean;
}

interface NavLogoProps {
    textColor: string;
    isMenuOpen: boolean;
}

const NavLogo: React.FC<NavLogoProps> = ({ textColor, isMenuOpen }) => {
    const { config } = useContent();
    // If menu is open or text is white, we are on a dark background.
    // Dark background -> Use Dark Mode Logo (usually white/light).
    // Light background -> Use Light Mode Logo (usually black/dark).
    const isDarkBackground = isMenuOpen || textColor === '#FFFFFF';
    const logoSrc = isDarkBackground ? config.logoDark : config.logoLight;

    return (
        <div className="flex flex-col items-start justify-center h-12 w-auto">
             <img 
                src={logoSrc}
                alt="Imaginative 369"
                className="h-full w-auto object-contain object-left transition-all duration-300"
                style={{ 
                    filter: 'none',
                    opacity: 1,
                    mixBlendMode: 'normal'
                }}
             />
        </div>
    );
};

export const Navbar: React.FC<NavbarProps> = ({ activePage, setPage, textColor, isFirstLoad = false, language, isDetailView = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[language].nav;

  const navItems: { id: Page; label: string }[] = [
    { id: 'work', label: t.menu },
    { id: 'about', label: t.about },
    { id: 'curation', label: t.curation },
    { id: 'contact', label: t.contact }
  ];

  const handleNav = (page: Page) => {
    setPage(page);
    setIsMenuOpen(false);
  };

  const getPageLabel = () => {
    return navItems.find(i => i.id === activePage)?.label || 'Menu';
  };

  return (
    <>
      <motion.header 
        className="fixed top-0 left-0 right-0 z-[1000] px-6 py-8 md:px-12 flex items-center justify-between transition-colors duration-1000 pointer-events-none"
        style={{ color: isMenuOpen ? '#ffffff' : textColor }}
        initial={{ y: -150 }} 
        animate={{ y: 0 }}
        transition={{ 
            delay: isFirstLoad ? 2.1 : 0, 
            type: "spring", stiffness: 500, damping: 35, mass: 1
        }}
      >
        <div className="cursor-pointer pointer-events-auto" onClick={() => handleNav('work')}>
             <NavLogo textColor={textColor} isMenuOpen={isMenuOpen} />
        </div>

        {!isDetailView && (
            <div className="flex items-center gap-4 pointer-events-auto">
                <span className="hidden md:block text-xs font-sans tracking-widest uppercase opacity-80">
                    {getPageLabel()}
                </span>
                <div className="w-[2px] h-[2px] bg-current rounded-full mx-2 hidden md:block"></div>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-xs font-sans tracking-widest uppercase hover:opacity-70 transition-opacity"
                >
                    {isMenuOpen ? t.close : t.menuBtn}
                </button>
            </div>
        )}
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
            <motion.div 
                className="fixed inset-0 z-[1100] bg-[#1a1a1a] flex flex-col justify-center items-center text-white"
                initial={{ clipPath: "circle(0% at 100% 0%)" }}
                animate={{ clipPath: "circle(150% at 100% 0%)" }}
                exit={{ clipPath: "circle(0% at 100% 0%)" }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                <nav className="flex flex-col gap-8 md:gap-12 items-center">
                    {navItems.map((item, i) => (
                        <motion.button
                            key={item.id}
                            onClick={() => handleNav(item.id)}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (i * 0.1), duration: 0.8, ease: "easeOut" }}
                            className={`text-4xl md:text-7xl font-serif hover:italic transition-all duration-300 ${activePage === item.id ? 'text-white italic' : 'text-white/40'}`}
                        >
                            {item.label.replace(/^0\d\s+/, '')}
                        </motion.button>
                    ))}
                </nav>

                <motion.div 
                    className="absolute bottom-12 text-white/30 text-xs tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    © i369 | {new Date().getFullYear()} | All right reserved.
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
