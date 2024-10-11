import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ModuleProvider } from './contexts/ModuleContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';
import AuthorPage from './pages/AuthorPage';

const App: React.FC = () => {
  return (
    <ModuleProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/module/:id" element={<ModulePage />} />
              <Route path="/author" element={<AuthorPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ModuleProvider>
  );
};

export default App;