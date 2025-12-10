
import React from 'react';
import { useContent } from '../../../context/ContentContext';
import { Card } from '../ui/AdminShared';

export const OrderManager: React.FC = () => {
    const { orders } = useContent();

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <Card className="p-0 overflow-hidden border border-gray-300">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 font-bold uppercase text-xs text-gray-800 border-b border-gray-200">
                    <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Client</th>
                        <th className="p-4">Project</th>
                        <th className="p-4">Card Qty</th>
                        <th className="p-4 text-right">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {orders.map((o, i) => (
                        <tr key={i} className="hover:bg-blue-50 text-gray-900 transition-colors">
                            <td className="p-4 font-medium">{new Date(o.date).toLocaleDateString()}</td>
                            <td className="p-4">
                                <div className="font-bold text-gray-900">{o.clientName}</div>
                                <div className="text-xs text-gray-600 font-mono mt-1">{o.mobile}</div>
                            </td>
                            <td className="p-4">
                                <span className="font-semibold text-gray-800">{o.projectName}</span>
                                <span className={`ml-2 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${o.type === 'designOnly' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>{o.type === 'designOnly' ? 'Design' : 'Print'}</span>
                            </td>
                            <td className="p-4 font-bold text-gray-900">{o.quantity}</td>
                            <td className="p-4 text-right font-black text-gray-900">Rs {o.total.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {orders.length === 0 && (
                <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                    No orders received yet.
                </div>
            )}
            </Card>
        </div>
    );
};
