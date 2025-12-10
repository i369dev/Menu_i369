
import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { TrustedClient } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, FileUpload, confirmDelete, Toggle } from '../ui/AdminShared';

export const ClientManager: React.FC = () => {
    const { trustedClients, setTrustedClients } = useContent();
    const [editingClientIndex, setEditingClientIndex] = useState<number | null>(null);
    const [tempClient, setTempClient] = useState<Partial<TrustedClient>>({});
    const [originalClient, setOriginalClient] = useState<Partial<TrustedClient>>({});

    const isClientDirty = JSON.stringify(tempClient) !== JSON.stringify(originalClient);

    const startEditClient = (client?: TrustedClient, index?: number) => {
        if (client && index !== undefined) {
            setEditingClientIndex(index);
            setTempClient({ ...client });
            setOriginalClient({ ...client });
        } else {
            setEditingClientIndex(-1); // Use -1 to signify a new client
            const empty = { business_name: '', logo_url: '', isVisible: true };
            setTempClient(empty);
            setOriginalClient(empty);
        }
    };

    const saveClient = () => {
        if (!tempClient.business_name) return alert("Business Name is required");
        const newClients = [...trustedClients];
        if (editingClientIndex === -1) {
            newClients.push(tempClient as TrustedClient);
        } else if (editingClientIndex !== null) {
            newClients[editingClientIndex] = tempClient as TrustedClient;
        }
        setTrustedClients(newClients);
        setEditingClientIndex(null);
    };

    const deleteClient = (index: number) => {
        if (confirmDelete("Remove client?")) {
            setTrustedClients(trustedClients.filter((_, i) => i !== index));
        }
    };

    const toggleVisibility = (index: number, visible: boolean) => {
        const newClients = trustedClients.map((client, i) => i === index ? { ...client, isVisible: visible } : client);
        setTrustedClients(newClients);
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
                {editingClientIndex === null ? (
                    <>
                    <SectionHeader title="Trusted Clients" action={<Button onClick={() => startEditClient()}>+ Add Client</Button>} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trustedClients.map((client, i) => (
                            <Card key={i} className={`p-4 flex flex-col items-center justify-center relative group min-h-[150px] ${client.isVisible === false ? 'opacity-60 bg-gray-50' : ''}`}>
                                <div className="absolute top-2 right-2 z-30">
                                     <Toggle checked={client.isVisible !== false} onChange={(val) => toggleVisibility(i, val)} />
                                </div>
                                {client.isVisible === false && <div className="absolute inset-0 bg-white/60 z-10 pointer-events-none flex items-center justify-center font-bold text-gray-500 text-xs">HIDDEN</div>}

                                {client.logo_url ? <img src={client.logo_url} className="max-h-16 w-auto" alt={client.business_name} /> : <span className="font-bold text-center">{client.business_name}</span>}
                                
                                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity z-20">
                                        <Button variant="secondary" className="text-xs" onClick={() => startEditClient(client, i)}>Edit</Button>
                                        <Button variant="danger" className="text-xs" onClick={() => deleteClient(i)}>Del</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                    <Card>
                    <SectionHeader title={editingClientIndex === -1 ? "Add Client" : "Edit Client"} />
                    <div className="space-y-4">
                        <InputGroup label="Name (Excluded from Translation)"><TextInput value={tempClient.business_name} onChange={e => setTempClient({...tempClient, business_name: e.target.value})} /></InputGroup>
                        <FileUpload label="Logo" previewUrl={tempClient.logo_url} onUpload={b64 => setTempClient({...tempClient, logo_url: b64})} onClear={() => setTempClient({...tempClient, logo_url: ''})} />
                        <div className="flex gap-4"><Button onClick={saveClient} variant="success" disabled={!isClientDirty}>Save</Button><Button onClick={() => setEditingClientIndex(null)} variant="secondary">Cancel</Button></div>
                    </div>
                    </Card>
            )}
        </div>
    );
};
