
import { useState, useMemo } from 'react';
import { useContent } from '../../../context/ContentContext';
import { PrintRate } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button, confirmDelete, Select } from '../ui/AdminShared';

const EditRateModal: React.FC<{
    rate: PrintRate | null;
    onSave: (rate: PrintRate) => void;
    onClose: () => void;
}> = ({ rate, onSave, onClose }) => {
    const [tempRate, setTempRate] = useState<PrintRate>(
        rate || {
            id: `rate-${Date.now()}`,
            inkCoverage: '25%', paperType: 'Art Paper', weight: '80', sides: 'Single',
            price_tier1: 0, price_tier2: 0, price_tier3: 0, price_tier4: 0, price_tier5: 0
        }
    );

    const handleChange = (field: keyof PrintRate, value: string | number) => {
        setTempRate(prev => ({ ...prev, [field]: value }));
    };

    const handleNumericChange = (field: keyof PrintRate, value: string) => {
        handleChange(field, parseFloat(value) || 0);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <SectionHeader title={rate ? "Edit Print Rate" : "Add Print Rate"} />
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Ink Coverage"><TextInput value={tempRate.inkCoverage} onChange={e => handleChange('inkCoverage', e.target.value)} /></InputGroup>
                    <InputGroup label="Paper Type"><TextInput value={tempRate.paperType} onChange={e => handleChange('paperType', e.target.value)} /></InputGroup>
                    <InputGroup label="Weight (GSM)"><TextInput value={tempRate.weight} onChange={e => handleChange('weight', e.target.value)} /></InputGroup>
                    <InputGroup label="Sides">
                        <Select value={tempRate.sides} onChange={e => handleChange('sides', e.target.value)}>
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                        </Select>
                    </InputGroup>
                </div>
                <hr className="my-6" />
                <h4 className="font-bold mb-4">Pricing Tiers</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputGroup label="Qty < 50"><TextInput type="number" value={tempRate.price_tier1} onChange={e => handleNumericChange('price_tier1', e.target.value)} /></InputGroup>
                    <InputGroup label="Qty 51-100"><TextInput type="number" value={tempRate.price_tier2} onChange={e => handleNumericChange('price_tier2', e.target.value)} /></InputGroup>
                    <InputGroup label="Qty 101-500"><TextInput type="number" value={tempRate.price_tier3} onChange={e => handleNumericChange('price_tier3', e.target.value)} /></InputGroup>
                    <InputGroup label="Qty 501-1000"><TextInput type="number" value={tempRate.price_tier4} onChange={e => handleNumericChange('price_tier4', e.target.value)} /></InputGroup>
                    <InputGroup label="Qty > 1000"><TextInput type="number" value={tempRate.price_tier5} onChange={e => handleNumericChange('price_tier5', e.target.value)} /></InputGroup>
                </div>
                <div className="flex gap-4 mt-6">
                    <Button variant="success" onClick={() => onSave(tempRate)}>Save Rate</Button>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                </div>
            </Card>
        </div>
    );
};


export const PrintRatesManager: React.FC = () => {
    const { printRates, setPrintRates, config, setConfig } = useContent();
    const [editingRate, setEditingRate] = useState<PrintRate | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [markup, setMarkup] = useState(config.quoteMarkupPercentage || 0);

    const handleSave = async (rate: PrintRate) => {
        try {
            let updatedRates;
            if (isCreating) {
                updatedRates = [...printRates, rate];
            } else {
                updatedRates = printRates.map(r => r.id === rate.id ? rate : r);
            }
            await setPrintRates(updatedRates);
            alert("Print rates updated successfully!");
        } catch (error) {
            alert("Failed to save print rates.");
        } finally {
            setEditingRate(null);
            setIsCreating(false);
        }
    };

    const handleDelete = async (rateId: string) => {
        if (confirmDelete("Are you sure you want to delete this print rate?")) {
            try {
                await setPrintRates(printRates.filter(r => r.id !== rateId));
                alert("Rate deleted.");
            } catch (error) {
                alert("Failed to delete rate.");
            }
        }
    };

    const handleMarkupSave = async () => {
        await setConfig({ ...config, quoteMarkupPercentage: markup });
        alert("Global markup updated!");
    };
    
    const calculateMarkup = (price: number) => {
        return price * (1 + markup / 100);
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <SectionHeader title="Print Pricing Matrix" action={<Button onClick={() => setIsCreating(true)}>+ Add Rate</Button>} />
                <div className="flex gap-2 items-center mb-6 pb-4">
                    <InputGroup label="Global Markup (%)">
                       <TextInput type="number" value={markup} onChange={e => setMarkup(parseFloat(e.target.value) || 0)} className="w-32" />
                    </InputGroup>
                     <Button onClick={handleMarkupSave} variant="secondary" className="self-end mb-5">Save Markup</Button>
                </div>
            </div>
            <Card className="p-0 overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-100 font-bold text-xs text-gray-600 uppercase">
                        <tr>
                            <th className="p-3">Ink</th>
                            <th className="p-3">Paper</th>
                            <th className="p-3">GSM</th>
                            <th className="p-3">Sides</th>
                            <th className="p-3 text-right">{'<50'}</th>
                            <th className="p-3 text-right">{'51-100'}</th>
                            <th className="p-3 text-right">{'101-500'}</th>
                            <th className="p-3 text-right">{'501-1k'}</th>
                            <th className="p-3 text-right">{'>1k'}</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {printRates.map(rate => (
                            <tr key={rate.id} className="hover:bg-gray-50">
                                <td className="p-3 font-semibold">{rate.inkCoverage}</td>
                                <td className="p-3">{rate.paperType}</td>
                                <td className="p-3">{rate.weight}</td>
                                <td className="p-3">{rate.sides}</td>
                                {[rate.price_tier1, rate.price_tier2, rate.price_tier3, rate.price_tier4, rate.price_tier5].map((price, i) => (
                                    <td key={i} className="p-3 text-right font-mono">
                                        <div className="font-semibold">{calculateMarkup(price).toFixed(2)}</div>
                                        <div className="text-xs text-gray-400">({price.toFixed(2)})</div>
                                    </td>
                                ))}
                                <td className="p-3 text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => setEditingRate(rate)}>Edit</Button>
                                        <Button variant="danger" className="text-xs px-2 py-1" onClick={() => handleDelete(rate.id)}>Del</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            {(editingRate || isCreating) && (
                <EditRateModal
                    rate={editingRate}
                    onSave={handleSave}
                    onClose={() => { setEditingRate(null); setIsCreating(false); }}
                />
            )}
        </div>
    );
};
