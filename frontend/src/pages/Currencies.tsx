import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button, TextField, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Stack, Typography, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

interface Currency { id: string; name: string; exchangeRate: number; }

const emptyForm = { name: "", exchangeRate: 1 };

export default function Currencies() {
  const { t } = useTranslation();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const fetch = async () => {
    try { const res = await api.get("/currencies"); setCurrencies(res.data); }
    catch { setSnackbar({ open: true, message: t("loadError"), severity: "error" }); }
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (c: Currency) => { setForm({ name: c.name, exchangeRate: c.exchangeRate }); setEditingId(c.id); setDialogOpen(true); };

  const handleSave = async () => {
    try {
      const payload = { ...form, exchangeRate: Number(form.exchangeRate) };
      if (editingId) await api.put(`/currencies/${editingId}`, payload);
      else await api.post("/currencies", payload);
      setSnackbar({ open: true, message: t("savedSuccess"), severity: "success" });
      setDialogOpen(false); fetch();
    } catch { setSnackbar({ open: true, message: t("saveError"), severity: "error" }); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try { await api.delete(`/currencies/${id}`); fetch(); }
    catch { setSnackbar({ open: true, message: t("deleteError"), severity: "error" }); }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>{t("currenciesTitle")}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>{t("addCurrency")}</Button>
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{  fontWeight: 600 }}>#</TableCell>
              <TableCell sx={{  fontWeight: 600 }}>{t("currencyName")}</TableCell>
              <TableCell sx={{  fontWeight: 600 }}>{t("exchangeRate")}</TableCell>
              <TableCell sx={{  fontWeight: 600 }}>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currencies.map((c, i) => (
              <TableRow key={c.id} sx={{ "&:hover": { bgcolor: "grey.100" } }}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.exchangeRate}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(c)}>{t("edit")}</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(c.id)}>{t("delete")}</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{editingId ? t("editCurrency") : t("addCurrency")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label={t("currencyName")} fullWidth required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
            <TextField label={t("exchangeRate")} type="number" fullWidth required value={form.exchangeRate}
              onChange={e => setForm({ ...form, exchangeRate: parseFloat(e.target.value) })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>{editingId ? t("update") : t("save")}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
}