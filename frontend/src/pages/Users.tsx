import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface User {
  id?: string;
  username: string;
  password?: string;
  role: string;
}

export default function Users() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<User>({
    username: "",
    password: "",
    role: "EMPLOYEE"
  });

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (form.id) {
      await api.put(`/users/${form.id}`, form);
    } else {
      await api.post("/users", form);
    }
    setOpen(false);
    setForm({ username: "", password: "", role: "EMPLOYEE" });
    fetchUsers();
  };

  const handleEdit = (u: User) => {
    setForm({ ...u, password: "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("usersRegistration")}</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        {t("addUser")}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("username")}</TableCell>
            <TableCell>{t("role")}</TableCell>
            <TableCell>{t("actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.id}>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(u)}>{t("edit")}</Button>
                <Button color="error" onClick={() => handleDelete(u.id!)}>{t("delete")}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{form.id ? t("editUser") : t("addUser")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("username")}
            fullWidth
            margin="dense"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <TextField
            label={t("password")}
            type="password"
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <TextField
            select
            label={t("role")}
            fullWidth
            margin="dense"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="ACCOUNTANT">ACCOUNTANT</MenuItem>
            <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t("cancel")}</Button>
          <Button variant="contained" onClick={handleSave}>{t("save")}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
