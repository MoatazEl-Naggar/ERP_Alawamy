import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@mui/material";

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [lowStock, setLowStock] = useState<any[]>([]);

  const loadData = async () => {
    const [customers, suppliers, inventory, cashflow] = await Promise.all([
      api.get("/customers"),
      api.get("/suppliers"),
      api.get("/inventory/report"),
      api.get("/reports/cashflow")
    ]);

    setStats({
      customers: customers.data.length,
      suppliers: suppliers.data.length,
      inventoryItems: inventory.data.length,
      netCash: cashflow.data.net
    });

    const low = inventory.data.filter((i: any) => i.balance < 20);
    setLowStock(low);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography variant="h6">Customers</Typography>
            <Typography variant="h4">{stats.customers || 0}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography variant="h6">Suppliers</Typography>
            <Typography variant="h4">{stats.suppliers || 0}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography variant="h6">Inventory Items</Typography>
            <Typography variant="h4">{stats.inventoryItems || 0}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card><CardContent>
            <Typography variant="h6">Net Cash</Typography>
            <Typography variant="h4">{stats.netCash?.toLocaleString() || 0}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      {/* Low Stock Table */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Low Stock Alert</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Balance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStock.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.balance}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
