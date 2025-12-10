
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CuratedItem } from '../../types';

interface CurationLightboxProps {
    items: CuratedItem[];
    initialItem: CuratedItem;
    onClose: () => void;
}

export const CurationLightbox: React.FC<CurationLightboxProps> = ({ items, initialItem, onClose }) => {
    // Find initial index
    const initialIndex = items.findIndex(i => i.id === initialItem.id);
    const [index, setIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
    const [direction, setDirection] = useState(0);

    const currentItem = items[index];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') nextItem();
            if (e.key === 'ArrowLeft') prevItem();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [index]);

    const nextItem = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setDirection(1);
        setIndex((prev) => (prev + 1) % items.length);
    };

    const prevItem = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setDirection(-1);
        setIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop Fade In */}
            <motion.div 
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={onClose}
            />
            
            {/* Top Controls */}
            <motion.div 
                className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-30 text-white pointer-events-none"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex flex-col">
                    <span className="text-lg font-serif italic">{currentItem.title}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-60">{currentItem.artist}</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-xs tracking-widest opacity-50">{index + 1} / {items.length}</span>
                    <button 
                        onClick={onClose}
                        className="pointer-events-auto text-sm font-sans tracking-widest uppercase hover:opacity-50 transition-opacity bg-white/10 px-6 py-2 rounded-full"
                    >
                        Close
                    </button>
                </div>
            </motion.div>

            {/* Navigation Areas */}
            <div 
                className="absolute inset-y-0 left-0 w-[15vw] z-20 cursor-pointer flex items-center justify-start pl-8 group"
                onClick={prevItem}
            >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 bg-black/40 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                    </svg>
                </div>
            </div>
            <div 
                className="absolute inset-y-0 right-0 w-[15vw] z-20 cursor-pointer flex items-center justify-end pr-8 group"
                onClick={nextItem}
            >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 bg-black/40 text-white">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M5 12H19M19 12L12 5M19 12L19 12" />
                    </svg>
                </div>
            </div>

            {/* Content Container */}
            <div className="w-full h-full max-w-7xl max-h-[85vh] relative flex items-center justify-center p-4 md:p-12 pointer-events-none z-10">
                 <AnimatePresence mode="wait" custom={direction}>
                    <motion.div 
                        key={currentItem.id}
                        layoutId={index === 0 ? `curation-item-${currentItem.id}` : undefined} // Sync layout only if it was the entry item
                        className="relative w-full h-full flex items-center justify-center"
                        initial={{ opacity: 0, x: direction * 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction * -50 }}
                        transition={{
                            type: "spring",
                            stiffness: 300, 
                            damping: 30,
                            mass: 1
                        }}
                    >
                        {currentItem.video ? (
                            <video 
                                src={currentItem.video} 
                                controls 
                                autoPlay 
                                loop
                                className="max-w-full max-h-full object-contain pointer-events-auto shadow-2xl"
                            />
                        ) : (
                            <img 
                                src={currentItem.image} 
                                alt={currentItem.title} 
                                className="max-w-full max-h-full object-contain shadow-2xl" 
                            />
                        )}
                    </motion.div>
                 </AnimatePresence>
            </div>
        </div>
    );
};
