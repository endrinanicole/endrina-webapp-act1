import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useVault } from '../context/VaultContext';
import {
  FolderLock,
  Files,
  UploadCloud,
  FolderKanban,
  Share2,
  User as UserIcon,
  LogOut,
  HardDrive,
  CheckCircle2,
  Users,
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'upload' | 'projects' | 'profile';
  setCurrentTab: (tab: 'dashboard' | 'upload' | 'projects' | 'profile') => void;
  onOpenShareModal: () => void;
  onOpenNewProjectModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenShareModal,
  onOpenNewProjectModal,
}) => {
  const { currentUser, signOut, allUsers, switchAccount } = useAuth();
  const { files, usedStorageBytes, totalStorageBytes, usedStoragePercentage, projects, selectedProject, setSelectedProject } = useVault();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'CV';

  return (
    <aside className="w-72 bg-[#0B1329] text-slate-200 flex flex-col justify-between shrink-0 border-r border-slate-800/80 min-h-screen">
      {/* Top Branding & Navigation */}
      <div>
        {/* App Header */}
        <div className="px-6 py-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FolderLock className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block">
                ClientVault
              </span>
              <span className="text-[11px] text-slate-400 font-medium block -mt-0.5">
                Secure Client File Portal
              </span>
            </div>
          </div>
        </div>

        {/* User Role Badge */}
        {currentUser && (
          <div className="px-6 pt-4 pb-2">
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300 capitalize">
                  {currentUser.role === 'freelancer' ? 'Freelancer Portal' : 'Client Access'}
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800/60">
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="px-4 py-4 space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedProject('all');
              setCurrentTab('dashboard');
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'dashboard' && selectedProject === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <Files className="w-4 h-4" />
              <span>All Files</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-black/20 text-slate-300">
              {files.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('upload')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'upload'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Files</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('projects')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'projects'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderKanban className="w-4 h-4" />
              <span>Client Projects</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-black/20 text-slate-300">
              {projects.length}
            </span>
          </button>

          <button
            type="button"
            onClick={onOpenShareModal}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Share Client Link</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('profile')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>
        </nav>

        {/* Client Projects List in Sidebar */}
        <div className="px-5 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Projects
            </span>
            {currentUser?.role === 'freelancer' && (
              <button
                type="button"
                onClick={onOpenNewProjectModal}
                className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
              >
                + New
              </button>
            )}
          </div>
          <div className="space-y-1">
            {projects.map((proj) => {
              const isSelected = currentTab === 'dashboard' && selectedProject === proj.projectName;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => {
                    setSelectedProject(proj.projectName);
                    setCurrentTab('dashboard');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium truncate flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-slate-800 text-white font-semibold border-l-2 border-blue-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <span className="truncate">{proj.clientName}</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">
                    {proj.filesCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Area: Storage Quota, Switcher & Sign Out */}
      <div className="p-4 border-t border-slate-800/80 space-y-4">
        {/* Storage Bar */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-400">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              Vault Storage
            </span>
            <span>{usedStoragePercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, usedStoragePercentage)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
            <span>{formatBytes(usedStorageBytes)}</span>
            <span>{formatBytes(totalStorageBytes)}</span>
          </div>
        </div>

        {/* Demo Switcher Quick Menu */}
        <div className="space-y-1">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-1">
            Switch Demo Persona:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {allUsers.slice(0, 2).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => switchAccount(u.id)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-medium truncate text-left border transition-colors ${
                  currentUser?.id === u.id
                    ? 'bg-blue-950/80 border-blue-700 text-blue-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {u.name.split(' ')[0]} ({u.role})
              </button>
            ))}
          </div>
        </div>

        {/* Logged In User & Sign Out */}
        {currentUser && (
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-slate-700 font-bold text-xs text-white"
                style={{ backgroundColor: currentUser.avatarBgColor || '#2563eb' }}
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-white truncate block">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {currentUser.email}
                </span>
              </div>
            </div>

            {/* Required Sign Out Button */}
            <button
              type="button"
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors shrink-0"
              title="Sign Out of ClientVault"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
