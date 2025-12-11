
import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { ContactEmail } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, FileUpload, LangTabs, TextArea, confirmDelete } from '../ui/AdminShared';

export const SettingsManager: React.FC = () => {
    const { config, setConfig } = useContent();
    const [localConfig, setLocalConfig] = useState(config);
    const [configLang, setConfigLang] = useState<'en'|'si'|'ta'>('en');

    const [editingEmailId, setEditingEmailId] = useState<number | null>(null);
    const [tempEmail, setTempEmail] = useState<string>('');

    const isBrandingDirty = 
        localConfig.logoLight !== config.logoLight ||
        localConfig.logoDark !== config.logoDark ||
        localConfig.loadingLogo !== config.loadingLogo ||
        localConfig.footerLogo !== config.footerLogo;

    const isFooterContactDirty = 
        localConfig.agencyTagline !== config.agencyTagline ||
        localConfig.agencyTagline_si !== config.agencyTagline_si ||
        localConfig.agencyTagline_ta !== config.agencyTagline_ta ||
        localConfig.contactEmail !== config.contactEmail ||
        localConfig.whatsappNumber !== config.whatsappNumber ||
        localConfig.whatsappIcon !== config.whatsappIcon;

    const isPrivacyDirty = JSON.stringify({
        pp_introText: localConfig.pp_introText,
        pp_introText_si: localConfig.pp_introText_si,
        pp_introText_ta: localConfig.pp_introText_ta,
        pp_dataText: localConfig.pp_dataText,
        pp_dataText_si: localConfig.pp_dataText_si,
        pp_dataText_ta: localConfig.pp_dataText_ta,
        pp_dataList: localConfig.pp_dataList,
        pp_dataList_si: localConfig.pp_dataList_si,
        pp_dataList_ta: localConfig.pp_dataList_ta,
        pp_usageText: localConfig.pp_usageText,
        pp_usageText_si: localConfig.pp_usageText_si,
        pp_usageText_ta: localConfig.pp_usageText_ta,
        pp_usageList: localConfig.pp_usageList,
        pp_usageList_si: localConfig.pp_usageList_si,
        pp_usageList_ta: localConfig.pp_usageList_ta,
        pp_thirdPartyText: localConfig.pp_thirdPartyText,
        pp_thirdPartyText_si: localConfig.pp_thirdPartyText_si,
        pp_thirdPartyText_ta: localConfig.pp_thirdPartyText_ta,
        pp_contactText: localConfig.pp_contactText,
        pp_contactText_si: localConfig.pp_contactText_si,
        pp_contactText_ta: localConfig.pp_contactText_ta,
    }) !== JSON.stringify({
        pp_introText: config.pp_introText,
        pp_introText_si: config.pp_introText_si,
        pp_introText_ta: config.pp_introText_ta,
        pp_dataText: config.pp_dataText,
        pp_dataText_si: config.pp_dataText_si,
        pp_dataText_ta: config.pp_dataText_ta,
        pp_dataList: config.pp_dataList,
        pp_dataList_si: config.pp_dataList_si,
        pp_dataList_ta: config.pp_dataList_ta,
        pp_usageText: config.pp_usageText,
        pp_usageText_si: config.pp_usageText_si,
        pp_usageText_ta: config.pp_usageText_ta,
        pp_usageList: config.pp_usageList,
        pp_usageList_si: config.pp_usageList_si,
        pp_usageList_ta: config.pp_usageList_ta,
        pp_thirdPartyText: config.pp_thirdPartyText,
        pp_thirdPartyText_si: config.pp_thirdPartyText_si,
        pp_thirdPartyText_ta: config.pp_thirdPartyText_ta,
        pp_contactText: config.pp_contactText,
        pp_contactText_si: config.pp_contactText_si,
        pp_contactText_ta: config.pp_contactText_ta,
    });

    const saveBranding = () => {
        setConfig(localConfig);
        alert("Branding assets updated!");
    };

    const saveFooterContact = () => {
        setConfig(localConfig);
        alert("Footer & Contact settings updated!");
    };

    const savePrivacyPolicy = () => {
        setConfig(localConfig);
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

    const saveEmail = () => {
        if (!tempEmail) return alert("Email address required");
        let newList;
        if (editingEmailId === -1) {
            newList = [...(config.contactEmails || []), { id: Date.now(), email: tempEmail }];
        } else {
            newList = (config.contactEmails || []).map(e => e.id === editingEmailId ? { ...e, email: tempEmail } : e);
        }
        setConfig({ ...config, contactEmails: newList });
        setLocalConfig({ ...localConfig, contactEmails: newList });
        setEditingEmailId(null);
    };

    const deleteEmail = (id: number) => {
        if (confirmDelete("Permanently remove this email address?")) {
            const newList = (config.contactEmails || []).filter(e => e.id !== id);
            setConfig({ ...config, contactEmails: newList });
            setLocalConfig({ ...localConfig, contactEmails: newList });
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
                <FileUpload label="Light Mode Logo (Nav)" previewUrl={localConfig.logoLight} onUpload={(b64) => setLocalConfig({ ...localConfig, logoLight: b64 })} />
                <FileUpload label="Dark Mode Logo (Nav)" previewUrl={localConfig.logoDark} onUpload={(b64) => setLocalConfig({ ...localConfig, logoDark: b64 })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FileUpload label="Loading Screen Logo" previewUrl={localConfig.loadingLogo} onUpload={(b64) => setLocalConfig({ ...localConfig, loadingLogo: b64 })} />
                <FileUpload label="Footer Company Logo" previewUrl={localConfig.footerLogo} onUpload={(b64) => setLocalConfig({ ...localConfig, footerLogo: b64 })} />
            </div>
            <div className="mt-6 flex justify-end">
                <Button onClick={saveBranding} variant="success" disabled={!isBrandingDirty}>Save Assets</Button>
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
                {configLang === 'en' && <InputGroup label="Agency Tagline (EN)"><TextInput value={localConfig.agencyTagline} onChange={e => setLocalConfig({ ...localConfig, agencyTagline: e.target.value })} /></InputGroup>}
                {configLang === 'si' && <InputGroup label="Agency Tagline (SI)"><TextInput value={localConfig.agencyTagline_si || ''} onChange={e => setLocalConfig({ ...localConfig, agencyTagline_si: e.target.value })} /></InputGroup>}
                {configLang === 'ta' && <InputGroup label="Agency Tagline (TA)"><TextInput value={localConfig.agencyTagline_ta || ''} onChange={e => setLocalConfig({ ...localConfig, agencyTagline_ta: e.target.value })} /></InputGroup>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <InputGroup label="Primary Email (Footer Link)" subLabel="Used in main footer 'Say Hello' section"><TextInput value={localConfig.contactEmail} onChange={e => setLocalConfig({ ...localConfig, contactEmail: e.target.value })} /></InputGroup>
                <InputGroup label="WhatsApp Number"><TextInput value={localConfig.whatsappNumber} onChange={e => setLocalConfig({ ...localConfig, whatsappNumber: e.target.value })} /></InputGroup>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload label="WhatsApp Icon" previewUrl={localConfig.whatsappIcon} onUpload={b64 => setLocalConfig({ ...localConfig, whatsappIcon: b64 })} recommendedSize="SVG or PNG" />
                </div>
                <div className="mt-6 flex justify-end">
                <Button onClick={saveFooterContact} variant="success" disabled={!isFooterContactDirty}>Save Config</Button>
            </div>
            </Card>

            <Card>
                <SectionHeader title="Privacy Policy Content" />
                <LangTabs active={configLang} onChange={setConfigLang} />
                <div className="space-y-6">
                    {/* Intro */}
                    <InputGroup label="1. Introduction Text">
                        <TextArea 
                            rows={3} 
                            value={configLang === 'en' ? localConfig.pp_introText : configLang === 'si' ? (localConfig.pp_introText_si || '') : (localConfig.pp_introText_ta || '')} 
                            onChange={e => setLocalConfig({...localConfig, [`pp_introText${configLang === 'en' ? '' : `_${configLang}`}`]: e.target.value})} 
                        />
                    </InputGroup>
                    
                    {/* Data Collection */}
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

                    {/* Usage */}
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

                     {/* Third Party */}
                    <InputGroup label="4. Third Party Text">
                        <TextArea 
                            rows={3} 
                            value={configLang === 'en' ? localConfig.pp_thirdPartyText : configLang === 'si' ? (localConfig.pp_thirdPartyText_si || '') : (localConfig.pp_thirdPartyText_ta || '')} 
                            onChange={e => setLocalConfig({...localConfig, [`pp_thirdPartyText${configLang === 'en' ? '' : `_${configLang}`}`]: e.target.value})} 
                        />
                    </InputGroup>

                     {/* Contact */}
                    <InputGroup label="5. Contact Text">
                        <TextArea 
                            rows={3} 
                            value={configLang === 'en' ? localConfig.pp_contactText : configLang === 'si' ? (localConfig.pp_contactText_si || '') : (localConfig.pp_contactText_ta || '')} 
                            onChange={e => setLocalConfig({...localConfig, [`pp_contactText${configLang === 'en' ? '' : `_${configLang}`}`]: e.target.value})} 
                        />
                    </InputGroup>
                </div>
                 <div className="mt-6 flex justify-end">
                    {isPrivacyDirty && (
                        <Button onClick={savePrivacyPolicy} variant="success">Save Policy Content</Button>
                    )}
                </div>
            </Card>
        </div>
    );
};
