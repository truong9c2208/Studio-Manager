import React, { useState } from 'react';
import type { AuthView } from '../../layouts/AuthLayout';
import { Logo } from '../../icons/Logo';

interface RegisterPageProps {
  onRegister: (name: string, email: string, password: string) => { success: boolean, message: string };
  onNavigate: (view: AuthView) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
    }
    const result = onRegister(name, email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-800/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 to-slate-950"></div>

        <div className="relative max-w-md w-full space-y-8 bg-slate-900/60 backdrop-blur-sm border border-accent/20 p-10 rounded-2xl shadow-2xl shadow-accent/10">
            <div>
                <Logo className="h-12 mx-auto" />
                <h2 className="mt-6 text-center text-3xl font-bold text-white">
                    Create a new account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-400">
                    Or{' '}
                    <button onClick={() => onNavigate('login')} className="font-medium text-accent hover:text-indigo-400">
                        sign in to your existing account
                    </button>
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && <div className="p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-md text-sm">{error}</div>}
                <div className="rounded-md -space-y-px">
                    <div>
                        <label htmlFor="full-name" className="sr-only">Full Name</label>
                        <input
                            id="full-name"
                            name="name"
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-800/50 border border-slate-700 placeholder-slate-500 text-white rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                            placeholder="Full Name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-800/50 border border-slate-700 placeholder-slate-500 text-white focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="appearance-none rounded-none relative block w-full px-3 py-3 bg-slate-800/50 border border-slate-700 placeholder-slate-500 text-white rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                            placeholder="Password (min. 8 characters)"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-accent-hover transition-all duration-300 shadow-lg shadow-accent/20 hover:shadow-accent/40"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};