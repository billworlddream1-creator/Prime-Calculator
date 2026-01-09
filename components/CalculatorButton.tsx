
import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'number' | 'operator' | 'action' | 'equal';
  className?: string;
  accentColor?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'number',
  className = '',
  accentColor = 'bg-blue-500'
}) => {
  const baseStyles = "flex items-center justify-center rounded-2xl text-xl font-bold transition-all duration-300 active:scale-90 shadow-lg hover:shadow-xl select-none hover:-translate-y-0.5 active:translate-y-0";
  
  const variantStyles = {
    number: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/5 hover:border-white/20",
    operator: "bg-white/5 hover:bg-white/15 text-blue-300 border border-white/5 hover:border-blue-300/20",
    action: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 hover:border-red-500/30",
    equal: `${accentColor} hover:brightness-110 text-white shadow-[0_4px_15px_-3px_rgba(0,0,0,0.3)] ring-1 ring-white/10 hover:scale-105`
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
