import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, MessageSquare, Users, GraduationCap, Gavel, ClipboardCheck, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from './services/firebase';
import SOSButton from './components/SOSButton';
import { cn } from './lib/utils';

// Real pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import CommunityPage from './pages/CommunityPage';
import ExpertsPage from './pages/ExpertsPage';
import LegalPage from './pages/LegalPage';
import AssessmentPage from './pages/AssessmentPage';

const LoginPage = () => {
  const { signIn, isSigningIn } = useAuth();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-primary">Xush kelibsiz, opa-singillar.</h1>
        <p className="text-on-surface-variant max-w-md">Najot AI - bu ayollar uchun xavfsiz va maxfiy makon. Biz sizga huquqiy va ruhiy yordam beramiz.</p>
      </div>
      <button 
        onClick={signIn}
        disabled={isSigningIn}
        className={cn(
          "w-full max-w-xs py-4 bg-primary text-white rounded-full font-bold shadow-lg transition-all",
          isSigningIn ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
        )}
      >
        {isSigningIn ? "Kirilmoqda..." : "Google orqali kirish"}
      </button>
      <p className="text-xs text-outline">Barcha ma'lumotlar shifrlangan va anonim saqlanadi.</p>
    </div>
  );
};

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Asosiy' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/community', icon: Users, label: 'Hamjamiyat' },
    { path: '/experts', icon: GraduationCap, label: 'Ekspertlar' },
    { path: '/legal', icon: Gavel, label: 'Huquq' },
    { path: '/assessment', icon: ClipboardCheck, label: 'Test' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user && location.pathname !== '/login') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-0 md:pl-20">
      <header className="hidden md:flex fixed top-0 left-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-outline-variant/20 z-40 px-6 items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Najot AI</h1>
        <div className="flex items-center gap-4">
          <button onClick={signOut} className="text-on-surface-variant hover:text-primary">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 w-full md:top-0 md:w-20 md:h-full bg-white/80 backdrop-blur-xl border-t md:border-t-0 md:border-r border-outline-variant/20 z-50 flex md:flex-col justify-around md:justify-center items-center py-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col md:w-12 md:h-12 items-center justify-center rounded-full transition-all",
              location.pathname === item.path ? "text-primary bg-primary/10" : "text-outline hover:text-primary"
            )}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-bold mt-1 md:hidden">{item.label}</span>
          </Link>
        ))}
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <SOSButton />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/experts" element={<ExpertsPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
          </Routes>
        </Layout>
      } />
    </Routes>
  );
}
