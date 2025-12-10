
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Loader } from './components/Loader';
import { Navbar } from './components/Navbar';
import { WorkSection } from './components/WorkSection';
import { AboutSection } from './components/AboutSection';
import { CurationSection } from './components/CurationSection';
import { ContactSection } from './components/ContactSection';
import { Page } from './types';
import { Language } from './utils/translations';
import { ContentProvider } from './context/ContentContext';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<Omit<Page, 'admin'>>('work');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isDetailView, setIsDetailView] = useState(false);
  
  const [language, setLanguage] = useState<Language>(() => {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('i369-language') : null;
      return (saved as Language) || 'en';
  });

  const bgColors: Record<Omit<Page, 'admin'>, string> = {
    work: '#353535',
    about: '#FFFFFF',
    curation: '#f5f5f0',
    contact: '#d2cdc4'
  };

  const navTextColors: Record<Omit<Page, 'admin'>, string> = {
    work: '#FFFFFF',
    about: '#000000',
    curation: '#1a1a1a',
    contact: '#2a1b1b'
  };

  const handleLanguageSelect = (lang: Language) => {
      setLanguage(lang);
      localStorage.setItem('i369-language', lang);
  };

  const handleLoaderComplete = () => {
      setLoading(false);
      setTimeout(() => setIsFirstLoad(false), 1000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const currentLang = language || 'en';

  return (
    <ContentProvider>
        <div 
            className="min-h-screen font-sans selection:bg-white selection:text-black transition-colors duration-1000 ease-in-out"
            style={{ backgroundColor: bgColors[page] }}
        >
        <AnimatePresence>
            {loading && (
                <Loader 
                    key="loader" 
                    onComplete={handleLoaderComplete} 
                    initialLanguage={language}
                    onLanguageSelect={handleLanguageSelect}
                />
            )}
        </AnimatePresence>

        <main className="relative z-0">
            <Navbar 
                activePage={page} 
                setPage={setPage} 
                textColor={navTextColors[page]} 
                isFirstLoad={isFirstLoad}
                language={currentLang}
                isDetailView={isDetailView}
            />
            
            <AnimatePresence mode='wait'>
                {page === 'work' && (
                    <WorkSection 
                        key="work" 
                        isFirstLoad={isFirstLoad} 
                        language={currentLang} 
                        onLanguageChange={handleLanguageSelect}
                        onDetailViewChange={setIsDetailView}
                    />
                )}
                {page === 'about' && <AboutSection key="about" language={currentLang} />}
                {page === 'curation' && <CurationSection key="curation" language={currentLang} />}
                {page === 'contact' && <ContactSection key="contact" language={currentLang} />}
            </AnimatePresence>
        </main>
        </div>
    </ContentProvider>
  );
};

export default App;
