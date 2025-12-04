import React from 'react';
import { AppState } from '../types';

interface UIOverlayProps {
  mode: AppState;
  onToggle: () => void;
  treeColor: string;
  setTreeColor: (c: string) => void;
  ornamentColorA: string;
  setOrnamentColorA: (c: string) => void;
  ornamentColorB: string;
  setOrnamentColorB: (c: string) => void;
}

const ColorPicker: React.FC<{ 
  label: string; 
  value: string; 
  onChange: (c: string) => void 
}> = ({ label, value, onChange }) => (
  <div className="flex flex-col items-center gap-2 group">
    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-white/60 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer">
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 m-0 opacity-0 cursor-pointer" 
      />
      <div 
        className="w-full h-full rounded-full" 
        style={{ backgroundColor: value }} 
      />
    </div>
    <span className="text-[10px] uppercase tracking-widest text-emerald-100/50 group-hover:text-emerald-100 transition-colors font-sans">
      {label}
    </span>
  </div>
);

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  mode, 
  onToggle,
  treeColor,
  setTreeColor,
  ornamentColorA,
  setOrnamentColorA,
  ornamentColorB,
  setOrnamentColorB
}) => {
  const isTree = mode === AppState.TREE_SHAPE;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
      
      {/* Top Bar */}
      <div className="flex justify-center items-start pointer-events-auto w-full">
        {/* Header */}
        <header className="flex flex-col items-center pt-8 opacity-90 transition-opacity duration-1000">
            <h1 className="text-gold-400 font-serif text-5xl md:text-7xl tracking-widest uppercase drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] text-center">
                Merry Christmas
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mt-6 mb-2"></div>
        </header>
      </div>

      {/* Footer Controls Container */}
      <div className="flex flex-col items-center pointer-events-auto gap-8 pb-8">
        
        {/* Toggle Button */}
        <div className="flex flex-col items-center">
            <button
            onClick={onToggle}
            className={`
                group relative px-8 py-3 overflow-hidden rounded-full 
                transition-all duration-700 ease-in-out
                border border-gold-600/50 hover:border-gold-400
                ${isTree ? 'bg-emerald-900/40' : 'bg-transparent'}
                backdrop-blur-sm
            `}
            >
            <div className={`absolute inset-0 w-full h-full bg-gold-500/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            
            <span className="relative flex items-center space-x-3">
                <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${isTree ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-gold-400 shadow-[0_0_8px_#fbbf24]'}`} />
                <span className="font-sans text-sm tracking-widest text-gold-100 uppercase group-hover:text-white transition-colors">
                    {isTree ? 'Release to Chaos' : 'Assemble Tree'}
                </span>
            </span>
            </button>
            <p className="mt-3 text-[10px] text-emerald-200/40 font-sans tracking-widest uppercase">
            {isTree ? 'State: Coherent' : 'State: Ethereal'}
            </p>
        </div>

        {/* Color Customization */}
        <div className="flex gap-6 p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/5 transition-opacity hover:bg-black/40">
            <ColorPicker label="Tree" value={treeColor} onChange={setTreeColor} />
            <ColorPicker label="Gold" value={ornamentColorA} onChange={setOrnamentColorA} />
            <ColorPicker label="Red" value={ornamentColorB} onChange={setOrnamentColorB} />
        </div>

      </div>
    </div>
  );
};