import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Reveal from 'reveal.js';
import { useModules } from '../contexts/ModuleContext';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { ArrowLeft } from 'lucide-react';

const ModulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getModule } = useModules();
  const module = getModule(id || '');
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<Reveal.Api | null>(null);
  const isMountedRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (module && deckRef.current && !revealRef.current) {
      const initializeReveal = async () => {
        try {
          revealRef.current = new Reveal(deckRef.current, {
            hash: true,
            embedded: false,
            transition: 'slide',
          });

          await revealRef.current.initialize();
          console.log('Reveal.js initialized successfully');
        } catch (error) {
          console.error('Error initializing Reveal.js:', error);
        }
      };

      initializeReveal();
    }

    return () => {
      isMountedRef.current = false;
      if (revealRef.current) {
        revealRef.current = null;
      }
    };
  }, [module]);

  useEffect(() => {
    return () => {
      if (isMountedRef.current && revealRef.current) {
        try {
          revealRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Reveal.js instance:', error);
        }
      }
    };
  }, []);

  if (!module) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-4">Module not found</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          <ArrowLeft className="inline-block mr-2" size={20} />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="reveal" ref={deckRef}>
      <div className="slides">
        {module.slides.map((slide, index) => (
          <section key={slide.id}>
            <h2>{slide.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: slide.content }} />
            {slide.imageUrl && <img src={slide.imageUrl} alt={`Slide ${index + 1} visual`} className="w-1/2 mx-auto" />}
          </section>
        ))}
      </div>
    </div>
  );
};

export default ModulePage;