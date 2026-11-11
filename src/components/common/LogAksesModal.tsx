import React from 'react';
import { X, History, UserCheck, Shield, Clock } from 'lucide-react';
import { LogAkses } from '../../types';

interface LogAksesModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogAkses[];
  title?: string;
  subtitle?: string;
}

export const LogAksesModal: React.FC<LogAksesModalProps> = ({
  isOpen,
  onClose,
  logs,
  title = 'Rekam Jejak Log Akses & Aktivitas Surat',
  subtitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 leading-tight">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-500 font-mono mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Belum ada riwayat aktivitas yang tercatat untuk dokumen ini.
            </div>
          ) : (
            <div className="relative border-l border-slate-200 ml-3 space-y-6">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline Node */}
                  <span className="absolute -left-2 top-1 w-4 h-4 rounded-full border-2 border-white bg-indigo-600 shadow-xs" />
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {log.aktivitas}
                      </p>
                      <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
                        {log.waktu}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                        {log.userName}
                      </span>
                      <span>·</span>
                      <span className="uppercase text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {log.userRole}
                      </span>
                      {log.userBagian && (
                        <>
                          <span>·</span>
                          <span>{log.userBagian}</span>
                        </>
                      )}
                      {log.ipAddress && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-slate-400 text-[10px]">IP: {log.ipAddress}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            Audit trail terekam otomatis dan tidak dapat diubah
          </span>
          <span className="font-mono text-[11px]">Total: {logs.length} Log</span>
        </div>
      </div>
    </div>
  );
};
