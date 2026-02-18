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
  Alert,
  Grid
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";

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

interface PaymentVoucher {
  id: string;
  date: string;
  voucherNumber: string;
  amount: number;
  notes?: string;
  description?: string;
  paidTo?: string;
  exchangeRate?: number;
  currency?: string;
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

  const handleExportToCSV = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintAll = (data: (ReceiptVoucher | PaymentVoucher)[], title: string) => {
    const printWindow = window.open("", "", "width=1000,height=700");
    if (printWindow) {
      const rows = data.map((item, index) => `
        <tr>
          <td>${data.length - index}</td>
          <td>${new Date(item.date).toLocaleDateString("ar-EG")}</td>
          <td>${(item as any).voucherNumber || "-"}</td>
          <td>${item.treasury.name}</td>
          <td>${item.amount.toLocaleString()}</td>
          <td>${(item as any).currency || "-"}</td>
          <td>${(item as any).paidTo || (item as any).receivedFrom || "-"}</td>
          <td>${item.notes || "-"}</td>
        </tr>
      `).join("");

      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial; direction: rtl; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #000; padding: 8px; text-align: right; }
              th { background-color: #f0f0f0; font-weight: bold; }
              .summary { margin-top: 20px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>${title}</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>${t("date")}</th>
                  <th>${t("voucherNumber")}</th>
                  <th>${t("treasury")}</th>
                  <th>${t("amount")}</th>
                  <th>${t("currency")}</th>
                  <th>${title.includes(t("receipt")) ? t("receivedFrom") : t("paidTo")}</th>
                  <th>${t("notes")}</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <div class="summary">
              <p>${t("total")}: ${(title.includes(t("receipt")) ? totalReceipts : totalPayments).toLocaleString()}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}>
        {t("voucherReviewTitle")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Filter Section */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "grey.50", border: "1px solid #ddd" }}>
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

      {/* Summary Section */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "#f5f5f5", border: "2px solid #1976d2" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {t("expenseSummary")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: "center", p: 2, bgcolor: "success.light", borderRadius: 1 }}>
              <Typography color="success.dark" sx={{ fontWeight: 600 }}>
                {t("totalReceipts")}
              </Typography>
              <Typography variant="h6" sx={{ color: "success.main", fontWeight: 700 }}>
                {totalReceipts.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: "center", p: 2, bgcolor: "error.light", borderRadius: 1 }}>
              <Typography color="error.dark" sx={{ fontWeight: 600 }}>
                {t("totalPayments")}
              </Typography>
              <Typography variant="h6" sx={{ color: "error.main", fontWeight: 700 }}>
                {totalPayments.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              textAlign: "center", 
              p: 2, 
              bgcolor: netAmount >= 0 ? "info.light" : "warning.light", 
              borderRadius: 1 
            }}>
              <Typography sx={{ fontWeight: 600 }}>
                {t("netAmount")}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: netAmount >= 0 ? "info.main" : "warning.main", 
                  fontWeight: 700 
                }}
              >
                {netAmount.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: "center", p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
              <Typography color="primary.dark" sx={{ fontWeight: 600 }}>
                {t("vouchersCount")}
              </Typography>
              <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>
                {filteredReceipts.length + filteredPayments.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Tabs Section */}
      <Tabs 
        value={tabValue} 
        onChange={(_, newValue) => setTabValue(newValue)} 
        sx={{ mb: 2 }}
        variant="fullWidth"
      >
        <Tab label={`${t("receiptVouchersTab")} (${filteredReceipts.length})`} />
        <Tab label={`${t("paymentVouchersTab")} (${filteredPayments.length})`} />
      </Tabs>

      {/* Receipt Vouchers Tab */}
      {tabValue === 0 && (
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => handlePrintAll(filteredReceipts, t("receiptVouchersTab"))}
            >
              {t("printAll")}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExportToCSV(filteredReceipts, "receipts.csv")}
            >
              {t("exportCSV")}
            </Button>
          </Stack>
          
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
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("receivedFrom")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("notes")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReceipts.map((receipt, index) => (
                  <TableRow key={receipt.id} sx={{ "&:hover": { bgcolor: "grey.100" } }}>
                    <TableCell>{filteredReceipts.length - index}</TableCell>
                    <TableCell>{new Date(receipt.date).toLocaleDateString("ar-EG")}</TableCell>
                    <TableCell>{receipt.voucherNumber || "-"}</TableCell>
                    <TableCell>{receipt.treasury.name}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{receipt.amount.toLocaleString()}</TableCell>
                    <TableCell>{receipt.currency || "-"}</TableCell>
                    <TableCell>{receipt.receivedFrom || "-"}</TableCell>
                    <TableCell>{receipt.notes || "-"}</TableCell>
                  </TableRow>
                ))}
                {filteredReceipts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: "center", py: 3 }}>
                      <Typography color="textSecondary">{t("noData")}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}

      {/* Payment Vouchers Tab */}
      {tabValue === 1 && (
        <Box>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => handlePrintAll(filteredPayments, t("paymentVouchersTab"))}
            >
              {t("printAll")}
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => handleExportToCSV(filteredPayments, "payments.csv")}
            >
              {t("exportCSV")}
            </Button>
          </Stack>
          
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: 600, width: "5%" }}>#</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("date")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("voucherNumber")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("treasury")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("amount")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("currency")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("exchangeRate")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("paidTo")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("expenseCategory")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{t("notes")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPayments.map((payment, index) => (
                  <TableRow key={payment.id} sx={{ "&:hover": { bgcolor: "grey.100" } }}>
                    <TableCell>{filteredPayments.length - index}</TableCell>
                    <TableCell>{new Date(payment.date).toLocaleDateString("ar-EG")}</TableCell>
                    <TableCell>{payment.voucherNumber || "-"}</TableCell>
                    <TableCell>{payment.treasury.name}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>{payment.currency || "-"}</TableCell>
                    <TableCell>{payment.exchangeRate || "-"}</TableCell>
                    <TableCell>{payment.paidTo || "-"}</TableCell>
                    <TableCell>{payment.expenseCategory?.name || "-"}</TableCell>
                    <TableCell>{payment.notes || "-"}</TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ textAlign: "center", py: 3 }}>
                      <Typography color="textSecondary">{t("noData")}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}
    </Paper>
  );
}