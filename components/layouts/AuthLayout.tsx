import React, { useState } from 'react';
import { LandingPage } from '../views/auth/LandingPage';
import { LoginPage } from '../views/auth/LoginPage';
import { RegisterPage } from '../views/auth/RegisterPage';
import { ForgotPasswordPage } from '../views/auth/ForgotPasswordPage';
import { Logo } from '../icons/Logo';

export type AuthView = 'landing' | 'login' | 'register' | 'forgot-password';

interface AuthLayoutProps {
  onLogin: (email: string, password: string) => { success: boolean, message: string };
  onRegister: (name: string, email: string, password: string) => { success: boolean, message: string };
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ onLogin, onRegister }) => {
  const [view, setView] = useState<AuthView>('landing');

  const renderView = () => {
    switch (view) {
      case 'login':
        return <LoginPage onLogin={onLogin} onNavigate={setView} />;
      case 'register':
        return <RegisterPage onRegister={onRegister} onNavigate={setView} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={setView} />;
      case 'landing':
      default:
        return <LandingPage onNavigate={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#234C6A] font-sans">
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <button onClick={() => setView('landing')} aria-label="Go to homepage" className={view === 'landing' ? 'text-slate-200' : 'text-text-primary'}>
                    <Logo className="h-10" />
                </button>
                <div className={view === 'landing' ? 'text-slate-200' : 'text-text-primary'}>
                     {view !== 'login' && <button onClick={() => setView('login')} className="font-semibold px-4 py-2 hover:text-accent transition-colors">Login</button>}
                     {view !== 'register' && <button onClick={() => setView('register')} className="font-semibold bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover transition-colors">Sign Up</button>}
                </div>
            </div>
        </header>
        <main>
            {renderView()}
        </main>
    </div>
  );
};