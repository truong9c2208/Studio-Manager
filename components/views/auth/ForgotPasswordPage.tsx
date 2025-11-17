import React, { useState } from 'react';
import type { AuthView } from '../../layouts/AuthLayout';
import { Logo } from '../../icons/Logo';

interface ForgotPasswordPageProps {
  onNavigate: (view: AuthView) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would make an API call here.
    console.log(`Password reset requested for: ${email}`);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-800/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,white)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 to-slate-950"></div>

      <div className="relative max-w-md w-full space-y-8 bg-slate-900/60 backdrop-blur-sm border border-accent/20 p-10 rounded-2xl shadow-2xl shadow-accent/10">
        <div>
          <Logo className="h-12 mx-auto" />
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Or{' '}
            <button onClick={() => onNavigate('login')} className="font-medium text-accent hover:text-indigo-400">
              return to sign in
            </button>
          </p>
        </div>
        {submitted ? (
            <div className="text-center">
                <p className="p-4 bg-green-500/20 text-green-300 border border-green-500/30 rounded-md">
                    If an account exists for {email}, you will receive an email with instructions on how to reset your password.
                </p>
            </div>
        ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
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
                    className="appearance-none rounded-md relative block w-full px-3 py-3 bg-slate-800/50 border border-slate-700 placeholder-slate-500 text-white focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                    placeholder="Enter your email address"
                />
                </div>
            </div>

            <div>
                <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-accent-hover transition-all duration-300 shadow-lg shadow-accent/20 hover:shadow-accent/40"
                >
                Send reset instructions
                </button>
            </div>
            </form>
        )}
      </div>
    </div>
  );
};