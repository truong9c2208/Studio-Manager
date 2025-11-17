import React from 'react';
import type { AuthView } from '../../layouts/AuthLayout';
import { useTranslation } from '../../../hooks/useTranslation';
import { ChevronDownIcon } from '../../icons/ChevronDownIcon';

const ServiceDetailColumn: React.FC<{ titleKey: string, items: string[] }> = ({ titleKey, items }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-blue-600 mb-4">{t(titleKey as any)}</h4>
            <ul className="space-y-3 text-gray-600 text-sm">
                {items.map(itemKey => (
                    <li key={itemKey} className="flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        <span>{t(itemKey as any)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


export const LandingPage: React.FC<{ onNavigate: (view: AuthView) => void; }> = ({ onNavigate }) => {
  const { t } = useTranslation();
  
  const handleScrollDown = () => {
      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-950 text-slate-300">
        {/* Hero Section */}
        <section 
            className="min-h-screen flex flex-col items-center justify-center text-center p-4 relative overflow-hidden bg-cover bg-center"
            style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=2564&auto=format&fit=crop')`,
            }}
        >
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
            
            <div className="relative z-10">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter" style={{ textShadow: '0 0 15px rgba(14, 165, 233, 0.7), 0 0 30px rgba(14, 165, 233, 0.5)' }}>
                    <span className="text-sky-400">{t('landing_hero_title')}</span>
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold uppercase text-slate-300 mt-2 tracking-wide">
                    {t('landing_hero_subtitle')}
                </h2>
                <p className="mt-6 text-lg text-slate-400 max-w-3xl mx-auto">
                    {t('landing_hero_desc')}
                </p>

                <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl w-full mx-auto">
                    {/* Game Service Card */}
                    <div className="group relative bg-slate-900/50 backdrop-blur-md border border-sky-500/30 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                        <div className="absolute -inset-px bg-gradient-to-r from-sky-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-lg"></div>
                        <div className="relative">
                            <h3 className="text-2xl font-bold text-sky-400">{t('landing_game_service_title')}</h3>
                            <p className="mt-2 text-slate-400">{t('landing_game_service_desc')}</p>
                        </div>
                    </div>
                    {/* Community Service Card */}
                    <div className="group relative bg-slate-900/50 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 transform hover:scale-105 transition-all duration-300">
                         <div className="absolute -inset-px bg-gradient-to-r from-cyan-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 blur-lg"></div>
                        <div className="relative">
                            <h3 className="text-2xl font-bold text-cyan-400">{t('landing_community_service_title')}</h3>
                            <p className="mt-2 text-slate-400">{t('landing_community_service_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <button onClick={handleScrollDown} className="absolute bottom-8 z-10 animate-bounce" aria-label="Scroll down">
                <ChevronDownIcon className="w-8 h-8 text-slate-500 hover:text-white" />
            </button>
        </section>

        {/* Combined Services Section */}
        <section id="services-section" className="relative">
             {/* Game Service Details Section */}
            <div className="py-24 bg-white text-gray-800">
                <div className="max-w-7xl mx-auto flex px-8 lg:px-12 relative">
                    <div className="w-24 flex-shrink-0 relative hidden lg:block">
                        <div className="absolute top-0 left-12 h-full flex items-center">
                            <h2 className="[writing-mode:vertical-rl] rotate-180 text-4xl font-black tracking-[0.3em] text-slate-100 uppercase select-none">CORELINKS STUDIO</h2>
                        </div>
                    </div>
                    <div className="flex-grow lg:pl-12">
                        <h2 className="text-3xl font-bold text-sky-500 mb-12">{t('gs_title')}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                            <ServiceDetailColumn titleKey="gs_dev_title" items={['gs_dev_1', 'gs_dev_2', 'gs_dev_3', 'gs_dev_4']} />
                            <ServiceDetailColumn titleKey="gs_op_title" items={['gs_op_1', 'gs_op_2', 'gs_op_3', 'gs_op_4', 'gs_op_5', 'gs_op_6']} />
                            <ServiceDetailColumn titleKey="gs_com_title" items={['gs_com_1', 'gs_com_2', 'gs_com_3', 'gs_com_4']} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Community Service Details Section */}
            <div className="py-24 bg-slate-50 text-gray-800">
                <div className="max-w-7xl mx-auto flex px-8 lg:px-12 relative">
                    <div className="w-24 flex-shrink-0 relative hidden lg:block">
                        <div className="absolute top-0 left-12 h-full flex items-center">
                            <h2 className="[writing-mode:vertical-rl] rotate-180 text-4xl font-black tracking-[0.3em] text-slate-200 uppercase select-none">CORELINKS STUDIO</h2>
                        </div>
                    </div>
                    <div className="flex-grow lg:pl-12">
                        <h2 className="text-3xl font-bold text-cyan-500 mb-12">{t('cs_title')}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                            <div className="space-y-16">
                                <ServiceDetailColumn titleKey="cs_infra_title" items={['cs_infra_1', 'cs_infra_2', 'cs_infra_3', 'cs_infra_4']} />
                                <ServiceDetailColumn titleKey="cs_ops_title" items={['cs_ops_1', 'cs_ops_2', 'cs_ops_3']} />
                            </div>
                            <div className="space-y-16">
                                <ServiceDetailColumn titleKey="cs_tools_title" items={['cs_tools_1', 'cs_tools_2', 'cs_tools_3']} />
                                <ServiceDetailColumn titleKey="cs_sec_title" items={['cs_sec_1', 'cs_sec_2', 'cs_sec_3']} />
                            </div>
                            <div>
                                <ServiceDetailColumn titleKey="cs_ux_title" items={['cs_ux_1', 'cs_ux_2', 'cs_ux_3']} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 py-8 text-center text-text-secondary">
            <p>&copy; {new Date().getFullYear()} Corelinks Studio. All rights reserved.</p>
        </footer>
    </div>
  );
};