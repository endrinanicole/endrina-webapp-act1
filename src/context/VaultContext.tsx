import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VaultFile, ClientProject, FileCategory, FileStatus } from '../types';
import { INITIAL_FILES, INITIAL_PROJECTS } from '../data/initialVaultData';
import { useAuth } from './AuthContext';

interface VaultContextType {
  files: VaultFile[];
  projects: ClientProject[];
  totalStorageBytes: number;
  usedStorageBytes: number;
  usedStoragePercentage: number;
  uploadFile: (
    file: File,
    meta?: { projectName?: string; clientName?: string; notes?: string }
  ) => Promise<{ success: boolean; file?: VaultFile }>;
  deleteFile: (fileId: string) => boolean;
  downloadFile: (file: VaultFile) => void;
  renameFile: (fileId: string, newName: string) => boolean;
  updateFileStatus: (fileId: string, status: FileStatus) => void;
  createProject: (clientName: string, clientEmail: string, projectName: string) => ClientProject;
  deleteProject: (projectId: string) => void;
  // Filters & State
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: FileCategory | 'all';
  setSelectedCategory: (c: FileCategory | 'all') => void;
  selectedProject: string; // project name or 'all'
  setSelectedProject: (p: string) => void;
  sortBy: 'date_desc' | 'date_asc' | 'size_desc' | 'size_asc' | 'name';
  setSortBy: (s: 'date_desc' | 'date_asc' | 'size_desc' | 'size_asc' | 'name') => void;
}

const STORAGE_KEY_FILES = 'clientvault_files_v1';
const STORAGE_KEY_PROJECTS = 'clientvault_projects_v1';

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export const VaultProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, showToast } = useAuth();

  const [allFiles, setAllFiles] = useState<VaultFile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_FILES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_FILES;
  });

  const [projects, setProjects] = useState<ClientProject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROJECTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | 'all'>('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'size_desc' | 'size_asc' | 'name'>('date_desc');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_FILES, JSON.stringify(allFiles));
  }, [allFiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  }, [projects]);

  // Security isolation:
  // - If freelancer: see all files belonging to their vault (ownerId === currentUser.id)
  // - If client: see files belonging to their company/project or files they uploaded
  const visibleFiles = allFiles.filter((file) => {
    if (!currentUser) return false;
    if (currentUser.role === 'freelancer') {
      return file.ownerId === currentUser.id;
    }
    // Client view
    return (
      file.uploadedByUserId === currentUser.id ||
      file.clientName.toLowerCase().includes(currentUser.companyOrTitle.toLowerCase()) ||
      currentUser.companyOrTitle.toLowerCase().includes(file.clientName.toLowerCase())
    );
  });

  const totalStorageBytes = 262144000; // 250 MB
  const usedStorageBytes = visibleFiles.reduce((acc, f) => acc + f.size, 0);
  const usedStoragePercentage = Math.min(100, Math.round((usedStorageBytes / totalStorageBytes) * 100));

  const detectCategory = (fileType: string, filename: string): FileCategory => {
    const lowType = fileType.toLowerCase();
    const lowName = filename.toLowerCase();

    if (/\.(fig|sketch|xd|ai|psd|svg|eps|raw|ind|afdesign)$/.test(lowName) || lowType.includes('svg')) {
      return 'design';
    }
    if (lowType.startsWith('image/') || /\.(png|jpe?g|webp|gif|avif|tiff)$/.test(lowName)) {
      return 'image';
    }
    if (
      lowType.includes('pdf') ||
      lowType.includes('word') ||
      lowType.includes('document') ||
      lowType.includes('sheet') ||
      lowType.includes('excel') ||
      lowType.includes('presentation') ||
      lowType.includes('text') ||
      /\.(pdf|docx?|txt|md|xlsx?|pptx?|csv)$/.test(lowName)
    ) {
      return 'document';
    }
    if (lowType.includes('zip') || lowType.includes('archive') || /\.(zip|rar|tar|gz|7z)$/.test(lowName)) {
      return 'archive';
    }
    if (lowType.startsWith('video/') || lowType.startsWith('audio/') || /\.(mp4|mov|webm|mp3|wav)$/.test(lowName)) {
      return 'media';
    }
    return 'other';
  };

  const uploadFile = async (
    file: File,
    meta?: { projectName?: string; clientName?: string; notes?: string }
  ): Promise<{ success: boolean; file?: VaultFile }> => {
    if (!currentUser) {
      showToast('You must be signed in to upload files.', 'error');
      return { success: false };
    }

    if (usedStorageBytes + file.size > totalStorageBytes) {
      showToast('Storage quota exceeded! Please delete older files to free space.', 'error');
      return { success: false };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();

      const finishUpload = (dataUrl?: string) => {
        const ownerId = currentUser.role === 'freelancer' ? currentUser.id : 'usr_nicole'; // default vault owner
        const clientName =
          meta?.clientName ||
          (currentUser.role === 'client' ? currentUser.companyOrTitle : 'Acme Corporation');
        const projectName = meta?.projectName || 'Brand Identity & Web Redesign';

        const newFile: VaultFile = {
          id: 'vf_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
          ownerId,
          uploadedByUserId: currentUser.id,
          uploadedByName: currentUser.name,
          clientName,
          projectName,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
          category: detectCategory(file.type, file.name),
          dataUrl,
          downloadCount: 0,
          status: 'review',
          notes: meta?.notes || '',
        };

        setAllFiles((prev) => [newFile, ...prev]);

        // Update project file count
        setProjects((prev) =>
          prev.map((p) =>
            p.projectName === projectName ? { ...p, filesCount: p.filesCount + 1 } : p
          )
        );

        showToast(`"${file.name}" uploaded successfully!`);
        resolve({ success: true, file: newFile });
      };

      if (file.size < 6 * 1024 * 1024) {
        reader.onload = (e) => {
          finishUpload(e.target?.result as string);
        };
        reader.onerror = () => finishUpload();
        reader.readAsDataURL(file);
      } else {
        finishUpload();
      }
    });
  };

  const deleteFile = (fileId: string): boolean => {
    const target = allFiles.find((f) => f.id === fileId);
    if (!target) return false;

    // Security check: only allow delete if user is vault owner or the user who uploaded it
    if (currentUser && currentUser.role !== 'freelancer' && target.uploadedByUserId !== currentUser.id) {
      showToast('Permission denied: You can only delete files that you uploaded.', 'error');
      return false;
    }

    setAllFiles((prev) => prev.filter((f) => f.id !== fileId));
    showToast(`"${target.name}" has been deleted from the vault.`);
    return true;
  };

  const downloadFile = (file: VaultFile) => {
    // Increment download count
    setAllFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f))
    );

    if (file.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Mock downloadable file
      const blob = new Blob([`ClientVault File Content: ${file.name}\nSize: ${file.size} bytes`], {
        type: file.type || 'text/plain',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    showToast(`Downloading "${file.name}"...`, 'info');
  };

  const renameFile = (fileId: string, newName: string): boolean => {
    const clean = newName.trim();
    if (!clean) {
      showToast('File name cannot be empty.', 'error');
      return false;
    }

    setAllFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, name: clean } : f))
    );
    showToast('File name updated.');
    return true;
  };

  const updateFileStatus = (fileId: string, status: FileStatus) => {
    setAllFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status } : f))
    );
    showToast(`File status updated to "${status.replace('_', ' ')}".`);
  };

  const createProject = (clientName: string, clientEmail: string, projectName: string) => {
    const code =
      clientName.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'PRJ') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    const newProj: ClientProject = {
      id: 'proj_' + Date.now(),
      ownerId: currentUser?.id || 'usr_nicole',
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      projectName: projectName.trim(),
      accessCode: code,
      createdAt: new Date().toISOString(),
      filesCount: 0,
    };

    setProjects((prev) => [newProj, ...prev]);
    showToast(`Client project "${projectName}" created! Access code: ${code}`);
    return newProj;
  };

  const deleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    showToast('Project removed.');
  };

  return (
    <VaultContext.Provider
      value={{
        files: visibleFiles,
        projects,
        totalStorageBytes,
        usedStorageBytes,
        usedStoragePercentage,
        uploadFile,
        deleteFile,
        downloadFile,
        renameFile,
        updateFileStatus,
        createProject,
        deleteProject,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedProject,
        setSelectedProject,
        sortBy,
        setSortBy,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
