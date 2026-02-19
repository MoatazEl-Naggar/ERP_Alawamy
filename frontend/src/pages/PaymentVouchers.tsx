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

interface PaymentVoucher {
  id: string; date: string; voucherNumber: string; amount: number;
  costPrice?: number; notes?: string; description?: string; paidTo?: string;
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
  amount: 0, costPrice: 0, notes: "", description: "", paidTo: "",
  exchangeRate: 1, currency: "",
  shipmentId: "", customerId: "", supplierId: ""
};

export default function PaymentVouchers() {
  const { t } = useTranslation();
  const [payments,   setPayments]   = useState<PaymentVoucher[]>([]);
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

  const fetchPayments = async () => {
    try {
      const params: any = {};
      if (filterFrom) params.from = filterFrom;
      if (filterTo)   params.to   = filterTo;
      const res = await api.get("/payments", { params });
      setPayments(res.data);
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

  useEffect(() => { fetchPayments(); }, [filterFrom, filterTo]);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setDialogOpen(true); };

  const openEdit = (p: PaymentVoucher) => {
    setForm({
      date:              p.date.split("T")[0],
      voucherNumber:     p.voucherNumber,
      treasuryId:        p.treasury.id,
      expenseCategoryId: p.expenseCategory?.id || "",
      amount:            p.amount,
      costPrice:         p.costPrice ?? p.amount * (p.exchangeRate || 1),
      notes:             p.notes || "",
      description:       p.description || "",
      paidTo:            p.paidTo || "",
      exchangeRate:      p.exchangeRate || 1,
      currency:          p.currency || "",
      shipmentId:        p.shipment?.id || "",
      customerId:        p.customer?.id || "",
      supplierId:        p.supplier?.id || "",
    });
    setEditingId(p.id);
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

  // ── Amount changed → recalculate costPrice ──
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
        await api.put(`/payments/${editingId}`, payload);
        setSnackbar({ open: true, message: t("voucherUpdatedSuccess"), severity: "success" });
      } else {
        await api.post("/payments", payload);
        setSnackbar({ open: true, message: t("voucherSavedSuccess"), severity: "success" });
      }
      setDialogOpen(false);
      fetchPayments();
    } catch { setSnackbar({ open: true, message: t("voucherSaveError"), severity: "error" }); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try {
      await api.delete(`/payments/${id}`);
      setSnackbar({ open: true, message: t("voucherDeletedSuccess"), severity: "success" });
      fetchPayments();
    } catch { setSnackbar({ open: true, message: t("voucherDeleteError"), severity: "error" }); }
  };

  const handlePrint = (p: PaymentVoucher) => {
    const w = window.open("", "", "width=800,height=600");
    if (!w) return;
    w.document.write(`<html><head><title>${t("paymentVoucher")}</title>
      <style>body{font-family:Arial;direction:rtl;padding:20px}.row{display:flex;justify-content:space-between;margin:10px 0}</style></head>
      <body><h2 style="text-align:center">${t("paymentVoucher")}</h2>
      <div class="row"><span><b>${t("date")}:</b> ${new Date(p.date).toLocaleDateString("ar-EG")}</span><span><b>${t("voucherNumber")}:</b> ${p.voucherNumber}</span></div>
      <div class="row"><span><b>${t("treasury")}:</b> ${p.treasury.name}</span><span><b>${t("amount")}:</b> ${p.amount.toLocaleString()} ${p.currency}</span></div>
      <div class="row"><span><b>${t("paidTo")}:</b> ${p.paidTo || "-"}</span><span><b>${t("costPrice")}:</b> ${p.costPrice ?? "-"}</span></div>
      ${p.exchangeRate !== 1 ? `<div class="row"><span><b>${t("exchangeRate")}:</b> ${p.exchangeRate}</span></div>` : ""}
      ${p.shipment  ? `<div class="row"><span><b>${t("shipmentId")}:</b> ${p.shipment.referenceNo}</span></div>` : ""}
      ${p.customer  ? `<div class="row"><span><b>${t("customer")}:</b> ${p.customer.name}</span></div>` : ""}
      ${p.supplier  ? `<div class="row"><span><b>${t("supplier")}:</b> ${p.supplier.name}</span></div>` : ""}
      <div class="row"><span><b>${t("notes")}:</b> ${p.notes || "-"}</span></div>
      </body></html>`);
    w.document.close(); w.print();
  };

  const total = payments.reduce((s, p) => s + p.amount, 0);

  const selTreasury = treasuries.find(x => x.id === form.treasuryId) || null;
  const selCategory = categories.find(x => x.id === form.expenseCategoryId) || null;
  const selCurrency = currencies.find(x => x.name === form.currency) || null;
  const selShipment = shipments.find(x => x.id === form.shipmentId) || null;
  const selCustomer = customers.find(x => x.id === form.customerId) || null;
  const selSupplier = suppliers.find(x => x.id === form.supplierId) || null;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>{t("paymentVouchersTitle")}</Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField label={t("from")} type="date" size="small" value={filterFrom}
          onChange={e => setFilterFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label={t("to")} type="date" size="small" value={filterTo}
          onChange={e => setFilterTo(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="outlined" onClick={() => { setFilterFrom(""); setFilterTo(""); }}>{t("clear")}</Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>{t("newPaymentVoucher")}</Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {["#", t("date"), t("voucherNumber"), t("voucherItemNumber"), t("treasury"),
                t("amount"), t("currencyLabel"), t("exchangeRate"), t("costPrice"),
                t("paidTo"), t("notes"), t("actions")]
                .map(h => <TableCell key={h} sx={{ fontWeight: 700 }}>{h}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p, i) => (
              <TableRow key={p.id} sx={{ "&:hover": { bgcolor: "grey.100" } }}>
                <TableCell>{payments.length - i}</TableCell>
                <TableCell>{new Date(p.date).toLocaleDateString("ar-EG")}</TableCell>
                <TableCell>{p.voucherNumber || "-"}</TableCell>
                <TableCell>{p.expenseCategory?.name || "-"}</TableCell>
                <TableCell>{p.treasury.name}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{p.amount.toLocaleString()}</TableCell>
                <TableCell>{p.currency || "-"}</TableCell>
                <TableCell>{p.exchangeRate || "-"}</TableCell>
                <TableCell>{p.costPrice ?? "-"}</TableCell>
                <TableCell>{p.paidTo || "-"}</TableCell>
                <TableCell>{p.notes || "-"}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => openEdit(p)}>{t("edit")}</Button>
                    <Button size="small" variant="outlined" color="info" startIcon={<PrintIcon />} onClick={() => handlePrint(p)}>{t("print")}</Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(p.id)}>{t("delete")}</Button>
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
        <DialogTitle>{editingId ? t("editPaymentVoucher") : t("newPaymentVoucher")}</DialogTitle>
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
                renderInput={params => <TextField {...params} label={t("treasury")} required />} />
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

            {/* Row 4 — Supplier + Paid To */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Autocomplete fullWidth options={suppliers}
                getOptionLabel={s => s.name} value={selSupplier}
                onChange={(_, v) => setForm({ ...form, supplierId: v?.id || "" })}
                renderInput={params => <TextField {...params} label={`${t("supplier")} (${t("optional")})`} />} />
              <TextField label={t("paidTo")} fullWidth value={form.paidTo}
                onChange={e => setForm({ ...form, paidTo: e.target.value })} />
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