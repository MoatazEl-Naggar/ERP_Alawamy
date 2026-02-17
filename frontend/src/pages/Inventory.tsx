import { useEffect, useState } from "react";
import api from "../api/axios";
import { 
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    api.get("/inventory/report").then(res => setItems(res.data));
  }, []);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        {t("inventoryReport")}
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("item")}</TableCell>
            <TableCell>{t("received")}</TableCell>
            <TableCell>{t("shipped")}</TableCell>
            <TableCell>{t("balance")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((i: any) => (
            <TableRow key={i.id}>
              <TableCell>{i.itemName}</TableCell>
              <TableCell>{i.totalReceived}</TableCell>
              <TableCell>{i.totalShipped}</TableCell>
              <TableCell>{i.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
