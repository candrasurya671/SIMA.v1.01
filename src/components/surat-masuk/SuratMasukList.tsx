import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  GitFork, 
  History, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Filter,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { SuratMasuk, JenisSurat, Disposisi, UserRole, UserAccount, AppSettings } from '../../types';

interface SuratMasukListProps {
  suratMasukList: SuratMasuk[];
  jenisSuratList: JenisSurat[];
  disposisiList: Disposisi[];
  activeUser: UserAccount;
  settings: AppSettings;
  onOpenInputModal: () => void;
  onViewDocument: (surat: SuratMasuk) => void;
  onOpenDisposisiForm: (surat: SuratMasuk) => void;
  onViewDisposisi: (disposisi: Disposisi, surat: SuratMasuk) => void;
  onOpenLogs: (surat: SuratMasuk) => void;
  onDeleteSurat: (id: string) => void;
  onExportExcel: () => void;
}

export const SuratMasukList: React.FC<SuratMasukListProps> = ({
  suratMasukList,
  jenisSuratList,
  disposisiList,
  activeUser,
  settings,
  onOpenInputModal,
  onViewDocument,
  onOpenDisposisiForm,
  onViewDisposisi,
  onOpenLogs,
  onDeleteSurat,
  onExportExcel,
}) => {
  const [search, setSearch] = useState('');
  const [filterStatusSurat, setFilterStatusSurat] = useState('all');
  const [filterDisposisi, setFilterDisposisi] = useState('all');
  const [filterSifat, setFilterSifat] = useState('all');

  const filteredList = suratMasukList.filter((item) => {
    const matchesSearch =
      item.noAgenda.toLowerCase().includes(search.toLowerCase()) ||
      item.noSurat.toLowerCase().includes(search.toLowerCase()) ||
      item.pengirim.toLowerCase().includes(search.toLowerCase()) ||
      item.perihal.toLowerCase().includes(search.toLowerCase());

    const matchesStatusSurat =
      filterStatusSurat === 'all' || item.statusSurat === filterStatusSurat;

    const matchesDisposisi =
      filterDisposisi === 'all' || item.statusDisposisi === filterDisposisi;

    const matchesSifat = filterSifat === 'all' || item.sifat === filterSifat;

    return matchesSearch && matchesStatusSurat && matchesDisposisi && matchesSifat;
  });

  const getJenisName = (id: string) => {
    const js = jenisSuratList.find((j) => j.id === id);
    return js ? js.nama : 'Umum';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pengelolaan Surat Masuk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Agenda surat dinas masuk, penerusan disposisi pimpinan, dan pengarsipan digital
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Export Excel Ber-Link</span>
          </button>

          {activeUser.role === 'admin' && (
            <button
              onClick={onOpenInputModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Input Surat Masuk</span>
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
              placeholder="Cari nomor agenda, nomor surat, pengirim, atau perihal..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:bg-white focus:border-blue-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterStatusSurat}
              onChange={(e) => setFilterStatusSurat(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">Semua Alur Surat</option>
              <option value="Diteruskan">Alur: Diteruskan</option>
              <option value="Diarsipkan">Alur: Diarsipkan</option>
            </select>

            <select
              value={filterDisposisi}
              onChange={(e) => setFilterDisposisi(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">Semua Status Disposisi</option>
              <option value="Belum Didisposisi">Belum Didisposisi</option>
              <option value="Sudah Didisposisi">Sudah Didisposisi</option>
              <option value="Selesai">Selesai / Diarsipkan</option>
            </select>

            <select
              value={filterSifat}
              onChange={(e) => setFilterSifat(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">Semua Sifat Surat</option>
              <option value="Biasa">Biasa</option>
              <option value="Penting">Penting</option>
              <option value="Sangat Segera">Sangat Segera</option>
              <option value="Rahasia">Rahasia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table of Incoming Letters */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
              <tr>
                <th className="py-3 px-4 w-12">No.</th>
                <th className="py-3 px-4">No. Agenda & Surat</th>
                <th className="py-3 px-4">Tgl Diterima</th>
                <th className="py-3 px-4">Pengirim & Perihal</th>
                <th className="py-3 px-4">Sifat & Jenis</th>
                <th className="py-3 px-4">Status & Disposisi</th>
                <th className="py-3 px-4 text-right">Aksi & Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada surat masuk yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => {
                  const existingDisposisi = disposisiList.find(
                    (d) => d.suratMasukId === item.id
                  );

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-700 block text-xs">
                          {item.noAgenda}
                        </span>
                        <span className="font-mono text-[11px] text-slate-500 block truncate max-w-[170px]">
                          {item.noSurat}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {item.tglDiterima}
                        <span className="block text-[10px] text-slate-400">
                          Surat: {item.tglSurat}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-slate-900 block truncate">
                          {item.pengirim}
                        </span>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                          {item.perihal}
                        </p>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.sifat === 'Sangat Segera'
                            ? 'bg-rose-100 text-rose-800'
                            : item.sifat === 'Penting'
                            ? 'bg-amber-100 text-amber-800'
                            : item.sifat === 'Rahasia'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.sifat}
                        </span>
                        <span className="block text-[10px] text-slate-500 mt-1">
                          {getJenisName(item.jenisSuratId)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.statusSurat === 'Diarsipkan'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}>
                          {item.statusSurat}
                        </span>
                        <div className="mt-1">
                          {item.statusDisposisi === 'Sudah Didisposisi' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Didisposisikan
                            </span>
                          ) : item.statusSurat === 'Diarsipkan' ? (
                            <span className="text-[11px] text-slate-400">Selesai Arsip</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
                              <Clock className="w-3.5 h-3.5" /> Menunggu Disposisi
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Digital PDF */}
                          <button
                            onClick={() => onViewDocument(item)}
                            title="Pratinjau berkas PDF digital"
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Disposisi Action */}
                          {existingDisposisi ? (
                            <button
                              onClick={() => onViewDisposisi(existingDisposisi, item)}
                              title="Lihat lembar disposisi pimpinan"
                              className="px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded flex items-center gap-1"
                            >
                              <GitFork className="w-3.5 h-3.5" />
                              <span>Disposisi</span>
                            </button>
                          ) : (
                            activeUser.role === 'pimpinan' && item.statusSurat === 'Diteruskan' && (
                              <button
                                onClick={() => onOpenDisposisiForm(item)}
                                title="Buat lembar disposisi untuk bidang"
                                className="px-2 py-1 text-[11px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Disposisikan</span>
                              </button>
                            )
                          )}

                          {/* Access Log Tracker */}
                          <button
                            onClick={() => onOpenLogs(item)}
                            title="Lihat riwayat jejak log akses surat"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Delete (Admin only) */}
                          {activeUser.role === 'admin' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin ingin menghapus surat masuk no ${item.noAgenda}?`)) {
                                  onDeleteSurat(item.id);
                                }
                              }}
                              title="Hapus surat masuk"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan {filteredList.length} dari total {suratMasukList.length} surat masuk</span>
          <span className="font-mono text-[11px]">Format Digital: PDF Standar ISO 19005-1</span>
        </div>
      </div>
    </div>
  );
};
