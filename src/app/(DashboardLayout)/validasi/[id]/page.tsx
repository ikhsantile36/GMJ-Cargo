"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Stack,
  Button,
} from "@mui/material";
import jwt from "jsonwebtoken";

export default function ValidasiPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/penerimaan/${id}`);
        if (!res.ok) {
          const text = await res.text();
          console.error("Server Error Response:", text);
          throw new Error("Gagal mengambil data penerimaan.");
        }
        const result = await res.json();
        console.log("Data penerimaan:", result);
        setData(result);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Ambil role dari token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded?.role) {
          setUserRole(decoded.role.toUpperCase()); // Pastikan uppercase
        }
      } catch (err) {
        console.error("Gagal decode token:", err);
      }
    }
  }, [id]);

  const handleUpdateStatus = async (
    status: "telah_selesai" | "butuh_validasi"
  ) => {
    try {
      const res = await fetch(`/api/pengiriman/${data.pengirimanId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_barang: status }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Gagal update status:", text);
        throw new Error("Gagal mengubah status.");
      }

      if (userRole === "ADMIN") {
        router.push("/status-barang?filter=" + status);
      } else {
        router.push("/pengiriman?filter=" + status);
      }
    } catch (err) {
      alert("Terjadi kesalahan saat memperbarui status.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!data) return <Alert severity="info">Data tidak ditemukan</Alert>;
console.log("=== DEBUG INFO ===");
console.log("userRole:", userRole);
console.log("data.status_barang:", data.status_barang);
console.log("Full data object:", data);


  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Validasi Penerimaan Barang
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={500}>
            Keterangan:
          </Typography>
          <Typography variant="body1">{data.keterangan || "-"}</Typography>
        </CardContent>
      </Card>

      {[
        { label: "Foto Barang", key: "fotoBarang" },
        { label: "Foto Pembayaran", key: "fotoPembayaran" },
        { label: "Foto Invoice", key: "fotoInvoice" },
      ].map(({ label, key }) => (
        <Card key={key} sx={{ mb: 3 }}>
          <CardMedia
            component="img"
            image={data[key]}
            alt={label}
            sx={{ maxHeight: 500, objectFit: "contain", bgcolor: "#f5f5f5" }}
          />
          <CardContent>
            <Typography variant="body2">{label}</Typography>
          </CardContent>
        </Card>
      ))}

      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
          {userRole === "ADMIN" && data.pengiriman?.status_barang === "butuh_validasi" &&  (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleUpdateStatus("telah_selesai")}
              >
                Approve
              </Button>
            </>
          )}
          <Button
            variant="outlined"
            color="secondary"
            onClick= {() => router.push(`/status-barang/`)}
          >
            Kembali
          </Button>


        </Stack>
      </Stack>
    </Box>
  );
}
