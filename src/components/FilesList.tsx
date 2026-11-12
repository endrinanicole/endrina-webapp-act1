import React, { useState } from 'react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';
import { VaultFile, FileCategory, FileStatus } from '../types';
import {
  Search,
  FileText,
  Image as ImageIcon,
  Archive,
  Film,
  FileCode,
  Download,
  Trash2,
  Eye,
  Edit2,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
  User,
  SlidersHorizontal,
} from 'lucide-react';

interface FilesListProps {
  onPreview: (file: VaultFile) => void;
  onDeleteRequest: (file: VaultFile) => void;
  onRenameRequest: (file: VaultFile) => void;
}

export const FilesList: React.FC<FilesListProps> = ({
  onPreview,
  onDeleteRequest,
  onRenameRequest,
}) => {
  const {
    files,
    downloadFile,
    updateFileStatus,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedProject,
    setSelectedProject,
    projects,
    sortBy,
    setSortBy,
  } = useVault();

  const { currentUser } = useAuth();

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'design':
        return <FileCode className="w-4 h-4 text-purple-600" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-blue-600" />;
      case 'document':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-amber-600" />;
      case 'media':
        return <Film className="w-4 h-4 text-rose-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  // Filter & sort
  const filteredFiles = files
    .filter((f) => {
      const matchesSearch =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
      const matchesProject = selectedProject === 'all' || f.projectName === selectedProject;
      return matchesSearch && matchesCategory && matchesProject;
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
      if (sortBy === 'date_asc') {
        return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      }
      if (sortBy === 'size_desc') {
        return b.size - a.size;
      }
      if (sortBy === 'size_asc') {
        return a.size - b.size;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const getStatusBadge = (status: FileStatus, fileId: string) => {
    return (
      <select
        value={status}
        onChange={(e) => updateFileStatus(fileId, e.target.value as FileStatus)}
        className={`text-[11px] font-semibold py-0.5 px-2 rounded-md border focus:outline-none cursor-pointer ${
          status === 'approved'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : status === 'changes_requested'
            ? 'bg-amber-50 text-amber-700 border-amber-200'
            : 'bg-slate-100 text-slate-700 border-slate-200'
        }`}
      >
        <option value="review">Under Review</option>
        <option value="approved">Approved</option>
        <option value="changes_requested">Needs Changes</option>
      </select>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter & Project Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by file name or client..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {(['all', 'design', 'document', 'image', 'archive'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="size_desc">Largest Size</option>
            <option value="size_asc">Smallest Size</option>
            <option value="name">File Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Files Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {filteredFiles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No files found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'No uploaded deliverables match your current search query.'
                : 'There are no files uploaded in this folder yet. Use the upload area above to share assets.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 px-6">File Name</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Client / Project</th>
                  <th className="py-3.5 px-4">Size</th>
                  <th className="py-3.5 px-4">Upload Date</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* File Name & Icon */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                          {getCategoryIcon(file.category)}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onPreview(file)}
                            className="font-semibold text-slate-900 hover:text-blue-600 truncate max-w-xs sm:max-w-sm block text-left"
                          >
                            {file.name}
                          </button>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                            <span>By {file.uploadedByName}</span>
                            {file.notes && (
                              <>
                                <span>·</span>
                                <span className="truncate max-w-[150px] italic">"{file.notes}"</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Client / Project */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <div className="text-xs font-semibold text-slate-800 truncate max-w-[180px]">
                        {file.clientName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {file.projectName}
                      </div>
                    </td>

                    {/* File Size */}
                    <td className="py-3.5 px-4 text-xs font-mono font-medium text-slate-600 whitespace-nowrap">
                      {formatBytes(file.size)}
                    </td>

                    {/* Upload Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDate(file.uploadedAt)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      {getStatusBadge(file.status, file.id)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onPreview(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Preview File"
                          aria-label={`Preview ${file.name}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadFile(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                          title="Download File"
                          aria-label={`Download ${file.name}`}
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onRenameRequest(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Rename File"
                          aria-label={`Rename ${file.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Required Delete File Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteRequest(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete File"
                          aria-label={`Delete ${file.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
