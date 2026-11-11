/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { 
  AppSettings, 
  Bagian, 
  JenisSurat, 
  Pegawai, 
  UserAccount, 
  SuratMasuk, 
  Disposisi, 
  SuratKeluar, 
  LogAkses,
  ValidationTokenConfig
} from './types';
import { StorageService } from './services/storageService';

// Layout & Common
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DocumentViewerModal } from './components/common/DocumentViewerModal';
import { LogAksesModal } from './components/common/LogAksesModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { PublicVerification } from './components/public/PublicVerification';
import { LoginPage } from './components/auth/LoginPage';

// Dashboards
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { PimpinanDashboard } from './components/dashboard/PimpinanDashboard';
import { StafDashboard } from './components/dashboard/StafDashboard';

// Surat Masuk
import { SuratMasukList } from './components/surat-masuk/SuratMasukList';
import { SuratMasukFormModal } from './components/surat-masuk/SuratMasukFormModal';

// Disposisi
import { DisposisiFormModal } from './components/disposisi/DisposisiFormModal';
import { MonitoringDisposisi } from './components/disposisi/MonitoringDisposisi';
import { LembarDisposisiPrint } from './components/disposisi/LembarDisposisiPrint';
import { UpdateTindakLanjutModal } from './components/disposisi/UpdateTindakLanjutModal';

// Surat Keluar
import { SuratKeluarList } from './components/surat-keluar/SuratKeluarList';
import { SuratKeluarFormModal } from './components/surat-keluar/SuratKeluarFormModal';
import { PersetujuanModal } from './components/surat-keluar/PersetujuanModal';
import { RilisModal } from './components/surat-keluar/RilisModal';

// Laporan
import { LaporanRekap } from './components/laporan/LaporanRekap';

// Master Data
import { MasterAplikasi } from './components/master/MasterAplikasi';
import { MasterBagian } from './components/master/MasterBagian';
import { MasterJenisSurat } from './components/master/MasterJenisSurat';
import { MasterPegawai } from './components/master/MasterPegawai';
import { PengaturanPimpinan } from './components/master/PengaturanPimpinan';
import { PengaturanLoginStaf } from './components/master/PengaturanLoginStaf';
import { PengaturanTokenValidasi } from './components/master/PengaturanTokenValidasi';

export default function App() {
  // Master states loaded from LocalStorage
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [activeUser, setActiveUser] = useState<UserAccount>(() => StorageService.getActiveUser());
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => StorageService.getUserAccounts());
  const [bagianList, setBagianList] = useState<Bagian[]>(() => StorageService.getBagianList());
  const [jenisSuratList, setJenisSuratList] = useState<JenisSurat[]>(() => StorageService.getJenisSuratList());
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>(() => StorageService.getPegawaiList());
  const [suratMasukList, setSuratMasukList] = useState<SuratMasuk[]>(() => StorageService.getSuratMasukList());
  const [disposisiList, setDisposisiList] = useState<Disposisi[]>(() => StorageService.getDisposisiList());
  const [suratKeluarList, setSuratKeluarList] = useState<SuratKeluar[]>(() => StorageService.getSuratKeluarList());
  const [tokenConfig, setTokenConfig] = useState<ValidationTokenConfig>(() => StorageService.getTokenConfig());
  const [logsList, setLogsList] = useState<LogAkses[]>(() => StorageService.getLogs());

  // Authentication & Session
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => StorageService.isLoggedIn());
  const [loggedOutMessage, setLoggedOutMessage] = useState<string | null>(null);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [publicVerifyMode, setPublicVerifyMode] = useState<boolean>(false);
  const [verifyTokenQuery, setVerifyTokenQuery] = useState<string>('');

  // Modals state
  const [selectedDocForViewer, setSelectedDocForViewer] = useState<{
    doc: SuratMasuk | SuratKeluar;
    type: 'masuk' | 'keluar';
  } | null>(null);

  const [selectedSuratForDisposisi, setSelectedSuratForDisposisi] = useState<SuratMasuk | null>(null);
  const [selectedDisposisiForPrint, setSelectedDisposisiForPrint] = useState<{
    disposisi: Disposisi;
    surat?: SuratMasuk;
  } | null>(null);

  const [selectedDisposisiForTindakLanjut, setSelectedDisposisiForTindakLanjut] = useState<Disposisi | null>(null);
  const [selectedDraftForApproval, setSelectedDraftForApproval] = useState<SuratKeluar | null>(null);
  const [selectedDraftForRelease, setSelectedDraftForRelease] = useState<SuratKeluar | null>(null);
  const [selectedLogsTarget, setSelectedLogsTarget] = useState<{
    logs: LogAkses[];
    title: string;
    subtitle?: string;
  } | null>(null);

  const [isInputSuratMasukOpen, setIsInputSuratMasukOpen] = useState(false);
  const [isInputDraftKeluarOpen, setIsInputDraftKeluarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Check URL search parameters on mount (e.g., ?verify=TOKEN, ?doc=ID, ?file=NAME)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verify');
    if (token) {
      setVerifyTokenQuery(token);
      setPublicVerifyMode(true);
      return;
    }

    const docId = params.get('doc');
    const fileNameQuery = params.get('file') || params.get('viewFile');

    if (docId) {
      const matchMasuk = suratMasukList.find((s) => s.id === docId);
      if (matchMasuk) {
        setSelectedDocForViewer({ doc: matchMasuk, type: 'masuk' });
        return;
      }
      const matchKeluar = suratKeluarList.find((s) => s.id === docId);
      if (matchKeluar) {
        setSelectedDocForViewer({ doc: matchKeluar, type: 'keluar' });
        return;
      }
    }

    if (fileNameQuery) {
      const decoded = decodeURIComponent(fileNameQuery).toLowerCase();
      const matchMasuk = suratMasukList.find((s) => s.fileName.toLowerCase() === decoded);
      if (matchMasuk) {
        setSelectedDocForViewer({ doc: matchMasuk, type: 'masuk' });
        return;
      }
      const matchKeluar = suratKeluarList.find((s) => s.fileName.toLowerCase() === decoded);
      if (matchKeluar) {
        setSelectedDocForViewer({ doc: matchKeluar, type: 'keluar' });
        return;
      }
    }
  }, [suratMasukList, suratKeluarList]);

  // Sync title and favicon dynamically whenever settings update!
  useEffect(() => {
    document.title = `${settings.systemName} - ${settings.instansiName}`;
  }, [settings]);

  // Current Pimpinan details
  const pimpinanPegawai = pegawaiList.find((p) => p.isPimpinan) || pegawaiList[0];
  const pimpinanNama = pimpinanPegawai
    ? `${pimpinanPegawai.gelarDepan ? pimpinanPegawai.gelarDepan + ' ' : ''}${pimpinanPegawai.nama}${pimpinanPegawai.gelarBelakang ? ', ' + pimpinanPegawai.gelarBelakang : ''}`
    : 'Dr. H. Bambang Sudarsono, M.Pd';
  const pimpinanJabatan = pimpinanPegawai ? pimpinanPegawai.jabatan : 'Kepala Sekolah';
  const pimpinanNip = pimpinanPegawai ? pimpinanPegawai.nip : '19740512 199903 1 004';

  // State saving handlers
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
    StorageService.recordLog({
      targetId: 'settings',
      targetType: 'surat_masuk',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      aktivitas: `Update Pengaturan Master Aplikasi & Identitas Instansi: ${newSettings.systemName}`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleSaveTokenConfig = (newConfig: ValidationTokenConfig) => {
    setTokenConfig(newConfig);
    StorageService.saveTokenConfig(newConfig);
    StorageService.recordLog({
      targetId: 'token_config',
      targetType: 'surat_keluar',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Admin Memperbarui Parameter Token Validasi Digital (Prefix: ${newConfig.prefix}, Pola: ${newConfig.pattern}, Panjang: ${newConfig.randomLength}ch)`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleResetDefault = () => {
    StorageService.resetAllData();
    window.location.reload();
  };

  const handleSwitchUser = (user: UserAccount) => {
    setActiveUser(user);
    StorageService.setActiveUser(user);
    // Route to dashboard on switch
    setActiveTab('dashboard');
  };

  const handleLogin = (user: UserAccount) => {
    setActiveUser(user);
    StorageService.setActiveUser(user);
    setIsAuthenticated(true);
    StorageService.setLoggedIn(true);
    setLoggedOutMessage(null);
    setActiveTab('dashboard');

    StorageService.recordLog({
      targetId: user.id,
      targetType: 'surat_masuk',
      userId: user.id,
      userName: user.nama,
      userRole: user.role,
      userBagian: user.jabatan,
      aktivitas: `Login berhasil ke dalam sistem (${user.role.toUpperCase()})`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleLogout = () => {
    StorageService.recordLog({
      targetId: activeUser.id,
      targetType: 'surat_masuk',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Pengguna melakukan Logout dari sistem persuratan`,
    });
    setLogsList(StorageService.getLogs());

    setIsAuthenticated(false);
    StorageService.setLoggedIn(false);
    setLoggedOutMessage(`Anda telah berhasil keluar dari akun ${activeUser.nama}.`);
    setIsProfileOpen(false);
  };

  // Surat Masuk Handlers
  const handleSaveSuratMasuk = (data: Omit<SuratMasuk, 'id' | 'createdAt'>) => {
    const newId = `sm-${Date.now()}`;
    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);
    const newSurat: SuratMasuk = {
      ...data,
      id: newId,
      createdAt,
    };
    const updated = [newSurat, ...suratMasukList];
    setSuratMasukList(updated);
    StorageService.saveSuratMasukList(updated);

    StorageService.recordLog({
      targetId: newId,
      targetType: 'surat_masuk',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Input Surat Masuk (Agenda: ${data.noAgenda}, Dari: ${data.pengirim})`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleDeleteSuratMasuk = (id: string) => {
    const updated = suratMasukList.filter((s) => s.id !== id);
    setSuratMasukList(updated);
    StorageService.saveSuratMasukList(updated);
  };

  // Disposisi Handlers
  const handleSaveDisposisi = (data: Omit<Disposisi, 'id' | 'createdAt'>) => {
    const newId = `dsp-${Date.now()}`;
    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);
    const newDisposisi: Disposisi = {
      ...data,
      id: newId,
      createdAt,
    };
    const updatedDisposisi = [newDisposisi, ...disposisiList];
    setDisposisiList(updatedDisposisi);
    StorageService.saveDisposisiList(updatedDisposisi);

    // Update Surat Masuk statusDisposisi
    const updatedSuratMasuk = suratMasukList.map((s) =>
      s.id === data.suratMasukId ? { ...s, statusDisposisi: 'Sudah Didisposisi' as const } : s
    );
    setSuratMasukList(updatedSuratMasuk);
    StorageService.saveSuratMasukList(updatedSuratMasuk);

    const targetNames = data.targets
      .map((t) => {
        const bg = bagianList.find((b) => b.id === t.bagianId);
        return bg ? bg.nama : t.bagianId;
      })
      .join(', ');

    StorageService.recordLog({
      targetId: newId,
      targetType: 'disposisi',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Penerbitan Lembar Disposisi Agenda ${data.noAgenda} kepada: ${targetNames}`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleDeleteDisposisi = (id: string) => {
    const dsp = disposisiList.find((d) => d.id === id);
    const updated = disposisiList.filter((d) => d.id !== id);
    setDisposisiList(updated);
    StorageService.saveDisposisiList(updated);

    if (dsp) {
      // Revert Surat Masuk statusDisposisi
      const updatedSuratMasuk = suratMasukList.map((s) =>
        s.id === dsp.suratMasukId ? { ...s, statusDisposisi: 'Belum Didisposisi' as const } : s
      );
      setSuratMasukList(updatedSuratMasuk);
      StorageService.saveSuratMasukList(updatedSuratMasuk);
    }
  };

  const handleSaveTindakLanjut = (
    disposisiId: string,
    status: 'Belum Diproses' | 'Dalam Proses' | 'Selesai',
    catatan: string
  ) => {
    const now = new Date();
    const tglTindakLanjut = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    const currentBagianId = activeUser.bagianId;

    const updated = disposisiList.map((dsp) => {
      if (dsp.id !== disposisiId) return dsp;

      const updatedTargets = dsp.targets.map((tgt) => {
        if (tgt.bagianId === currentBagianId) {
          return {
            ...tgt,
            statusTindakLanjut: status,
            catatanTindakLanjut: catatan,
            tglTindakLanjut,
            petugasTindakLanjut: activeUser.nama,
          };
        }
        return tgt;
      });

      return {
        ...dsp,
        targets: updatedTargets,
      };
    });

    setDisposisiList(updated);
    StorageService.saveDisposisiList(updated);

    const dsp = disposisiList.find((d) => d.id === disposisiId);
    StorageService.recordLog({
      targetId: disposisiId,
      targetType: 'disposisi',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Update Tindak Lanjut Disposisi (${status}): "${catatan.slice(0, 50)}..."`,
    });
    setLogsList(StorageService.getLogs());
  };

  // Surat Keluar Handlers
  const handleSaveDraftKeluar = (data: Omit<SuratKeluar, 'id' | 'createdAt'>) => {
    const newId = `sk-${Date.now()}`;
    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').substring(0, 19);
    const newSurat: SuratKeluar = {
      ...data,
      id: newId,
      createdAt,
    };
    const updated = [newSurat, ...suratKeluarList];
    setSuratKeluarList(updated);
    StorageService.saveSuratKeluarList(updated);

    StorageService.recordLog({
      targetId: newId,
      targetType: 'surat_keluar',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Input Draft Surat Keluar (${data.noDraft}: ${data.perihal.slice(0, 45)})`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleApproveDraft = (
    id: string,
    token: string,
    tglTtd: string,
    catatan: string
  ) => {
    const updated = suratKeluarList.map((s) =>
      s.id === id
        ? {
            ...s,
            status: 'Disetujui' as const,
            qrCodeToken: token,
            tglTandaTangan: tglTtd,
            catatanPimpinan: catatan,
          }
        : s
    );
    setSuratKeluarList(updated);
    StorageService.saveSuratKeluarList(updated);

    const surat = suratKeluarList.find((s) => s.id === id);
    StorageService.recordLog({
      targetId: id,
      targetType: 'surat_keluar',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Pimpinan Menyetujui & Membubuhkan Tanda Tangan Digital QR (Token: ${token})`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleRejectDraft = (id: string, catatanRevisi: string) => {
    const updated = suratKeluarList.map((s) =>
      s.id === id
        ? {
            ...s,
            status: 'Revisi' as const,
            catatanPimpinan: catatanRevisi,
          }
        : s
    );
    setSuratKeluarList(updated);
    StorageService.saveSuratKeluarList(updated);

    StorageService.recordLog({
      targetId: id,
      targetType: 'surat_keluar',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Pimpinan Mengembalikan Draft dengan Catatan Revisi: "${catatanRevisi}"`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleReleaseSuratKeluar = (
    id: string,
    noSuratResmi: string,
    tglRilis: string
  ) => {
    const updated = suratKeluarList.map((s) =>
      s.id === id
        ? {
            ...s,
            status: 'Rilis' as const,
            noSuratResmi,
            tglRilis,
          }
        : s
    );
    setSuratKeluarList(updated);
    StorageService.saveSuratKeluarList(updated);

    StorageService.recordLog({
      targetId: id,
      targetType: 'surat_keluar',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Admin Merilis Surat Keluar Resmi Nomor: ${noSuratResmi}`,
    });
    setLogsList(StorageService.getLogs());
  };

  const handleDeleteSuratKeluar = (id: string) => {
    const updated = suratKeluarList.filter((s) => s.id !== id);
    setSuratKeluarList(updated);
    StorageService.saveSuratKeluarList(updated);
  };

  // Open Document and log access
  const handleViewDocument = (doc: SuratMasuk | SuratKeluar, type: 'masuk' | 'keluar') => {
    setSelectedDocForViewer({ doc, type });
    StorageService.recordLog({
      targetId: doc.id,
      targetType: type === 'masuk' ? 'surat_masuk' : 'surat_keluar',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Membuka dan membaca berkas digital (${doc.fileName})`,
    });
    setLogsList(StorageService.getLogs());
  };

  // Open Logs Modal
  const handleOpenLogs = (target: SuratMasuk | SuratKeluar) => {
    const filtered = logsList.filter((l) => l.targetId === target.id);
    setSelectedLogsTarget({
      logs: filtered,
      title: 'Riwayat Audit Trail Log Akses Dokumen',
      subtitle: (target as SuratMasuk).noAgenda || (target as SuratKeluar).noDraft,
    });
  };

  // Open Print Lembar Disposisi and log
  const handlePrintLembarDisposisi = (disposisi: Disposisi, surat?: SuratMasuk) => {
    setSelectedDisposisiForPrint({ disposisi, surat });
    StorageService.recordLog({
      targetId: disposisi.id,
      targetType: 'disposisi',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Mencetak / Mengunduh Lembar Disposisi Resmi Agenda ${disposisi.noAgenda}`,
    });
    setLogsList(StorageService.getLogs());
  };

  // IF PUBLIC VERIFY MODE IS ACTIVE (Zero-login verification page)
  if (publicVerifyMode) {
    return (
      <PublicVerification
        initialToken={verifyTokenQuery}
        suratKeluarList={suratKeluarList}
        settings={settings}
        onBackToApp={() => {
          setPublicVerifyMode(false);
          setVerifyTokenQuery('');
        }}
      />
    );
  }

  // IF NOT AUTHENTICATED -> RENDER PROFESSIONAL LOGIN PAGE
  if (!isAuthenticated) {
    return (
      <LoginPage
        settings={settings}
        allUsers={allUsers}
        onLogin={handleLogin}
        onOpenPublicVerification={() => setPublicVerifyMode(true)}
        loggedOutMessage={loggedOutMessage}
      />
    );
  }

  // Next agenda & draft number suggestions
  const nextAgendaNumber = `AG-${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(suratMasukList.length + 1).toString().padStart(3, '0')}`;
  const nextDraftNumber = `DFT-${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(suratKeluarList.length + 1).toString().padStart(3, '0')}`;
  const nextOfficialNumber = `421.3/${(suratKeluarList.filter((s) => s.status === 'Rilis').length + 51).toString().padStart(3, '0')}/SMAN1/III/${new Date().getFullYear()}`;

  // Count pending for badges
  const pendingDisposisiCount = suratMasukList.filter(
    (s) => s.statusSurat === 'Diteruskan' && s.statusDisposisi === 'Belum Didisposisi'
  ).length;

  const pendingDraftCount = suratKeluarList.filter(
    (s) => s.status === 'Draft' || s.status === 'Menunggu TTD'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar Contract */}
      <Navbar
        settings={settings}
        activeUser={activeUser}
        allUsers={allUsers}
        bagianList={bagianList}
        onSwitchUser={handleSwitchUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPublicVerification={() => setPublicVerifyMode(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout: Sidebar (240px) + Viewport Canvas */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          role={activeUser.role}
          activeUser={activeUser}
          bagianList={bagianList}
          settings={settings}
          pendingDisposisiCount={pendingDisposisiCount}
          pendingDraftCount={pendingDraftCount}
          onLogout={handleLogout}
          isOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 min-w-0">
          {/* TAB 1: Dashboard (Role Specific) */}
          {activeTab === 'dashboard' && (
            <>
              {activeUser.role === 'admin' && (
                <AdminDashboard
                  suratMasukList={suratMasukList}
                  suratKeluarList={suratKeluarList}
                  disposisiList={disposisiList}
                  bagianList={bagianList}
                  settings={settings}
                  onNavigate={setActiveTab}
                  onViewSuratMasuk={(s) => handleViewDocument(s, 'masuk')}
                  onViewSuratKeluar={(s) => handleViewDocument(s, 'keluar')}
                  onOpenInputSuratMasuk={() => setIsInputSuratMasukOpen(true)}
                  onOpenInputDraftKeluar={() => setIsInputDraftKeluarOpen(true)}
                />
              )}

              {activeUser.role === 'pimpinan' && (
                <PimpinanDashboard
                  suratMasukList={suratMasukList}
                  suratKeluarList={suratKeluarList}
                  disposisiList={disposisiList}
                  activeUser={activeUser}
                  settings={settings}
                  onNavigate={setActiveTab}
                  onOpenDisposisiForm={(s) => setSelectedSuratForDisposisi(s)}
                  onOpenApprovalModal={(s) => setSelectedDraftForApproval(s)}
                  onViewSuratMasuk={(s) => handleViewDocument(s, 'masuk')}
                  onViewSuratKeluar={(s) => handleViewDocument(s, 'keluar')}
                />
              )}

              {activeUser.role === 'staf' && (
                <StafDashboard
                  disposisiList={disposisiList}
                  suratMasukList={suratMasukList}
                  activeUser={activeUser}
                  bagianList={bagianList}
                  settings={settings}
                  onNavigate={setActiveTab}
                  onPrintLembarDisposisi={handlePrintLembarDisposisi}
                  onViewSuratDetail={(s) => handleViewDocument(s, 'masuk')}
                  onUpdateTindakLanjut={(d) => setSelectedDisposisiForTindakLanjut(d)}
                />
              )}
            </>
          )}

          {/* TAB 2: Surat Masuk */}
          {activeTab === 'surat-masuk' && (
            <SuratMasukList
              suratMasukList={suratMasukList}
              jenisSuratList={jenisSuratList}
              disposisiList={disposisiList}
              activeUser={activeUser}
              settings={settings}
              onOpenInputModal={() => setIsInputSuratMasukOpen(true)}
              onViewDocument={(s) => handleViewDocument(s, 'masuk')}
              onOpenDisposisiForm={(s) => setSelectedSuratForDisposisi(s)}
              onViewDisposisi={(d, s) => handlePrintLembarDisposisi(d, s)}
              onOpenLogs={handleOpenLogs}
              onDeleteSurat={handleDeleteSuratMasuk}
              onExportExcel={() => StorageService.exportSuratMasukToExcel(suratMasukList, settings)}
            />
          )}

          {/* TAB 3: Disposisi */}
          {activeTab === 'disposisi' && (
            <MonitoringDisposisi
              disposisiList={disposisiList}
              suratMasukList={suratMasukList}
              bagianList={bagianList}
              activeUser={activeUser}
              settings={settings}
              onPrintLembarDisposisi={handlePrintLembarDisposisi}
              onViewSuratDetail={(s) => handleViewDocument(s, 'masuk')}
              onOpenUpdateTindakLanjut={(d) => setSelectedDisposisiForTindakLanjut(d)}
              onDeleteDisposisi={handleDeleteDisposisi}
              onExportExcel={() => StorageService.exportDisposisiToExcel(disposisiList, bagianList, settings)}
            />
          )}

          {/* TAB 4: Surat Keluar */}
          {activeTab === 'surat-keluar' && (
            <SuratKeluarList
              suratKeluarList={suratKeluarList}
              jenisSuratList={jenisSuratList}
              activeUser={activeUser}
              settings={settings}
              onOpenInputDraft={() => setIsInputDraftKeluarOpen(true)}
              onViewDocument={(s) => handleViewDocument(s, 'keluar')}
              onOpenApprovalModal={(s) => setSelectedDraftForApproval(s)}
              onOpenRilisModal={(s) => setSelectedDraftForRelease(s)}
              onOpenLogs={handleOpenLogs}
              onOpenPublicVerify={(token) => {
                setVerifyTokenQuery(token);
                setPublicVerifyMode(true);
              }}
              onDeleteSurat={handleDeleteSuratKeluar}
              onExportExcel={() => StorageService.exportSuratKeluarToExcel(suratKeluarList, settings)}
            />
          )}

          {/* TAB 5: Rekapitulasi & Laporan */}
          {activeTab === 'rekapitulasi' && (
            <LaporanRekap
              suratMasukList={suratMasukList}
              suratKeluarList={suratKeluarList}
              disposisiList={disposisiList}
              bagianList={bagianList}
              settings={settings}
              onExportSuratMasukExcel={() => StorageService.exportSuratMasukToExcel(suratMasukList, settings)}
              onExportSuratKeluarExcel={() => StorageService.exportSuratKeluarToExcel(suratKeluarList, settings)}
              onExportDisposisiExcel={() => StorageService.exportDisposisiToExcel(disposisiList, bagianList, settings)}
            />
          )}

          {/* MASTER DATA (Admin Only) */}
          {activeTab === 'master-instansi' && (
            <MasterAplikasi
              settings={settings}
              onSave={handleSaveSettings}
              onResetDefault={handleResetDefault}
            />
          )}

          {activeTab === 'master-bagian' && (
            <MasterBagian
              bagianList={bagianList}
              onSaveBagianList={(list) => {
                setBagianList(list);
                StorageService.saveBagianList(list);
              }}
            />
          )}

          {activeTab === 'master-jenis' && (
            <MasterJenisSurat
              jenisSuratList={jenisSuratList}
              onSaveJenisSuratList={(list) => {
                setJenisSuratList(list);
                StorageService.saveJenisSuratList(list);
              }}
            />
          )}

          {activeTab === 'master-pegawai' && (
            <MasterPegawai
              pegawaiList={pegawaiList}
              bagianList={bagianList}
              settings={settings}
              onSavePegawaiList={(list) => {
                setPegawaiList(list);
                StorageService.savePegawaiList(list);
              }}
            />
          )}

          {activeTab === 'master-pimpinan' && (
            <PengaturanPimpinan
              pegawaiList={pegawaiList}
              allUsers={allUsers}
              onUpdatePimpinan={(selectedPegawaiId, username, password) => {
                // Update pegawai isPimpinan
                const updatedPegawai = pegawaiList.map((p) => ({
                  ...p,
                  isPimpinan: p.id === selectedPegawaiId,
                }));
                setPegawaiList(updatedPegawai);
                StorageService.savePegawaiList(updatedPegawai);

                const chosen = pegawaiList.find((p) => p.id === selectedPegawaiId);

                // Update pimpinan user account
                const updatedUsers = allUsers.map((u) => {
                  if (u.role === 'pimpinan') {
                    return {
                      ...u,
                      username,
                      password: password || u.password,
                      pegawaiId: selectedPegawaiId,
                      nama: chosen ? `${chosen.gelarDepan ? chosen.gelarDepan + ' ' : ''}${chosen.nama}${chosen.gelarBelakang ? ', ' + chosen.gelarBelakang : ''}` : u.nama,
                      jabatan: chosen ? chosen.jabatan : u.jabatan,
                    };
                  }
                  return u;
                });
                setAllUsers(updatedUsers);
                StorageService.saveUserAccounts(updatedUsers);
              }}
            />
          )}

          {activeTab === 'master-users' && (
            <PengaturanLoginStaf
              allUsers={allUsers}
              pegawaiList={pegawaiList}
              bagianList={bagianList}
              onSaveUsers={(users) => {
                setAllUsers(users);
                StorageService.saveUserAccounts(users);
              }}
            />
          )}

          {activeTab === 'master-token' && (
            <PengaturanTokenValidasi
              tokenConfig={tokenConfig}
              onSaveTokenConfig={handleSaveTokenConfig}
              suratKeluarList={suratKeluarList}
              onUpdateSuratKeluarList={setSuratKeluarList}
              settings={settings}
              activeUser={activeUser}
              onOpenPublicVerify={(token) => {
                setVerifyTokenQuery(token);
                setPublicVerifyMode(true);
              }}
            />
          )}
        </main>
      </div>

      {/* MODAL 1: Digital Document Viewer Modal */}
      <DocumentViewerModal
        isOpen={!!selectedDocForViewer}
        onClose={() => setSelectedDocForViewer(null)}
        document={selectedDocForViewer?.doc || null}
        type={selectedDocForViewer?.type || 'masuk'}
        settings={settings}
      />

      {/* MODAL 2: Input Surat Masuk Modal */}
      <SuratMasukFormModal
        isOpen={isInputSuratMasukOpen}
        onClose={() => setIsInputSuratMasukOpen(false)}
        jenisSuratList={jenisSuratList}
        activeUser={activeUser}
        pimpinanJabatan={pimpinanJabatan}
        nextAgendaNumber={nextAgendaNumber}
        onSave={handleSaveSuratMasuk}
      />

      {/* MODAL 3: Disposisi Form Modal (Pimpinan / Admin) */}
      <DisposisiFormModal
        isOpen={!!selectedSuratForDisposisi}
        onClose={() => setSelectedSuratForDisposisi(null)}
        suratMasuk={selectedSuratForDisposisi}
        bagianList={bagianList}
        activeUser={activeUser}
        pimpinanName={pimpinanNama}
        pimpinanJabatan={pimpinanJabatan}
        onSave={handleSaveDisposisi}
      />

      {/* MODAL 4: Lembar Disposisi Printable View */}
      {selectedDisposisiForPrint && (
        <LembarDisposisiPrint
          disposisi={selectedDisposisiForPrint.disposisi}
          suratMasuk={selectedDisposisiForPrint.surat}
          bagianList={bagianList}
          settings={settings}
          onClose={() => setSelectedDisposisiForPrint(null)}
        />
      )}

      {/* MODAL 5: Update Tindak Lanjut Modal (Staf) */}
      <UpdateTindakLanjutModal
        isOpen={!!selectedDisposisiForTindakLanjut}
        onClose={() => setSelectedDisposisiForTindakLanjut(null)}
        disposisi={selectedDisposisiForTindakLanjut}
        activeUser={activeUser}
        bagianList={bagianList}
        onSave={handleSaveTindakLanjut}
      />

      {/* MODAL 6: Input Draft Surat Keluar Modal */}
      <SuratKeluarFormModal
        isOpen={isInputDraftKeluarOpen}
        onClose={() => setIsInputDraftKeluarOpen(false)}
        jenisSuratList={jenisSuratList}
        activeUser={activeUser}
        pimpinanNama={pimpinanNama}
        pimpinanJabatan={pimpinanJabatan}
        pimpinanNip={pimpinanNip}
        nextDraftNumber={nextDraftNumber}
        onSave={handleSaveDraftKeluar}
      />

      {/* MODAL 7: Persetujuan / Approval Modal (Pimpinan) */}
      <PersetujuanModal
        isOpen={!!selectedDraftForApproval}
        onClose={() => setSelectedDraftForApproval(null)}
        surat={selectedDraftForApproval}
        activeUser={activeUser}
        onApprove={handleApproveDraft}
        onReject={handleRejectDraft}
      />

      {/* MODAL 8: Rilis Modal (Admin) */}
      <RilisModal
        isOpen={!!selectedDraftForRelease}
        onClose={() => setSelectedDraftForRelease(null)}
        surat={selectedDraftForRelease}
        settings={settings}
        activeUser={activeUser}
        nextOfficialNumber={nextOfficialNumber}
        onRelease={handleReleaseSuratKeluar}
      />

      {/* MODAL 9: Log Akses Audit Trail Modal */}
      {selectedLogsTarget && (
        <LogAksesModal
          isOpen={true}
          onClose={() => setSelectedLogsTarget(null)}
          logs={selectedLogsTarget.logs}
          title={selectedLogsTarget.title}
          subtitle={selectedLogsTarget.subtitle}
        />
      )}

      {/* MODAL 10: User Profile & Security */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        activeUser={activeUser}
        settings={settings}
        onSaveProfile={(u) => {
          setActiveUser(u);
          StorageService.setActiveUser(u);
          const updated = allUsers.map((item) => (item.id === u.id ? u : item));
          setAllUsers(updated);
          StorageService.saveUserAccounts(updated);
        }}
        onLogout={handleLogout}
      />

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}
