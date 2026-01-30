
import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { TrustedClient } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, FileUpload, confirmDelete, Toggle } from '../ui/AdminShared';
import { uploadFileToStorage } from '../../../utils/storage';

export const ClientManager: React.FC = () => {
    const { trustedClients, setTrustedClients } = useContent();
    const [editingClientIndex, setEditingClientIndex] = useState<number | null>(null);
    const [tempClient, setTempClient] = useState<Partial<TrustedClient>>({});
    
    // New state for file object
    const [logoFile, setLogoFile] = useState<File | null>(null);
    
    const startEditClient = (client?: TrustedClient, index?: number) => {
        if (client && index !== undefined) {
            setEditingClientIndex(index);
            setTempClient({ ...client });
        } else {
            setEditingClientIndex(-1);
            setTempClient({ business_name: '', logo_url: '', isVisible: true });
        }
        setLogoFile(null); // Reset file on new edit
    };

    const saveClient = async () => {
        if (!tempClient.business_name) {
            alert("Business Name is required");
            return;
        }
        
        let updatedClient: Partial<TrustedClient> = { ...tempClient };
        
        if (logoFile) {
            try {
                const path = `clients/${Date.now()}_${logoFile.name}`;
                updatedClient.logo_url = await uploadFileToStorage(logoFile, path);
            } catch (error) {
                console.error("Error uploading logo:", error);
                alert("Logo upload failed. Please try again.");
                return;
            }
        }

        // Ensure logo_url is not undefined if no new file was uploaded but an old one existed
        if (updatedClient.logo_url === undefined) {
            updatedClient.logo_url = '';
        }

        let newClients;
        if (editingClientIndex === -1) {
            // Add new client
            newClients = [...trustedClients, updatedClient as TrustedClient];
        } else if (editingClientIndex !== null) {
            // Update existing client
            newClients = trustedClients.map((c, i) => i === editingClientIndex ? updatedClient as TrustedClient : c);
        } else {
            return; // Should not happen
        }

        try {
            await setTrustedClients(newClients);
            alert('Client saved successfully!');
            setEditingClientIndex(null);
            setTempClient({});
            setLogoFile(null);
        } catch (error) {
            console.error("Error saving clients:", error);
            alert("Failed to save client data to the database.");
        }
    };

    const deleteClient = async (index: number) => {
        if (confirmDelete("Remove this client? This action is permanent.")) {
            try {
                await setTrustedClients(trustedClients.filter((_, i) => i !== index));
                 alert('Client deleted successfully!');
            } catch(e) {
                alert('Failed to delete client.');
            }
        }
    };

    const toggleVisibility = async (index: number, visible: boolean) => {
        const newClients = trustedClients.map((client, i) => i === index ? { ...client, isVisible: visible } : client);
        try {
            await setTrustedClients(newClients);
        } catch(e) {
            alert('Failed to update visibility.');
        }
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

                                {client.logo_url ? <img src={client.logo_url} className="max-h-16 w-auto object-contain" alt={client.business_name} /> : <span className="font-bold text-center">{client.business_name}</span>}
                                
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
                        <InputGroup label="Name (Excluded from Translation)"><TextInput value={tempClient.business_name || ''} onChange={e => setTempClient({...tempClient, business_name: e.target.value})} /></InputGroup>
                        <FileUpload 
                            label="Logo" 
                            previewUrl={logoFile ? URL.createObjectURL(logoFile) : tempClient.logo_url} 
                            onFileSelect={setLogoFile} 
                            onClear={() => {setLogoFile(null); setTempClient({...tempClient, logo_url: ''})}} 
                        />
                        <div className="flex gap-4"><Button onClick={saveClient} variant="success">Save</Button><Button onClick={() => setEditingClientIndex(null)} variant="secondary">Cancel</Button></div>
                    </div>
                    </Card>
            )}
        </div>
    );
};
