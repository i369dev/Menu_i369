
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types';
import { Language, translations } from '../../utils/translations';
import { PrivacyPolicyModal } from '../PrivacyPolicyModal';
import { useContent } from '../../context/ContentContext';

interface ProjectDetailProps {
    project: Project;
    onClose: () => void;
    onNext: () => void;
    nextProject?: Project;
    language: Language;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose, onNext, nextProject, language }) => {
    const t = translations[language].work;
    const commonT = translations[language].common;
    const validationT = translations[language].validation;
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const { config, addOrder } = useContent();
    
    // Order Form State
    const [orderForm, setOrderForm] = useState({
        name: '',
        mobile: '',
        business: '',
        address: '',
        note: '',
        quantity: Math.max(10, project.pricing?.designAndPrint?.minQty || 10),
        type: 'designPrint' as 'designOnly' | 'designPrint'
    });

    const handleQuantityChange = (delta: number) => {
        const minQty = project.pricing?.designAndPrint?.minQty || 10;
        setOrderForm(prev => ({
            ...prev,
            quantity: Math.max(minQty, prev.quantity + delta) 
        }));
    };

    const calculateTotal = () => {
        if (orderForm.type === 'designOnly') return project.pricing?.designOnly || 0;
        
        // Dynamic Pricing Logic: Base Price + (Extra Cards * Unit Price)
        const basePrice = project.pricing?.designAndPrint?.basePrice || 0;
        const minQty = project.pricing?.designAndPrint?.minQty || 10;
        const unitPrice = project.pricing?.designAndPrint?.unitPrice || 0;
        
        // Calculate extra quantity over minimum
        const extraQty = Math.max(0, orderForm.quantity - minQty);
        const incrementalCost = extraQty * unitPrice;
        
        return basePrice + incrementalCost;
    };

    const handleWhatsAppOrder = () => {
        // Strict Validation
        if (!orderForm.name.trim() || !orderForm.mobile.trim() || !orderForm.business.trim()) {
            alert(validationT.required);
            return;
        }

        const total = calculateTotal();
        
        // Save to Admin Dashboard
        addOrder({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            clientName: orderForm.name,
            mobile: orderForm.mobile,
            business: orderForm.business,
            projectName: project.title,
            type: orderForm.type,
            quantity: orderForm.type === 'designOnly' ? 'N/A' : orderForm.quantity,
            total: total,
            status: 'pending'
        });

        const message = `
*NEW ORDER REQUEST - Imaginative 369*
--------------------------------
*Project:* ${project.title}
*Type:* ${orderForm.type === 'designOnly' ? 'Design Only' : 'Design + Print'}
--------------------------------
*Client Details:*
Name: ${orderForm.name}
Mobile: ${orderForm.mobile}
Business: ${orderForm.business}
Address: ${orderForm.address}
--------------------------------
*Order Specs:*
Quantity: ${orderForm.type === 'designOnly' ? 'N/A' : orderForm.quantity}
Notes: ${orderForm.note}
--------------------------------
*Estimated Total:* ${commonT.currency} ${total.toLocaleString()}
        `.trim();

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${config.whatsappNumber}?text=${encodedMessage}`, '_blank');
    };

    return (
        <motion.div 
            className="min-h-screen w-full bg-white text-black relative z-[200] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
            <div className="flex-1 w-full relative">
                <button 
                    onClick={onClose}
                    className="fixed top-8 right-6 md:right-12 z-[210] text-xs uppercase tracking-widest bg-black text-white px-6 py-2 rounded-full hover:bg-black/80 transition-colors"
                >
                    {commonT.close}
                </button>

                <div className="w-full h-[60vh] md:h-[80vh] relative overflow-hidden">
                    {project.video ? (
                        <video src={project.video} autoPlay loop muted className="w-full h-full object-cover" />
                    ) : (
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white w-full">
                        <div className="flex items-center gap-4 mb-4 opacity-80 text-xs uppercase tracking-widest">
                            <span>{project.location}</span>
                            <span className="w-1 h-1 bg-white rounded-full" />
                            <span>{project.year}</span>
                        </div>
                        <motion.h1 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-[15vw] md:text-[8rem] lg:text-[10rem] font-serif leading-[0.8] tracking-tighter mb-4"
                        >
                            {project.title}
                        </motion.h1>
                        <p className="text-sm md:text-base uppercase tracking-[0.2em] opacity-80 pl-1">{project.subtitle}</p>
                    </div>
                </div>

                <div className="w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 md:px-12 py-24 md:py-32">
                    <div className="lg:col-span-7 flex flex-col">
                        <h3 className="text-xs uppercase tracking-widest opacity-50 mb-8">{t.features}</h3>
                        <p className="text-2xl md:text-3xl font-sans font-light leading-relaxed mb-16 text-black/90">
                            {project.description}
                        </p>
                        <div className="w-full h-[1px] bg-black/10 mb-16" />
                        <div className="grid grid-cols-2 gap-y-12 gap-x-8 mb-24">
                            {project.services.map((service, i) => (
                                <div key={i} className="flex flex-col gap-2 border-b border-black/10 pb-4">
                                    <span className="text-[10px] uppercase tracking-widest opacity-40">Spec {i < 9 ? `0${i+1}` : i+1}</span>
                                    <span className="text-lg font-serif italic">{service}</span>
                                </div>
                            ))}
                        </div>
                        <div className="w-full h-[1px] bg-black/10 mb-24" />
                        <div className="flex flex-col gap-24">
                            {project.detailImages.slice(1).map((img, i) => (
                                <div key={i} className="group w-full">
                                    <div className="overflow-hidden w-full mb-4 bg-gray-100">
                                        <img src={img} alt={`Detail ${i + 1}`} className="w-full h-auto object-cover" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest opacity-50 border-t border-black/10 pt-2">
                                        <span>Fig. {i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                                        <span>{project.title} Detail</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-4 lg:col-start-9 relative h-full">
                        <div className="sticky top-32">
                            <div className="bg-[#f5f5f5] p-8 md:p-12">
                                <h3 className="text-2xl font-serif mb-8">{t.bookingPricing}</h3>
                                <div className="flex bg-white p-1 mb-8">
                                    <button 
                                        className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${orderForm.type === 'designPrint' ? 'bg-black text-white' : 'text-black/50 hover:text-black'}`}
                                        onClick={() => setOrderForm(prev => ({ ...prev, type: 'designPrint' }))}
                                    >
                                        {t.designPrint}
                                    </button>
                                    <button 
                                        className={`flex-1 py-3 text-xs uppercase tracking-widest transition-colors ${orderForm.type === 'designOnly' ? 'bg-black text-white' : 'text-black/50 hover:text-black'}`}
                                        onClick={() => setOrderForm(prev => ({ ...prev, type: 'designOnly' }))}
                                    >
                                        {t.designOnly}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="relative">
                                            <input type="text" placeholder={t.yourName} className="w-full bg-transparent border-b border-black/20 py-3 text-sm focus:outline-none focus:border-black transition-colors" value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} />
                                            <span className="absolute right-0 top-3 text-red-500">*</span>
                                        </div>
                                        <div className="relative">
                                            <input type="tel" placeholder={t.mobile} className="w-full bg-transparent border-b border-black/20 py-3 text-sm focus:outline-none focus:border-black transition-colors" value={orderForm.mobile} onChange={e => setOrderForm({...orderForm, mobile: e.target.value})} />
                                            <span className="absolute right-0 top-3 text-red-500">*</span>
                                        </div>
                                        <div className="relative">
                                            <input type="text" placeholder={t.business} className="w-full bg-transparent border-b border-black/20 py-3 text-sm focus:outline-none focus:border-black transition-colors" value={orderForm.business} onChange={e => setOrderForm({...orderForm, business: e.target.value})} />
                                            <span className="absolute right-0 top-3 text-red-500">*</span>
                                        </div>
                                    </div>

                                    {orderForm.type === 'designPrint' && (
                                        <>
                                            <div className="flex items-center justify-between border-b border-black/20 py-3">
                                                <span className="text-sm opacity-60">{t.quantity}</span>
                                                <div className="flex items-center gap-4">
                                                    <button onClick={() => handleQuantityChange(-1)} className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded">-</button>
                                                    <span className="text-sm font-medium w-8 text-center">{orderForm.quantity}</span>
                                                    <button onClick={() => handleQuantityChange(1)} className="w-6 h-6 flex items-center justify-center hover:bg-black/10 rounded">+</button>
                                                </div>
                                            </div>
                                            <input type="text" placeholder={t.address} className="w-full bg-transparent border-b border-black/20 py-3 text-sm focus:outline-none focus:border-black transition-colors" value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})} />
                                        </>
                                    )}

                                    <textarea placeholder={t.note} rows={2} className="w-full bg-transparent border-b border-black/20 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none" value={orderForm.note} onChange={e => setOrderForm({...orderForm, note: e.target.value})} />
                                </div>

                                <div className="mt-12 pt-8 border-t border-black/10">
                                    <div className="flex justify-between items-end mb-6">
                                        <span className="text-xs uppercase tracking-widest opacity-50">{t.total} (Est.)</span>
                                        <span className="text-3xl font-serif">{commonT.currency} {calculateTotal().toLocaleString()}</span>
                                    </div>
                                    
                                    <button 
                                        onClick={handleWhatsAppOrder}
                                        className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-[#353535] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>{t.confirm}</span>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4 invert" alt="" />
                                    </button>
                                    
                                    <p className="text-[10px] text-black/40 mt-4 leading-normal text-center">
                                        {t.disclaimer} <br/>
                                        {t.byBooking} <button onClick={() => setIsPrivacyOpen(true)} className="underline hover:text-black">{translations[language].privacyPolicy.title}</button>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {nextProject && (
                <div 
                    className="w-full bg-[#1a1a1a] text-white py-32 px-6 md:px-12 cursor-pointer group relative overflow-hidden mt-auto"
                    onClick={onNext}
                >
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
                         <img src={nextProject.image} className="w-full h-full object-cover grayscale" alt="" />
                    </div>
                    <div className="relative z-10 text-center">
                        <span className="text-xs uppercase tracking-widest opacity-50 mb-4 block">{t.nextProject}</span>
                        <h2 className="text-6xl md:text-9xl font-serif italic group-hover:scale-105 transition-transform duration-700">{nextProject.title}</h2>
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isPrivacyOpen && (
                    <PrivacyPolicyModal 
                        isOpen={isPrivacyOpen} 
                        onClose={() => setIsPrivacyOpen(false)} 
                        origin="order" 
                        language={language}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};
