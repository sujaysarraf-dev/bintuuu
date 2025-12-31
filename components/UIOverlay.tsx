
import React, { useState, useEffect } from 'react';
import { AppScene, TravelMode } from '../types';
import { TRAVEL_MODES, DUAS } from '../constants';

interface ActionButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

const ActionButton = ({ onClick, children, className = "" }: ActionButtonProps) => (
  <button 
    onClick={onClick}
    className={`group relative px-8 py-4 md:px-10 md:py-4 bg-amber-500/20 backdrop-blur-md overflow-hidden rounded-full border-2 border-amber-300/50 transition-all duration-500 hover:border-amber-400 hover:bg-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] active:scale-95 ${className}`}
  >
    <span className="relative z-10 text-amber-50 font-bold tracking-[0.2em] uppercase text-xs md:text-sm group-hover:text-white transition-colors">
      {children}
    </span>
    <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/40 to-amber-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
  </button>
);

interface UIOverlayProps {
  currentScene: AppScene;
  travelMode: TravelMode;
  onNext: () => void;
  onSetTravel: (mode: TravelMode) => void;
  score: number;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ currentScene, travelMode, onNext, onSetTravel, score }) => {
  const [password, setPassword] = useState('');
  const [startPass, setStartPass] = useState('');
  const [startUnlocked, setStartUnlocked] = useState(false);
  const [showDua, setShowDua] = useState<string | null>(null);
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isWrongStartPass, setIsWrongStartPass] = useState(false);
  const [travelProgress, setTravelProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wishIndex, setWishIndex] = useState<number | null>(null);
  const [treasureOpened, setTreasureOpened] = useState(false);
  const [boxShaking, setBoxShaking] = useState(false);
  const [timeKT, setTimeKT] = useState('');
  const [timeLH, setTimeLH] = useState('');

  useEffect(() => {
    if (currentScene === AppScene.SKY_TRAVEL) {
      setTravelProgress(0);
      const interval = setInterval(() => {
        setTravelProgress(p => Math.min(p + (100 / 55), 100));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentScene]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeKT(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu', hour12: false, hour: '2-digit', minute: '2-digit' }));
      setTimeLH(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Karachi', hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartPassSubmit = () => {
    if (startPass === '2026') {
      setStartUnlocked(true);
    } else {
      setIsWrongStartPass(true);
      setTimeout(() => setIsWrongStartPass(false), 500);
    }
  };

  const handlePasswordSubmit = () => {
    if (password.toLowerCase().trim() === 'bintu') {
      onNext();
    } else {
      setIsWrongPassword(true);
      setAttempts(prev => prev + 1);
      setShowHint(true);
      setTimeout(() => setIsWrongPassword(false), 1000);
    }
  };

  const handleDuaGen = () => {
    const randomDua = DUAS[Math.floor(Math.random() * DUAS.length)].text;
    setShowDua(randomDua);
  };

  const handleBoxClick = () => {
    setBoxShaking(true);
    setTimeout(() => {
      setBoxShaking(false);
      setTreasureOpened(true);
    }, 600);
  };

  const renderContent = () => {
    switch (currentScene) {
      case AppScene.START:
        if (!startUnlocked) {
          return (
            <div className="flex flex-col items-center text-center space-y-8 w-[90%] max-w-sm px-6 bg-slate-900/90 p-10 rounded-[2.5rem] border-2 border-amber-500/30 backdrop-blur-3xl shadow-2xl animate-fade-in-up">
              <div className="space-y-2">
                <h2 className="text-xl text-amber-100 uppercase tracking-[0.2em] font-bold">New Year Access</h2>
                <p className="text-[10px] text-slate-400 tracking-wider">Enter the Year to begin</p>
              </div>
              <div className="w-full space-y-4">
                <input 
                  type="text"
                  placeholder="20XX"
                  value={startPass}
                  onChange={(e) => setStartPass(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartPassSubmit()}
                  className={`w-full px-6 py-4 bg-black/60 border-2 ${isWrongStartPass ? 'border-red-500 animate-shake' : 'border-amber-500/20'} rounded-2xl text-white text-center focus:outline-none focus:border-amber-500 transition-all font-mono tracking-[0.5em] text-xl`}
                />
                <button 
                  onClick={handleStartPassSubmit}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 rounded-2xl text-white font-bold transition-all shadow-xl shadow-amber-900/40 uppercase tracking-[0.1em] active:scale-95 border-b-4 border-amber-800"
                >
                  Enter Journey
                </button>
              </div>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center text-center space-y-6 max-w-sm md:max-w-lg px-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-7xl font-bold tracking-[0.2em] md:tracking-[0.3em] text-amber-50 drop-shadow-lg uppercase leading-tight">Kathmandu</h1>
            <p className="text-lg md:text-xl text-slate-300 font-light italic">“Somewhere in Kathmandu… Suji begins a journey.”</p>
            <ActionButton onClick={onNext} className="mt-12">Start My Journey</ActionButton>
          </div>
        );
      case AppScene.CHOOSE_TRAVEL:
        return (
          <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 max-w-2xl px-6 animate-fade-in-up">
            <h2 className="text-2xl md:text-3xl text-amber-50 font-light tracking-wider">How should Suji travel to Bintu in Lahore?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
              {TRAVEL_MODES.map((mode) => (
                <button key={mode.id} onClick={() => { onSetTravel(mode.id as TravelMode); onNext(); }} className="p-6 md:p-8 bg-slate-900/80 backdrop-blur-lg border-2 border-white/10 rounded-3xl hover:border-amber-400 hover:bg-slate-800 transition-all transform active:scale-95 md:hover:-translate-y-3 group shadow-2xl">
                  <div className="text-4xl md:text-5xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500">{mode.icon}</div>
                  <div className="text-slate-300 font-bold tracking-widest uppercase text-[10px] md:text-xs">{mode.label}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case AppScene.SKY_TRAVEL:
        return (
          <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 max-w-xl px-6 pointer-events-none animate-fade-in-up">
            <div className="text-6xl md:text-7xl animate-bounce drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">{TRAVEL_MODES.find(m => m.id === travelMode)?.icon}</div>
            <div className="space-y-3">
              <p className="text-2xl md:text-3xl text-amber-100/90 font-serif italic">“Every mile carries a dua.”</p>
              <p className="text-xs md:text-sm text-slate-400 tracking-[0.3em] uppercase opacity-70">On the way to you...</p>
            </div>
            <div className="w-full max-w-[280px] h-1.5 bg-white/10 rounded-full overflow-hidden mt-6 md:mt-10 relative">
              <div className="h-full bg-amber-400 transition-all duration-100 ease-linear shadow-[0_0_15px_#fbbf24]" style={{ width: `${travelProgress}%` }} />
            </div>
          </div>
        );
      case AppScene.ARRIVAL_LAHORE:
        return (
          <div className="flex flex-col items-center text-center space-y-8 px-6 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold tracking-[0.2em] text-amber-50 uppercase leading-snug">Reached Lahore</h2>
            <p className="text-lg md:text-xl text-slate-200 font-light italic max-w-xs">“Bintu… this journey was made only for you.”</p>
            <ActionButton onClick={onNext} className="mt-8">Enter Moon Garden</ActionButton>
          </div>
        );
      case AppScene.MOON_GARDEN:
        return (
          <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 w-[90%] max-w-2xl px-6 md:px-10 bg-slate-950/80 p-10 md:p-16 rounded-[2rem] md:rounded-[3rem] border border-white/10 backdrop-blur-2xl shadow-2xl animate-fade-in-up">
            <h2 className="text-2xl md:text-4xl text-amber-200 font-light tracking-widest leading-relaxed">Assalamu Alaikum Binte 🌙</h2>
            <h1 className="text-xl md:text-2xl text-white font-serif tracking-[0.3em] md:tracking-[0.4em] uppercase opacity-80">Happy New Year 2026</h1>
            <div className="h-px w-24 bg-amber-500/30 my-2" />
            <p className="text-xl md:text-2xl text-amber-50 leading-relaxed font-serif italic">“You are not just a friend.<br/>You are my best friend.”</p>
            <button onClick={onNext} className="mt-8 text-amber-100 hover:text-amber-300 font-bold tracking-[0.3em] uppercase text-[10px] md:text-[12px] transition-all py-3 px-6 border-2 border-amber-500/30 bg-amber-500/10 rounded-full">Continue Story •••</button>
          </div>
        );
      case AppScene.FOOD_MOMENT:
        return (
          <div className="flex flex-col items-center text-center space-y-8 max-w-lg px-8 animate-fade-in-up">
            <div className="text-7xl mb-4 animate-bounce drop-shadow-lg">🍲</div>
            <h2 className="text-3xl text-amber-400 font-bold uppercase tracking-[0.2em]">A Special Moment</h2>
            <p className="text-xl text-slate-100 font-serif italic">“For Bintu — who loves Suji ka Halwa & Biryani.”</p>
            <p className="text-md text-slate-400 italic font-light">“One day, InshaAllah, this will be real.”</p>
            <ActionButton onClick={onNext} className="mt-10">Start Mini Game</ActionButton>
          </div>
        );
      case AppScene.MINI_GAME:
        return (
          <div className="flex flex-col items-center justify-center pointer-events-none w-full h-full relative">
             <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center pointer-events-auto bg-slate-950/90 p-6 rounded-3xl border-2 border-amber-500/50 backdrop-blur-2xl shadow-[0_0_50px_rgba(251,191,36,0.2)] animate-fade-in-up">
                <h3 className="text-lg md:text-xl text-amber-400 mb-1 font-bold uppercase tracking-widest">Catch the Halwa 🍯</h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Score:</span>
                  <p className="text-white font-mono text-4xl font-bold">{score}</p>
                </div>
                <button 
                  onClick={onNext}
                  className="mt-6 text-[10px] md:text-xs text-amber-300 hover:text-white transition-all tracking-[0.2em] uppercase font-bold py-3 px-6 border-2 border-amber-500/20 rounded-full bg-amber-500/5 active:scale-95"
                >
                  End Game
                </button>
             </div>
          </div>
        );
      case AppScene.SAME_CITY:
        const cityPromises = [
          "I would bring you Suji ka halwa",
          "I would bring you biryani",
          "I would say thank you in person",
          "I would smile more",
          "I would make more duas for you"
        ];
        return (
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-6 max-w-sm md:max-w-xl px-8 py-10 bg-slate-950/60 backdrop-blur-xl rounded-[2.5rem] border-2 border-amber-500/30 shadow-2xl animate-fade-in-up">
            <div className="space-y-3 mb-4 w-full">
              <h2 className="text-3xl md:text-5xl text-amber-400 uppercase tracking-widest font-bold leading-tight drop-shadow-lg">If I were in Lahore…</h2>
              <div className="h-1 w-24 bg-amber-500/60 rounded-full mx-auto md:mx-0 glow-pulse" />
            </div>
            
            <div className="space-y-4 md:space-y-6 w-full">
              {cityPromises.map((line, i) => (
                <div key={i} className="flex items-center justify-center md:justify-start gap-5 opacity-0 animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 0.7}s`, animationFillMode: 'forwards' }}>
                  <span className="text-amber-500 text-xl drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✨</span>
                  <p className="text-lg md:text-2xl text-white font-serif italic tracking-wide leading-relaxed">
                    {line}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="pt-10 w-full flex justify-center md:justify-start opacity-0 animate-fade-in-up" style={{ animationDelay: '4.5s', animationFillMode: 'forwards' }}>
              <ActionButton onClick={onNext}>Read My Letter</ActionButton>
            </div>
          </div>
        );
      case AppScene.LETTER:
        return (
          <div className="flex flex-col items-center px-6 animate-fade-in-up w-full">
            <div className="bg-[#fdfcf0] text-[#4a3b2a] p-8 md:p-20 rounded-lg shadow-2xl w-full max-w-2xl font-serif leading-relaxed relative overflow-hidden border-2 border-[#e6dec1]">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#dcd0a6]" />
              <h3 className="text-2xl md:text-3xl mb-6 md:mb-8 font-bold border-b-2 border-[#dcd0a6] pb-4 tracking-tighter">Dear Bintu,</h3>
              <p className="text-xl md:text-2xl mb-6 italic leading-relaxed font-light">Distance made us online,<br/>but Allah made us best friends.</p>
              <p className="text-lg md:text-xl mb-10 md:mb-12">Thank you for every smile, every word, every moment.</p>
              <div className="flex justify-end pt-6">
                <p className="text-right text-base md:text-lg">With Sincerity,<br/><span className="font-bold text-xl md:text-2xl">Suji</span></p>
              </div>
            </div>
            <ActionButton onClick={onNext} className="mt-10">Make 3 Wishes</ActionButton>
          </div>
        );
      case AppScene.THREE_WISHES:
        const wishes = ["May your heart always feel safe", "May your days be beautiful", "May your smile never fade"];
        return (
          <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 animate-fade-in-up w-full px-6">
            <h2 className="text-2xl md:text-3xl text-white font-serif italic tracking-widest">3 Wishes Only For You</h2>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              {wishes.map((wish, i) => (
                <div key={i} onClick={() => setWishIndex(i)} className={`cursor-pointer transition-all duration-500 flex flex-col items-center p-4 rounded-2xl ${wishIndex === i ? 'bg-amber-500/20 scale-110 opacity-100 border-2 border-amber-500/50 shadow-2xl' : 'opacity-50 grayscale md:hover:opacity-100 md:hover:grayscale-0'}`}>
                  <div className="text-5xl mb-4 animate-pulse">🌟</div>
                  {wishIndex === i && <p className="text-amber-100 text-xs md:text-sm max-w-[120px] font-bold uppercase tracking-tighter animate-fade-in-up text-center">{wish}</p>}
                </div>
              ))}
            </div>
            <ActionButton onClick={onNext} className="mt-8">View Time Bridge</ActionButton>
          </div>
        );
      case AppScene.TIME_BRIDGE:
        return (
          <div className="flex flex-col items-center justify-center w-full max-w-4xl px-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-12 bg-black/80 p-10 md:p-12 rounded-[2rem] md:rounded-[3rem] backdrop-blur-2xl border-2 border-white/10 shadow-2xl">
              <div className="text-center space-y-3">
                <h4 className="text-amber-400/80 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold">Kathmandu</h4>
                <p className="text-5xl md:text-6xl text-white font-mono tracking-tighter">{timeKT}</p>
              </div>
              <div className="h-px w-24 bg-amber-500/40 md:w-px md:h-24" />
              <div className="text-center space-y-3">
                <h4 className="text-amber-400/80 uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs font-bold">Lahore</h4>
                <p className="text-5xl md:text-6xl text-amber-300 font-mono tracking-tighter">{timeLH}</p>
              </div>
            </div>
            <h3 className="mt-10 text-xl md:text-2xl text-slate-300 font-serif italic text-center">“Different cities. Same dua.”</h3>
            <ActionButton onClick={onNext} className="mt-10">Open Treasure Box</ActionButton>
          </div>
        );
      case AppScene.TREASURE_BOX:
        const messages = ["You matter", "You are special", "You are remembered", "You are precious"];
        return (
          <div className="flex flex-col items-center px-6 animate-fade-in-up w-full max-w-md">
            {!treasureOpened ? (
              <div className="text-center flex flex-col items-center">
                <h2 className="text-2xl md:text-3xl text-amber-100 font-serif italic mb-16 tracking-widest leading-relaxed">Bintu’s Treasure Box</h2>
                <div 
                  onClick={handleBoxClick}
                  className={`text-8xl mb-12 cursor-pointer transition-transform duration-300 transform hover:scale-110 active:scale-90 select-none ${boxShaking ? 'animate-shake' : 'animate-bounce'}`}
                >
                  🎁
                </div>
                <p className="text-amber-200/60 uppercase tracking-widest text-[10px] font-bold animate-pulse">Tap the box to unlock its secrets</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 animate-fade-in-up w-full">
                {messages.map((msg, i) => (
                  <div key={i} className="bg-amber-500/30 border-2 border-amber-400/50 p-6 md:p-8 rounded-2xl md:rounded-3xl backdrop-blur-md text-center shadow-2xl">
                    <p className="text-white text-lg md:text-xl font-serif italic font-bold">“{msg}”</p>
                  </div>
                ))}
                <div className="md:col-span-2 flex justify-center mt-10">
                  <ActionButton onClick={onNext}>Final Credits</ActionButton>
                </div>
              </div>
            )}
          </div>
        );
      case AppScene.PASSWORD:
        return (
          <div className="flex flex-col items-center text-center space-y-8 w-[90%] max-w-sm px-6 bg-slate-900/90 p-10 rounded-[2.5rem] border-2 border-amber-500/30 backdrop-blur-3xl shadow-2xl animate-fade-in-up">
            <div className="space-y-2">
              <h2 className="text-2xl text-amber-100 uppercase tracking-[0.2em] font-bold">Secret Access</h2>
              <p className="text-[10px] md:text-xs text-slate-400 tracking-wider">Please enter the secret word to unlock</p>
            </div>
            <div className="w-full space-y-4">
              <input 
                type="text"
                placeholder="Hint: Your nickname"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className={`w-full px-6 py-4 bg-black/60 border-2 ${isWrongPassword ? 'border-red-500 animate-shake' : 'border-amber-500/20'} rounded-2xl text-white text-center focus:outline-none focus:border-amber-500 transition-all font-medium tracking-[0.2em] text-sm md:text-base`}
              />
              <button 
                onClick={handlePasswordSubmit}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 rounded-2xl text-white font-bold transition-all shadow-xl shadow-amber-900/40 uppercase tracking-[0.1em] active:scale-95 border-b-4 border-amber-800"
              >
                Access Memory
              </button>
            </div>
            {showHint && (
              <div className="space-y-2 animate-fade-in-up pt-2">
                <p className="text-[9px] text-amber-200/60 uppercase tracking-widest font-bold">Hint Needed?</p>
                <p className="text-sm text-slate-300 italic">
                  {attempts >= 2 
                    ? <span>It is: <span className="text-amber-400 font-bold underline select-all">Bintu</span></span> 
                    : "Suji's special name for you."}
                </p>
              </div>
            )}
          </div>
        );
      case AppScene.DUA_GENERATOR:
        return (
          <div className="flex flex-col items-center text-center space-y-8 md:space-y-12 max-w-xl px-6 w-full animate-fade-in-up">
             <div className="min-h-[160px] md:h-64 flex items-center justify-center w-full">
               {showDua ? (
                 <div className="p-8 md:p-10 bg-amber-500/20 rounded-[2rem] md:rounded-[3rem] border-2 border-amber-400/50 backdrop-blur-xl animate-fade-in-up shadow-2xl">
                    <p className="text-xl md:text-3xl text-amber-50 font-serif leading-relaxed italic">“{showDua}”</p>
                 </div>
               ) : (
                 <div className="animate-pulse flex flex-col items-center space-y-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-amber-500/30 flex items-center justify-center text-amber-500/30">✨</div>
                   <p className="text-amber-200/60 italic font-bold tracking-[0.2em] text-[10px] md:text-sm uppercase leading-relaxed max-w-[200px]">
                     Click the button below to receive a special blessing
                   </p>
                 </div>
               )}
             </div>
             <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full items-center justify-center">
              <ActionButton onClick={handleDuaGen}>Receive A Dua</ActionButton>
              <button 
                onClick={onNext}
                className="px-8 py-3 text-slate-400 hover:text-white transition-all tracking-[0.3em] uppercase text-[10px] font-bold border border-white/10 rounded-full"
              >
                Final Message
              </button>
             </div>
          </div>
        );
      case AppScene.CREDITS:
        return (
          <div className="relative w-full h-[80vh] overflow-hidden flex flex-col items-center px-6">
            <div className="animate-[scroll-up_35s_linear_forwards] space-y-16 md:space-y-20 text-center pb-[100vh]">
              <div><h4 className="text-amber-500 uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 font-bold">Story</h4><p className="text-3xl md:text-4xl text-white">Suji</p></div>
              <div><h4 className="text-amber-500 uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 font-bold">Inspiration</h4><p className="text-3xl md:text-4xl text-white">Bintu</p></div>
              <div><h4 className="text-amber-500 uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 font-bold">Best Friend</h4><p className="text-3xl md:text-4xl text-white">Bintu</p></div>
              <div><h4 className="text-amber-500 uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 font-bold">Made In</h4><p className="text-3xl md:text-4xl text-white italic">Kathmandu</p></div>
              <div><h4 className="text-amber-500 uppercase tracking-[0.4em] text-[10px] md:text-xs mb-4 font-bold">For</h4><p className="text-3xl md:text-4xl text-amber-300 font-serif italic">Lahore 🌙</p></div>
              <div className="pt-20"><ActionButton onClick={onNext}>End Journey</ActionButton></div>
            </div>
            <style>{`
              @keyframes scroll-up {
                0% { transform: translateY(70vh); }
                100% { transform: translateY(-120%); }
              }
            `}</style>
          </div>
        );
      case AppScene.FINAL:
        return (
          <div className="flex flex-col items-center text-center space-y-12 md:space-y-16 max-w-3xl px-8 animate-fade-in-up">
            <h1 className="text-3xl md:text-7xl font-serif text-white leading-snug italic drop-shadow-2xl">“This website exists because Bintu exists.”</h1>
            <p className="text-lg md:text-xl text-slate-400 font-light italic max-w-md">May our friendship remain timeless and blessed by Allah.</p>
            <div className="pt-20 border-t-2 border-amber-500/20 w-full opacity-60">
              <p className="text-amber-300 tracking-[0.5em] text-[9px] md:text-[10px] uppercase font-bold mb-2">Made with sincerity by Suji — Kathmandu ✨</p>
              <p className="text-slate-500 tracking-[0.3em] text-[8px] uppercase">Happy New Year 2026</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="w-full h-full flex flex-col items-center justify-center pointer-events-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default UIOverlay;
