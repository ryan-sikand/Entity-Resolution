import { formatTimeAgo } from '../services/mockInvestigations';
import type { ActionCenterTaskInfo, Investigation, RiskLevel, CaseStatus } from '../types/investigation';
import { getStatusBadgeConfig } from '../utils/caseStatus';

type SortField = 'subjectName' | 'subjectId' | 'overallRisk' | 'caseStatus' | 'flaggedChecks' | 'lastActivity';
type SortDirection = 'asc' | 'desc';

interface InvestigationTableProps {
  investigations: Investigation[];
  currentPage: number;
  totalPages: number;
  totalInvestigations: number;
  onPageChange: (page: number) => void;
  onInvestigationClick?: (investigation: Investigation) => void;
  actionCenterTasks?: Record<string, ActionCenterTaskInfo>;
  onActionCenterTaskClick?: (investigation: Investigation) => void;
  onMaestroProcessClick?: (investigation: Investigation) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export const InvestigationTable = ({
  investigations,
  currentPage,
  totalPages,
  totalInvestigations,
  onPageChange,
  onInvestigationClick,
  actionCenterTasks = {},
  onActionCenterTaskClick,
  onMaestroProcessClick,
  sortField,
  sortDirection,
  onSortChange,
}: InvestigationTableProps) => {
  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with descending as default
      onSortChange(field, 'desc');
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getRiskBadge = (risk: RiskLevel) => {
    const styles = {
      High: 'bg-red-500/20 text-red-400 border-red-500/30',
      Medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      Low: 'bg-green-500/20 text-green-400 border-green-500/30',
    };

    const getIcon = (level: RiskLevel) => {
      if (level === 'High') {
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.964-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      } else if (level === 'Medium') {
        return (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      } else {
        return (
          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      }
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${styles[risk]}`}>
        {getIcon(risk)}
        {risk}
      </span>
    );
  };

  const getStatusBadge = (status: CaseStatus) => {
    const config = getStatusBadgeConfig(status);
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${config.styles}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const getActionCenterButtonState = (investigation: Investigation) => {
    const taskState = actionCenterTasks[investigation.id];

    if (!investigation.maestroProcessInstanceKey) {
      return {
        disabled: true,
        label: 'No Task',
        title: 'No Maestro process is linked to this investigation',
        className: 'bg-gray-700/40 text-gray-500 cursor-not-allowed',
      };
    }

    if (!taskState || taskState.status === 'loading') {
      return {
        disabled: true,
        label: 'Loading',
        title: 'Checking for an Action Center task',
        className: 'bg-gray-700/50 text-gray-400 cursor-wait',
      };
    }

    if (taskState.status === 'available') {
      return {
        disabled: false,
        label: 'Task',
        title: taskState.taskTitle ? `Open Action Center task: ${taskState.taskTitle}` : 'Open Action Center task',
        className: 'bg-red-500 text-white hover:bg-red-600',
      };
    }

    if (taskState.status === 'completed') {
      return {
        disabled: true,
        label: 'Done',
        title: 'Action Center task is completed',
        className: 'bg-green-500/15 text-green-300 border border-green-500/30 cursor-not-allowed',
      };
    }

    if (taskState.status === 'error') {
      return {
        disabled: true,
        label: 'Error',
        title: taskState.error || 'Could not load Action Center task',
        className: 'bg-orange-500/15 text-orange-300 border border-orange-500/30 cursor-not-allowed',
      };
    }

    return {
      disabled: true,
      label: 'No Task',
      title: 'No pending Action Center task exists for this investigation',
      className: 'bg-gray-700/40 text-gray-500 cursor-not-allowed',
    };
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex flex-col gap-3 border-t border-gray-800 px-3 py-3 sm:flex-row sm:items-center sm:justify-between lg:px-4">
        <p className="text-sm text-gray-400">
          Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalInvestigations)} of {totalInvestigations} investigations
        </p>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-[#252836] border border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${currentPage === page
                  ? 'bg-red-500 text-white'
                  : 'bg-[#252836] border border-gray-700 text-gray-400 hover:bg-gray-800'
                }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-[#252836] border border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-800 bg-[#1a1d29]">
      <div className="overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-[#252836] border-b border-gray-800">
            <tr>
              <th
                className="w-[18%] cursor-pointer px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:bg-gray-700/50 lg:px-4"
                onClick={() => handleSort('subjectName')}
              >
                <div className="flex items-center gap-2">
                  Subject
                  {renderSortIcon('subjectName')}
                </div>
              </th>
              <th
                className="w-[10%] cursor-pointer px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:bg-gray-700/50 xl:px-3"
                onClick={() => handleSort('subjectId')}
              >
                <div className="flex items-center gap-2">
                  Subject ID
                  {renderSortIcon('subjectId')}
                </div>
              </th>
              <th
                className="w-[8%] cursor-pointer px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:bg-gray-700/50 xl:px-3"
                onClick={() => handleSort('overallRisk')}
              >
                <div className="flex items-center gap-2">
                  Risk
                  {renderSortIcon('overallRisk')}
                </div>
              </th>
              <th
                className="w-[11%] cursor-pointer px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:bg-gray-700/50 xl:px-3"
                onClick={() => handleSort('caseStatus')}
              >
                <div className="flex items-center gap-2">
                  Status
                  {renderSortIcon('caseStatus')}
                </div>
              </th>
              <th
                className="w-[8%] cursor-pointer px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:bg-gray-700/50 xl:px-3"
                onClick={() => handleSort('flaggedChecks')}
              >
                <div className="flex items-center gap-2">
                  Flagged Checks
                  {renderSortIcon('flaggedChecks')}
                </div>
              </th>
              <th className="w-[25%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 xl:px-3">
                Intel Summary
              </th>
              <th
                className="w-[9%] cursor-pointer px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:bg-gray-700/50 xl:px-3"
                onClick={() => handleSort('lastActivity')}
              >
                <div className="flex items-center gap-2">
                  Last Updated
                  {renderSortIcon('lastActivity')}
                </div>
              </th>
              <th className="w-[5%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 xl:px-3">
                Maestro
              </th>
              <th className="w-[6%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 xl:px-3">
                Task
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {investigations.map((investigation) => {
              const hasRisk = investigation.overallRisk && investigation.overallRisk.trim() !== '';
              const actionCenterButton = getActionCenterButtonState(investigation);
              return (
              <tr
                key={investigation.id}
                className={`transition-colors ${hasRisk ? 'hover:bg-gray-800/50 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                onClick={() => hasRisk && onInvestigationClick?.(investigation)}
              >
                <td className="whitespace-nowrap px-2 py-3 xl:px-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getAvatarColor(investigation.subjectName)} lg:h-10 lg:w-10`}>
                      <span className="text-white text-sm font-semibold">
                        {getInitials(investigation.subjectName)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-white" title={investigation.subjectName}>
                        {investigation.subjectName}
                      </div>
                      <div className="truncate text-xs text-gray-400" title={`${investigation.subjectNationality} | DOB: ${investigation.subjectDob}`}>
                        {investigation.subjectNationality} | DOB: {investigation.subjectDob}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-2 py-3 xl:px-3">
                  <div className="truncate font-mono text-sm text-gray-300" title={investigation.subjectId}>
                    {investigation.subjectId}
                  </div>
                </td>
                <td className="whitespace-nowrap px-2 py-3 xl:px-3">
                  {getRiskBadge(investigation.overallRisk)}
                </td>
                <td className="whitespace-nowrap px-2 py-3 xl:px-3">
                  {getStatusBadge(investigation.caseStatus)}
                </td>
                <td className="whitespace-nowrap px-2 py-3 xl:px-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${investigation.flaggedChecks > 5 ? 'text-red-400' :
                        investigation.flaggedChecks > 2 ? 'text-orange-400' :
                          'text-green-400'
                      }`}>
                      {investigation.flaggedChecks}
                    </span>
                    <span className="text-gray-500">/</span>
                    <span className="text-sm text-gray-400">{investigation.totalChecks}</span>
                  </div>
                </td>
                <td className="px-2 py-3 xl:px-3">
                  <div className="truncate text-sm text-gray-300" title={investigation.intelSummary}>
                    {investigation.intelSummary}
                  </div>
                </td>
                <td className="whitespace-nowrap px-2 py-3 xl:px-3">
                  <div className="text-sm text-gray-400">
                    {formatTimeAgo(investigation.lastActivity)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-2 py-3 xl:px-3" onClick={(e) => e.stopPropagation()}>
                  {investigation.maestroProcessInstanceKey && investigation.folderId ? (
                    <button
                      onClick={() => onMaestroProcessClick?.(investigation)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-300 transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-md"
                      title="Open Maestro in app"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 13a5 5 0 007.42.8l.13-.13a5 5 0 000-7.08 5.01 5.01 0 00-7.07-.01l-3 3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 11a5 5 0 00-7.42-.8l-.13.13a5 5 0 000 7.08 5.01 5.01 0 007.07.01l3-3" />
                      </svg>
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs">-</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-2 py-3 xl:px-3" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onActionCenterTaskClick?.(investigation)}
                    disabled={actionCenterButton.disabled}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${actionCenterButton.className}`}
                    title={actionCenterButton.title}
                    aria-label={actionCenterButton.title}
                  >
                    {actionCenterButton.label === 'Loading' ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-500 border-t-gray-300 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5h6m-6 4h6m-6 4h3m-6 7h12a2 2 0 002-2V6.5L15.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="sr-only">{actionCenterButton.label}</span>
                  </button>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};
