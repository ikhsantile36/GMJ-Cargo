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
  Button
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Pengiriman } from "@/app/types/pengiriman";
import { Barang } from "@/app/types/barang";



export default function InvoicePage() {
  const { id } = useParams();
  const [data, setData] = useState<Pengiriman | null>(null);
  const [barangList, setBarangList] = useState<Barang[]>([]);

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
  useEffect(() => {
    if (!id) return;

    fetch(`/api/pengiriman/${id}`)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error fetching data pengiriman:", err));

    fetch(`/api/barang`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DATA BARANG DARI API:", data); // ← log dulu isinya
        const filtered = data.filter(
          (item: Barang) => item.pengirimanId === Number(id)
        );
        setBarangList(filtered);
      })
      .catch((err) => console.error("Error fetching barang:", err));
  }, [id]);

  return (
  <>
    {/* Tombol Aksi - Tidak Akan Dicetak */}
    <Box display="flex" justifyContent="space-between" mb={2} className="noPrint">
      <Button variant="outlined" onClick={() => window.history.back()} color="error">
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

    {/* Area yang Dicetak */}
    <Box className="printArea" p={4}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header & Logo */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <img src="/gmj-logo-1.png" alt="Logo GMJ" style={{ height: 50 }} />
            <Typography variant="h6" fontWeight="bold">
              GMJ CARGO
            </Typography>
            <Typography variant="body2">
              Jasa Pengiriman Expedisi Cargo
              <br />
              Kantor Pusat: Jl. KH. Mas Mansyur, Kebon Kacang V No. 29 Tanah Abang - Jakarta Pusat
              <br />
              Telp : 0811-1352-477
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Info Pengiriman */}
        <Box mb={2}>
          <Typography variant="body2">Freight Service</Typography>
          <Typography variant="body2">
            Date of Service :{" "}
            <b>{data?.createdAt
              ? new Date(data.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : "-"}</b>
          </Typography>
          <Typography variant="body2">
            Destination : <b>Jakarta - {data?.wilayah || ""}</b>
          </Typography>
        </Box>

        {/* Tabel Invoice */}
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="small" sx={{ border: "1px solid black", minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell rowSpan={2} sx={{ border: "1px solid black" }}>NO STTB</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Shipper</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Consignee</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Destination</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Jenis</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Qty</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Other</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Unit Price</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>IDR</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Amount</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Merk</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Pengirim</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Tujuan</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Barang</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Jumlah</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>KG/M3</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Harga/M3</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>RP</TableCell>
                <TableCell align="center" sx={{ border: "1px solid black" }}>Tagihan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {barangList.map((barang, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: "1px solid black" }}>{index === 0 ? data?.sttb : ""}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{index === 0 ? data?.nama_pengirim : ""}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{index === 0 ? data?.nama_penerima : ""}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{index === 0 ? data?.wilayah : ""}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{barang.jenis_kiriman}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{index === 0 ? data?.jumlah_barang : ""}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{barang.kg || barang.m3}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{barang.tagihan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{barang.tagihan?.toLocaleString()}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>{index === 0 ? data?.biaya : ""}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ border: "1px solid black", backgroundColor: "#f0f0f0" }}>
                  <b>TOTAL</b>
                </TableCell>
                <TableCell colSpan={2} sx={{ border: "1px solid black" }}>
                  <b>{data?.biaya?.toLocaleString("id-ID") || "-"}</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Footer */}
        <Box mt={2}>
          <Typography variant="body2">
            Pembayaran dapat dilakukan via transfer ke : <b>ADMIN</b>
            <br />
            REK. BANK BRI : <b>200601008318508</b> a/n <b>FERI SETIAWAN</b>
          </Typography>
        </Box>

        {/* Total Section */}
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Table size="small">
            <TableBody>
              <TableRow><TableCell align="right">SUBTOTAL</TableCell><TableCell align="right">Rp</TableCell></TableRow>
              <TableRow><TableCell align="right">DP</TableCell><TableCell align="right">Rp</TableCell><TableCell align="right">-</TableCell></TableRow>
              <TableRow><TableCell align="right">BIAYA PACKING</TableCell><TableCell align="right">Rp</TableCell><TableCell align="right">-</TableCell></TableRow>
              <TableRow><TableCell align="right">PPN 10%</TableCell><TableCell align="right">Rp</TableCell><TableCell align="right">-</TableCell></TableRow>
              <TableRow>
                <TableCell align="right"><b>TOTAL</b></TableCell>
                <TableCell align="right">Rp</TableCell>
                <TableCell align="right">
                  <b>{barangList.reduce((sum, barang) => sum + (barang.tagihan || 0), 0).toLocaleString("id-ID")}</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>

        {/* Tanda Tangan */}
        <Box mt={4} display="flex" justifyContent="flex-end">
          <Box textAlign="center">
            <Typography variant="body2">
              Jakarta,{" "}
              {data?.createdAt &&
                new Date(data.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
            </Typography>
            <Box>
              <img src="/ttd.jpg" alt="Tanda Tangan" style={{ width: 150 }} />
            </Box>
            <Typography variant="body2" fontWeight="bold">H. ANDI CAKRAWALI .SE</Typography>
            <Typography variant="body2">Direktur</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  </>
);

}
