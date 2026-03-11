
import { useState, useMemo, useRef, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { PrintRate, Project } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, TextArea, Select } from '../ui/AdminShared';
import { QuotationPreview } from '../QuotationPreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const getPriceForQuantity = (rate: PrintRate, quantity: number): number => {
    if (quantity < 51) return rate.price_tier1;
    if (quantity < 101) return rate.price_tier2;
    if (quantity < 501) return rate.price_tier3;
    if (quantity < 1001) return rate.price_tier4;
    return rate.price_tier5;
};

export const QuotationManager: React.FC = () => {
    const { projects, printRates, orders } = useContent();
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

    const [printSpec, setPrintSpec] = useState({
        inkCoverage: '', paperType: '', weight: '', sides: ''
    });

    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nextQuoteNumber = (orders ? orders.length + 1 : 1).toString().padStart(6, '0');
        const newId = `QT-${nextQuoteNumber}`;
        setQuoteId(newId);
        // Set initial specs if not set
        if (printRates.length > 0 && !printSpec.inkCoverage) {
            const firstRate = printRates[0];
            setPrintSpec({
                inkCoverage: firstRate.inkCoverage,
                paperType: firstRate.paperType,
                weight: firstRate.weight,
                sides: firstRate.sides
            });
        }
    }, [printRates, orders]);

    const selectedProject = useMemo(() => {
        return projects.find(p => p.id === details.projectId) || null;
    }, [details.projectId, projects]);

    // --- Cascading Dropdown Logic ---
    const specOptions = useMemo(() => {
        const inks = [...new Set(printRates.map(r => r.inkCoverage))];
        const papers = printSpec.inkCoverage ? [...new Set(printRates.filter(r => r.inkCoverage === printSpec.inkCoverage).map(r => r.paperType))] : [];
        const weights = printSpec.paperType ? [...new Set(printRates.filter(r => r.inkCoverage === printSpec.inkCoverage && r.paperType === printSpec.paperType).map(r => r.weight))] : [];
        const sides = printSpec.weight ? [...new Set(printRates.filter(r => r.inkCoverage === printSpec.inkCoverage && r.paperType === printSpec.paperType && r.weight === printSpec.weight).map(r => r.sides))] : [];
        return { inks, papers, weights, sides };
    }, [printRates, printSpec]);

    const handleSpecChange = (field: keyof typeof printSpec, value: string) => {
        setPrintSpec(prev => {
            const newState = { ...prev, [field]: value };
            // Reset dependent fields
            if (field === 'inkCoverage') { newState.paperType = ''; newState.weight = ''; newState.sides = ''; }
            if (field === 'paperType') { newState.weight = ''; newState.sides = ''; }
            if (field === 'weight') { newState.sides = ''; }
            return newState;
        });
    };

    const { designCost, printCost, selectedPrintRate } = useMemo(() => {
        const designCost = selectedProject?.pricing?.designOnly || 0;
        
        const rate = printRates.find(r => 
            r.inkCoverage === printSpec.inkCoverage &&
            r.paperType === printSpec.paperType &&
            r.weight === printSpec.weight &&
            r.sides === printSpec.sides
        );

        if (!rate) return { designCost, printCost: 0, selectedPrintRate: null };
        
        const unitPrice = getPriceForQuantity(rate, details.quantity);
        const totalPrintCost = unitPrice * details.quantity;
        
        return { designCost, printCost: totalPrintCost, selectedPrintRate: rate };
    }, [selectedProject, printRates, printSpec, details.quantity]);

    const totalCost = designCost + printCost;

    const handleDetailChange = (field: keyof typeof details, value: string | number) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };
    
    const handleDownloadPdf = async () => {
        const previewContainer = previewRef.current;
        if (!previewContainer) {
          alert("Preview element not found.");
          return;
        }

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageElements = previewContainer.querySelectorAll<HTMLDivElement>('.a4-page-container');
        
        if (pageElements.length === 0) {
            alert("No printable pages found in the preview.");
            return;
        }

        for (let i = 0; i < pageElements.length; i++) {
          const page = pageElements[i];
          if (i > 0) {
            pdf.addPage();
          }
          
          const canvas = await html2canvas(page, {
            scale: 3, useCORS: true, logging: false,
            width: page.offsetWidth,
            height: page.offsetHeight,
          });

          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
        
        pdf.save(`Quotation-${quoteId}.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
            {/* Form Column */}
            <div className="xl:col-span-1">
                <Card className="sticky top-6">
                    <SectionHeader title="Create Quotation" />
                    <div className="space-y-4">
                        <InputGroup label="Select Project">
                            <Select
                                value={details.projectId || ''}
                                onChange={e => handleDetailChange('projectId', Number(e.target.value))}
                            >
                                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </Select>
                        </InputGroup>
                        <hr />
                        <InputGroup label="Client Name"><TextInput value={details.name} onChange={e => handleDetailChange('name', e.target.value)} /></InputGroup>
                        <InputGroup label="Mobile Number"><TextInput value={details.mobile} onChange={e => handleDetailChange('mobile', e.target.value)} /></InputGroup>
                        <InputGroup label="Business / Hotel"><TextInput value={details.business} onChange={e => handleDetailChange('business', e.target.value)} /></InputGroup>
                        <InputGroup label="Delivery Address"><TextArea value={details.address} onChange={e => handleDetailChange('address', e.target.value)} rows={3} /></InputGroup>
                        <hr />
                        <h4 className="font-bold text-sm">Print Specifications</h4>
                        <InputGroup label="Ink Coverage">
                            <Select value={printSpec.inkCoverage} onChange={e => handleSpecChange('inkCoverage', e.target.value)}>
                                <option value="">Select...</option>
                                {specOptions.inks.map(o => <option key={o} value={o}>{o}</option>)}
                            </Select>
                        </InputGroup>
                        <InputGroup label="Paper Type">
                             <Select value={printSpec.paperType} onChange={e => handleSpecChange('paperType', e.target.value)} disabled={!printSpec.inkCoverage}>
                                <option value="">Select...</option>
                                {specOptions.papers.map(o => <option key={o} value={o}>{o}</option>)}
                            </Select>
                        </InputGroup>
                        <InputGroup label="Weight (GSM)">
                            <Select value={printSpec.weight} onChange={e => handleSpecChange('weight', e.target.value)} disabled={!printSpec.paperType}>
                                <option value="">Select...</option>
                                {specOptions.weights.map(o => <option key={o} value={o}>{o}</option>)}
                            </Select>
                        </InputGroup>
                        <InputGroup label="Sides">
                            <Select value={printSpec.sides} onChange={e => handleSpecChange('sides', e.target.value)} disabled={!printSpec.weight}>
                                <option value="">Select...</option>
                                {specOptions.sides.map(o => <option key={o} value={o}>{o}</option>)}
                            </Select>
                        </InputGroup>
                         <InputGroup label="Quantity"><TextInput type="number" value={details.quantity} onChange={e => handleDetailChange('quantity', Number(e.target.value))} /></InputGroup>
                        <hr />

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
                        printRate={selectedPrintRate}
                        designCost={designCost}
                        printCost={printCost}
                        totalCost={totalCost}
                    />
                </div>
            </div>
        </div>
    );
};
