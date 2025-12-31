
import React, { useState, useEffect, useCallback, useRef } from 'react';

interface GameObject {
  id: number;
  x: number;
  y: number;
  emoji: string;
  type: 'regular' | 'golden' | 'biryani';
  rotation: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface MiniGameProps {
  isActive: boolean;
  onScore: () => void;
}

const DUA_TEXTS = ["MashaAllah!", "For Bintu! ✨", "Sweetness!", "Barakah!", "Delicious!", "Yum!", "Special!", "Gift! 🎁"];

const MiniGame: React.FC<MiniGameProps> = ({ isActive, onScore }) => {
  const [items, setItems] = useState<GameObject[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  
  const spawnItem = useCallback(() => {
    const rand = Math.random();
    let type: 'regular' | 'golden' | 'biryani' = 'regular';
    let emoji = '🍯';
    
    if (rand > 0.85) {
      type = 'golden';
      emoji = '🌟'; // Golden Halwa
    } else if (rand > 0.6) {
      type = 'biryani';
      emoji = '🍲';
    }

    const newItem: GameObject = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: -10,
      emoji: emoji,
      type: type,
      rotation: Math.random() * 360
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setItems([]);
      setParticles([]);
      return;
    }

    const spawnInterval = setInterval(spawnItem, 800);
    const moveInterval = setInterval(() => {
      setItems(prev => 
        prev
          .map(item => ({ 
            ...item, 
            y: item.y + (item.type === 'golden' ? 0.8 : 0.5),
            rotation: item.rotation + 2
          }))
          .filter(item => item.y < 110)
      );
    }, 16);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [isActive, spawnItem]);

  const handleCatch = (id: number, x: number, y: number, type: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    
    // Add particle feedback
    const newParticle: Particle = {
      id: Date.now(),
      x,
      y,
      text: type === 'golden' ? "GOLDEN DUA! 🌟" : DUA_TEXTS[Math.floor(Math.random() * DUA_TEXTS.length)]
    };
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 1000);

    onScore();
    if (type === 'golden') {
      onScore(); // Double score for golden items
    }
  };

  if (!isActive) return null;

  return (
    <div ref={gameRef} className="fixed inset-0 z-20 pointer-events-none overflow-hidden touch-none">
      {/* Visual background hint for mobile */}
      <div className="absolute inset-0 bg-amber-500/5 opacity-30 animate-pulse pointer-events-none" />
      
      {items.map((item) => (
        <button
          key={item.id}
          onPointerDown={() => handleCatch(item.id, item.x, item.y, item.type)}
          className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 text-5xl md:text-6xl transition-transform active:scale-75 select-none drop-shadow-xl ${item.type === 'golden' ? 'animate-pulse' : ''}`}
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`
          }}
        >
          {item.emoji}
          {item.type === 'golden' && (
            <div className="absolute inset-0 bg-amber-400 blur-xl opacity-40 rounded-full" />
          )}
        </button>
      ))}

      {particles.map(p => (
        <div 
          key={p.id}
          className="absolute text-amber-300 font-bold text-sm md:text-lg animate-out fade-out slide-out-to-top-12 duration-1000 pointer-events-none whitespace-nowrap drop-shadow-md"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
};

export default MiniGame;
