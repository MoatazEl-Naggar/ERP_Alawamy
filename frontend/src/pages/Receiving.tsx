import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import { useTranslation } from "react-i18next";
export default function Receiving() {
  const [receivings, setReceivings] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    invoiceNumber: "",
    date: "",
    purchaseId: "",
    notes: "",
    items: [] as any[]
  });

  const [selectedPurchaseItems, setSelectedPurchaseItems] = useState<any[]>([]);

  const fetchReceivings = async () => {
    const res = await api.get("/receiving");
    setReceivings(res.data);
  };

  const fetchPurchases = async () => {
    const res = await api.get("/purchase-invoices");
    setPurchases(res.data);
  };

  useEffect(() => {
    fetchReceivings();
    fetchPurchases();
  }, []);

  const handlePurchaseSelect = (purchaseId: string) => {
    const purchase = purchases.find(p => p.id === purchaseId);
    setForm({ ...form, purchaseId });
    setSelectedPurchaseItems(
      purchase.items.map((i: any) => ({
        purchaseItemId: i.id,
        receivedCartons: 0,
        receivedUnits: 0,
        damagedUnits: 0
      }))
    );
  };

  const handleItemChange = (index: number, field: string, value: number) => {
    const updated = [...selectedPurchaseItems];
    updated[index][field] = value;
    setSelectedPurchaseItems(updated);
  };

  const { t } = useTranslation();

  const handleSave = async () => {
    await api.post("/receiving", { ...form, items: selectedPurchaseItems });
    setOpen(false);
    fetchReceivings();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("receivingTitle")}</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        {t("newReceiving")}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("invoiceNumber")}</TableCell>
            <TableCell>{t("date")}</TableCell>
            <TableCell>{t("purchaseRef")}</TableCell>
            <TableCell>{t("items")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {receivings.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.invoiceNumber}</TableCell>
              <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
              <TableCell>{r.purchase?.invoiceNumber}</TableCell>
              <TableCell>{r.items.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{t("newReceiving")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("receivingNumber")}
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, invoiceNumber: e.target.value })}
          />
          <TextField
            label={t("date")}
            type="date"
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, date: e.target.value })}
          />

          <TextField
            select
            SelectProps={{ native: true }}
            label={t("purchaseInvoice")}
            fullWidth
            margin="dense"
            onChange={e => handlePurchaseSelect(e.target.value)}
          >
            <option value="">Select Purchase</option>
            {purchases.map(p => (
              <option key={p.id} value={p.id}>{p.invoiceNumber}</option>
            ))}
          </TextField>

          <h4>{t("receivedItems")}</h4>
          {selectedPurchaseItems.map((_, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <TextField
                label={t("receivedCartons")}
                type="number"
                onChange={e => handleItemChange(index, "receivedCartons", +e.target.value)}
              />
              <TextField
                label={t("receivedUnits")}
                type="number"
                onChange={e => handleItemChange(index, "receivedUnits", +e.target.value)}
              />
              <TextField
                label={t("damagedUnits")}
                type="number"
                onChange={e => handleItemChange(index, "damagedUnits", +e.target.value)}
              />
            </div>
          ))}

          <TextField
            label={t("notes")}
            fullWidth
            margin="dense"
            multiline
            rows={2}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t("cancel")}</Button>
          <Button variant="contained" onClick={handleSave}>{t("save")}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
