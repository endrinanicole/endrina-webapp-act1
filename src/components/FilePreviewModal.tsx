import React from 'react';
import { VaultFile } from '../types';
import { useVault } from '../context/VaultContext';
import { X, Download, Calendar, User, FolderKanban, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface FilePreviewModalProps {
  file: VaultFile | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  const { downloadFile } = useVault();

  if (!file) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isImage = file.category === 'image' || file.category === 'design' && file.dataUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="min-w-0 pr-4">
            <h3 className="text-base font-bold text-slate-900 truncate">{file.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {file.clientName} · {file.projectName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-50/40 min-h-[260px]">
          {isImage && file.dataUrl ? (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm max-h-[50vh]">
              <img
                src={file.dataUrl}
                alt={file.name}
                className="w-full h-full object-contain max-h-[48vh]"
              />
            </div>
          ) : (
            <div className="text-center space-y-3 py-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{file.name}</h4>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{file.type}</p>
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                File stored safely in ClientVault. Click download below to save and open in native applications.
              </p>
            </div>
          )}

          {/* Metadata Cards */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-200 text-left">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                File Size
              </span>
              <span className="text-xs font-bold text-slate-800 font-mono mt-0.5 block">
                {formatBytes(file.size)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Uploaded By
              </span>
              <span className="text-xs font-semibold text-slate-800 truncate mt-0.5 block">
                {file.uploadedByName}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Upload Date
              </span>
              <span className="text-xs font-semibold text-slate-800 mt-0.5 block">
                {new Date(file.uploadedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Status
              </span>
              <span className="text-xs font-bold capitalize text-blue-600 mt-0.5 block">
                {file.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {file.notes && (
            <div className="w-full mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
              <span className="font-bold">Deliverable Notes:</span> {file.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => downloadFile(file)}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download File
          </button>
        </div>
      </div>
    </div>
  );
};
