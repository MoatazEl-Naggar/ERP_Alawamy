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

interface Customer {
  id?: string;
  customerNumber: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  accountNumber?: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Customer>({
    customerNumber: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    accountNumber: ""
  });

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSave = async () => {
    if (form.id) {
      await api.put(`/customers/${form.id}`, form);
    } else {
      await api.post("/customers", form);
    }
    setOpen(false);
    setForm({ customerNumber: "", name: "", phone: "", address: "", email: "", accountNumber: "" });
    fetchCustomers();
  };

  const handleEdit = (customer: Customer) => {
    setForm(customer);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/customers/${id}`);
    fetchCustomers();
  };
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("customersTitle")}</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        {t("addCustomer")}
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
          {customers.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.customerNumber}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(c)}>{t("edit")}</Button>
                <Button color="error" onClick={() => handleDelete(c.id!)}>{t("delete")}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{form.id ? t("editCustomer") : t("addCustomer")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("customerNumber")}
            fullWidth
            margin="dense"
            value={form.customerNumber}
            onChange={e => setForm({ ...form, customerNumber: e.target.value })}
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
          <Button onClick={() => setOpen(false)}>{t("cancel")}</Button>
          <Button variant="contained" onClick={handleSave}>{t("save")}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
