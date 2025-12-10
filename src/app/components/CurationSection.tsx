
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CuratedItem } from '../types';
import { Language, translations } from '../utils/translations';
import { CurationCarousel } from './curation/CurationCarousel';
import { CurationLightbox } from './curation/CurationLightbox';
import { useContent } from '../context/ContentContext';

interface CurationSectionProps {
    language: Language;
}

export const CurationSection: React.FC<CurationSectionProps> = ({ language }) => {
  const t = translations[language].curation;
  const { getVisibleCuratedItems, getLocalizedConfig } = useContent();
  const config = getLocalizedConfig(language);
  const items = getVisibleCuratedItems();
  const [selectedItem, setSelectedItem] = useState<CuratedItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
  }, []);

  const total = items.length;
  const progressPct = total > 1 ? Math.round((currentIndex / (total - 1)) * 100) : 100;
  const formattedProgress = progressPct < 10 ? `0${progressPct}` : `${progressPct}`;
  
  const itemNum = currentIndex + 1;
  const formattedItemNum = itemNum < 10 ? `00${itemNum}` : itemNum < 100 ? `0${itemNum}` : `${itemNum}`;

  return (
    <motion.div 
        className="h-screen w-screen relative overflow-hidden flex flex-col justify-between bg-[#f5f5f0]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
    >
        <div className="fixed top-[12vh] left-[5vw] z-40 text-[#1a1a1a] pointer-events-none">
            <div className="text-[1.5vh] uppercase tracking-widest opacity-60 font-medium">
                [ {formattedProgress} ]
            </div>
        </div>

        <div className="fixed top-[12vh] right-[5vw] z-40 text-[#1a1a1a] pointer-events-none text-right">
            <div className="text-[3vh] font-sans mb-1 leading-none">
                {formattedItemNum}
            </div>
        </div>

        <motion.div
            className="w-full h-full flex flex-col justify-center items-center"
            variants={{
                idle: { scale: 1, opacity: 1, filter: "blur(0px)", transformPerspective: 1000, translateZ: 0 },
                active: { scale: 0.92, opacity: 0.4, filter: "blur(12px)", transformPerspective: 1000, translateZ: -200 }
            }}
            animate={selectedItem ? "active" : "idle"}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "center center" }}
        >
            <div className="flex-1 w-full flex items-center justify-center relative mt-[5vh]">
                <CurationCarousel 
                    items={items} 
                    onItemClick={setSelectedItem}
                    selectedId={selectedItem?.id}
                    onIndexChange={setCurrentIndex}
                />
            </div>

            <div className="text-center z-10 pointer-events-none pb-[5vh] w-full px-6">
                <h2 className="text-[clamp(1.65rem,4.4vh,3.3rem)] font-serif text-[#1a1a1a] mb-[1vh] tracking-tight pointer-events-auto leading-none">
                    {t.title}
                </h2>
                <p className="max-w-[80vw] md:max-w-[50vw] mx-auto text-[clamp(0.66rem,1.32vh,0.99rem)] font-sans text-[#1a1a1a] leading-relaxed pointer-events-auto opacity-70">
                    {config.curationIntro || t.desc}
                </p>
            </div>
        </motion.div>

         <AnimatePresence>
            {selectedItem && (
                <CurationLightbox 
                    items={items}
                    initialItem={selectedItem} 
                    onClose={() => setSelectedItem(null)} 
                />
            )}
         </AnimatePresence>
    </motion.div>
  );
};
