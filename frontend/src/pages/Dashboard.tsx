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
  TableBody,
  Stack,
  Chip
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const [stats, setStats] = useState<any>({});
  const [lowStock, setLowStock] = useState<any[]>([]);
  const { t } = useTranslation();

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
    <Stack spacing={2.5}>
      <Typography variant="h4" fontWeight={700}>{t("dashboardTitle")}</Typography>

       <Grid container spacing={2}>
        {[
          { label: t("customers"), value: stats.customers || 0 },
          { label: t("suppliers"), value: stats.suppliers || 0 },
          { label: t("inventoryItems"), value: stats.inventoryItems || 0 },
          { label: t("netCash"), value: stats.netCash?.toLocaleString() || 0 }
        ].map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, md: 3 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                <Typography variant="h4" fontWeight={700} color="primary.main">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>{t("lowStock")}</Typography>
          <Chip label={`${lowStock.length} ${t("item")}`} color={lowStock.length ? "warning" : "success"} size="small" />
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("item")}</TableCell>
              <TableCell>{t("balance")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStock.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.balance}</TableCell>
              </TableRow>
            ))}
             {lowStock.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">No low-stock alerts right now.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
