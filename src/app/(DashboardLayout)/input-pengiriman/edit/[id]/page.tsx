"use client";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
  Grid,
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
    stt: "",
    sttb: "",
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
          stt: barangPertama?.stt || "",
          sttb: dataPengiriman.sttb || "",
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
    const { name, value } = e.target;

    if (name === "stt") {
      setForm((prev) => ({
        ...prev,
        stt: value,
        sttb: value,       }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
const handleDelete = async () => {
  const confirmDelete = confirm("Yakin ingin menghapus pengiriman ini?");
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/pengiriman/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Delete error:", errorText);
      throw new Error("Gagal menghapus data");
    }

    alert("Data berhasil dihapus");
    router.push("/status-barang"); // Redirect ke halaman daftar pengiriman
  } catch (error) {
    console.error("Delete request error:", error);
    alert("Terjadi kesalahan saat menghapus");
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      ...form,
      biaya: Number(form.biaya), 
    };

    try {
      const res = await fetch(`/api/pengiriman/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Response error:", errorText);
        throw new Error("Gagal update data");
      }

      alert("Berhasil update data");
      router.push("/status-barang");
    } catch (error) {
      console.error("Update error:", error);
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
      sx={{
        maxWidth: "100%",
        width: "100%",
        px: 3,
        py: 4,
        mx: "auto",
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h5" mb={3}>
        Edit Data Pengiriman
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="STT"
            name="stt"
            fullWidth
            value={form.stt}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Nama Pengirim"
            name="nama_pengirim"
            fullWidth
            value={form.nama_pengirim}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Penerima & No. HP"
            name="penerima_dan_hp"
            fullWidth
            value={form.penerima_dan_hp}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Alamat Pengiriman"
            name="alamat_pengiriman"
            fullWidth
            multiline
            minRows={2}
            value={form.alamat_pengiriman}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            label="Biaya"
            name="biaya"
            fullWidth
            value={form.biaya}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Jenis Kiriman"
            name="jenis_kiriman"
            fullWidth
            value={form.jenis_kiriman}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12} mt={2}>
          <Box display="flex" justifyContent="flex-end">
            <Button
  variant="contained"
  color="error"
  onClick={handleDelete}
  sx={{ mr: 2, minWidth: 160 }}
>
  Hapus Pengiriman
</Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              sx={{ minWidth: 160 }} // opsional agar ukuran tidak terlalu kecil
            >
              Simpan Perubahan
            </Button>
            

          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
