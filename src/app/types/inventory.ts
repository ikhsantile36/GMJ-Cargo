export interface InventoryItem {
  nomor_hp_pengirim: string;
  nama_pengirim: string;
  id: number;
  namaBarang: string;
  status_barang: "sedang dikirim" | "telah diterima" | "butuh validasi" | "telah selesai";
  barang: { panjang: string, lebar: string, tinggi: string },
};