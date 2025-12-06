import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, BrainCircuit, Compass, GraduationCap, Menu, X, Crown, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { name: 'Home', path: '/', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'AI Solver', path: '/solve', icon: <BrainCircuit className="w-5 h-5" /> },
    { name: 'Explore', path: '/explore', icon: <Compass className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-indigo-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">UniMind</span>
        </div>
        <button onClick={toggleMenu} className="p-2 text-slate-300 hover:text-white">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out flex flex-col
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-indigo-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">UniMind</span>
        </div>

        <nav className="mt-6 px-4 space-y-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-600/20 text-indigo-300 shadow-[0_0_20px_rgba(79,70,229,0.2)] border border-indigo-500/30' 
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'}
              `}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
          
          <NavLink
            to="/premium"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-4
              ${isActive 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                : 'text-yellow-500 hover:bg-yellow-500/10'}
            `}
          >
            <Crown className="w-5 h-5" />
            <span className="font-bold">Premium</span>
            {user?.isPremium && <span className="ml-auto text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded font-bold">PRO</span>}
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
           {user ? (
             <div className="flex flex-col gap-3">
               <div className="flex items-center gap-3">
                 {user.photoURL ? (
                   <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full border border-slate-600" />
                 ) : (
                   <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                     <UserIcon className="w-5 h-5" />
                   </div>
                 )}
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-white truncate">{user.displayName || 'Student'}</p>
                   <p className="text-xs text-slate-500 truncate">{user.email}</p>
                 </div>
               </div>
               <button 
                 onClick={handleLogout}
                 className="flex items-center gap-2 text-sm text-slate-400 hover:text-rose-400 transition-colors px-2"
               >
                 <LogOut className="w-4 h-4" /> Sign Out
               </button>
             </div>
           ) : (
             <NavLink
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium transition-colors"
             >
                <LogIn className="w-4 h-4" /> Sign In
             </NavLink>
           )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-5xl mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;