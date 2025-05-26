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
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

interface User {
  id: number;
  username: string;
  nomor_hp: string;
  email: string;
  role: string;
}

const ManajemenUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nomor_hp, setNomorHp] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUserRole, setLoggedInUserRole] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState("ALL");

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

  const handleAddOrUpdateUser = async () => {
    const method = editId ? "PUT" : "POST";
    const bodyData = editId
      ? { id: editId, username, nomor_hp, email, password, role }
      : { username, nomor_hp, email, password, role };

    const res = await fetch("/api/users", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyData),
    });

    if (res.ok) {
      resetForm();
      fetchUsers();
    } else {
      const error = await res.json();
      alert(error.message || "Gagal menyimpan user");
    }
  };

  const handleEditUser = (user: User) => {
    setEditId(user.id);
    setUsername(user.username);
    setNomorHp(user.nomor_hp);
    setEmail(user.email);
    setPassword("");
    setRole(user.role);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      fetchUsers();
    } else {
      const error = await res.json();
      alert(error.message || "Gagal menghapus user");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setUsername("");
    setEmail("");
    setNomorHp("");
    setPassword("");
    setRole("USER");
  };

  const filteredUsers =
    filterRole === "ALL"
      ? users
      : users.filter((u) => u.role === filterRole);

  return (
    <PageContainer
      title="Kelola Pengguna"
      description="Admin dapat menambah, melihat, mengedit, dan menghapus user"
    >
      <Box>
        {loggedInUserRole === "OWNER" ? (
          <DashboardCard title={editId ? "Edit User" : "Add New User"}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
              />
              <TextField
                label="Nomor Telepon"
                value={nomor_hp}
                onChange={(e) => setNomorHp(e.target.value)}
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
                placeholder={editId ? "Kosongkan jika tidak diubah" : ""}
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
                  <MenuItem value="OWNER">Owner</MenuItem>
                  <MenuItem value="OPERATOR">Operator</MenuItem>
                </Select>
              </FormControl>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleAddOrUpdateUser}>
                  {editId ? "Update User" : "Create User"}
                </Button>
                {editId && (
                  <Button variant="outlined" onClick={resetForm}>
                    Batal Edit
                  </Button>
                )}
              </Stack>
            </Stack>
          </DashboardCard>
        ) : null}

        <DashboardCard title="User List">
          <Stack direction="row" alignItems="center" mb={2} spacing={2}>
            <Typography>Filter Role:</Typography>
            <FormControl sx={{ minWidth: 150 }}>
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="ALL">Semua</MenuItem>
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="OWNER">Owner</MenuItem>
                <MenuItem value="OPERATOR">Operator</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Nomor Telepon</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.nomor_hp}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEditUser(u)}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
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

export default ManajemenUser;
