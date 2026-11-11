import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Send, 
  GitFork, 
  FileSpreadsheet, 
  Settings, 
  Users, 
  Briefcase, 
  Layers, 
  FileCheck, 
  FileClock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Building2,
  Lock,
  LogOut,
  KeyRound
} from 'lucide-react';
import { UserRole, AppSettings, UserAccount, Bagian } from '../../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  role: UserRole;
  activeUser: UserAccount;
  bagianList: Bagian[];
  settings: AppSettings;
  pendingDisposisiCount?: number;
  pendingDraftCount?: number;
  onLogout: () => void;
  isOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  role,
  activeUser,
  bagianList,
  settings,
  pendingDisposisiCount = 0,
  pendingDraftCount = 0,
  onLogout,
  isOpen = true,
  onToggleSidebar,
}) => {
  if (!isOpen) return null;

  const getBagianName = () => {
    if (activeUser.role !== 'staf' || !activeUser.bagianId) return null;
    const b = bagianList.find((item) => item.id === activeUser.bagianId);
    return b ? b.nama : null;
  };

  const currentBidang = getBagianName();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800 select-none animate-in fade-in duration-150">
      {/* Role Context Card */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Akses: {role === 'admin' ? 'Administrator' : role === 'pimpinan' ? 'Pimpinan Instansi' : 'Staf / Unit Kerja'}
          </span>
        </div>
        <p className="text-xs font-semibold text-white truncate">
          {activeUser.nama}
        </p>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">
          {currentBidang || activeUser.jabatan}
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto text-xs">
        {/* Common Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white font-semibold'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard {role === 'admin' ? 'Admin' : role === 'pimpinan' ? 'Pimpinan' : 'Staf'}</span>
          </div>
        </button>

        {/* Section: Persuratan & Disposisi */}
        <div className="pt-3 pb-1 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Modul Persuratan
        </div>

        {/* Surat Masuk */}
        <button
          onClick={() => onSelectTab('surat-masuk')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
            activeTab === 'surat-masuk'
              ? 'bg-blue-600 text-white font-semibold'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Inbox className="w-4 h-4" />
            <span>Surat Masuk</span>
          </div>
          {role === 'pimpinan' && pendingDisposisiCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-bold">
              {pendingDisposisiCount}
            </span>
          )}
        </button>

        {/* Disposisi (Contextual naming) */}
        <button
          onClick={() => onSelectTab('disposisi')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
            activeTab === 'disposisi'
              ? 'bg-blue-600 text-white font-semibold'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <GitFork className="w-4 h-4" />
            <span>
              {role === 'admin'
                ? 'Monitoring Disposisi'
                : role === 'pimpinan'
                ? 'Pengelolaan Disposisi'
                : 'Disposisi Bidang Saya'}
            </span>
          </div>
        </button>

        {/* Surat Keluar */}
        <button
          onClick={() => onSelectTab('surat-keluar')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
            activeTab === 'surat-keluar'
              ? 'bg-blue-600 text-white font-semibold'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Send className="w-4 h-4" />
            <span>
              {role === 'pimpinan' ? 'Persetujuan Surat Keluar' : 'Surat Keluar & Rilis'}
            </span>
          </div>
          {role === 'pimpinan' && pendingDraftCount > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">
              {pendingDraftCount}
            </span>
          )}
        </button>

        {/* Section: Laporan */}
        <div className="pt-3 pb-1 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Laporan & Analisis
        </div>

        <button
          onClick={() => onSelectTab('rekapitulasi')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
            activeTab === 'rekapitulasi'
              ? 'bg-blue-600 text-white font-semibold'
              : 'hover:bg-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Rekapitulasi & Excel</span>
          </div>
        </button>

        {/* Master Data (Admin Only) */}
        {role === 'admin' && (
          <>
            <div className="pt-3 pb-1 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Master Aplikasi (Admin)
            </div>

            <button
              onClick={() => onSelectTab('master-instansi')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === 'master-instansi'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>Pengaturan Sistem & Instansi</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('master-bagian')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === 'master-bagian'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" />
                <span>Master Bagian / Bidang</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('master-jenis')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === 'master-jenis'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Jenis Surat</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('master-pegawai')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === 'master-pegawai'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Data Pegawai & Export</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('master-pimpinan')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === 'master-pimpinan'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Pengaturan Pimpinan</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('master-users')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === 'master-users'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4" />
                <span>Login Pegawai / Staf</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('master-token')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors font-medium ${
                activeTab === 'master-token'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'hover:bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4" />
                <span>Pengaturan Token Validasi</span>
              </div>
            </button>
          </>
        )}

        {/* Dedicated Logout Button in Sidebar */}
        <div className="pt-3 border-t border-slate-800 mt-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors font-semibold text-xs text-left cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar dari Sistem</span>
          </button>
        </div>
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-400">
        <p className="font-medium text-slate-300 truncate">{settings.systemSubName}</p>
        <p className="font-mono mt-0.5">Versi Rilis 2026.1</p>
      </div>
    </aside>
  );
};
