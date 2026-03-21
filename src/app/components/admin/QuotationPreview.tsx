
import React from 'react';
import { Project, PrintRate, SiteConfig, QuotationItem } from '../../types';
import { format, isValid } from 'date-fns';

interface QuotationPreviewProps {
    details: {
        name: string;
        mobile: string;
        business: string;
        address: string;
        note: string;
        issueDate: Date;
        expiryDate: Date;
    };
    items: QuotationItem[];
    quoteId: string;
    totalCost: number;
    projects: Project[];
    printRates: PrintRate[];
    config: SiteConfig;
}

export const QuotationPreview: React.FC<QuotationPreviewProps> = ({ 
    details, items, quoteId, totalCost, projects, printRates, config
}) => {
    
    const getPriceForQuantity = (rate: PrintRate, quantity: number, markup: number): number => {
        const finalMarkup = 1 + (markup / 100);
        if (quantity < 51) return rate.price_tier1 * finalMarkup;
        if (quantity < 101) return rate.price_tier2 * finalMarkup;
        if (quantity < 501) return rate.price_tier3 * finalMarkup;
        if (quantity < 1001) return rate.price_tier4 * finalMarkup;
        return rate.price_tier5 * finalMarkup;
    };

    const interpolate = (template: string) => {
        if (!template) return '';
        return template
            .replace(/{{whatsappNumber}}/g, config.whatsappNumber || '')
            .replace(/{{contactEmail}}/g, config.contactEmail || '');
    };

    const headerHtml = interpolate(config.quotationHeader || '');
    const termsHtml = interpolate(config.quotationTerms || '');
    const logoSrc = config.quotationLogo || config.logoDark;

    const subject = items.length > 0 
        ? `Quotation for ${items.map(i => projects.find(p => p.id === i.projectId)?.title).join(', ')}`
        : 'Quotation';
        
    let itemCounter = 0;

    const Page: React.FC<{ children: React.ReactNode, isLast?: boolean }> = ({ children, isLast }) => (
        <div className={`a4-page-container bg-white w-[210mm] h-[297mm] shadow-lg mx-auto font-sans text-xs text-gray-800 p-12 box-border overflow-hidden relative ${isLast ? '' : 'mb-8'}`}>
            {children}
        </div>
    );

    return (
        <div className="w-full">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
                .font-times { font-family: 'Times New Roman', Times, serif; }
                .clearfix::after {
                    content: "";
                    clear: both;
                    display: table;
                }
            `}</style>
            <Page>
                <div className="h-full flex flex-col">
                    <div className="clearfix pb-8">
                        <div className="float-left w-1/2">
                            {logoSrc && <img src={logoSrc} alt="Logo" className="w-32 mb-4" />}
                            <div dangerouslySetInnerHTML={{ __html: headerHtml }} />
                        </div>
                        <div className="float-right w-1/2 text-right">
                            <h1 className="text-4xl font-bold font-times mb-1 text-gray-900">QUOTE</h1>
                            <div className="font-mono text-gray-600">{quoteId}</div>
                        </div>
                    </div>
                    
                    <div className="clearfix pb-8">
                        <div className="float-left w-1/2">
                            <div className="font-bold text-gray-500 mb-1">Bill To</div>
                            <div className="font-bold text-base">{details?.name}</div>
                            <div className="whitespace-pre-line">{details?.address}</div>
                        </div>
                        <div className="float-right w-1/2 text-right">
                             <div className="inline-grid grid-cols-[auto,auto] gap-x-4 gap-y-1">
                                <span className="font-bold text-right">Date of Issue :</span><span>{isValid(details.issueDate) ? format(details.issueDate, 'dd MMM yyyy') : ''}</span>
                                <span className="font-bold text-right">Expiry Date :</span><span>{isValid(details.expiryDate) ? format(details.expiryDate, 'dd MMM yyyy') : ''}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pb-8">
                        <div className="font-bold text-gray-500 mb-1">Subject</div>
                        <p>{subject}</p>
                    </div>

                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="p-2 text-left w-8">#</th>
                                <th className="p-2 text-left">Item & Description</th>
                                <th className="p-2 text-right w-16">Qty</th>
                                <th className="p-2 text-right w-24">Rate</th>
                                <th className="p-2 text-right w-24">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const project = projects.find(p => p.id === item.projectId);
                                const printRate = printRates.find(r => r.id === item.printRateId);
                                const markup = config.quoteMarkupPercentage || 0;
                                const printRatePrice = printRate ? getPriceForQuantity(printRate, item.quantity, markup) : 0;
                                
                                const designRow = project && item.designCost > 0 ? (
                                    <tr className="border-b">
                                        <td className="p-2 align-top">{++itemCounter}</td>
                                        <td className="p-2">
                                            <div className="font-bold">{project.title} Menu Design (Both Sides)</div>
                                        </td>
                                        <td className="p-2 text-right align-top">1.00</td>
                                        <td className="p-2 text-right align-top">{item.designCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-2 text-right align-top">{item.designCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                ) : null;
                                
                                const printRow = printRate && item.printCost > 0 ? (
                                     <tr className="border-b">
                                        <td className="p-2 align-top">{!designRow ? ++itemCounter : ''}</td>
                                        <td className="p-2">
                                            <div className="font-bold">{project?.title} Menu Print</div>
                                            <ul className="list-disc pl-5 text-gray-600">
                                                <li>Paper: {printRate.paperType}</li>
                                                <li>Weight: {printRate.weight} gsm</li>
                                                <li>Sides: {printRate.sides}</li>
                                                <li>Ink: {printRate.inkCoverage}</li>
                                            </ul>
                                        </td>
                                        <td className="p-2 text-right align-top">{item.quantity}</td>
                                        <td className="p-2 text-right align-top">{printRatePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-2 text-right align-top">{item.printCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                ) : null;
                                
                                const finishingRows = item.finishingDetails.map((finishing, fIndex) => (
                                    <tr key={`finish-${index}-${fIndex}`} className="border-b">
                                        <td className="p-2 align-top">{++itemCounter}</td>
                                        <td className="p-2">
                                            <div className="font-bold">{finishing.description}</div>
                                        </td>
                                        <td className="p-2 text-right align-top">{finishing.qty}</td>
                                        <td className="p-2 text-right align-top">{(finishing.cost / finishing.qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-2 text-right align-top">{finishing.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    </tr>
                                ));

                                return (
                                    <React.Fragment key={index}>
                                        {designRow}
                                        {printRow}
                                        {finishingRows}
                                    </React.Fragment>
                                )
                            })}
                             <tr className="border-b">
                                <td className="p-2 align-top"></td>
                                <td className="p-2 font-bold">FREE DELIVERY</td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                                <td className="p-2"></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div className="mt-auto pt-8">
                        <div className="clearfix">
                             <div className="float-right w-1/2">
                                <div className="flex justify-between p-2">
                                    <span>Sub Total</span>
                                    <span>{totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-100 font-bold text-base">
                                    <span>Total</span>
                                    <span>LKR {totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="font-bold mb-2">Notes</div>
                            <p className="whitespace-pre-line text-gray-600">{details?.note}</p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 right-12 text-gray-400 text-xs">1</div>
            </Page>

            <Page isLast={true}>
                <div className="font-bold mb-4">Terms & Conditions</div>
                <div className="space-y-4 text-gray-600 text-justify" dangerouslySetInnerHTML={{ __html: termsHtml }} />
                <div className="absolute bottom-4 right-12 text-gray-400 text-xs">2</div>
            </Page>
        </div>
    );
};

    