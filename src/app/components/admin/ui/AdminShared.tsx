
import React, { useRef } from 'react';

// --- Global Helpers ---
export const confirmDelete = (message: string): boolean => {
    return window.confirm(`WARNING: Permanent Deletion.\n\n${message}\n\nAre you sure you want to proceed?`);
};

// --- Components ---

export const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <div 
        onClick={(e) => { e.stopPropagation(); onChange(!checked); }} 
        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
        title={checked ? "Visible" : "Hidden"}
    >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
);

// Fixed: Accepts all HTMLDivElement props (like onClick) and passes them to the div
export const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }> = ({ children, className, ...props }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className || ''}`} {...props}>
        {children}
    </div>
);

export const SectionHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
        {action}
    </div>
);

export const InputGroup: React.FC<{ label: string; subLabel?: string; children: React.ReactNode; error?: string }> = ({ label, subLabel, children, error }) => (
    <div className="mb-5">
        <label className="block text-sm font-bold text-gray-800 mb-1">{label}</label>
        {subLabel && <p className="text-xs text-gray-500 mb-2">{subLabel}</p>}
        {children}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

export const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input 
        {...props} 
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 transition-shadow" 
    />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea 
        {...props} 
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 transition-shadow min-h-[100px]" 
    />
);

// Fixed: Defaults to type="button" to prevent form submission unless specified
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'secondary' | 'success' }> = ({ variant = 'primary', className, children, type = "button", ...props }) => {
    const baseClass = "px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:blur-[2px] shadow-sm";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400",
        success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
    };
    return <button type={type} className={`${baseClass} ${variants[variant]} ${className || ''}`} {...props}>{children}</button>;
};

export const FileUpload: React.FC<{ 
    accept?: string; 
    onUpload: (base64: string) => void; 
    previewUrl?: string; 
    label?: string; 
    recommendedSize?: string;
    onClear?: () => void;
}> = ({ accept = "image/*,video/*", onUpload, previewUrl, label, recommendedSize, onClear }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert("File is too large! Please upload files smaller than 10MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-white transition-colors">
            {label && <p className="text-sm font-bold text-gray-700 mb-1">{label}</p>}
            {recommendedSize && <p className="text-[10px] text-blue-600 mb-3 font-semibold uppercase tracking-wider">{recommendedSize}</p>}
            
            <div className="flex items-start gap-4">
                {previewUrl ? (
                    <div className="relative group">
                        <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden border border-gray-300 shadow-sm">
                             {previewUrl.startsWith('data:video') || previewUrl.endsWith('.mp4') ? (
                                 <video src={previewUrl} className="w-full h-full object-cover" />
                             ) : (
                                 <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                             )}
                        </div>
                        {onClear && (
                            <button 
                                onClick={(e) => { e.preventDefault(); onClear(); }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                                title="Remove file"
                            >
                                ×
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-gray-400 text-xs text-center p-2">
                        No Media
                    </div>
                )}
                <div className="flex-1">
                    <input 
                        type="file" 
                        accept={accept} 
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-xs file:font-bold file:uppercase
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100
                            cursor-pointer"
                        ref={fileInputRef}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                        Supports: JPG, PNG, MP4.
                    </p>
                </div>
            </div>
        </div>
    );
};

export const MultiFileUpload: React.FC<{
    images: string[];
    onUpdate: (images: string[]) => void;
    label: string;
}> = ({ images, onUpdate, label }) => {
    const handleAdd = (base64: string) => {
        onUpdate([...images, base64]);
    };
    const handleRemove = (index: number) => {
        onUpdate(images.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <p className="text-sm font-bold text-gray-800">{label}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, i) => (
                    <div key={i} className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden border border-gray-200">
                        <img src={img} className="w-full h-full object-cover" alt="" />
                        <button 
                            onClick={() => handleRemove(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <div className="aspect-square">
                    <FileUpload 
                        onUpload={handleAdd} 
                        label="" 
                        recommendedSize="Add New" 
                    />
                </div>
            </div>
        </div>
    );
};

export const LangTabs: React.FC<{ active: 'en' | 'si' | 'ta'; onChange: (l: 'en'|'si'|'ta') => void }> = ({ active, onChange }) => (
    <div className="flex gap-2 mb-4 border-b border-gray-200">
        {(['en', 'si', 'ta'] as const).map(l => (
            <button 
                key={l} 
                onClick={() => onChange(l)}
                className={`px-4 py-2 text-sm font-bold uppercase transition-colors rounded-t-lg ${active === l ? 'bg-gray-100 text-black border border-gray-200 border-b-white -mb-px' : 'text-gray-400 hover:text-gray-600'}`}
            >
                {l === 'en' ? 'English' : l === 'si' ? 'Sinhala' : 'Tamil'}
            </button>
        ))}
    </div>
);
