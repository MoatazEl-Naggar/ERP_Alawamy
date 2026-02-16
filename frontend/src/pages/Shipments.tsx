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
export default function Shipments() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [containers, setContainers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [receivings, setReceivings] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const initialForm = {
    containerNo: "",
    containerId: "",
    date: "",
    customerId: "",
    shippingCompany: "",
    notes: "",
    items: [] as any[]
  };

  const [form, setForm] = useState({
    ...initialForm
  });

  const [receivingItems, setReceivingItems] = useState<any[]>([]);

  const fetchShipments = async () => {
    const res = await api.get("/shipments");
    setShipments(res.data);
  };

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  const fetchContainers = async () => {
    const res = await api.get("/containers");
    setContainers(res.data);
  };

  const fetchReceivings = async () => {
    const res = await api.get("/receiving");
    setReceivings(res.data);
  };

  useEffect(() => {
    fetchShipments();
    fetchContainers();
    fetchCustomers();
    fetchReceivings();
  }, []);

  const handleReceivingSelect = (receivingId: string) => {
    const receiving = receivings.find(r => r.id === receivingId);
    setReceivingItems(
      receiving.items.map((i: any) => ({
        receivingItemId: i.id,
        shippedCartons: 0,
        shippedUnits: 0
      }))
    );
  };

  const handleItemChange = (index: number, field: string, value: number) => {
    const updated = [...receivingItems];
    updated[index][field] = value;
    setReceivingItems(updated);
  };

  const { t } = useTranslation();

  const handleSave = async () => {
    await api.post("/shipments", { ...form, items: receivingItems });
    setOpen(false);
    setForm(initialForm);
    setReceivingItems([]);
    fetchShipments();
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setReceivingItems([]);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setForm(initialForm);
    setReceivingItems([]);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("shipmentsTitle")}</h2>

      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        {t("newShipment")}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("containerNumber")}</TableCell>
            <TableCell>{t("date")}</TableCell>
            <TableCell>{t("customer")}</TableCell>
            <TableCell>{t("items")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.container?.containerNo || s.containerNo}</TableCell>
              <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
              <TableCell>{s.customer?.name}</TableCell>
              <TableCell>{s.items.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>{t("newShipment")}</DialogTitle>
        <DialogContent>
          <TextField
            select
            SelectProps={{ native: true }}
            label={t("containerNumber")}
            fullWidth
            margin="dense"
            onChange={e => {
              const selected = containers.find((c) => c.id === e.target.value);
              setForm({
                ...form,
                containerId: e.target.value,
                containerNo: selected?.containerNo || ""
              });
            }}
          >
            <option value="">Select Container</option>
            {containers.map(c => (
              <option key={c.id} value={c.id}>{c.containerNo}</option>
            ))}
          </TextField>
          <TextField
            type="date"
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
          <TextField
            select
            SelectProps={{ native: true }}
            label={t("customer")}
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, customerId: e.target.value })}
          >
            <option value="">Select Customer</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </TextField>

          <TextField
            select
            SelectProps={{ native: true }}
            label={t("receivingInvoice")}
            fullWidth
            margin="dense"
            onChange={e => handleReceivingSelect(e.target.value)}
          >
            <option value="">Select Receiving</option>
            {receivings.map(r => (
              <option key={r.id} value={r.id}>{r.invoiceNumber}</option>
            ))}
          </TextField>

          <h4>{t("shipmentItems")}</h4>
          {receivingItems.map((_, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <TextField
                label={t("shippedCartons")}
                type="number"
                onChange={e => handleItemChange(index, "shippedCartons", +e.target.value)}
              />
              <TextField
                label={t("shippedUnits")}
                type="number"
                onChange={e => handleItemChange(index, "shippedUnits", +e.target.value)}
              />
            </div>
          ))}

          <TextField
            label={t("shippingCompany")}
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, shippingCompany: e.target.value })}
          />
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
          <Button onClick={handleCloseDialog}>{t("cancel")}</Button>
          <Button variant="contained" onClick={handleSave}>{t("saveShipment")}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
