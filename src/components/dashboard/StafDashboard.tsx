import React from 'react';
import { 
  GitFork, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Eye, 
  Building,
  Calendar,
  FileText,
  ArrowRight
} from 'lucide-react';
import { Disposisi, SuratMasuk, Bagian, UserAccount, AppSettings } from '../../types';

interface StafDashboardProps {
  disposisiList: Disposisi[];
  suratMasukList: SuratMasuk[];
  activeUser: UserAccount;
  bagianList: Bagian[];
  settings: AppSettings;
  onNavigate: (tab: string) => void;
  onPrintLembarDisposisi: (disposisi: Disposisi, surat?: SuratMasuk) => void;
  onViewSuratDetail: (surat: SuratMasuk) => void;
  onUpdateTindakLanjut: (disposisi: Disposisi) => void;
}

export const StafDashboard: React.FC<StafDashboardProps> = ({
  disposisiList,
  suratMasukList,
  activeUser,
  bagianList,
  settings,
  onNavigate,
  onPrintLembarDisposisi,
  onViewSuratDetail,
  onUpdateTindakLanjut,
}) => {
  const currentBagianId = activeUser.bagianId || '';
  const currentBagian = bagianList.find((b) => b.id === currentBagianId);

  // STRICT ISOLATION: Only get dispositions where active staff's bidang is targeted!
  const myDisposisiList = disposisiList.filter((d) =>
    d.targets.some((t) => t.bagianId === currentBagianId)
  );

  const pendingCount = myDisposisiList.filter((d) => {
    const target = d.targets.find((t) => t.bagianId === currentBagianId);
    return target?.statusTindakLanjut === 'Belum Diproses';
  }).length;

  const inProgressCount = myDisposisiList.filter((d) => {
    const target = d.targets.find((t) => t.bagianId === currentBagianId);
    return target?.statusTindakLanjut === 'Dalam Proses';
  }).length;

  const completedCount = myDisposisiList.filter((d) => {
    const target = d.targets.find((t) => t.bagianId === currentBagianId);
    return target?.statusTindakLanjut === 'Selesai';
  }).length;

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded">
              Unit Kerja: {currentBagian?.nama || activeUser.jabatan}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-2">
            Selamat Bertugas, {activeUser.nama}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau dan tindaklanjuti arahan disposisi dari Kepala Sekolah yang dialamatkan khusus ke bidang Anda.
          </p>
        </div>

        <button
          onClick={() => onNavigate('disposisi')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-2xs"
        >
          <span>Kelola Semua Disposisi ({myDisposisiList.length})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Metric Cards for Staff */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Belum Ditindaklanjuti</span>
            <div className="text-2xl font-bold text-amber-600 font-mono mt-1 tabular-nums">
              {pendingCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Perlu respon & eksekusi segera</p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Sedang Dikerjakan</span>
            <div className="text-2xl font-bold text-blue-600 font-mono mt-1 tabular-nums">
              {inProgressCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Dalam proses koordinasi</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Selesai Ditindaklanjuti</span>
            <div className="text-2xl font-bold text-emerald-600 font-mono mt-1 tabular-nums">
              {completedCount}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Telah dilaporkan ke pimpinan</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Dispositions List specifically for this Unit */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Daftar Disposisi Masuk untuk {currentBagian?.nama || 'Bidang Anda'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hanya menampilkan lembar disposisi yang didelegasikan oleh Kepala Instansi ke unit kerja ini.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-500">
            Total: {myDisposisiList.length} Disposisi
          </span>
        </div>

        {myDisposisiList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Tidak ada lembar disposisi yang ditujukan ke bidang Anda saat ini.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-3">
            {myDisposisiList.map((dsp) => {
              const surat = suratMasukList.find((s) => s.id === dsp.suratMasukId);
              const myTarget = dsp.targets.find((t) => t.bagianId === currentBagianId);

              return (
                <div
                  key={dsp.id}
                  className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 p-3 rounded-lg transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {dsp.noAgenda}
                      </span>
                      <span className="text-xs font-mono text-slate-600">
                        {dsp.noSurat}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        Sifat: {dsp.sifat}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {dsp.perihal}
                    </h3>

                    <p className="text-xs text-slate-600">
                      Pengirim: <strong className="text-slate-800">{dsp.pengirim}</strong>
                    </p>

                    {/* Instructions tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dsp.instruksi.map((ins, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {ins}
                        </span>
                      ))}
                    </div>

                    {/* Specific Leader's Note */}
                    {dsp.catatanKhusus && (
                      <p className="text-xs text-slate-700 italic bg-amber-50/70 p-2 rounded border border-amber-200/60 mt-1.5">
                        Catatan Pimpinan: "{dsp.catatanKhusus}"
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Tgl Disposisi: {dsp.tglDisposisi}
                      </span>
                      <span>·</span>
                      <span className="text-red-600 font-semibold">
                        Batas Waktu: {dsp.batasWaktu}
                      </span>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                        myTarget?.statusTindakLanjut === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : myTarget?.statusTindakLanjut === 'Dalam Proses'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {myTarget?.statusTindakLanjut || 'Belum Diproses'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {surat && (
                        <button
                          onClick={() => onViewSuratDetail(surat)}
                          title="Lihat berkas surat asli"
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Berkas Surat</span>
                        </button>
                      )}

                      <button
                        onClick={() => onPrintLembarDisposisi(dsp, surat)}
                        className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-600" />
                        <span>Cetak Lembar</span>
                      </button>

                      <button
                        onClick={() => onUpdateTindakLanjut(dsp)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                      >
                        Tindak Lanjuti
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
