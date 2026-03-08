
import { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { Card, SectionHeader, InputGroup, Button, TextArea, LangTabs } from '../ui/AdminShared';

export const QuotationTemplateManager: React.FC = () => {
    const { config, setConfig } = useContent();
    const [localConfig, setLocalConfig] = useState(config);
    const [lang, setLang] = useState<'en'|'si'|'ta'>('en');

    const handleSave = () => {
        setConfig(localConfig);
        alert('Quotation template updated!');
    };

    const isDirty = JSON.stringify(localConfig) !== JSON.stringify(config);

    const getHeader = () => {
        if (lang === 'si') return localConfig.quotationHeader_si || '';
        if (lang === 'ta') return localConfig.quotationHeader_ta || '';
        return localConfig.quotationHeader || '';
    };

    const setHeader = (value: string) => {
        if (lang === 'en') setLocalConfig(prev => ({ ...prev, quotationHeader: value }));
        if (lang === 'si') setLocalConfig(prev => ({ ...prev, quotationHeader_si: value }));
        if (lang === 'ta') setLocalConfig(prev => ({ ...prev, quotationHeader_ta: value }));
    };
    
    const getTerms = () => {
        if (lang === 'si') return localConfig.quotationTerms_si || '';
        if (lang === 'ta') return localConfig.quotationTerms_ta || '';
        return localConfig.quotationTerms || '';
    };

    const setTerms = (value: string) => {
        if (lang === 'en') setLocalConfig(prev => ({ ...prev, quotationTerms: value }));
        if (lang === 'si') setLocalConfig(prev => ({ ...prev, quotationTerms_si: value }));
        if (lang === 'ta') setLocalConfig(prev => ({ ...prev, quotationTerms_ta: value }));
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 space-y-8">
            <Card>
                <SectionHeader title="Quotation Template Editor" />
                 <p className="text-xs text-gray-500 mb-6 -mt-4">
                    Edit the header and footer content for your quotations. Use HTML for formatting (e.g., <code>{'<strong>Bold</strong>'}</code>, <code>{'<br>'}</code>).
                    Placeholders like <code>{'{{whatsappNumber}}'}</code> and <code>{'{{contactEmail}}'}</code> will be replaced with values from Company Settings.
                </p>

                <LangTabs active={lang} onChange={setLang} />

                <div className="space-y-8 mt-4">
                    <InputGroup 
                        label="Quotation Header"
                        subLabel="This appears at the top left of the quote. Contains your company contact info."
                    >
                        <TextArea 
                            value={getHeader()}
                            onChange={e => setHeader(e.target.value)}
                            rows={8}
                            className="font-mono text-xs"
                        />
                    </InputGroup>

                    <InputGroup
                        label="Terms & Conditions"
                        subLabel="This appears on the second page of the quote."
                    >
                         <TextArea 
                            value={getTerms()}
                            onChange={e => setTerms(e.target.value)}
                            rows={15}
                            className="font-mono text-xs"
                        />
                    </InputGroup>
                </div>
                
                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSave} variant="success" disabled={!isDirty}>
                        Save Template
                    </Button>
                </div>
            </Card>
        </div>
    );
};
