import React, { useState, useEffect } from 'react';
import { VaultFile } from '../types';
import { useVault } from '../context/VaultContext';
import { Edit2, X } from 'lucide-react';

interface RenameModalProps {
  file: VaultFile | null;
  onClose: () => void;
}

export const RenameModal: React.FC<RenameModalProps> = ({ file, onClose }) => {
  const { renameFile } = useVault();
  const [name, setName] = useState('');

  useEffect(() => {
    if (file) {
      setName(file.name);
    }
  }, [file]);

  if (!file) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      renameFile(file.id, name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 space-y-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Rename File</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              File Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
