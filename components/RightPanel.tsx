
import React from 'react';
import { GeneratedImage } from '../types';

interface RightPanelProps {
  isLoading: boolean;
  generatedImage: GeneratedImage | null;
  editCurrentImage: () => void;
  downloadImage: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ isLoading, generatedImage, editCurrentImage, downloadImage }) => {
  return (
    <div className="right-panel flex-1 bg-brand-secondary p-6 flex items-center justify-center">
      {!isLoading && !generatedImage && (
        <div id="resultPlaceholder" className="result-placeholder text-center text-brand-text-secondary">
          <div className="result-placeholder-icon text-7xl mb-4">🎨</div>
          <div className="font-semibold text-xl">Sua obra de arte aparecerá aqui</div>
        </div>
      )}

      {isLoading && (
        <div id="loadingContainer" className="loading-container text-center text-brand-text-primary">
          <div className="loading-spinner w-16 h-16 border-8 border-t-transparent border-brand-accent rounded-full animate-spin mx-auto"></div>
          <div className="loading-text mt-4 text-lg font-semibold">Gerando sua imagem...</div>
        </div>
      )}

      {!isLoading && generatedImage && (
        <div id="imageContainer" className="image-container relative w-full h-full flex items-center justify-center">
          <img
            id="generatedImage"
            src={generatedImage.src}
            alt={generatedImage.prompt}
            className="generated-image max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <div className="image-actions absolute top-4 right-4 flex gap-2">
            <button
              className="action-btn bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              onClick={editCurrentImage}
              title="Editar"
            >
              ✏️
            </button>
            <button
              className="action-btn bg-black/50 hover:bg-black/80 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
              onClick={downloadImage}
              title="Download"
            >
              💾
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
