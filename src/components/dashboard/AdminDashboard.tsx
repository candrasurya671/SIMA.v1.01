import React from 'react';
import { 
  Inbox, 
  Send, 
  GitFork, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  FileSpreadsheet, 
  ShieldCheck, 
  ArrowUpRight,
  Eye,
  Building
} from 'lucide-react';
import { SuratMasuk, SuratKeluar, Disposisi, AppSettings, Bagian } from '../../types';

interface AdminDashboardProps {
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  disposisiList: Disposisi[];
  bagianList: Bagian[];
  settings: AppSettings;
  onNavigate: (tab: string) => void;
  onViewSuratMasuk: (surat: SuratMasuk) => void;
  onViewSuratKeluar: (surat: SuratKeluar) => void;
  onOpenInputSuratMasuk: () => void;
  onOpenInputDraftKeluar: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  suratMasukList,
  suratKeluarList,
  disposisiList,
  bagianList,
  settings,
  onNavigate,
  onViewSuratMasuk,
  onViewSuratKeluar,
  onOpenInputSuratMasuk,
  onOpenInputDraftKeluar,
}) => {
  const totalMasuk = suratMasukList.length;
  const totalKeluar = suratKeluarList.length;
  const totalDisposisi = disposisiList.length;

  const suratKeluarRilis = suratKeluarList.filter((s) => s.status === 'Rilis').length;
  const suratKeluarDraft = suratKeluarList.filter((s) => s.status === 'Draft' || s.status === 'Menunggu TTD' || s.status === 'Revisi').length;

  const latestMasuk = [...suratMasukList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const latestKeluar = [...suratKeluarList]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
            Panel Administrator Persuratan
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            Selamat Datang di {settings.systemName}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan administrasi surat masuk, disposisi berjenjang, dan rilis surat keluar resmi untuk {settings.instansiName}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenInputSuratMasuk}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Input Surat Masuk</span>
          </button>
          <button
            onClick={onOpenInputDraftKeluar}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Draft Keluar</span>
          </button>
        </div>
      </div>

      {/* 3 Main Statistical Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Surat Masuk */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Surat Masuk</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
              {totalMasuk}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-blue-600 font-semibold">{suratMasukList.filter(s => s.statusDisposisi === 'Sudah Didisposisi').length} Disposisi</span>
              <span>·</span>
              <span>{suratMasukList.filter(s => s.statusSurat === 'Diarsipkan').length} Diarsipkan</span>
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        {/* Total Surat Keluar */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Surat Keluar</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
              {totalKeluar}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="text-emerald-600 font-semibold">{suratKeluarRilis} Rilis</span>
              <span>·</span>
              <span className="text-amber-600">{suratKeluarDraft} Proses/Draft</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Send className="w-6 h-6" />
          </div>
        </div>

        {/* Total Lembar Disposisi */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Total Disposisi Pimpinan</span>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-1 tabular-nums">
              {totalDisposisi}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <span>Tersebar di {bagianList.length} Bidang Instansi</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <GitFork className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2 Previews: 5 Surat Masuk Terbaru & 5 Surat Keluar Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 5 Surat Masuk Terbaru */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">5 Surat Masuk Terbaru</h2>
                <p className="text-[11px] text-slate-500">Surat dinas dan permohonan yang baru diterima</p>
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
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]">
                        {item.noSurat}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                      {item.perihal}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Dari: {item.pengirim}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.statusDisposisi === 'Sudah Didisposisi'
                        ? 'bg-blue-50 text-blue-700'
                        : item.statusSurat === 'Diarsipkan'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.statusDisposisi}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{item.tglDiterima}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5 Surat Keluar Terbaru */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">5 Surat Keluar Terbaru</h2>
                <p className="text-[11px] text-slate-500">Status proses draft hingga rilis resmi bertanda tangan QR</p>
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
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {item.noSuratResmi || item.noDraft}
                      </span>
                      {item.status === 'Rilis' && (
                        <span className="inline-flex items-center text-[10px] text-emerald-600 font-semibold gap-0.5">
                          <ShieldCheck className="w-3 h-3" /> QR Valid
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">
                      {item.perihal}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Tujuan: {item.tujuanPenerima}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.status === 'Rilis'
                        ? 'bg-emerald-50 text-emerald-700'
                        : item.status === 'Disetujui'
                        ? 'bg-blue-50 text-blue-700'
                        : item.status === 'Revisi'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.status === 'Rilis' ? 'Sudah Rilis' : item.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{item.tglSurat}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
