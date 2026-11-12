import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FolderLock, Mail, Lock, User, Briefcase, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, signUp, allUsers } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Sign In inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signInError, setSignInError] = useState('');

  // Sign Up inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRole, setSignUpRole] = useState<'freelancer' | 'client'>('freelancer');
  const [signUpCompany, setSignUpCompany] = useState('');
  const [signUpError, setSignUpError] = useState('');

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    if (!email.trim()) {
      setSignInError('Please enter your email address.');
      return;
    }
    const result = signIn(email, password);
    if (!result.success) {
      setSignInError(result.message || 'Invalid credentials.');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');
    if (!signUpName.trim() || !signUpEmail.trim()) {
      setSignUpError('Please fill in your name and email.');
      return;
    }
    const result = signUp({
      name: signUpName,
      email: signUpEmail,
      role: signUpRole,
      companyOrTitle: signUpCompany,
    });
    if (!result.success) {
      setSignUpError(result.message || 'Unable to create account.');
    }
  };

  const handleQuickDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    signIn(demoEmail, 'demo1234');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B1329] text-white shadow-xl shadow-blue-900/10 mb-4">
          <FolderLock className="w-7 h-7 text-blue-400" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ClientVault
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
          Secure file portal where freelancers and designers let clients upload and review project deliverables.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-200/80">
          {/* Tabs for Sign In vs Create Account */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setSignInError('');
              }}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-colors ${
                mode === 'signin'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSignUpError('');
              }}
              className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-colors ${
                mode === 'signup'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Create an Account
            </button>
          </div>

          {mode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              {signInError && (
                <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  {signInError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. nicole@studio.design"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <span className="text-xs text-slate-400">Encrypted</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  Sign In to ClientVault <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 1-Click Demo Accounts */}
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
                  Quick Demo 1-Click Access
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('endrina.nicole.madridano@gmail.com')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                        Nicole Endrina (Freelancer / Designer)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Full access to client vaults & deliverables
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600">&rarr;</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('sarah.jenkins@acmecorp.com')}
                    className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                        Sarah Jenkins (Acme Corp Client)
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Client portal view to upload & review assets
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">&rarr;</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Create Account Form */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {signUpError && (
                <div className="p-3 text-xs font-semibold rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  {signUpError}
                </div>
              )}

              {/* Role Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  I am using ClientVault as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignUpRole('freelancer')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      signUpRole === 'freelancer'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Freelancer / Designer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSignUpRole('client')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      signUpRole === 'client'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Client
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  {signUpRole === 'freelancer' ? 'Design Studio or Title' : 'Company / Brand Name'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={signUpCompany}
                    onChange={(e) => setSignUpCompany(e.target.value)}
                    placeholder={signUpRole === 'freelancer' ? 'e.g. Apex Design Studio' : 'e.g. Acme Corp'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                >
                  Create an Account <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Client-specific isolation & secure file encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};
