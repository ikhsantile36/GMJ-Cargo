"use client";

import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

export default function FormBarangPage() {
  const [form, setForm] = useState({
    stt: "",
    jenisBarang: "",
    noHp: "",
    jumlahBarang: "",
    pengirim: "",
    penerimaId: "",
  });

  const [penerimaList, setPenerimaList] = useState([]);

  useEffect(() => {
    const fetchPenerima = async () => {
      try {
        const res = await fetch("/api/pengiriman");
        const data = await res.json();
        setPenerimaList(data);
      } catch (err) {
        console.error("Gagal ambil penerima", err);
      }
    };

    fetchPenerima();
  }, []);

  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/pengiriman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stt: form.stt }),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Gagal update STTB");
      } else {
        alert("STTB berhasil diperbarui");
        console.log("STTB update result:", result);
      }
    } catch (err) {
      console.error("Gagal update STTB:", err);
      alert("Terjadi kesalahan saat mengirim data");
    }
  };

  return (
    <DashboardCard title="Form Pengiriman">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* STT - Full Width */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="STT"
              name="stt"
              value={form.stt}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Kolom 2 per baris */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Jenis Barang"
              name="jenisBarang"
              value={form.jenisBarang}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="No HP"
              name="noHp"
              value={form.noHp}
              onChange={handleChange}
              required
              type="tel"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Jumlah Barang"
              name="jumlahBarang"
              value={form.jumlahBarang}
              onChange={handleChange}
              required
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Pengirim"
              name="pengirim"
              value={form.pengirim}
              onChange={handleChange}
              required
            />
          </Grid>
           <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Penerima"
              name="Penerima"
              value={form.pengirim}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Tombol simpan - full width */}
          <Grid item xs={12}>
            <Button variant="contained" type="submit" fullWidth color="warning"  sx={{mt: 1}}>
              Simpan
            </Button>
          </Grid>
        </Grid>
      </form>
    </DashboardCard>
  );
}