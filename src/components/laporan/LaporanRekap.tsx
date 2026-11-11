import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  BarChart3, 
  ExternalLink, 
  Download, 
  Calendar, 
  Filter, 
  Inbox, 
  Send, 
  GitFork,
  CheckCircle2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { SuratMasuk, SuratKeluar, Disposisi, Bagian, AppSettings } from '../../types';

interface LaporanRekapProps {
  suratMasukList: SuratMasuk[];
  suratKeluarList: SuratKeluar[];
  disposisiList: Disposisi[];
  bagianList: Bagian[];
  settings: AppSettings;
  onExportSuratMasukExcel: () => void;
  onExportSuratKeluarExcel: () => void;
  onExportDisposisiExcel: () => void;
}

export const LaporanRekap: React.FC<LaporanRekapProps> = ({
  suratMasukList,
  suratKeluarList,
  disposisiList,
  bagianList,
  settings,
  onExportSuratMasukExcel,
  onExportSuratKeluarExcel,
  onExportDisposisiExcel,
}) => {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [activeReportTab, setActiveReportTab] = useState<'grafik' | 'masuk' | 'keluar' | 'disposisi'>('grafik');

  const months = [
    { value: 'all', label: 'Semua Bulan (Jan - Des)' },
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  // Month-by-month aggregation for Jan - Dec (year 2026)
  const monthlyData = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'
  ].map((mStr, idx) => {
    const masukCount = suratMasukList.filter((s) => {
      const parts = s.tglDiterima.split('-');
      return parts[0] === selectedYear && parts[1] === mStr;
    }).length;

    const keluarCount = suratKeluarList.filter((s) => {
      const parts = s.tglSurat.split('-');
      return parts[0] === selectedYear && parts[1] === mStr;
    }).length;

    const disposisiCount = disposisiList.filter((d) => {
      const parts = d.tglDisposisi.split('-');
      return parts[0] === selectedYear && parts[1] === mStr;
    }).length;

    return {
      monthName: months[idx + 1].label.slice(0, 3),
      masuk: masukCount,
      keluar: keluarCount,
      disposisi: disposisiCount,
    };
  });

  const maxStat = Math.max(
    1,
    ...monthlyData.map((d) => Math.max(d.masuk, d.keluar, d.disposisi))
  );

  // Filtered lists by selected year & month
  const filteredMasuk = suratMasukList.filter((s) => {
    const parts = s.tglDiterima.split('-');
    const yearMatch = parts[0] === selectedYear;
    const monthMatch = selectedMonth === 'all' || parts[1] === selectedMonth;
    return yearMatch && monthMatch;
  });

  const filteredKeluar = suratKeluarList.filter((s) => {
    const parts = s.tglSurat.split('-');
    const yearMatch = parts[0] === selectedYear;
    const monthMatch = selectedMonth === 'all' || parts[1] === selectedMonth;
    return yearMatch && monthMatch;
  });

  const filteredDisposisi = disposisiList.filter((d) => {
    const parts = d.tglDisposisi.split('-');
    const yearMatch = parts[0] === selectedYear;
    const monthMatch = selectedMonth === 'all' || parts[1] === selectedMonth;
    return yearMatch && monthMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Rekapitulasi, Laporan & Grafik Persuratan
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Analisis tren volume surat, ekspor rekapitulasi Excel ber-hyperlink langsung ke berkas dokumen
          </p>
        </div>

        {/* Global Export Excel Buttons with direct file link */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExportSuratMasukExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel Surat Masuk</span>
          </button>
          <button
            onClick={onExportSuratKeluarExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel Surat Keluar</span>
          </button>
          <button
            onClick={onExportDisposisiExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel Disposisi</span>
          </button>
        </div>
      </div>

      {/* Filter Period Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter Periode:
          </span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-lg bg-white font-mono font-medium text-slate-800"
          >
            <option value="2026">Tahun 2026</option>
            <option value="2025">Tahun 2025</option>
          </select>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="p-1.5 border border-slate-200 rounded-lg bg-white font-medium text-slate-800"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveReportTab('grafik')}
            className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
              activeReportTab === 'grafik' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grafik Visual
          </button>
          <button
            onClick={() => setActiveReportTab('masuk')}
            className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
              activeReportTab === 'masuk' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Surat Masuk ({filteredMasuk.length})
          </button>
          <button
            onClick={() => setActiveReportTab('keluar')}
            className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
              activeReportTab === 'keluar' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Surat Keluar ({filteredKeluar.length})
          </button>
          <button
            onClick={() => setActiveReportTab('disposisi')}
            className={`px-3 py-1.5 rounded-md transition-colors font-medium ${
              activeReportTab === 'disposisi' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rekap Disposisi ({filteredDisposisi.length})
          </button>
        </div>
      </div>

      {/* Feature Notification on Excel Hyperlinks */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-950">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-600 shrink-0" />
          <span>
            <strong>Fitur Modifikasi Khusus Aktif:</strong> Seluruh file Excel yang diexport dilengkapi kolom <strong>Direct Link (Hyperlink)</strong> yang terhubung langsung ke URL file surat digital pada server storage.
          </span>
        </div>
        <span className="font-mono text-[11px] text-blue-700 bg-blue-100 px-2 py-0.5 rounded font-semibold whitespace-nowrap hidden md:inline">
          Format: .XLSX Standard
        </span>
      </div>

      {/* VIEW 1: Visual Charts */}
      {activeReportTab === 'grafik' && (
        <div className="space-y-6">
          {/* Main Chart Container */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Grafik Volume Surat Masuk, Disposisi & Surat Keluar (Tahun {selectedYear})
                </h2>
                <p className="text-xs text-slate-500">
                  Perbandingan tren arus lalu lintas persuratan per bulan (Januari - Desember)
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-blue-600" />
                  <span className="text-slate-700">Surat Masuk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600" />
                  <span className="text-slate-700">Disposisi</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600" />
                  <span className="text-slate-700">Surat Keluar</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG / Bar Display */}
            <div className="mt-8 pt-4">
              <div className="grid grid-cols-12 gap-2 h-64 items-end border-b border-slate-200 pb-2">
                {monthlyData.map((d, index) => {
                  const masukHeight = Math.max(4, Math.round((d.masuk / maxStat) * 100));
                  const dispHeight = Math.max(4, Math.round((d.disposisi / maxStat) * 100));
                  const keluarHeight = Math.max(4, Math.round((d.keluar / maxStat) * 100));

                  return (
                    <div key={index} className="flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip on hover */}
                      <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                        <p className="font-bold">{d.monthName}</p>
                        <p className="text-blue-300">Masuk: {d.masuk}</p>
                        <p className="text-indigo-300">Disposisi: {d.disposisi}</p>
                        <p className="text-emerald-300">Keluar: {d.keluar}</p>
                      </div>

                      {/* Bar Triplets */}
                      <div className="flex items-end gap-1 w-full justify-center">
                        {/* Surat Masuk Bar */}
                        <div
                          style={{ height: `${masukHeight}%` }}
                          className="w-2.5 sm:w-3.5 bg-blue-600 rounded-t hover:bg-blue-700 transition-all"
                        />
                        {/* Disposisi Bar */}
                        <div
                          style={{ height: `${dispHeight}%` }}
                          className="w-2.5 sm:w-3.5 bg-indigo-600 rounded-t hover:bg-indigo-700 transition-all"
                        />
                        {/* Surat Keluar Bar */}
                        <div
                          style={{ height: `${keluarHeight}%` }}
                          className="w-2.5 sm:w-3.5 bg-emerald-600 rounded-t hover:bg-emerald-700 transition-all"
                        />
                      </div>

                      {/* Month Label */}
                      <span className="text-[11px] font-medium text-slate-500 mt-2">
                        {d.monthName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aggregated Totals Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-2">
              <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 text-center">
                <span className="text-xs text-blue-700 font-medium">Akumulasi Surat Masuk</span>
                <p className="text-2xl font-bold font-mono text-blue-900 mt-0.5 tabular-nums">
                  {suratMasukList.length}
                </p>
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-lg border border-indigo-100 text-center">
                <span className="text-xs text-indigo-700 font-medium">Akumulasi Disposisi</span>
                <p className="text-2xl font-bold font-mono text-indigo-900 mt-0.5 tabular-nums">
                  {disposisiList.length}
                </p>
              </div>
              <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 text-center">
                <span className="text-xs text-emerald-700 font-medium">Akumulasi Surat Keluar</span>
                <p className="text-2xl font-bold font-mono text-emerald-900 mt-0.5 tabular-nums">
                  {suratKeluarList.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Table Rekap Surat Masuk with Hyperlink Preview */}
      {activeReportTab === 'masuk' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tabel Rekapitulasi Surat Masuk (Siap Export Excel)
              </h3>
              <p className="text-xs text-slate-500">
                Menampilkan kolom Direct Link (Hyperlink) yang akan disertakan dalam file download Excel
              </p>
            </div>
            <button
              onClick={onExportSuratMasukExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Download Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/70 border-b border-slate-200 font-semibold text-slate-800">
                <tr>
                  <th className="py-2.5 px-3 w-10">No.</th>
                  <th className="py-2.5 px-3">No. Agenda</th>
                  <th className="py-2.5 px-3">No. Surat</th>
                  <th className="py-2.5 px-3">Pengirim</th>
                  <th className="py-2.5 px-3">Perihal</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Direct Link Storage (Hyperlink)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMasuk.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-700">{s.noAgenda}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-800">{s.noSurat}</td>
                    <td className="py-2.5 px-3 font-medium">{s.pengirim}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate">{s.perihal}</td>
                    <td className="py-2.5 px-3">{s.statusDisposisi}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <a
                        href={s.fileStorageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{s.fileStorageUrl}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Table Rekap Surat Keluar with Hyperlink Preview */}
      {activeReportTab === 'keluar' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tabel Rekapitulasi Surat Keluar (Siap Export Excel)
              </h3>
              <p className="text-xs text-slate-500">
                Tercatat nomor resmi, status persetujuan pimpinan, token sertifikat, dan hyperlink file
              </p>
            </div>
            <button
              onClick={onExportSuratKeluarExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Download Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/70 border-b border-slate-200 font-semibold text-slate-800">
                <tr>
                  <th className="py-2.5 px-3 w-10">No.</th>
                  <th className="py-2.5 px-3">No. Draft / Resmi</th>
                  <th className="py-2.5 px-3">Tujuan</th>
                  <th className="py-2.5 px-3">Perihal</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Penandatangan</th>
                  <th className="py-2.5 px-3">Direct Link Storage (Hyperlink)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredKeluar.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                      {s.noSuratResmi || s.noDraft}
                    </td>
                    <td className="py-2.5 px-3 font-medium">{s.tujuanPenerima}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate">{s.perihal}</td>
                    <td className="py-2.5 px-3 font-semibold">{s.status}</td>
                    <td className="py-2.5 px-3">{s.penandatanganNama.split(',')[0]}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <a
                        href={s.fileStorageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{s.fileStorageUrl}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 4: Table Rekap Disposisi */}
      {activeReportTab === 'disposisi' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tabel Rekapitulasi Disposisi Pimpinan
              </h3>
              <p className="text-xs text-slate-500">
                Catatan distribusi arahan pimpinan ke bidang-bidang beserta instruksi dan batas penyelesaian
              </p>
            </div>
            <button
              onClick={onExportDisposisiExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              Download Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/70 border-b border-slate-200 font-semibold text-slate-800">
                <tr>
                  <th className="py-2.5 px-3 w-10">No.</th>
                  <th className="py-2.5 px-3">Agenda & Surat</th>
                  <th className="py-2.5 px-3">Tgl Disposisi</th>
                  <th className="py-2.5 px-3">Batas Waktu</th>
                  <th className="py-2.5 px-3">Diteruskan Kepada</th>
                  <th className="py-2.5 px-3">Instruksi Pimpinan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDisposisi.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-mono font-bold text-indigo-700 block">{d.noAgenda}</span>
                      <span className="font-mono text-[10px] text-slate-500">{d.noSurat}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono">{d.tglDisposisi}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-red-600">{d.batasWaktu}</td>
                    <td className="py-2.5 px-3">
                      <div className="space-y-1">
                        {d.targets.map((t) => {
                          const bg = bagianList.find((b) => b.id === t.bagianId);
                          return (
                            <span
                              key={t.bagianId}
                              className="inline-block text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 mr-1"
                            >
                              {bg?.nama || t.bagianId}: <strong>{t.statusTindakLanjut}</strong>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {d.instruksi.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
