import React, { useState, useMemo } from 'react';
import { PercentageRow } from '../types';
import { getAiAdvice } from '../services/geminiService';

// Helper icons
const DumbbellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7.9-7.9a2.12 2.12 0 0 1 3 3L6 12.9a2.12 2.12 0 0 1-3-3Z"/><path d="m12.9 6 7.9 7.9a2.12 2.12 0 0 1-3 3L10 9a2.12 2.12 0 0 1 3-3Z"/></svg>
);

const Calculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [movement, setMovement] = useState<string>('Back Squat');
  const [step, setStep] = useState<5 | 10>(5); // 5% or 10% steps
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const parsedWeight = parseFloat(weight) || 0;

  const percentages: PercentageRow[] = useMemo(() => {
    if (!parsedWeight) return [];
    
    const rows: PercentageRow[] = [];
    
    // Define range logic
    const start = step === 5 ? 35 : 30;
    const end = 110;

    for (let p = start; p <= end; p += step) {
        let label = "";
        if (p <= 50) label = "Calentamiento";
        else if (p <= 70) label = "Volumen";
        else if (p <= 85) label = "Fuerza";
        else if (p <= 95) label = "Pesado";
        else if (p === 100) label = "1RM Actual";
        else label = "Meta PR";

        rows.push({
            percent: p,
            weight: Math.round(parsedWeight * (p / 100)),
            label
        });
    }

    return rows;
  }, [parsedWeight, step]);

  const handleGetAdvice = async () => {
    if (!parsedWeight) return;
    setLoadingAdvice(true);
    const result = await getAiAdvice(parsedWeight, movement);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-cf-card p-6 rounded-2xl shadow-xl border border-stone-800">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-black italic text-white flex items-center gap-2 uppercase tracking-tight">
                <span className="text-cf-accent"><DumbbellIcon /></span>
                Calculadora
            </h2>

            {/* Step Toggle */}
            <div className="bg-black p-1 rounded-lg border border-stone-800 flex self-start md:self-auto">
                <button 
                    onClick={() => setStep(5)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${step === 5 ? 'bg-stone-800 text-cf-cream border border-stone-700' : 'text-stone-500 hover:text-stone-300'}`}
                >
                    Saltos de 5%
                </button>
                <button 
                    onClick={() => setStep(10)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${step === 10 ? 'bg-stone-800 text-cf-cream border border-stone-700' : 'text-stone-500 hover:text-stone-300'}`}
                >
                    Saltos de 10%
                </button>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-cf-muted text-xs font-bold uppercase tracking-wide mb-2">Movimiento</label>
                <select 
                    value={movement}
                    onChange={(e) => setMovement(e.target.value)}
                    className="w-full bg-black border border-stone-800 rounded-lg p-4 text-cf-text focus:ring-1 focus:ring-cf-accent outline-none"
                >
                    <option>Back Squat</option>
                    <option>Front Squat</option>
                    <option>Deadlift</option>
                    <option>Clean & Jerk</option>
                    <option>Snatch</option>
                    <option>Overhead Press</option>
                    <option>Bench Press</option>
                </select>
            </div>
            <div>
                <label className="block text-cf-muted text-xs font-bold uppercase tracking-wide mb-2">Tu 1RM (Libras)</label>
                <div className="relative">
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="0"
                        className="w-full bg-black border border-stone-800 rounded-lg p-4 text-white text-lg font-bold focus:ring-1 focus:ring-cf-accent outline-none appearance-none"
                    />
                    <span className="absolute right-4 top-4 text-stone-600 font-bold text-sm">LBS</span>
                </div>
            </div>
        </div>

        {parsedWeight > 0 && (
             <button 
                onClick={handleGetAdvice}
                disabled={loadingAdvice}
                className="mt-4 text-xs font-bold uppercase tracking-wide text-cf-cream hover:text-white transition-colors flex items-center gap-2 border border-stone-800 bg-stone-900 px-4 py-2 rounded-lg hover:border-cf-cream/50"
            >
                {loadingAdvice ? 'Analizando...' : `✨ Obtener tips de IA para ${movement}`}
            </button>
        )}
        
        {advice && (
            <div className="mt-4 p-4 bg-black/50 rounded-lg border-l-4 border-cf-accent text-sm text-stone-300">
                <h3 className="text-cf-cream font-bold mb-2 uppercase text-xs tracking-widest">Consejos del Coach</h3>
                <div className="prose prose-invert prose-sm max-w-none">
                     {advice.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                </div>
            </div>
        )}
      </div>

      {percentages.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {percentages.map((row) => (
            <div 
                key={row.percent} 
                className={`
                    relative overflow-hidden rounded-xl p-3 border transition-all duration-300
                    ${row.percent === 100 ? 'bg-cf-accent text-white border-cf-accent shadow-[0_0_15px_rgba(185,28,28,0.5)] scale-105 z-10' : 'bg-cf-card border-stone-800 text-stone-200 hover:border-stone-600'}
                    ${row.percent > 100 ? 'opacity-60 border-dashed border-stone-700' : ''}
                `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-black ${row.percent === 100 ? 'text-white' : 'text-cf-accent'}`}>
                    {row.percent}%
                </span>
                {row.percent === 100 && <span className="text-[9px] font-black uppercase bg-black text-cf-cream px-1.5 py-0.5 rounded border border-cf-cream/30">PR</span>}
              </div>
              <div className="text-2xl font-black tracking-tight">
                {row.weight}
              </div>
              
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-current border-opacity-10">
                 <span className="text-[10px] opacity-60 font-mono">
                    {Math.round(row.weight / 2.20462)}kg
                 </span>
                 {row.label && <span className="text-[9px] uppercase tracking-wide opacity-50 ml-auto font-bold">{row.label}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 opacity-40">
            <div className="inline-block p-6 rounded-full bg-stone-900 border border-stone-800 mb-6 text-stone-600">
                <DumbbellIcon />
            </div>
          <p className="text-lg font-medium text-stone-400">Ingresa tu peso máximo (1RM)</p>
        </div>
      )}
    </div>
  );
};

export default Calculator;