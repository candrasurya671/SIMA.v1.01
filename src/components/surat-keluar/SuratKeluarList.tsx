import React, { useState } from 'react';
import { 
  Send, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  QrCode,
  ExternalLink,
  History
} from 'lucide-react';
import { SuratKeluar, JenisSurat, UserAccount, AppSettings } from '../../types';

interface SuratKeluarListProps {
  suratKeluarList: SuratKeluar[];
  jenisSuratList: JenisSurat[];
  activeUser: UserAccount;
  settings: AppSettings;
  onOpenInputDraft: () => void;
  onViewDocument: (surat: SuratKeluar) => void;
  onOpenApprovalModal: (surat: SuratKeluar) => void;
  onOpenRilisModal: (surat: SuratKeluar) => void;
  onOpenLogs: (surat: SuratKeluar) => void;
  onOpenPublicVerify: (token: string) => void;
  onDeleteSurat: (id: string) => void;
  onExportExcel: () => void;
}

export const SuratKeluarList: React.FC<SuratKeluarListProps> = ({
  suratKeluarList,
  jenisSuratList,
  activeUser,
  settings,
  onOpenInputDraft,
  onViewDocument,
  onOpenApprovalModal,
  onOpenRilisModal,
  onOpenLogs,
  onOpenPublicVerify,
  onDeleteSurat,
  onExportExcel,
}) => {
  const [search, setSearch] = useState('');
  const [activeStatusTab, setActiveStatusTab] = useState('all');

  const filteredList = suratKeluarList.filter((item) => {
    const matchesSearch =
      item.noDraft.toLowerCase().includes(search.toLowerCase()) ||
      (item.noSuratResmi && item.noSuratResmi.toLowerCase().includes(search.toLowerCase())) ||
      item.tujuanPenerima.toLowerCase().includes(search.toLowerCase()) ||
      item.perihal.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      activeStatusTab === 'all' || item.status === activeStatusTab;

    return matchesSearch && matchesStatus;
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
            Pengelolaan Surat Keluar & Tanda Tangan Digital
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Penyusunan draft surat keluar, approval & tanda tangan QR pimpinan, hingga rilis resmi
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
              onClick={onOpenInputDraft}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Draft Surat Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveStatusTab('all')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeStatusTab === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({suratKeluarList.length})
          </button>
          <button
            onClick={() => setActiveStatusTab('Menunggu TTD')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeStatusTab === 'Menunggu TTD' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Menunggu TTD ({suratKeluarList.filter(s => s.status === 'Menunggu TTD' || s.status === 'Draft').length})
          </button>
          <button
            onClick={() => setActiveStatusTab('Revisi')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeStatusTab === 'Revisi' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Perlu Revisi ({suratKeluarList.filter(s => s.status === 'Revisi').length})
          </button>
          <button
            onClick={() => setActiveStatusTab('Disetujui')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeStatusTab === 'Disetujui' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Disetujui / Siap Rilis ({suratKeluarList.filter(s => s.status === 'Disetujui').length})
          </button>
          <button
            onClick={() => setActiveStatusTab('Rilis')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeStatusTab === 'Rilis' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sudah Rilis ({suratKeluarList.filter(s => s.status === 'Rilis').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor draft, nomor surat resmi, tujuan penerima, atau perihal..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:bg-white focus:border-blue-500 font-medium"
          />
        </div>
      </div>

      {/* Table of Outgoing Letters */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
              <tr>
                <th className="py-3 px-4 w-12">No.</th>
                <th className="py-3 px-4">Nomor Dokumen</th>
                <th className="py-3 px-4">Tgl Surat</th>
                <th className="py-3 px-4">Tujuan & Perihal</th>
                <th className="py-3 px-4">Status & Penandatangan</th>
                <th className="py-3 px-4">Validasi QR Code</th>
                <th className="py-3 px-4 text-right">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada surat keluar yang cocok dengan kriteria.
                  </td>
                </tr>
              ) : (
                filteredList.map((item, index) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {index + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.noSuratResmi ? (
                          <span className="font-mono font-bold text-emerald-700 block text-xs">
                            {item.noSuratResmi}
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-amber-700 block text-xs">
                            {item.noDraft}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono">
                          {getJenisName(item.jenisSuratId)} · {item.sifat}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {item.tglSurat}
                        {item.tglRilis && (
                          <span className="block text-[10px] text-emerald-600">
                            Rilis: {item.tglRilis.slice(0, 10)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-slate-900 block truncate">
                          Kepada: {item.tujuanPenerima}
                        </span>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                          {item.perihal}
                        </p>
                        {item.catatanPimpinan && item.status === 'Revisi' && (
                          <p className="text-[10px] text-rose-700 italic mt-1 bg-rose-50 p-1.5 rounded border border-rose-200">
                            Revisi: "{item.catatanPimpinan}"
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          item.status === 'Rilis'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Disetujui'
                            ? 'bg-blue-100 text-blue-800'
                            : item.status === 'Revisi'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                        <span className="block text-[11px] text-slate-600 mt-1 truncate max-w-[140px]">
                          {item.penandatanganNama.split(',')[0]}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.qrCodeToken ? (
                          <button
                            onClick={() => onOpenPublicVerify(item.qrCodeToken || '')}
                            title="Buka sertifikat validasi QR Code publik"
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-mono hover:bg-slate-800 transition-colors"
                          >
                            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Scan / Cek</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">
                            Belum Ada TTD QR
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Pratinjau Dokumen PDF */}
                          <button
                            onClick={() => onViewDocument(item)}
                            title="Pratinjau berkas digital surat keluar"
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          >
                            <FileText className="w-4 h-4" />
                          </button>

                          {/* Pimpinan Approval Trigger */}
                          {activeUser.role === 'pimpinan' && (item.status === 'Draft' || item.status === 'Menunggu TTD' || item.status === 'Revisi') && (
                            <button
                              onClick={() => onOpenApprovalModal(item)}
                              title="Tinjau draft dan tanda tangani QR"
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Persetujuan</span>
                            </button>
                          )}

                          {/* Admin Rilis Trigger */}
                          {activeUser.role === 'admin' && item.status === 'Disetujui' && (
                            <button
                              onClick={() => onOpenRilisModal(item)}
                              title="Rilis surat keluar resmi"
                              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded flex items-center gap-1"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Rilis Resmi</span>
                            </button>
                          )}

                          {/* Access Logs */}
                          <button
                            onClick={() => onOpenLogs(item)}
                            title="Lihat riwayat log akses & tanda tangan surat keluar"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded"
                          >
                            <History className="w-4 h-4" />
                          </button>

                          {/* Delete (Admin only) */}
                          {activeUser.role === 'admin' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin ingin menghapus surat keluar no ${item.noDraft}?`)) {
                                  onDeleteSurat(item.id);
                                }
                              }}
                              title="Hapus surat keluar"
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

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Menampilkan {filteredList.length} dari total {suratKeluarList.length} surat keluar</span>
          <span className="font-mono text-[11px]">Enkripsi Sertifikat: SHA-256 Digital Certificate</span>
        </div>
      </div>
    </div>
  );
};
