
import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ProjectManager } from './tabs/ProjectManager';
import { CurationManager } from './tabs/CurationManager';
import { AboutManager } from './tabs/AboutManager';
import { ClientManager } from './tabs/ClientManager';
import { SettingsManager } from './tabs/SettingsManager';
import { OrderManager } from './tabs/OrderManager';
import { AnalyticsManager } from './tabs/AnalyticsManager';
import { QuotationManager } from './tabs/QuotationManager';
import { QuotationTemplateManager } from './tabs/QuotationTemplateManager';
import { PrintRatesManager } from './tabs/PrintRatesManager';
import { FinishingRatesManager } from './tabs/FinishingRatesManager';
import { useAuth } from '@/context/AuthContext';
import { LoginView } from './LoginView';
import { UserManager } from './tabs/UserManager';
import { Card } from './ui/AdminShared';
import { QuotationHistory } from './tabs/QuotationHistory';

interface AdminDashboardProps {
    onExit: () => void;
}

const ALL_TABS = ['Analytics', 'Projects', 'Quote Generator', 'Quotation History', 'Quote Template', 'Print Rates', 'Finishing Rates', 'Curation', 'About', 'Trusted By', 'Settings', 'Users & Roles', 'Orders'] as const;
type Tab = typeof ALL_TABS[number];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
    const { user, appUser, loading } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>('Analytics');

    const visibleTabs = useMemo(() => {
        if (!appUser) return [];
        if (appUser.role === 'Super Admin') {
            return ALL_TABS;
        }
        // Filter by permissions
        return ALL_TABS.filter(tab => appUser.permissions?.includes(tab));
    }, [appUser]);

    useEffect(() => {
        // If the active tab is no longer visible (e.g. permissions changed), default to first visible tab.
        if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
            setActiveTab(visibleTabs[0]);
        }
    }, [visibleTabs, activeTab]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading Authentication...</p>
            </div>
        );
    }

    if (!user || !appUser) {
        return <LoginView onExit={onExit} />;
    }

    const renderContent = () => {
        if (!visibleTabs.includes(activeTab)) {
            return (
                <Card>
                    <h3 className="font-bold text-lg">Access Denied</h3>
                    <p>You do not have permission to view this page.</p>
                </Card>
            );
        }
        switch (activeTab) {
            case 'Analytics': return <AnalyticsManager />;
            case 'Projects': return <ProjectManager />;
            case 'Quote Generator': return <QuotationManager />;
            case 'Quotation History': return <QuotationHistory />;
            case 'Quote Template': return <QuotationTemplateManager />;
            case 'Print Rates': return <PrintRatesManager />;
            case 'Finishing Rates': return <FinishingRatesManager />;
            case 'Curation': return <CurationManager />;
            case 'About': return <AboutManager />;
            case 'Trusted By': return <ClientManager />;
            case 'Settings': return <SettingsManager />;
            case 'Users & Roles': return <UserManager />;
            case 'Orders': return <OrderManager />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col md:flex-row overflow-hidden">
            <Sidebar 
                tabs={visibleTabs} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onExit={onExit}
            />
            <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen scroll-smooth bg-gray-50 relative">
                {renderContent()}
            </main>
        </div>
    );
};
