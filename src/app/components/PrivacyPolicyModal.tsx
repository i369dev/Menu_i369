
import React from 'react';
import { motion } from 'framer-motion';
import { Language, translations } from '../utils/translations';
import { useContent } from '../context/ContentContext';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    origin: 'contact' | 'order';
    language: Language;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, origin, language }) => {
    const { getLocalizedConfig } = useContent();
    const config = getLocalizedConfig(language);
    const t = translations[language].privacyPolicy;

    if (!isOpen) return null;

    return (
        <motion.div 
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" onClick={onClose} />
            
            {/* Modal Content */}
            <motion.div 
                className="relative w-full max-w-2xl bg-[#1a1a1a] text-white/90 p-8 md:p-16 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar"
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
                {/* Header / Nav */}
                <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6 sticky top-0 bg-[#1a1a1a] z-10">
                    <button 
                        onClick={onClose}
                        className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2"
                    >
                        <span>←</span>
                        {origin === 'contact' ? t.backContact : t.backOrder}
                    </button>
                    <div className="text-xs uppercase tracking-widest opacity-40">
                        {t.legal}
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8 text-sm md:text-base font-light leading-relaxed opacity-80">
                    <h2 className="text-3xl font-serif italic text-white opacity-100 mb-8">{t.title}</h2>
                    
                    <section>
                        <h3 className="text-xs uppercase tracking-widest text-white opacity-60 mb-4">{t.introTitle}</h3>
                        <p className="whitespace-pre-line">{config.pp_introText}</p>
                    </section>

                    <section>
                        <h3 className="text-xs uppercase tracking-widest text-white opacity-60 mb-4">{t.dataTitle}</h3>
                        <p className="whitespace-pre-line">{config.pp_dataText}</p>
                        {config.pp_dataList && config.pp_dataList.length > 0 && (
                            <ul className="list-disc pl-4 mt-2 space-y-1 opacity-80">
                                {config.pp_dataList.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        )}
                    </section>

                    <section>
                        <h3 className="text-xs uppercase tracking-widest text-white opacity-60 mb-4">{t.usageTitle}</h3>
                        <p className="whitespace-pre-line">{config.pp_usageText}</p>
                        {config.pp_usageList && config.pp_usageList.length > 0 && (
                            <ul className="list-disc pl-4 mt-2 space-y-1 opacity-80">
                                {config.pp_usageList.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        )}
                    </section>

                    <section>
                        <h3 className="text-xs uppercase tracking-widest text-white opacity-60 mb-4">{t.thirdPartyTitle}</h3>
                        <p className="whitespace-pre-line">{config.pp_thirdPartyText}</p>
                    </section>

                    <section>
                        <h3 className="text-xs uppercase tracking-widest text-white opacity-60 mb-4">{t.contactTitle}</h3>
                        <div className="whitespace-pre-line">
                            {config.pp_contactText}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-white/10 text-[10px] uppercase tracking-widest opacity-40">
                    {t.footer}
                </div>

            </motion.div>
        </motion.div>
    );
};
