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

export default function Reports() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

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
      <h2>Financial Reports</h2>

      {/* Date Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField type="date" fullWidth label="Start Date" InputLabelProps={{ shrink: true }} onChange={e => setStart(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField type="date" fullWidth label="End Date" InputLabelProps={{ shrink: true }} onChange={e => setEnd(e.target.value)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Button variant="contained" fullWidth sx={{ height: "56px" }} onClick={loadReports}>
            Load Reports
          </Button>
        </Grid>
      </Grid>

      {/* Cash Flow Cards */}
      {cashFlow && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card><CardContent>
              <Typography variant="h6">Total Cash In</Typography>
              <Typography variant="h5">{cashFlow.totalIn.toLocaleString()}</Typography>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card><CardContent>
              <Typography variant="h6">Total Cash Out</Typography>
              <Typography variant="h5">{cashFlow.totalOut.toLocaleString()}</Typography>
            </CardContent></Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card><CardContent>
              <Typography variant="h6">Net Balance</Typography>
              <Typography variant="h5">{cashFlow.net.toLocaleString()}</Typography>
            </CardContent></Card>
          </Grid>
        </Grid>
      )}

      {/* Expense Summary */}
      {expenses.length > 0 && (
        <>
          <h3>Expense Summary</h3>
          <Table sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Category ID</TableCell>
                <TableCell>Total Spent</TableCell>
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
          <h3>Treasury Movements</h3>

          <h4>Receipts</h4>
          <Table sx={{ mb: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Voucher</TableCell>
                <TableCell>Treasury</TableCell>
                <TableCell>Amount</TableCell>
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

          <h4>Payments</h4>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Voucher</TableCell>
                <TableCell>Treasury</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Expense</TableCell>
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
