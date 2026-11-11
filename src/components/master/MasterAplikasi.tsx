import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Building, Globe, Mail, Phone, MapPin, Check } from 'lucide-react';
import { AppSettings } from '../../types';
import { InstitutionLogo } from '../common/InstitutionLogo';

interface MasterAplikasiProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onResetDefault: () => void;
}

export const MasterAplikasi: React.FC<MasterAplikasiProps> = ({
  settings,
  onSave,
  onResetDefault,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Pengaturan Master Sistem & Identitas Instansi
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Perubahan pada pengaturan ini berlaku secara dinamis di seluruh nama sistem, kop surat, lembar disposisi, dan sertifikat tanda tangan digital.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-in fade-in duration-100">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Pengaturan instansi dan sistem berhasil diperbarui dan diterapkan menyeluruh!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-6 text-xs">
        {/* System Name & Branding */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            1. Nama Sistem & Aplikasi (Dinamis Master Admin)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Nama Sistem / Aplikasi: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.systemName}
                onChange={(e) => setFormData({ ...formData, systemName: e.target.value })}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Ditampilkan di header atas, tab browser, dan identitas navigasi.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Deskripsi / Sub-Judul Sistem:
              </label>
              <input
                type="text"
                value={formData.systemSubName}
                onChange={(e) => setFormData({ ...formData, systemSubName: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Institution Info & Kop Surat */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            2. Identitas Instansi & Header Kop Surat Kedinasan
          </h2>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Header Kop Atas (Kementerian / Pemerintah Daerah / Dinas Pembina):
              </label>
              <textarea
                rows={2}
                value={formData.instansiHeader}
                onChange={(e) => setFormData({ ...formData, instansiHeader: e.target.value })}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Gunakan baris baru (Enter) jika terdiri dari 2 tingkat instansi dinas.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Resmi Instansi / Satuan Pendidikan: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.instansiName}
                  onChange={(e) => setFormData({ ...formData, instansiName: e.target.value })}
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 font-extrabold uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilihan Lambang / Logo Instansi:
                </label>
                <div className="flex items-center gap-4">
                  <select
                    value={formData.logoType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        logoType: e.target.value as 'tut_wuri' | 'garuda' | 'kemdikbud' | 'custom',
                      })
                    }
                    className="flex-1 p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="tut_wuri">Logo Tut Wuri Handayani (Pendidikan)</option>
                    <option value="garuda">Lambang Garuda Pancasila (Kedinasan)</option>
                    <option value="custom">URL Gambar Custom Logo</option>
                  </select>
                  <div className="p-1 border border-slate-200 rounded bg-slate-50">
                    <InstitutionLogo
                      type={formData.logoType}
                      customUrl={formData.customLogoUrl}
                      size={36}
                    />
                  </div>
                </div>
              </div>
            </div>

            {formData.logoType === 'custom' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  URL Custom Logo Instansi:
                </label>
                <input
                  type="url"
                  value={formData.customLogoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, customLogoUrl: e.target.value })}
                  placeholder="https://.../logo.png"
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Jalan & Nomor Gedung:
              </label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                required
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten:</label>
                <input
                  type="text"
                  value={formData.kota}
                  onChange={(e) => setFormData({ ...formData, kota: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Provinsi:</label>
                <input
                  type="text"
                  value={formData.provinsi}
                  onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kode Pos:</label>
                <input
                  type="text"
                  value={formData.kodePos}
                  onChange={(e) => setFormData({ ...formData, kodePos: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telepon / Fax:</label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Resmi:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website Resmi:</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Box of Kop Surat */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            Pratinjau Langsung Kop Surat Resmi
          </h2>
          <div className="mt-4 p-6 bg-slate-50 border border-slate-300 rounded-lg text-slate-900">
            <div className="flex items-center gap-4 pb-3 border-b-2 border-slate-900 text-center">
              <InstitutionLogo
                type={formData.logoType}
                customUrl={formData.customLogoUrl}
                size={55}
              />
              <div className="flex-1">
                <p className="text-[11px] font-bold tracking-wider uppercase text-slate-700 whitespace-pre-line leading-tight">
                  {formData.instansiHeader}
                </p>
                <h3 className="text-sm font-extrabold tracking-tight text-slate-900 uppercase mt-0.5">
                  {formData.instansiName}
                </h3>
                <p className="text-[10px] text-slate-600 leading-tight mt-0.5">
                  {formData.alamat}, {formData.kota}, {formData.provinsi} {formData.kodePos}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">
                  Telp: {formData.telepon} · Email: {formData.email} · Web: {formData.website}
                </p>
              </div>
            </div>
            <div className="h-0.5 bg-slate-900 mt-0.5" />
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset seluruh pengaturan instansi ke konfigurasi default?')) {
                onResetDefault();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset ke Pengaturan Default</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Sistem</span>
          </button>
        </div>
      </form>
    </div>
  );
};
