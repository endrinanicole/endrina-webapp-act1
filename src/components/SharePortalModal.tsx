import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';
import { Share2, Copy, Check, ExternalLink, X, Shield, Lock, Users } from 'lucide-react';

interface SharePortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharePortalModal: React.FC<SharePortalModalProps> = ({ isOpen, onClose }) => {
  const { projects } = useVault();
  const { showToast, switchAccount, allUsers } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const shareUrl = `https://clientvault.app/upload/${currentProject?.accessCode || 'PORTAL-101'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Secure client upload link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleTestClientView = () => {
    // Switch to client demo user
    const clientUser = allUsers.find((u) => u.role === 'client') || allUsers[1];
    if (clientUser) {
      switchAccount(clientUser.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Share Client Upload Portal</h3>
              <p className="text-xs text-slate-500">Provide clients a direct link to upload project files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Project Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Select Client / Project
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.clientName} - {p.projectName} (Code: {p.accessCode})
              </option>
            ))}
          </select>
        </div>

        {/* Share Link Box */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Dedicated Client Upload URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-100 border border-slate-200 text-slate-800 select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copy Link
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Clients visiting this link are routed directly to this project's secure dropzone.
          </p>
        </div>

        {/* Security Info */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Shield className="w-4 h-4 text-emerald-600" />
            Security & Client Isolation
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Files uploaded to this link are isolated to <span className="font-semibold text-slate-700">{currentProject?.clientName}</span>. Other clients cannot view these deliverables.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTestClientView}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" />
            Test Client View Persona &rarr;
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
