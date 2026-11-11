import React, { useState } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  QrCode, 
  Save, 
  RotateCcw, 
  Check, 
  ExternalLink, 
  Copy, 
  RefreshCw, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sliders,
  Calendar,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { AppSettings, SuratKeluar, UserAccount, ValidationTokenConfig } from '../../types';
import { StorageService } from '../../services/storageService';
import { QrCodeGenerator } from '../common/QrCodeGenerator';

interface PengaturanTokenValidasiProps {
  tokenConfig: ValidationTokenConfig;
  onSaveTokenConfig: (newConfig: ValidationTokenConfig) => void;
  suratKeluarList: SuratKeluar[];
  onUpdateSuratKeluarList: (list: SuratKeluar[]) => void;
  settings: AppSettings;
  activeUser: UserAccount;
  onOpenPublicVerify: (token: string) => void;
}

export const PengaturanTokenValidasi: React.FC<PengaturanTokenValidasiProps> = ({
  tokenConfig,
  onSaveTokenConfig,
  suratKeluarList,
  onUpdateSuratKeluarList,
  settings,
  activeUser,
  onOpenPublicVerify,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'config' | 'monitoring' | 'test'>('config');
  const [formData, setFormData] = useState<ValidationTokenConfig>(tokenConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Search & Filter for monitoring
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Aktif' | 'Dicabut'>('all');

  // Test scanner simulator
  const [testTokenInput, setTestTokenInput] = useState('');
  const [testResult, setTestResult] = useState<{
    found: boolean;
    surat?: SuratKeluar;
    isRevoked?: boolean;
    tokenString: string;
  } | null>(null);

  // Live generator preview
  const [previewSampleToken, setPreviewSampleToken] = useState<string>(() => 
    StorageService.generateValidationToken(tokenConfig)
  );

  const handleRefreshSample = () => {
    setPreviewSampleToken(StorageService.generateValidationToken(formData));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ValidationTokenConfig = {
      ...formData,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedBy: activeUser.nama,
    };
    onSaveTokenConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefault = () => {
    const defaultConf: ValidationTokenConfig = {
      prefix: 'CERT-SMAN1',
      pattern: 'PREFIX_YEAR_RANDOM',
      charType: 'hex',
      randomLength: 12,
      validityDurationYears: 0,
      includeOfficialNumberInQr: true,
      verificationDisclaimer:
        'Dokumen ini telah ditandatangani secara elektronik menggunakan sertifikat digital resmi instansi dan tercatat sah dalam pangkalan data arsip digital.',
      enablePublicVerification: true,
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updatedBy: activeUser.nama,
    };
    setFormData(defaultConf);
    onSaveTokenConfig(defaultConf);
    setPreviewSampleToken(StorageService.generateValidationToken(defaultConf));
  };

  // Toggle token active/revoked
  const handleToggleTokenStatus = (suratId: string, currentStatus?: 'Aktif' | 'Dicabut') => {
    const newStatus: 'Aktif' | 'Dicabut' = currentStatus === 'Dicabut' ? 'Aktif' : 'Dicabut';
    const updatedList = suratKeluarList.map((s) =>
      s.id === suratId ? { ...s, tokenStatus: newStatus } : s
    );
    onUpdateSuratKeluarList(updatedList);
    StorageService.saveSuratKeluarList(updatedList);

    const surat = suratKeluarList.find((s) => s.id === suratId);
    StorageService.recordLog({
      targetId: suratId,
      targetType: 'surat_keluar',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Admin ${newStatus === 'Dicabut' ? 'Mencabut (Membatalkan)' : 'Mengaktifkan Kembali'} Token Keabsahan Digital: ${surat?.qrCodeToken}`,
    });
  };

  // Regenerate token for a specific letter
  const handleRegenerateToken = (suratId: string) => {
    const newToken = StorageService.generateValidationToken(formData);
    const updatedList = suratKeluarList.map((s) =>
      s.id === suratId ? { ...s, qrCodeToken: newToken, tokenStatus: 'Aktif' as const } : s
    );
    onUpdateSuratKeluarList(updatedList);
    StorageService.saveSuratKeluarList(updatedList);

    StorageService.recordLog({
      targetId: suratId,
      targetType: 'surat_keluar',
      userId: activeUser.id,
      userName: activeUser.nama,
      userRole: activeUser.role,
      userBagian: activeUser.jabatan,
      aktivitas: `Admin Melakukan Regenerasi Token Sertifikat Digital Menjadi: ${newToken}`,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleRunTest = (e: React.FormEvent) => {
    e.preventDefault();
    const query = testTokenInput.trim();
    if (!query) return;

    const match = suratKeluarList.find(
      (s) =>
        s.qrCodeToken &&
        (s.qrCodeToken.toLowerCase() === query.toLowerCase() ||
          (s.noSuratResmi && s.noSuratResmi.toLowerCase() === query.toLowerCase()))
    );

    if (match) {
      setTestResult({
        found: true,
        surat: match,
        isRevoked: match.tokenStatus === 'Dicabut',
        tokenString: query,
      });
    } else {
      setTestResult({
        found: false,
        tokenString: query,
      });
    }
  };

  // Letters that possess a digital token
  const tokenizedSuratList = suratKeluarList.filter((s) => !!s.qrCodeToken);
  const activeTokenCount = tokenizedSuratList.filter((s) => s.tokenStatus !== 'Dicabut').length;
  const revokedTokenCount = tokenizedSuratList.filter((s) => s.tokenStatus === 'Dicabut').length;

  const filteredSuratList = tokenizedSuratList.filter((s) => {
    const matchSearch =
      (s.noSuratResmi && s.noSuratResmi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.noDraft && s.noDraft.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.perihal && s.perihal.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.qrCodeToken && s.qrCodeToken.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.penandatanganNama && s.penandatanganNama.toLowerCase().includes(searchQuery.toLowerCase()));

    const status = s.tokenStatus || 'Aktif';
    const matchStatus = statusFilter === 'all' || status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <KeyRound className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Pengaturan Token Validasi & Keabsahan Digital
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Konfigurasi format algoritma token verifikasi, kelola sertifikat QR Code tanda tangan digital, serta monitoring keabsahan dokumen keluar.
          </p>
        </div>

        {/* Global Public Service Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-2xs self-start sm:self-auto">
          <span className={`w-2.5 h-2.5 rounded-full ${formData.enablePublicVerification ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
          <span className="text-xs font-semibold text-slate-700">
            Layanan Verifikasi: {formData.enablePublicVerification ? 'Aktif (Online)' : 'Dinonaktifkan'}
          </span>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Total Token Beredar</span>
          <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{tokenizedSuratList.length}</span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Surat ditandatangani</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-600 block">Token Sah & Aktif</span>
          <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">{activeTokenCount}</span>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">Lolos validasi publik</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-rose-600 block">Token Dicabut</span>
          <span className="text-xl font-extrabold text-rose-700 mt-0.5 block">{revokedTokenCount}</span>
          <span className="text-[10px] text-rose-600/80 mt-0.5 block">Surat dibatalkan / revisi</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[11px] font-medium text-blue-600 block">Format Pola Aktif</span>
          <span className="text-xs font-mono font-bold text-blue-700 truncate mt-1 block">
            {formData.prefix}-{formData.randomLength}ch
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Algoritma generator</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-slate-100/70 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveSubTab('config')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'config'
              ? 'bg-white text-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Parameter Format & Keamanan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('monitoring')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'monitoring'
              ? 'bg-white text-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Monitoring & Manajemen Token Beredar ({tokenizedSuratList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('test')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'test'
              ? 'bg-white text-blue-600 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Uji Coba Verifikasi Token</span>
        </button>
      </div>

      {/* TAB 1: PARAMETER & FORMAT CONFIGURATION */}
      {activeSubTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6 text-xs">
          {savedSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in duration-100">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Pengaturan format token validasi berhasil diperbarui dan diterapkan ke seluruh modul tanda tangan digital!</span>
            </div>
          )}

          {/* Section 1: Algoritma Format Token */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>1. Algoritma Pola & Struktur Token Digital</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Prefix Kode Token (Awalan Sertifikat): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.prefix}
                  onChange={(e) => {
                    const newForm = { ...formData, prefix: e.target.value.toUpperCase() };
                    setFormData(newForm);
                    setPreviewSampleToken(StorageService.generateValidationToken(newForm));
                  }}
                  required
                  placeholder="Misal: CERT-SMAN1, TTD-DINAS"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Identitas instansi pada awal string token tanda tangan digital.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pola Format Token:
                </label>
                <select
                  value={formData.pattern}
                  onChange={(e) => {
                    const newForm = { 
                      ...formData, 
                      pattern: e.target.value as ValidationTokenConfig['pattern'] 
                    };
                    setFormData(newForm);
                    setPreviewSampleToken(StorageService.generateValidationToken(newForm));
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                >
                  <option value="PREFIX_YEAR_RANDOM">[PREFIX]-[TAHUN]-[RANDOM] (Rekomendasi Standar)</option>
                  <option value="PREFIX_MONTHYEAR_RANDOM">[PREFIX]-[BULAN_TAHUN]-[RANDOM]</option>
                  <option value="PREFIX_RANDOM">[PREFIX]-[RANDOM] (Format Ringkas)</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Menentukan susunan tanggal/tahun dalam rangkaian kode sertifikat.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Panjang Karakter Acak Unik (Hash Random):
                </label>
                <select
                  value={formData.randomLength}
                  onChange={(e) => {
                    const newForm = { ...formData, randomLength: parseInt(e.target.value) };
                    setFormData(newForm);
                    setPreviewSampleToken(StorageService.generateValidationToken(newForm));
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                >
                  <option value={8}>8 Karakter (Kompak)</option>
                  <option value={10}>10 Karakter (Sedang)</option>
                  <option value={12}>12 Karakter (Standar Disarankan)</option>
                  <option value={16}>16 Karakter (Kriptografi Tinggi)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kumpulan Karakter (CharSet):
                </label>
                <select
                  value={formData.charType}
                  onChange={(e) => {
                    const newForm = { 
                      ...formData, 
                      charType: e.target.value as ValidationTokenConfig['charType'] 
                    };
                    setFormData(newForm);
                    setPreviewSampleToken(StorageService.generateValidationToken(newForm));
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                >
                  <option value="hex">Hexadecimal (0-9, A-F) — Standar Hash Sertifikat</option>
                  <option value="alphanumeric">Alfanumerik (0-9, A-Z) — Huruf & Angka</option>
                  <option value="numeric">Angka Murni (0-9)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Kebijakan Masa Berlaku & Keabsahan Publik */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2. Kebijakan Masa Berlaku & Teks Keabsahan Publik</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Masa Berlaku Token Sertifikat:
                </label>
                <select
                  value={formData.validityDurationYears}
                  onChange={(e) => setFormData({ ...formData, validityDurationYears: parseInt(e.target.value) })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                >
                  <option value={0}>Berlaku Selamanya (Arsip Permanen)</option>
                  <option value={1}>1 Tahun sejak Tanggal Penandatanganan</option>
                  <option value={2}>2 Tahun sejak Tanggal Penandatanganan</option>
                  <option value={3}>3 Tahun sejak Tanggal Penandatanganan</option>
                  <option value={5}>5 Tahun sejak Tanggal Penandatanganan</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Dokumen melewati masa berlaku akan ditandai kedaluwarsa pada halaman publik.
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Akses Halaman Verifikasi Publik:
                </label>
                <div className="flex items-center gap-3 p-2.5 border border-slate-300 rounded-lg bg-slate-50">
                  <input
                    type="checkbox"
                    id="enablePublicVerification"
                    checked={formData.enablePublicVerification}
                    onChange={(e) => setFormData({ ...formData, enablePublicVerification: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <label htmlFor="enablePublicVerification" className="text-xs font-semibold text-slate-800 cursor-pointer">
                    Izinkan pemindaian QR Code & pencarian validasi tanpa login
                  </label>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Jika dinonaktifkan, halaman verifikasi publik tidak dapat diakses umum.
                </span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold text-slate-700 mb-1">
                Pernyataan Resmi Keabsahan Dokumen (Disclaimer Tampil di Hasil Scan):
              </label>
              <textarea
                rows={3}
                value={formData.verificationDisclaimer}
                onChange={(e) => setFormData({ ...formData, verificationDisclaimer: e.target.value })}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg font-normal text-slate-800 leading-relaxed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Teks ini dicantumkan sebagai pengesahan resmi saat publik memverifikasi keaslian surat melalui QR Code.
              </span>
            </div>
          </div>

          {/* Section 3: Live Simulator & Preview Generator */}
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>3. Pratinjau Langsung Generator Token & QR Code</span>
              </h2>
              <button
                type="button"
                onClick={handleRefreshSample}
                className="text-blue-600 hover:text-blue-700 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Simulasi Generate Ulang</span>
              </button>
            </div>

            <div className="mt-4 p-4 bg-slate-900 text-white rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 flex-1 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Contoh String Token Validasi Baru:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(previewSampleToken)}
                    className="text-xs text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedToken === previewSampleToken ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Token</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-sm font-bold text-amber-400 tracking-wider break-all select-all">
                  {previewSampleToken}
                </div>
                <p className="text-[11px] text-slate-400">
                  Token di atas adalah format persis yang akan otomatis digenerate saat Pimpinan menyetujui surat keluar berikutnya.
                </p>
              </div>

              {/* QR Preview */}
              <div className="flex flex-col items-center bg-white p-3 rounded-lg text-slate-900 shadow-md shrink-0">
                <QrCodeGenerator value={previewSampleToken} size={90} />
                <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">QR Code Validasi</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button
              type="button"
              onClick={handleResetDefault}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset ke Parameter Default</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Parameter Token Validasi</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: MONITORING & MANAJEMEN TOKEN BEREDAR */}
      {activeSubTab === 'monitoring' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan token, nomor surat, perihal, atau penandatangan..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="font-semibold text-slate-600 whitespace-nowrap">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Aktif' | 'Dicabut')}
                className="p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
              >
                <option value="all">Semua Status ({tokenizedSuratList.length})</option>
                <option value="Aktif">Aktif Saja ({activeTokenCount})</option>
                <option value="Dicabut">Dicabut / Dibatalkan ({revokedTokenCount})</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3 w-10 text-center">No</th>
                    <th className="p-3">Surat Keluar & Perihal</th>
                    <th className="p-3">Penandatangan & Tgl TTD</th>
                    <th className="p-3">Token Sertifikat Digital</th>
                    <th className="p-3 text-center">Status Keabsahan</th>
                    <th className="p-3 text-right">Aksi Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSuratList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                        Tidak ada data token validasi yang sesuai dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredSuratList.map((surat, idx) => {
                      const isRevoked = surat.tokenStatus === 'Dicabut';
                      return (
                        <tr key={surat.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">
                              {surat.noSuratResmi || surat.noDraft}
                            </span>
                            <span className="text-slate-600 line-clamp-1 mt-0.5" title={surat.perihal}>
                              {surat.perihal}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Tujuan: {surat.tujuanPenerima}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800 block">
                              {surat.penandatanganNama}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono block">
                              {surat.tglTandaTangan || surat.tglSurat}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                                {surat.qrCodeToken}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleCopy(surat.qrCodeToken!)}
                                title="Salin Token"
                                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                              >
                                {copiedToken === surat.qrCodeToken ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {isRevoked ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                Dicabut
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Aktif & Sah
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Open in Public Verify */}
                              <button
                                type="button"
                                onClick={() => onOpenPublicVerify(surat.qrCodeToken!)}
                                title="Uji Tampilan Verifikasi Publik"
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold text-[11px]"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Verifikasi</span>
                              </button>

                              {/* Toggle Revocation */}
                              <button
                                type="button"
                                onClick={() => handleToggleTokenStatus(surat.id, surat.tokenStatus)}
                                title={isRevoked ? "Aktifkan Kembali Token Ini" : "Cabut / Batalkan Keabsahan Token Ini"}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-semibold text-[11px] ${
                                  isRevoked
                                    ? 'text-emerald-700 hover:bg-emerald-50 bg-emerald-50/50'
                                    : 'text-rose-700 hover:bg-rose-50 bg-rose-50/50'
                                }`}
                              >
                                {isRevoked ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Pulihkan</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Cabut</span>
                                  </>
                                )}
                              </button>

                              {/* Regenerate Token */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Perbarui/generate token baru untuk surat: ${surat.noSuratResmi || surat.noDraft}?`)) {
                                    handleRegenerateToken(surat.id);
                                  }
                                }}
                                title="Regenerasi Token Baru"
                                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UJI COBA & SIMULASI VERIFIKASI TOKEN */}
      {activeSubTab === 'test' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6 text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Simulasi Pengujian Token Validasi (Admin Test Scanner)</span>
            </h2>
            <p className="text-slate-500 mt-1">
              Uji langsung keabsahan token yang tercantum pada dokumen fisik atau nomor surat resmi untuk memastikan respon verifikasi publik bekerja tepat.
            </p>
          </div>

          <form onSubmit={handleRunTest} className="flex gap-2">
            <input
              type="text"
              value={testTokenInput}
              onChange={(e) => setTestTokenInput(e.target.value)}
              placeholder="Ketik atau paste token (misal: CERT-SMAN1-2026-...) atau Nomor Surat Resmi..."
              className="flex-1 p-2.5 border border-slate-300 rounded-lg text-slate-900 font-mono"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-2xs cursor-pointer"
            >
              Uji Validitas
            </button>
          </form>

          {/* Quick presets from current records */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold">Coba Token Beredar:</span>
            {tokenizedSuratList.slice(0, 3).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setTestTokenInput(s.qrCodeToken!);
                  setTestResult({
                    found: true,
                    surat: s,
                    isRevoked: s.tokenStatus === 'Dicabut',
                    tokenString: s.qrCodeToken!,
                  });
                }}
                className="text-[10px] font-mono px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded transition-colors cursor-pointer"
              >
                {s.qrCodeToken}
              </button>
            ))}
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className={`p-4 rounded-xl border ${
              !testResult.found
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : testResult.isRevoked
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className="flex items-start gap-3">
                {!testResult.found ? (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                ) : testResult.isRevoked ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1 flex-1">
                  <h3 className="font-bold text-sm">
                    {!testResult.found
                      ? 'Token Tidak Ditemukan (Palsu / Tidak Terdaftar)'
                      : testResult.isRevoked
                      ? 'Token Dibatalkan / Dicabut Oleh Admin'
                      : 'Token Valid & Sah Secara Resmi'}
                  </h3>

                  <p className="text-xs leading-relaxed opacity-90">
                    {!testResult.found
                      ? `String token "${testResult.tokenString}" tidak tercatat dalam basis data arsip surat instansi.`
                      : testResult.isRevoked
                      ? `Token "${testResult.tokenString}" pernah diterbitkan namun telah DICABUT/DINONAKTIFKAN oleh administrator.`
                      : `Token "${testResult.tokenString}" valid dan sesuai dengan surat resmi tercatat.`}
                  </p>

                  {testResult.surat && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-semibold block">Nomor Surat Resmi:</span>
                        <span className="font-mono">{testResult.surat.noSuratResmi || testResult.surat.noDraft}</span>
                      </div>
                      <div>
                        <span className="font-semibold block">Perihal:</span>
                        <span>{testResult.surat.perihal}</span>
                      </div>
                      <div>
                        <span className="font-semibold block">Penandatangan:</span>
                        <span>{testResult.surat.penandatanganNama} ({testResult.surat.penandatanganJabatan})</span>
                      </div>
                      <div>
                        <span className="font-semibold block">Tanggal TTD:</span>
                        <span>{testResult.surat.tglTandaTangan || testResult.surat.tglSurat}</span>
                      </div>
                    </div>
                  )}

                  {testResult.surat && (
                    <div className="mt-3 pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenPublicVerify(testResult.surat!.qrCodeToken!)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Buka Halaman Verifikasi Publik Lengkap</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
