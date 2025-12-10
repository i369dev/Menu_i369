
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../utils/translations';
import { useContent } from '../context/ContentContext';

interface LoaderProps {
    onComplete: () => void;
    initialLanguage: Language | null;
    onLanguageSelect: (lang: Language) => void;
}

export const Loader: React.FC<LoaderProps> = ({ onComplete, initialLanguage, onLanguageSelect }) => {
  const { config } = useContent();
  const [count, setCount] = useState(0);
  const [showLangModal, setShowLangModal] = useState(false);
  const [hasPaused, setHasPaused] = useState(false);
  const [animationStage, setAnimationStage] = useState<'counting' | 'cleared' | 'aperture' | 'full'>('counting');
  
  const [windowSize, setWindowSize] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const breakpoint = useRef(Math.floor(Math.random() * (60 - 20 + 1) + 20));

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (!initialLanguage && !hasPaused && prev + 1 === breakpoint.current) {
            setHasPaused(true);
            setShowLangModal(true);
            return prev;
        }

        if (showLangModal) return prev;

        if (prev >= 100) {
          clearInterval(interval);
          setAnimationStage('cleared');
          return 100;
        }
        return prev + 1;
      });
    }, 20); 
    
    return () => clearInterval(interval);
  }, [hasPaused, showLangModal, initialLanguage]);

  useEffect(() => {
      if (animationStage === 'cleared') {
          const t1 = setTimeout(() => {
              setAnimationStage('aperture');
          }, 200);
          return () => clearTimeout(t1);
      }

      if (animationStage === 'aperture') {
          const t2 = setTimeout(() => {
              setAnimationStage('aperture'); // This seems like a slight pause, original code had a transition
              setAnimationStage('full');
          }, 1200);
          return () => clearTimeout(t2);
      }

      if (animationStage === 'full') {
          const t3 = setTimeout(() => {
              onComplete();
          }, 1000);
          return () => clearTimeout(t3);
      }
  }, [animationStage, onComplete]);


  const handleSelect = (lang: Language) => {
      onLanguageSelect(lang);
      setShowLangModal(false);
  };

  const isMobile = windowSize.width < 768;
  const holeWidth = isMobile ? '85vw' : '576px';
  const holeHeight = isMobile ? '106.25vw' : '432px';
  const stepEase = (steps: number) => (p: number) => Math.floor(p * steps) / steps;

  const topVariants = {
      counting: { height: '50vh' },
      cleared: { height: '50vh' },
      aperture: { height: `calc(50vh - (${holeHeight} / 2))`, transition: { duration: 0.6, ease: stepEase(5) } },
      full: { height: '0vh', transition: { duration: 0.6, ease: stepEase(5) } }
  };

  const bottomVariants = {
      counting: { height: '50vh' },
      cleared: { height: '50vh' },
      aperture: { height: `calc(50vh - (${holeHeight} / 2))`, transition: { duration: 0.6, ease: stepEase(5) } },
      full: { height: '0vh', transition: { duration: 0.6, ease: stepEase(5) } }
  };

  const leftVariants = {
      counting: { width: '50vw' },
      cleared: { width: '50vw' },
      aperture: { width: `calc(50vw - (${holeWidth} / 2))`, transition: { duration: 0.6, ease: stepEase(5) } },
      full: { width: '0vw', transition: { duration: 0.6, ease: stepEase(5) } }
  };

  const rightVariants = {
      counting: { width: '50vw' },
      cleared: { width: '50vw' },
      aperture: { width: `calc(50vw - (${holeWidth} / 2))`, transition: { duration: 0.6, ease: stepEase(5) } },
      full: { width: '0vw', transition: { duration: 0.6, ease: stepEase(5) } }
  };

  const centerMarginX = isMobile ? '5rem' : '8rem';
  const centerMarginY = isMobile ? '6rem' : '9rem';

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <motion.div className="absolute top-0 left-0 right-0 bg-black z-20" initial="counting" animate={animationStage} variants={topVariants} />
      <motion.div className="absolute bottom-0 left-0 right-0 bg-black z-20" initial="counting" animate={animationStage} variants={bottomVariants} />
      <motion.div className="absolute left-0 bg-black z-20" style={{ top: 0, bottom: 0 }} initial="counting" animate={animationStage} variants={leftVariants} />
      <motion.div className="absolute right-0 bg-black z-20" style={{ top: 0, bottom: 0 }} initial="counting" animate={animationStage} variants={rightVariants} />

      <div 
        className="absolute inset-0 flex flex-col items-center justify-center z-30 transition-opacity duration-0"
        style={{ opacity: animationStage === 'counting' ? 1 : 0 }}
      >
          <div className="relative z-10 flex flex-col items-center justify-center">
              <motion.img 
                  src={config.loadingLogo}
                  alt="Loading"
                  className="w-32 md:w-40 object-contain mb-8"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2 }}
                  style={{ filter: 'none', mixBlendMode: 'normal' }}
              />
              <div className="relative bg-black px-6 py-2">
                <span className="text-6xl md:text-9xl font-serif font-light tabular-nums text-white block leading-none">
                    {count}
                </span>
              </div>
          </div>
          
          <div className="absolute inset-0 pointer-events-none z-0">
             <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/20" initial={{ height: 0 }} animate={{ height: `calc(50vh - ${centerMarginY})` }} transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} />
             <motion.div className="absolute top-1/2 left-0 -translate-y-1/2 h-[1px] bg-white/20" initial={{ width: 0 }} animate={{ width: `calc(50vw - ${centerMarginX})` }} transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} />
             <motion.div className="absolute top-1/2 right-0 -translate-y-1/2 h-[1px] bg-white/20" initial={{ width: 0 }} animate={{ width: `calc(50vw - ${centerMarginX})` }} transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} />
          </div>
      </div>

      <AnimatePresence>
        {showLangModal && (
            <motion.div 
                className="absolute inset-0 z-[110] flex items-center justify-center backdrop-blur-md bg-black/60 pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="flex flex-col gap-6 text-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                >
                    <h2 className="text-xl md:text-2xl font-sans tracking-widest uppercase mb-4 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        Select Language
                    </h2>
                    <div className="flex flex-col gap-4">
                        <button onClick={() => handleSelect('en')} className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-sm text-white">English</button>
                        <button onClick={() => handleSelect('si')} className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors font-sans text-sm text-white">සිංහල</button>
                        <button onClick={() => handleSelect('ta')} className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors font-sans text-sm text-white">தமிழ்</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
