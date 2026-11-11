import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, X, Printer, Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Pegawai, Bagian, AppSettings } from '../../types';

interface MasterPegawaiProps {
  pegawaiList: Pegawai[];
  bagianList: Bagian[];
  settings: AppSettings;
  onSavePegawaiList: (list: Pegawai[]) => void;
}

export const MasterPegawai: React.FC<MasterPegawaiProps> = ({
  pegawaiList,
  bagianList,
  settings,
  onSavePegawaiList,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null);
  const [search, setSearch] = useState('');

  const [nip, setNip] = useState('');
  const [nama, setNama] = useState('');
  const [gelarDepan, setGelarDepan] = useState('');
  const [gelarBelakang, setGelarBelakang] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [bagianId, setBagianId] = useState(bagianList[0]?.id || '');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');
  const [statusKepegawaian, setStatusKepegawaian] = useState<'PNS' | 'PPPK' | 'Honorer' | 'Tetap Yayasan'>('PNS');

  const handleOpenAdd = () => {
    setEditingPegawai(null);
    setNip('');
    setNama('');
    setGelarDepan('');
    setGelarBelakang('');
    setJabatan('');
    setBagianId(bagianList[0]?.id || '');
    setEmail('');
    setNoHp('');
    setStatusKepegawaian('PNS');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Pegawai) => {
    setEditingPegawai(p);
    setNip(p.nip);
    setNama(p.nama);
    setGelarDepan(p.gelarDepan || '');
    setGelarBelakang(p.gelarBelakang || '');
    setJabatan(p.jabatan);
    setBagianId(p.bagianId);
    setEmail(p.email);
    setNoHp(p.noHp);
    setStatusKepegawaian(p.statusKepegawaian);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data pegawai ini?')) {
      const updated = pegawaiList.filter((p) => p.id !== id);
      onSavePegawaiList(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPegawai) {
      const updated = pegawaiList.map((p) =>
        p.id === editingPegawai.id
          ? {
              ...p,
              nip,
              nama,
              gelarDepan,
              gelarBelakang,
              jabatan,
              bagianId,
              email,
              noHp,
              statusKepegawaian,
            }
          : p
      );
      onSavePegawaiList(updated);
    } else {
      const newPegawai: Pegawai = {
        id: `peg-${Date.now()}`,
        nip,
        nama,
        gelarDepan,
        gelarBelakang,
        jabatan,
        bagianId,
        email,
        noHp,
        statusKepegawaian,
        isPimpinan: false,
      };
      onSavePegawaiList([...pegawaiList, newPegawai]);
    }
    setIsModalOpen(false);
  };

  const handleExportExcel = () => {
    const rows = pegawaiList.map((p, idx) => {
      const bg = bagianList.find((b) => b.id === p.bagianId);
      return {
        'No.': idx + 1,
        'NIP': p.nip,
        'Nama Lengkap': `${p.gelarDepan ? p.gelarDepan + ' ' : ''}${p.nama}${p.gelarBelakang ? ', ' + p.gelarBelakang : ''}`,
        'Jabatan': p.jabatan,
        'Bagian / Unit Kerja': bg ? bg.nama : p.bagianId,
        'Status Kepegawaian': p.statusKepegawaian,
        'Email': p.email,
        'No. HP': p.noHp,
        'Pimpinan Instansi': p.isPimpinan ? 'Ya (Kepala)' : 'Tidak',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 32 },
      { wch: 30 },
      { wch: 30 },
      { wch: 18 },
      { wch: 30 },
      { wch: 16 },
      { wch: 18 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Pegawai');
    XLSX.writeFile(workbook, `Data_Pegawai_${settings.instansiName.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getBagianName = (id: string) => {
    const b = bagianList.find((item) => item.id === id);
    return b ? b.nama : id;
  };

  const filteredList = pegawaiList.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.nip.toLowerCase().includes(search.toLowerCase()) ||
    p.jabatan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Master Data Pegawai & Pejabat Instansi
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan NIP, nama pejabat, jabatan, unit penugasan, serta ekspor cetak data kepegawaian
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Data</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pegawai</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama pegawai, NIP, atau jabatan..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:bg-white focus:border-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs print:border-none">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
            <tr>
              <th className="py-3 px-4 w-12">No.</th>
              <th className="py-3 px-4">NIP</th>
              <th className="py-3 px-4">Nama Lengkap & Gelar</th>
              <th className="py-3 px-4">Jabatan Struktural</th>
              <th className="py-3 px-4">Unit Kerja</th>
              <th className="py-3 px-4">Status & Kontak</th>
              <th className="py-3 px-4 text-right no-print">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredList.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="py-3 px-4 font-mono text-slate-400">{index + 1}</td>
                <td className="py-3 px-4 font-mono text-slate-800">{item.nip}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">
                  {item.gelarDepan ? `${item.gelarDepan} ` : ''}
                  {item.nama}
                  {item.gelarBelakang ? `, ${item.gelarBelakang}` : ''}
                  {item.isPimpinan && (
                    <span className="ml-2 text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 uppercase">
                      Kepala Instansi
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-800">{item.jabatan}</td>
                <td className="py-3 px-4 text-slate-600">{getBagianName(item.bagianId)}</td>
                <td className="py-3 px-4">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 block w-max">
                    {item.statusKepegawaian}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">
                    {item.noHp}
                  </span>
                </td>
                <td className="py-3 px-4 text-right no-print">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!item.isPimpinan && (
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal CRUD Pegawai */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-semibold text-slate-900">
                {editingPegawai ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIP Pegawai: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="19800101 200501 1 001"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Kepegawaian:
                  </label>
                  <select
                    value={statusKepegawaian}
                    onChange={(e) => setStatusKepegawaian(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="Honorer">Honorer / GTT</option>
                    <option value="Tetap Yayasan">Tetap Yayasan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap (Tanpa Gelar): <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Agus Wijaya"
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gelar Depan (Opsional):
                  </label>
                  <input
                    type="text"
                    value={gelarDepan}
                    onChange={(e) => setGelarDepan(e.target.value)}
                    placeholder="Contoh: Drs. / Dr. / Ir."
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Gelar Belakang (Opsional):
                  </label>
                  <input
                    type="text"
                    value={gelarBelakang}
                    onChange={(e) => setGelarBelakang(e.target.value)}
                    placeholder="Contoh: M.Pd / S.Kom / M.Si"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jabatan Struktural: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={jabatan}
                    onChange={(e) => setJabatan(e.target.value)}
                    placeholder="Contoh: Guru Madya / Staf TU"
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Penempatan Bagian / Bidang:
                  </label>
                  <select
                    value={bagianId}
                    onChange={(e) => setBagianId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    {bagianList.map((bg) => (
                      <option key={bg.id} value={bg.id}>
                        {bg.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Pegawai:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@instansi.sch.id"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP:
                  </label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="08123456789"
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
                >
                  Simpan Data Pegawai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
