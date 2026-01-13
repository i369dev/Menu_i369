
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, CuratedItem, Order, SiteConfig, TrustedClient } from '../types';
import { initialProjects, initialCuratedItems, initialConfig, initialClients } from '../utils/defaults';
import { Language } from '../utils/translations';
import { firestore } from '../../firebase';
import { doc, onSnapshot, setDoc } from "firebase/firestore";

interface ContentContextType {
    projects: Project[];
    setProjects: (projects: Project[]) => Promise<void>;
    deleteProject: (id: number) => Promise<void>;
    curatedItems: CuratedItem[];
    setCuratedItems: (items: CuratedItem[]) => Promise<void>;
    orders: Order[];
    addOrder: (order: Order) => Promise<void>;
    config: SiteConfig;
    setConfig: (config: SiteConfig) => Promise<void>;
    trustedClients: TrustedClient[];
    setTrustedClients: (clients: TrustedClient[]) => Promise<void>;
    
    // Frontend Getters (Filtered by Visibility)
    getLocalizedProjects: (lang: Language) => Project[];
    getLocalizedConfig: (lang: Language) => SiteConfig;
    getVisibleCuratedItems: () => CuratedItem[];
    getVisibleTrustedClients: () => TrustedClient[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjectsState] = useState<Project[]>(initialProjects);
    const [curatedItems, setCuratedItemsState] = useState<CuratedItem[]>(initialCuratedItems);
    const [orders, setOrdersState] = useState<Order[]>([]);
    const [config, setConfigState] = useState<SiteConfig>(initialConfig);
    const [trustedClients, setTrustedClientsState] = useState<TrustedClient[]>(initialClients);

    const contentDocRef = doc(firestore, "content", "main");

    useEffect(() => {
        const unsubscribe = onSnapshot(contentDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setProjectsState(data.projects || initialProjects);
                setCuratedItemsState(data.curatedItems || initialCuratedItems);
                setOrdersState(data.orders || []);
                setConfigState(data.config || initialConfig);
                setTrustedClientsState(data.trustedClients || initialClients);
            } else {
                // Initialize document if it doesn't exist
                saveContent({
                    projects: initialProjects,
                    curatedItems: initialCuratedItems,
                    orders: [],
                    config: initialConfig,
                    trustedClients: initialClients
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const saveContent = async (data: any) => {
        const cleanData = (obj: any): any => {
            if (obj === null || obj === undefined) return null;
            if (Array.isArray(obj)) return obj.map(item => cleanData(item));
            if (typeof obj === 'object') {
                const newObj: { [key: string]: any } = {};
                for (const key in obj) {
                    if (obj[key] !== undefined) {
                        newObj[key] = cleanData(obj[key]);
                    }
                }
                return newObj;
            }
            return obj;
        };

        try {
            await setDoc(contentDocRef, cleanData(data), { merge: true });
        } catch (error) {
            console.error("Error saving content: ", error);
        }
    };

    const setProjects = async (p: Project[]) => {
        setProjectsState(p);
        await saveContent({ projects: p });
    };
    
    const deleteProject = async (id: number) => {
        const updatedProjects = projects.filter(p => p.id !== id);
        setProjectsState(updatedProjects);
        await saveContent({ projects: updatedProjects });
    };

    const setCuratedItems = async (i: CuratedItem[]) => {
        setCuratedItemsState(i);
        await saveContent({ curatedItems: i });
    };

    const addOrder = async (order: Order) => {
        const newOrders = [order, ...orders];
        setOrdersState(newOrders);
        await saveContent({ orders: newOrders });
    };

    const setConfig = async (c: SiteConfig) => {
        setConfigState(c);
        await saveContent({ config: c });
    };

    const setTrustedClients = async (c: TrustedClient[]) => {
        setTrustedClientsState(c);
        await saveContent({ trustedClients: c });
    };

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
