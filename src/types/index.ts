export type UserRole = 'admin' | 'pimpinan' | 'staf';

export interface AppSettings {
  systemName: string;
  systemSubName: string;
  instansiName: string;
  instansiHeader: string;
  alamat: string;
  kota: string;
  provinsi: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  logoType: 'tut_wuri' | 'garuda' | 'kemdikbud' | 'custom';
  customLogoUrl?: string;
  kopSuratFormat: string;
}

export interface Bagian {
  id: string;
  kode: string;
  nama: string;
  kepalaBagian: string;
  keterangan: string;
  warnaBadge?: string;
}

export interface JenisSurat {
  id: string;
  kode: string;
  nama: string;
  kategori: 'masuk' | 'keluar' | 'keduanya';
  keterangan: string;
}

export interface Pegawai {
  id: string;
  nip: string;
  nama: string;
  gelarDepan?: string;
  gelarBelakang?: string;
  jabatan: string;
  bagianId: string;
  email: string;
  noHp: string;
  statusKepegawaian: 'PNS' | 'PPPK' | 'Honorer' | 'Tetap Yayasan';
  isPimpinan?: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  nama: string;
  role: UserRole;
  pegawaiId?: string;
  bagianId?: string; // If staf, tied to a specific bidang
  fotoUrl?: string;
  jabatan: string;
}

export interface LogAkses {
  id: string;
  targetId: string; // suratId or disposisiId
  targetType: 'surat_masuk' | 'surat_keluar' | 'disposisi';
  waktu: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userBagian?: string;
  aktivitas: string;
  ipAddress?: string;
}

export type SifatSurat = 'Biasa' | 'Penting' | 'Sangat Segera' | 'Rahasia';

export interface SuratMasuk {
  id: string;
  noAgenda: string;
  noSurat: string;
  pengirim: string;
  tglSurat: string;
  tglDiterima: string;
  jenisSuratId: string;
  perihal: string;
  isiRingkas: string;
  tujuan: string; // e.g. "Kepala Sekolah"
  sifat: SifatSurat;
  statusSurat: 'Diteruskan' | 'Diarsipkan';
  statusDisposisi: 'Belum Didisposisi' | 'Sudah Didisposisi' | 'Selesai';
  fileName: string;
  fileSize: string;
  fileStorageUrl: string; // Direct storage link for Excel export hyperlink
  fileDataUrl?: string; // Original uploaded file Base64 Data URL
  catatanAdmin?: string;
  createdAt: string;
}

export interface DisposisiTarget {
  bagianId: string;
  statusTindakLanjut: 'Belum Diproses' | 'Dalam Proses' | 'Selesai';
  tglTindakLanjut?: string;
  catatanTindakLanjut?: string;
  petugasTindakLanjut?: string;
}

export interface Disposisi {
  id: string;
  suratMasukId: string;
  noAgenda: string;
  noSurat: string;
  perihal: string;
  pengirim: string;
  tglDisposisi: string;
  batasWaktu: string;
  sifat: SifatSurat;
  pemberiDisposisi: string; // e.g. "Dr. H. Bambang Sudarsono, M.Pd"
  jabatanPemberi: string;
  targets: DisposisiTarget[]; // Multi-bidang recipient
  instruksi: string[]; // e.g. ["Tindak Lanjuti Segera", "Hadiri / Wakili", "Pelajari & Beri Saran"]
  catatanKhusus: string;
  createdAt: string;
}

export type StatusSuratKeluar = 
  | 'Draft' 
  | 'Menunggu TTD' 
  | 'Revisi' 
  | 'Disetujui' 
  | 'Rilis';

export interface SuratKeluar {
  id: string;
  noDraft: string;
  noSuratResmi?: string; // Assigned when released
  jenisSuratId: string;
  perihal: string;
  tujuanPenerima: string;
  tglSurat: string;
  tglRilis?: string;
  sifat: SifatSurat;
  ringkasanIsi: string;
  status: StatusSuratKeluar;
  catatanPimpinan?: string; // Revision notes if rejected or instructions
  penandatanganNama: string;
  penandatanganJabatan: string;
  penandatanganNip: string;
  tglTandaTangan?: string;
  qrCodeToken?: string; // Digital certificate hash
  tokenStatus?: 'Aktif' | 'Dicabut'; // Status keabsahan token (Aktif / Dicabut oleh admin)
  fileName: string;
  fileSize: string;
  fileStorageUrl: string; // Direct storage link for Excel export hyperlink
  fileDataUrl?: string; // Original uploaded file Base64 Data URL
  pembuatDraft: string;
  createdAt: string;
}

export interface ValidationTokenConfig {
  prefix: string; // e.g. "CERT-SMAN1"
  pattern: 'PREFIX_YEAR_RANDOM' | 'PREFIX_RANDOM' | 'PREFIX_MONTHYEAR_RANDOM';
  charType: 'hex' | 'alphanumeric' | 'numeric';
  randomLength: number; // e.g. 8, 10, 12, 16
  validityDurationYears: number; // 0 = Selamanya, 1, 2, 3, 5 tahun
  includeOfficialNumberInQr: boolean;
  verificationDisclaimer: string;
  enablePublicVerification: boolean;
  updatedAt?: string;
  updatedBy?: string;
}
