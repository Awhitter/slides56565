import React, { createContext, useState, useContext, useEffect } from 'react';

export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  imagePrompt: string;
}

export interface Module {
  id: string;
  title: string;
  slides: Slide[];
}

interface ModuleContextType {
  modules: Module[];
  addModule: (module: Module) => Promise<void>;
  getModule: (id: string) => Module | undefined;
  updateModule: (module: Module) => void;
  deleteModule: (id: string) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};

export const ModuleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const storedModules = localStorage.getItem('modules');
        if (storedModules) {
          setModules(JSON.parse(storedModules));
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };

    fetchModules();
  }, []);

  useEffect(() => {
    localStorage.setItem('modules', JSON.stringify(modules));
  }, [modules]);

  const addModule = async (module: Module): Promise<void> => {
    try {
      setModules(prevModules => [...prevModules, module]);
    } catch (error) {
      console.error('Error adding module:', error);
      throw error;
    }
  };

  const getModule = (id: string): Module | undefined => {
    return modules.find(module => module.id === id);
  };

  const updateModule = (updatedModule: Module): void => {
    setModules(prevModules => 
      prevModules.map(module => module.id === updatedModule.id ? updatedModule : module)
    );
  };

  const deleteModule = (id: string): void => {
    setModules(prevModules => prevModules.filter(module => module.id !== id));
  };

  return (
    <ModuleContext.Provider value={{ modules, addModule, getModule, updateModule, deleteModule }}>
      {children}
    </ModuleContext.Provider>
  );
};
