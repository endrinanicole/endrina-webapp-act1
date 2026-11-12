export type UserRole = 'freelancer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyOrTitle: string;
  avatarUrl?: string;
  avatarBgColor?: string;
  joinedAt: string;
}

export type FileCategory = 'image' | 'document' | 'design' | 'archive' | 'media' | 'other';
export type FileStatus = 'review' | 'approved' | 'changes_requested';

export interface VaultFile {
  id: string;
  ownerId: string; // The freelancer who owns this vault
  uploadedByUserId: string; // User ID who uploaded
  uploadedByName: string;
  clientName: string;
  projectName: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  dataUrl?: string; // base64 preview or mock URL
  category: FileCategory;
  downloadCount: number;
  status: FileStatus;
  notes?: string;
}

export interface ClientProject {
  id: string;
  ownerId: string;
  clientName: string;
  clientEmail: string;
  projectName: string;
  accessCode: string;
  createdAt: string;
  filesCount: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
