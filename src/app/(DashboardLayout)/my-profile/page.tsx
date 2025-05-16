"use client";

import {
  Box,
  Button,
  TextField,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useState, useEffect } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const MyProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUserRole, setLoggedInUserRole] = useState("");

 useEffect(() => {
  const r = localStorage.getItem("role") || "";
  setLoggedInUserRole(r);
  fetchUsers();
}, []);


 const fetchUsers = async () => {
  try {
    const res = await fetch("/api/users");

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error ${res.status}: ${text}`);
    }

    const data = await res.json();
    setUsers(data);
  } catch (error) {
    console.error("❌ Gagal fetch user:", error);
    alert("Gagal mengambil data user");
  }
};

  const handleAddUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });

    if (res.ok) {
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("USER");
      fetchUsers();
    } else {
      const error = await res.json();
      alert(error.message || "Gagal menambahkan user");
    }
  };

  return (
    <PageContainer
      title="Kelola Pengguna"
      description="Admin dapat menambah dan melihat user"
    >
      {/* Wrapper supaya children selalu ReactElement */}
      <Box>
        {loggedInUserRole === "SUPERADMIN" ? (
          <DashboardCard title="Add New User">
            <Stack spacing={2}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={role}
                  label="Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="SUPERADMIN">Superadmin</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleAddUser}>
                Create User
              </Button>
            </Stack>
          </DashboardCard>
        ) : null}

        <DashboardCard title="User List">
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </DashboardCard>
      </Box>
    </PageContainer>
  );
};

export default MyProfile;
