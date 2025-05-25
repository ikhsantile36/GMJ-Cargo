"use client";

import {
  Box,
  Button,
  InputLabel,
  Stack,
  TextField,
  FormControl,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const PenerimaanBarang = () => {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [fotoBarang, setFotoBarang] = useState<File | null>(null);
  const [fotoPembayaran, setFotoPembayaran] = useState<File | null>(null);
  const [fotoInvoice, setFotoInvoice] = useState<File | null>(null);
  const [keterangan, setKeterangan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFotoBarang(null);
    setFotoPembayaran(null);
    setFotoInvoice(null);
    setKeterangan("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return alert("ID pengiriman tidak ditemukan");
    if (!fotoBarang || !fotoPembayaran || !fotoInvoice) {
      return alert("Semua foto wajib diunggah.");
    }

    const formData = new FormData();
    formData.append("pengirimanId", id as string);
    formData.append("foto_barang", fotoBarang);
    formData.append("foto_pembayaran", fotoPembayaran);
    formData.append("foto_invoice", fotoInvoice);
    if (keterangan) formData.append("keterangan", keterangan);

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/penerimaan", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Gagal menyimpan data.");

      alert("Penerimaan barang berhasil disimpan!");
      resetForm();
      router.push(`/inventory-barang/`);
    } catch (error: any) {
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardCard title={`Penerimaan Barang ID ${id}`}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={4}>
          <FormControl>
            <InputLabel
              shrink
              htmlFor="foto-barang"
              sx={{ fontWeight: "bold" }}
            >
              Foto Barang
            </InputLabel>
            <input
              id="foto-barang"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setFotoBarang)}
              style={{ marginTop: "8px" }}
            />
            {fotoBarang && (
              <Typography variant="caption" color="text.secondary">
                {fotoBarang.name}
              </Typography>
            )}
          </FormControl>

          <FormControl>
            <InputLabel
              shrink
              htmlFor="foto-pembayaran"
              sx={{ fontWeight: "bold" }}
            >
              Foto Bukti Pembayaran
            </InputLabel>
            <input
              id="foto-pembayaran"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setFotoPembayaran)}
              style={{ marginTop: "8px" }}
            />
            {fotoPembayaran && (
              <Typography variant="caption" color="text.secondary">
                {fotoPembayaran.name}
              </Typography>
            )}
          </FormControl>

          <FormControl>
            <InputLabel
              shrink
              htmlFor="foto-invoice"
              sx={{ fontWeight: "bold" }}
            >
              Foto Invoice
            </InputLabel>
            <input
              id="foto-invoice"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, setFotoInvoice)}
              style={{ marginTop: "8px" }}
            />
            {fotoInvoice && (
              <Typography variant="caption" color="text.secondary">
                {fotoInvoice.name}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Keterangan (Opsional)"
            multiline
            rows={4}
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            fullWidth
          />

          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Submit Penerimaan"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </DashboardCard>
  );
};

export default PenerimaanBarang;
