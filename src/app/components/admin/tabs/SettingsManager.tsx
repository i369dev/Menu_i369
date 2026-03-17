
import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { SiteConfig, ContactEmail } from '../../../types';
import { Card, SectionHeader, InputGroup, FileUpload, confirmDelete, Button, LangTabs, TextInput, TextArea } from '../ui/AdminShared';
import { uploadFileToStorage } from '../../../utils/storage';

export const SettingsManager: React.FC = () => {
    const { config, setConfig } = useContent();
    const [localConfig, setLocalConfig] = useState(config);
    const [configLang, setConfigLang] = useState<'en'|'si'|'ta'>('en');

    // File states
    const [logoLightFile, setLogoLightFile] = useState<File | null>(null);
    const [logoDarkFile, setLogoDarkFile] = useState<File | null>(null);
    const [loadingLogoFile, setLoadingLogoFile] = useState<File | null>(null);
    const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);
    const [whatsappIconFile, setWhatsappIconFile] = useState<File | null>(null);

    const [editingEmailId, setEditingEmailId] = useState<number | null>(null);
    const [tempEmail, setTempEmail] = useState<string>('');

    const saveBranding = async () => {
        let updatedConfig = { ...localConfig };
        try {
            if (logoLightFile) updatedConfig.logoLight = await uploadFileToStorage(logoLightFile, `logos/logoLight_${Date.now()}`);
            if (logoDarkFile) updatedConfig.logoDark = await uploadFileToStorage(logoDarkFile, `logos/logoDark_${Date.now()}`);
            if (loadingLogoFile) updatedConfig.loadingLogo = await uploadFileToStorage(loadingLogoFile, `logos/loadingLogo_${Date.now()}`);
            if (footerLogoFile) updatedConfig.footerLogo = await uploadFileToStorage(footerLogoFile, `logos/footerLogo_${Date.now()}`);
            
            await setConfig(updatedConfig);
            setLocalConfig(updatedConfig); // Sync local state with new config
            setLogoLightFile(null);
            setLogoDarkFile(null);
            setLoadingLogoFile(null);
            setFooterLogoFile(null);
            alert("Branding assets updated!");
        } catch(e) {
            console.error("Asset upload failed:", e);
            alert('Asset upload failed!');
        }
    };

    const saveFooterContact = async () => {
        let updatedConfig = { ...localConfig };
        if (whatsappIconFile) {
             try {
                updatedConfig.whatsappIcon = await uploadFileToStorage(whatsappIconFile, `icons/whatsapp_${Date.now()}`);
            } catch(e) {
                alert('WhatsApp Icon upload failed!');
                return;
            }
        }
        await setConfig(updatedConfig);
        setLocalConfig(updatedConfig);
        setWhatsappIconFile(null);
        alert("Footer & Contact settings updated!");
    };
    
    const savePrivacyPolicy = async () => {
        await setConfig(localConfig);
        alert("Privacy Policy updated!");
    };

    const startEditEmail = (emailObj?: ContactEmail) => {
        if (emailObj) {
            setEditingEmailId(emailObj.id);
            setTempEmail(emailObj.email);
        } else {
            setEditingEmailId(-1);
            setTempEmail('');
        }
    };

    const saveEmail = async () => {
        if (!tempEmail) return alert("Email address required");
        let newList;
        if (editingEmailId === -1) {
            newList = [...(localConfig.contactEmails || []), { id: Date.now(), email: tempEmail }];
        } else {
            newList = (localConfig.contactEmails || []).map(e => e.id === editingEmailId ? { ...e, email: tempEmail } : e);
        }
        const updatedConfig = { ...localConfig, contactEmails: newList };
        await setConfig(updatedConfig);
        setLocalConfig(updatedConfig);
        setEditingEmailId(null);
    };

    const deleteEmail = async (id: number) => {
        if (confirmDelete("Permanently remove this email address?")) {
            const newList = (localConfig.contactEmails || []).filter(e => e.id !== id);
            const updatedConfig = { ...localConfig, contactEmails: newList };
            await setConfig(updatedConfig);
            setLocalConfig(updatedConfig);
        }
    };

    const getListText = (list: string[] | undefined) => (list || []).join('\n');
    const updateListFromText = (text: string, field: string, langSuffix: string) => {
        const list = text.split('\n').filter(line => line.trim() !== '');
        setLocalConfig({ ...localConfig, [`${field}${langSuffix}`]: list });
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <Card>
                <SectionHeader title="Branding & Assets" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <FileUpload label="Light Mode Logo (Nav)" previewUrl={logoLightFile ? URL.createObjectURL(logoLightFile) : localConfig.logoLight} onFileSelect={setLogoLightFile} />
                    <FileUpload label="Dark Mode Logo (Nav)" previewUrl={logoDarkFile ? URL.createObjectURL(logoDarkFile) : localConfig.logoDark} onFileSelect={setLogoDarkFile} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FileUpload label="Loading Screen Logo" previewUrl={loadingLogoFile ? URL.createObjectURL(loadingLogoFile) : localConfig.loadingLogo} onFileSelect={setLoadingLogoFile} />
                    <FileUpload label="Footer Company Logo" previewUrl={footerLogoFile ? URL.createObjectURL(footerLogoFile) : localConfig.footerLogo} onFileSelect={setFooterLogoFile} />
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={saveBranding} variant="success">Save Assets</Button>
                </div>
            </Card>

            <Card>
                <SectionHeader title="Contact Emails" action={<Button onClick={() => startEditEmail()} variant="secondary" className="text-xs">+ Add Email</Button>} />
                <div className="space-y-3 mb-6">
                    {(localConfig.contactEmails || []).map(email => (
                         <div key={email.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                            {editingEmailId === email.id ? (
                                <div className="flex gap-2 w-full">
                                    <TextInput value={tempEmail} onChange={e => setTempEmail(e.target.value)} placeholder="email@example.com" className="flex-1" />
                                    <Button onClick={saveEmail} variant="success" className="text-xs">Save</Button>
                                    <Button onClick={() => setEditingEmailId(null)} variant="secondary" className="text-xs">Cancel</Button>
                                </div>
                            ) : (
                                <>
                                    <span className="font-mono text-sm">{email.email}</span>
                                    <div className="flex gap-2">
                                        <Button onClick={() => startEditEmail(email)} variant="secondary" className="text-xs py-1 px-2">Edit</Button>
                                        <Button onClick={() => deleteEmail(email.id)} variant="danger" className="text-xs py-1 px-2">Del</Button>
                                    </div>
                                </>
                            )}
                         </div>
                    ))}
                    {editingEmailId === -1 && (
                         <div className="flex gap-2 p-3 bg-blue-50 rounded border border-blue-100">
                             <TextInput value={tempEmail} onChange={e => setTempEmail(e.target.value)} placeholder="New Email Address" className="flex-1" />
                             <Button onClick={saveEmail} variant="success" className="text-xs">Add</Button>
                             <Button onClick={() => setEditingEmailId(null)} variant="secondary" className="text-xs">Cancel</Button>
                         </div>
                    )}
                </div>

                <hr className="border-gray-100 my-8" />

                <SectionHeader title="Footer Config" />
                <LangTabs active={configLang} onChange={setConfigLang} />
                {configLang === 'en' && <InputGroup label="Agency Tagline (EN)"><TextInput value={localConfig.agencyTagline || ''} onChange={e => setLocalConfig({ ...localConfig, agencyTagline: e.target.value })} /></InputGroup>}
                {configLang === 'si' && <InputGroup label="Agency Tagline (SI)"><TextInput value={localConfig.agencyTagline_si || ''} onChange={e => setLocalConfig({ ...localConfig, agencyTagline_si: e.target.value })} /></InputGroup>}
                {configLang === 'ta' && <InputGroup label="Agency Tagline (TA)"><TextInput value={localConfig.agencyTagline_ta || ''} onChange={e => setLocalConfig({ ...localConfig, agencyTagline_ta: e.target.value })} /></InputGroup>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <InputGroup label="Primary Email (Footer Link)" subLabel="Used in main footer 'Say Hello' section"><TextInput value={localConfig.contactEmail || ''} onChange={e => setLocalConfig({ ...localConfig, contactEmail: e.target.value })} /></InputGroup>
                <InputGroup label="WhatsApp Number"><TextInput value={localConfig.whatsappNumber || ''} onChange={e => setLocalConfig({ ...localConfig, whatsappNumber: e.target.value })} /></InputGroup>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload label="WhatsApp Icon" previewUrl={whatsappIconFile ? URL.createObjectURL(whatsappIconFile) : localConfig.whatsappIcon} onFileSelect={setWhatsappIconFile} recommendedSize="SVG or PNG" />
                </div>
                <div className="mt-6 flex justify-end">
                <Button onClick={saveFooterContact} variant="success">Save Config</Button>
            </div>
            </Card>

            <Card>
                <SectionHeader title="Privacy Policy Content" />
                <LangTabs active={configLang} onChange={setConfigLang} />
                <div className="space-y-6">
                    <InputGroup label="1. Introduction Text">
                        <TextArea 
                            rows={3} 
                            value={configLang === 'en' ? localConfig.pp_introText : configLang === 'si' ? (localConfig.pp_introText_si || '') : (localConfig.pp_introText_ta || '')} 
                            onChange={e => setLocalConfig({...localConfig, [`pp_introText${configLang === 'en' ? '' : `_${configLang}`}`]: e.target.value})} 
                        />
                    </InputGroup>
                    
                    <div className="grid grid-cols-1 gap-4">
                        <InputGroup label="2. Data Collection Text">
                             <TextArea 
                                rows={2} 
                                value={configLang === 'en' ? localConfig.pp_dataText : configLang === 'si' ? (localConfig.pp_dataText_si || '') : (localConfig.pp_dataText_ta || '')} 
                                onChange={e => setLocalConfig({...localConfig, [`pp_dataText${configLang === 'en' ? '' : `_${configLang}`}`]: e.target.value})} 
                            />
                        </InputGroup>
                         <InputGroup label="Data List (One per line)">
                             <TextArea 
                                rows={4} 
                                value={getListText(configLang === 'en' ? localConfig.pp_dataList : configLang === 'si' ? localConfig.pp_dataList_si : localConfig.pp_dataList_ta)} 
                                onChange={e => updateListFromText(e.target.value, 'pp_dataList', configLang === 'en' ? '' : `_${configLang}`)} 
                            />
                        </InputGroup>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <InputGroup label="3. Usage Text">
                             <TextArea 
                                rows={2} 
                                value={configLang === 'en' ? localConfig.pp_usageText : configLang === 'si' ? (localConfig.pp_usageText_si || '') : (localConfig.pp_usageText_ta || '')} 
                                onChange={e => setLocalConfig({...localConfig, [`pp_usageText${configLang === 'en' ? '' : `_${configLang}`}`]: e.target.value})} 
                            />
                        </InputGroup>
                         <InputGroup label="Usage List (One per line)">
                             <TextArea 
                                rows={4} 
                                value={getListText(configLang === 'en' ? localConfig.pp_usageList : configLang === 'si' ? localConfig.pp_usageList_si : localConfig.pp_usageList_ta)} 
                                onChange={e => updateListFromText(e.target.value, 'pp_usageList', configLang === 'en' ? '' : `_${configLang}`)} 
                            />
                        </InputGroup>
                    </div>

                    <InputGroup label="4. Third Party Text">
                        <TextArea 
                            rows={3} 
                            value={configLang === 'en' ? localConfig.pp_thirdPartyText : configLang === 'si' ? (localConfig.pp_thirdPartyText_si || '') : (localConfig.pp_thirdPartyText_ta || '')} 
                            onChange={e => setLocalConfig({...localConfig, [`pp_thirdPartyText${configLang === 'en' ? '' : `_${configLang}`}`]: e.target.value})} 
                        />
                    </InputGroup>

                    <InputGroup label="5. Contact Text">
                        <TextArea 
                            rows={3} 
                            value={configLang === 'en' ? localConfig.pp_contactText : configLang === 'si' ? (localConfig.pp_contactText_si || '') : (localConfig.pp_contactText_ta || '')} 
                            onChange={e => setLocalConfig({...localConfig, [`pp_contactText${configLang === 'en' ? '' : `_${configLang}`}`]: e.target.value})} 
                        />
                    </InputGroup>
                </div>
                 <div className="mt-6 flex justify-end">
                    <Button onClick={savePrivacyPolicy} variant="success">Save Policy Content</Button>
                </div>
            </Card>
        </div>
    );
};
