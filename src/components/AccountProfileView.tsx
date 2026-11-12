import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Briefcase, Calendar, ShieldCheck, KeyRound, CheckCircle2, Lock } from 'lucide-react';

export const AccountProfileView: React.FC = () => {
  const { currentUser, updateProfile, showToast } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [companyOrTitle, setCompanyOrTitle] = useState(currentUser?.companyOrTitle || '');

  // Password change state
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');

  if (!currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Name and email cannot be empty.', 'error');
      return;
    }
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      companyOrTitle: companyOrTitle.trim(),
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    setCurrPass('');
    setNewPass('');
    showToast('Account password updated successfully.');
  };

  const userInitials = currentUser.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'CV';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className="w-18 h-18 rounded-2xl overflow-hidden flex items-center justify-center font-extrabold text-xl text-white shadow-md border-2 border-white"
            style={{ backgroundColor: currentUser.avatarBgColor || '#2563eb' }}
          >
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              userInitials
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentUser.companyOrTitle}</p>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
              <span>{currentUser.email}</span>
              <span>·</span>
              <span>Joined {new Date(currentUser.joinedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Details Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your account details and organization information.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              {currentUser.role === 'freelancer' ? 'Design Studio or Title' : 'Company Name'}
            </label>
            <input
              type="text"
              value={companyOrTitle}
              onChange={(e) => setCompanyOrTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Security Credentials</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep your ClientVault account secure with a strong password.
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currPass}
              onChange={(e) => setCurrPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 shadow-xs"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
