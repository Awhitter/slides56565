import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useModules, Slide, Module } from '../contexts/ModuleContext';
import SlideEditor from '../components/SlideEditor';
import { AlertCircle } from 'lucide-react';

const TOGETHER_API_KEY = 'fc6b566a4270fd333ccffaf44ecd31860aea00c794cb138f08f5b845eafda9f4';
const API_URL = 'https://api.together.xyz/v1/images/generations';

const AuthorPage: React.FC = () => {
  const [moduleTitle, setModuleTitle] = useState('');
  const [slides, setSlides] = useState<Slide[]>([{ id: uuidv4(), title: '', content: '', imageUrl: '', imagePrompt: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addModule } = useModules();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (moduleTitle.trim() === '') {
      setError('Module title is required');
      return;
    }
    if (slides.some(slide => slide.title.trim() === '' || slide.content.trim() === '')) {
      setError('All slides must have a title and content');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const newModule: Module = {
        id: uuidv4(),
        title: moduleTitle,
        slides: slides,
      };
      await addModule(newModule);
      navigate('/');
    } catch (err) {
      setError('Error creating module. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (slide: Slide) => {
    if (!slide.imagePrompt) return;
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'black-forest-labs/FLUX.1-schnell',
          prompt: slide.imagePrompt,
          n: 1,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate image');

      const data = await response.json();
      if (data.data && data.data.length > 0 && data.data[0].url) {
        updateSlide({ ...slide, imageUrl: data.data[0].url });
      } else {
        throw new Error('No image URL in the response');
      }
    } catch (err) {
      setError('Error generating image. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addSlide = () => {
    setSlides([...slides, { id: uuidv4(), title: '', content: '', imageUrl: '', imagePrompt: '' }]);
  };

  const deleteSlide = (id: string) => {
    if (slides.length > 1) {
      setSlides(slides.filter(slide => slide.id !== id));
    } else {
      setError('You must have at least one slide in the module.');
    }
  };

  const updateSlide = (updatedSlide: Slide) => {
    setSlides(slides.map(slide => slide.id === updatedSlide.id ? updatedSlide : slide));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Module</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="moduleTitle" className="block text-sm font-medium text-gray-700">Module Title</label>
          <input
            type="text"
            id="moduleTitle"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Slides</h2>
          {slides.map((slide, index) => (
            <SlideEditor
              key={slide.id}
              slide={slide}
              onUpdate={updateSlide}
              onDelete={() => deleteSlide(slide.id)}
              onGenerateImage={() => handleGenerateImage(slide)}
              isLoading={isLoading}
              slideNumber={index + 1}
            />
          ))}
          <button
            type="button"
            onClick={addSlide}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Add Slide
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <AlertCircle className="absolute top-0 right-0 mt-3 mr-3" size={20} />
          </div>
        )}
        
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Module...
            </>
          ) : (
            'Create Module'
          )}
        </button>
      </form>
    </div>
  );
};

export default AuthorPage;