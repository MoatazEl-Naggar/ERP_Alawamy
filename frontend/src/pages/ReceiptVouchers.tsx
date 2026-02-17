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
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Treasury {
  id: string;
  name: string;
}

interface ReceiptVoucher {
  id: string;
  date: string;
  amount: number;
  notes?: string;
  description?: string;
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

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    treasuryId: "",
    amount: 0,
    notes: "",
    description: ""
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
      await api.post("/receipts", {
        ...form,
        amount: Number(form.amount),
        date: new Date(form.date)
      });
      setSnackbar({ open: true, message: t("voucherSavedSuccess"), severity: "success" });
      setForm({
        date: new Date().toISOString().split("T")[0],
        treasuryId: "",
        amount: 0,
        notes: "",
        description: ""
      });
      fetchReceipts();
    } catch (error) {
      console.error("Error creating receipt:", error);
      setSnackbar({ 
        open: true, 
        message: t("voucherSaveError"), 
        severity: "error" 
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {t("receiptVouchersTitle")}
      </Typography>

      <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.50" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("newReceiptVoucher")}
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
              <FormControl fullWidth required>
                <InputLabel>{t("treasury")}</InputLabel>
                <Select
                  value={form.treasuryId}
                  label={t("treasury")}
                  onChange={(e) => setForm({ ...form, treasuryId: e.target.value })}
                >
                  {treasuries.map((treasury) => (
                    <MenuItem key={treasury.id} value={treasury.id}>
                      {treasury.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label={t("amount")}
                type="number"
                fullWidth
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                inputProps={{ min: 0, step: "0.01" }}
              />
              <TextField
                label={t("receivedFrom")}
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

            <Button type="submit" variant="contained" sx={{ alignSelf: "flex-start" }}>
              {t("saveVoucher")}
            </Button>
          </Stack>
        </form>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>
        {t("receiptVouchersTab")}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("voucherNumber")}</TableCell>
            <TableCell>{t("date")}</TableCell>
            <TableCell>{t("treasury")}</TableCell>
            <TableCell>{t("amount")}</TableCell>
            <TableCell>{t("receivedFrom")}</TableCell>
            <TableCell>{t("notes")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {receipts.map((receipt, index) => (
            <TableRow key={receipt.id}>
              <TableCell>{receipts.length - index}</TableCell>
              <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
              <TableCell>{receipt.treasury.name}</TableCell>
              <TableCell>{receipt.amount.toLocaleString()}</TableCell>
              <TableCell>{receipt.description || "-"}</TableCell>
              <TableCell>{receipt.notes || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
