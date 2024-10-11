import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen size={24} />
          <span className="text-xl font-bold">AI E-Learning</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-indigo-200 transition duration-300">Home</Link>
            </li>
            <li>
              <Link to="/author" className="flex items-center hover:text-indigo-200 transition duration-300">
                <PlusCircle size={20} className="mr-1" />
                Create Module
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;