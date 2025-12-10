
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { CuratedItem } from '../../types';
import { getCyclicIndex } from '../../utils/helpers';

interface CurationCarouselProps {
    items: CuratedItem[];
    onItemClick: (item: CuratedItem) => void;
    selectedId?: number;
    onIndexChange: (index: number) => void;
}

export const CurationCarousel: React.FC<CurationCarouselProps> = ({ items, onItemClick, selectedId, onIndexChange }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const lastScrollTime = useRef(0);
    
    // Track window size for responsive logic
    const [windowSize, setWindowSize] = useState({ 
        width: typeof window !== 'undefined' ? window.innerWidth : 1200, 
        height: typeof window !== 'undefined' ? window.innerHeight : 800 
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!items || items.length === 0) return;
        const normalizedIndex = ((activeIndex % items.length) + items.length) % items.length;
        onIndexChange(normalizedIndex);
    }, [activeIndex, items, onIndexChange]);

    useEffect(() => {
        if (isDragging || selectedId) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => prev - 1); 
        }, 3500); 
        return () => clearInterval(interval);
    }, [isDragging, selectedId]);

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
        if (now - lastScrollTime.current < 500) return;

        if (Math.abs(e.deltaY) > 10 || Math.abs(e.deltaX) > 10) {
            if (e.deltaY > 0 || e.deltaX > 0) {
                setActiveIndex((prev) => prev + 1);
            } else {
                setActiveIndex((prev) => prev - 1);
            }
            lastScrollTime.current = now;
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className="flex items-center justify-center h-[80vh] w-full text-black opacity-40 uppercase text-xs tracking-widest">
                No items to display
            </div>
        );
    }

    const visibleRange = [-2, -1, 0, 1, 2];
    
    // Responsive Dimensions Logic
    // Mobile Breakpoint: < 768px (MD)
    const isMobile = windowSize.width < 768;

    // On Desktop: Base is height-driven (58.5vh) to maintain layout
    // On Mobile: Base is width-driven (75vw) to fill screen appropriately
    const itemBaseSize = isMobile 
        ? windowSize.width * 0.75 
        : windowSize.height * 0.585;
    
    const gapSize = isMobile
        ? windowSize.width * 0.05
        : windowSize.height * 0.02;

    return (
        <div 
            className="relative h-[80vh] w-full flex items-center justify-center perspective-1000 overflow-visible"
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
                        const item = items[getCyclicIndex(currentIndex, items.length)];
                        if (!item) return null;
                        
                        const isCenter = offset === 0;
                        const absOffset = Math.abs(offset);
                        
                        const x = offset * (itemBaseSize + gapSize); 
                        const scale = isCenter ? 1.15 : 1 - (absOffset * 0.12);
                        const opacity = isCenter ? 1 : 0.6 - (absOffset * 0.15);
                        const zIndex = 10 - absOffset;
                        const rotateY = offset * -10;

                        const isSelected = selectedId === item.id;

                        return (
                            <motion.div
                                key={currentIndex}
                                className="absolute flex flex-col items-center justify-center"
                                initial={{ x: x - 200, opacity: 0 }}
                                animate={{ 
                                    x: x, 
                                    scale: scale, 
                                    opacity: isSelected ? 0 : opacity, 
                                    zIndex: zIndex,
                                    rotateY: rotateY,
                                    filter: isCenter ? 'grayscale(0%)' : 'grayscale(100%) blur(2px)'
                                }}
                                exit={{ x: x + 200, opacity: 0 }} 
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 25,
                                    mass: 1
                                }}
                                style={{ transformStyle: 'preserve-3d' }}
                                onClick={() => isCenter && !isDragging && onItemClick(item)}
                            >
                                <motion.div 
                                    layoutId={`curation-item-${item.id}`}
                                    style={{ width: itemBaseSize }}
                                    className={`relative aspect-[3/4] bg-black/5 overflow-hidden shadow-2xl ${isCenter ? 'cursor-pointer pointer-events-auto z-30' : 'pointer-events-none'}`}
                                >
                                    {item.video ? (
                                        <video 
                                            src={item.video} 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline 
                                            className="w-full h-full object-cover"
                                            style={{ pointerEvents: 'none' }}
                                        />
                                    ) : (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    )}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};
