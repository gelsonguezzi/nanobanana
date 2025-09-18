
import React from 'react';
import { Mode, CreateFunction, EditFunction, ImageFile } from '../types';
import FunctionCard from './FunctionCard';
import UploadArea from './UploadArea';
import GenerateButton from './GenerateButton';

interface LeftPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  createFunction: CreateFunction;
  setCreateFunction: (func: CreateFunction) => void;
  editFunction: EditFunction;
  setEditFunction: (func: EditFunction) => void;
  showTwoImagesView: boolean;
  image1: ImageFile | null;
  image2: ImageFile | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, imageSlot: 1 | 2) => void;
  backToEditFunctions: () => void;
  isLoading: boolean;
  generateImage: () => void;
  isGenerateDisabled: boolean;
}

const createFunctions: { id: CreateFunction; icon: string; name: string }[] = [
  { id: 'free', icon: '✨', name: 'Prompt' },
  { id: 'sticker', icon: '🏷️', name: 'Adesivos' },
  { id: 'text', icon: '📝', name: 'Logo' },
  { id: 'comic', icon: '💭', name: 'HQ' },
];

const editFunctions: { id: EditFunction; icon: string; name: string; requiresTwo?: boolean }[] = [
  { id: 'add-remove', icon: '➕', name: 'Adicionar' },
  { id: 'retouch', icon: '🎯', name: 'Retoque' },
  { id: 'style', icon: '🎨', name: 'Estilo' },
  { id: 'compose', icon: '🖼️', name: 'Unir', requiresTwo: true },
];

const LeftPanel: React.FC<LeftPanelProps> = ({
  prompt, setPrompt, mode, setMode, createFunction, setCreateFunction,
  editFunction, setEditFunction, showTwoImagesView, image1, image2,
  handleImageUpload, backToEditFunctions, isLoading, generateImage, isGenerateDisabled,
}) => {
  return (
    <div className="left-panel bg-brand-primary p-6 flex flex-col gap-5 overflow-y-auto w-full lg:w-[400px] lg:h-full lg:max-h-full h-auto">
      <header>
        <h1 className="panel-title text-2xl font-bold text-brand-text-primary">🎨 AI Image Studio</h1>
        <p className="panel-subtitle text-brand-text-secondary">Gerador profissional de imagens</p>
      </header>

      <div className="prompt-section">
        <div className="section-title text-sm font-semibold text-brand-text-secondary mb-2">💭 Descreva sua ideia</div>
        <textarea
          id="prompt"
          className="prompt-input w-full bg-brand-secondary border border-brand-border rounded-lg p-3 text-brand-text-primary focus:ring-2 focus:ring-brand-accent focus:outline-none transition-shadow resize-none h-28"
          placeholder="Descreva a imagem que você deseja criar..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="mode-toggle flex bg-brand-secondary p-1 rounded-lg">
        <button
          className={`mode-btn flex-1 py-2 rounded-md transition-colors text-sm font-semibold ${mode === 'create' ? 'bg-brand-accent text-white' : 'hover:bg-brand-border/50 text-brand-text-secondary'}`}
          data-mode="create"
          onClick={() => setMode('create')}
        >
          Criar
        </button>
        <button
          className={`mode-btn flex-1 py-2 rounded-md transition-colors text-sm font-semibold ${mode === 'edit' ? 'bg-brand-accent text-white' : 'hover:bg-brand-border/50 text-brand-text-secondary'}`}
          data-mode="edit"
          onClick={() => setMode('edit')}
        >
          Editar
        </button>
      </div>

      {mode === 'create' && (
        <div id="createFunctions" className="functions-section">
          <div className="functions-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3">
            {createFunctions.map((func) => (
              <FunctionCard
                key={func.id}
                icon={func.icon}
                name={func.name}
                isActive={createFunction === func.id}
                onClick={() => setCreateFunction(func.id)}
              />
            ))}
          </div>
        </div>
      )}

      {mode === 'edit' && !showTwoImagesView && (
        <>
          <div id="editFunctions" className="functions-section">
            <div className="functions-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-3">
              {editFunctions.map((func) => (
                <FunctionCard
                  key={func.id}
                  icon={func.icon}
                  name={func.name}
                  isActive={editFunction === func.id}
                  onClick={() => setEditFunction(func.id)}
                />
              ))}
            </div>
          </div>
          <div className="dynamic-content">
            <UploadArea
              id="imageUpload"
              onImageUpload={(e) => handleImageUpload(e, 1)}
              previewSrc={image1 ? `data:${image1.mimeType};base64,${image1.base64}` : null}
              mainText="Clique ou arraste uma imagem"
              subText="PNG, JPG, WebP (máx. 10MB)"
              className="h-40"
            />
          </div>
        </>
      )}

      {mode === 'edit' && showTwoImagesView && (
        <div id="twoImagesSection" className="functions-section flex flex-col gap-4">
          <div className="section-title text-sm font-semibold text-brand-text-secondary">📸 Duas Imagens Necessárias</div>
           <UploadArea
              id="imageUpload1"
              onImageUpload={(e) => handleImageUpload(e, 1)}
              previewSrc={image1 ? `data:${image1.mimeType};base64,${image1.base64}` : null}
              mainText="Primeira Imagem"
              subText="Clique para selecionar"
              className="h-32"
            />
            <UploadArea
              id="imageUpload2"
              onImageUpload={(e) => handleImageUpload(e, 2)}
              previewSrc={image2 ? `data:${image2.mimeType};base64,${image2.base64}` : null}
              mainText="Segunda Imagem"
              subText="Clique para selecionar"
              className="h-32"
            />
          <button className="back-btn text-sm text-brand-accent hover:underline" onClick={backToEditFunctions}>
            ← Voltar para Edição
          </button>
        </div>
      )}

      <GenerateButton isLoading={isLoading} onClick={generateImage} disabled={isGenerateDisabled} />
    </div>
  );
};

export default LeftPanel;
