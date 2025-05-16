export interface InventoryItem {
  id: number;
  namaBarang: string;
  status: "sedang dikirim" | "telah diterima" | "butuh validasi" | "telah selesai";
}