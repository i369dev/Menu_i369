
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { FinishingRatesConfig } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button } from '../ui/AdminShared';

export const FinishingRatesManager: React.FC = () => {
    const { finishingRates, setFinishingRates } = useContent();
    const [localRates, setLocalRates] = useState<FinishingRatesConfig>(finishingRates);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setLocalRates(finishingRates);
    }, [finishingRates]);

    const handleNumericChange = (path: string[], value: string) => {
        const numValue = parseFloat(value) || 0;
        setLocalRates(prev => {
            const newRates = JSON.parse(JSON.stringify(prev)); // Deep copy
            let current: any = newRates;
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            current[path[path.length - 1]] = numValue;
            return newRates;
        });
        setIsDirty(true);
    };

    const handleSave = async () => {
        await setFinishingRates(localRates);
        setIsDirty(false);
        alert('Finishing rates updated successfully!');
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <Card>
                <SectionHeader title="Finishing & Material Pricing" />
                
                <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Pouch Laminating</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                        <InputGroup label="A4 Pouch (Rs)"><TextInput type="number" value={localRates.pouchLaminating.a4} onChange={e => handleNumericChange(['pouchLaminating', 'a4'], e.target.value)} /></InputGroup>
                        <InputGroup label="A3 Pouch (Rs)"><TextInput type="number" value={localRates.pouchLaminating.a3} onChange={e => handleNumericChange(['pouchLaminating', 'a3'], e.target.value)} /></InputGroup>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Standard Laminating</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-gray-50 rounded-lg border">
                        <div>
                            <h5 className="font-semibold text-sm mb-2">A4 Size</h5>
                            <InputGroup label="Silky Matte (Rs)"><TextInput type="number" value={localRates.laminating.a4.silky} onChange={e => handleNumericChange(['laminating', 'a4', 'silky'], e.target.value)} /></InputGroup>
                            <InputGroup label="Matte (Rs)"><TextInput type="number" value={localRates.laminating.a4.matte} onChange={e => handleNumericChange(['laminating', 'a4', 'matte'], e.target.value)} /></InputGroup>
                            <InputGroup label="Gloss (Rs)"><TextInput type="number" value={localRates.laminating.a4.gloss} onChange={e => handleNumericChange(['laminating', 'a4', 'gloss'], e.target.value)} /></InputGroup>
                        </div>
                         <div>
                            <h5 className="font-semibold text-sm mb-2">A3 Size</h5>
                            <InputGroup label="Silky Matte (Rs)"><TextInput type="number" value={localRates.laminating.a3.silky} onChange={e => handleNumericChange(['laminating', 'a3', 'silky'], e.target.value)} /></InputGroup>
                            <InputGroup label="Matte (Rs)"><TextInput type="number" value={localRates.laminating.a3.matte} onChange={e => handleNumericChange(['laminating', 'a3', 'matte'], e.target.value)} /></InputGroup>
                            <InputGroup label="Gloss (Rs)"><TextInput type="number" value={localRates.laminating.a3.gloss} onChange={e => handleNumericChange(['laminating', 'a3', 'gloss'], e.target.value)} /></InputGroup>
                        </div>
                    </div>
                </div>

                 <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Board Price (per sq. inch)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 bg-gray-50 rounded-lg border">
                        <div>
                            <h5 className="font-semibold text-sm mb-2">Sunboard</h5>
                            <InputGroup label="Single Side (Rs)"><TextInput type="number" value={localRates.boardPrice.sunboard_single} onChange={e => handleNumericChange(['boardPrice', 'sunboard_single'], e.target.value)} /></InputGroup>
                            <InputGroup label="Double Side (Rs)"><TextInput type="number" value={localRates.boardPrice.sunboard_double} onChange={e => handleNumericChange(['boardPrice', 'sunboard_double'], e.target.value)} /></InputGroup>
                        </div>
                        <div>
                            <h5 className="font-semibold text-sm mb-2">Cladding Board</h5>
                            <InputGroup label="Single Side (Rs)"><TextInput type="number" value={localRates.boardPrice.cladding_single} onChange={e => handleNumericChange(['boardPrice', 'cladding_single'], e.target.value)} /></InputGroup>
                            <InputGroup label="Double Side (Rs)"><TextInput type="number" value={localRates.boardPrice.cladding_double} onChange={e => handleNumericChange(['boardPrice', 'cladding_double'], e.target.value)} /></InputGroup>
                        </div>
                        <div>
                            <h5 className="font-semibold text-sm mb-2">Corrugated Board</h5>
                            <InputGroup label="Single Side (Rs)"><TextInput type="number" value={localRates.boardPrice.corrugated_single} onChange={e => handleNumericChange(['boardPrice', 'corrugated_single'], e.target.value)} /></InputGroup>
                            <InputGroup label="Double Side (Rs)"><TextInput type="number" value={localRates.boardPrice.corrugated_double} onChange={e => handleNumericChange(['boardPrice', 'corrugated_double'], e.target.value)} /></InputGroup>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Leather Cover Price</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
                        <InputGroup label="A5 (Rs)"><TextInput type="number" value={localRates.leatherCover.a5} onChange={e => handleNumericChange(['leatherCover', 'a5'], e.target.value)} /></InputGroup>
                        <InputGroup label="A4 (Rs)"><TextInput type="number" value={localRates.leatherCover.a4} onChange={e => handleNumericChange(['leatherCover', 'a4'], e.target.value)} /></InputGroup>
                        <InputGroup label="A3 (Rs)"><TextInput type="number" value={localRates.leatherCover.a3} onChange={e => handleNumericChange(['leatherCover', 'a3'], e.target.value)} /></InputGroup>
                        <InputGroup label="A3 1/3 (Rs)"><TextInput type="number" value={localRates.leatherCover.a3_third} onChange={e => handleNumericChange(['leatherCover', 'a3_third'], e.target.value)} /></InputGroup>
                    </div>
                </div>
                
                <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Binding Price</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
                        <InputGroup label="Spiral Binding (Rs)"><TextInput type="number" value={localRates.binding.spiral} onChange={e => handleNumericChange(['binding', 'spiral'], e.target.value)} /></InputGroup>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSave} variant="success" disabled={!isDirty}>Save Finishing Rates</Button>
                </div>
            </Card>
        </div>
    );
};
