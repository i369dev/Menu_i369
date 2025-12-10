
import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { CuratedItem } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, TextArea, Button, FileUpload, LangTabs, confirmDelete, Toggle } from '../ui/AdminShared';

export const CurationManager: React.FC = () => {
    const { curatedItems, setCuratedItems, config, setConfig } = useContent();
    const [localConfig, setLocalConfig] = useState(config);
    const [configLang, setConfigLang] = useState<'en'|'si'|'ta'>('en');

    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [tempItem, setTempItem] = useState<Partial<CuratedItem>>({});
    const [originalItem, setOriginalItem] = useState<Partial<CuratedItem>>({});

    const isItemDirty = JSON.stringify(tempItem) !== JSON.stringify(originalItem);
    const isCurationTextDirty = 
        localConfig.curationIntro !== config.curationIntro ||
        localConfig.curationIntro_si !== config.curationIntro_si ||
        localConfig.curationIntro_ta !== config.curationIntro_ta;

    const saveCurationText = () => {
        setConfig(localConfig);
        alert("Curation text updated!");
    };

    const startEditItem = (item?: CuratedItem) => {
        if (item) {
            setEditingItemId(item.id);
            setTempItem({ ...item });
            setOriginalItem({ ...item });
        } else {
            setEditingItemId(-1);
            const empty = { id: Date.now(), title: '', artist: '', image: '', video: '', isVisible: true };
            setTempItem(empty);
            setOriginalItem(empty);
        }
    };

    const saveItem = () => {
        if (!tempItem.title) return alert("Title is required");
        let newItems;
        if (editingItemId === -1) {
            newItems = [...curatedItems, tempItem as CuratedItem];
        } else {
            newItems = curatedItems.map(i => i.id === editingItemId ? tempItem as CuratedItem : i);
        }
        setCuratedItems(newItems);
        setEditingItemId(null);
    };

    const deleteItem = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirmDelete("Permanently delete this showcase item?")) {
            const updatedItems = curatedItems.filter(i => i.id !== id);
            setCuratedItems(updatedItems);
        }
    };

    const toggleVisibility = (id: number, visible: boolean) => {
        const updated = curatedItems.map(i => i.id === id ? { ...i, isVisible: visible } : i);
        setCuratedItems(updated);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
                <Card className="mb-8 bg-blue-50 border-blue-100">
                <SectionHeader title="Curation Page Text" />
                <LangTabs active={configLang} onChange={setConfigLang} />
                {configLang === 'en' && <InputGroup label="Intro Subheading (EN)"><TextArea value={localConfig.curationIntro} onChange={e => setLocalConfig({ ...localConfig, curationIntro: e.target.value })} rows={2} /></InputGroup>}
                {configLang === 'si' && <InputGroup label="Intro Subheading (SI)"><TextArea value={localConfig.curationIntro_si || ''} onChange={e => setLocalConfig({ ...localConfig, curationIntro_si: e.target.value })} rows={2} /></InputGroup>}
                {configLang === 'ta' && <InputGroup label="Intro Subheading (TA)"><TextArea value={localConfig.curationIntro_ta || ''} onChange={e => setLocalConfig({ ...localConfig, curationIntro_ta: e.target.value })} rows={2} /></InputGroup>}
                <div className="mt-4 flex justify-end">
                    <Button onClick={saveCurationText} variant="success" disabled={!isCurationTextDirty}>Save Text</Button>
                </div>
            </Card>

            {editingItemId === null ? (
                <>
                    <SectionHeader title="Showcase Items" action={<Button onClick={() => startEditItem()}>+ Add Item</Button>} />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {curatedItems.map(item => (
                            <Card key={item.id} className="p-4 group relative">
                                <div className="absolute top-2 right-2 z-20">
                                     <Toggle checked={item.isVisible !== false} onChange={(val) => toggleVisibility(item.id, val)} />
                                </div>
                                {item.isVisible === false && <div className="absolute inset-0 bg-white/60 z-10 pointer-events-none flex items-center justify-center font-bold text-gray-500">HIDDEN</div>}
                                
                                <div className="aspect-[3/4] bg-gray-100 mb-4 rounded overflow-hidden relative">
                                    {item.video ? <video src={item.video} className="w-full h-full object-cover" /> : <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                                        <Button variant="secondary" onClick={() => startEditItem(item)} className="text-xs">Edit</Button>
                                        <Button variant="danger" onClick={(e) => deleteItem(item.id, e)} className="text-xs">Del</Button>
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-900 truncate">{item.title}</h4>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                    <Card className="animate-in fade-in">
                    <SectionHeader title={editingItemId === -1 ? "New Item" : "Edit Item"} />
                    <div className="space-y-6">
                        <InputGroup label="Title"><TextInput value={tempItem.title} onChange={e => setTempItem({...tempItem, title: e.target.value})} /></InputGroup>
                        <InputGroup label="Artist"><TextInput value={tempItem.artist} onChange={e => setTempItem({...tempItem, artist: e.target.value})} /></InputGroup>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload label="Image" previewUrl={tempItem.image} onUpload={b64 => setTempItem({...tempItem, image: b64})} />
                            <FileUpload label="Video (MP4)" accept="video/mp4" previewUrl={tempItem.video} onUpload={b64 => setTempItem({...tempItem, video: b64})} onClear={() => setTempItem({...tempItem, video: ''})} />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button onClick={saveItem} variant="success" disabled={!isItemDirty}>Save Item</Button>
                            <Button onClick={() => setEditingItemId(null)} variant="secondary">Cancel</Button>
                        </div>
                    </div>
                    </Card>
            )}
        </div>
    );
};
