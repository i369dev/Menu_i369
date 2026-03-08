
import React from 'react';
import { Project, SiteConfig } from '../../types';
import { useContent } from '../../context/ContentContext';
import { format } from 'date-fns';

interface QuotationPreviewProps {
    details: {
        name: string;
        mobile: string;
        business: string;
        address: string;
        note: string;
        projectId: number | null;
        quantity: number;
    };
    project: Project | null;
    quoteId: string;
}

export const QuotationPreview: React.FC<QuotationPreviewProps> = ({ details, project, quoteId }) => {
    const { config } = useContent();

    const interpolate = (template: string) => {
        if (!template) return '';
        return template
            .replace(/{{whatsappNumber}}/g, config.whatsappNumber || '')
            .replace(/{{contactEmail}}/g, config.contactEmail || '');
    };

    const headerHtml = interpolate(config.quotationHeader || '');
    const termsHtml = interpolate(config.quotationTerms || '');

    const issueDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(issueDate.getDate() + 7);

    const calculateTotal = () => {
        if (!project) return 0;
        const basePrice = project.pricing?.designAndPrint?.basePrice || 0;
        const minQty = project.pricing?.designAndPrint?.minQty || 10;
        const unitPrice = project.pricing?.designAndPrint?.unitPrice || 0;
        const extraQty = Math.max(0, details.quantity - minQty);
        const incrementalCost = extraQty * unitPrice;
        return basePrice + incrementalCost;
    };

    const total = calculateTotal();
    
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
                            <img src={config.logoDark} alt="Logo" className="w-32 mb-4" />
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
                            <div className="font-bold text-base">{details.name}</div>
                            <div className="whitespace-pre-line">{details.address}</div>
                        </div>
                        <div className="float-right w-1/2 text-right">
                            <div className="inline-grid grid-cols-[auto,auto] gap-x-4 gap-y-1">
                                <span className="font-bold text-right">Expiry Date :</span><span>{format(expiryDate, 'dd MMM yyyy')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pb-8">
                        <div className="font-bold text-gray-500 mb-1">Subject</div>
                        <p>Menu Design, Printing & Delivery Service - {details.business} - {details.quantity} {project?.title} menu cards</p>
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
                            <tr className="border-b">
                                <td className="p-2 align-top">1</td>
                                <td className="p-2">
                                    <div className="font-bold">A3 Trifold Menu Design (Both Sides)</div>
                                    <ul className="list-disc pl-5 text-gray-600">
                                        <li>50+ items</li>
                                        <li>User Generate Images or Stock Images</li>
                                        <li>Design Delivery: 1 - 2 Days</li>
                                        <li>Unlimited Revisions</li>
                                    </ul>
                                </td>
                                <td className="p-2 text-right align-top">1.00</td>
                                <td className="p-2 text-right align-top">{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="p-2 text-right align-top">{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                             <tr className="border-b">
                                <td className="p-2 align-top"></td>
                                <td className="p-2">
                                    <div className="font-bold">A3 Trifold Menu Print</div>
                                    <ul className="list-disc pl-5 text-gray-600">
                                        <li>{details.quantity} Printed Menu Cards</li>
                                        <li>Matte Laminated</li>
                                        <li>Ivory Board</li>
                                    </ul>
                                </td>
                                <td className="p-2 text-right align-top"></td>
                                <td className="p-2 text-right align-top"></td>
                                <td className="p-2 text-right align-top"></td>
                            </tr>
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
                                    <span>{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between p-2 bg-gray-100 font-bold text-base">
                                    <span>Total</span>
                                    <span>LKR {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="font-bold mb-2">Notes</div>
                            <p className="whitespace-pre-line text-gray-600">{details.note}</p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 right-12 text-gray-400 text-xs">1</div>
            </Page>

            <Page isLast={true}>
                <div className="font-bold mb-4">Terms & Conditions</div>
                <div className="space-y-4 text-gray-600" dangerouslySetInnerHTML={{ __html: termsHtml }} />
                <div className="absolute bottom-4 right-12 text-gray-400 text-xs">2</div>
            </Page>
        </div>
    );
};
