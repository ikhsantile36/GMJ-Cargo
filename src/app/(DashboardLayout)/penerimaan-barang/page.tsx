"use client";

import {
  Box,
  Button,
  InputLabel,
  Stack,
  TextField,
  Typography,
  FormControl,
  Paper,
} from "@mui/material";
import { useState } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const MyProfile = () => {
  const [fotoBarang, setFotoBarang] = useState<File | null>(null);
  const [fotoPembayaran, setFotoPembayaran] = useState<File | null>(null);
  const [fotoInvoice, setFotoInvoice] = useState<File | null>(null);
  const [keterangan, setKeterangan] = useState("");

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (fotoBarang) formData.append("foto_barang", fotoBarang);
    if (fotoPembayaran) formData.append("foto_pembayaran", fotoPembayaran);
    if (fotoInvoice) formData.append("foto_invoice", fotoInvoice);
    if (keterangan) formData.append("keterangan", keterangan);

    // fetch("/api/penerimaan", { method: "POST", body: formData });

    console.log("Form submitted");
  };

  return (
      <DashboardCard title="Penerimaan Barang ID">
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 1,
            backgroundColor: "#f9f9f9",
            boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={4}>
              <FormControl>
                <InputLabel shrink htmlFor="foto-barang" sx={{ fontWeight: "bold" }}>
                  Foto Barang
                </InputLabel>
                <input
                  id="foto-barang"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFotoBarang)}
                  style={{ marginTop: "8px" }}
                />
              </FormControl>

              <FormControl>
                <InputLabel shrink htmlFor="foto-pembayaran" sx={{ fontWeight: "bold" }}>
                  Foto Bukti Pembayaran
                </InputLabel>
                <input
                  id="foto-pembayaran"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFotoPembayaran)}
                  style={{ marginTop: "8px" }}
                />
              </FormControl>

              <FormControl >
                <InputLabel shrink htmlFor="foto-invoice" sx={{ fontWeight: "bold" }}>
                  Foto Invoice
                </InputLabel>
                <input
                  id="foto-invoice"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setFotoInvoice)}
                  style={{ marginTop: "8px" }}
                />
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
                <Button type="submit" variant="contained" color="warning">
                  Submit Penerimaan
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </DashboardCard>
  );
};

export default MyProfile;
