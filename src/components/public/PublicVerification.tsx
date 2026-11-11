import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Calendar, 
  Building2, 
  FileText, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ArrowLeft,
  QrCode,
  XCircle
} from 'lucide-react';
import { AppSettings, SuratKeluar } from '../../types';
import { InstitutionLogo } from '../common/InstitutionLogo';
import { QrCodeGenerator } from '../common/QrCodeGenerator';

interface PublicVerificationProps {
  initialToken?: string;
  suratKeluarList: SuratKeluar[];
  settings: AppSettings;
  onBackToApp?: () => void;
}

export const PublicVerification: React.FC<PublicVerificationProps> = ({
  initialToken = '',
  suratKeluarList,
  settings,
  onBackToApp,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialToken);
  const [selectedToken, setSelectedToken] = useState(initialToken);

  // Find letter by token or official number
  const matchedSurat = suratKeluarList.find(
    (s) =>
      (s.qrCodeToken && s.qrCodeToken.toLowerCase() === selectedToken.toLowerCase()) ||
      (s.noSuratResmi && s.noSuratResmi.toLowerCase() === selectedToken.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedToken(searchQuery.trim());
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InstitutionLogo
            type={settings.logoType}
            customUrl={settings.customLogoUrl}
            size={36}
          />
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              Layanan Validasi Tanda Tangan Digital
            </h1>
            <p className="text-[11px] text-slate-400">
              {settings.instansiName}
            </p>
          </div>
        </div>

        {onBackToApp && (
          <button
            onClick={onBackToApp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Sistem</span>
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        {/* Verification Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Masukkan Token Sertifikat Digital atau Nomor Surat Resmi..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              Verifikasi Dokumen
            </button>
          </form>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>Contoh Token Valid :</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('CERT-AF3-2026-908B298EF2F5');
                setSelectedToken('CERT-AF3-2026-908B298EF2F5');
              }}
              className="font-mono text-blue-400 hover:underline cursor-pointer"
            >
              CERT-AF3-2026-908B298EF2F5
            </button>
          </div>
        </div>

        {/* Verification Result Card */}
        {selectedToken && matchedSurat && (matchedSurat.status === 'Rilis' || matchedSurat.status === 'Disetujui') ? (
          <div className="bg-slate-800/90 border border-slate-700 rounded-xl overflow-hidden shadow-2xl animate-in fade-in duration-200">
            {/* Status Banner */}
            {matchedSurat.tokenStatus === 'Dicabut' ? (
              <div className="p-6 bg-gradient-to-r from-rose-950/80 to-slate-900 border-b border-rose-800/50 flex items-start gap-4">
                <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl">
                  <XCircle className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/90 border border-rose-700/60 px-2 py-0.5 rounded">
                      <AlertCircle className="w-3.5 h-3.5" /> TOKEN DIBATALKAN / DICABUT
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1.5 leading-snug">
                    Sertifikat Digital Telah Dicabut
                  </h2>
                  <p className="text-xs text-rose-300 mt-1">
                    Dokumen ini telah <strong className="text-rose-200">DICABUT / DINONAKTIFKAN</strong> oleh Administrator instansi. Dokumen dan tanda tangan digital tidak lagi sah secara hukum.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-emerald-950/70 to-slate-900 border-b border-emerald-800/50 flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/90 border border-emerald-700/60 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" /> DOKUMEN ASLI & TERVERIFIKASI
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1.5 leading-snug">
                    Sertifikat Tanda Tangan Digital Resmi
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Surat ini sah dikeluarkan oleh <strong className="text-white">{settings.instansiName}</strong> dan ditandatangani secara elektronik sesuai ketentuan peraturan perundang-undangan.
                  </p>
                </div>
              </div>
            )}

            {/* Certificate Details */}
            <div className="p-6 space-y-6">
              {/* Institution Identity */}
              <div className="grid sm:grid-cols-2 gap-4 pb-4 border-b border-slate-700/80">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Instansi Penerbit
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {settings.instansiName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 whitespace-pre-line">
                    {settings.instansiHeader}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                    Alamat Resmi
                  </span>
                  <p className="text-xs text-slate-300">
                    {settings.alamat}, {settings.kota}, {settings.provinsi}
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Telp: {settings.telepon}
                  </p>
                </div>
              </div>

              {/* Letter Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Data Dokumen Persuratan
                </h3>
                <div className="bg-slate-900/70 rounded-lg p-4 border border-slate-700/60 space-y-2.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Nomor Surat Resmi</span>
                    <span className="font-mono font-bold text-sm text-emerald-400">
                      {matchedSurat.noSuratResmi || matchedSurat.noDraft}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Tanggal Terbit</span>
                    <span className="text-slate-200 font-medium">
                      {matchedSurat.tglSurat}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Tujuan / Kepada Yth.</span>
                    <span className="text-white font-semibold">
                      {matchedSurat.tujuanPenerima}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Perihal Surat</span>
                    <span className="text-slate-200 font-medium sm:text-right max-w-md">
                      {matchedSurat.perihal}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400">Status Dokumen</span>
                    <span className="font-semibold text-emerald-400 uppercase">
                      {matchedSurat.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signer & Token Authentication */}
              <div className="grid sm:grid-cols-3 gap-6 pt-2">
                <div className="sm:col-span-2 space-y-3">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Otoritas Penandatangan
                  </h3>
                  <div className="bg-slate-900/70 p-4 rounded-lg border border-slate-700/60 space-y-1.5 text-xs">
                    <p className="text-white font-bold text-sm">
                      {matchedSurat.penandatanganNama}
                    </p>
                    <p className="text-slate-300">
                      {matchedSurat.penandatanganJabatan}
                    </p>
                    {matchedSurat.penandatanganNip && (
                      <p className="text-slate-400 font-mono text-[11px]">
                        NIP. {matchedSurat.penandatanganNip}
                      </p>
                    )}
                    <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      Waktu TTD: {matchedSurat.tglTandaTangan || matchedSurat.tglRilis || 'Tercatat dalam log'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 bg-slate-900/70 rounded-lg border border-slate-700/60 text-center">
                  <QrCodeGenerator value={window.location.href} size={110} />
                  <span className="text-[10px] font-mono text-slate-400 mt-2 break-all">
                    {matchedSurat.qrCodeToken}
                  </span>
                </div>
              </div>

              {/* Download / Storage Link */}
              <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <p className="font-medium text-white">Arsip Dokumen Digital (PDF)</p>
                  <p className="text-slate-400 font-mono text-[11px]">{matchedSurat.fileName} ({matchedSurat.fileSize})</p>
                </div>
                <a
                  href={matchedSurat.fileStorageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Berkas
                </a>
              </div>
            </div>
          </div>
        ) : selectedToken ? (
          <div className="bg-slate-800/90 border border-amber-800/50 rounded-xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Dokumen Tidak Ditemukan / Belum Dirilis Resmi
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                Token atau Nomor Surat "<span className="text-amber-400 font-mono">{selectedToken}</span>" tidak terdaftar sebagai dokumen yang telah ditandatangani dan dirilis secara resmi oleh {settings.instansiName}.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-8 text-center space-y-3">
            <QrCode className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">
              Pindai QR Code Dokumen Surat Keluar
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Gunakan kamera ponsel untuk memindai kode QR pada lembar surat resmi, atau masukkan token verifikasi pada kolom pencarian di atas.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        <p>
          Sistem Verifikasi Tanda Tangan Elektronik & Administrasi Persuratan © 2026 {settings.instansiName}
        </p>
      </footer>
    </div>
  );
};
