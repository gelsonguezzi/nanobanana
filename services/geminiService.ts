import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { ImageFile } from '../types';
import { API_KEY } from '../config.js';

let ai: GoogleGenAI | null = null;

const getAi = () => {
    if (!API_KEY || API_KEY === 'COLE_SUA_CHAVE_DE_API_AQUI') {
        throw new Error("A chave de API não foi configurada. Por favor, edite o arquivo 'config.js' e adicione sua chave de API do Google AI Studio.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    }
    return ai;
}

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const gemini = getAi();
    const response = await gemini.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/png',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("Nenhuma imagem foi gerada.");
  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    throw new Error(error instanceof Error ? error.message : "Falha ao gerar imagem.");
  }
};


export const editImage = async (prompt: string, image: ImageFile, image2?: ImageFile): Promise<string> => {
    try {
        const gemini = getAi();
        const parts = [
            {
                inlineData: {
                    data: image.base64,
                    mimeType: image.mimeType,
                },
            },
            {
                text: prompt,
            },
        ];

        if (image2) {
             parts.splice(1, 0, {
                inlineData: {
                    data: image2.base64,
                    mimeType: image2.mimeType,
                },
            });
        }

        const response: GenerateContentResponse = await gemini.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("Nenhuma imagem editada foi retornada pela API.");
    } catch (error) {
        console.error("Erro ao editar imagem:", error);
        throw new Error(error instanceof Error ? error.message : "Falha ao editar imagem.");
    }
};