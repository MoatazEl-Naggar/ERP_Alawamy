import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Alert
} from "@mui/material";
import { useTranslation } from "react-i18next";

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

interface PaymentVoucher {
  id: string;
  date: string;
  amount: number;
  notes?: string;
  description?: string;
  treasury: {
    id: string;
    name: string;
  };
  expenseCategory?: {
    id: string;
    name: string;
  };
}

export default function VoucherReview() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const [receipts, setReceipts] = useState<ReceiptVoucher[]>([]);
  const [payments, setPayments] = useState<PaymentVoucher[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchReceipts = async () => {
    try {
      const res = await api.get("/receipts");
      setReceipts(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching receipts:", err);
      setError(t("voucherLoadError"));
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get("/payments");
      setPayments(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError(t("voucherLoadError"));
    }
  };

  useEffect(() => {
    fetchReceipts();
    fetchPayments();
  }, []);

  const filterByDate = <T extends { date: string }>(vouchers: T[]): T[] => {
    if (!dateFrom && !dateTo) return vouchers;
    
    return vouchers.filter((v) => {
      const voucherDate = new Date(v.date);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      if (from && to) {
        return voucherDate >= from && voucherDate <= to;
      } else if (from) {
        return voucherDate >= from;
      } else if (to) {
        return voucherDate <= to;
      }
      return true;
    });
  };

  const filteredReceipts = filterByDate(receipts);
  const filteredPayments = filterByDate(payments);

  const totalReceipts = filteredReceipts.reduce((sum, r) => sum + r.amount, 0);
  const totalPayments = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const netAmount = totalReceipts - totalPayments;

  const handleClearFilter = () => {
    setDateFrom("");
    setDateTo("");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {t("voucherReviewTitle")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
          <TextField
            label={t("from")}
            type="date"
            size="small"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label={t("to")}
            type="date"
            size="small"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="outlined" size="small" onClick={handleClearFilter}>
            {t("clear")}
          </Button>
        </Stack>
      </Paper>

      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
        <Tab label={t("receiptVouchersTab")} />
        <Tab label={t("paymentVouchersTab")} />
      </Tabs>

      {tabValue === 0 && (
        <Box>
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
              {filteredReceipts.map((receipt, index) => (
                <TableRow key={receipt.id}>
                  <TableCell>{filteredReceipts.length - index}</TableCell>
                  <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                  <TableCell>{receipt.treasury.name}</TableCell>
                  <TableCell>{receipt.amount.toLocaleString()}</TableCell>
                  <TableCell>{receipt.description || "-"}</TableCell>
                  <TableCell>{receipt.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("voucherNumber")}</TableCell>
                <TableCell>{t("date")}</TableCell>
                <TableCell>{t("treasury")}</TableCell>
                <TableCell>{t("expenseCategory")}</TableCell>
                <TableCell>{t("amount")}</TableCell>
                <TableCell>{t("paidTo")}</TableCell>
                <TableCell>{t("notes")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments.map((payment, index) => (
                <TableRow key={payment.id}>
                  <TableCell>{filteredPayments.length - index}</TableCell>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.treasury.name}</TableCell>
                  <TableCell>{payment.expenseCategory?.name || "-"}</TableCell>
                  <TableCell>{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{payment.description || "-"}</TableCell>
                  <TableCell>{payment.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 2, bgcolor: "primary.50" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("expenseSummary")}
        </Typography>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={600}>{t("totalReceipts")}:</Typography>
            <Typography color="success.main" fontWeight={700}>
              {totalReceipts.toLocaleString()}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={600}>{t("totalPayments")}:</Typography>
            <Typography color="error.main" fontWeight={700}>
              {totalPayments.toLocaleString()}
            </Typography>
          </Stack>
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700} variant="h6">
              {t("netAmount")}:
            </Typography>
            <Typography
              fontWeight={700}
              variant="h6"
              color={netAmount >= 0 ? "success.main" : "error.main"}
            >
              {netAmount.toLocaleString()}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Paper>
  );
}
