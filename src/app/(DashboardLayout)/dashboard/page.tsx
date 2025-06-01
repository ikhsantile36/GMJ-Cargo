"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";

// Komponen dashboard
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import PengirimanOverview from "@/app/(DashboardLayout)/components/dashboard/PengirimanOverview";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";

import jwt from "jsonwebtoken";
import type { User } from "@/app/types/user";

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/authentication/"); // Redirect kalau belum login
      return;
    }

    try {
      const decoded = jwt.decode(token) as User | null;
      if (!decoded || !decoded.role) {
        localStorage.removeItem("token");
        router.replace("/authentication/");
      } else {
        console.log("Login sebagai:", decoded.role);
      }
    } catch (err) {
      console.error("Token invalid:", err);
      localStorage.removeItem("token");
      router.replace("/authentication/login");
    }
  }, [router]);

  return (
    <PageContainer title="Dashboard" description="Halaman utama dashboard ekspedisi">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12}>
            <PengirimanOverview />
          </Grid>
          <Grid item xs={12}>
            <MonthlyEarnings />
          </Grid>
          <Grid item xs={12}>
            <YearlyBreakup />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
