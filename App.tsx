import React, { useState } from 'react';
import Calculator from './components/Calculator';
import WodBoard from './components/WodBoard';
import { AppTab } from './types';

// Icons
const CalcIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#000000" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><path d="m17 5-9.5 9.5"/><path d="m19 12-9.4 9.4"/><path d="M8.2 2H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.2"/></svg>
);

const WodIcon = ({ active }: { active: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "#000000" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 18h-6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2Z"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 10h20"/><path d="M10 2v2"/><path d="M10 20v2"/></svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const CoachIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="M19 16v6"/><path d="M22 19h-6"/></svg>
);

const LogOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.WOD);
  
  // Auth State
  const [authStage, setAuthStage] = useState<'selection' | 'login' | 'app'>('selection');
  const [isCoachMode, setIsCoachMode] = useState(false);
  
  // Login Inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Credentials for Coach Ronal
      if (username.trim() === 'Ronal' && password.trim() === '12345') {
          setIsCoachMode(true);
          setAuthStage('app');
          setError('');
      } else {
          setError('Usuario o contraseña incorrectos');
      }
  };

  const handleAthleteEnter = () => {
      setIsCoachMode(false);
      setAuthStage('app');
  };

  const handleLogout = () => {
      setAuthStage('selection');
      setIsCoachMode(false);
      setUsername('');
      setPassword('');
      setError('');
  };

  // --- RENDER: AUTH SCREENS ---

  if (authStage === 'selection') {
      return (
        <div className="min-h-screen bg-cf-dark text-cf-text flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
            {/* Background Texture/Gradient for Grunge feel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900 via-black to-black opacity-80 z-0"></div>

            <div className="mb-12 text-center flex flex-col items-center z-10">
                {/* Reverted to Circular Logo with Text */}
                <div className="w-48 h-48 mb-6 bg-black rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_0_40px_rgba(185,28,28,0.3)] border-4 border-stone-800 transition-transform duration-500 hover:scale-105 group">
                     <img 
                        src="wildblood_logo.png" 
                        alt="Wild Blood Logo" 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        onError={(e) => {
                            // Fallback if image is missing
                            e.currentTarget.style.display = 'none';
                        }}
                     />
                     {/* Fallback Text if image fails */}
                     <span className="absolute text-cf-accent font-black text-4xl italic opacity-0 group-hover:opacity-0">WB</span>
                </div>
                
                <h1 className="text-5xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cf-cream to-stone-400 drop-shadow-sm">
                    Wild Blood
                </h1>
                <p className="text-cf-accent font-bold tracking-[0.3em] text-sm mt-2 uppercase">Programming</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg z-10">
                <button 
                    onClick={handleAthleteEnter}
                    className="flex flex-col items-center justify-center bg-stone-900/80 backdrop-blur-sm border border-stone-800 p-8 rounded-xl transition-all group hover:border-cf-cream hover:shadow-[0_0_20px_rgba(227,213,179,0.15)] relative overflow-hidden"
                >
                    <div className="text-stone-500 group-hover:text-cf-cream transition-colors mb-4 scale-110 group-hover:scale-125 duration-300">
                        <UserIcon />
                    </div>
                    <span className="text-2xl font-black text-white italic uppercase tracking-tight">Soy Atleta</span>
                    <span className="text-xs text-cf-muted mt-2 tracking-wide font-mono">SOLO LECTURA</span>
                </button>

                <button 
                    onClick={() => setAuthStage('login')}
                    className="flex flex-col items-center justify-center bg-stone-900/80 backdrop-blur-sm border border-stone-800 p-8 rounded-xl transition-all group hover:border-cf-accent hover:shadow-[0_0_20px_rgba(185,28,28,0.2)] relative overflow-hidden"
                >
                    <div className="text-stone-500 group-hover:text-cf-accent transition-colors mb-4 scale-110 group-hover:scale-125 duration-300">
                        <CoachIcon />
                    </div>
                    <span className="text-2xl font-black text-white italic uppercase tracking-tight">Soy Coach</span>
                    <span className="text-xs text-cf-muted mt-2 tracking-wide font-mono">ACCESO EDITORIAL</span>
                </button>
            </div>
        </div>
      );
  }

  if (authStage === 'login') {
      return (
        <div className="min-h-screen bg-cf-dark text-cf-text flex flex-col items-center justify-center p-6 animate-fade-in relative">
             <div className="absolute top-6 left-6">
                <button 
                    onClick={() => {
                        setAuthStage('selection');
                        setError('');
                    }}
                    className="flex items-center gap-2 text-stone-500 hover:text-cf-cream transition-colors font-bold uppercase text-xs tracking-wider"
                >
                    ← Regresar
                </button>
             </div>

             <div className="w-full max-w-sm bg-stone-900 p-8 rounded-2xl border border-stone-800 shadow-2xl relative">
                {/* Logo on Login - Reverted to Circular */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-black rounded-full border-4 border-stone-800 overflow-hidden flex items-center justify-center shadow-lg">
                    <img src="wildblood_logo.png" className="w-full h-full object-cover" alt="WB" />
                </div>

                <div className="mt-10 mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white uppercase italic">Acceso Coach</h2>
                    <p className="text-xs text-cf-accent font-mono mt-1">SISTEMA DE PROGRAMACIÓN</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded-lg p-4 text-white focus:ring-1 focus:ring-cf-accent focus:border-cf-accent outline-none transition-all placeholder-stone-600"
                            placeholder="Usuario"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-stone-800 rounded-lg p-4 text-white focus:ring-1 focus:ring-cf-accent focus:border-cf-accent outline-none transition-all placeholder-stone-600"
                            placeholder="Contraseña"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-red-400 text-xs font-mono text-center">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-cf-accent text-white font-black uppercase italic py-4 rounded-lg hover:bg-cf-accentHover transition-all mt-4 shadow-lg hover:shadow-red-900/40 tracking-wider"
                    >
                        Ingresar al Sistema
                    </button>
                </form>
             </div>
        </div>
      );
  }

  // --- RENDER: MAIN APP ---

  return (
    <div className="min-h-screen bg-cf-dark text-cf-text font-sans flex flex-col animate-fade-in">
      {/* Top Bar */}
      <header className="bg-black/80 backdrop-blur-xl sticky top-0 z-50 border-b border-stone-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
             {/* Small header logo - Reverted to Circular */}
             <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-800 border border-stone-700 flex items-center justify-center relative shrink-0">
                 <img 
                    src="wildblood_logo.png" 
                    alt="WB" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display='none' }}
                 />
            </div>
            <div>
                <h1 className="font-extrabold text-lg leading-none uppercase italic tracking-tighter text-white">
                Wild Blood <span className="text-cf-accent">Program</span>
                </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-cf-cream uppercase tracking-wide">{isCoachMode ? 'Coach' : 'Atleta'}</p>
                {isCoachMode && <p className="text-[10px] text-stone-500 uppercase tracking-wider">Modo Edición</p>}
             </div>
             <button 
                onClick={handleLogout}
                className="p-2 bg-stone-900 text-stone-400 hover:text-cf-accent hover:bg-black rounded-lg transition-all border border-stone-800"
                title="Cerrar Sesión"
             >
                <LogOutIcon />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-3xl mx-auto w-full px-4 py-6 pb-32">
        {activeTab === AppTab.WOD && <WodBoard isCoach={isCoachMode} />}
        {activeTab === AppTab.CALCULATOR && <Calculator />}
      </main>

      {/* Bottom Sticky Navigation */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-stone-900/95 backdrop-blur-lg border border-stone-700/50 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.8)] p-2 z-50 flex justify-between items-center">
        <button
          onClick={() => setActiveTab(AppTab.WOD)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-300 ${
            activeTab === AppTab.WOD
              ? 'bg-cf-accent text-white font-bold shadow-[0_0_15px_rgba(185,28,28,0.4)]'
              : 'text-stone-500 hover:text-cf-cream'
          }`}
        >
          <WodIcon active={activeTab === AppTab.WOD} />
          <span className="text-xs uppercase font-bold tracking-wide">WOD</span>
        </button>
        
        <button
          onClick={() => setActiveTab(AppTab.CALCULATOR)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full transition-all duration-300 ${
            activeTab === AppTab.CALCULATOR
              ? 'bg-cf-accent text-white font-bold shadow-[0_0_15px_rgba(185,28,28,0.4)]'
              : 'text-stone-500 hover:text-cf-cream'
          }`}
        >
          <CalcIcon active={activeTab === AppTab.CALCULATOR} />
          <span className="text-xs uppercase font-bold tracking-wide">Porcentajes</span>
        </button>
      </nav>
    </div>
  );
};

export default App;