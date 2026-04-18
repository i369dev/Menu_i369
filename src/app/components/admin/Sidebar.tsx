import React from 'react';
// මෙතැන import path එක නිවැරදි කර ඇත
import { useAuth } from '@/app/context/AuthContext'; 

interface SidebarProps {
    tabs: ReadonlyArray<string>;
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onExit: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ tabs, activeTab, setActiveTab, onExit }) => {
    const { logout } = useAuth();
    
    return (
        <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col h-auto md:h-screen z-10 shadow-lg">
            <div className="p-8 border-b border-gray-100">
                <h1 className="font-black text-2xl tracking-widest text-gray-900">ADMIN</h1>
                <p className="text-xs text-gray-400 mt-1 tracking-wider uppercase font-bold">Content Management</p>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {tabs.map(tab => (
                    <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab)} 
                        className={`w-full text-left px-5 py-4 rounded-lg text-sm font-bold transition-all flex items-center justify-between group ${
                            activeTab === tab 
                            ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <span>{tab}</span>
                        {activeTab === tab && <span className="text-white/80">→</span>}
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
                <button onClick={onExit} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-wider">
                    Exit to Site
                </button>
                <button onClick={logout} className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider">
                    Log Out
                </button>
            </div>
        </aside>
    );
};