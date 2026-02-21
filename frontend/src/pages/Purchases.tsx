import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import {
  Alert, Box, Button, Chip, Divider, Grid, IconButton,
  InputAdornment, Paper, Snackbar, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, TextField, Tooltip, Typography
} from "@mui/material";
import AddIcon        from "@mui/icons-material/Add";
import SaveIcon        from "@mui/icons-material/Save";
import PrintIcon       from "@mui/icons-material/Print";
import DeleteIcon      from "@mui/icons-material/Delete";
import EditIcon        from "@mui/icons-material/Edit";
import SearchIcon      from "@mui/icons-material/Search";
import ClearIcon       from "@mui/icons-material/Clear";
import ImageIcon       from "@mui/icons-material/Image";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useTranslation } from "react-i18next";

// ─── Types ────────────────────────────────────────────────────────────────────
interface PurchaseItem {
  barcode: string;
  itemCode: string;
  qtyCartons: number;
  qtyUnits: number;
  totalUnits: number;       // qtyCartons × qtyUnits
  category: string;
  price: number;
  value: number;            // totalUnits × price
  itemDiscount: number;
  valueAfterDiscount: number;
  description: string;
  cartonNumber: string;
  receivingDate: string;
  cbm: number;
  itemNotes: string;
  images: string[];
}

interface Supplier { id: string; name: string; supplierNumber: string; }

interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  containerNo?: string;
  clientCode?: string;
  storeCode?: string;
  creditDays?: number;
  downPayment?: number;
  headerDiscount?: number;
  notes?: string;
  supplierId: string;
  supplier?: { name: string };
  items: any[];
}

// ─── Factories ────────────────────────────────────────────────────────────────
const mkItem = (): PurchaseItem => ({
  barcode: "", itemCode: "", qtyCartons: 0, qtyUnits: 0, totalUnits: 0,
  category: "", price: 0, value: 0, itemDiscount: 0, valueAfterDiscount: 0,
  description: "", cartonNumber: "", receivingDate: "", cbm: 0,
  itemNotes: "", images: [],
});

const mkForm = () => ({
  date: new Date().toISOString().split("T")[0],
  invoiceNumber: "",
  containerNo: "",
  clientCode: "",
  storeCode: "",
  creditDays: 30,
  downPayment: 0,
  headerDiscount: 0,
  notes: "",
  supplierId: "",
  items: [] as PurchaseItem[],
});

// ─── Styles ───────────────────────────────────────────────────────────────────
const BLUE      = "#1565C0";
const BLUE_LIGHT = "#E3F2FD";
const tblHead   = { bgcolor: BLUE, "& .MuiTableCell-root": { color: "#fff", fontWeight: 700, fontSize: "0.72rem", py: 1, px: 0.75, whiteSpace: "nowrap" } };
const tblCell   = { fontSize: "0.75rem", py: 0.6, px: 0.75, borderBottom: "1px solid #BBDEFB" };
const sectionTitle = (label: string) => (
  <Typography variant="caption" sx={{ fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: 1, mb: 0.5, display: "block" }}>
    {label}
  </Typography>
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function Purchases() {
  const { t } = useTranslation();
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [invoices,    setInvoices]    = useState<PurchaseInvoice[]>([]);
  const [suppliers,   setSuppliers]   = useState<Supplier[]>([]);
  const [form,        setForm]        = useState(mkForm());
  const [editingId,   setEditingId]   = useState<string | null>(null);
  const [draftItem,   setDraftItem]   = useState<PurchaseItem>(mkItem());
  const [searchTerm,  setSearchTerm]  = useState("");
  const [snackbar,    setSnackbar]    = useState({ open: false, msg: "", sev: "success" as "success" | "error" | "warning" });

  // ── Data loading ────────────────────────────────────────────────────────────
  const fetchInvoices  = async () => { const r = await api.get("/purchase-invoices"); setInvoices(r.data); };
  const fetchSuppliers = async () => { const r = await api.get("/suppliers");          setSuppliers(r.data); };
  useEffect(() => { fetchInvoices(); fetchSuppliers(); }, []);

  const toast = (msg: string, sev: "success"|"error"|"warning" = "success") =>
    setSnackbar({ open: true, msg, sev });

  // ── Auto-generate invoice number when containerNo changes ───────────────────
  useEffect(() => {
    if (form.containerNo && !editingId) {
      const seq = (invoices.length + 1).toString().padStart(5, "0");
      setForm(f => ({ ...f, invoiceNumber: `${f.containerNo}-${seq}` }));
    }
  }, [form.containerNo]);

  // ── Draft item auto-calc ────────────────────────────────────────────────────
  const patchItem = (patch: Partial<PurchaseItem>) => {
    setDraftItem(prev => {
      const next = { ...prev, ...patch };
      next.totalUnits          = next.qtyCartons * next.qtyUnits;
      next.value               = next.totalUnits * next.price;
      next.valueAfterDiscount  = next.value - next.itemDiscount;
      return next;
    });
  };

  // ── Add item row ───────────────────────────────────────────────���────────────
  const commitItem = () => {
    if (!draftItem.itemCode) { toast(t("itemCodeRequired"), "warning"); return; }
    setForm(f => ({ ...f, items: [...f.items, draftItem] }));
    setDraftItem(mkItem());
  };

  const removeItem = (idx: number) =>
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  // ── Images ──────────────────────────────────────────────────────────────────
  const handleImages = (files: FileList | null) => {
    if (!files) return;
    Promise.all(
      Array.from(files).map(f => new Promise<string>(res => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(f);
      }))
    ).then(imgs => patchItem({ images: [...draftItem.images, ...imgs] }));
  };

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const handleNew = () => { setForm(mkForm()); setDraftItem(mkItem()); setEditingId(null); };

  const handleSave = async () => {
    if (!form.supplierId)       { toast(t("supplierRequired"), "warning"); return; }
    if (!form.invoiceNumber)    { toast(t("invoiceNumberRequired"), "warning"); return; }
    if (form.items.length === 0){ toast(t("itemsRequired"), "warning"); return; }
    try {
      if (editingId) {
        await api.put(`/purchase-invoices/${editingId}`, form);
        toast(t("invoiceUpdatedSuccess"));
      } else {
        await api.post("/purchase-invoices", form);
        toast(t("invoiceSavedSuccess"));
      }
      handleNew();
      fetchInvoices();
    } catch { toast(t("invoiceSaveError"), "error"); }
  };

  const handleEdit = (inv: PurchaseInvoice) => {
    setForm({
      date:           inv.date?.split("T")[0] ?? "",
      invoiceNumber:  inv.invoiceNumber,
      containerNo:    inv.containerNo  ?? "",
      clientCode:     inv.clientCode   ?? "",
      storeCode:      inv.storeCode    ?? "",
      creditDays:     inv.creditDays   ?? 30,
      downPayment:    inv.downPayment  ?? 0,
      headerDiscount: inv.headerDiscount ?? 0,
      notes:          inv.notes        ?? "",
      supplierId:     inv.supplierId,
      items:          inv.items        ?? [],
    });
    setEditingId(inv.id);
    setDraftItem(mkItem());
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("confirmDelete"))) return;
    try {
      await api.delete(`/purchase-invoices/${id}`);
      toast(t("invoiceDeletedSuccess"));
      if (editingId === id) handleNew();
      fetchInvoices();
    } catch { toast(t("invoiceDeleteError"), "error"); }
  };

  // ── Print ───────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const w = window.open("", "", "width=1000,height=700");
    if (!w) return;
    const rows = form.items.map((it, i) => `
      <tr>
        <td>${i + 1}</td><td>${it.itemCode}</td><td>${it.barcode||"-"}</td>
        <td>${it.cartonNumber||"-"}</td><td>${it.qtyCartons}</td><td>${it.qtyUnits}</td>
        <td>${it.totalUnits}</td><td>${it.category||"-"}</td>
        <td>${it.price.toLocaleString()}</td><td>${it.value.toLocaleString()}</td>
        <td>${it.itemDiscount||0}</td><td>${it.valueAfterDiscount.toLocaleString()}</td>
        <td>${it.cbm||"-"}</td><td>${it.receivingDate||"-"}</td><td>${it.itemNotes||"-"}</td>
      </tr>`).join("");
    const grandTotal = form.items.reduce((s, i) => s + i.valueAfterDiscount, 0);
    w.document.write(`<html><head><title>${t("purchasesTitle")}</title>
      <style>
        body{font-family:Arial;direction:rtl;padding:20px;font-size:12px}
        h2{text-align:center;color:#1565C0}
        .header{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:16px;border:1px solid #ccc;padding:10px;border-radius:4px}
        .header span b{color:#1565C0}
        table{width:100%;border-collapse:collapse;margin-top:10px}
        th{background:#1565C0;color:white;padding:6px;text-align:right}
        td{padding:5px;border:1px solid #ddd;text-align:right}
        tr:nth-child(even){background:#f5f5f5}
        .total{font-weight:bold;margin-top:10px;font-size:14px;text-align:left}
      </style></head><body>
      <h2>${t("purchasesTitle")}</h2>
      <div class="header">
        <span><b>${t("invoiceNumber")}:</b> ${form.invoiceNumber}</span>
        <span><b>${t("date")}:</b> ${form.date}</span>
        <span><b>${t("containerNo")}:</b> ${form.containerNo||"-"}</span>
        <span><b>${t("supplier")}:</b> ${suppliers.find(s=>s.id===form.supplierId)?.name||"-"}</span>
        <span><b>${t("clientCode")}:</b> ${form.clientCode||"-"}</span>
        <span><b>${t("storeCode")}:</b> ${form.storeCode||"-"}</span>
        <span><b>${t("creditDays")}:</b> ${form.creditDays}</span>
        <span><b>${t("downPayment")}:</b> ${form.downPayment||0}</span>
      </div>
      <table>
        <thead><tr>
          <th>#</th><th>${t("itemCode")}</th><th>${t("barcode")}</th>
          <th>${t("cartonNumber")}</th><th>${t("cartons")}</th><th>${t("units")}</th>
          <th>${t("totalUnits")}</th><th>${t("category")}</th>
          <th>${t("price")}</th><th>${t("value")}</th>
          <th>${t("itemDiscount")}</th><th>${t("valueAfterDiscount")}</th>
          <th>${t("cbm")}</th><th>${t("receivingDate")}</th><th>${t("itemNotes")}</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="total">${t("total")}: ${grandTotal.toLocaleString()}</div>
      ${form.notes ? `<p><b>${t("notes")}:</b> ${form.notes}</p>` : ""}
    </body></html>`);
    w.document.close(); w.print();
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const grandTotal     = form.items.reduce((s, i) => s + i.valueAfterDiscount, 0);
  const totalCbm       = form.items.reduce((s, i) => s + (i.cbm || 0), 0);
  const totalCartons   = form.items.reduce((s, i) => s + i.qtyCartons, 0);
  const selSupplier    = suppliers.find(s => s.id === form.supplierId);

  const filteredInvoices = invoices.filter(inv =>
    !searchTerm ||
    inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* ══ Page Header ══════════════════════════════════════════════════════ */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
        <ReceiptLongIcon sx={{ color: BLUE, fontSize: 32 }} />
        <Box>
          <Typography variant="h5" fontWeight={800} color={BLUE} lineHeight={1}>
            {t("purchasesTitle")}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t("purchasesSubtitle")}
          </Typography>
        </Box>
        <Box flex={1} />
        {editingId && (
          <Chip label={`${t("editingInvoice")}: ${form.invoiceNumber}`}
            color="warning" size="small" onDelete={handleNew} />
        )}
      </Stack>

      <Grid container spacing={2}>
        {/* ══════════════════════════════════════════════════════════════════
            LEFT PANEL — Form
        ══════════════════════════════════════════════════════════════════ */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 2, borderTop: `4px solid ${BLUE}`, borderRadius: 2 }}>

            {/* ── Section 1: Invoice Header ─────────────────────────────── */}
            <Box sx={{ bgcolor: BLUE_LIGHT, borderRadius: 1, p: 1.5, mb: 2 }}>
              {sectionTitle(t("invoiceHeader"))}
              <Grid container spacing={1.5}>
                <Grid item xs={6} sm={3}>
                  <TextField fullWidth size="small" label={t("invoiceNumber")}
                    value={form.invoiceNumber}
                    onChange={e => setForm(f => ({ ...f, invoiceNumber: e.target.value }))}
                    InputProps={{ sx: { fontWeight: 700, bgcolor: "#fff" } }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField fullWidth size="small" label={t("date")} type="date"
                    value={form.date} InputLabelProps={{ shrink: true }}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    InputProps={{ sx: { bgcolor: "#fff" } }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField fullWidth size="small" label={t("containerNo")}
                    value={form.containerNo}
                    onChange={e => setForm(f => ({ ...f, containerNo: e.target.value }))}
                    InputProps={{ sx: { bgcolor: "#fff" } }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField fullWidth size="small" select label={t("supplier")}
                    SelectProps={{ native: true }}
                    value={form.supplierId}
                    onChange={e => setForm(f => ({ ...f, supplierId: e.target.value }))}
                    InputProps={{ sx: { bgcolor: "#fff" } }}>
                    <option value="">— {t("selectSupplier")} —</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.supplierNumber} — {s.name}</option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField fullWidth size="small" label={t("clientCode")}
                    value={form.clientCode}
                    onChange={e => setForm(f => ({ ...f, clientCode: e.target.value }))}
                    InputProps={{ sx: { bgcolor: "#fff" } }} />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField fullWidth size="small" label={t("creditDays")} type="number"
                    value={form.creditDays}
                    onChange={e => setForm(f => ({ ...f, creditDays: +e.target.value }))}
                    InputProps={{ sx: { bgcolor: "#fff" } }} />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField fullWidth size="small" label={t("downPayment")} type="number"
                    value={form.downPayment}
                    onChange={e => setForm(f => ({ ...f, downPayment: +e.target.value }))}
                    InputProps={{ sx: { bgcolor: "#fff" } }} />
                </Grid>
                <Grid item xs={6} sm={2}>
                  <TextField fullWidth size="small" label={t("headerDiscount")} type="number"
                    value={form.headerDiscount}
                    onChange={e => setForm(f => ({ ...f, headerDiscount: +e.target.value }))}
                    InputProps={{ sx: { bgcolor: "#fff" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth size="small" label={t("notes")}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    InputProps={{ sx: { bgcolor: "#fff" } }} />
                </Grid>
              </Grid>
            </Box>

            {/* ── Section 2: Item Entry ──────────────────────────────────── */}
            <Box sx={{ bgcolor: "#FAFAFA", border: "1px solid #E0E0E0", borderRadius: 1, p: 1.5, mb: 1.5 }}>
              {sectionTitle(t("addItem"))}
              <Grid container spacing={1} alignItems="flex-end">
                {/* Image button */}
                <Grid item xs="auto">
                  <Tooltip title={`${t("image")} (${draftItem.images.length})`}>
                    <IconButton
                      size="small"
                      onClick={() => fileInputRef.current?.click()}
                      sx={{
                        width: 52, height: 52, border: "2px dashed #E57373",
                        borderRadius: 1, bgcolor: draftItem.images.length ? "#FFCDD2" : "#FFF",
                        "&:hover": { bgcolor: "#FFEBEE" }
                      }}>
                      {draftItem.images.length > 0
                        ? <img src={draftItem.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
                        : <ImageIcon sx={{ color: "#E57373" }} />}
                    </IconButton>
                  </Tooltip>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple hidden
                    onChange={e => handleImages(e.target.files)} />
                </Grid>

                {/* Row 1 fields */}
                <Grid item xs={6} sm={2}><TextField fullWidth size="small" label={t("itemCode")}
                  value={draftItem.itemCode} onChange={e => patchItem({ itemCode: e.target.value })} /></Grid>
                <Grid item xs={6} sm={2}><TextField fullWidth size="small" label={t("barcode")}
                  value={draftItem.barcode} onChange={e => patchItem({ barcode: e.target.value })} /></Grid>
                <Grid item xs={4} sm={1}><TextField fullWidth size="small" label={t("cartons")} type="number"
                  value={draftItem.qtyCartons} onChange={e => patchItem({ qtyCartons: +e.target.value })} /></Grid>
                <Grid item xs={4} sm={1}><TextField fullWidth size="small" label={t("units")} type="number"
                  value={draftItem.qtyUnits} onChange={e => patchItem({ qtyUnits: +e.target.value })} /></Grid>
                <Grid item xs={4} sm={1}>
                  <TextField fullWidth size="small" label={t("totalUnits")}
                    value={draftItem.totalUnits} InputProps={{ readOnly: true, sx: { bgcolor: BLUE_LIGHT } }} />
                </Grid>
                <Grid item xs={4} sm={1.5}><TextField fullWidth size="small" label={t("category")}
                  value={draftItem.category} onChange={e => patchItem({ category: e.target.value })} /></Grid>
                <Grid item xs={4} sm={1}><TextField fullWidth size="small" label={t("price")} type="number"
                  value={draftItem.price} onChange={e => patchItem({ price: +e.target.value })} /></Grid>
                <Grid item xs={4} sm={1.5}>
                  <TextField fullWidth size="small" label={t("value")}
                    value={draftItem.value.toLocaleString()} InputProps={{ readOnly: true, sx: { bgcolor: BLUE_LIGHT, fontWeight: 700 } }} />
                </Grid>
                <Grid item xs={4} sm={1}><TextField fullWidth size="small" label={t("itemDiscount")} type="number"
                  value={draftItem.itemDiscount} onChange={e => patchItem({ itemDiscount: +e.target.value })} /></Grid>
                <Grid item xs={4} sm={1.5}>
                  <TextField fullWidth size="small" label={t("valueAfterDiscount")}
                    value={draftItem.valueAfterDiscount.toLocaleString()} InputProps={{ readOnly: true, sx: { bgcolor: "#E8F5E9", fontWeight: 700 } }} />
                </Grid>
                <Grid item xs={12} sm={3}><TextField fullWidth size="small" label={t("description")}
                  value={draftItem.description} onChange={e => patchItem({ description: e.target.value })} /></Grid>

                {/* Row 2 fields */}
                <Grid item xs={6} sm={2}><TextField fullWidth size="small" label={t("cartonNumber")}
                  value={draftItem.cartonNumber} onChange={e => patchItem({ cartonNumber: e.target.value })} /></Grid>
                <Grid item xs={6} sm={2}><TextField fullWidth size="small" label={t("receivingDate")} type="date"
                  value={draftItem.receivingDate} InputLabelProps={{ shrink: true }}
                  onChange={e => patchItem({ receivingDate: e.target.value })} /></Grid>
                <Grid item xs={4} sm={1}><TextField fullWidth size="small" label={t("cbm")} type="number"
                  value={draftItem.cbm} onChange={e => patchItem({ cbm: +e.target.value })} /></Grid>
                <Grid item xs={8} sm={3}><TextField fullWidth size="small" label={t("itemNotes")}
                  value={draftItem.itemNotes} onChange={e => patchItem({ itemNotes: e.target.value })} /></Grid>

                <Grid item xs={12} sm="auto">
                  <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={commitItem}
                    sx={{ bgcolor: BLUE, height: 40, px: 3, fontWeight: 700 }}>
                    {t("addItem")}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* ── Section 3: Items Table ─────────────────────────────────── */}
            <Box sx={{ overflowX: "auto", mb: 1.5 }}>
              <Table size="small" sx={{ minWidth: 860 }}>
                <TableHead sx={tblHead}>
                  <TableRow>
                    <TableCell align="center" width={36}>#</TableCell>
                    <TableCell>{t("image")}</TableCell>
                    <TableCell>{t("itemCode")}</TableCell>
                    <TableCell>{t("cartonNumber")}</TableCell>
                    <TableCell align="center">{t("cartons")}</TableCell>
                    <TableCell align="center">{t("units")}</TableCell>
                    <TableCell align="center">{t("totalUnits")}</TableCell>
                    <TableCell>{t("category")}</TableCell>
                    <TableCell align="right">{t("price")}</TableCell>
                    <TableCell align="right">{t("value")}</TableCell>
                    <TableCell align="right">{t("itemDiscount")}</TableCell>
                    <TableCell align="right" sx={{ color: "#FFD54F !important" }}>{t("valueAfterDiscount")}</TableCell>
                    <TableCell align="right">{t("cbm")}</TableCell>
                    <TableCell>{t("receivingDate")}</TableCell>
                    <TableCell>{t("itemNotes")}</TableCell>
                    <TableCell align="center" width={36}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={16} align="center" sx={{ py: 4, color: "text.disabled", fontStyle: "italic" }}>
                        {t("noItemsYet")}
                      </TableCell>
                    </TableRow>
                  ) : form.items.map((it, idx) => (
                    <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? BLUE_LIGHT : "#fff", "&:hover": { bgcolor: "#BBDEFB" } }}>
                      <TableCell sx={tblCell} align="center">{idx + 1}</TableCell>
                      <TableCell sx={tblCell}>
                        {it.images.length > 0
                          ? <Tooltip title={`${it.images.length} ${t("image")}`}>
                              <img src={it.images[0]} alt="" style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4, cursor: "pointer" }} />
                            </Tooltip>
                          : <ImageIcon sx={{ fontSize: 20, color: "#ccc" }} />}
                      </TableCell>
                      <TableCell sx={{ ...tblCell, fontWeight: 600 }}>{it.itemCode}</TableCell>
                      <TableCell sx={tblCell}>{it.cartonNumber || "—"}</TableCell>
                      <TableCell sx={tblCell} align="center">{it.qtyCartons}</TableCell>
                      <TableCell sx={tblCell} align="center">{it.qtyUnits}</TableCell>
                      <TableCell sx={{ ...tblCell, fontWeight: 600 }} align="center">{it.totalUnits}</TableCell>
                      <TableCell sx={tblCell}>{it.category}</TableCell>
                      <TableCell sx={tblCell} align="right">{it.price.toLocaleString()}</TableCell>
                      <TableCell sx={tblCell} align="right">{it.value.toLocaleString()}</TableCell>
                      <TableCell sx={{ ...tblCell, color: "error.main" }} align="right">{it.itemDiscount || "—"}</TableCell>
                      <TableCell sx={{ ...tblCell, fontWeight: 700, color: "#2E7D32" }} align="right">{it.valueAfterDiscount.toLocaleString()}</TableCell>
                      <TableCell sx={tblCell} align="right">{it.cbm || "—"}</TableCell>
                      <TableCell sx={tblCell}>{it.receivingDate || "—"}</TableCell>
                      <TableCell sx={tblCell}>{it.itemNotes || "—"}</TableCell>
                      <TableCell sx={tblCell} align="center">
                        <IconButton size="small" color="error" onClick={() => removeItem(idx)}>
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            {/* ── Section 4: Summary Footer ──────────────────────────────── */}
            {form.items.length > 0 && (
              <Box sx={{ bgcolor: BLUE, borderRadius: 1, p: 1.5, mb: 2 }}>
                <Grid container spacing={2} justifyContent="flex-end">
                  <Grid item>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>{t("totalCartons")}</Typography>
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>{totalCartons}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>{t("totalCbm")}</Typography>
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>{totalCbm.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>{t("totalItems")}</Typography>
                    <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>{form.items.length}</Typography>
                  </Grid>
                  <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.3)", mx: 1 }} />
                  <Grid item>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>{t("headerDiscount")}</Typography>
                    <Typography variant="h6" sx={{ color: "#FFD54F", fontWeight: 700 }}>{(form.headerDiscount || 0).toLocaleString()}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", display: "block" }}>{t("grandTotal")}</Typography>
                    <Typography variant="h5" sx={{ color: "#69F0AE", fontWeight: 800 }}>
                      {(grandTotal - (form.headerDiscount || 0)).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* ── Action Toolbar ─────────────────────────────────────────── */}
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleNew}
                sx={{ bgcolor: "#43A047" }}>{t("newInvoice")}</Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}
                sx={{ bgcolor: BLUE }}>{editingId ? t("update") : t("saveInvoice")}</Button>
              <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}
                disabled={form.items.length === 0}>{t("printInvoice")}</Button>
              <Button variant="outlined" color="error" startIcon={<ClearIcon />} onClick={handleNew}
                disabled={!editingId && form.items.length === 0}>{t("exitInvoice")}</Button>
            </Stack>
          </Paper>
        </Grid>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT PANEL — Invoices List
        ══════════════════════════════════════════════════════════════════ */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ p: 2, borderTop: `4px solid #43A047`, borderRadius: 2, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={700} color="#2E7D32" sx={{ mb: 1.5 }}>
              {t("invoicesList")} ({invoices.length})
            </Typography>

            {/* Search bar */}
            <TextField fullWidth size="small" placeholder={t("searchInvoice")}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              sx={{ mb: 1.5 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
                endAdornment: searchTerm
                  ? <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm("")}><ClearIcon fontSize="small" /></IconButton>
                    </InputAdornment>
                  : null
              }} />

            {/* List */}
            <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
              {filteredInvoices.length === 0 ? (
                <Typography color="text.disabled" textAlign="center" sx={{ mt: 4, fontStyle: "italic" }}>
                  {t("noInvoices")}
                </Typography>
              ) : filteredInvoices.map(inv => (
                <Paper key={inv.id} variant="outlined"
                  sx={{
                    p: 1.5, mb: 1, borderRadius: 1.5, cursor: "pointer",
                    borderColor: editingId === inv.id ? BLUE : "#E0E0E0",
                    bgcolor: editingId === inv.id ? BLUE_LIGHT : "#fff",
                    "&:hover": { bgcolor: BLUE_LIGHT, borderColor: BLUE }
                  }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box onClick={() => handleEdit(inv)} sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={700} color={BLUE}>
                        {inv.invoiceNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {inv.supplier?.name || "—"}
                      </Typography>
                      <Stack direction="row" spacing={0.5} mt={0.5} flexWrap="wrap">
                        <Chip size="small" label={new Date(inv.date).toLocaleDateString()} sx={{ height: 18, fontSize: "0.65rem" }} />
                        <Chip size="small" label={`${inv.items?.length || 0} ${t("items")}`}
                          color="primary" variant="outlined" sx={{ height: 18, fontSize: "0.65rem" }} />
                        {inv.containerNo && (
                          <Chip size="small" label={inv.containerNo} sx={{ height: 18, fontSize: "0.65rem", bgcolor: "#E3F2FD" }} />
                        )}
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title={t("editInvoice")}>
                        <IconButton size="small" onClick={() => handleEdit(inv)} sx={{ color: BLUE }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("deleteInvoice")}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(inv.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Snackbar ─────────────────────────────────────────────────────── */}
      <Snackbar open={snackbar.open} autoHideDuration={3500}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.sev} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}