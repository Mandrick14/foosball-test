import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { GameProvider } from './context/GameContext';
import { CameraView } from './pages/CameraView';
import { AdminPanel } from './pages/AdminPanel';
import { ScoreBoard } from './pages/ScoreBoard';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900">
          <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Gamepad2 className="w-8 h-8 text-blue-400" />
                  <span className="ml-2 text-xl font-bold text-white">FoosTracker</span>
                </div>
                <div className="flex space-x-4">
                  <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                    Camera
                  </Link>
                  <Link to="/scoreboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                    Scoreboard
                  </Link>
                  <Link to="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<CameraView />} />
              <Route path="/scoreboard" element={<ScoreBoard />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;