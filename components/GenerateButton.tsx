
import React from 'react';

interface GenerateButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ isLoading, onClick, disabled }) => {
  return (
    <button
      id="generateBtn"
      className="generate-btn w-full bg-brand-accent hover:bg-brand-accent-hover disabled:bg-brand-border disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-200 h-14 mt-auto"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="spinner w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
      ) : (
        <span className="btn-text text-lg">🚀 Gerar Imagem</span>
      )}
    </button>
  );
};

export default GenerateButton;
