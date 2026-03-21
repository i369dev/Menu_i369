
'use client';

import React from 'react';
import { useContent } from '../../../context/ContentContext';
import { Card, SectionHeader } from '../ui/AdminShared';
import { format } from 'date-fns';

export const QuotationHistory: React.FC = () => {
    const { quotations } = useContent();

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <SectionHeader title="Quotation History" />
            <Card className="p-0 overflow-hidden border border-gray-300">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100 font-bold uppercase text-xs text-gray-800 border-b border-gray-200">
                        <tr>
                            <th className="p-4">Quote ID</th>
                            <th className="p-4">Issue Date</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Business</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {quotations.map((q) => (
                            <tr key={q.id} className="hover:bg-blue-50 text-gray-900 transition-colors">
                                <td className="p-4 font-mono font-bold text-gray-900">{q.id}</td>
                                <td className="p-4 font-medium">{format(new Date(q.issueDate), 'dd MMM yyyy')}</td>
                                <td className="p-4 font-bold text-gray-900">{q.clientName}</td>
                                <td className="p-4 text-gray-700">{q.businessName}</td>
                                <td className="p-4 text-right font-black text-gray-900">Rs {q.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="p-4">
                                     <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${q.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                        {q.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {quotations.length === 0 && (
                    <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                        No quotations have been saved yet.
                    </div>
                )}
            </Card>
        </div>
    );
};
