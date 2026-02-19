import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button, TextField, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Stack, Snackbar, Alert, Typography, Box, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useTranslation } from "react-i18next";
import AddIcon    from "@mui/icons-material/Add";
import EditIcon   from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon  from "@mui/icons-material/Print";
import SaveIcon   from "@mui/icons-material/Save";

interface Treasury        { id: string; name: string; }
interface Currency        { id: string; name: string; exchangeRate: number; }
interface ExpenseCategory { id: string; number: number; name: string; }
interface Shipment        { id: string; referenceNo: string; }
interface Customer        { id: string; name: string; }
interface Supplier        { id: string; name: string; }

interface ReceiptVoucher {
  id: string; date: string; voucherNumber: string; amount: number;
  costPrice?: number; notes?: string; description?: string; receivedFrom?: string;
  exchangeRate?: number; currency?: string;
  treasury:         { id: string; name: string; };
  expenseCategory?: { id: string; name: string; };
  shipment?:        { id: string; referenceNo: string; };
  customer?:        { id: string; name: string; };
  supplier?:        { id: string; name: string; };
}

const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  voucherNumber: "", treasuryId: "", expenseCategoryId: "",
  amount: 0, costPrice: 0, notes: "", description: "", receivedFrom: "",
  exchangeRate: 1, currency: "",
  shipmentId: "", customerId: "", supplierId: ""
};

export default function ReceiptVouchers() {
  const { t } = useTranslation();
  const [receipts,   setReceipts]   = useState<ReceiptVoucher[]>([]);
  const [treasuries, setTreasuries] = useState<Treasury[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [shipments,  setShipments]  = useState<Shipment[]>([]);
  const [customers,  setCustomers]  = useState<Customer[]>([]);
  const [suppliers,  setSuppliers]  = useState<Supplier[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [form,       setForm]       = useState(emptyForm);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo,   setFilterTo]   = useState("");
  const [snackbar,   setSnackbar]   = useState({ open: false, message: "", severity: "success" as "success" | "error" });

  const fetchReceipts = async () => {
    try {
      const params: any = {};
      if (filterFrom) params.from = filterFrom;
      if (filterTo)   params.to   = filterTo;
      const res = await api.get("/receipts", { params });
      setReceipts(res.data);
    } catch { setSnackbar({ open: true, message: t("voucherLoadError"), severity: "error" }); }
  };

  useEffect(() => {
    api.get("/treasuries").then(r => setTreasuries(r.data)).catch(console.error);
    api.get("/currencies").then(r => setCurrencies(r.data)).catch(console.error);
    api.get("/expenses").then(r => setCategories(r.data)).catch(console.error);
    api.get("/shipments").then(r => setShipments(r.data)).catch(console.error);
    api.get("/customers").then(r => setCustomers(r.data)).catch(console.error);
    api.get("/suppliers").then(r => setSuppliers(r.data)).catch(console.error);
  }, []);

  useEffect(() => { fetchReceipts(); }, [filterFrom, filterTo]);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };

  const openEdit = (r: ReceiptVoucher) => {
    setForm({
      date:              r.date.split("T")[0],
      voucherNumber:     r.voucherNumber,
      treasuryId:        r.treasury.id,
      expenseCategoryId: r.expenseCategory?.id || "",
      amount:            r.amount,
      costPrice:         r.costPrice ?? r.amount * (r.exchangeRate || 1),
      notes:             r.notes || "",
      description:       r.description || "",
      receivedFrom:      r.receivedFrom || "",
      exchangeRate:      r.exchangeRate || 1,
      currency:          r.currency || "",
      shipmentId:        r.shipment?.id || "",
      customerId:        r.customer?.id || "",
      supplierId:        r.supplier?.id || "",
    });
    setEditingId(r.id);
    setDialogOpen(true);
  };

  // ── Currency changed → update exchangeRate + recalculate costPrice ──
  const handleCurrencyChange = (currName: string | null) => {
    const c = currencies.find(x => x.name === currName);
    const newRate = c ? c.exchangeRate : 1;
    setForm(prev => ({
      ...prev,
      currency:     currName || "",
      exchangeRate: newRate,
      costPrice:    parseFloat((prev.amount * newRate).toFixed(2)),
    }));
  };

  // ── Amount changed → recalculate costPrice ─��
  const handleAmountChange = (val: string) => {
    const amount = parseFloat(val) || 0;
    setForm(prev => ({
      ...prev,
      amount,
      costPrice: parseFloat((amount * prev.exchangeRate).toFixed(2)),
    }));
  };

  // ── Exchange rate manually changed → recalculate costPrice ──
  const handleExchangeRateChange = (val: string) => {
    const rate = parseFloat(val) || 1;
    setForm(prev => ({
      ...prev,
      exchangeRate: rate,
      costPrice:    parseFloat((prev.amount * rate).toFixed(2)),
    }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        amount:            Number(form.amount),
        costPrice:         Number(form.costPrice) || null,
        exchangeRate:      Number(form.exchangeRate),
        date:              new Date(form.date),
        expenseCategoryId: form.expenseCategoryId || null,
        shipmentId:        form.shipmentId  || null,
        customerId:        form.customerId  || null,
        supplierId:        form.supplierId  || null,
      };
      if (editingId) {
        await api.put(`/receipts/${editingId}`, payload);
        setSnackbar({ open: true, message: t("voucherUpdatedSuccess"), severity: "success" });
      } else {
        await api.post("/receipts", payload);
        setSnackbar({ open: true, message: t("voucherSavedSuccess"), severity: "success" });
      }
      setDialogOpen(false);
      fetchReceipts();
    } catch { setSnackbar({ open: true, message: t("voucherSaveError"), severity: "error" }); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try {
      await api.delete(`/receipts/${id}`);
      setSnackbar({ open: true, message: t("voucherDeletedSuccess"), severity: "success" });
      fetchReceipts();
    } catch { setSnackbar({ open: true, message: t("voucherDeleteError"), severity: "error" }); }
  };

  const handlePrint = (r: ReceiptVoucher) => {
    const w = window.open("", "", "width=800,height=600");
    if (!w) return;
    w.document.write(`<html><head><title>${t("receiptVoucher")}</title>
      <style>body{font-family:Arial;direction:rtl;padding:20px}.row{display:flex;justify-content:space-between;margin:10px 0}</style></head>
      <body><h2 style="text-align:center">${t("receiptVoucher")}</h2>
      <div class="row"><span><b>${t("date")}:</b> ${new Date(r.date).toLocaleDateString("ar-EG")}</span><span><b>${t("voucherNumber")}:</b> ${r.voucherNumber}</span></div>
      <div class="row"><span><b>${t("treasury")}:</b> ${r.treasury.name}</span><span><b>${t("amount")}:</b> ${r.amount.toLocaleString()} ${r.currency}</span></div>
      <div class="row"><span><b>${t("receivedFrom")}:</b> ${r.receivedFrom || "-"}</span><span><b>${t("costPrice")}:</b> ${r.costPrice ?? "-"}</span></div>
      ${r.exchangeRate !== 1 ? `<div class="row"><span><b>${t("exchangeRate")}:</b> ${r.exchangeRate}</span></div>` : ""}
      ${r.shipment  ? `<div class="row"><span><b>${t("shipmentId")}:</b> ${r.shipment.referenceNo}</span></div>` : ""}
      ${r.customer  ? `<div class="row"><span><b>${t("customer")}:</b> ${r.customer.name}</span></div>` : ""}
      ${r.supplier  ? `<div class="row"><span><b>${t("supplier")}:</b> ${r.supplier.name}</span></div>` : ""}
      <div class="row"><span><b>${t("notes")}:</b> ${r.notes || "-"}</span></div>
      </body></html>`);
    w.document.close(); w.print();
  };

  const total = receipts.reduce((s, r) => s + r.amount, 0);

  const selTreasury = treasuries.find(x => x.id === form.treasuryId) || null;
  const selCategory = categories.find(x => x.id === form.expenseCategoryId) || null;
  const selCurrency = currencies.find(x => x.name === form.currency) || null;
  const selShipment = shipments.find(x => x.id === form.shipmentId) || null;
  const selCustomer = customers.find(x => x.id === form.customerId) || null;
  const selSupplier = suppliers.find(x => x.id === form.supplierId) || null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{t("receiptVouchersTitle")}</Typography>

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

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["#", t("date"), t("voucherNumber"), t("voucherItemNumber"), t("treasury"),
                t("amount"), t("currencyLabel"), t("exchangeRate"), t("costPrice"),
                t("receivedFrom"), t("notes"), t("actions")]
                .map(h => <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {receipts.map((r, i) => (
              <TableRow key={r.id} sx={{ "&:hover": { bgcolor: "grey.100" } }}>
                <TableCell>{receipts.length - i}</TableCell>
                <TableCell>{new Date(r.date).toLocaleDateString("ar-EG")}</TableCell>
                <TableCell>{r.voucherNumber || "-"}</TableCell>
                <TableCell>{r.expenseCategory?.name || "-"}</TableCell>
                <TableCell>{r.treasury.name}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{r.amount.toLocaleString()}</TableCell>
                <TableCell>{r.currency || "-"}</TableCell>
                <TableCell>{r.exchangeRate || "-"}</TableCell>
                <TableCell>{r.costPrice ?? "-"}</TableCell>
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
              <TableCell colSpan={5} sx={{ fontWeight: 700 }}>{t("total")}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>{total.toLocaleString()}</TableCell>
              <TableCell colSpan={6} />
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      {/* ── DIALOG ── */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? t("editReceiptVoucher") : t("newReceiptVoucher")}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>

            {/* Row 1 — Date + Voucher Number */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label={t("date")} type="date" fullWidth required value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} InputLabelProps={{ shrink: true }} />
              <TextField label={t("voucherNumber")} fullWidth value={form.voucherNumber}
                onChange={e => setForm({ ...form, voucherNumber: e.target.value })} />
            </Stack>

            {/* Row 2 — Voucher Item + Treasury */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Autocomplete fullWidth options={categories}
                getOptionLabel={c => `${c.number} — ${c.name}`} value={selCategory}
                onChange={(_, v) => setForm({ ...form, expenseCategoryId: v?.id || "" })}
                renderInput={params => <TextField {...params} label={t("voucherItemNumber")} />} />
              <Autocomplete fullWidth options={treasuries}
                getOptionLabel={tr => tr.name} value={selTreasury}
                onChange={(_, v) => setForm({ ...form, treasuryId: v?.id || "" })}
                renderInput={params => <TextField {...params} label={t("treasury")} />} />
            </Stack>

            {/* Row 3 — Shipment + Customer */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Autocomplete fullWidth options={shipments}
                getOptionLabel={s => s.referenceNo} value={selShipment}
                onChange={(_, v) => setForm({ ...form, shipmentId: v?.id || "" })}
                renderInput={params => <TextField {...params} label={`${t("shipmentId")} (${t("optional")})`} />} />
              <Autocomplete fullWidth options={customers}
                getOptionLabel={c => c.name} value={selCustomer}
                onChange={(_, v) => setForm({ ...form, customerId: v?.id || "" })}
                renderInput={params => <TextField {...params} label={`${t("customer")} (${t("optional")})`} />} />
            </Stack>

            {/* Row 4 — Supplier + Received From */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Autocomplete fullWidth options={suppliers}
                getOptionLabel={s => s.name} value={selSupplier}
                onChange={(_, v) => setForm({ ...form, supplierId: v?.id || "" })}
                renderInput={params => <TextField {...params} label={`${t("supplier")} (${t("optional")})`} />} />
              <TextField label={t("receivedFrom")} fullWidth value={form.receivedFrom}
                onChange={e => setForm({ ...form, receivedFrom: e.target.value })} />
            </Stack>

            {/* Row 5 — Amount + Currency */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* ✅ Amount triggers costPrice recalculation */}
              <TextField label={t("amount")} type="number" fullWidth required value={form.amount}
                onChange={e => handleAmountChange(e.target.value)} />
              {/* ✅ Currency triggers exchangeRate + costPrice recalculation */}
              <Autocomplete fullWidth options={currencies}
                getOptionLabel={c => `${c.name} — ${t("exchangeRate")}: ${c.exchangeRate}`}
                value={selCurrency}
                onChange={(_, v) => handleCurrencyChange(v?.name || null)}
                renderInput={params => <TextField {...params} label={t("currencyLabel")} />} />
            </Stack>

            {/* Row 6 — Exchange Rate (triggers recalc) + Cost Price (auto-filled, editable) */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {/* ✅ Manual rate edit also recalculates costPrice */}
              <TextField label={t("exchangeRate")} type="number" fullWidth value={form.exchangeRate}
                onChange={e => handleExchangeRateChange(e.target.value)} />
              {/* ✅ Auto-calculated but still editable */}
              <TextField
                label={`${t("costPrice")} = ${t("exchangeRate")} × ${t("amount")}`}
                type="number" fullWidth value={form.costPrice}
                onChange={e => setForm({ ...form, costPrice: parseFloat(e.target.value) })}
                InputProps={{ sx: { bgcolor: "grey.50" } }}
                helperText={`${form.exchangeRate} × ${form.amount} = ${(form.exchangeRate * form.amount).toFixed(2)}`}
              />
            </Stack>

            {/* Row 7 — Notes */}
            <TextField label={t("notes")} fullWidth multiline rows={2} value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })} />

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t("cancel")}</Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            {editingId ? t("update") : t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}