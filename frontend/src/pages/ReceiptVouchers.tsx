import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button, TextField, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Stack, Select, MenuItem, FormControl, InputLabel, Snackbar,
  Alert, Typography, Box, Divider, Dialog, DialogTitle, DialogContent,
  DialogActions
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";

interface Treasury { id: string; name: string; }
interface ReceiptVoucher {
  id: string; date: string; voucherNumber: string; amount: number;
  notes?: string; description?: string; receivedFrom?: string;
  exchangeRate?: number; currency?: string;
  treasury: { id: string; name: string; };
}

const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  voucherNumber: "", treasuryId: "", amount: 0,
  notes: "", description: "", receivedFrom: "",
  exchangeRate: 1, currency: "جنيه"
};

export default function ReceiptVouchers() {
  const { t } = useTranslation();
  const [receipts, setReceipts] = useState<ReceiptVoucher[]>([]);
  const [treasuries, setTreasuries] = useState<Treasury[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const fetchReceipts = async () => {
    try {
      const params: any = {};
      if (filterFrom) params.from = filterFrom;
      if (filterTo) params.to = filterTo;
      const res = await api.get("/receipts", { params });
      setReceipts(res.data);
    } catch { setSnackbar({ open: true, message: t("voucherLoadError"), severity: "error" }); }
  };

  useEffect(() => {
    api.get("/treasuries").then(r => setTreasuries(r.data)).catch(console.error);
  }, []);

  useEffect(() => { fetchReceipts(); }, [filterFrom, filterTo]);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };
  const openEdit = (r: ReceiptVoucher) => {
    setForm({ date: r.date.split("T")[0], voucherNumber: r.voucherNumber, treasuryId: r.treasury.id,
      amount: r.amount, notes: r.notes || "", description: r.description || "",
      receivedFrom: r.receivedFrom || "", exchangeRate: r.exchangeRate || 1, currency: r.currency || "جنيه" });
    setEditingId(r.id); setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = { ...form, amount: Number(form.amount), exchangeRate: Number(form.exchangeRate), date: new Date(form.date) };
      if (editingId) { await api.put(`/receipts/${editingId}`, payload); setSnackbar({ open: true, message: t("voucherUpdatedSuccess"), severity: "success" }); }
      else { await api.post("/receipts", payload); setSnackbar({ open: true, message: t("voucherSavedSuccess"), severity: "success" }); }
      setDialogOpen(false); fetchReceipts();
    } catch { setSnackbar({ open: true, message: t("voucherSaveError"), severity: "error" }); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try { await api.delete(`/receipts/${id}`); setSnackbar({ open: true, message: t("voucherDeletedSuccess"), severity: "success" }); fetchReceipts(); }
    catch { setSnackbar({ open: true, message: t("voucherDeleteError"), severity: "error" }); }
  };

  const handlePrint = (r: ReceiptVoucher) => {
    const w = window.open("", "", "width=800,height=600");
    if (!w) return;
    w.document.write(`<html><head><title>${t("receiptVoucher")}</title>
      <style>body{font-family:Arial;direction:rtl;padding:20px}.row{display:flex;justify-content:space-between;margin:10px 0}</style></head>
      <body><h2 style="text-align:center">${t("receiptVoucher")}</h2>
      <div class="row"><span><b>${t("date")}:</b> ${new Date(r.date).toLocaleDateString("ar-EG")}</span><span><b>${t("voucherNumber")}:</b> ${r.voucherNumber}</span></div>
      <div class="row"><span><b>${t("treasury")}:</b> ${r.treasury.name}</span><span><b>${t("amount")}:</b> ${r.amount.toLocaleString()} ${r.currency}</span></div>
      <div class="row"><span><b>${t("receivedFrom")}:</b> ${r.receivedFrom || "-"}</span></div>
      ${r.exchangeRate !== 1 ? `<div class="row"><span><b>${t("exchangeRate")}:</b> ${r.exchangeRate}</span></div>` : ""}
      <div class="row"><span><b>${t("notes")}:</b> ${r.notes || "-"}</span></div>
      </body></html>`);
    w.document.close(); w.print();
  };

  const filtered = receipts;
  const total = filtered.reduce((s, r) => s + r.amount, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{t("receiptVouchersTitle")}</Typography>

      {/* Date Filter */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField label={t("from")} type="date" size="small" value={filterFrom}
          onChange={e => setFilterFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label={t("to")} type="date" size="small" value={filterTo}
          onChange={e => setFilterTo(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="outlined" onClick={() => { setFilterFrom(""); setFilterTo(""); }}>{t("clear")}</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>{t("newReceiptVoucher")}</Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      {/* Table */}
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#4caf50" }}>
            <TableRow>
              {["#", t("date"), t("voucherNumber"), t("treasury"), t("amount"), t("currency"), t("exchangeRate"), t("receivedFrom"), t("notes"), t("actions")]
                .map(h => <TableCell key={h} sx={{ color: "white", fontWeight: 600 }}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((r, i) => (
              <TableRow key={r.id} sx={{ "&:hover": { bgcolor: "grey.100" } }}>
                <TableCell>{filtered.length - i}</TableCell>
                <TableCell>{new Date(r.date).toLocaleDateString("ar-EG")}</TableCell>
                <TableCell>{r.voucherNumber || "-"}</TableCell>
                <TableCell>{r.treasury.name}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{r.amount.toLocaleString()}</TableCell>
                <TableCell>{r.currency || "-"}</TableCell>
                <TableCell>{r.exchangeRate || "-"}</TableCell>
                <TableCell>{r.receivedFrom || "-"}</TableCell>
                <TableCell>{r.notes || "-"}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(r)}>{t("edit")}</Button>
                    <Button size="small" variant="outlined" color="info" startIcon={<PrintIcon />} onClick={() => handlePrint(r)}>{t("print")}</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(r.id)}>{t("delete")}</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: "grey.100" }}>
              <TableCell colSpan={4} sx={{ fontWeight: 700 }}>{t("total")}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{total.toLocaleString()}</TableCell>
              <TableCell colSpan={5} />
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? t("editReceiptVoucher") : t("newReceiptVoucher")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label={t("date")} type="date" fullWidth required value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField label={t("voucherNumber")} fullWidth value={form.voucherNumber}
                onChange={e => setForm({ ...form, voucherNumber: e.target.value })} />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth required>
                <InputLabel>{t("treasury")}</InputLabel>
                <Select value={form.treasuryId} label={t("treasury")} onChange={e => setForm({ ...form, treasuryId: e.target.value })}>
                  {treasuries.map(tr => <MenuItem key={tr.id} value={tr.id}>{tr.name}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField label={t("amount")} type="number" fullWidth required value={form.amount}
                onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) })} />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label={t("receivedFrom")} fullWidth value={form.receivedFrom}
                onChange={e => setForm({ ...form, receivedFrom: e.target.value })} />
              <TextField label={t("currency")} fullWidth value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })} />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label={t("exchangeRate")} type="number" fullWidth value={form.exchangeRate}
                onChange={e => setForm({ ...form, exchangeRate: parseFloat(e.target.value) })} />
              <TextField label={t("description")} fullWidth value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} />
            </Stack>
            <TextField label={t("notes")} fullWidth multiline rows={2} value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })} />
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