
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, translations } from '../utils/translations';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';
import { useContent } from '../context/ContentContext';

interface ContactSectionProps {
    language: Language;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ language }) => {
  const { getLocalizedConfig } = useContent();
  const config = getLocalizedConfig(language);
  const [time, setTime] = useState<string>('');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [activeSectionNum, setActiveSectionNum] = useState('01');
  const t = translations[language].contact;
  const commonT = translations[language].common;

  // Use dynamic content
  const socialLinks = config.socialLinks || [];
  const contactEmails = config.contactEmails || [];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
        <motion.div 
            className="min-h-[100dvh] w-screen overflow-y-auto md:h-screen md:overflow-hidden pt-32 pb-12 px-6 md:px-12 flex flex-col md:flex-row relative bg-[#d2cdc4]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
        {/* Left Column */}
        <div className="w-full md:w-[40%] flex flex-col justify-between md:pr-12 md:border-r border-[#2a1b1b]/10 pb-8 md:pb-0 h-auto md:h-full shrink-0">
            {/* Dynamic Footer Logo */}
            <div className="overflow-hidden flex items-center md:items-start flex-1 mb-8 md:mb-0">
                    <motion.img 
                        src={config.footerLogo}
                        alt="Imaginative 369"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                        className="w-full max-w-[85vw] md:max-w-[35vw] object-contain origin-center md:origin-left block"
                        style={{ filter: 'none', opacity: 1, mixBlendMode: 'normal' }}
                    />
            </div>

            <div className="flex flex-col justify-end mt-auto shrink-0">
                <div className="text-xs font-serif italic text-[#2a1b1b] opacity-60 mb-1">{commonT.localTime}</div>
                <div className="text-[12vw] md:text-[5vw] font-sans font-light text-[#2a1b1b] opacity-40 leading-none tracking-tight tabular-nums">
                    {time}
                </div>
            </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-[60%] flex flex-col justify-between md:pl-12 pt-12 md:pt-0 h-auto md:h-full overflow-visible md:overflow-hidden relative pb-40 md:pb-0">
            
            {/* Header Section - WhatsApp Link with Dynamic Icon */}
            <a 
                    href={`https://wa.me/${config.whatsappNumber}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 md:gap-[1.5vw] mb-8 md:mb-[2vh] shrink-0 group cursor-pointer"
                    style={{ textDecoration: 'none' }}
            >
                <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-serif text-[#2a1b1b] italic leading-none transition-colors duration-300 group-hover:text-[#FFFFFF]">
                    {t.sayHello}
                </h2>
                
                <motion.div 
                    className="relative w-[clamp(2.5rem,4vw,3.5rem)] h-[clamp(2.5rem,4vw,3.5rem)] flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    <img 
                            src={config.whatsappIcon}
                            alt="WhatsApp"
                            className="w-full h-full object-contain drop-shadow-md"
                    />
                </motion.div>
            </a>

            <div className="flex-1 flex flex-col justify-center space-y-8 md:space-y-[2vh] max-h-none md:max-h-[60vh] mb-12 md:mb-0">
                <div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 group"
                    onMouseEnter={() => setActiveSectionNum('01')}
                >
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#2a1b1b] opacity-50 self-baseline group-hover:opacity-100 transition-opacity">{t.getInTouch}</span>
                    <div className="col-span-2">
                        <div className="text-[clamp(0.8rem,1vw,0.9rem)] font-medium text-[#2a1b1b] mb-1 opacity-80">{t.bookConsultation}</div>
                        {contactEmails.map((item) => (
                             <a 
                                key={item.id}
                                href={`mailto:${item.email}`} 
                                className="block text-[clamp(1rem,1.5vw,1.25rem)] text-[#2a1b1b] hover:opacity-60 transition-opacity leading-tight"
                             >
                                {item.email}
                            </a>
                        ))}
                    </div>
                </div>

                <div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 group"
                    onMouseEnter={() => setActiveSectionNum('02')}
                >
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#2a1b1b] opacity-50 self-baseline group-hover:opacity-100 transition-opacity">{t.location}</span>
                    <div className="col-span-2 text-[clamp(1rem,1.5vw,1.25rem)] text-[#2a1b1b] leading-tight whitespace-pre-line">
                        Imaginative 369, No 03,<br/>River Side Rode,<br/>Badulla 90000,<br/>Sri Lanka
                    </div>
                </div>

                <div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-4 z-10 relative group"
                    onMouseEnter={() => setActiveSectionNum('03')}
                >
                    <span className="text-[10px] md:text-xs uppercase tracking-widest text-[#2a1b1b] opacity-50 self-baseline md:self-center group-hover:opacity-100 transition-opacity">{t.social}</span>
                    <div className="col-span-2 flex flex-row gap-6 items-center">
                        {socialLinks.map((link) => (
                             <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block transition-transform duration-300 hover:scale-110">
                                <img 
                                    src={link.icon} 
                                    alt={link.platform} 
                                    className="w-8 h-8 object-contain"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-end border-t border-[#2a1b1b]/10 pt-8 md:pt-[2vh] mt-auto text-[10px] md:text-xs text-[#2a1b1b] opacity-60 w-full shrink-0 relative md:absolute md:bottom-0 md:left-0 md:right-0 md:w-full md:pl-12 z-20">
                <div className="mb-2 md:mb-0 w-full md:w-auto uppercase">{config.agencyTagline || commonT.premierAgency}</div>
                <div className="flex gap-4 mb-4 md:mb-0">
                    <button 
                        onClick={() => setIsPrivacyOpen(true)}
                        className="underline hover:text-[#2a1b1b]/80 transition-colors text-left"
                    >
                        {translations[language].privacyPolicy.title}
                    </button>
                </div>
                <div className="text-2xl md:text-4xl text-[#2a1b1b] opacity-100 ml-4 font-sans absolute bottom-0 right-0 md:relative hidden md:block">
                    {activeSectionNum}
                </div>
            </div>
        </div>
        </motion.div>

        <AnimatePresence>
            {isPrivacyOpen && (
                <PrivacyPolicyModal 
                    isOpen={isPrivacyOpen} 
                    onClose={() => setIsPrivacyOpen(false)} 
                    origin="contact" 
                    language={language}
                />
            )}
        </AnimatePresence>
    </>
  );
};
