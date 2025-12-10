
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Language, translations } from '../utils/translations';
import { TrustedByCarousel } from './about/TrustedByCarousel';
import { useContent } from '../context/ContentContext';

interface AboutSectionProps {
    language: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  const { getLocalizedConfig } = useContent();
  const config = getLocalizedConfig(language); // localized config
  const t = translations[language].about;
  const commonT = translations[language].common;
  const progressRef = useRef<HTMLSpanElement>(null);
  const socialContainerRef = useRef<HTMLDivElement>(null);
  const socialIconsRef = useRef<(HTMLImageElement | null)[]>([]);

  // Use dynamic content from config
  const socialLinks = config.socialLinks || [];
  const teamMembers = config.teamMembers || [];
  
  useEffect(() => {
      let rafId: number;
      const handleScroll = () => {
          if (progressRef.current) {
              rafId = requestAnimationFrame(() => {
                  if (!progressRef.current) return;
                  const scrollTop = window.scrollY;
                  const docHeight = document.body.scrollHeight;
                  const winHeight = window.innerHeight;
                  const maxScroll = docHeight - winHeight;
                  let pct = 0;
                  if (maxScroll > 0) {
                      pct = (scrollTop / maxScroll) * 100;
                  }
                  pct = Math.min(100, Math.max(0, Math.round(pct)));
                  const formattedPct = pct < 10 ? `0${pct}` : `${pct}`;
                  progressRef.current!.innerText = `[ ${formattedPct} ]`;
              });
          }
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
          window.removeEventListener('scroll', handleScroll);
          cancelAnimationFrame(rafId);
      };
  }, []);

  useEffect(() => {
      // Cast window to any to access gsap and ScrollTrigger which are loaded globally or via script tag
      const win = window as any;
      if (typeof window !== 'undefined' && win.gsap && win.ScrollTrigger && socialContainerRef.current) {
          win.gsap.registerPlugin(win.ScrollTrigger);
          const icons = socialIconsRef.current.filter(Boolean);
          if (icons.length > 0) {
             win.gsap.fromTo(icons, 
                { x: -window.innerWidth, rotation: -720 },
                {
                    x: 0,
                    rotation: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: socialContainerRef.current,
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
             );
          }
      }
      return () => {
        if (win.ScrollTrigger) {
            const triggers = win.ScrollTrigger.getAll();
            triggers.forEach((trigger: any) => trigger.kill());
        }
      };
  }, [socialLinks]); // Re-run if social links change

  return (
    <motion.div 
        className="min-h-screen pt-32 pb-12 px-6 md:px-12 flex flex-col relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
    >
        <div className="fixed top-28 right-6 md:right-12 z-40 pointer-events-none flex flex-col items-end text-[#555555]">
             <span ref={progressRef} className="text-xs font-sans tracking-widest opacity-60">
                [ 00 ]
             </span>
        </div>

        <div className="w-full max-w-[1920px] mx-auto mb-16 md:mb-24">
             <motion.h1 
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="text-[12vw] leading-[0.9] font-serif text-black text-center border-b border-black/10 pb-8 origin-bottom uppercase"
             >
                {t.headerTitle.split(' ').map((line, i) => (
                    <span key={i} className="block">{line}</span>
                ))}
             </motion.h1>
        </div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32 items-center">
             <div className="flex flex-col items-start text-left order-2 lg:order-1">
                 <div className="text-xs uppercase tracking-widest text-[#1a1a1a] opacity-70 mb-8">
                     {t.subtitle.replace(/[()]/g, '')}
                 </div>
                 <div className="w-full max-w-2xl">
                     <p className="text-2xl md:text-4xl font-sans font-light leading-tight text-black mb-12 whitespace-pre-line">
                         {config.aboutDescription || t.intro}
                     </p>
                     <div className="text-sm font-sans leading-relaxed text-[#1a1a1a] max-w-xl">
                        {config.aboutSpatial || t.spatial}
                     </div>

                     <div ref={socialContainerRef} className="flex gap-8 mt-8 items-center overflow-visible">
                        {socialLinks.map((link, index) => (
                             <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="block transition-transform duration-300 hover:scale-110">
                                <img 
                                    ref={el => { socialIconsRef.current[index] = el; }}
                                    src={link.icon} 
                                    alt={link.platform} 
                                    className="w-8 h-8 object-contain"
                                />
                            </a>
                        ))}
                     </div>
                 </div>
             </div>

             <div className="flex justify-center lg:justify-end items-center order-1 lg:order-2 mb-12 lg:mb-0">
                 <img 
                    src={config.aboutLogo} 
                    alt="Company Logo" 
                    className="w-full max-w-xl object-contain opacity-100"
                    style={{ filter: 'none', mixBlendMode: 'normal' }}
                />
             </div>
        </div>

        {/* Dynamic Team Members Section */}
        {teamMembers.map((member, i) => (
             <div key={member.id} className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-32 items-center">
                 {/* Alternating Layout */}
                 {i % 2 === 0 ? (
                     <>
                        <div className="aspect-[3/4] overflow-hidden bg-black/10">
                             <img src={member.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={member.name} />
                             <span className="block text-[10px] mt-2 uppercase tracking-widest text-black">{member.figLabel}</span>
                        </div>
                        <div className="md:col-span-2 flex flex-col justify-center text-left pl-4 md:pl-12">
                             <h3 className="text-xs uppercase tracking-widest text-[#1a1a1a] opacity-60 mb-6">{member.role}</h3>
                             <h2 className="text-4xl md:text-5xl font-serif text-black mb-8 leading-none">{member.name}</h2>
                             <p className="text-lg md:text-xl font-sans font-light leading-relaxed text-black opacity-90 max-w-2xl whitespace-pre-line">
                                {member.bio}
                             </p>
                        </div>
                     </>
                 ) : (
                     <>
                         <div className="md:col-span-2 flex flex-col justify-center text-right pr-4 md:pr-12 order-2 md:order-1">
                             <h3 className="text-xs uppercase tracking-widest text-[#1a1a1a] opacity-60 mb-6">{member.role}</h3>
                             <h2 className="text-4xl md:text-5xl font-serif text-black mb-8 leading-none">{member.name}</h2>
                             <p className="text-lg md:text-xl font-sans font-light leading-relaxed text-black opacity-90 max-w-2xl ml-auto whitespace-pre-line">
                                {member.bio}
                             </p>
                         </div>
                         <div className="aspect-[3/4] overflow-hidden bg-black/10 order-1 md:order-2">
                             <img src={member.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" alt={member.name} />
                             <span className="block text-[10px] mt-2 uppercase tracking-widest text-black text-right">{member.figLabel}</span>
                         </div>
                     </>
                 )}
             </div>
        ))}

        <div className="w-full border-t border-black/20 pt-12 pb-24 mt-12 overflow-hidden">
             <h3 className="text-xs uppercase tracking-widest text-[#1a1a1a] opacity-60 mb-24 text-center">{commonT.trustedBy}</h3>
             <TrustedByCarousel />
        </div>
    </motion.div>
  );
};
