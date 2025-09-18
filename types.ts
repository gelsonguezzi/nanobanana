
export type Mode = 'create' | 'edit';
export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose';

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface GeneratedImage {
  src: string;
  prompt: string;
}
