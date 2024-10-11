import React from 'react';
import { Slide } from '../contexts/ModuleContext';
import { Trash2, Image } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
  onDelete: () => void;
  onGenerateImage: () => void;
  isLoading: boolean;
  slideNumber: number;
}

const SlideEditor: React.FC<SlideEditorProps> = ({ slide, onUpdate, onDelete, onGenerateImage, isLoading, slideNumber }) => {
  return (
    <div className="border p-4 rounded mb-4 bg-white shadow-sm">
      <h3 className="font-medium mb-2 text-lg">Slide {slideNumber}</h3>
      <input
        type="text"
        value={slide.title}
        onChange={(e) => onUpdate({ ...slide, title: e.target.value })}
        placeholder="Slide Title"
        className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <textarea
        value={slide.content}
        onChange={(e) => onUpdate({ ...slide, content: e.target.value })}
        placeholder="Slide Content"
        className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        rows={3}
      />
      <input
        type="text"
        value={slide.imagePrompt}
        onChange={(e) => onUpdate({ ...slide, imagePrompt: e.target.value })}
        placeholder="Image Prompt"
        className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onGenerateImage}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center disabled:opacity-50"
          disabled={isLoading || !slide.imagePrompt}
        >
          <Image className="inline-block mr-2" size={16} />
          Generate Image
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition duration-300"
        >
          <Trash2 size={20} />
        </button>
      </div>
      {slide.imageUrl && (
        <img src={slide.imageUrl} alt="Generated visual" className="mt-2 max-w-full h-auto rounded" />
      )}
    </div>
  );
};

export default SlideEditor;