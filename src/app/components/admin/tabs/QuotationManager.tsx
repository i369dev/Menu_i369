
import { useState, useMemo, useRef, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { Project } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, TextArea } from '../ui/AdminShared';
import { QuotationPreview } from '../QuotationPreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const QuotationManager: React.FC = () => {
    const { projects } = useContent();
    const [quoteId, setQuoteId] = useState('');

    const [details, setDetails] = useState({
        name: 'Mr Tharindu',
        mobile: '071 7075 724',
        business: 'Home Made Kitchen',
        address: '665 a nugape pamunugama Bopitiya ja ela',
        note: 'Thank you for choosing Imaginative369!\nWe can\'t wait to bring your vision to life!',
        projectId: projects[0]?.id || null,
        quantity: 10,
    });

    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newId = `QT-${Math.floor(100000 + Math.random() * 900000)}`;
        setQuoteId(newId);
    }, []);

    const selectedProject = useMemo(() => {
        return projects.find(p => p.id === details.projectId) || null;
    }, [details.projectId, projects]);

    const handleDetailChange = (field: keyof typeof details, value: string | number) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };
    
    const handleDownloadPdf = () => {
        const input = previewRef.current;
        if (!input) {
            alert("Preview element not found.");
            return;
        }

        // Temporarily make scrollbar invisible
        input.style.setProperty('--scrollbar-bg', 'transparent');

        html2canvas(input, {
            scale: 2, // Higher scale for better resolution
            useCORS: true,
            scrollY: -window.scrollY,
            windowWidth: input.scrollWidth,
            windowHeight: input.scrollHeight
        }).then(canvas => {
            // Restore scrollbar
            input.style.removeProperty('--scrollbar-bg');
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;
            
            const totalPages = Math.ceil(imgHeight / pdfHeight);

            for (let i = 0; i < totalPages; i++) {
                if (i > 0) pdf.addPage();
                const yPosition = - (i * pdfHeight);
                pdf.addImage(imgData, 'PNG', 0, yPosition, pdfWidth, imgHeight);
            }
            
            pdf.save(`Quotation-${quoteId}.pdf`);
        });
    };

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
            {/* Form Column */}
            <div className="xl:col-span-1">
                <Card className="sticky top-6">
                    <SectionHeader title="Create Quotation" />
                    <div className="space-y-4">
                        <InputGroup label="Select Project">
                            <select
                                value={details.projectId || ''}
                                onChange={e => handleDetailChange('projectId', Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            >
                                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                        </InputGroup>
                        <InputGroup label="Client Name"><TextInput value={details.name} onChange={e => handleDetailChange('name', e.target.value)} /></InputGroup>
                        <InputGroup label="Mobile Number"><TextInput value={details.mobile} onChange={e => handleDetailChange('mobile', e.target.value)} /></InputGroup>
                        <InputGroup label="Business / Hotel"><TextInput value={details.business} onChange={e => handleDetailChange('business', e.target.value)} /></InputGroup>
                        <InputGroup label="Delivery Address"><TextArea value={details.address} onChange={e => handleDetailChange('address', e.target.value)} rows={3} /></InputGroup>
                        <InputGroup label="Quantity"><TextInput type="number" value={details.quantity} onChange={e => handleDetailChange('quantity', Number(e.target.value))} /></InputGroup>
                        <InputGroup label="Notes"><TextArea value={details.note} onChange={e => handleDetailChange('note', e.target.value)} rows={3} /></InputGroup>
                        
                        <div className="pt-4 border-t border-gray-200">
                             <Button onClick={handleDownloadPdf} className="w-full" variant="success">Download as PDF</Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Preview Column */}
            <div className="xl:col-span-2">
                <div 
                    ref={previewRef} 
                    className="max-h-[calc(100vh-6rem)] overflow-y-auto bg-gray-200 p-8 shadow-inner rounded-lg"
                    style={{ '--scrollbar-bg': 'rgba(128, 128, 128, 0.4)' } as React.CSSProperties}
                >
                    <QuotationPreview 
                        details={details}
                        project={selectedProject}
                        quoteId={quoteId}
                    />
                </div>
            </div>
        </div>
    );
};
