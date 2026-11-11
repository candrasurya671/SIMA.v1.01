import React, { useState } from 'react';
import { 
  GitFork, 
  Search, 
  Printer, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Building, 
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { Disposisi, SuratMasuk, Bagian, UserAccount, AppSettings } from '../../types';

interface MonitoringDisposisiProps {
  disposisiList: Disposisi[];
  suratMasukList: SuratMasuk[];
  bagianList: Bagian[];
  activeUser: UserAccount;
  settings: AppSettings;
  onPrintLembarDisposisi: (disposisi: Disposisi, surat?: SuratMasuk) => void;
  onViewSuratDetail: (surat: SuratMasuk) => void;
  onOpenUpdateTindakLanjut: (disposisi: Disposisi) => void;
  onDeleteDisposisi: (id: string) => void;
  onExportExcel: () => void;
}

export const MonitoringDisposisi: React.FC<MonitoringDisposisiProps> = ({
  disposisiList,
  suratMasukList,
  bagianList,
  activeUser,
  settings,
  onPrintLembarDisposisi,
  onViewSuratDetail,
  onOpenUpdateTindakLanjut,
  onDeleteDisposisi,
  onExportExcel,
}) => {
  const [search, setSearch] = useState('');
  const [filterBidang, setFilterBidang] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const isStaff = activeUser.role === 'staf';
  const staffBagianId = activeUser.bagianId;

  // Staf has STRICT ISOLATION to only their own bidang!
  const baseList = isStaff
    ? disposisiList.filter((d) => d.targets.some((t) => t.bagianId === staffBagianId))
    : disposisiList;

  const filteredList = baseList.filter((item) => {
    const matchesSearch =
      item.noAgenda.toLowerCase().includes(search.toLowerCase()) ||
      item.noSurat.toLowerCase().includes(search.toLowerCase()) ||
      item.perihal.toLowerCase().includes(search.toLowerCase()) ||
      item.pengirim.toLowerCase().includes(search.toLowerCase());

    const matchesBidang =
      filterBidang === 'all' ||
      item.targets.some((t) => t.bagianId === filterBidang);

    const matchesStatus =
      filterStatus === 'all' ||
      (isStaff
        ? item.targets.some((t) => t.bagianId === staffBagianId && t.statusTindakLanjut === filterStatus)
        : item.targets.some((t) => t.statusTindakLanjut === filterStatus));

    return matchesSearch && matchesBidang && matchesStatus;
  });

  const getBagianName = (id: string) => {
    const b = bagianList.find((item) => item.id === id);
    return b ? b.nama : id;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {isStaff ? 'Lembar Disposisi Bidang Saya' : 'Monitoring & Rekap Lembar Disposisi'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStaff
              ? 'Daftar instruksi dan arahan disposisi dari Kepala Sekolah yang ditugaskan ke unit Anda'
              : 'Pantau status tindak lanjut, instruksi, dan batas waktu penyelesaian disposisi ke seluruh bidang'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isStaff && (
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
            >
              <span>Export Disposisi (Excel)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari agenda, nomor surat, perihal, atau pengirim..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:bg-white focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isStaff && (
              <select
                value={filterBidang}
                onChange={(e) => setFilterBidang(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">Semua Bidang Penerima</option>
                {bagianList.map((bg) => (
                  <option key={bg.id} value={bg.id}>
                    {bg.nama}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">Semua Status Tindak Lanjut</option>
              <option value="Belum Diproses">Belum Diproses</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dispositions Cards */}
      {filteredList.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">
          Tidak ada data disposisi yang sesuai kriteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((item) => {
            const surat = suratMasukList.find((s) => s.id === item.suratMasukId);

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:border-slate-300 transition-colors space-y-4"
              >
                {/* Header Row: Agenda, No Surat, Urgency, Deadline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded">
                      {item.noAgenda}
                    </span>
                    <span className="font-mono text-xs text-slate-500">
                      No. Surat: <strong className="text-slate-800">{item.noSurat}</strong>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                      Sifat: {item.sifat}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Tgl: {item.tglDisposisi}
                    </span>
                    <span>·</span>
                    <span className="font-mono font-bold text-red-600">
                      Batas: {item.batasWaktu}
                    </span>
                  </div>
                </div>

                {/* Perihal & Pengirim */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.perihal}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Surat dari: <strong className="text-slate-700">{item.pengirim}</strong>
                  </p>
                </div>

                {/* Instructions & Notes */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                      Instruksi Pimpinan ({item.pemberiDisposisi}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.instruksi.map((ins, i) => (
                        <span
                          key={i}
                          className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700 font-medium"
                        >
                          ✓ {ins}
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.catatanKhusus && (
                    <div className="pt-1 border-t border-slate-200/80">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                        Catatan Khusus:
                      </span>
                      <p className="text-slate-800 italic bg-amber-50/50 p-2 rounded border border-amber-200/40">
                        "{item.catatanKhusus}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Targeted Units & Progress Breakdown */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block mb-2">
                    Unit Kerja / Bidang Penerima Disposisi:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {item.targets.map((tgt) => {
                      const bg = bagianList.find((b) => b.id === tgt.bagianId);
                      const isMyBidang = isStaff && tgt.bagianId === staffBagianId;

                      return (
                        <div
                          key={tgt.bagianId}
                          className={`p-3 rounded-lg border flex flex-col justify-between ${
                            isMyBidang
                              ? 'bg-blue-50/40 border-blue-300'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-xs text-slate-900">
                              {bg?.nama || tgt.bagianId}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              tgt.statusTindakLanjut === 'Selesai'
                                ? 'bg-emerald-100 text-emerald-800'
                                : tgt.statusTindakLanjut === 'Dalam Proses'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {tgt.statusTindakLanjut}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 italic">
                            {tgt.catatanTindakLanjut
                              ? `"${tgt.catatanTindakLanjut}"`
                              : 'Belum ada catatan tindak lanjut.'}
                          </p>

                          {tgt.tglTindakLanjut && (
                            <span className="text-[10px] text-slate-400 font-mono mt-2">
                              Diperbarui: {tgt.tglTindakLanjut} {tgt.petugasTindakLanjut ? `oleh ${tgt.petugasTindakLanjut}` : ''}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {surat && (
                      <button
                        onClick={() => onViewSuratDetail(surat)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pratinjau Surat Asli</span>
                      </button>
                    )}

                    <button
                      onClick={() => onPrintLembarDisposisi(item, surat)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-700" />
                      <span>Cetak Lembar Disposisi</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isStaff && (
                      <button
                        onClick={() => onOpenUpdateTindakLanjut(item)}
                        className="px-3.5 py-1.5 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-2xs"
                      >
                        Update Tindak Lanjut
                      </button>
                    )}

                    {(activeUser.role === 'pimpinan' || activeUser.role === 'admin') && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Yakin ingin menghapus disposisi no agenda ${item.noAgenda}?`)) {
                            onDeleteDisposisi(item.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Hapus disposisi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
