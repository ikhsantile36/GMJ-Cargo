"use client";

import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Pengiriman } from "@/app/types/pengiriman";
import { Barang } from "@/app/types/barang";
import dayjs from "dayjs";

export default function InvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState<Pengiriman | null>(null);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [manualJumlah, setManualJumlah] = useState<number | null>(null);
  const [manualTanggal, setManualTanggal] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const resPengiriman = await fetch(`/api/pengiriman/${id}`);
        const pengirimanData: Pengiriman = await resPengiriman.json();
        setData(pengirimanData);

        const resBarang = await fetch(`/api/barang`);
        const barangResponse = await resBarang.json();

        const filtered = barangResponse.data.filter(
          (item: Barang) => item.stt === pengirimanData.sttb
        );
        setBarangList(filtered);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const subtotal = barangList.reduce(
    (sum, barang) => sum + (barang.tagihan || 0),
    0
  );
  const biayaAdmin = data?.biaya_admin || 0;
  const total = subtotal + biayaAdmin;

  const finalTanggal =
    manualTanggal ||
    (data?.createdAt
      ? dayjs(data.createdAt).format("D MMMM YYYY")
      : dayjs().format("D MMMM YYYY")); // fallback ke sekarang

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={2}
        className="noPrint"
      >
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          color="error"
        >
          Kembali
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={() => window.print()}
        >
          Print Invoice
        </Button>
      </Box>

      <Box className="printArea">
        <Paper elevation={3} sx={{ p: 4 }}>
          {/* Header */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" justifyContent="center">
              <img
                src="/GMJ-logo-1.png"
                alt="Logo GMJ"
                style={{ height: 80, marginRight: 16 }}
              />
              <Box textAlign="left">
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ fontSize: "1.8rem" }}
                >
                  PT GEMILANG MARIO JAYA
                </Typography>
                <Typography variant="subtitle1" fontWeight="medium">
                  JASA PENGIRIMAN TRANSPORTASI
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              fontStyle="italic"
              align="center"
              sx={{ mt: 1 }}
            >
              Kantor Pusat : Jl. KH. Mas Mansyur, Kebon Kacang V No. 29 Tanah
              Abang - Jakarta Pusat. Telp./Fax : (021) 31922131 - 08111352477
            </Typography>
            <Divider sx={{ borderBottom: "2px solid black", my: 1 }} />
            <Divider sx={{ borderBottom: "3px double black", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" align="center">
              INVOICE
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Freight Service:</Typography>
                  <input
                    type="text"
                    placeholder="Isi Freight Service"
                    style={{
                      border: "none",
                      borderBottom: "1px solid black",
                      outline: "none",
                      width: "200px",
                    }}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Date of Service:</Typography>
                  <input
                    type="text"
                    placeholder={
                      data?.createdAt
                        ? dayjs(data.createdAt).format("D MMMM YYYY")
                        : "Contoh: 20 Juni 2025"
                    }
                    style={{
                      border: "none",
                      borderBottom: "1px solid black",
                      outline: "none",
                      width: "200px",
                    }}
                  />
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">Origin:</Typography>
                  <input
                    type="text"
                    placeholder="Jakarta"
                    style={{
                      border: "none",
                      borderBottom: "1px solid black",
                      outline: "none",
                      width: "200px",
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Table */}
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table size="small" sx={{ border: "1px solid black" }}>
              <TableHead>
                <TableRow>
                  <TableCell rowSpan={2} sx={{ border: "1px solid black" }}>
                    NO STTB
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Shipper
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Consignee
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Destination
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Jenis
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Qty
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Other
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Unit Price
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    IDR
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Amount
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Merk
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Pengirim
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Tujuan
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Barang
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Jumlah
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    KG/M3
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Harga/M3
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    RP
                  </TableCell>
                  <TableCell align="center" sx={{ border: "1px solid black" }}>
                    Tagihan
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ border: "1px solid black" }}
                    className="noPrint"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {barangList.map((barang, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <input
                        value={index === 0 ? data?.sttb : ""}
                        disabled
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "100%",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <input
                        value={index === 0 ? data?.nama_pengirim : ""}
                        disabled
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "100%",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <input
                        value={index === 0 ? data?.nama_penerima : ""}
                        disabled
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "100%",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <input
                        value={index === 0 ? data?.wilayah : ""}
                        disabled
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "100%",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <input
                        value={index === 0 ? barang.jenis_kiriman : ""}
                        disabled
                        style={{
                          border: "none",
                          background: "transparent",
                          width: "100%",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <input
                        type="number"
                        value={
                          index === 0 ? manualJumlah ?? barangList.length : ""
                        }
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setManualJumlah(isNaN(val) ? null : val);
                        }}
                        style={{
                          border: "none",
                          outline: "none",
                          background: "transparent",
                          width: "100%",
                          textAlign: "center",
                          fontWeight: "normal",
                          fontFamily: "inherit",
                          WebkitAppearance: "none",
                          MozAppearance: "textfield",
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ border: "1px solid black" }}>
                      <input
                        type="number"
                        value={barang.kg || barang.m3 || 0}
                        onChange={(e) => {
                          const updated = [...barangList];
                          updated[index].kg = parseFloat(e.target.value);
                          setBarangList(updated);
                        }}
                        style={{
                          border: "none",
                          outline: "none",
                          width: "100%",
                          fontWeight: "normal",
                          fontFamily: "inherit",
                          WebkitAppearance: "none",
                          MozAppearance: "textfield",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      <input
                        type="number"
                        value={barang.tagihan || 0}
                        onChange={(e) => {
                          const updated = [...barangList];
                          updated[index].tagihan =
                            parseInt(e.target.value) || 0;
                          setBarangList(updated);
                        }}
                        style={{
                          border: "none",
                          outline: "none",
                          width: "100%",
                          fontWeight: "normal",
                          fontFamily: "inherit",
                          WebkitAppearance: "none",
                          MozAppearance: "textfield",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      Rp {barang.tagihan?.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {index === 0 ? data?.biaya : ""}
                    </TableCell>

                    <TableCell
                      sx={{ border: "1px solid black" }}
                      className="noPrint"
                    >
                      <button
                        onClick={() => {
                          const updated = barangList.filter(
                            (_, i) => i !== index
                          );
                          setBarangList(updated);
                        }}
                        className="noPrint"
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "4px 8px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        Hapus
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Pembayaran Info */}
          <Box mt={3}>
            <Typography variant="caption">
              Pembayaran dapat dilakukan via transfer ke:
              <br />
              REK. BANK BNI: 0169302862 a/n H. ANDI CAKRAWALI.,SE
              <br />
              REK. BANK MANDIRI: 162 000 7708 245 a/n H. ANDI CAKRAWALI.,SE
              <br />
              REK. BANK BRI: 0532 01003488 501 a/n H. ANDI CAKRAWALI.,SE
              <br />
              REK. BANK BRI: 0532 01000712 309 a/n PT. GEMILANG MARIO JAYA
            </Typography>
          </Box>

          {/* Total Summary */}
          <Box display="flex" justifyContent="flex-end" mt={4}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell align="right">SUBTOTAL</TableCell>
                  <TableCell align="right">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">BIAYA ADMIN</TableCell>
                  <TableCell align="right">
                    Rp {biayaAdmin.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="right">
                    <strong>TOTAL</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>Rp {total.toLocaleString("id-ID")}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          {/* Tanda Tangan */}
          <Box mt={4} display="flex" justifyContent="flex-end">
            <Box textAlign="center">
              <Typography variant="body2" className="onlyPrint">Jakarta, {finalTanggal}</Typography>
              <input
                type="text"
                placeholder={dayjs(data?.createdAt || new Date()).format(
                  "D MMMM YYYY"
                )}
                value={manualTanggal}
                onChange={(e) => setManualTanggal(e.target.value)}
                style={{
                  border: "none",
                  borderBottom: "1px solid black",
                  outline: "none",
                  width: "200px",
                  fontFamily: "inherit",
                  fontSize: "inherit",
                  background: "transparent",
                }}
                className="noPrint" // tidak dicetak
              />
              <Typography variant="body2" className="onlyPrint">
                
              </Typography>
              <img src="/ttd.jpg" alt="Tanda Tangan" style={{ width: 150 }} />
              <Typography variant="body2" fontWeight="bold">
                H. ANDI CAKRAWALI, SE
              </Typography>
              <Typography variant="body2">Direktur</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
