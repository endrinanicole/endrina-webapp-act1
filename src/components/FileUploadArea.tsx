import React, { useState, useRef, ChangeEvent } from 'react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, FolderKanban, FileText, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface FileUploadAreaProps {
  onUploadComplete?: () => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onUploadComplete }) => {
  const { uploadFile, projects } = useVault();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState<string>(
    projects[0]?.projectName || 'Brand Identity & Web Redesign'
  );
  const [notes, setNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setPendingFiles((prev) => [...prev, ...files]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setPendingFiles((prev) => [...prev, ...files]);
    }
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartUpload = async () => {
    if (pendingFiles.length === 0) return;

    setIsUploading(true);
    const targetProject = projects.find((p) => p.projectName === selectedProjectName);
    const clientName = targetProject?.clientName || 'General Client';

    for (const file of pendingFiles) {
      await uploadFile(file, {
        projectName: selectedProjectName,
        clientName,
        notes,
      });
    }

    setPendingFiles([]);
    setNotes('');
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadComplete) onUploadComplete();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            Upload Files to Client Vault
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deliver design assets, presentations, branding collateral, or revisions securely.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Client Project:
          </label>
          <select
            value={selectedProjectName}
            onChange={(e) => setSelectedProjectName(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.projectName}>
                {p.clientName} ({p.projectName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-blue-600 bg-blue-50/60 scale-[1.005]'
            : 'border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-100/70 text-blue-600 flex items-center justify-center mb-3.5 shadow-xs">
          <UploadCloud className="w-7 h-7" />
        </div>

        <div className="text-base font-bold text-slate-900">
          Drop files here or click to browse
        </div>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Figma exports, PDFs, images (PNG, JPG, SVG), archives (ZIP), spreadsheets, or documents up to 50MB each.
        </p>
      </div>

      {/* Selected Pending Files Queue */}
      {pendingFiles.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Files to upload ({pendingFiles.length})
            </span>
            <button
              type="button"
              onClick={() => setPendingFiles([])}
              className="text-xs text-rose-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
            {pendingFiles.map((f, i) => (
              <div key={i} className="p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800 truncate">{f.name}</span>
                  <span className="text-slate-400 font-mono text-[11px] shrink-0">
                    {formatBytes(f.size)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePendingFile(i);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Optional Notes / Message for Client */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Deliverable Notes / Version Instructions (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please check color variations on slide 4; vector icons included in the zip."
              rows={2}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Upload Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleStartUpload}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Upload {pendingFiles.length} {pendingFiles.length === 1 ? 'File' : 'Files'} Now
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
