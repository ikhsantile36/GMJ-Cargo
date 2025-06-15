export interface Barang {
  biaya_satuan: any;
  id: number;
  tgl?: string; // ISO string format (DateTime)
  hari?: string;
  stt?: string;
  tujuan?: string;
  penerima_dan_hp?: string;
  pengirim_dan_hp?: string;
  jenis_kiriman?: string;
  catatan?: string;
  koli?: number;
  panjang?: number;
  lebar?: number;
  tinggi?: number;
  m3?: number;
  vw?: number;
  kg?: number;
  tagihan?: number;
  alamat?: string;

  pengirimanId?: number;
}