export interface InventoryItem {
  id: number;
  jumlah_barang: number;
  nomor_hp_pengirim: string;
  nama_pengirim: string;
  namaBarang: string;
  status_barang: "sedang_dikirim" | "telah_diterima" | "butuh_validasi" | "telah_selesai"
  barang: [{ panjang: string, lebar: string, tinggi: string }],
};