import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { ImageFile } from '../types';

// Esta variável irá armazenar a chave de API de forma segura.
let apiKey: string | undefined;

// Verificamos se 'process' e 'process.env' existem. 
// Isso torna o código seguro para rodar diretamente no navegador.
if (typeof process !== 'undefined' && process.env) {
    apiKey = process.env.API_KEY;
}

const getAiInstance = (): GoogleGenAI => {
    if (!apiKey) {
        // A mensagem de erro agora é mais clara e direciona para a solução correta.
        throw new Error("A chave de API não foi encontrada. Por favor, conecte seu site a um repositório Git no Netlify e adicione a API_KEY nas 'Environment variables' para que a aplicação funcione.");
    }
    return new GoogleGenAI({ apiKey: apiKey });
}

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getAiInstance();
    const response = await ai.models.generateImages({
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
        const ai = getAiInstance();
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

        const response: GenerateContentResponse = await ai.models.generateContent({
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
