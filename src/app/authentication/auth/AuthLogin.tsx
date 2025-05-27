"use client";
import React, { JSX, useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    console.log("Kirim login request:", form);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login gagal:", res.status, data);
        setError(data.message || "Login gagal. Coba lagi.");
        return;
      }

      // Simpan ke localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("role", data.user.role);

      // Redirect berdasarkan role
      switch (data.user.role) {
        case "USER":
        case "OPERATOR":
          router.push("/status-barang");
          break;
          case "OWNER":
          case "ADMIN":
          router.push("/dashboard");
          break;
        default:
          router.push("/");
          break;
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Terjadi kesalahan koneksi.");
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
          >
            Username
          </Typography>
          <CustomTextField
            id="username"
            variant="outlined"
            fullWidth
            name="username"
            value={form.username}
            onChange={handleChange}
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
          >
            Password
          </Typography>
          <CustomTextField
            id="password"
            type="password"
            variant="outlined"
            fullWidth
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </Box>

        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Ingatkan saya"
            />
          </FormGroup>
          <Typography
            component={Link}
            href="/"
            fontWeight="500"
            sx={{ textDecoration: "none", color: "primary.main" }}
          >
            Lupa Password?
          </Typography>
        </Stack>
      </Stack>

      <Box>
        <Button variant="contained" color="warning" fullWidth onClick={handleLogin}>
          Masuk
        </Button>
      </Box>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}

      {subtitle}
    </>
  );
};

export default AuthLogin;
