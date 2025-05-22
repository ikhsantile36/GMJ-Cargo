export interface Pengiriman {
  id: number;
  nomor_resi: string;
  jumlah_barang: number;
  nomor_hp_pengirim: string;
  nama_pengirim: string;
  namaBarang: string;
  status_barang: "sedang_dikirim" | "telah_diterima" | "butuh_validasi" | "telah_selesai"
  barang: [{ panjang: string, lebar: string, tinggi: string }],
  jenis: string;
  alamat_pengiriman: string;
};