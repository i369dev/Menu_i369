
import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { TeamMember, SocialLink } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, TextArea, Button, FileUpload, LangTabs, confirmDelete, Toggle } from '../ui/AdminShared';

export const AboutManager: React.FC = () => {
    const { config, setConfig } = useContent();
    const [localConfig, setLocalConfig] = useState(config);
    const [configLang, setConfigLang] = useState<'en'|'si'|'ta'>('en');

    // --- Team State ---
    const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
    const [tempTeam, setTempTeam] = useState<Partial<TeamMember>>({});
    const [originalTeam, setOriginalTeam] = useState<Partial<TeamMember>>({});
    const [teamLang, setTeamLang] = useState<'en'|'si'|'ta'>('en');

    // --- Social State ---
    const [editingSocialId, setEditingSocialId] = useState<number | null>(null);
    const [tempSocial, setTempSocial] = useState<Partial<SocialLink>>({});
    const [originalSocial, setOriginalSocial] = useState<Partial<SocialLink>>({});

    // Dirty Checks
    const isAboutContentDirty = 
        localConfig.aboutDescription !== config.aboutDescription ||
        localConfig.aboutDescription_si !== config.aboutDescription_si ||
        localConfig.aboutDescription_ta !== config.aboutDescription_ta ||
        localConfig.aboutSpatial !== config.aboutSpatial ||
        localConfig.aboutSpatial_si !== config.aboutSpatial_si ||
        localConfig.aboutSpatial_ta !== config.aboutSpatial_ta ||
        localConfig.aboutLogo !== config.aboutLogo;
    
    const isTeamDirty = JSON.stringify(tempTeam) !== JSON.stringify(originalTeam);
    const isSocialDirty = JSON.stringify(tempSocial) !== JSON.stringify(originalSocial);

    // Handlers
    const saveAboutContent = () => {
        setConfig(localConfig);
        alert("About content updated!");
    };

    // Team CRUD
    const startEditTeam = (member?: TeamMember) => {
        if (member) {
            setEditingTeamId(member.id);
            setTempTeam({ ...member });
            setOriginalTeam({ ...member });
        } else {
            setEditingTeamId(-1);
            const empty = { id: Date.now(), name: '', role: '', bio: '', image: '', figLabel: 'Fig [01]', isVisible: true };
            setTempTeam(empty);
            setOriginalTeam(empty);
        }
    };

    const saveTeam = () => {
        if (!tempTeam.name) return alert("Name is required");
        const members = [...(config.teamMembers || [])];
        if (editingTeamId === -1) {
            members.push(tempTeam as TeamMember);
        } else {
            const index = members.findIndex(m => m.id === editingTeamId);
            if (index !== -1) members[index] = tempTeam as TeamMember;
        }
        const newConfig = { ...config, teamMembers: members };
        setConfig(newConfig);
        setEditingTeamId(null);
    };

    const deleteTeam = (id: number) => {
        if (confirmDelete("Remove team member?")) {
            const newConfig = { ...config, teamMembers: config.teamMembers.filter(m => m.id !== id) };
            setConfig(newConfig);
        }
    };

    const toggleTeamVisibility = (id: number, visible: boolean) => {
        const members = config.teamMembers.map(m => m.id === id ? { ...m, isVisible: visible } : m);
        const newConfig = { ...config, teamMembers: members };
        setConfig(newConfig);
    };

    // Social CRUD
    const startEditSocial = (link?: SocialLink) => {
        if (link) {
            setEditingSocialId(link.id);
            setTempSocial({ ...link });
            setOriginalSocial({ ...link });
        } else {
            setEditingSocialId(-1);
            const empty = { id: Date.now(), platform: '', url: '', icon: '', isVisible: true };
            setTempSocial(empty);
            setOriginalSocial(empty);
        }
    };

    const saveSocial = () => {
        if (!tempSocial.platform) return alert("Platform name required");
        const links = [...(config.socialLinks || [])];
        if (editingSocialId === -1) {
            links.push(tempSocial as SocialLink);
        } else {
            const index = links.findIndex(s => s.id === editingSocialId);
            if (index !== -1) links[index] = tempSocial as SocialLink;
        }
        const newConfig = { ...config, socialLinks: links };
        setConfig(newConfig);
        setEditingSocialId(null);
    };

    const deleteSocial = (id: number) => {
        if (confirmDelete("Remove social link?")) {
            const newConfig = { ...config, socialLinks: config.socialLinks.filter(s => s.id !== id) };
            setConfig(newConfig);
        }
    };

    const toggleSocialVisibility = (id: number, visible: boolean) => {
        const links = config.socialLinks.map(s => s.id === id ? { ...s, isVisible: visible } : s);
        const newConfig = { ...config, socialLinks: links };
        setConfig(newConfig);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-12">
            {/* 1. Main Content */}
            <Card>
                <SectionHeader title="About Page Content" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <LangTabs active={configLang} onChange={setConfigLang} />
                        {configLang === 'en' && (
                            <div className="space-y-6">
                                <InputGroup label="Description (EN)"><TextArea value={localConfig.aboutDescription} onChange={e => setLocalConfig({ ...localConfig, aboutDescription: e.target.value })} rows={5} /></InputGroup>
                                <InputGroup label="Spatial Design Text (EN)" subLabel="The paragraph about environments and well-being."><TextArea value={localConfig.aboutSpatial} onChange={e => setLocalConfig({ ...localConfig, aboutSpatial: e.target.value })} rows={4} /></InputGroup>
                            </div>
                        )}
                        {configLang === 'si' && (
                            <div className="space-y-6">
                                <InputGroup label="Description (SI)"><TextArea value={localConfig.aboutDescription_si || ''} onChange={e => setLocalConfig({ ...localConfig, aboutDescription_si: e.target.value })} rows={5} /></InputGroup>
                                <InputGroup label="Spatial Design Text (SI)"><TextArea value={localConfig.aboutSpatial_si || ''} onChange={e => setLocalConfig({ ...localConfig, aboutSpatial_si: e.target.value })} rows={4} /></InputGroup>
                            </div>
                        )}
                        {configLang === 'ta' && (
                            <div className="space-y-6">
                                <InputGroup label="Description (TA)"><TextArea value={localConfig.aboutDescription_ta || ''} onChange={e => setLocalConfig({ ...localConfig, aboutDescription_ta: e.target.value })} rows={5} /></InputGroup>
                                <InputGroup label="Spatial Design Text (TA)"><TextArea value={localConfig.aboutSpatial_ta || ''} onChange={e => setLocalConfig({ ...localConfig, aboutSpatial_ta: e.target.value })} rows={4} /></InputGroup>
                            </div>
                        )}
                    </div>
                    <div>
                        <FileUpload label="About Page Logo" previewUrl={localConfig.aboutLogo} onUpload={b64 => setLocalConfig({ ...localConfig, aboutLogo: b64 })} recommendedSize="Portrait/Vertical" />
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <Button onClick={saveAboutContent} variant="success" disabled={!isAboutContentDirty}>Save Content</Button>
                </div>
            </Card>

            {/* 2. Team Members */}
            <Card>
                <SectionHeader title="Team Members" action={<Button onClick={() => startEditTeam()} variant="secondary">+ Add Member</Button>} />
                {editingTeamId === null ? (
                    <div className="space-y-4">
                        {config.teamMembers?.map(member => (
                            <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 bg-white">
                                <img src={member.image} className={`w-12 h-12 rounded-full object-cover ${member.isVisible === false ? 'opacity-50 grayscale' : ''}`} alt="" />
                                <div className="flex-1">
                                    <h4 className="font-bold">{member.name} {member.isVisible === false && <span className="text-red-500 text-xs">(Hidden)</span>}</h4>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                                <Toggle checked={member.isVisible !== false} onChange={(val) => toggleTeamVisibility(member.id, val)} />
                                <div className="h-6 w-px bg-gray-200 mx-2" />
                                <Button variant="secondary" className="text-xs" onClick={() => startEditTeam(member)}>Edit</Button>
                                <Button variant="danger" className="text-xs" onClick={() => deleteTeam(member.id)}>Del</Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-lg animate-in fade-in">
                        <h4 className="font-bold mb-4">{editingTeamId === -1 ? 'Add Member' : 'Edit Member'}</h4>
                        <InputGroup label="Name (Excluded from Translation)"><TextInput value={tempTeam.name} onChange={e => setTempTeam({...tempTeam, name: e.target.value})} /></InputGroup>
                        <hr className="my-4 border-gray-200" />
                        <LangTabs active={teamLang} onChange={setTeamLang} />
                        {teamLang === 'en' && (
                            <>
                                <InputGroup label="Role (EN)"><TextInput value={tempTeam.role} onChange={e => setTempTeam({...tempTeam, role: e.target.value})} /></InputGroup>
                                <InputGroup label="Bio (EN)"><TextArea value={tempTeam.bio} onChange={e => setTempTeam({...tempTeam, bio: e.target.value})} rows={3} /></InputGroup>
                            </>
                        )}
                        {teamLang === 'si' && (
                            <>
                                <InputGroup label="Role (SI)"><TextInput value={tempTeam.role_si || ''} onChange={e => setTempTeam({...tempTeam, role_si: e.target.value})} /></InputGroup>
                                <InputGroup label="Bio (SI)"><TextArea value={tempTeam.bio_si || ''} onChange={e => setTempTeam({...tempTeam, bio_si: e.target.value})} rows={3} /></InputGroup>
                            </>
                        )}
                        {teamLang === 'ta' && (
                            <>
                                <InputGroup label="Role (TA)"><TextInput value={tempTeam.role_ta || ''} onChange={e => setTempTeam({...tempTeam, role_ta: e.target.value})} /></InputGroup>
                                <InputGroup label="Bio (TA)"><TextArea value={tempTeam.bio_ta || ''} onChange={e => setTempTeam({...tempTeam, bio_ta: e.target.value})} rows={3} /></InputGroup>
                            </>
                        )}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                                <InputGroup label="Fig Label"><TextInput value={tempTeam.figLabel} onChange={e => setTempTeam({...tempTeam, figLabel: e.target.value})} /></InputGroup>
                                <FileUpload label="Profile Photo" previewUrl={tempTeam.image} onUpload={b64 => setTempTeam({...tempTeam, image: b64})} />
                        </div>
                        <div className="flex gap-4 mt-4"><Button onClick={saveTeam} variant="success" disabled={!isTeamDirty}>Save</Button><Button onClick={() => setEditingTeamId(null)} variant="secondary">Cancel</Button></div>
                    </div>
                )}
            </Card>

                {/* 3. Social Media */}
                <Card>
                <SectionHeader title="Social Media Links" action={<Button onClick={() => startEditSocial()} variant="secondary">+ Add Link</Button>} />
                    {editingSocialId === null ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {config.socialLinks?.map(link => (
                            <div key={link.id} className={`flex items-center gap-3 p-3 border rounded hover:bg-gray-50 ${link.isVisible === false ? 'opacity-60 bg-gray-100' : ''}`}>
                                <img src={link.icon} className="w-8 h-8 object-contain" alt="" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm truncate">{link.platform}</h4>
                                    {link.isVisible === false && <span className="text-[10px] text-red-500 font-bold uppercase">Hidden</span>}
                                </div>
                                <div className="flex gap-1 items-center">
                                    <Toggle checked={link.isVisible !== false} onChange={(val) => toggleSocialVisibility(link.id, val)} />
                                    <Button variant="secondary" className="px-2 py-1 text-xs ml-1" onClick={() => startEditSocial(link)}>Edit</Button>
                                    <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => deleteSocial(link.id)}>×</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-6 rounded-lg animate-in fade-in">
                        <h4 className="font-bold mb-4">{editingSocialId === -1 ? 'Add Social Link' : 'Edit Social Link'}</h4>
                        <div className="space-y-4">
                            <InputGroup label="Platform Name"><TextInput value={tempSocial.platform} onChange={e => setTempSocial({...tempSocial, platform: e.target.value})} /></InputGroup>
                            <InputGroup label="URL"><TextInput value={tempSocial.url} onChange={e => setTempSocial({...tempSocial, url: e.target.value})} /></InputGroup>
                            <FileUpload label="Icon" previewUrl={tempSocial.icon} onUpload={b64 => setTempSocial({...tempSocial, icon: b64})} recommendedSize="Small PNG" />
                            <div className="flex gap-4"><Button onClick={saveSocial} variant="success" disabled={!isSocialDirty}>Save</Button><Button onClick={() => setEditingSocialId(null)} variant="secondary">Cancel</Button></div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};
