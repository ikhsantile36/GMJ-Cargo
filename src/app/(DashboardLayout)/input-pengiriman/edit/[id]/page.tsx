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
    biaya_admin: 0,
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
          biaya_admin: dataPengiriman.biaya_admin || 0,
        });
        setBarangOptions(dataPengiriman.barangList || []);

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

  const isNumberField = name === "biaya" || name === "biaya_admin";

  if (name === "stt") {
    setForm((prev) => ({
      ...prev,
      stt: value,
      sttb: value,
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: isNumberField ? parseFloat(value) : value,
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
    barangList: barangOptions.map((barang) => ({
      id: barang.id,
      tagihan: barang.tagihan,
    })),
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
        <Grid item xs={12}>
          <TextField
            label="Jenis Kiriman"
            name="jenis_kiriman"
            fullWidth
            value={form.jenis_kiriman}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
  <TextField
    type="number"
    label="Biaya Admin"
    name="biaya_admin"
    fullWidth
    value={form.biaya_admin}
    onChange={handleChange}
  />
</Grid>

        <Grid item xs={12}>
          <TextField
  type="number"
  label="Biaya"
  name="biaya"
  fullWidth
  value={form.biaya}
  InputProps={{ readOnly: true }}
/>

        </Grid>
        {barangOptions.map((barang, index) => (
  <Grid item xs={12} sm={6} key={barang.id}>
    <TextField
      type="number"
      label={`Tagihan Barang #${index + 1}`}
      fullWidth
      value={barang.tagihan || 0}
      onChange={(e) => {
  const updatedTagihan = parseFloat(e.target.value);
  const updated = [...barangOptions];
  updated[index] = {
    ...updated[index],
    tagihan: updatedTagihan,
  };
  setBarangOptions(updated);

  // 💡 Hitung total tagihan dan update form.biaya
  const totalTagihan = updated.reduce(
    (total, item) => total + (item.tagihan || 0),
    0
  );
  setForm((prev) => ({
    ...prev,
    biaya: totalTagihan,
  }));
}}

    />
  </Grid>
))}



        <Grid item xs={12} mt={2}>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" mt={3}>
  <Button
    variant="outlined"
    color="primary"
    onClick={() => router.push("/status-barang")}
    sx={{ minWidth: 160 }}
  >
    Kembali ke Status Barang
  </Button>

  <Box>
    <Button
      variant="outlined"
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
      sx={{ minWidth: 160 }}
    >
      Simpan Perubahan
    </Button>
  </Box>
</Box>

        </Grid>
      </Grid>
    </Box>
  );
}
