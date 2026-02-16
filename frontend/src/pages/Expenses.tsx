import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Expense {
  id?: string;
  number: number;
  name: string;
  type?: string;
}

export default function Expenses() {
  const initialForm: Expense = {
    number: 0,
    name: ""
  };

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [form, setForm] = useState<Expense>(initialForm);

  const fetchExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSave = async () => {
    const payload = {
      number: form.number,
      name: form.name,
      type: form.type || "GENERAL"
    };

    if (form.id) {
      await api.put(`/expenses/${form.id}`, payload);
    } else {
      await api.post("/expenses", payload);
    }

    setOpen(false);
    setForm(initialForm);
    fetchExpenses();
  };

  const handleEdit = (expense: Expense) => {
    setForm(expense);
    setOpen(true);
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setForm(initialForm);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("expensesTitle")}</h2>

      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        {t("addExpense")}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("number")}</TableCell>
            <TableCell>{t("name")}</TableCell>
            <TableCell>{t("actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map(e => (
            <TableRow key={e.id}>
              <TableCell>{e.number}</TableCell>
              <TableCell>{e.name}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(e)}>{t("edit")}</Button>
                <Button color="error" onClick={() => handleDelete(e.id!)}>{t("delete")}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{form.id ? t("editExpense") : t("addExpense")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("number")}
            type="number"
            fullWidth
            margin="dense"
            value={form.number}
            onChange={e => setForm({ ...form, number: +e.target.value })}
          />
          <TextField
            label={t("name")}
            fullWidth
            margin="dense"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
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
