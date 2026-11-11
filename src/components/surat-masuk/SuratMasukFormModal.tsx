import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { JenisSurat, SifatSurat, SuratMasuk, UserAccount } from '../../types';

interface SuratMasukFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  jenisSuratList: JenisSurat[];
  activeUser: UserAccount;
  pimpinanJabatan: string;
  nextAgendaNumber: string;
  onSave: (data: Omit<SuratMasuk, 'id' | 'createdAt'>) => void;
}

export const SuratMasukFormModal: React.FC<SuratMasukFormModalProps> = ({
  isOpen,
  onClose,
  jenisSuratList,
  activeUser,
  pimpinanJabatan,
  nextAgendaNumber,
  onSave,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().slice(0, 10);

  const [noAgenda, setNoAgenda] = useState(nextAgendaNumber);
  const [noSurat, setNoSurat] = useState('');
  const [pengirim, setPengirim] = useState('');
  const [tglSurat, setTglSurat] = useState(todayStr);
  const [tglDiterima, setTglDiterima] = useState(todayStr);
  const [jenisSuratId, setJenisSuratId] = useState(jenisSuratList[0]?.id || '');
  const [perihal, setPerihal] = useState('');
  const [isiRingkas, setIsiRingkas] = useState('');
  const [tujuan, setTujuan] = useState(pimpinanJabatan || 'Kepala Sekolah');
  const [sifat, setSifat] = useState<SifatSurat>('Biasa');
  const [statusSurat, setStatusSurat] = useState<'Diteruskan' | 'Diarsipkan'>('Diteruskan');
  const [fileName, setFileName] = useState('Surat_Dinas_Masuk_' + Date.now().toString().slice(-4) + '.pdf');
  const [fileSize, setFileSize] = useState('1.1 MB');
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>(undefined);
  const [catatanAdmin, setCatatanAdmin] = useState('');

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
      noAgenda,
      noSurat,
      pengirim,
      tglSurat,
      tglDiterima,
      jenisSuratId,
      perihal,
      isiRingkas,
      tujuan,
      sifat,
      statusSurat,
      statusDisposisi: statusSurat === 'Diarsipkan' ? 'Selesai' : 'Belum Didisposisi',
      fileName,
      fileSize,
      fileStorageUrl: storageUrl,
      fileDataUrl,
      catatanAdmin,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Input Registrasi Surat Masuk
            </h3>
            <p className="text-xs text-slate-500">
              Pencatatan surat masuk kedinasan, agenda, dan unggah berkas digital
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
          {/* Agenda & No Surat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor / Kode Agenda: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={noAgenda}
                onChange={(e) => setNoAgenda(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-mono font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nomor Surat Asli: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={noSurat}
                onChange={(e) => setNoSurat(e.target.value)}
                placeholder="Contoh: 421.3/892/DISDIK/2026"
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-mono text-slate-900"
              />
            </div>
          </div>

          {/* Pengirim & Jenis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Instansi Pengirim: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pengirim}
                onChange={(e) => setPengirim(e.target.value)}
                placeholder="Contoh: Dinas Pendidikan Provinsi"
                required
                className="w-full p-2 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Jenis Surat:
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

          {/* Tanggal Surat & Tanggal Diterima */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Diterima:
              </label>
              <input
                type="date"
                value={tglDiterima}
                onChange={(e) => setTglDiterima(e.target.value)}
                required
                className="w-full p-2 border border-slate-300 rounded-lg font-mono"
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

          {/* Perihal & Tujuan */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Perihal Surat: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={perihal}
              onChange={(e) => setPerihal(e.target.value)}
              placeholder="Contoh: Undangan Rapat Koordinasi Persiapan Asesmen Standar Pendidikan..."
              required
              className="w-full p-2 border border-slate-300 rounded-lg text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Isi Ringkas / Pokok Surat:
            </label>
            <textarea
              rows={3}
              value={isiRingkas}
              onChange={(e) => setIsiRingkas(e.target.value)}
              placeholder="Uraian singkat pokok isi surat dinas..."
              className="w-full p-2.5 border border-slate-300 rounded-lg"
            />
          </div>

          {/* Status Surat Masuk (Diteruskan vs Diarsipkan) */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <label className="block font-semibold text-slate-800 mb-2">
              Status Alur Surat Masuk:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-colors ${
                  statusSurat === 'Diteruskan'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="statusSurat"
                  checked={statusSurat === 'Diteruskan'}
                  onChange={() => setStatusSurat('Diteruskan')}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <p className="font-semibold text-xs">Diteruskan</p>
                  <p className="text-[11px] text-slate-500">
                    Membutuhkan lembar disposisi dan arahan dari Pimpinan / Kepala Instansi.
                  </p>
                </div>
              </label>

              <label
                className={`p-3 rounded-lg border cursor-pointer flex items-start gap-2.5 transition-colors ${
                  statusSurat === 'Diarsipkan'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="statusSurat"
                  checked={statusSurat === 'Diarsipkan'}
                  onChange={() => setStatusSurat('Diarsipkan')}
                  className="mt-0.5 text-emerald-600"
                />
                <div>
                  <p className="font-semibold text-xs">Diarsipkan</p>
                  <p className="text-[11px] text-slate-500">
                    Langsung disimpan sebagai arsip tanpa memerlukan disposisi pimpinan.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Upload File Digital & Link Storage info */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              File Digital Surat (PDF):
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-3 text-center bg-slate-50 hover:bg-slate-100/60 transition-colors">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-blue-600">Pilih Berkas PDF Surat</span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  File saat ini: <strong className="text-slate-700">{fileName}</strong> ({fileSize})
                </span>
              </label>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Lokasi Direct Storage Hyperlink: https://storage.e-surat.id/dokumen/.../{fileName}
            </p>
          </div>

          {/* Catatan Tambahan Admin */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan Admin Persuratan:
            </label>
            <input
              type="text"
              value={catatanAdmin}
              onChange={(e) => setCatatanAdmin(e.target.value)}
              placeholder="Catatan fisik, kurir pengirim, nomor box arsip, dll."
              className="w-full p-2 border border-slate-300 rounded-lg"
            />
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
              Simpan Surat Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
