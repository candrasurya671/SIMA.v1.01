import React from 'react';
import { 
  Inbox, 
  Send, 
  GitFork, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  FileCheck,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { SuratMasuk, SuratKeluar, Disposisi, AppSettings, Bagian, UserAccount } from '../../types';

interface PimpinanDashboardProps {
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  disposisiList: Disposisi[];
  activeUser: UserAccount;
  settings: AppSettings;
  onNavigate: (tab: string) => void;
  onOpenDisposisiForm: (surat: SuratMasuk) => void;
  onOpenApprovalModal: (surat: SuratKeluar) => void;
  onViewSuratMasuk: (surat: SuratMasuk) => void;
  onViewSuratKeluar: (surat: SuratKeluar) => void;
}

export const PimpinanDashboard: React.FC<PimpinanDashboardProps> = ({
  suratMasukList,
  suratKeluarList,
  disposisiList,
  activeUser,
  settings,
  onNavigate,
  onOpenDisposisiForm,
  onOpenApprovalModal,
  onViewSuratMasuk,
  onViewSuratKeluar,
}) => {
  // Letters requiring Pimpinan's attention
  const pendingDisposisi = suratMasukList.filter(
    (s) => s.statusSurat === 'Diteruskan' && s.statusDisposisi === 'Belum Didisposisi'
  );

  const pendingDraftApproval = suratKeluarList.filter(
    (s) => s.status === 'Draft' || s.status === 'Menunggu TTD'
  );

  const latestMasuk = [...suratMasukList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const latestKeluar = [...suratKeluarList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header Profile Greeting */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
            Ruang Kerja Pimpinan / Kepala Instansi
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            Selamat Bertugas, {activeUser.nama}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tinjau surat masuk kedinasan, terbitkan disposisi ke bidang terkait, serta setujui draft surat keluar dengan tanda tangan digital resmi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-500">Kewenangan:</span>
            <p className="text-xs font-semibold text-slate-800">Tanda Tangan Digital & Disposisi Multi-Bidang</p>
          </div>
        </div>
      </div>

      {/* Action Banners if tasks are pending */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pending Dispositions Callout */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500 text-white rounded-lg">
                <Inbox className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-amber-950">
                {pendingDisposisi.length} Surat Masuk Menunggu Disposisi Anda
              </h3>
            </div>
            <p className="text-xs text-amber-800 mt-1.5 leading-relaxed">
              Surat dinas yang perlu diteruskan kepada Wakil Kepala / Bidang terkait dengan arahan petunjuk dan batas penyelesaian.
            </p>
            {pendingDisposisi.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => onOpenDisposisiForm(pendingDisposisi[0])}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                >
                  Disposisikan Surat: {pendingDisposisi[0].noAgenda}
                </button>
              </div>
            )}
          </div>
          <span className="text-2xl font-bold text-amber-800 font-mono">
            {pendingDisposisi.length}
          </span>
        </div>

        {/* Pending Draft Signatures Callout */}
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-rose-600 text-white rounded-lg">
                <Edit3 className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-rose-950">
                {pendingDraftApproval.length} Draft Surat Keluar Menunggu Persetujuan
              </h3>
            </div>
            <p className="text-xs text-rose-800 mt-1.5 leading-relaxed">
              Tinjau isi surat keluar yang diajukan staf/admin, bubuhkan tanda tangan digital resmi (QR Code) atau berikan catatan revisi.
            </p>
            {pendingDraftApproval.length > 0 && (
              <div className="mt-3">
                <button
                  onClick={() => onOpenApprovalModal(pendingDraftApproval[0])}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                >
                  Tinjau & TTD Draft: {pendingDraftApproval[0].noDraft}
                </button>
              </div>
            )}
          </div>
          <span className="text-2xl font-bold text-rose-800 font-mono">
            {pendingDraftApproval.length}
          </span>
        </div>
      </div>

      {/* 3 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Disposisi Diterbitkan</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {disposisiList.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Kepada seluruh Waka & Unit Kerja</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Surat Keluar Ditandatangani</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {suratKeluarList.filter((s) => s.status === 'Disetujui' || s.status === 'Rilis').length}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Dilengkapi QR Tanda Tangan Resmi
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <span className="text-xs font-medium text-slate-500">Surat Keluar Dirilis</span>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
            {suratKeluarList.filter((s) => s.status === 'Rilis').length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Siap dikirim ke instansi eksternal</p>
        </div>
      </div>

      {/* 2 Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Incoming */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Surat Masuk Terbaru</h2>
              <p className="text-[11px] text-slate-500">5 surat yang baru masuk ke sekretariat</p>
            </div>
            <button
              onClick={() => onNavigate('surat-masuk')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {latestMasuk.map((item) => (
              <div
                key={item.id}
                onClick={() => onViewSuratMasuk(item)}
                className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/80 p-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {item.noAgenda}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.sifat}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                    {item.perihal}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Pengirim: {item.pengirim}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    item.statusDisposisi === 'Sudah Didisposisi'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.statusDisposisi}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Outgoing */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Surat Keluar & Draft</h2>
              <p className="text-[11px] text-slate-500">5 surat keluar terkini</p>
            </div>
            <button
              onClick={() => onNavigate('surat-keluar')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              Lihat Semua <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {latestKeluar.map((item) => (
              <div
                key={item.id}
                onClick={() => onViewSuratKeluar(item)}
                className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50/80 p-2 rounded-lg cursor-pointer transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    {item.noSuratResmi || item.noDraft}
                  </span>
                  <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                    {item.perihal}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Kepada: {item.tujuanPenerima}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    item.status === 'Rilis'
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.status === 'Revisi'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
