import React from 'react';
import { Link } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { Book } from 'lucide-react';

const HomePage: React.FC = () => {
  const { modules } = useModules();

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to AI-Powered E-Learning</h1>
      <p className="text-xl mb-8">Discover a new way of learning with our interactive, AI-driven modules.</p>
      {modules.length === 0 ? (
        <p>No modules available. Be the first to create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Link 
              key={module.id} 
              to={`/module/${module.id}`} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 flex flex-col items-center"
            >
              <Book size={48} className="text-blue-500 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">{module.title}</h2>
              <p>{module.slides.length} slides</p>
            </Link>
          ))}
        </div>
      )}
      <div className="mt-8">
        <Link 
          to="/author" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-flex items-center"
        >
          <Book size={24} className="mr-2" />
          Create New Module
        </Link>
      </div>
    </div>
  );
};

export default HomePage;