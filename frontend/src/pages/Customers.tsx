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
  Paper,
  Stack,
  Typography,
  TableContainer
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ActionsCell from "../components/table/ActionsCell";


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
  const initialForm: Customer = {
    customerNumber: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    accountNumber: ""
  };

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Customer>(initialForm);

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
    setForm(initialForm);
    fetchCustomers();
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setForm(initialForm);
  };

  const handleEdit = (customer: Customer) => {
    setForm(customer);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/customers/${id}`);
    fetchCustomers();
  };
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const textAlign = isRTL ? "right" : "left";
  const actionsAlign = isRTL ? "left" : "right";

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "start", sm: "center" }} sx={{ mb: 2 }} spacing={1}>
        <Typography variant="h5" fontWeight={700}>{t("customersTitle")}</Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          {t("addCustomer")}
        </Button>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align={textAlign}>{t("number")}</TableCell>
              <TableCell align={textAlign}>{t("name")}</TableCell>
              <TableCell align="center">{t("phone")}</TableCell>
              <TableCell align={textAlign}>{t("email")}</TableCell>
              <TableCell align={actionsAlign}>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell align={textAlign}>{c.customerNumber}</TableCell>
                <TableCell align={textAlign}>{c.name}</TableCell>
                <TableCell align="center">{c.phone}</TableCell>
                <TableCell align={textAlign}>{c.email}</TableCell>
                <ActionsCell
                  onEdit={() => handleEdit(c)}
                  onDelete={() => handleDelete(c.id!)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{form.id ? t("editCustomer") : t("addCustomer")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("customerNumber")}
            fullWidth
            margin="dense"
            value={form.customerNumber}
            onChange={(e) => setForm({ ...form, customerNumber: e.target.value })}
          />
          <TextField
            label={t("name")}
            fullWidth
            margin="dense"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label={t("phone")}
            fullWidth
            margin="dense"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <TextField
            label={t("address")}
            fullWidth
            margin="dense"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <TextField
            label={t("email")}
            fullWidth
            margin="dense"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label={t("accountNumber")}
            fullWidth
            margin="dense"
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
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