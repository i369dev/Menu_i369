
import { useState, useMemo, useRef, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { PrintRate, Project, FinishingRatesConfig, Quotation, QuotationItem } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, TextArea, Select, confirmDelete } from '../ui/AdminShared';
import { QuotationPreview } from '../QuotationPreview';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';

const getPriceForQuantity = (rate: PrintRate, quantity: number, markup: number): number => {
    const finalMarkup = 1 + (markup / 100);
    if (quantity < 51) return rate.price_tier1 * finalMarkup;
    if (quantity < 101) return rate.price_tier2 * finalMarkup;
    if (quantity < 501) return rate.price_tier3 * finalMarkup;
    if (quantity < 1001) return rate.price_tier4 * finalMarkup;
    return rate.price_tier5 * finalMarkup;
};

export const QuotationManager: React.FC = () => {
    const { projects, printRates, orders, finishingRates, config, addQuotation } = useContent();
    
    const [quoteId, setQuoteId] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const [details, setDetails] = useState({
        name: '',
        mobile: '',
        business: '',
        address: '',
        note: 'Thank you for choosing Imaginative369!\nWe can\'t wait to bring your vision to life!',
        issueDate: new Date(),
        expiryDate: addDays(new Date(), 7),
    });

    const [items, setItems] = useState<QuotationItem[]>([]);
    const [currentItem, setCurrentItem] = useState<Partial<QuotationItem>>({});

    const previewRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const nextQuoteNumber = (orders ? orders.length + 1 : 1).toString().padStart(6, '0');
        const newId = `QT-${nextQuoteNumber}`;
        setQuoteId(newId);
    }, [printRates, orders]);

    const handleAddItem = () => {
        if (!currentItem.projectId) {
            alert('Please select a project.');
            return;
        }
        setItems(prev => [...prev, currentItem as QuotationItem]);
        setCurrentItem({}); // Reset for next item
    };

    const handleRemoveItem = (index: number) => {
        setItems(prev => prev.filter((_, i) => i !== index));
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

    const totalCost = useMemo(() => items.reduce((acc, item) => acc + item.total, 0), [items]);

    const handleSaveQuotation = async () => {
        if (!details.name || !details.business || items.length === 0) {
            alert('Client Name, Business, and at least one item are required.');
            return;
        }
        setIsSaving(true);
        const newQuotation: Quotation = {
            id: quoteId,
            clientName: details.name,
            businessName: details.business,
            mobile: details.mobile,
            address: details.address,
            issueDate: details.issueDate.toISOString(),
            expiryDate: details.expiryDate.toISOString(),
            items,
            total: totalCost,
            note: details.note,
            status: 'draft',
        };

        try {
            await addQuotation(newQuotation);
            alert('Quotation saved successfully!');
            // Reset state
            setDetails({
                name: '', mobile: '', business: '', address: '', note: 'Thank you...',
                issueDate: new Date(), expiryDate: addDays(new Date(), 7)
            });
            setItems([]);
            setCurrentItem({});
        } catch (error) {
            alert('Failed to save quotation.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20">
            <div className="xl:col-span-1">
                <Card className="sticky top-6">
                    <SectionHeader title="Create Quotation" />
                    <div className="space-y-4">
                        <InputGroup label="Client Name"><TextInput value={details.name} onChange={e => setDetails({...details, name: e.target.value})} /></InputGroup>
                        <InputGroup label="Mobile Number"><TextInput value={details.mobile} onChange={e => setDetails({...details, mobile: e.target.value})} /></InputGroup>
                        <InputGroup label="Business / Hotel"><TextInput value={details.business} onChange={e => setDetails({...details, business: e.target.value})} /></InputGroup>
                        <InputGroup label="Delivery Address"><TextArea value={details.address} onChange={e => setDetails({...details, address: e.target.value})} rows={3} /></InputGroup>
                        <hr />
                        <div className="grid grid-cols-2 gap-4">
                           <InputGroup label="Issue Date"><TextInput value={format(details.issueDate, 'PPP')} disabled /></InputGroup>
                           <InputGroup label="Expiry Date">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !details.expiryDate && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {details.expiryDate ? format(details.expiryDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={details.expiryDate} onSelect={(date) => date && setDetails({...details, expiryDate: date})} initialFocus /></PopoverContent>
                                </Popover>
                            </InputGroup>
                        </div>
                        <hr/>
                        
                        <CurrentItemForm projects={projects} printRates={printRates} finishingRates={finishingRates} config={config} currentItem={currentItem} setCurrentItem={setCurrentItem} />
                        <Button onClick={handleAddItem} className="w-full" variant="secondary"><Plus className="w-4 h-4 mr-2" /> Add Item to Quote</Button>

                        <hr />
                        <h4 className="font-bold text-sm">Quotation Items</h4>
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-md border">
                                    <div>
                                        <p className="font-bold text-sm">{projects.find(p=>p.id === item.projectId)?.title}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-sm">Rs. {item.total.toLocaleString()}</p>
                                        <Button variant="danger" size="icon" className="h-7 w-7" onClick={() => handleRemoveItem(index)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <InputGroup label="Notes"><TextArea value={details.note} onChange={e => setDetails({...details, note: e.target.value})} rows={3} /></InputGroup>
                        
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                             <div className="flex justify-between items-center text-lg font-bold">
                                 <span>Grand Total:</span>
                                 <span>Rs. {totalCost.toLocaleString()}</span>
                             </div>
                             <Button onClick={handleSaveQuotation} className="w-full" variant="primary" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Quotation'}</Button>
                             <Button onClick={handleDownloadPdf} className="w-full" variant="success">Download as PDF</Button>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="xl:col-span-2">
                <div ref={previewRef} className="max-h-[calc(100vh-6rem)] overflow-y-auto bg-gray-200 p-8 shadow-inner rounded-lg" style={{ '--scrollbar-bg': 'rgba(128, 128, 128, 0.4)' } as React.CSSProperties}>
                    <QuotationPreview 
                        details={{...details, id: quoteId, total: totalCost}}
                        items={items}
                        projects={projects}
                    />
                </div>
            </div>
        </div>
    );
};


// Sub-component for adding/editing a quote item
const CurrentItemForm: React.FC<{
    projects: Project[];
    printRates: PrintRate[];
    finishingRates: FinishingRatesConfig;
    config: SiteConfig;
    currentItem: Partial<QuotationItem>;
    setCurrentItem: (item: Partial<QuotationItem>) => void;
}> = ({ projects, printRates, finishingRates, config, currentItem, setCurrentItem }) => {
    const { projectId, quantity = '', printSpec, finishing } = currentItem;

    const selectedProject = useMemo(() => {
        return projects.find(p => p.id === projectId) || null;
    }, [projectId, projects]);

    const showLaminatingOptions = useMemo(() => {
        const validProjects = ["A3 TRIFOLD MENU", "A4 MENU BOOKLET", "11.75x5.75 MENU BOOKLET", "A4 TRIFOLD", "A3 BIFOLD"];
        return validProjects.includes(selectedProject?.title || '');
    }, [selectedProject]);

    const showBoardOptions = useMemo(() => {
        return selectedProject?.title === 'A3';
    }, [selectedProject]);

    const specOptions = useMemo(() => {
        const inks = [...new Set(printRates.map(r => r.inkCoverage))];
        const papers = printSpec?.inkCoverage ? [...new Set(printRates.filter(r => r.inkCoverage === printSpec.inkCoverage).map(r => r.paperType))] : [];
        const weights = printSpec?.paperType ? [...new Set(printRates.filter(r => r.inkCoverage === printSpec.inkCoverage && r.paperType === printSpec.paperType).map(r => r.weight))] : [];
        const sides = printSpec?.weight ? [...new Set(printRates.filter(r => r.inkCoverage === printSpec.inkCoverage && r.paperType === printSpec.paperType && r.weight === printSpec.weight).map(r => r.sides))] : [];
        return { inks, papers, weights, sides };
    }, [printRates, printSpec]);

    const handleSpecChange = (field: keyof NonNullable<typeof printSpec>, value: string) => {
        const newPrintSpec = { ...(printSpec || {}), [field]: value };
        if (field === 'inkCoverage') { newPrintSpec.paperType = ''; newPrintSpec.weight = ''; newPrintSpec.sides = ''; }
        if (field === 'paperType') { newPrintSpec.weight = ''; newPrintSpec.sides = ''; }
        if (field === 'weight') { newPrintSpec.sides = ''; }
        setCurrentItem({ ...currentItem, printSpec: newPrintSpec });
    };

    useEffect(() => {
        const qty = Number(quantity) || 0;
        const designCost = selectedProject?.pricing?.designOnly || 0;
        const markup = config.quoteMarkupPercentage || 0;
        
        const rate = printRates.find(r => 
            r.inkCoverage === printSpec?.inkCoverage &&
            r.paperType === printSpec?.paperType &&
            r.weight === printSpec?.weight &&
            r.sides === printSpec?.sides
        );
        const printCost = rate ? getPriceForQuantity(rate, qty, markup) * qty : 0;
        
        let totalFinishingCost = 0;
        const finishingItems: { description: string, cost: number, qty: number }[] = [];
        const finalMarkup = 1 + (markup / 100);

        if (finishing?.pouchLaminating && finishing.pouchLaminating !== 'none') {
            const cost = finishingRates.pouchLaminating[finishing.pouchLaminating] * finalMarkup * qty;
            totalFinishingCost += cost;
            finishingItems.push({ description: `Pouch Laminating (${finishing.pouchLaminating.toUpperCase()})`, cost, qty });
        }

        if (finishing?.laminating && finishing.laminating !== 'none' && showLaminatingOptions) {
            const cost = finishingRates.laminating[finishing.laminatingSize || 'a4'][finishing.laminating] * finalMarkup * qty;
            totalFinishingCost += cost;
            finishingItems.push({ description: `${finishing.laminating.charAt(0).toUpperCase() + finishing.laminating.slice(1)} Laminating (${(finishing.laminatingSize || 'a4').toUpperCase()})`, cost, qty });
        }
        
        if (finishing?.board && finishing.board !== 'none' && showBoardOptions) {
            let widthIn = parseFloat(finishing.boardWidth || '0');
            let heightIn = parseFloat(finishing.boardHeight || '0');
            if (finishing.boardIsCustom) {
                if (finishing.boardUnit === 'mm') { widthIn /= 25.4; heightIn /= 25.4; }
            } else if (selectedProject?.title === 'A3') {
                widthIn = 11.7; heightIn = 16.5;
            }
            if (!isNaN(widthIn) && !isNaN(heightIn) && widthIn > 0 && heightIn > 0) {
                const area = widthIn * heightIn;
                const ratePerSqIn = finishingRates.boardPrice[finishing.board as keyof typeof finishingRates.boardPrice];
                const cost = area * ratePerSqIn * finalMarkup * qty;
                totalFinishingCost += cost;
                finishingItems.push({ description: `${finishing.board.replace(/_/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, l => l.toUpperCase())} Board`, cost, qty });
            }
        }
        
        if (finishing?.leatherCover && finishing.leatherCover !== 'none') {
            const cost = finishingRates.leatherCover[finishing.leatherCover] * finalMarkup * qty;
            totalFinishingCost += cost;
            finishingItems.push({ description: `Leather Cover (${finishing.leatherCover.toUpperCase().replace('_THIRD', ' 1/3')})`, cost, qty });
        }

        if (finishing?.binding && finishing.binding !== 'none') {
            const cost = finishingRates.binding[finishing.binding] * finalMarkup * qty;
            totalFinishingCost += cost;
            finishingItems.push({ description: `Spiral Binding`, cost, qty });
        }
        
        const total = designCost + printCost + totalFinishingCost;
        setCurrentItem({ ...currentItem, total, finishingDetails: finishingItems, designCost, printCost, printRateId: rate?.id || null });
    }, [projectId, quantity, printSpec, finishing, projects, printRates, finishingRates, config]);


    return (
        <div className="space-y-4 p-4 border border-dashed rounded-lg">
            <h4 className="font-bold text-sm">Add New Quote Item</h4>
            <InputGroup label="Select Project">
                <Select value={projectId || ''} onChange={e => setCurrentItem({ projectId: Number(e.target.value) || undefined })}>
                    <option value="">Select a Project...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </Select>
            </InputGroup>
            
            {projectId && (
                <>
                    <h5 className="font-bold text-xs mt-2">Print Specifications</h5>
                    <InputGroup label="Ink Coverage"><Select value={printSpec?.inkCoverage || ''} onChange={e => handleSpecChange('inkCoverage', e.target.value)}><option value="">Select...</option>{specOptions.inks.map(o => <option key={o} value={o}>{o}</option>)}</Select></InputGroup>
                    <InputGroup label="Paper Type"><Select value={printSpec?.paperType || ''} onChange={e => handleSpecChange('paperType', e.target.value)} disabled={!printSpec?.inkCoverage}><option value="">Select...</option>{specOptions.papers.map(o => <option key={o} value={o}>{o}</option>)}</Select></InputGroup>
                    <InputGroup label="Weight (GSM)"><Select value={printSpec?.weight || ''} onChange={e => handleSpecChange('weight', e.target.value)} disabled={!printSpec?.paperType}><option value="">Select...</option>{specOptions.weights.map(o => <option key={o} value={o}>{o}</option>)}</Select></InputGroup>
                    <InputGroup label="Sides"><Select value={printSpec?.sides || ''} onChange={e => handleSpecChange('sides', e.target.value)} disabled={!printSpec?.weight}><option value="">Select...</option>{specOptions.sides.map(o => <option key={o} value={o}>{o}</option>)}</Select></InputGroup>
                    <InputGroup label="Quantity"><TextInput type="number" value={quantity} onChange={e => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })} /></InputGroup>
                    
                    <h5 className="font-bold text-xs mt-4">Finishing & Materials</h5>
                    
                    {showLaminatingOptions && (
                        <div className="p-3 my-2 bg-gray-50 rounded-lg border">
                            <h5 className="text-xs font-bold mb-2">Lamination</h5>
                            <InputGroup label="Pouch Laminating"><Select value={finishing?.pouchLaminating || 'none'} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, pouchLaminating: e.target.value as any, laminating: 'none'}})}><option value="none">None</option><option value="a4">A4 Pouch</option><option value="a3">A3 Pouch</option></Select></InputGroup>
                            <InputGroup label="Standard Laminating"><Select value={finishing?.laminating || 'none'} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, laminating: e.target.value as any, pouchLaminating: 'none'}})}><option value="none">None</option><option value="silky">Silky Matte</option><option value="matte">Matte</option><option value="gloss">Gloss</option></Select></InputGroup>
                            {finishing?.laminating && finishing.laminating !== 'none' && (<InputGroup label="Laminating Size"><Select value={finishing?.laminatingSize || 'a4'} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, laminatingSize: e.target.value as any}})}><option value="a4">A4</option><option value="a3">A3</option></Select></InputGroup>)}
                        </div>
                    )}
                    
                    {showBoardOptions && (
                        <div className="p-3 my-2 bg-gray-50 rounded-lg border">
                            <h5 className="text-xs font-bold mb-2">Board Mounting</h5>
                            <label className="flex items-center gap-2 text-sm mb-2"><input type="checkbox" checked={finishing?.boardIsCustom} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, boardIsCustom: e.target.checked}})} /> Use Custom Board Size</label>
                            {(showBoardOptions || finishing?.boardIsCustom) && (
                                <>
                                    <InputGroup label="Board Type"><Select value={finishing?.board || 'none'} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, board: e.target.value as any}})}><option value="none">None</option><option value="sunboard_single">Sunboard (Single)</option><option value="sunboard_double">Sunboard (Double)</option><option value="cladding_single">Cladding (Single)</option><option value="cladding_double">Cladding (Double)</option><option value="corrugated_single">Corrugated (Single)</option><option value="corrugated_double">Corrugated (Double)</option></Select></InputGroup>
                                    {finishing?.boardIsCustom && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <InputGroup label="W"><TextInput placeholder="Width" value={finishing?.boardWidth || ''} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, boardWidth: e.target.value}})} /></InputGroup>
                                            <InputGroup label="H"><TextInput placeholder="Height" value={finishing?.boardHeight || ''} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, boardHeight: e.target.value}})} /></InputGroup>
                                            <InputGroup label="Unit"><Select value={finishing?.boardUnit || 'in'} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, boardUnit: e.target.value as any}})}><option value="in">Inches</option><option value="mm">mm</option></Select></InputGroup>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    <div className="p-3 my-2 bg-gray-50 rounded-lg border">
                        <h5 className="text-xs font-bold mb-2">Cover & Binding</h5>
                        <InputGroup label="Leather Cover"><Select value={finishing?.leatherCover || 'none'} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, leatherCover: e.target.value as any}})}><option value="none">None</option><option value="a5">A5</option><option value="a4">A4</option><option value="a3">A3</option><option value="a3_third">A3 (1/3)</option></Select></InputGroup>
                        <InputGroup label="Binding"><Select value={finishing?.binding || 'none'} onChange={e => setCurrentItem({...currentItem, finishing: {...finishing, binding: e.target.value as any}})}><option value="none">None</option><option value="spiral">Spiral Binding</option></Select></InputGroup>
                    </div>

                    <div className="pt-2 text-right">
                        <span className="text-lg font-bold">Item Total: Rs. {(currentItem.total || 0).toLocaleString()}</span>
                    </div>
                </>
            )}
        </div>
    );
};
