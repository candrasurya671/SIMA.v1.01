import React, { useState } from 'react';
import { 
  Building, 
  User, 
  ChevronDown, 
  LogOut, 
  Shield, 
  Check, 
  ExternalLink,
  Sliders,
  Bell,
  RefreshCw,
  PanelLeft,
  PanelLeftClose
} from 'lucide-react';
import { AppSettings, UserAccount, UserRole, Bagian } from '../../types';
import { InstitutionLogo } from '../common/InstitutionLogo';

interface NavbarProps {
  settings: AppSettings;
  activeUser: UserAccount;
  allUsers: UserAccount[];
  bagianList: Bagian[];
  onSwitchUser: (user: UserAccount) => void;
  onOpenProfile: () => void;
  onOpenPublicVerification: () => void;
  onLogout: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeUser,
  allUsers,
  bagianList,
  onSwitchUser,
  onOpenProfile,
  onOpenPublicVerification,
  onLogout,
  activeTab,
  onSelectTab,
  isSidebarOpen = true,
  onToggleSidebar,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Group users by role for simple testing
  const adminUsers = allUsers.filter((u) => u.role === 'admin');
  const pimpinanUsers = allUsers.filter((u) => u.role === 'pimpinan');
  const stafUsers = allUsers.filter((u) => u.role === 'staf');

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'pimpinan':
        return 'Pimpinan / Kepala';
      case 'staf':
        return 'Staf / Bidang';
    }
  };

  const getBagianName = (bagianId?: string) => {
    if (!bagianId) return '';
    const b = bagianList.find((item) => item.id === bagianId);
    return b ? b.nama : '';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6 h-16">
        {/* Zone 1: Brand title wordmark with dedicated Sidebar toggle button */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
              aria-label={isSidebarOpen ? "Sembunyikan Sidebar" : "Tampilkan Sidebar"}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 bg-slate-50 shadow-2xs flex items-center justify-center"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5 text-slate-700" />
              ) : (
                <PanelLeft className="w-5 h-5 text-blue-600" />
              )}
            </button>
          )}

          <InstitutionLogo
            type={settings.logoType}
            customUrl={settings.customLogoUrl}
            size={36}
          />
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
              {settings.systemName}
            </span>
            <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap hidden sm:inline">
              {settings.instansiName}
            </span>
          </div>
        </div>

        {/* Zone 2: Primary Nav Links (clean, single-line links with subtle hover) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 ${
              activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : ''
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('surat-masuk')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 ${
              activeTab === 'surat-masuk' ? 'text-blue-600 border-b-2 border-blue-600' : ''
            }`}
          >
            Surat Masuk
          </button>
          <button
            onClick={() => onSelectTab('disposisi')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 ${
              activeTab === 'disposisi' ? 'text-blue-600 border-b-2 border-blue-600' : ''
            }`}
          >
            Disposisi
          </button>
          <button
            onClick={() => onSelectTab('surat-keluar')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 ${
              activeTab === 'surat-keluar' ? 'text-blue-600 border-b-2 border-blue-600' : ''
            }`}
          >
            Surat Keluar
          </button>
          <button
            onClick={() => onSelectTab('rekapitulasi')}
            className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 ${
              activeTab === 'rekapitulasi' ? 'text-blue-600 border-b-2 border-blue-600' : ''
            }`}
          >
            Rekap & Laporan
          </button>
          {activeUser.role === 'admin' && (
            <button
              onClick={() => onSelectTab('master-instansi')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap pb-1 ${
                activeTab.startsWith('master') ? 'text-blue-600 border-b-2 border-blue-600' : ''
              }`}
            >
              Master Data
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action & Role Switcher + Logout */}
        <div className="flex items-center gap-2.5 shrink-0 relative">
          {/* Public Verification Link */}
          <button
            onClick={onOpenPublicVerification}
            title="Buka halaman verifikasi sertifikat QR tanpa login"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Validasi QR</span>
          </button>

          {/* Quick Role Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <div className="text-left leading-tight hidden sm:block">
                <span className="font-semibold block truncate max-w-[130px]">
                  {activeUser.nama}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {getRoleLabel(activeUser.role)}
                  {activeUser.role === 'staf' && activeUser.bagianId ? ` (${getBagianName(activeUser.bagianId).split(' ')[1] || 'Staf'})` : ''}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in duration-100">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">Simulasi Ganti Hak Akses (Role):</p>
                  <p className="text-[11px] text-slate-500">Pilih akun untuk menguji fungsionalitas sistem sesuai wewenang.</p>
                </div>

                {/* Admin Group */}
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400">
                  1. Administrator
                </div>
                {adminUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${
                      activeUser.id === u.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{u.nama}</p>
                      <p className="text-[10px] text-slate-500">{u.jabatan}</p>
                    </div>
                    {activeUser.id === u.id && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}

                {/* Pimpinan Group */}
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-t border-slate-100 mt-1">
                  2. Pimpinan (Kepala Instansi)
                </div>
                {pimpinanUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${
                      activeUser.id === u.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{u.nama}</p>
                      <p className="text-[10px] text-slate-500">{u.jabatan}</p>
                    </div>
                    {activeUser.id === u.id && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}

                {/* Staf / Bidang Group */}
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-t border-slate-100 mt-1">
                  3. Staf / Bidang (Wakasek / Unit Kerja)
                </div>
                {stafUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${
                      activeUser.id === u.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{u.nama}</p>
                      <p className="text-[10px] text-slate-500">{getBagianName(u.bagianId) || u.jabatan}</p>
                    </div>
                    {activeUser.id === u.id && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onOpenProfile();
                    }}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kelola Profil & Ubah Password</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span>Keluar dari Akun (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary Logout Button in Navbar */}
          <button
            onClick={onLogout}
            title="Keluar dari akun (Logout)"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
