import { createPortal } from 'react-dom';
import type { Investigation } from '../types/investigation';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface MaestroProcessModalProps {
  investigation: Investigation;
  processUrl: string;
  onClose: () => void;
}

export const MaestroProcessModal = ({
  investigation,
  processUrl,
  onClose,
}: MaestroProcessModalProps) => {
  useBodyScrollLock();

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black/70 p-3 backdrop-blur-sm">
      <div className="flex h-[92vh] w-[95vw] flex-col overflow-hidden rounded-lg border border-gray-700 bg-[#111421] shadow-2xl">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-800 bg-[#1a1d29] px-4 py-3 sm:px-5 sm:py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-500/40 bg-blue-500/15 text-blue-300">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13a5 5 0 007.42.8l.13-.13a5 5 0 000-7.08 5.01 5.01 0 00-7.07-.01l-3 3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11a5 5 0 00-7.42-.8l-.13.13a5 5 0 000 7.08 5.01 5.01 0 007.07.01l3-3" />
                </svg>
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold text-white">Maestro Process</h2>
                <p className="truncate text-xs text-gray-400">
                  {investigation.subjectName} | {investigation.maestroProcessInstanceKey}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={processUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-gray-700 bg-[#252836] px-3 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-white"
              title="Open Maestro in a new browser tab"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H18v4.5M18 6l-7.5 7.5M8 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2" />
              </svg>
              <span className="hidden sm:inline">Open in new tab</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
              title="Close Maestro"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden bg-white">
          <iframe
            title={`Maestro process ${investigation.maestroProcessInstanceKey}`}
            src={processUrl}
            className="h-full w-full border-0 bg-white"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-downloads"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </div>,
    document.body
  );
};
