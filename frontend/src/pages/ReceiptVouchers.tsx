import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Typography,
  Box,
  Grid,
  Divider
} from "@mui/material";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";

interface Treasury {
  id: string;
  name: string;
}

interface ReceiptVoucher {
  id: string;
  date: string;
  voucherNumber: string;
  amount: number;
  notes?: string;
  description?: string;
  receivedFrom?: string;
  exchangeRate?: number;
  currency?: string;
  treasury: {
    id: string;
    name: string;
  };
}

export default function ReceiptVouchers() {
  const { t } = useTranslation();
  const [receipts, setReceipts] = useState<ReceiptVoucher[]>([]);
  const [treasuries, setTreasuries] = useState<Treasury[]>([]);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" as "success" | "error" 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    voucherNumber: "",
    treasuryId: "",
    amount: 0,
    notes: "",
    description: "",
    receivedFrom: "",
    exchangeRate: 1,
    currency: "جنيه" // Egyptian Pound
  });

  const [headerValues, setHeaderValues] = useState({
    date: new Date().toISOString().split("T")[0],
    voucherNumber: "",
    accountCode: "RB-25-0001",
    amount: 0
  });

  const fetchReceipts = async () => {
    try {
      const res = await api.get("/receipts");
      setReceipts(res.data);
    } catch (error) {
      console.error("Error fetching receipts:", error);
    }
  };

  const fetchTreasuries = async () => {
    try {
      const res = await api.get("/treasuries");
      setTreasuries(res.data);
    } catch (error) {
      console.error("Error fetching treasuries:", error);
    }
  };

  useEffect(() => {
    fetchReceipts();
    fetchTreasuries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/receipts/${editingId}`, {
          ...form,
          amount: Number(form.amount),
          exchangeRate: Number(form.exchangeRate),
          date: new Date(form.date)
        });
        setSnackbar({ open: true, message: t("voucherUpdatedSuccess"), severity: "success" });
        setEditingId(null);
      } else {
        await api.post("/receipts", {
          ...form,
          amount: Number(form.amount),
          exchangeRate: Number(form.exchangeRate),
          date: new Date(form.date)
        });
        setSnackbar({ open: true, message: t("voucherSavedSuccess"), severity: "success" });
      }
      setForm({
        date: new Date().toISOString().split("T")[0],
        voucherNumber: "",
        treasuryId: "",
        amount: 0,
        notes: "",
        description: "",
        receivedFrom: "",
        exchangeRate: 1,
        currency: "جنيه"
      });
      fetchReceipts();
    } catch (error) {
      console.error("Error saving receipt:", error);
      setSnackbar({ 
        open: true, 
        message: t("voucherSaveError"), 
        severity: "error" 
      });
    }
  };

  const handleEdit = (receipt: ReceiptVoucher) => {
    setForm({
      date: receipt.date,
      voucherNumber: receipt.voucherNumber,
      treasuryId: receipt.treasury.id,
      amount: receipt.amount,
      notes: receipt.notes || "",
      description: receipt.description || "",
      receivedFrom: receipt.receivedFrom || "",
      exchangeRate: receipt.exchangeRate || 1,
      currency: receipt.currency || "جنيه"
    });
    setEditingId(receipt.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await api.delete(`/receipts/${id}`);
        setSnackbar({ open: true, message: t("voucherDeletedSuccess"), severity: "success" });
        fetchReceipts();
      } catch (error) {
        console.error("Error deleting receipt:", error);
        setSnackbar({ 
          open: true, 
          message: t("voucherDeleteError"), 
          severity: "error" 
        });
      }
    }
  };

  const handlePrint = (receipt: ReceiptVoucher) => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${t("receiptVoucher")}</title>
            <style>
              body { font-family: Arial; direction: rtl; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .details { margin: 20px 0; }
              .row { display: flex; justify-content: space-between; margin: 10px 0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #000; padding: 8px; text-align: right; }
              th { background-color: #f0f0f0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${t("receiptVoucher")}</h2>
            </div>
            <div class="details">
              <div class="row">
                <span><strong>${t("date")}:</strong> ${new Date(receipt.date).toLocaleDateString("ar-EG")}</span>
                <span><strong>${t("voucherNumber")}:</strong> ${receipt.voucherNumber}</span>
              </div>
              <div class="row">
                <span><strong>${t("treasury")}:</strong> ${receipt.treasury.name}</span>
                <span><strong>${t("amount")}:</strong> ${receipt.amount.toLocaleString()} ${receipt.currency}</span>
              </div>
              <div class="row">
                <span><strong>${t("receivedFrom")}:</strong> ${receipt.receivedFrom || "-"}</span>
              </div>
              ${receipt.exchangeRate !== 1 ? `
              <div class="row">
                <span><strong>${t("exchangeRate")}:</strong> ${receipt.exchangeRate}</span>
              </div>
              ` : ""}
              <div class="row">
                <span><strong>${t("notes")}:</strong> ${receipt.notes || "-"}</span>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const totalAmount = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}>
        {t("receiptVouchersTitle")}
      </Typography>

      {/* Header Section with Key Information */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.100", border: "2px solid #4caf50" }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("date")}
              type="date"
              size="small"
              value={headerValues.date}
              onChange={(e) => setHeaderValues({ ...headerValues, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("voucherNumber")}
              size="small"
              value={headerValues.voucherNumber}
              onChange={(e) => setHeaderValues({ ...headerValues, voucherNumber: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("accountCode")}
              size="small"
              value={headerValues.accountCode}
              onChange={(e) => setHeaderValues({ ...headerValues, accountCode: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t("totalAmount")}
              size="small"
              type="number"
              value={headerValues.amount}
              onChange={(e) => setHeaderValues({ ...headerValues, amount: Number(e.target.value) })}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Form Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {editingId ? t("editReceiptVoucher") : t("newReceiptVoucher")}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("date")}
                type="date"
                fullWidth
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label={t("voucherNumber")}
                fullWidth
                value={form.voucherNumber}
                onChange={(e) => setForm({ ...form, voucherNumber: e.target.value })}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <FormControl fullWidth required>
                <InputLabel>{t("treasury")}</InputLabel>
                <Select
                  value={form.treasuryId}
                  onChange={(e) => setForm({ ...form, treasuryId: e.target.value })}
                  label={t("treasury")}
                >
                  {treasuries.map((treasury) => (
                    <MenuItem key={treasury.id} value={treasury.id}>
                      {treasury.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={t("amount")}
                type="number"
                fullWidth
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("receivedFrom")}
                fullWidth
                value={form.receivedFrom}
                onChange={(e) => setForm({ ...form, receivedFrom: e.target.value })}
              />
              <TextField
                label={t("currency")}
                fullWidth
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("exchangeRate")}
                type="number"
                fullWidth
                step="0.01"
                value={form.exchangeRate}
                onChange={(e) => setForm({ ...form, exchangeRate: parseFloat(e.target.value) })}
              />
              <TextField
                label={t("description")}
                fullWidth
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Stack>

            <TextField
              label={t("notes")}
              fullWidth
              multiline
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />}>
                {editingId ? t("update") : t("save")}
              </Button>
              {editingId && (
                <Button 
                  type="button" 
                  variant="outlined" 
                  onClick={() => {
                    setEditingId(null);
                    setForm({
                      date: new Date().toISOString().split("T")[0],
                      voucherNumber: "",
                      treasuryId: "",
                      amount: 0,
                      notes: "",
                      description: "",
                      receivedFrom: "",
                      exchangeRate: 1,
                      currency: "جنيه"
                    });
                  }}
                >
                  {t("cancel")}
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Table Section */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("receiptVouchersTab")} ({receipts.length})
      </Typography>
      
      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#4caf50" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: 600, width: "5%" }}>#</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("date")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("voucherNumber")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("treasury")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("amount")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("currency")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("exchangeRate")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("receivedFrom")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("notes")}</TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {receipts.map((receipt, index) => (
              <TableRow key={receipt.id} sx={{ "&:hover": { bgcolor: "grey.100" } }}>
                <TableCell>{receipts.length - index}</TableCell>
                <TableCell>{new Date(receipt.date).toLocaleDateString("ar-EG")}</TableCell>
                <TableCell>{receipt.voucherNumber || "-"}</TableCell>
                <TableCell>{receipt.treasury.name}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{receipt.amount.toLocaleString()}</TableCell>
                <TableCell>{receipt.currency || "-"}</TableCell>
                <TableCell>{receipt.exchangeRate || "-"}</TableCell>
                <TableCell>{receipt.receivedFrom || "-"}</TableCell>
                <TableCell>{receipt.notes || "-"}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleEdit(receipt)}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      startIcon={<PrintIcon />}
                      onClick={() => handlePrint(receipt)}
                    >
                      {t("print")}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(receipt.id)}
                    >
                      {t("delete")}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ bgcolor: "grey.100", fontWeight: 600 }}>
              <TableCell colSpan={4} sx={{ fontWeight: 600 }}>{t("total")}</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{totalAmount.toLocaleString()}</TableCell>
              <TableCell colSpan={5}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}