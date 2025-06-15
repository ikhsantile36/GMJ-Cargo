"use client";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Barang } from "@/app/types/barang";

type Props = {
  data: Barang[];
};

export default function EditPengirimanForm() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    nama_pengirim: "",
    alamat_pengiriman: "",
    biaya: 0,
    jenis_kiriman: "",
    penerima_dan_hp: "",
  });

  const [barangOptions, setBarangOptions] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data pengiriman yang sedang diedit
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPengiriman = await fetch(`/api/pengiriman/${id}`);
        const dataPengiriman = await resPengiriman.json();

        const barangPertama = dataPengiriman.barangList?.[0];

        setForm({
          nama_pengirim: dataPengiriman.nama_pengirim || "",
          alamat_pengiriman: dataPengiriman.alamat_pengiriman || "",
          biaya: dataPengiriman.biaya || 0,
          jenis_kiriman: barangPertama?.jenis_kiriman || "",
          penerima_dan_hp: barangPertama?.penerima_dan_hp || "",
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/pengiriman/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal update data");

      alert("Berhasil update data pengiriman");
      router.push("/pengiriman");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat update");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      maxWidth={600}
      mx="auto"
      mt={4}
    >
      <Typography variant="h5" mb={3}>
        Edit Data Pengiriman
      </Typography>
      <TextField
        fullWidth
        label="Nama Pengirim"
        name="nama_pengirim"
        value={form.nama_pengirim}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Alamat Pengiriman"
        name="alamat_pengiriman"
        value={form.alamat_pengiriman}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        type="number"
        label="Biaya"
        name="biaya"
        value={form.biaya}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        label="Jenis Kiriman"
        name="jenis_kiriman"
        fullWidth
        margin="normal"
        value={form.jenis_kiriman}
        onChange={handleChange}
      />

      <TextField
        label="Penerima dan Nomor HP"
        name="penerima_dan_hp"
        fullWidth
        margin="normal"
        value={form.penerima_dan_hp}
        onChange={handleChange}
      />

      <Box mt={3}>
        <Button type="submit" variant="contained" color="primary">
          Simpan Perubahan
        </Button>
      </Box>
    </Box>
  );
}
