
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, CuratedItem, Order, SiteConfig, TrustedClient, PrintRate, FinishingRatesConfig } from '../types';
import { initialProjects, initialCuratedItems, initialConfig, initialClients, initialFinishingRates } from '../utils/defaults';
import { initialPrintRates } from '../utils/printRatesData';
import { Language } from '../utils/translations';
import { firestore } from '@/firebase';
import { doc, onSnapshot, setDoc, collection, writeBatch, deleteDoc, getDocs, query } from "firebase/firestore";

interface ContentContextType {
    projects: Project[];
    deleteProject: (id: number) => Promise<void>;
    curatedItems: CuratedItem[];
    setCuratedItems: (items: CuratedItem[]) => Promise<void>;
    orders: Order[];
    addOrder: (order: Order) => Promise<void>;
    config: SiteConfig;
    setConfig: (config: SiteConfig) => Promise<void>;
    trustedClients: TrustedClient[];
    setTrustedClients: (clients: TrustedClient[]) => Promise<void>;
    printRates: PrintRate[];
    setPrintRates: (rates: PrintRate[]) => Promise<void>;
    finishingRates: FinishingRatesConfig;
    setFinishingRates: (rates: FinishingRatesConfig) => Promise<void>;
    
    // Frontend Getters (Filtered by Visibility)
    getLocalizedProjects: (lang: Language) => Project[];
    getLocalizedConfig: (lang: Language) => SiteConfig;
    getVisibleCuratedItems: () => CuratedItem[];
    getVisibleTrustedClients: () => TrustedClient[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [projects, setProjectsState] = useState<Project[]>([]);
    const [curatedItems, setCuratedItemsState] = useState<CuratedItem[]>(initialCuratedItems);
    const [orders, setOrdersState] = useState<Order[]>([]);
    const [config, setConfigState] = useState<SiteConfig>(initialConfig);
    const [trustedClients, setTrustedClientsState] = useState<TrustedClient[]>(initialClients);
    const [printRates, setPrintRatesState] = useState<PrintRate[]>([]);
    const [finishingRates, setFinishingRatesState] = useState<FinishingRatesConfig>(initialFinishingRates);


    useEffect(() => {
        const contentDocRef = doc(firestore, "content", "main");
        const projectsColRef = collection(firestore, "projects");
        const printRatesColRef = collection(firestore, "printRates");

        // Listener for config, orders, etc. from the single doc
        const unsubContent = onSnapshot(contentDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setCuratedItemsState(data.curatedItems || initialCuratedItems);
                setOrdersState(data.orders || []);
                setConfigState(data.config || initialConfig);
                setTrustedClientsState(data.trustedClients || initialClients);
                setFinishingRatesState(data.finishingRates || initialFinishingRates);
            } else {
                // Initialize non-project content if it doesn't exist
                saveContent({
                    curatedItems: initialCuratedItems,
                    orders: [],
                    config: initialConfig,
                    trustedClients: initialClients,
                    finishingRates: initialFinishingRates,
                });
            }
        });

        // Listener for projects collection
        const unsubProjects = onSnapshot(projectsColRef, async (snapshot) => {
            if (snapshot.empty && initialProjects.length > 0) {
                console.log("Projects collection is empty. Seeding initial data...");
                try {
                    const batch = writeBatch(firestore);
                    initialProjects.forEach(project => {
                        const projectRef = doc(firestore, "projects", project.id.toString());
                        batch.set(projectRef, project);
                    });
                    await batch.commit();
                } catch (e) {
                    console.error("Error seeding projects:", e);
                }
            } else {
                const projectsData = snapshot.docs.map(doc => doc.data() as Project).sort((a, b) => a.id - b.id);
                setProjectsState(projectsData);
            }
        });

        // Listener for print rates collection
        const unsubPrintRates = onSnapshot(printRatesColRef, async (snapshot) => {
            if (snapshot.empty && initialPrintRates.length > 0) {
                 console.log("Print rates collection is empty. Seeding initial data...");
                try {
                    const batch = writeBatch(firestore);
                    initialPrintRates.forEach(rate => {
                        const rateRef = doc(firestore, "printRates", rate.id);
                        batch.set(rateRef, rate);
                    });
                    await batch.commit();
                } catch (e) {
                    console.error("Error seeding print rates:", e);
                }
            } else {
                const ratesData = snapshot.docs.map(doc => doc.data() as PrintRate);
                setPrintRatesState(ratesData);
            }
        });


        return () => {
            unsubContent();
            unsubProjects();
            unsubPrintRates();
        };
    }, []);

    const saveContent = async (data: any) => {
        const contentDocRef = doc(firestore, "content", "main");
        const cleanData = (obj: any): any => {
            if (obj === null || obj === undefined) return null;
            if (Array.isArray(obj)) return obj.map(item => cleanData(item));
            if (typeof obj === 'object' && !(obj instanceof File)) {
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
    
    const deleteProject = async (id: number) => {
        await deleteDoc(doc(firestore, "projects", id.toString()));
    };

    const setCuratedItems = async (i: CuratedItem[]) => {
        await saveContent({ curatedItems: i });
    };

    const addOrder = async (order: Order) => {
        const newOrders = [order, ...orders];
        await saveContent({ orders: newOrders });
    };

    const setConfig = async (c: SiteConfig) => {
        await saveContent({ config: c });
    };

    const setTrustedClients = async (c: TrustedClient[]) => {
        await saveContent({ trustedClients: c });
    };
    
    const setPrintRates = async (rates: PrintRate[]) => {
        try {
            const batch = writeBatch(firestore);
            const ratesCollectionRef = collection(firestore, "printRates");
            
            const querySnapshot = await getDocs(query(ratesCollectionRef));
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });

            rates.forEach(rate => {
                const docRef = doc(ratesCollectionRef, rate.id);
                batch.set(docRef, rate);
            });
            
            await batch.commit();
        } catch (error) {
            console.error("Error updating print rates:", error);
            throw error;
        }
    };

    const setFinishingRates = async (rates: FinishingRatesConfig) => {
        await saveContent({ finishingRates: rates });
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
            deleteProject,
            curatedItems,
            setCuratedItems,
            orders,
            addOrder,
            config,
            setConfig,
            trustedClients,
            setTrustedClients,
            printRates,
            setPrintRates,
            finishingRates,
            setFinishingRates,
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
