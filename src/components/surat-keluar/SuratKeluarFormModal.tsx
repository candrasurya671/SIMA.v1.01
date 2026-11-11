import React, { useState } from 'react';
import { X, Send, FileText, Upload } from 'lucide-react';
import { JenisSurat, SifatSurat, SuratKeluar, UserAccount } from '../../types';
import { WordEditor } from '../common/WordEditor';

interface SuratKeluarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  jenisSuratList: JenisSurat[];
  activeUser: UserAccount;
  pimpinanNama: string;
  pimpinanJabatan: string;
  pimpinanNip: string;
  nextDraftNumber: string;
  onSave: (data: Omit<SuratKeluar, 'id' | 'createdAt'>) => void;
}

export const SuratKeluarFormModal: React.FC<SuratKeluarFormModalProps> = ({
  isOpen,
  onClose,
  jenisSuratList,
  activeUser,
  pimpinanNama,
  pimpinanJabatan,
  pimpinanNip,
  nextDraftNumber,
  onSave,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  const [noDraft, setNoDraft] = useState(nextDraftNumber);
  const [jenisSuratId, setJenisSuratId] = useState(jenisSuratList[0]?.id || '');
  const [perihal, setPerihal] = useState('');
  const [tujuanPenerima, setTujuanPenerima] = useState('');
  const [tglSurat, setTglSurat] = useState(todayStr);
  const [sifat, setSifat] = useState<SifatSurat>('Biasa');
  const [ringkasanIsi, setRingkasanIsi] = useState('');
  const [fileName, setFileName] = useState('Draft_Surat_Keluar_' + Date.now().toString().slice(-4) + '.pdf');
  const [fileSize, setFileSize] = useState('980 KB');
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFileDataUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const storageUrl = `${origin}/?file=${encodeURIComponent(sanitizedFileName)}`;

    onSave({
      noDraft,
      jenisSuratId,
      perihal,
      tujuanPenerima,
      tglSurat,
      sifat,
      ringkasanIsi: ringkasanIsi || perihal,
      status: 'Menunggu TTD',
      penandatanganNama: pimpinanNama,
      penandatanganJabatan: pimpinanJabatan,
      penandatanganNip: pimpinanNip,
      fileName,
      fileSize,
      fileStorageUrl: storageUrl,
      fileDataUrl,
      pembuatDraft: `${activeUser.nama} (${activeUser.jabatan})`,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Input Draft Surat Keluar Baru
            </h3>
            <p className="text-xs text-slate-500">
              Pengajuan konsep surat keluar untuk disetujui & ditandatangani digital oleh Pimpinan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Draft Registrasi:
              </label>
              <input
                type="text"
                value={noDraft}
                onChange={(e) => setNoDraft(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Surat Keluar:
              </label>
              <select
                value={jenisSuratId}
                onChange={(e) => setJenisSuratId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
              >
                {jenisSuratList.map((js) => (
                  <option key={js.id} value={js.id}>
                    {js.kode} - {js.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tujuan / Nama Penerima: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tujuanPenerima}
                onChange={(e) => setTujuanPenerima(e.target.value)}
                placeholder="Contoh: Kepala Dinas Pendidikan / Orang Tua Siswa"
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Surat:
              </label>
              <input
                type="date"
                value={tglSurat}
                onChange={(e) => setTglSurat(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Perihal Surat: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={perihal}
                onChange={(e) => setPerihal(e.target.value)}
                placeholder="Contoh: Permohonan Narasumber Workshop Guru Penggerak"
                required
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Sifat Surat:
              </label>
              <select
                value={sifat}
                onChange={(e) => setSifat(e.target.value as SifatSurat)}
                className="w-full p-2 border border-slate-300 rounded-lg"
              >
                <option value="Biasa">Biasa</option>
                <option value="Penting">Penting</option>
                <option value="Sangat Segera">Sangat Segera</option>
                <option value="Rahasia">Rahasia</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-700">
                Ringkasan Pokok Isi Surat: <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Mendukung Editor Format MS Word (Tabel, Rata Kanan-Kiri, Huruf Tebal & Butir Poin)
              </span>
            </div>
            <WordEditor
              value={ringkasanIsi}
              onChange={setRingkasanIsi}
              placeholder="Ketik uraian pokok isi surat keluar atau buat rincian poin dan tabel layaknya Microsoft Word..."
              minHeight="190px"
            />
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="font-semibold text-slate-800 block mb-1">
              Pejabat Penandatangan Digital (Otomatis Sesuai Pengaturan Pimpinan):
            </span>
            <p className="text-slate-700">
              <strong>{pimpinanNama}</strong> · {pimpinanJabatan} (NIP. {pimpinanNip})
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lampiran Berkas Konsep / PDF Draft:
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="draft-upload"
              />
              <label htmlFor="draft-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-blue-600">Unggah Dokumen Draft PDF</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  File terpilih: <strong>{fileName}</strong> ({fileSize})
                </span>
              </label>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
            >
              Kirim Draft ke Pimpinan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
