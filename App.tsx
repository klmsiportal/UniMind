import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Solver from './pages/Solver';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Premium from './pages/Premium';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoutes = () => {
  const { loading } = useAuth();
  
  if (loading) {
     return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Initializing UniMind...</p>
        </div>
     );
  }
  
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/solve" element={<Solver />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;