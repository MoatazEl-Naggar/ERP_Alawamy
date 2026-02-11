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

export default function Shipments() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [receivings, setReceivings] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    containerNo: "",
    date: "",
    customerId: "",
    shippingCompany: "",
    notes: "",
    items: [] as any[]
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

  const fetchReceivings = async () => {
    const res = await api.get("/receiving");
    setReceivings(res.data);
  };

  useEffect(() => {
    fetchShipments();
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

  const handleSave = async () => {
    await api.post("/shipments", { ...form, items: receivingItems });
    setOpen(false);
    fetchShipments();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>Shipments</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        New Shipment
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Container #</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Items</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {shipments.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.containerNo}</TableCell>
              <TableCell>{new Date(s.date).toLocaleDateString()}</TableCell>
              <TableCell>{s.customer?.name}</TableCell>
              <TableCell>{s.items.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>New Shipment</DialogTitle>
        <DialogContent>
          <TextField
            label="Container Number"
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, containerNo: e.target.value })}
          />
          <TextField
            type="date"
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
          <TextField
            select
            SelectProps={{ native: true }}
            label="Customer"
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
            label="Receiving Invoice"
            fullWidth
            margin="dense"
            onChange={e => handleReceivingSelect(e.target.value)}
          >
            <option value="">Select Receiving</option>
            {receivings.map(r => (
              <option key={r.id} value={r.id}>{r.invoiceNumber}</option>
            ))}
          </TextField>

          <h4>Shipment Items</h4>
          {receivingItems.map((item, index) => (
            <div key={index} style={{ marginBottom: 10 }}>
              <TextField
                label="Shipped Cartons"
                type="number"
                onChange={e => handleItemChange(index, "shippedCartons", +e.target.value)}
              />
              <TextField
                label="Shipped Units"
                type="number"
                onChange={e => handleItemChange(index, "shippedUnits", +e.target.value)}
              />
            </div>
          ))}

          <TextField
            label="Shipping Company"
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, shippingCompany: e.target.value })}
          />
          <TextField
            label="Notes"
            fullWidth
            margin="dense"
            multiline
            rows={2}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save Shipment</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
