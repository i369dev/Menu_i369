import { useState, useCallback } from 'react';
import { useContent } from '../../../context/ContentContext';
import { Project, ProjectMedia } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, FileUpload, confirmDelete, SortableList, Toggle, Textarea } from '../ui/AdminShared';
import { uploadFileToStorage } from '../../../utils/storage';

export const ProjectManager: React.FC = () => {
    const { projects, setProjects } = useContent();

    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [tempProject, setTempProject] = useState<Partial<Project>>({});
    const [originalProject, setOriginalProject] = useState<Partial<Project>>({});
    const [projectLang, setProjectLang] = useState<'en'|'si'|'ta'>('en'); 

    // New state for file objects
    const [mainImageFile, setMainImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [detailImageFiles, setDetailImageFiles] = useState<(File | string)[]>([]);

    const isProjectDirty = JSON.stringify(tempProject) !== JSON.stringify(originalProject) || mainImageFile !== null || videoFile !== null || detailImageFiles.some(f => f instanceof File);

    const startEditProject = (p?: Project) => {
        if (p) {
            setEditingProjectId(p.id);
            const copy = JSON.parse(JSON.stringify(p));
            setTempProject(copy);
            setOriginalProject(copy);
            setDetailImageFiles(copy.detailImages || []);
        } else {
            setEditingProjectId(-1);
            const empty = {
                id: Date.now(),
                title: '', subtitle: '', year: 'Rs. 0', location: 'ISLAND-WIDE', category: 'Menu Design', image: '', video: '', description: '', services: [], detailImages: [], themeColor: '#ffffff', textColor: '#000000', pricing: { designOnly: 0, designAndPrint: { minQty: 10, basePrice: 0, unitPrice: 0 } },
                isVisible: true
            };
            setTempProject(empty);
            setOriginalProject(empty);
            setDetailImageFiles([]);
        }
        setMainImageFile(null);
        setVideoFile(null);
    };

    const saveProject = async () => {
        if (!tempProject.title) return alert("Title is required");
        let updatedProject = { ...tempProject };
        const db = getFirestore(); // Firestore සම්බන්ධ කිරීම

        try {
            if (mainImageFile) {
                const path = `projects/${Date.now()}_${mainImageFile.name}`;
                updatedProject.image = await uploadFileToStorage(mainImageFile, path);
            }
            if (videoFile) {
                const path = `projects/${Date.now()}_${videoFile.name}`;
                updatedProject.video = await uploadFileToStorage(videoFile, path);
            }
            
            const uploadedDetailImageUrls = await Promise.all(
                detailImageFiles.map(async (fileOrUrl) => {
                    if (fileOrUrl instanceof File) {
                        const path = `projects/${Date.now()}_${fileOrUrl.name}`;
                        return await uploadFileToStorage(fileOrUrl, path);
                    }
                    return fileOrUrl;
                })
            );
            updatedProject.detailImages = uploadedDetailImageUrls;

            // දත්ත Database එකට Save කරන කොටස
            const projectIdString = updatedProject.id ? updatedProject.id.toString() : Date.now().toString();
            await setDoc(doc(db, "projects", projectIdString), updatedProject);

        } catch (error) {
            console.error("Error uploading file or saving to database:", error);
            alert("Save failed! Please check console.");
            return;
        }
        
        let newProjects;
        if (editingProjectId === -1) {
            newProjects = [...projects, updatedProject as Project];
        } else {
            newProjects = projects.map(p => p.id === editingProjectId ? updatedProject as Project : p);
        }
        
        setProjects(newProjects);
        alert("Saved Successfully!");
        setEditingProjectId(null);
    };

    const handleDeleteClick = async (id: number) => {
        if (confirmDelete("Permanently delete this project?")) {
            try {
                const db = getFirestore();
                await deleteDoc(doc(db, "projects", id.toString()));
                setProjects(projects.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting document:", error);
                alert("Failed to delete project from database.");
            }
        }
    };

    const toggleVisibility = async (id: number, visible: boolean) => {
        const db = getFirestore();
        const updated = projects.map(p => p.id === id ? { ...p, isVisible: visible } : p);
        setProjects(updated);
        
        try {
            const projectToUpdate = projects.find(p => p.id === id);
            if(projectToUpdate) {
                 await setDoc(doc(db, "projects", id.toString()), { ...projectToUpdate, isVisible: visible }, { merge: true });
            }
        } catch (error) {
            console.error("Error updating visibility:", error);
        }
    };

    if (editingProjectId !== null) {
        return (
            <div className="max-w-5xl mx-auto pb-20">
                <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <SectionHeader title={editingProjectId === -1 ? "Create Project" : "Edit Project"} />
                    <div className="space-y-8">
                        {/* Universal Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Project Title (English)" subLabel="Must be UPPERCASE.">
                                <TextInput value={tempProject.title || ''} onChange={e => setTempProject({...tempProject, title: e.target.value.toUpperCase()})} />
                            </InputGroup>
                            <InputGroup label="Category">
                                    <TextInput value={tempProject.category || ''} onChange={e => setTempProject({...tempProject, category: e.target.value})} />
                            </InputGroup>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Localized Content */}
                        <div>
                            <LangTabs active={projectLang} onChange={setProjectLang} />
                            {projectLang === 'en' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <InputGroup label="Subtitle (English)"><TextInput value={tempProject.subtitle || ''} onChange={e => setTempProject({...tempProject, subtitle: e.target.value})} /></InputGroup>
                                    <InputGroup label="Description (English)"><TextArea value={tempProject.description || ''} onChange={e => setTempProject({...tempProject, description: e.target.value})} rows={4} /></InputGroup>
                                </div>
                            )}
                            {projectLang === 'si' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <InputGroup label="Subtitle (Sinhala)"><TextInput value={tempProject.subtitle_si || ''} onChange={e => setTempProject({...tempProject, subtitle_si: e.target.value})} /></InputGroup>
                                    <InputGroup label="Description (Sinhala)"><TextArea value={tempProject.description_si || ''} onChange={e => setTempProject({...tempProject, description_si: e.target.value})} rows={4} /></InputGroup>
                                </div>
                            )}
                            {projectLang === 'ta' && (
                                <div className="space-y-4 animate-in fade-in">
                                    <InputGroup label="Subtitle (Tamil)"><TextInput value={tempProject.subtitle_ta || ''} onChange={e => setTempProject({...tempProject, subtitle_ta: e.target.value})} /></InputGroup>
                                    <InputGroup label="Description (Tamil)"><TextArea value={tempProject.description_ta || ''} onChange={e => setTempProject({...tempProject, description_ta: e.target.value})} rows={4} /></InputGroup>
                                </div>
                            )}
                        </div>

                        <hr className="border-gray-100" />
                        
                        {/* Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputGroup label="Design Only Price (Rs)">
                                <TextInput type="number" value={tempProject.pricing?.designOnly || 0} onChange={e => setTempProject({...tempProject, pricing: { ...tempProject.pricing!, designOnly: parseFloat(e.target.value) || 0 }})} />
                            </InputGroup>
                            <InputGroup label="Base Design & Print Price (Rs)">
                                <TextInput type="number" value={tempProject.pricing?.designAndPrint?.basePrice || 0} onChange={e => setTempProject({...tempProject, pricing: { ...tempProject.pricing!, designAndPrint: { ...tempProject.pricing!.designAndPrint!, basePrice: parseFloat(e.target.value) || 0 } }})} />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <InputGroup label="Included Cards (Min Qty)">
                                <TextInput 
                                    type="number" 
                                    value={tempProject.pricing?.designAndPrint?.minQty || 10} 
                                    onChange={e => setTempProject({
                                        ...tempProject, 
                                        pricing: { 
                                            ...tempProject.pricing!, 
                                            designAndPrint: { 
                                                ...tempProject.pricing!.designAndPrint!, 
                                                minQty: parseInt(e.target.value) || 10 
                                            } 
                                        }
                                    })} 
                                />
                            </InputGroup>
                            <InputGroup label="Incremental Unit Price">
                                <TextInput 
                                    type="number" 
                                    value={tempProject.pricing?.designAndPrint?.unitPrice || 0} 
                                    onChange={e => setTempProject({
                                        ...tempProject, 
                                        pricing: { 
                                            ...tempProject.pricing!, 
                                            designAndPrint: { 
                                                ...tempProject.pricing!.designAndPrint!, 
                                                unitPrice: parseFloat(e.target.value) || 0 
                                            } 
                                        }
                                    })} 
                                />
                            </InputGroup>
                        </div>

                        {/* Assets */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload 
                                label="Main Image" 
                                previewUrl={mainImageFile ? URL.createObjectURL(mainImageFile) : tempProject.image} 
                                onFileSelect={setMainImageFile}
                            />
                            <FileUpload 
                                label="Background Video" 
                                previewUrl={videoFile ? URL.createObjectURL(videoFile) : tempProject.video}
                                onFileSelect={setVideoFile}
                                accept="video/mp4"
                                onClear={() => { setVideoFile(null); setTempProject({...tempProject, video: ''})}}
                            />
                        </div>

                        {/* Gallery Upload */}
                        <MultiFileUpload 
                            label="Gallery Images"
                            files={detailImageFiles}
                            onUpdate={setDetailImageFiles}
                        />

                        <div className="flex gap-4 pt-6 border-t border-gray-100">
                            <Button onClick={saveProject} variant="success" disabled={!isProjectDirty}>Save Project</Button>
                            <Button onClick={() => setEditingProjectId(null)} variant="secondary">Cancel</Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <SectionHeader 
                title="Menu Design Projects" 
                action={<Button onClick={() => startEditProject()}>+ Add New Project</Button>} 
            />
            <div className="grid grid-cols-1 gap-6">
                {projects.map(p => (
                    <Card 
                        key={p.id} 
                        className="flex flex-col md:flex-row gap-6 hover:border-blue-300 transition-colors group cursor-pointer relative" 
                        onClick={() => startEditProject(p)}
                    >
                        {p.isVisible === false && (
                             <div className="absolute inset-0 bg-white/50 z-10 pointer-events-none rounded-lg" />
                        )}

                        <div className="w-full md:w-32 h-32 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{p.title} {p.isVisible === false && <span className="text-red-500 text-xs ml-2">(Hidden)</span>}</h4>
                                    <p className="text-sm text-gray-500">{p.subtitle}</p>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-600">{p.category}</span>
                            </div>
                            <div className="mt-4 flex gap-3 items-center" onClick={(e) => e.stopPropagation()}>
                                <Toggle checked={p.isVisible !== false} onChange={(val) => toggleVisibility(p.id, val)} />
                                <div className="h-4 w-px bg-gray-300 mx-2" />
                                <Button variant="secondary" onClick={() => startEditProject(p)} className="text-xs">Edit</Button>
                                <Button 
                                    variant="danger" 
                                    onClick={() => handleDeleteClick(p.id)} 
                                    className="text-xs"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};