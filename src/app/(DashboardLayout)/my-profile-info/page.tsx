"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function MyProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [notif, setNotif] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token)
          throw new Error("Token tidak ditemukan. Silakan login ulang.");

        const res = await fetch("/api/auth/login", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setProfile(data);
        setFormData({
          username: data.username,
          email: data.email || "",
          password: "",
        });
      } catch (err: any) {
        console.error(err);
        setNotif({
          open: true,
          message: err.message || "Gagal memuat profil",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async () => {
  setSaving(true);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token tidak ditemukan.");

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: profile.id,
        username: formData.username,
        email: formData.email,
        password: formData.password || undefined,
      }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message);

    // ➕ update profile state agar table ikut refresh
    setProfile({
      ...profile,
      username: formData.username,
      email: formData.email,
    });

    setNotif({
      open: true,
      message: "✅ Profil berhasil diperbarui",
      severity: "success",
    });
    setFormData({ ...formData, password: "" });
  } catch (err: any) {
    setNotif({
      open: true,
      message: err.message || "Gagal update profil",
      severity: "error",
    });
  } finally {
    setSaving(false);
  }
};


  if (loading)
    return (
      <Box mt={4} textAlign="center">
        <CircularProgress />
      </Box>
    );

  return (
    <main style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <Box sx={{ width: "100%" }}>
        <Card sx={{ mb: 4 }}>
          <CardHeader title="Profil Saya" />
          <CardContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                label="Password Baru (opsional)"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                type="password"
              />
              <Button
                variant="contained"
                color="warning"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* TABLE USER INFO */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Username</b></TableCell>
                <TableCell><b>Nomor HP</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Role</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profile && (
                <TableRow>
                  <TableCell>{profile.id}</TableCell>
                  <TableCell>{profile.username}</TableCell>
                  <TableCell>{profile.nomor_hp}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.role}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* SNACKBAR NOTIF */}
      <Snackbar
        open={notif.open}
        autoHideDuration={4000}
        onClose={() => setNotif({ ...notif, open: false })}
      >
        <Alert
          severity={notif.severity}
          onClose={() => setNotif({ ...notif, open: false })}
        >
          {notif.message}
        </Alert>
      </Snackbar>
    </main>
  );
}
