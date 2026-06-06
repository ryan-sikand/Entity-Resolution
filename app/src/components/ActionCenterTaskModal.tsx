import { createPortal } from 'react-dom';
import type { TaskGetResponse } from '@uipath/uipath-typescript/tasks';
import type { Investigation } from '../types/investigation';
import { buildActionCenterTaskEmbedUrl } from '../utils/uipathLinks';

interface ActionCenterTaskModalProps {
  investigation: Investigation;
  task: TaskGetResponse;
  completed: boolean;
  onClose: () => void;
}

export const ActionCenterTaskModal = ({
  investigation,
  task,
  completed,
  onClose,
}: ActionCenterTaskModalProps) => {
  const taskUrl = buildActionCenterTaskEmbedUrl(task.id);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
      <div className="w-full max-w-6xl h-[86vh] bg-[#111421] border border-gray-700 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-[#1a1d29]">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-red-500/15 border border-red-500/40 text-red-300 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6m-6 4h6m-6 4h3m-6 7h12a2 2 0 002-2V6.5L15.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-white truncate">{task.title || 'Action Center Task'}</h2>
                <p className="text-xs text-gray-400 truncate">
                  {investigation.subjectName} | Task #{task.id}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Close task"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {completed && (
          <div className="px-5 py-3 bg-green-500/10 border-b border-green-500/30 text-green-300 text-sm">
            Task completed. The investigation queue is refreshing with the latest status.
          </div>
        )}

        <iframe
          title={`Action Center task ${task.id}`}
          src={taskUrl}
          className="flex-1 w-full bg-white"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>,
    document.body
  );
};
