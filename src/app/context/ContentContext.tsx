
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, CuratedItem, Order, SiteConfig, TrustedClient } from '../types';
import { initialProjects, initialCuratedItems, initialConfig, initialClients } from '../utils/defaults';
import { Language } from '../utils/translations';

interface ContentContextType {
    projects: Project[];
    setProjects: (projects: Project[]) => void;
    deleteProject: (id: number) => void;
    curatedItems: CuratedItem[];
    setCuratedItems: (items: CuratedItem[]) => void;
    orders: Order[];
    addOrder: (order: Order) => void;
    config: SiteConfig;
    setConfig: (config: SiteConfig) => void;
    trustedClients: TrustedClient[];
    setTrustedClients: (clients: TrustedClient[]) => void;
    
    // Frontend Getters (Filtered by Visibility)
    getLocalizedProjects: (lang: Language) => Project[];
    getLocalizedConfig: (lang: Language) => SiteConfig;
    getVisibleCuratedItems: () => CuratedItem[];
    getVisibleTrustedClients: () => TrustedClient[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjectsState] = useState<Project[]>(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('i369-cms-projects') : null;
        return saved ? JSON.parse(saved) : initialProjects;
    });

    const [curatedItems, setCuratedItemsState] = useState<CuratedItem[]>(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('i369-cms-curation') : null;
        return saved ? JSON.parse(saved) : initialCuratedItems;
    });

    const [orders, setOrdersState] = useState<Order[]>(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('i369-cms-orders') : null;
        return saved ? JSON.parse(saved) : [];
    });

    const [config, setConfigState] = useState<SiteConfig>(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('i369-cms-config') : null;
        return saved ? JSON.parse(saved) : initialConfig;
    });

    const [trustedClients, setTrustedClientsState] = useState<TrustedClient[]>(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('i369-cms-clients') : null;
        return saved ? JSON.parse(saved) : initialClients;
    });

    useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('i369-cms-projects', JSON.stringify(projects)); }, [projects]);
    useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('i369-cms-curation', JSON.stringify(curatedItems)); }, [curatedItems]);
    useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('i369-cms-orders', JSON.stringify(orders)); }, [orders]);
    useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('i369-cms-config', JSON.stringify(config)); }, [config]);
    useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('i369-cms-clients', JSON.stringify(trustedClients)); }, [trustedClients]);

    const setProjects = (p: Project[]) => setProjectsState(p);
    const deleteProject = (id: number) => setProjectsState(prevProjects => prevProjects.filter(p => p.id !== id));
    const setCuratedItems = (i: CuratedItem[]) => setCuratedItemsState(i);
    const addOrder = (order: Order) => setOrdersState(prev => [order, ...prev]);
    const setConfig = (c: SiteConfig) => setConfigState(c);
    const setTrustedClients = (c: TrustedClient[]) => setTrustedClientsState(c);

    // Filter projects for frontend view (isVisible !== false)
    const getLocalizedProjects = (lang: Language) => {
        const visibleProjects = projects.filter(p => p.isVisible !== false);
        
        if (lang === 'en') return visibleProjects;
        return visibleProjects.map(p => ({
            ...p,
            subtitle: (lang === 'si' && p.subtitle_si) ? p.subtitle_si : (lang === 'ta' && p.subtitle_ta) ? p.subtitle_ta : p.subtitle,
            description: (lang === 'si' && p.description_si) ? p.description_si : (lang === 'ta' && p.description_ta) ? p.description_ta : p.description,
            services: (lang === 'si' && p.services_si && p.services_si.length > 0) ? p.services_si : (lang === 'ta' && p.services_ta && p.services_ta.length > 0) ? p.services_ta : p.services
        }));
    };

    // Filter config lists (Team, Social) for frontend view
    const getLocalizedConfig = (lang: Language): SiteConfig => {
        const visibleTeam = (config.teamMembers || []).filter(m => m.isVisible !== false);
        const visibleSocial = (config.socialLinks || []).filter(s => s.isVisible !== false);

        const baseConfig = { ...config, teamMembers: visibleTeam, socialLinks: visibleSocial };

        if (lang === 'en') return baseConfig;
        
        return {
            ...baseConfig,
            aboutDescription: (lang === 'si' && config.aboutDescription_si) ? config.aboutDescription_si : (lang === 'ta' && config.aboutDescription_ta) ? config.aboutDescription_ta : config.aboutDescription,
            aboutSpatial: (lang === 'si' && config.aboutSpatial_si) ? config.aboutSpatial_si : (lang === 'ta' && config.aboutSpatial_ta) ? config.aboutSpatial_ta : config.aboutSpatial,
            curationIntro: (lang === 'si' && config.curationIntro_si) ? config.curationIntro_si : (lang === 'ta' && config.curationIntro_ta) ? config.curationIntro_ta : config.curationIntro,
            agencyTagline: (lang === 'si' && config.agencyTagline_si) ? config.agencyTagline_si : (lang === 'ta' && config.agencyTagline_ta) ? config.agencyTagline_ta : config.agencyTagline,
            
            pp_introText: (lang === 'si' && config.pp_introText_si) ? config.pp_introText_si : (lang === 'ta' && config.pp_introText_ta) ? config.pp_introText_ta : config.pp_introText,
            pp_dataText: (lang === 'si' && config.pp_dataText_si) ? config.pp_dataText_si : (lang === 'ta' && config.pp_dataText_ta) ? config.pp_dataText_ta : config.pp_dataText,
            pp_dataList: (lang === 'si' && config.pp_dataList_si && config.pp_dataList_si.length > 0) ? config.pp_dataList_si : (lang === 'ta' && config.pp_dataList_ta && config.pp_dataList_ta.length > 0) ? config.pp_dataList_ta : config.pp_dataList,
            pp_usageText: (lang === 'si' && config.pp_usageText_si) ? config.pp_usageText_si : (lang === 'ta' && config.pp_usageText_ta) ? config.pp_usageText_ta : config.pp_usageText,
            pp_usageList: (lang === 'si' && config.pp_usageList_si && config.pp_usageList_si.length > 0) ? config.pp_usageList_si : (lang === 'ta' && config.pp_usageList_ta && config.pp_usageList_ta.length > 0) ? config.pp_usageList_ta : config.pp_usageList,
            pp_thirdPartyText: (lang === 'si' && config.pp_thirdPartyText_si) ? config.pp_thirdPartyText_si : (lang === 'ta' && config.pp_thirdPartyText_ta) ? config.pp_thirdPartyText_ta : config.pp_thirdPartyText,
            pp_contactText: (lang === 'si' && config.pp_contactText_si) ? config.pp_contactText_si : (lang === 'ta' && config.pp_contactText_ta) ? config.pp_contactText_ta : config.pp_contactText,

            teamMembers: visibleTeam.map(m => ({
                ...m,
                role: (lang === 'si' && m.role_si) ? m.role_si : (lang === 'ta' && m.role_ta) ? m.role_ta : m.role,
                bio: (lang === 'si' && m.bio_si) ? m.bio_si : (lang === 'ta' && m.bio_ta) ? m.bio_ta : m.bio,
            }))
        };
    };

    const getVisibleCuratedItems = () => curatedItems.filter(i => i.isVisible !== false);
    const getVisibleTrustedClients = () => trustedClients.filter(c => c.isVisible !== false);

    return (
        <ContentContext.Provider value={{
            projects,
            setProjects,
            deleteProject,
            curatedItems,
            setCuratedItems,
            orders,
            addOrder,
            config,
            setConfig,
            trustedClients,
            setTrustedClients,
            getLocalizedProjects,
            getLocalizedConfig,
            getVisibleCuratedItems,
            getVisibleTrustedClients
        }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error("useContent must be used within a ContentProvider");
    return context;
};
