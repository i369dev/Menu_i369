
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, Variants, Transition } from 'framer-motion';
import { Project, Page } from '../../types';
import { Language, translations } from '../../utils/translations';
import { getCyclicIndex } from '../../utils/helpers';

interface WorkListProps {
    onSelect: (project: Project) => void;
    isFirstLoad: boolean;
    projects: Project[];
    language: Language;
    onLanguageChange: (lang: Language) => void;
    setPage: (page: Page) => void;
}

export const WorkList: React.FC<WorkListProps> = ({ onSelect, isFirstLoad, projects, language, onLanguageChange, setPage }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollAccumulator = useRef(0);
    const lastScrollTime = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const t = translations[language].work;
    const commonT = translations[language].common;
    const isDragging = useRef(false);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const now = Date.now();
            if (now - lastScrollTime.current < 400) return; 
            scrollAccumulator.current += e.deltaY;
            const threshold = 50; 
            if (scrollAccumulator.current > threshold) {
                setActiveIndex(prev => prev + 1);
                lastScrollTime.current = now;
                scrollAccumulator.current = 0;
            } else if (scrollAccumulator.current < -threshold) {
                setActiveIndex(prev => prev - 1);
                lastScrollTime.current = now;
                scrollAccumulator.current = 0;
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                setActiveIndex(prev => prev + 1);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                setActiveIndex(prev => prev - 1);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            if (container) container.removeEventListener('wheel', handleWheel);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const onPanEnd = (e: any, info: PanInfo) => {
        isDragging.current = false;
        const threshold = 50;
        if (info.offset.y < -threshold) {
             setActiveIndex(prev => prev + 1);
        } else if (info.offset.y > threshold) {
             setActiveIndex(prev => prev - 1);
        }
    };

    if (!projects || projects.length === 0) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#353535] text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-serif mb-2">No Projects Found</h2>
                    <p className="text-sm font-sans opacity-60">Please add projects via the Admin Dashboard.</p>
                    <button onClick={() => setPage('admin')} className="mt-8 text-xs uppercase tracking-widest border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-colors">
                        Go to Admin
                    </button>
                </div>
            </div>
        );
    }

    const currentProjectIndex = getCyclicIndex(activeIndex, projects.length);
    const currentProject = projects[currentProjectIndex];

    const snapTransition: Transition = {
        type: "spring", stiffness: 500, damping: 35, mass: 1, delay: isFirstLoad ? 2.2 : 0.2 
    };

    const uiVariantsTop: Variants = { hidden: { y: -100, opacity: 0 }, visible: { y: 0, opacity: 1, transition: snapTransition } };
    const uiVariantsBottom: Variants = { hidden: { y: 100, opacity: 0 }, visible: { y: 0, opacity: 1, transition: snapTransition } };
    const uiVariantsLeft: Variants = { hidden: { x: -100, opacity: 0 }, visible: { x: 0, opacity: 1, transition: snapTransition } };

    const percentage = Math.round((currentProjectIndex / (projects.length - 1)) * 100);
    const formattedPercentage = percentage < 10 ? `0${percentage}` : `${percentage}`;
    const visibleOffsets = [-2, -1, 0, 1, 2, 3];

    return (
        <motion.div 
            ref={containerRef}
            className="h-screen w-full relative overflow-hidden bg-[#353535] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing"
            onPanStart={() => { isDragging.current = true; }}
            onPanEnd={onPanEnd}
            style={{ touchAction: 'none' }}
        >
            <motion.div 
                className="fixed top-28 left-6 md:left-12 z-[60] pointer-events-none"
                initial={isFirstLoad ? "hidden" : "visible"}
                animate="visible"
                variants={uiVariantsLeft}
            >
                <span className="text-xs font-sans tracking-widest text-white/60">[ {formattedPercentage} ]</span>
            </motion.div>
            
            <motion.div 
                className="fixed top-32 right-6 md:right-12 z-[60] flex flex-col gap-2"
                initial={isFirstLoad ? "hidden" : "visible"}
                animate="visible"
                variants={uiVariantsTop}
            >
                {(['en', 'si', 'ta'] as const).map((lang) => (
                    <button 
                        key={lang}
                        onClick={(e) => { e.stopPropagation(); onLanguageChange(lang); }}
                        className={`text-xs uppercase tracking-widest transition-opacity ${language === lang ? 'opacity-100 font-bold' : 'opacity-40 hover:opacity-80'}`}
                    >
                        {lang === 'en' ? 'EN' : lang === 'si' ? 'SI' : 'TA'}
                    </button>
                ))}
            </motion.div>

            <motion.div 
                className="fixed bottom-12 right-6 md:right-12 z-[60] text-right pointer-events-none"
                initial={isFirstLoad ? "hidden" : "visible"}
                animate="visible"
                variants={uiVariantsBottom}
            >
                 <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentProject.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl md:text-6xl font-serif text-white"
                    >
                        {currentProject.pricing?.designAndPrint?.basePrice 
                            ? `${commonT.currency} ${currentProject.pricing.designAndPrint.basePrice.toLocaleString()}` 
                            : currentProject.year}
                    </motion.div>
                 </AnimatePresence>
                 <div className="text-xs uppercase tracking-widest opacity-50 mt-2">{t.price}</div>
            </motion.div>

            <motion.div 
                className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-white/20 z-[60]"
                initial={isFirstLoad ? "hidden" : "visible"}
                animate="visible"
                variants={uiVariantsLeft}
            >
                 <motion.div 
                    className="w-full bg-white"
                    animate={{ height: `${((currentProjectIndex + 1) / projects.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 100 }}
                 />
            </motion.div>
             <motion.div 
                className="fixed left-8 md:left-16 top-1/2 -translate-y-1/2 z-[60] text-xs font-sans tabular-nums w-full"
                initial={isFirstLoad ? "hidden" : "visible"}
                animate="visible"
                variants={uiVariantsLeft}
            >
                 0{currentProjectIndex + 1} <span className="opacity-40">/ 0{projects.length}</span>
            </motion.div>

            {/* Admin Entry Point */}
            <div 
                className="fixed bottom-4 left-4 z-[100] opacity-0 hover:opacity-50 transition-opacity cursor-pointer p-4"
                onClick={() => setPage('admin')}
            >
                <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>

            <div className="relative w-full h-full flex items-center justify-center perspective-1000 z-10 pointer-events-none">
                <AnimatePresence initial={false}>
                    {visibleOffsets.map((offset) => {
                        const effectiveIndex = activeIndex + offset;
                        const projectIndex = getCyclicIndex(effectiveIndex, projects.length);
                        const project = projects[projectIndex];
                        if (!project) return null;

                        const isActive = offset === 0;
                        const isPast = offset < 0;
                        const initialY = isFirstLoad && isActive ? 0 : isFirstLoad ? 1000 : offset * 40;
                        const targetY = isPast ? '100vh' : isActive ? 0 : -offset * 40; 
                        const targetZ = isPast ? 0 : -offset * 50;
                        const targetScale = isPast ? 0.9 : 1 - (offset * 0.05);
                        const targetOpacity = isPast ? 0 : 1 - (offset * 0.15);
                        const targetFilter = isActive ? 'blur(0px)' : `blur(${offset * 2}px) brightness(${1 - offset * 0.1})`;
                        const zIndex = 100 - offset;

                        return (
                            <motion.div
                                key={project.id}
                                className="absolute top-0 w-full h-full flex items-center justify-center p-6 md:p-12 origin-top"
                                initial={{ y: isFirstLoad && isActive ? 0 : (isPast ? '100vh' : -offset * 40 - 100), opacity: isFirstLoad && isActive ? 1 : 0 }}
                                animate={{ y: targetY, z: targetZ, scale: targetScale, opacity: targetOpacity, filter: targetFilter, zIndex: zIndex }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div 
                                    className="relative w-full max-w-xl aspect-[4/5] md:aspect-[4/3] bg-black shadow-2xl cursor-pointer overflow-hidden group pointer-events-auto"
                                    onClick={() => { if (!isDragging.current && isActive) onSelect(project); }}
                                >
                                    {project.video ? (
                                        <video src={project.video} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                    ) : (
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                                        <h3 className="text-sm font-sans uppercase tracking-widest text-white/60 mb-2">{project.category}</h3>
                                        <h2 className="text-3xl md:text-5xl font-serif text-white mb-2">{project.title}</h2>
                                        <p className="text-sm font-sans text-white/80 max-w-sm">{project.description?.slice(0, 100)}...</p>
                                        <div className="mt-8 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                                            <span className="text-xs uppercase tracking-widest border border-white/30 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-colors">{t.detailView}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
             <motion.div 
                className="absolute bottom-12 w-full text-center text-[10px] uppercase tracking-widest opacity-30 animate-pulse pointer-events-none"
                initial={isFirstLoad ? "hidden" : "visible"}
                animate="visible"
                variants={uiVariantsBottom}
            >
                {commonT.scroll}
            </motion.div>
        </motion.div>
    );
};
