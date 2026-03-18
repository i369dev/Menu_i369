
import { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { FinishingRatesConfig } from '../../../types';
import { Card, SectionHeader, InputGroup, TextInput, Button } from '../ui/AdminShared';

export const FinishingRatesManager: React.FC = () => {
    const { finishingRates, setFinishingRates, config, setConfig } = useContent();
    const [localRates, setLocalRates] = useState<FinishingRatesConfig>(finishingRates);
    const [markup, setMarkup] = useState(config.quoteMarkupPercentage || 0);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setLocalRates(finishingRates);
    }, [finishingRates]);
    
    useEffect(() => {
        setMarkup(config.quoteMarkupPercentage || 0);
    }, [config.quoteMarkupPercentage]);


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
        await setConfig({ ...config, quoteMarkupPercentage: markup });
        setIsDirty(false);
        alert('Finishing rates and markup updated successfully!');
    };

    const calculateMarkup = (price: number) => {
        return price * (1 + markup / 100);
    };
    
    const PriceInput: React.FC<{label: string, value: number, path: string[]}> = ({ label, value, path }) => (
      <InputGroup label={label}>
          <div className="flex items-center gap-2">
              <TextInput type="number" value={value} onChange={e => handleNumericChange(path, e.target.value)} />
              <span className="text-sm text-gray-500 whitespace-nowrap">
                  → {(calculateMarkup(value)).toFixed(2)}
              </span>
          </div>
      </InputGroup>
    );

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <Card>
                <div className="flex justify-between items-center">
                    <SectionHeader title="Finishing & Material Pricing" />
                    <div className="flex gap-2 items-center mb-6 pb-4">
                       <InputGroup label="Global Markup (%)">
                           <TextInput type="number" value={markup} onChange={e => { setMarkup(parseFloat(e.target.value) || 0); setIsDirty(true); }} className="w-32" />
                       </InputGroup>
                    </div>
                </div>
                
                <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Pouch Laminating</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
                        <PriceInput label="A4 Pouch (Rs)" value={localRates.pouchLaminating.a4} path={['pouchLaminating', 'a4']} />
                        <PriceInput label="A3 Pouch (Rs)" value={localRates.pouchLaminating.a3} path={['pouchLaminating', 'a3']} />
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Standard Laminating</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-gray-50 rounded-lg border">
                        <div>
                            <h5 className="font-semibold text-sm mb-2">A4 Size</h5>
                            <PriceInput label="Silky Matte (Rs)" value={localRates.laminating.a4.silky} path={['laminating', 'a4', 'silky']} />
                            <PriceInput label="Matte (Rs)" value={localRates.laminating.a4.matte} path={['laminating', 'a4', 'matte']} />
                            <PriceInput label="Gloss (Rs)" value={localRates.laminating.a4.gloss} path={['laminating', 'a4', 'gloss']} />
                        </div>
                         <div>
                            <h5 className="font-semibold text-sm mb-2">A3 Size</h5>
                            <PriceInput label="Silky Matte (Rs)" value={localRates.laminating.a3.silky} path={['laminating', 'a3', 'silky']} />
                            <PriceInput label="Matte (Rs)" value={localRates.laminating.a3.matte} path={['laminating', 'a3', 'matte']} />
                            <PriceInput label="Gloss (Rs)" value={localRates.laminating.a3.gloss} path={['laminating', 'a3', 'gloss']} />
                        </div>
                    </div>
                </div>

                 <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Board Price (per sq. inch)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 bg-gray-50 rounded-lg border">
                        <div>
                            <h5 className="font-semibold text-sm mb-2">Sunboard</h5>
                            <PriceInput label="Single Side (Rs)" value={localRates.boardPrice.sunboard_single} path={['boardPrice', 'sunboard_single']} />
                            <PriceInput label="Double Side (Rs)" value={localRates.boardPrice.sunboard_double} path={['boardPrice', 'sunboard_double']} />
                        </div>
                        <div>
                            <h5 className="font-semibold text-sm mb-2">Cladding Board</h5>
                            <PriceInput label="Single Side (Rs)" value={localRates.boardPrice.cladding_single} path={['boardPrice', 'cladding_single']} />
                            <PriceInput label="Double Side (Rs)" value={localRates.boardPrice.cladding_double} path={['boardPrice', 'cladding_double']} />
                        </div>
                        <div>
                            <h5 className="font-semibold text-sm mb-2">Corrugated Board</h5>
                            <PriceInput label="Single Side (Rs)" value={localRates.boardPrice.corrugated_single} path={['boardPrice', 'corrugated_single']} />
                            <PriceInput label="Double Side (Rs)" value={localRates.boardPrice.corrugated_double} path={['boardPrice', 'corrugated_double']} />
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Leather Cover Price</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
                        <PriceInput label="A5 (Rs)" value={localRates.leatherCover.a5} path={['leatherCover', 'a5']} />
                        <PriceInput label="A4 (Rs)" value={localRates.leatherCover.a4} path={['leatherCover', 'a4']} />
                        <PriceInput label="A3 (Rs)" value={localRates.leatherCover.a3} path={['leatherCover', 'a3']} />
                        <PriceInput label="A3 1/3 (Rs)" value={localRates.leatherCover.a3_third} path={['leatherCover', 'a3_third']} />
                    </div>
                </div>
                
                <div className="mb-8">
                    <h4 className="font-bold mb-2 text-gray-700">Binding Price</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
                        <PriceInput label="Spiral Binding (Rs)" value={localRates.binding.spiral} path={['binding', 'spiral']} />
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSave} variant="success" disabled={!isDirty}>Save Finishing Rates</Button>
                </div>
            </Card>
        </div>
    );
};
