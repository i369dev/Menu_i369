
import { useState, useMemo, useRef, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { PrintRate, Project, FinishingRatesConfig } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, TextArea, Select } from '../ui/AdminShared';
import { QuotationPreview } from '../QuotationPreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';

const getPriceForQuantity = (rate: PrintRate, quantity: number, markup: number): number => {
    const finalMarkup = 1 + (markup / 100);
    if (quantity < 51) return rate.price_tier1 * finalMarkup;
    if (quantity < 101) return rate.price_tier2 * finalMarkup;
    if (quantity < 501) return rate.price_tier3 * finalMarkup;
    if (quantity < 1001) return rate.price_tier4 * finalMarkup;
    return rate.price_tier5 * finalMarkup;
};

export const QuotationManager: React.FC = () => {
    const { projects, printRates, orders, finishingRates, config } = useContent();
    const [quoteId, setQuoteId] = useState('');
    const [issueDate, setIssueDate] = useState(new Date());
    const [expiryDate, setExpiryDate] = useState<Date | undefined>(addDays(new Date(), 7));
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [details, setDetails] = useState({
        name: '',
        mobile: '',
        business: '',
        address: '',
        note: 'Thank you for choosing Imaginative369!\nWe can\'t wait to bring your vision to life!',
        projectId: null as number | null,
        quantity: '' as number | '',
    });

    const [printSpec, setPrintSpec] = useState({
        inkCoverage: '', paperType: '', weight: '', sides: ''
    });

    const [finishing, setFinishing] = useState({
        pouchLaminating: 'none' as 'none' | 'a4' | 'a3',
        laminating: 'none' as 'none' | 'silky' | 'matte' | 'gloss',
        laminatingSize: 'a4' as 'a4' | 'a3',
        board: 'none' as 'none' | 'sunboard_single' | 'sunboard_double' | 'cladding_single' | 'cladding_double' | 'corrugated_single' | 'corrugated_double',
        boardIsCustom: false,
        boardWidth: '',
        boardHeight: '',
        boardUnit: 'in' as 'in' | 'mm',
        leatherCover: 'none' as 'none' | 'a5' | 'a4' | 'a3' | 'a3_third',
        binding: 'none' as 'none' | 'spiral',
    });

    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const nextQuoteNumber = (orders ? orders.length + 1 : 1).toString().padStart(6, '0');
        const newId = `QT-${nextQuoteNumber}`;
        setQuoteId(newId);
    }, [printRates, orders]);

    const selectedProject = useMemo(() => {
        return projects.find(p => p.id === details.projectId) || null;
    }, [details.projectId, projects]);

    const showLaminatingOptions = useMemo(() => {
        const validProjects = ["A3 TRIFOLD MENU", "A4 MENU BOOKLET", "11.75x5.75 MENU BOOKLET", "A4 TRIFOLD", "A3 TRIFOLD"];
        return validProjects.includes(selectedProject?.title || '');
    }, [selectedProject]);

    const showBoardOptions = useMemo(() => {
        return (selectedProject?.title === 'A3') || finishing.boardIsCustom;
    }, [selectedProject, finishing.boardIsCustom]);

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
            if (field === 'inkCoverage') { newState.paperType = ''; newState.weight = ''; newState.sides = ''; }
            if (field === 'paperType') { newState.weight = ''; newState.sides = ''; }
            if (field === 'weight') { newState.sides = ''; }
            return newState;
        });
    };

    const { designCost, printCost, selectedPrintRate, finishingCost, finishingDetails } = useMemo(() => {
        const quantity = Number(details.quantity) || 0;
        const designCost = selectedProject?.pricing?.designOnly || 0;
        const markup = config.quoteMarkupPercentage || 0;
        
        const rate = printRates.find(r => 
            r.inkCoverage === printSpec.inkCoverage &&
            r.paperType === printSpec.paperType &&
            r.weight === printSpec.weight &&
            r.sides === printSpec.sides
        );
        const printCost = rate ? getPriceForQuantity(rate, quantity, markup) * quantity : 0;
        
        let totalFinishingCost = 0;
        const finishingItems: { description: string, cost: number, qty: number }[] = [];
        const finalMarkup = 1 + (markup / 100);

        if (finishing.pouchLaminating !== 'none') {
            const cost = finishingRates.pouchLaminating[finishing.pouchLaminating] * finalMarkup * quantity;
            totalFinishingCost += cost;
            finishingItems.push({ description: `Pouch Laminating (${finishing.pouchLaminating.toUpperCase()})`, cost, qty: quantity });
        }

        if (finishing.laminating !== 'none' && showLaminatingOptions) {
            const cost = finishingRates.laminating[finishing.laminatingSize][finishing.laminating] * finalMarkup * quantity;
            totalFinishingCost += cost;
            finishingItems.push({ description: `${finishing.laminating.charAt(0).toUpperCase() + finishing.laminating.slice(1)} Laminating (${finishing.laminatingSize.toUpperCase()})`, cost, qty: quantity });
        }

        if (finishing.board !== 'none' && showBoardOptions) {
            let widthIn = parseFloat(finishing.boardWidth);
            let heightIn = parseFloat(finishing.boardHeight);
            if (finishing.boardIsCustom) {
                if (finishing.boardUnit === 'mm') { widthIn /= 25.4; heightIn /= 25.4; }
            } else if (selectedProject?.title === 'A3') {
                widthIn = 11.7; heightIn = 16.5;
            }
            if (!isNaN(widthIn) && !isNaN(heightIn) && widthIn > 0 && heightIn > 0) {
                const area = widthIn * heightIn;
                const ratePerSqIn = finishingRates.boardPrice[finishing.board as keyof typeof finishingRates.boardPrice];
                const cost = area * ratePerSqIn * finalMarkup * quantity;
                totalFinishingCost += cost;
                finishingItems.push({ description: `${finishing.board.replace(/_/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, l => l.toUpperCase())} Board`, cost, qty: quantity });
            }
        }
        
        if (finishing.leatherCover !== 'none') {
            const cost = finishingRates.leatherCover[finishing.leatherCover] * finalMarkup * quantity;
            totalFinishingCost += cost;
            finishingItems.push({ description: `Leather Cover (${finishing.leatherCover.toUpperCase().replace('_THIRD', ' 1/3')})`, cost, qty: quantity });
        }

        if (finishing.binding !== 'none') {
            const cost = finishingRates.binding[finishing.binding] * finalMarkup * quantity;
            totalFinishingCost += cost;
            finishingItems.push({ description: `Spiral Binding`, cost, qty: quantity });
        }

        return { designCost, printCost, selectedPrintRate: rate || null, finishingCost: totalFinishingCost, finishingDetails: finishingItems };
    }, [selectedProject, printRates, printSpec, details.quantity, finishing, finishingRates, showLaminatingOptions, showBoardOptions, config.quoteMarkupPercentage]);

    const totalCost = designCost + printCost + finishingCost;

    const handleDetailChange = (field: keyof typeof details, value: string | number | null) => {
        setDetails(prev => ({ ...prev, [field]: value }));
    };
    
    const handleDownloadPdf = async () => {
        const previewContainer = previewRef.current;
        if (!previewContainer) { alert("Preview element not found."); return; }
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageElements = previewContainer.querySelectorAll<HTMLDivElement>('.a4-page-container');
        if (pageElements.length === 0) { alert("No printable pages found."); return; }
        for (let i = 0; i < pageElements.length; i++) {
          const page = pageElements[i];
          if (i > 0) pdf.addPage();
          const canvas = await html2canvas(page, { scale: 3, useCORS: true, logging: false, width: page.offsetWidth, height: page.offsetHeight });
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }
        pdf.save(`Quotation-${quoteId}.pdf`);
    };

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
            <div className="xl:col-span-1">
                <Card className="sticky top-6">
                    <SectionHeader title="Create Quotation" />
                    <div className="space-y-4">
                        <InputGroup label="Client Name"><TextInput value={details.name} onChange={e => handleDetailChange('name', e.target.value)} /></InputGroup>
                        <InputGroup label="Mobile Number"><TextInput value={details.mobile} onChange={e => handleDetailChange('mobile', e.target.value)} /></InputGroup>
                        <InputGroup label="Business / Hotel"><TextInput value={details.business} onChange={e => handleDetailChange('business', e.target.value)} /></InputGroup>
                        <InputGroup label="Delivery Address"><TextArea value={details.address} onChange={e => handleDetailChange('address', e.target.value)} rows={3} /></InputGroup>
                        <hr />
                        <div className="grid grid-cols-2 gap-4">
                           <InputGroup label="Issue Date"><TextInput value={format(issueDate, 'PPP')} disabled /></InputGroup>
                           <InputGroup label="Expiry Date">
                                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !expiryDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={expiryDate} onSelect={(date) => { setExpiryDate(date); setIsCalendarOpen(false); }} initialFocus /></PopoverContent>
                                </Popover>
                            </InputGroup>
                        </div>
                        
                        <InputGroup label="Select Project">
                            <Select value={details.projectId || ''} onChange={e => handleDetailChange('projectId', Number(e.target.value) || null)}>
                                <option value="">Select a Project...</option>
                                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </Select>
                        </InputGroup>
                        <hr />

                        <h4 className="font-bold text-sm">Print Specifications</h4>
                        <InputGroup label="Ink Coverage"><Select value={printSpec.inkCoverage} onChange={e => handleSpecChange('inkCoverage', e.target.value)}><option value="">Select...</option>{specOptions.inks.map(o => <option key={o} value={o}>{o}</option>)}</Select></InputGroup>
                        <InputGroup label="Paper Type"><Select value={printSpec.paperType} onChange={e => handleSpecChange('paperType', e.target.value)} disabled={!printSpec.inkCoverage}><option value="">Select...</option>{specOptions.papers.map(o => <option key={o} value={o}>{o}</option>)}</Select></InputGroup>
                        <InputGroup label="Weight (GSM)"><Select value={printSpec.weight} onChange={e => handleSpecChange('weight', e.target.value)} disabled={!printSpec.paperType}><option value="">Select...</option>{specOptions.weights.map(o => <option key={o} value={o}>{o}</option>)}</Select></InputGroup>
                        <InputGroup label="Sides"><Select value={printSpec.sides} onChange={e => handleSpecChange('sides', e.target.value)} disabled={!printSpec.weight}><option value="">Select...</option>{specOptions.sides.map(o => <option key={o} value={o}>{o}</option>)}</Select></InputGroup>
                        <InputGroup label="Quantity"><TextInput type="number" value={details.quantity} onChange={e => handleDetailChange('quantity', Number(e.target.value))} /></InputGroup>
                        <hr />
                        <h4 className="font-bold text-sm mt-4">Finishing & Materials</h4>
                        
                        {showLaminatingOptions && (
                            <div className="p-3 my-2 bg-gray-50 rounded-lg border">
                                <h5 className="text-xs font-bold mb-2">Lamination</h5>
                                <InputGroup label="Pouch Laminating"><Select value={finishing.pouchLaminating} onChange={e => setFinishing({...finishing, pouchLaminating: e.target.value as any, laminating: 'none'})}><option value="none">None</option><option value="a4">A4 Pouch</option><option value="a3">A3 Pouch</option></Select></InputGroup>
                                <InputGroup label="Standard Laminating"><Select value={finishing.laminating} onChange={e => setFinishing({...finishing, laminating: e.target.value as any, pouchLaminating: 'none'})}><option value="none">None</option><option value="silky">Silky Matte</option><option value="matte">Matte</option><option value="gloss">Gloss</option></Select></InputGroup>
                                {finishing.laminating !== 'none' && (<InputGroup label="Laminating Size"><Select value={finishing.laminatingSize} onChange={e => setFinishing({...finishing, laminatingSize: e.target.value as any})}><option value="a4">A4</option><option value="a3">A3</option></Select></InputGroup>)}
                            </div>
                        )}

                        <div className="p-3 my-2 bg-gray-50 rounded-lg border">
                            <h5 className="text-xs font-bold mb-2">Board Mounting</h5>
                            <label className="flex items-center gap-2 text-sm mb-2"><input type="checkbox" checked={finishing.boardIsCustom} onChange={e => setFinishing({...finishing, boardIsCustom: e.target.checked})} /> Use Custom Board Size</label>
                            {showBoardOptions && (
                                <>
                                    <InputGroup label="Board Type"><Select value={finishing.board} onChange={e => setFinishing({...finishing, board: e.target.value as any})}><option value="none">None</option><option value="sunboard_single">Sunboard (Single)</option><option value="sunboard_double">Sunboard (Double)</option><option value="cladding_single">Cladding (Single)</option><option value="cladding_double">Cladding (Double)</option><option value="corrugated_single">Corrugated (Single)</option><option value="corrugated_double">Corrugated (Double)</option></Select></InputGroup>
                                    {finishing.boardIsCustom && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <InputGroup label="W"><TextInput placeholder="Width" value={finishing.boardWidth} onChange={e => setFinishing({...finishing, boardWidth: e.target.value})} /></InputGroup>
                                            <InputGroup label="H"><TextInput placeholder="Height" value={finishing.boardHeight} onChange={e => setFinishing({...finishing, boardHeight: e.target.value})} /></InputGroup>
                                            <InputGroup label="Unit"><Select value={finishing.boardUnit} onChange={e => setFinishing({...finishing, boardUnit: e.target.value as any})}><option value="in">Inches</option><option value="mm">mm</option></Select></InputGroup>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="p-3 my-2 bg-gray-50 rounded-lg border">
                            <h5 className="text-xs font-bold mb-2">Cover & Binding</h5>
                            <InputGroup label="Leather Cover"><Select value={finishing.leatherCover} onChange={e => setFinishing({...finishing, leatherCover: e.target.value as any})}><option value="none">None</option><option value="a5">A5</option><option value="a4">A4</option><option value="a3">A3</option><option value="a3_third">A3 (1/3)</option></Select></InputGroup>
                            <InputGroup label="Binding"><Select value={finishing.binding} onChange={e => setFinishing({...finishing, binding: e.target.value as any})}><option value="none">None</option><option value="spiral">Spiral Binding</option></Select></InputGroup>
                        </div>
                        <hr />

                        <InputGroup label="Notes"><TextArea value={details.note} onChange={e => handleDetailChange('note', e.target.value)} rows={3} /></InputGroup>
                        
                        <div className="pt-4 border-t border-gray-200">
                             <Button onClick={handleDownloadPdf} className="w-full" variant="success">Download as PDF</Button>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="xl:col-span-2">
                <div ref={previewRef} className="max-h-[calc(100vh-6rem)] overflow-y-auto bg-gray-200 p-8 shadow-inner rounded-lg" style={{ '--scrollbar-bg': 'rgba(128, 128, 128, 0.4)' } as React.CSSProperties}>
                    <QuotationPreview 
                        details={{...details, quantity: Number(details.quantity) || 0 }}
                        project={selectedProject}
                        quoteId={quoteId}
                        printRate={selectedPrintRate}
                        designCost={designCost}
                        printCost={printCost}
                        totalCost={totalCost}
                        issueDate={issueDate}
                        expiryDate={expiryDate || new Date()}
                        finishingDetails={finishingDetails}
                    />
                </div>
            </div>
        </div>
    );
};
