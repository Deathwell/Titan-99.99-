import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, ChevronDown } from 'lucide-react';
import { fluidThemeManager, FLUID_THEMES, FluidThemeId, FluidThemeConfig } from '../../lib/fluidThemeEngine';

export const FluidThemeSelector: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<FluidThemeConfig>(fluidThemeManager.getTheme());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = fluidThemeManager.subscribe(t => {
      setCurrentTheme(t);
    });

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleOutsideClick);
    return () => {
      unsub();
      window.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleSelect = (id: FluidThemeId) => {
    fluidThemeManager.setTheme(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Floating / HUD Compact Toggle Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.1] text-xs font-semibold text-zinc-200 transition-all shadow-sm backdrop-blur-md"
        title="Change Interactive Fluid Atmosphere"
      >
        <span
          className="h-2.5 w-2.5 rounded-full shadow-sm animate-pulse"
          style={{ backgroundColor: currentTheme.accentHex }}
        />
        <span className="text-[11px] font-sans font-medium hidden sm:inline">
          {currentTheme.shortName}
        </span>
        <ChevronDown className={`h-3 w-3 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Luxury Theme Selector Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#0e0e14]/95 border border-white/[0.12] p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150 font-sans">
          <div className="px-2.5 py-1.5 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Fluid Atmosphere</span>
            <Sparkles className="h-3 w-3 text-zinc-400" />
          </div>

          <div className="py-1 space-y-0.5">
            {Object.values(FLUID_THEMES).map(theme => {
              const isSelected = theme.id === currentTheme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelect(theme.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-white/[0.1] text-white shadow-inner'
                      : 'text-zinc-300 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full shadow-sm ring-1 ring-white/20"
                      style={{ backgroundColor: theme.accentHex }}
                    />
                    <span>{theme.name}</span>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
