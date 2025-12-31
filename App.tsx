
import React, { useState, useCallback, useEffect } from 'react';
import Experience from './components/Experience';
import UIOverlay from './components/UIOverlay';
import MiniGame from './components/MiniGame';
import { AppScene, TravelMode } from './types';

const App: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<AppScene>(AppScene.START);
  const [travelMode, setTravelMode] = useState<TravelMode>('plane');
  const [score, setScore] = useState(0);

  const totalScenes = Object.values(AppScene).filter(v => typeof v === 'number').length;

  const nextScene = useCallback(() => {
    setCurrentScene(prev => {
      const next = prev + 1;
      return next in AppScene ? next : prev;
    });
  }, []);

  // Handle automatic cinematic transition for travel
  useEffect(() => {
    if (currentScene === AppScene.SKY_TRAVEL) {
      const timer = setTimeout(() => {
        nextScene();
      }, 5500); // 5.5 seconds of cinematic travel before showing arrival message
      return () => clearTimeout(timer);
    }
  }, [currentScene, nextScene]);

  const handleSetTravel = useCallback((mode: TravelMode) => {
    setTravelMode(mode);
  }, []);

  const incrementScore = useCallback(() => {
    setScore(s => s + 1);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-slate-950">
      {/* 3D Background */}
      <Experience currentScene={currentScene} travelMode={travelMode} />
      
      {/* Interaction Layer */}
      <UIOverlay 
        currentScene={currentScene} 
        travelMode={travelMode}
        onNext={nextScene}
        onSetTravel={handleSetTravel}
        score={score}
      />

      {/* Mini Game Layer (Overlays certain scenes) */}
      <MiniGame 
        isActive={currentScene === AppScene.MINI_GAME} 
        onScore={incrementScore} 
      />

      {/* Progress Indicator - Enhanced Visibility */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 pointer-events-none">
        <div className="flex gap-2 px-4 py-2.5 bg-black/60 backdrop-blur-xl rounded-full border border-amber-500/20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          {Object.values(AppScene).filter(v => typeof v === 'number').map((s) => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-700 ${
                Number(s) === currentScene 
                  ? 'bg-amber-400 w-8 shadow-[0_0_12px_#fbbf24]' 
                  : Number(s) < currentScene 
                    ? 'bg-amber-500/50 w-2.5' 
                    : 'bg-white/10 w-2.5'
              }`} 
            />
          ))}
        </div>
        <div className="text-[11px] text-amber-300/80 tracking-[0.4em] uppercase font-bold drop-shadow-md">
          Step <span className="text-amber-100">{currentScene + 1}</span> of <span className="text-amber-500">{totalScenes}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
