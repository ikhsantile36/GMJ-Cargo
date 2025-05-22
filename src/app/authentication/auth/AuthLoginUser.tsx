"use client";

import React, { JSX, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { Stack } from "@mui/system";
import { useRouter } from "next/navigation";

interface registerType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!phoneNumber.match(/^08\d{8,11}$/)) {
      alert("Nomor HP tidak valid. Gunakan format Indonesia seperti 08xxxxxxxxxx");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (res.ok) {
        router.push("/authentication/login");
      } else {
        const errorData = await res.json();
        alert("Register gagal: " + errorData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
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

      <Box>
        <Stack mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="phone"
            mb="5px"
          >
            Nomor HP
          </Typography>
          <CustomTextField
            id="phone"
            variant="outlined"
            fullWidth
            value={phoneNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPhoneNumber(e.target.value)
            }
            placeholder="08xxxxxxxxxx"
          />
        </Stack>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
        >
          Daftar
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
