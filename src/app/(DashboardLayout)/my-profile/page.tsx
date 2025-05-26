"use client";

import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const MyProfile = () => {
  const [user, setUser] = useState({
    id: 0,
    username: "",
    email: "",
    phone: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  const fetchLoggedInUser = async () => {
    try {
      const res = await fetch("/api/users/me"); // asumsi endpoint user yang login
      if (!res.ok) throw new Error("Gagal ambil data pengguna");

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("❌ Gagal mengambil data user:", error);
      alert("Gagal mengambil data pengguna");
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal update");
      }

      alert("Berhasil update data pengguna");
    } catch (error) {
      console.error("❌", error);
      alert("Gagal update data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer title="Profil Saya" description="Kelola akun Anda">
      <DashboardCard title="Edit Profil">
        <Paper sx={{ padding: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="No HP"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Role"
              value={user.role}
              disabled
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Menyimpan..." : "Update Profil"}
            </Button>
          </Stack>
        </Paper>
      </DashboardCard>
    </PageContainer>
  );
};

export default MyProfile;
