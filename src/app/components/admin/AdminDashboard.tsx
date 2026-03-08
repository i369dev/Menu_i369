
import React, { useState } from 'react';
import { LoginView } from './LoginView';
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

interface AdminDashboardProps {
    onExit: () => void;
}

const Tabs = ['Analytics', 'Projects', 'Quote Generator', 'Quote Template', 'Curation', 'About', 'Trusted By', 'Settings', 'Orders'] as const;
type Tab = typeof Tabs[number];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('Analytics');

    const handleLogin = () => {
        setIsAuthenticated(true);
        setActiveTab('Analytics');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setActiveTab('Analytics');
    };

    if (!isAuthenticated) {
        return <LoginView onLogin={handleLogin} onExit={onExit} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col md:flex-row overflow-hidden">
            <Sidebar 
                tabs={Tabs} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onExit={onExit} 
                onLogout={handleLogout} 
            />

            <main className="flex-1 p-6 md:p-12 overflow-y-auto h-screen scroll-smooth bg-gray-50 relative">
                {activeTab === 'Analytics' && <AnalyticsManager />}
                {activeTab === 'Projects' && <ProjectManager />}
                {activeTab === 'Quote Generator' && <QuotationManager />}
                {activeTab === 'Quote Template' && <QuotationTemplateManager />}
                {activeTab === 'Curation' && <CurationManager />}
                {activeTab === 'About' && <AboutManager />}
                {activeTab === 'Trusted By' && <ClientManager />}
                {activeTab === 'Settings' && <SettingsManager />}
                {activeTab === 'Orders' && <OrderManager />}
            </main>
        </div>
    );
};
