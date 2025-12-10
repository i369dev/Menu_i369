
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { getCyclicIndex } from '../../utils/helpers';
import { useContent } from '../../context/ContentContext';

export const TrustedByCarousel: React.FC = () => {
    const { getVisibleTrustedClients } = useContent();
    const clients = getVisibleTrustedClients();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const lastScrollTime = useRef(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isDragging) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => prev + 1);
        }, 2000); 
        return () => clearInterval(interval);
    }, [isDragging, activeIndex]);

    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        const swipeThreshold = 50;
        if (info.offset.x > swipeThreshold) {
            setActiveIndex((prev) => prev - 1);
        } else if (info.offset.x < -swipeThreshold) {
            setActiveIndex((prev) => prev + 1);
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        const now = Date.now();
        if (now - lastScrollTime.current < 400) return;
        if (Math.abs(e.deltaY) > 10 || Math.abs(e.deltaX) > 10) {
            if (e.deltaY > 0 || e.deltaX > 0) setActiveIndex((prev) => prev + 1);
            else setActiveIndex((prev) => prev - 1);
            lastScrollTime.current = now;
        }
    };
    
    if (clients.length === 0) return null;

    const visibleRange = [-2, -1, 0, 1, 2];
    const isMobile = windowWidth < 768;
    const offsetStep = isMobile ? windowWidth * 0.70 : windowWidth * 0.35; 

    return (
        <div 
            className="relative h-48 md:h-64 w-full flex items-center justify-center perspective-1000 overflow-visible"
            onWheel={handleWheel}
        >
            <motion.div 
                className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={onDragEnd}
            />

            <div className="relative w-full h-full flex items-center justify-center">
                <AnimatePresence initial={false}>
                    {visibleRange.map((offset) => {
                        const currentIndex = activeIndex + offset;
                        const client = clients[getCyclicIndex(currentIndex, clients.length)];
                        
                        const isCenter = offset === 0;
                        const absOffset = Math.abs(offset);
                        const x = offset * offsetStep; 
                        const centerScale = isMobile ? 1.25 : 1.5;
                        const scale = isCenter ? centerScale : 1 - (absOffset * 0.15);
                        const opacity = isCenter ? 1 : 0.3; 
                        const blur = isCenter ? 0 : 4;
                        const zIndex = 10 - absOffset;
                        
                        return (
                            <motion.div
                                key={currentIndex}
                                className="absolute flex items-center justify-center"
                                initial={{ x: x + 100, opacity: 0 }}
                                animate={{ x: x, scale: scale, opacity: opacity, filter: `blur(${blur}px) grayscale(${isCenter ? 0 : 100}%)`, zIndex: zIndex }}
                                exit={{ x: x - 100, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30, mass: 1 }}
                            >
                                {client.logo_url ? (
                                    <img 
                                        src={client.logo_url} 
                                        alt={client.business_name} 
                                        className="h-16 md:h-24 w-auto object-contain select-none pointer-events-none"
                                    />
                                ) : (
                                    <h2 className={`font-serif text-3xl md:text-5xl text-black whitespace-nowrap select-none ${isCenter ? 'font-bold' : 'font-normal'}`}>
                                        {client.business_name}
                                    </h2>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
            <div className="absolute bottom-0 w-1 h-4 bg-black/80 rounded-full" />
        </div>
    );
};
