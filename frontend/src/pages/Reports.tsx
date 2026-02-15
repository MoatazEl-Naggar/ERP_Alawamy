import { useState } from "react";
import api from "../api/axios";
import {
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Reports() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const { t } = useTranslation();
  const [cashFlow, setCashFlow] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [treasury, setTreasury] = useState<any>(null);

  const loadReports = async () => {
    const [cf, ex, tr] = await Promise.all([
      api.get("/reports/cashflow", { params: { start, end } }),
      api.get("/reports/expenses", { params: { start, end } }),
      api.get("/reports/treasury", { params: { start, end } })
    ]);

    setCashFlow(cf.data);
    setExpenses(ex.data);
    setTreasury(tr.data);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("reportsTitle")}</h2>

      {/* Date Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField type="date" fullWidth label={t("startDate")} InputLabelProps={{ shrink: true }} onChange={e => setStart(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField type="date" fullWidth label={t("endDate")} InputLabelProps={{ shrink: true }} onChange={e => setEnd(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Button variant="contained" fullWidth sx={{ height: "56px" }} onClick={loadReports}>
            {t("loadReports")}
          </Button>
        </Grid>
      </Grid>

      {/* Cash Flow Cards */}
      {cashFlow && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card><CardContent>
              <Typography variant="h6">{t("totalCashIn")}</Typography>
              <Typography variant="h5">{cashFlow.totalIn.toLocaleString()}</Typography>
            </CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card><CardContent>
              <Typography variant="h6">{t("totalCashOut")}</Typography>
              <Typography variant="h5">{cashFlow.totalOut.toLocaleString()}</Typography>
            </CardContent></Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card><CardContent>
              <Typography variant="h6">{t("netBalance")}</Typography>
              <Typography variant="h5">{cashFlow.net.toLocaleString()}</Typography>
            </CardContent></Card>
          </Grid>
        </Grid>
      )}

      {/* Expense Summary */}
      {expenses.length > 0 && (
        <>
          <h3>{t("expenseSummary")}</h3>
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t("categoryID")}</TableCell>
                <TableCell>{t("totalSpent")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>{e.expenseCategoryId || "Uncategorized"}</TableCell>
                  <TableCell>{e._sum.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}

      {/* Treasury Movements */}
      {treasury && (
        <>
          <h3>{t("treasuryMovements")}</h3>

          <h4>{t("receipts")}</h4>
          <Table sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>{t("voucher")}</TableCell>
                <TableCell>{t("treasury")}</TableCell>
                <TableCell>{t("amount")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {treasury.receipts.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>{r.voucherNo}</TableCell>
                  <TableCell>{r.treasury.name}</TableCell>
                  <TableCell>{r.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h4>{t("payments")}</h4>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("voucher")}</TableCell>
                <TableCell>{t("treasury")}</TableCell>
                <TableCell>{t("amount")}</TableCell>
                <TableCell>{t("expense")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {treasury.payments.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{p.voucherNo}</TableCell>
                  <TableCell>{p.treasury.name}</TableCell>
                  <TableCell>{p.amount.toLocaleString()}</TableCell>
                  <TableCell>{p.expenseCategory?.name || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </Paper>
  );
}
