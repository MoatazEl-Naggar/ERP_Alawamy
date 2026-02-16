import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";
interface Supplier {
  id?: string;
  supplierNumber: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  accountNumber?: string;
}

export default function Suppliers() {
  const initialForm: Supplier = {
    supplierNumber: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    accountNumber: ""
  };

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Supplier>(initialForm);

  const fetchSuppliers = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSave = async () => {
    if (form.id) {
      await api.put(`/suppliers/${form.id}`, form);
    } else {
      await api.post("/suppliers", form);
    }
    setOpen(false);
    setForm(initialForm);
    fetchSuppliers();
  };

  const handleEdit = (supplier: Supplier) => {
    setForm(supplier);
    setOpen(true);
  };
  const { t } = useTranslation();
  const handleDelete = async (id: string) => {
    await api.delete(`/suppliers/${id}`);
    fetchSuppliers();
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setForm(initialForm);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("suppliersTitle")}</h2>

      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        {t("addSupplier")}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("number")}</TableCell>
            <TableCell>{t("name")}</TableCell>
            <TableCell>{t("phone")}</TableCell>
            <TableCell>{t("email")}</TableCell>
            <TableCell>{t("actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.supplierNumber}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.phone}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(s)}>{t("edit")}</Button>
                <Button color="error" onClick={() => handleDelete(s.id!)}>{t("delete")}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{form.id ? t("editSupplier") : t("addSupplier")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("supplierNumber")}
            fullWidth
            margin="dense"
            value={form.supplierNumber}
            onChange={e => setForm({ ...form, supplierNumber: e.target.value })}
          />
          <TextField
            label={t("name")}
            fullWidth
            margin="dense"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label={t("phone")}
            fullWidth
            margin="dense"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <TextField
            label={t("address")}
            fullWidth
            margin="dense"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          <TextField
            label={t("email")}
            fullWidth
            margin="dense"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label={t("accountNumber")}
            fullWidth
            margin="dense"
            value={form.accountNumber}
            onChange={e => setForm({ ...form, accountNumber: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("cancel")}</Button>
          <Button variant="contained" onClick={handleSave}>{t("save")}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
