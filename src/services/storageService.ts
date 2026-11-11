import * as XLSX from 'xlsx';
import { 
  AppSettings, 
  Bagian, 
  JenisSurat, 
  Pegawai, 
  UserAccount, 
  SuratMasuk, 
  Disposisi, 
  SuratKeluar, 
  LogAkses,
  UserRole,
  ValidationTokenConfig
} from '../types';
import { 
  initialSettings, 
  initialBagian, 
  initialJenisSurat, 
  initialPegawai, 
  initialUserAccounts, 
  initialSuratMasuk, 
  initialDisposisi, 
  initialSuratKeluar, 
  initialLogs,
  initialValidationTokenConfig
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'simas_app_settings_v1',
  TOKEN_CONFIG: 'simas_token_config_v1',
  BAGIAN: 'simas_master_bagian_v1',
  JENIS_SURAT: 'simas_master_jenis_surat_v1',
  PEGAWAI: 'simas_master_pegawai_v1',
  USERS: 'simas_user_accounts_v1',
  SURAT_MASUK: 'simas_surat_masuk_v1',
  DISPOSISI: 'simas_disposisi_v1',
  SURAT_KELUAR: 'simas_surat_keluar_v1',
  LOGS: 'simas_logs_akses_v1',
  ACTIVE_USER: 'simas_active_user_v1',
  IS_LOGGED_IN: 'simas_is_logged_in_v1',
};

// Safe storage getter
function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  // Settings
  getSettings(): AppSettings {
    return getStoredItem<AppSettings>(STORAGE_KEYS.SETTINGS, initialSettings);
  },
  saveSettings(settings: AppSettings): void {
    setStoredItem(STORAGE_KEYS.SETTINGS, settings);
  },

  // Pengaturan Token Validasi (Admin)
  getTokenConfig(): ValidationTokenConfig {
    return getStoredItem<ValidationTokenConfig>(STORAGE_KEYS.TOKEN_CONFIG, initialValidationTokenConfig);
  },
  saveTokenConfig(config: ValidationTokenConfig): void {
    setStoredItem(STORAGE_KEYS.TOKEN_CONFIG, config);
  },
  generateValidationToken(customConfig?: ValidationTokenConfig): string {
    const config = customConfig || this.getTokenConfig();
    let charSet = '0123456789ABCDEF';
    if (config.charType === 'alphanumeric') {
      charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    } else if (config.charType === 'numeric') {
      charSet = '0123456789';
    }

    const length = Math.max(6, Math.min(32, config.randomLength || 12));
    let rand = '';
    for (let i = 0; i < length; i++) {
      rand += charSet[Math.floor(Math.random() * charSet.length)];
    }

    const year = new Date().getFullYear().toString();
    const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const prefix = (config.prefix || 'CERT').trim();

    if (config.pattern === 'PREFIX_RANDOM') {
      return `${prefix}-${rand}`;
    }
    if (config.pattern === 'PREFIX_MONTHYEAR_RANDOM') {
      return `${prefix}-${month}${year}-${rand}`;
    }
    // Default: PREFIX_YEAR_RANDOM
    return `${prefix}-${year}-${rand}`;
  },

  // Auth & Session
  isLoggedIn(): boolean {
    return getStoredItem<boolean>(STORAGE_KEYS.IS_LOGGED_IN, true);
  },
  setLoggedIn(status: boolean): void {
    setStoredItem(STORAGE_KEYS.IS_LOGGED_IN, status);
  },

  // Active User / Role Session
  getActiveUser(): UserAccount {
    return getStoredItem<UserAccount>(STORAGE_KEYS.ACTIVE_USER, initialUserAccounts[0]);
  },
  setActiveUser(user: UserAccount): void {
    setStoredItem(STORAGE_KEYS.ACTIVE_USER, user);
  },

  // Master Bagian
  getBagianList(): Bagian[] {
    return getStoredItem<Bagian[]>(STORAGE_KEYS.BAGIAN, initialBagian);
  },
  saveBagianList(list: Bagian[]): void {
    setStoredItem(STORAGE_KEYS.BAGIAN, list);
  },

  // Master Jenis Surat
  getJenisSuratList(): JenisSurat[] {
    return getStoredItem<JenisSurat[]>(STORAGE_KEYS.JENIS_SURAT, initialJenisSurat);
  },
  saveJenisSuratList(list: JenisSurat[]): void {
    setStoredItem(STORAGE_KEYS.JENIS_SURAT, list);
  },

  // Master Pegawai
  getPegawaiList(): Pegawai[] {
    return getStoredItem<Pegawai[]>(STORAGE_KEYS.PEGAWAI, initialPegawai);
  },
  savePegawaiList(list: Pegawai[]): void {
    setStoredItem(STORAGE_KEYS.PEGAWAI, list);
  },

  // User Accounts
  getUserAccounts(): UserAccount[] {
    return getStoredItem<UserAccount[]>(STORAGE_KEYS.USERS, initialUserAccounts);
  },
  saveUserAccounts(list: UserAccount[]): void {
    setStoredItem(STORAGE_KEYS.USERS, list);
  },

  // Surat Masuk
  getSuratMasukList(): SuratMasuk[] {
    const list = getStoredItem<SuratMasuk[]>(STORAGE_KEYS.SURAT_MASUK, initialSuratMasuk);
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    return list.map((item) => {
      if (!item.fileStorageUrl || item.fileStorageUrl.includes('storage.e-surat.id')) {
        return {
          ...item,
          fileStorageUrl: `${origin}/?doc=${item.id}&type=masuk&file=${encodeURIComponent(item.fileName)}`,
        };
      }
      return item;
    });
  },
  saveSuratMasukList(list: SuratMasuk[]): void {
    setStoredItem(STORAGE_KEYS.SURAT_MASUK, list);
  },

  // Disposisi
  getDisposisiList(): Disposisi[] {
    return getStoredItem<Disposisi[]>(STORAGE_KEYS.DISPOSISI, initialDisposisi);
  },
  saveDisposisiList(list: Disposisi[]): void {
    setStoredItem(STORAGE_KEYS.DISPOSISI, list);
  },

  // Surat Keluar
  getSuratKeluarList(): SuratKeluar[] {
    const list = getStoredItem<SuratKeluar[]>(STORAGE_KEYS.SURAT_KELUAR, initialSuratKeluar);
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    return list.map((item) => {
      let qrCodeToken = item.qrCodeToken;
      if (qrCodeToken === 'CERT-SMAN1-2026-9A82F1D0B7C4') {
        qrCodeToken = 'CERT-AF3-2026-908B298EF2F5';
      }
      if (!item.fileStorageUrl || item.fileStorageUrl.includes('storage.e-surat.id')) {
        return {
          ...item,
          qrCodeToken,
          fileStorageUrl: `${origin}/?doc=${item.id}&type=keluar&file=${encodeURIComponent(item.fileName)}`,
        };
      }
      return {
        ...item,
        qrCodeToken,
      };
    });
  },
  saveSuratKeluarList(list: SuratKeluar[]): void {
    setStoredItem(STORAGE_KEYS.SURAT_KELUAR, list);
  },

  // Logs
  getLogs(): LogAkses[] {
    return getStoredItem<LogAkses[]>(STORAGE_KEYS.LOGS, initialLogs);
  },
  recordLog(log: Omit<LogAkses, 'id' | 'waktu'>): void {
    const logs = this.getLogs();
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
    const newLog: LogAkses = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      waktu: formattedDate,
      ipAddress: log.ipAddress || '192.168.1.' + Math.floor(Math.random() * 50 + 10),
    };
    logs.unshift(newLog);
    // Keep last 300 logs
    setStoredItem(STORAGE_KEYS.LOGS, logs.slice(0, 300));
  },

  // Reset to default
  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.BAGIAN);
    localStorage.removeItem(STORAGE_KEYS.JENIS_SURAT);
    localStorage.removeItem(STORAGE_KEYS.PEGAWAI);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.SURAT_MASUK);
    localStorage.removeItem(STORAGE_KEYS.DISPOSISI);
    localStorage.removeItem(STORAGE_KEYS.SURAT_KELUAR);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  },

  // EXCEL EXPORT WITH DIRECT HYPERLINK TO DIGITAL FILE STORAGE
  exportSuratMasukToExcel(data: SuratMasuk[], settings: AppSettings): void {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const rows = data.map((item, index) => {
      const activeStorageUrl = (!item.fileStorageUrl || item.fileStorageUrl.includes('storage.e-surat.id'))
        ? `${origin}/?doc=${item.id}&type=masuk&file=${encodeURIComponent(item.fileName)}`
        : item.fileStorageUrl;

      return {
        'No.': index + 1,
        'No. Agenda': item.noAgenda,
        'No. Surat': item.noSurat,
        'Tanggal Surat': item.tglSurat,
        'Tanggal Diterima': item.tglDiterima,
        'Pengirim': item.pengirim,
        'Perihal': item.perihal,
        'Sifat Surat': item.sifat,
        'Status Surat': item.statusSurat,
        'Status Disposisi': item.statusDisposisi,
        'Nama File Digital': item.fileName,
        'Link File Storage (Hyperlink)': {
          t: 's',
          v: activeStorageUrl,
          l: { Target: activeStorageUrl, Tooltip: 'Klik untuk membuka berkas PDF resmi' }
        },
        'Waktu Input': item.createdAt,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Apply hyperlink formatting and column widths
    const colWidths = [
      { wch: 6 },  // No.
      { wch: 18 }, // No. Agenda
      { wch: 25 }, // No. Surat
      { wch: 14 }, // Tgl Surat
      { wch: 14 }, // Tgl Terima
      { wch: 30 }, // Pengirim
      { wch: 45 }, // Perihal
      { wch: 14 }, // Sifat
      { wch: 14 }, // Status
      { wch: 20 }, // Disposisi
      { wch: 30 }, // File
      { wch: 65 }, // Link Hyperlink
      { wch: 20 }, // Waktu
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Surat Masuk');

    const fileName = `Rekap_Surat_Masuk_${settings.instansiName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  },

  exportSuratKeluarToExcel(data: SuratKeluar[], settings: AppSettings): void {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
    const rows = data.map((item, index) => {
      const activeStorageUrl = (!item.fileStorageUrl || item.fileStorageUrl.includes('storage.e-surat.id'))
        ? `${origin}/?doc=${item.id}&type=keluar&file=${encodeURIComponent(item.fileName)}`
        : item.fileStorageUrl;

      return {
        'No.': index + 1,
        'No. Draft': item.noDraft,
        'No. Surat Resmi': item.noSuratResmi || 'Belum Dirilis (Draft)',
        'Tanggal Surat': item.tglSurat,
        'Tujuan / Penerima': item.tujuanPenerima,
        'Perihal': item.perihal,
        'Sifat': item.sifat,
        'Status Dokumen': item.status,
        'Penandatangan': `${item.penandatanganNama} (${item.penandatanganJabatan})`,
        'Token Digital Sign': item.qrCodeToken || '-',
        'Tanggal TTD / Rilis': item.tglRilis || item.tglTandaTangan || '-',
        'Nama File Digital': item.fileName,
        'Link File Storage (Hyperlink)': {
          t: 's',
          v: activeStorageUrl,
          l: { Target: activeStorageUrl, Tooltip: 'Klik untuk membuka berkas PDF resmi' }
        },
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const colWidths = [
      { wch: 6 },  // No.
      { wch: 18 }, // No. Draft
      { wch: 26 }, // No. Surat Resmi
      { wch: 14 }, // Tgl Surat
      { wch: 30 }, // Tujuan
      { wch: 45 }, // Perihal
      { wch: 14 }, // Sifat
      { wch: 16 }, // Status
      { wch: 32 }, // Penandatangan
      { wch: 26 }, // Token
      { wch: 20 }, // Tgl Rilis
      { wch: 30 }, // File
      { wch: 55 }, // Link Hyperlink
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Surat Keluar');

    const fileName = `Rekap_Surat_Keluar_${settings.instansiName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  },

  exportDisposisiToExcel(data: Disposisi[], bagianList: Bagian[], settings: AppSettings): void {
    const rows = data.map((item, index) => {
      const bidangNames = item.targets
        .map(t => {
          const bg = bagianList.find(b => b.id === t.bagianId);
          return `${bg ? bg.nama : t.bagianId} [${t.statusTindakLanjut}]`;
        })
        .join(', ');

      return {
        'No.': index + 1,
        'No. Agenda': item.noAgenda,
        'No. Surat Masuk': item.noSurat,
        'Perihal Surat': item.perihal,
        'Pengirim': item.pengirim,
        'Tanggal Disposisi': item.tglDisposisi,
        'Batas Penyelesaian': item.batasWaktu,
        'Sifat': item.sifat,
        'Pemberi Disposisi': item.pemberiDisposisi,
        'Diteruskan Kepada (Bidang)': bidangNames,
        'Instruksi': item.instruksi.join('; '),
        'Catatan Khusus Pimpinan': item.catatanKhusus,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 18 },
      { wch: 26 },
      { wch: 40 },
      { wch: 28 },
      { wch: 15 },
      { wch: 18 },
      { wch: 14 },
      { wch: 26 },
      { wch: 45 },
      { wch: 40 },
      { wch: 45 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Disposisi');

    const fileName = `Rekap_Disposisi_${settings.instansiName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  },
};
