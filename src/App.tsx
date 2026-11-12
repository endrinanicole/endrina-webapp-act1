import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VaultProvider, useVault } from './context/VaultContext';
import { Sidebar } from './components/Sidebar';
import { LoginPage } from './components/LoginPage';
import { FileUploadArea } from './components/FileUploadArea';
import { FilesList } from './components/FilesList';
import { ProjectsView } from './components/ProjectsView';
import { AccountProfileView } from './components/AccountProfileView';
import { FilePreviewModal } from './components/FilePreviewModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { RenameModal } from './components/RenameModal';
import { SharePortalModal } from './components/SharePortalModal';
import { NewProjectModal } from './components/NewProjectModal';
import { ToastContainer } from './components/ToastContainer';
import { VaultFile } from './types';
import {
  UploadCloud,
  Share2,
  FolderKanban,
  Files,
  Plus,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  HardDrive,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const DashboardMain: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const { files, selectedProject, setSelectedProject } = useVault();

  const [currentTab, setCurrentTab] = useState<'dashboard' | 'upload' | 'projects' | 'profile'>('dashboard');
  const [showUploadArea, setShowUploadArea] = useState(false);

  // Modals state
  const [previewFile, setPreviewFile] = useState<VaultFile | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VaultFile | null>(null);
  const [renameTarget, setRenameTarget] = useState<VaultFile | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 font-sans">
      {/* Desktop Navy Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'dashboard') setShowUploadArea(false);
          }}
          onOpenShareModal={() => setShareModalOpen(true)}
          onOpenNewProjectModal={() => setNewProjectModalOpen(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72">
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={(tab) => {
                setCurrentTab(tab);
                setMobileSidebarOpen(false);
                if (tab === 'dashboard') setShowUploadArea(false);
              }}
              onOpenShareModal={() => {
                setShareModalOpen(true);
                setMobileSidebarOpen(false);
              }}
              onOpenNewProjectModal={() => {
                setNewProjectModalOpen(true);
                setMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area: White & Light Gray Clean Aesthetic */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 min-w-0 text-xs sm:text-sm font-semibold text-slate-500">
              <span className="font-bold text-slate-900">
                {currentTab === 'dashboard'
                  ? selectedProject === 'all'
                    ? 'All Files'
                    : selectedProject
                  : currentTab === 'upload'
                  ? 'Upload Files'
                  : currentTab === 'projects'
                  ? 'Client Projects'
                  : 'Profile & Account'}
              </span>
              {selectedProject !== 'all' && currentTab === 'dashboard' && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  <button
                    type="button"
                    onClick={() => setSelectedProject('all')}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5">
            {currentTab === 'dashboard' && (
              <>
                <button
                  type="button"
                  onClick={() => setShowUploadArea(!showUploadArea)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                    showUploadArea
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{showUploadArea ? 'Hide Uploader' : 'Upload Files'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Client Link</span>
                </button>
              </>
            )}

            {/* User tag & Quick Sign Out */}
            <div className="pl-2 border-l border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentTab('profile')}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Account Settings"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white"
                  style={{ backgroundColor: currentUser.avatarBgColor || '#2563eb' }}
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <span className="hidden md:inline text-xs font-bold text-slate-800 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
              </button>

              <button
                type="button"
                onClick={signOut}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* TAB 1: Dashboard (Files List + Optional Upload Area) */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Collapsible File Upload Area */}
              {showUploadArea && (
                <div className="animate-in fade-in slide-in-from-top-3 duration-200">
                  <FileUploadArea onUploadComplete={() => setShowUploadArea(false)} />
                </div>
              )}

              {/* Main Files List Table */}
              <FilesList
                onPreview={(file) => setPreviewFile(file)}
                onDeleteRequest={(file) => setDeleteTarget(file)}
                onRenameRequest={(file) => setRenameTarget(file)}
              />
            </div>
          )}

          {/* TAB 2: Upload Files View */}
          {currentTab === 'upload' && (
            <div className="space-y-6 max-w-4xl">
              <FileUploadArea
                onUploadComplete={() => {
                  setCurrentTab('dashboard');
                }}
              />
            </div>
          )}

          {/* TAB 3: Client Projects */}
          {currentTab === 'projects' && (
            <ProjectsView
              onSelectProject={(pName) => {
                setSelectedProject(pName);
                setCurrentTab('dashboard');
              }}
              onOpenNewProject={() => setNewProjectModalOpen(true)}
              onOpenShareModal={() => setShareModalOpen(true)}
            />
          )}

          {/* TAB 4: Profile & Account */}
          {currentTab === 'profile' && <AccountProfileView />}
        </main>
      </div>

      {/* Modals */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      <DeleteConfirmModal
        file={deleteTarget}
        onClose={() => setDeleteTarget(null)}
      />

      <RenameModal
        file={renameTarget}
        onClose={() => setRenameTarget(null)}
      />

      <SharePortalModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

      <NewProjectModal
        isOpen={newProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <VaultProvider>
        <DashboardMain />
      </VaultProvider>
    </AuthProvider>
  );
}
