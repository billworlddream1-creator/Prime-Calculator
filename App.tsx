
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Theme, CalculationEntry } from './types';
import { THEMES } from './constants';
import CalculatorButton from './components/CalculatorButton';
import { getMathInsight } from './services/geminiService';

interface CalculatorState {
  display: string;
  expression: string;
}

interface Alarm {
  id: string;
  time: string; // HH:mm format
  isActive: boolean;
  label: string;
}

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<CalculationEntry[]>([]);
  const [insight, setInsight] = useState<string>('Ready for math magic?');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'history' | 'calendar' | 'alarm' | 'system'>('history');
  
  // New States
  const [userName, setUserName] = useState<string>(localStorage.getItem('prime_user_name') || '');
  const [isShutdown, setIsShutdown] = useState(false);
  const [ramPower, setRamPower] = useState<number>(0);
  
  // Alarm States
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [newAlarmTime, setNewAlarmTime] = useState('08:00');
  const [isRinging, setIsRinging] = useState(false);

  // Undo/Redo stacks
  const [undoStack, setUndoStack] = useState<CalculatorState[]>([]);
  const [redoStack, setRedoStack] = useState<CalculatorState[]>([]);

  // Simulation: Calculate "RAM Power" based on hardware concurrency and device memory if available
  useEffect(() => {
    const corePower = (navigator.hardwareConcurrency || 4) * 250;
    const memPower = ((navigator as any).deviceMemory || 8) * 512;
    const total = corePower + memPower + Math.floor(Math.random() * 100);
    setRamPower(total);
  }, []);

  // Clock & Alarm Monitor
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const triggered = alarms.find(a => a.isActive && a.time === timeStr);
      if (triggered && !isRinging && now.getSeconds() === 0) {
        setIsRinging(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms, isRinging]);

  const recordState = useCallback((newDisplay: string, newExpression: string) => {
    if (isShutdown) return;
    setUndoStack(prev => [...prev, { display, expression }].slice(-20));
    setRedoStack([]);
    setDisplay(newDisplay);
    setExpression(newExpression);
  }, [display, expression, isShutdown]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0 || isShutdown) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, { display, expression }]);
    setUndoStack(prev => prev.slice(0, -1));
    setDisplay(previous.display);
    setExpression(previous.expression);
  }, [display, expression, isShutdown, undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0 || isShutdown) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, { display, expression }]);
    setRedoStack(prev => prev.slice(0, -1));
    setDisplay(next.display);
    setExpression(next.expression);
  }, [display, expression, isShutdown, redoStack]);

  const changeTheme = useCallback(() => {
    const currentIndex = THEMES.findIndex(t => t.name === currentTheme.name);
    const nextIndex = (currentIndex + 1) % THEMES.length;
    setCurrentTheme(THEMES[nextIndex]);
  }, [currentTheme.name]);

  const handleNumber = useCallback((num: string) => {
    if (isShutdown) return;
    if (num === '.' && display.includes('.')) return;
    const newDisplay = display === '0' && num !== '.' ? num : display + num;
    recordState(newDisplay, expression);
  }, [display, expression, isShutdown, recordState]);

  const handleOperator = useCallback((op: string) => {
    if (isShutdown) return;
    const displayOp = op === '**' ? '^' : op;
    const newExpression = display + ' ' + displayOp + ' ';
    recordState('0', newExpression);
  }, [display, isShutdown, recordState]);

  const handleClear = useCallback(() => recordState('0', ''), [recordState]);

  const handlePercent = useCallback(() => {
    if (isShutdown) return;
    const value = parseFloat(display);
    if (isNaN(value)) return;
    recordState((value / 100).toString(), expression);
  }, [display, expression, isShutdown, recordState]);

  const handleLoadHistory = useCallback((item: CalculationEntry) => {
    recordState(item.result, item.expression);
    setInsight(`Recalling: ${item.expression} = ${item.result}`);
  }, [recordState]);

  const clearHistory = useCallback(() => {
    if (window.confirm("Clear all calculation history?")) {
      setHistory([]);
    }
  }, []);

  const handleCalculate = useCallback(async () => {
    if (isShutdown) return;
    try {
      const fullExpression = expression + display;
      if (!fullExpression || fullExpression.trim() === display) return;
      
      const sanitized = fullExpression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      const result = new Function(`return ${sanitized}`)().toString();
      
      const newEntry: CalculationEntry = {
        id: Math.random().toString(36).substr(2, 9),
        expression: fullExpression,
        result: result,
        timestamp: new Date(),
      };

      recordState(result, '');
      setHistory(prev => [newEntry, ...prev].slice(0, 10));

      setIsLoadingInsight(true);
      const fact = await getMathInsight(fullExpression, result);
      setInsight(fact);
      setIsLoadingInsight(false);

    } catch (error) {
      setDisplay('Error');
      setInsight('That expression looks complex even for me!');
    }
  }, [display, expression, isShutdown, recordState]);

  const handleBackspace = useCallback(() => {
    if (isShutdown) return;
    const newDisplay = display.length > 1 ? display.slice(0, -1) : '0';
    recordState(newDisplay, expression);
  }, [display, isShutdown, recordState]);

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input (like alarm label or time)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (isShutdown) return;

      // Numbers
      if (/[0-9]/.test(e.key)) {
        e.preventDefault();
        handleNumber(e.key);
      }
      
      // Operators
      if (['+', '-', '*', '/'].includes(e.key)) {
        e.preventDefault();
        handleOperator(e.key);
      }

      // Special keys
      if (e.key === '.' || e.key === ',') {
        e.preventDefault();
        handleNumber('.');
      }
      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleCalculate();
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
      if (e.key === '%') {
        e.preventDefault();
        handlePercent();
      }

      // Undo/Redo Shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleCalculate, handleBackspace, handleClear, handlePercent, handleUndo, handleRedo, isShutdown]);

  const handleShutdown = () => {
    if (window.confirm("Are you sure you want to shutdown the Prime system?")) {
      setIsShutdown(true);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  };

  const handleLogin = () => {
    const name = prompt("Enter your name to login to Bill World Prime System:");
    if (name) {
      setUserName(name);
      localStorage.setItem('prime_user_name', name);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Alarm Actions
  const addAlarm = () => {
    const newAlarm: Alarm = {
      id: Math.random().toString(36).substr(2, 9),
      time: newAlarmTime,
      isActive: true,
      label: 'Wake Up'
    };
    setAlarms([...alarms, newAlarm]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const stopRinging = () => setIsRinging(false);

  // Calendar logic
  const calendarDays = useMemo(() => {
    const date = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1);
    const days = [];
    const firstDay = date.getDay();
    for (let i = 0; i < firstDay; i++) days.push(null);
    const daysInMonth = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [currentTime]);

  const isGrassTheme = currentTheme.name === 'Verdan Meadow';

  if (isShutdown) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono p-4">
        <div className="w-64 h-1 bg-white/20 mb-4 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 animate-[shutdown_3s_linear_forwards]"></div>
        </div>
        <p className="text-sm tracking-widest animate-pulse">SHUTTING DOWN SYSTEM...</p>
        <p className="text-[10px] mt-4 opacity-50">BILL WORLD PRIME CALCULATOR V2.0.4</p>
        <style>{`
          @keyframes shutdown {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} ${isGrassTheme ? 'grass-pattern' : ''} flex flex-col items-center justify-center p-4 transition-all duration-700 relative overflow-hidden`}>
      {/* Alarm Ringing Overlay */}
      {isRinging && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center animate-pulse">
          <div className="bg-red-500 p-8 rounded-full mb-8 shadow-[0_0_50px_rgba(239,68,68,0.8)]">
            <svg className="w-20 h-20 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase">Alarm Ringing!</h2>
          <p className="text-white/60 mb-8 font-bold">It's math time, {userName || 'Bill World'}!</p>
          <button 
            onClick={stopRinging}
            className="px-12 py-4 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-110 transition-transform shadow-2xl"
          >
            Stop Alarm
          </button>
        </div>
      )}

      {/* Decorative Blades for Grass Theme */}
      {isGrassTheme && (
        <div className="absolute bottom-0 left-0 w-full h-32 opacity-20 pointer-events-none flex items-end justify-around overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-lime-400 w-1" 
              style={{ 
                height: `${20 + Math.random() * 80}px`, 
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                borderRadius: '100% 100% 0 0'
              }}
            ></div>
          ))}
        </div>
      )}

      <header className="mb-6 text-center z-10">
        <h1 className="text-5xl font-extrabold tracking-tighter drop-shadow-lg text-white">Prime Calculator</h1>
        <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] mb-4">by Bill World</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-white/60 text-sm font-medium tracking-wide">In {currentTheme.name}</p>
          <span className="w-1 h-1 rounded-full bg-white/30"></span>
          <p className="text-white/80 text-sm mono-font font-bold">{formatTime(currentTime)}</p>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl items-stretch z-10">
        {/* Main Calculator Card */}
        <section className={`flex-1 ${currentTheme.card} backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl flex flex-col relative overflow-hidden min-h-[600px]`}>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

          <div className="flex justify-between items-center mb-6 relative">
            <div className="flex gap-2.5">
              <button onClick={handleShutdown} className="w-8 h-8 rounded-full bg-red-600/20 hover:bg-red-600 transition-colors flex items-center justify-center text-white/40 hover:text-white shadow-inner group" title="Shutdown System">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </button>
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-inner mt-2.5"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-inner mt-2.5"></div>
            </div>
            
            <div className="flex gap-2">
               <button onClick={handleUndo} disabled={undoStack.length === 0} className="text-white/50 hover:text-white disabled:opacity-20 transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 shadow-sm active:scale-90" title="Undo (Ctrl+Z)">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
              </button>
              <button onClick={handleRedo} disabled={redoStack.length === 0} className="text-white/50 hover:text-white disabled:opacity-20 transition-all bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 shadow-sm active:scale-90" title="Redo (Ctrl+Y)">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
              </button>
              <button onClick={changeTheme} className="text-white/50 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-white/5 shadow-sm active:scale-95">
                Shuffle
              </button>
            </div>
          </div>

          <div className="mb-4 text-right overflow-hidden relative">
            <div className="h-8 text-white/40 text-xl mb-1 mono-font truncate tracking-tight">{expression}</div>
            <div className="text-6xl font-bold mono-font text-white truncate transition-all duration-300">{display}</div>
          </div>

          {/* User Personalization Display */}
          <div className="mb-6 flex items-center gap-3 px-2">
            <div className="h-px flex-1 bg-white/10"></div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {userName ? `Hello ${userName}` : 'Guest Mode'}
            </div>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <div className="grid grid-cols-4 gap-3 flex-1">
            <CalculatorButton label="AC" variant="action" onClick={handleClear} />
            <CalculatorButton label="⌫" variant="operator" onClick={handleBackspace} />
            <CalculatorButton label="xⁿ" variant="operator" onClick={() => handleOperator('**')} />
            <CalculatorButton label="÷" variant="operator" onClick={() => handleOperator('/')} />

            <CalculatorButton label="7" onClick={() => handleNumber('7')} />
            <CalculatorButton label="8" onClick={() => handleNumber('8')} />
            <CalculatorButton label="9" onClick={() => handleNumber('9')} />
            <CalculatorButton label="×" variant="operator" onClick={() => handleOperator('*')} />

            <CalculatorButton label="4" onClick={() => handleNumber('4')} />
            <CalculatorButton label="5" onClick={() => handleNumber('5')} />
            <CalculatorButton label="6" onClick={() => handleNumber('6')} />
            <CalculatorButton label="-" variant="operator" onClick={() => handleOperator('-')} />

            <CalculatorButton label="1" onClick={() => handleNumber('1')} />
            <CalculatorButton label="2" onClick={() => handleNumber('2')} />
            <CalculatorButton label="3" onClick={() => handleNumber('3')} />
            <CalculatorButton label="+" variant="operator" onClick={() => handleOperator('+')} />

            <CalculatorButton label="0" onClick={() => handleNumber('0')} />
            <CalculatorButton label="%" variant="operator" onClick={handlePercent} />
            <CalculatorButton label="." onClick={() => handleNumber('.')} />
            <CalculatorButton label="=" variant="equal" accentColor={currentTheme.accent} onClick={handleCalculate} />
          </div>
        </section>

        {/* Side Panel: Tabs for History, Calendar, Alarm, System */}
        <aside className="w-full lg:w-96 flex flex-col gap-4">
          {/* Gemini Insight - Fixed on top */}
          <div className={`${currentTheme.secondary} backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl h-44 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1 rounded bg-white/10 shadow-inner">
                   <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                </span>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Gemini Insight</h3>
              </div>
              <p className={`text-sm leading-relaxed font-medium transition-opacity duration-300 ${isLoadingInsight ? 'opacity-30' : 'opacity-100'}`}>
                {insight}
              </p>
            </div>
            {isLoadingInsight && (
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce [animation-delay:-0.3s]"></div>
              </div>
            )}
          </div>

          {/* Tabbed Tool Panel */}
          <div className={`${currentTheme.secondary} backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 flex-1 shadow-2xl flex flex-col overflow-hidden min-h-[400px]`}>
             {/* Tab Navigation */}
             <nav className="flex items-center gap-1 bg-black/20 p-1 rounded-2xl mb-6 shadow-inner overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all whitespace-nowrap px-2 ${activeTab === 'history' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >History</button>
                <button 
                  onClick={() => setActiveTab('calendar')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all whitespace-nowrap px-2 ${activeTab === 'calendar' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >Calendar</button>
                <button 
                  onClick={() => setActiveTab('alarm')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all whitespace-nowrap px-2 ${activeTab === 'alarm' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >Alarm</button>
                <button 
                  onClick={() => setActiveTab('system')}
                  className={`flex-1 py-2 text-[9px] font-black uppercase tracking-tighter rounded-xl transition-all whitespace-nowrap px-2 ${activeTab === 'system' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
                >System</button>
             </nav>

             <div className="flex-1 overflow-y-auto custom-scrollbar">
               {activeTab === 'history' && (
                 <div className="space-y-4 animate-fade-in">
                   <div className="flex justify-between items-center px-1">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Recent Calculations</p>
                     {history.length > 0 && (
                       <button onClick={clearHistory} className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/10">
                         Clear All
                       </button>
                     )}
                   </div>
                   <div className="space-y-2">
                     {history.length === 0 ? (
                       <div className="flex flex-col items-center justify-center py-10 opacity-20">
                         <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                         <p className="text-xs italic font-bold uppercase tracking-widest">No history</p>
                       </div>
                     ) : (
                       history.map((item) => (
                         <button key={item.id} onClick={() => handleLoadHistory(item)} className="w-full text-left group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 active:scale-[0.98] shadow-sm">
                           <div className="text-[10px] text-white/30 mb-1 mono-font group-hover:text-white/50 transition-colors tracking-wider uppercase">{item.expression}</div>
                           <div className="text-xl font-bold text-white/90 mono-font truncate">{item.result}</div>
                         </button>
                       ))
                     )}
                   </div>
                 </div>
               )}

               {activeTab === 'calendar' && (
                 <div className="animate-fade-in">
                    <div className="text-center mb-4">
                      <h4 className="text-sm font-black uppercase tracking-widest text-white">
                        {currentTime.toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </h4>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                      {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] font-bold text-white/30">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((day, idx) => {
                        const isToday = day === currentTime.getDate();
                        return (
                          <div key={idx} className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all ${day === null ? 'opacity-0' : 'hover:bg-white/10 cursor-default'} ${isToday ? `${currentTheme.accent} text-white shadow-lg scale-110 ring-2 ring-white/20` : 'text-white/60'}`}>
                            {day}
                          </div>
                        );
                      })}
                    </div>
                 </div>
               )}

               {activeTab === 'alarm' && (
                 <div className="space-y-4 animate-fade-in">
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/10 shadow-inner">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Set New Alarm</p>
                      <div className="flex gap-2">
                        <input type="time" value={newAlarmTime} onChange={(e) => setNewAlarmTime(e.target.value)} className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-bold flex-1 outline-none focus:border-white/40 transition-colors shadow-inner" />
                        <button onClick={addAlarm} className={`${currentTheme.accent} text-white p-2 rounded-xl hover:brightness-110 active:scale-90 transition-all shadow-md`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {alarms.map((alarm) => (
                        <div key={alarm.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center justify-between group transition-all hover:bg-white/10 shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-2xl font-black mono-font text-white">{alarm.time}</span>
                            <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{alarm.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => toggleAlarm(alarm.id)} className={`w-10 h-5 rounded-full relative transition-all shadow-inner ${alarm.isActive ? 'bg-emerald-500' : 'bg-white/20'}`}>
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-md ${alarm.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
                            </button>
                            <button onClick={() => deleteAlarm(alarm.id)} className="text-white/20 hover:text-red-400 p-1 transition-colors active:scale-90">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               )}

               {activeTab === 'system' && (
                 <div className="space-y-4 animate-fade-in font-mono">
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-4">
                      <h4 className="text-[10px] font-black uppercase text-white/40 mb-4 tracking-[0.2em]">Diagnostic Analysis</h4>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-white/60">RAM PROCESSING POWER</span>
                            <span className="text-blue-400">{ramPower} PPS</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${Math.min(100, (ramPower / 5000) * 100)}%` }}></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[9px]">
                          <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <div className="text-white/30 mb-1">OS ENV</div>
                            <div className="text-white font-bold truncate">{(navigator.userAgent.match(/\(([^)]+)\)/) || [])[1] || 'Unknown'}</div>
                          </div>
                          <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                            <div className="text-white/30 mb-1">ENGINE</div>
                            <div className="text-white font-bold">V8_JIT_RUNTIME</div>
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col gap-2">
                           <button onClick={handleLogin} className="w-full py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500/20 transition-all">
                             {userName ? 'Change Account' : 'Login System'}
                           </button>
                           <button onClick={handleShutdown} className="w-full py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all">
                             Emergency Shutdown
                           </button>
                        </div>
                      </div>
                    </div>
                    <div className="text-[8px] text-white/20 text-center leading-relaxed">
                      SECURE BILL WORLD QUANTUM ENCRYPTION ACTIVE<br/>
                      POWERED BY GEMINI 3 FLASH NANO ENGINE
                    </div>
                 </div>
               )}
             </div>
          </div>
        </aside>
      </main>

      <div className="mt-4 flex flex-col items-center gap-1 z-10">
         <p className="text-white/50 text-[12px] font-medium animate-pulse-soft">
           {userName ? `Welcome back, ${userName}. Ready for Prime processing.` : 'Please login via System Tab for personalized insights.'}
         </p>
      </div>

      <footer className="mt-8 text-white/30 text-[10px] uppercase tracking-[0.3em] font-black z-10 text-center animate-pulse-soft">
        &copy; {new Date().getFullYear()} Prime Calculator &bull; Bill World Signature Series
      </footer>
    </div>
  );
};

export default App;
