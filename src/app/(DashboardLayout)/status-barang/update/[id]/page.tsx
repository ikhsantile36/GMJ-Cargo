"use client";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateInventoriClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [lokasi, setLokasi] = useState("");
  const [status, setStatus] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pengirimanRes, statusRes] = await Promise.all([
          fetch(`/api/pengiriman/${id}`),
          fetch("/api/status-barang"),
        ]);

        const pengirimanData = await pengirimanRes.json();
        const statusData = await statusRes.json();

        setData(pengirimanData);
        setStatus(pengirimanData.status_barang);
        setStatusOptions(
          statusData.filter(
            (status: string) =>
              status === "sedang_dikirim" || status === "telah_diterima"
          )
        );

        console.log("Status Options:", statusData);
      } catch (error) {
        console.error("Gagal fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("lokasi", lokasi);
    formData.append("status_barang", status);
    formData.append("keterangan", keterangan);
    formData.append("nomor_resi", data?.nomor_resi || ""); // gunakan nomor_resi dari data

    if (foto) {
      formData.append("foto", foto);
    }

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Tracking berhasil disimpan!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Update Inventori - ID: {id}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : !data ? (
        <Typography color="error">
          Data tidak ditemukan atau terjadi kesalahan.
        </Typography>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mt: 2,
            fontSize: "0.95rem",
          }}
        >
          <Table sx={{ maxWidth: 600 }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: "150px", fontWeight: "bold" }}>
                  Nama Pengirim
                </TableCell>
                <TableCell>: {data.nama_pengirim}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ width: "150px", fontWeight: "bold" }}>
                  Nama Penerima
                </TableCell>
                <TableCell>: {data.nama_penerima}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Nomor HP</TableCell>
                <TableCell>: {data.nomor_hp_pengirim}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                <TableCell>: {data.status_barang}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Jumlah Barang</TableCell>
                <TableCell>: {data.jumlah_barang}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Nomor Resi</TableCell>
                <TableCell>: {data.nomor_resi || "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Barang yang Dikirim:
          </Typography>
          {data.barang && data.barang.length > 0 ? (
            data.barang.map((item: any, index: number) => (
              <Typography key={index} sx={{ ml: 1 }}>
                • Barang {index + 1}: {item.panjang} x {item.lebar} x{" "}
                {item.tinggi}
              </Typography>
            ))
          ) : (
            <Typography>Tidak ada data barang</Typography>
          )}

          <Divider sx={{ my: 2 }} />
          
          <Typography gutterBottom>
            <strong>Alamat Pengiriman:</strong> {data.alamat_pengiriman || "-"}
          </Typography>

          {/* Form Input */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="h6" gutterBottom>
            Update Status & Lokasi
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Lokasi Terkini"
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
            />

            <TextField
              label="Status Barang"
              variant="outlined"
              fullWidth
              size="small"
              select
              sx={{ mb: 2 }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statusOptions.map((item) => (
                <MenuItem key={item} value={item}>
                  {item
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              // label="Upload Foto"
              type="file"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              inputProps={{ accept: "image/*" }}
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                  setFoto(target.files[0]);
                }
              }}
            />

            <TextField
              label="Keterangan"
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              size="small"
              sx={{ mb: 2 }}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            />

            <Button
              variant="contained"
              type="submit"
              color="warning"
              onClick={() => router.push(`/status-barang/`)}
            >
              Simpan Perubahan
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
