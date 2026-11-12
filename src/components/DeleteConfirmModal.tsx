import React from 'react';
import { VaultFile } from '../types';
import { useVault } from '../context/VaultContext';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  file: VaultFile | null;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ file, onClose }) => {
  const { deleteFile } = useVault();

  if (!file) return null;

  const handleConfirm = () => {
    deleteFile(file.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Trash2 className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">Delete File from Vault?</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Are you sure you want to permanently delete{' '}
            <span className="font-bold text-slate-800">"{file.name}"</span>?
            This file will be permanently removed from your client's deliverables.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Client / Project:</span>
            <span className="font-semibold text-slate-800">{file.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Uploaded:</span>
            <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
          >
            Delete File
          </button>
        </div>
      </div>
    </div>
  );
};
