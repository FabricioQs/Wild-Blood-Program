import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateWod } from '../services/geminiService';
import { DAYS_OF_WEEK, DayOfWeek, WeeklyProgramming } from '../types';

// Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

interface WodBoardProps {
    isCoach: boolean;
}

const WodBoard: React.FC<WodBoardProps> = ({ isCoach }) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Lunes');
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(false);
  const [editValue, setEditValue] = useState('');
  
  // Initialize with empty schedule
  const [weeklyWods, setWeeklyWods] = useState<WeeklyProgramming>(() => {
    const saved = localStorage.getItem('cf_weekly_programming');
    if (saved) {
        return JSON.parse(saved);
    }
    return DAYS_OF_WEEK.reduce((acc, day) => ({ ...acc, [day]: '' }), {} as WeeklyProgramming);
  });

  // Determine current Day on mount
  useEffect(() => {
    const todayIndex = new Date().getDay(); // 0 = Sunday, 1 = Monday
    const mappedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
    setSelectedDay(DAYS_OF_WEEK[mappedIndex]);
  }, []);

  // Save changes to LocalStorage
  const saveProgramming = (newData: WeeklyProgramming) => {
    setWeeklyWods(newData);
    localStorage.setItem('cf_weekly_programming', JSON.stringify(newData));
  };

  const handleDayChange = (day: DayOfWeek) => {
    if (mode === 'edit' && isCoach) {
       setMode('view');
    }
    setSelectedDay(day);
  };

  const currentWodText = weeklyWods[selectedDay];

  // Helper to force markdown to respect newlines exactly as typed
  const getFormattedContent = (content: string) => {
      if (!content) return "";
      return content
        .replace(/\r\n/g, '\n')
        .split('\n')
        .join('  \n');
  };

  const handleAiAction = async (action: 'create' | 'format') => {
    if (action === 'format' && !editValue.trim()) return;
    
    setLoading(true);
    const result = await generateWod(editValue || `WOD para ${selectedDay}`, action);
    
    const newSchedule = { ...weeklyWods, [selectedDay]: result };
    saveProgramming(newSchedule);
    setEditValue(result); // Update the textarea too
    setLoading(false);
  };

  const handleManualSave = () => {
      const newSchedule = { ...weeklyWods, [selectedDay]: editValue };
      saveProgramming(newSchedule);
      setMode('view');
  }

  const startEditing = () => {
      setEditValue(currentWodText);
      setMode('edit');
  }

  return (
    <div className="space-y-4 animate-fade-in pb-20">
      
      {/* Day Selector */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
            {DAYS_OF_WEEK.map((day) => (
                <button
                    key={day}
                    onClick={() => handleDayChange(day)}
                    className={`
                        px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider transition-all border
                        ${selectedDay === day 
                            ? 'bg-cf-accent text-white border-cf-accent shadow-[0_0_15px_rgba(185,28,28,0.4)]' 
                            : 'bg-stone-900 text-stone-500 border-stone-800 hover:bg-stone-800 hover:text-stone-300'}
                    `}
                >
                    {day.substring(0, 3)}
                </button>
            ))}
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-cf-card p-5 rounded-xl border border-stone-800">
        <div>
          <h2 className="text-xl font-black italic uppercase text-white tracking-tight">
            <span className="text-cf-accent mr-2">//</span>
            {selectedDay}
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-1">
            {isCoach ? "MODO COACH ACTIVADO" : "PROGRAMACIÓN DIARIA"}
          </p>
        </div>
        
        <div className="flex gap-2">
          {isCoach ? (
              mode === 'view' ? (
                <button 
                    onClick={startEditing}
                    className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-stone-700"
                >
                    <EditIcon /> Editar
                </button>
              ) : (
                <button 
                    onClick={() => setMode('view')}
                    className="text-stone-500 hover:text-white px-4 py-2 text-xs font-bold uppercase"
                >
                    Cancelar
                </button>
              )
          ) : (
            <div className="flex items-center gap-2 text-cf-cream/60 text-xs px-3 py-1 bg-black/50 rounded border border-cf-cream/20 font-mono">
                <LockIcon /> VIEW ONLY
            </div>
          )}
        </div>
      </div>

      {mode === 'edit' && isCoach && (
        <div className="bg-cf-card p-4 rounded-xl border border-stone-800 space-y-4 animate-fade-in">
            <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder={`Escribe el WOD para ${selectedDay}...`}
                className="w-full h-96 bg-black border border-stone-800 rounded-lg p-4 text-stone-200 focus:ring-1 focus:ring-cf-accent outline-none font-mono text-sm whitespace-pre-wrap leading-relaxed"
            />
            
            <div className="flex flex-wrap gap-3">
                <button 
                    onClick={handleManualSave}
                    className="flex-1 bg-cf-accent text-white font-bold py-3 px-4 rounded-lg hover:bg-cf-accentHover transition-colors flex justify-center items-center gap-2 shadow-lg"
                >
                    <SaveIcon />
                    Guardar
                </button>
                <button 
                    onClick={() => handleAiAction('format')}
                    disabled={loading || !editValue}
                    className="flex-1 bg-stone-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 border border-stone-700"
                >
                    <SparklesIcon />
                    {loading ? '...' : 'Formatear'}
                </button>
                <button 
                    onClick={() => handleAiAction('create')}
                    disabled={loading}
                    className="flex-1 bg-indigo-950 text-indigo-200 font-medium py-3 px-4 rounded-lg hover:bg-indigo-900 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 border border-indigo-900"
                >
                    <SparklesIcon />
                    {loading ? '...' : 'Generar AI'}
                </button>
            </div>
        </div>
      )}

      {/* Display Area */}
      {mode === 'view' && (
        <div className="min-h-[400px] bg-stone-900 rounded-xl p-6 border border-stone-800 shadow-2xl relative overflow-hidden transition-all">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cf-accent opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            {currentWodText ? (
                <div className="prose prose-invert prose-headings:text-cf-cream prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-lg prose-headings:my-4 prose-p:text-stone-300 prose-p:my-1 prose-p:leading-relaxed prose-li:text-stone-300 prose-strong:text-white max-w-none">
                    <ReactMarkdown>
                        {getFormattedContent(currentWodText)}
                    </ReactMarkdown>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full py-24 text-cf-muted opacity-50">
                    <div className="mb-4 text-stone-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                    </div>
                    <p className="text-lg font-bold uppercase tracking-widest">Rest Day</p>
                    <p className="text-xs font-mono mt-1">Sin programación asignada</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default WodBoard;