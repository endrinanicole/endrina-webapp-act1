import React from 'react';
import { useVault } from '../context/VaultContext';
import { useAuth } from '../context/AuthContext';
import { FolderKanban, Plus, Files, Share2, Trash2, ExternalLink, Calendar, Mail } from 'lucide-react';

interface ProjectsViewProps {
  onSelectProject: (projectName: string) => void;
  onOpenNewProject: () => void;
  onOpenShareModal: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onSelectProject,
  onOpenNewProject,
  onOpenShareModal,
}) => {
  const { projects, deleteProject, files } = useVault();
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Client Projects & Portals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Dedicated folders and upload links created for each of your design clients.
          </p>
        </div>

        {currentUser?.role === 'freelancer' && (
          <button
            type="button"
            onClick={onOpenNewProject}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> New Client Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const projectFiles = files.filter((f) => f.projectName === proj.projectName);
          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                    {proj.accessCode}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-slate-900 text-base">{proj.clientName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{proj.projectName}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Files className="w-3.5 h-3.5 text-slate-400" />
                    <span>{projectFiles.length} deliverables uploaded</span>
                  </div>
                  {proj.clientEmail && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{proj.clientEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Created {new Date(proj.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onSelectProject(proj.projectName)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                >
                  Open Vault <ExternalLink className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={onOpenShareModal}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Get Client Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {currentUser?.role === 'freelancer' && projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteProject(proj.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Remove Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
