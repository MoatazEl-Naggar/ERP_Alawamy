import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";

interface PurchaseItem {
  itemName: string;
  qtyCartons: number;
  qtyUnits: number;
  price: number;
  total: number;
}

interface Supplier {
  id: string;
  name: string;
}

export default function Purchases() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    invoiceNumber: "",
    referenceNo: "",
    date: "",
    supplierId: "",
    notes: "",
    items: [] as PurchaseItem[]
  });

  const [item, setItem] = useState<PurchaseItem>({
    itemName: "",
    qtyCartons: 0,
    qtyUnits: 0,
    price: 0,
    total: 0
  });

  const fetchInvoices = async () => {
    const res = await api.get("/purchase-invoices");
    setInvoices(res.data);
  };

  const fetchSuppliers = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchInvoices();
    fetchSuppliers();
  }, []);

  const addItem = () => {
    setForm({ ...form, items: [...form.items, item] });
    setItem({ itemName: "", qtyCartons: 0, qtyUnits: 0, price: 0, total: 0 });
  };

  const handleSave = async () => {
    await api.post("/purchase-invoices", form);
    setOpen(false);
    setForm({ invoiceNumber: "", referenceNo: "", date: "", supplierId: "", notes: "", items: [] });
    fetchInvoices();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>Purchase Invoices</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        New Invoice
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Invoice #</TableCell>
            <TableCell>Supplier</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Items</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map(inv => (
            <TableRow key={inv.id}>
              <TableCell>{inv.invoiceNumber}</TableCell>
              <TableCell>{inv.supplier?.name}</TableCell>
              <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
              <TableCell>{inv.items.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>New Purchase Invoice</DialogTitle>
        <DialogContent>
          <TextField
            label="Invoice Number"
            fullWidth
            margin="dense"
            value={form.invoiceNumber}
            onChange={e => setForm({ ...form, invoiceNumber: e.target.value })}
          />
          <TextField
            label="Reference No"
            fullWidth
            margin="dense"
            value={form.referenceNo}
            onChange={e => setForm({ ...form, referenceNo: e.target.value })}
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
            label="Supplier"
            fullWidth
            margin="dense"
            onChange={e => setForm({ ...form, supplierId: e.target.value })}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </TextField>

          <h4>Add Item</h4>
          <TextField label="Item Name" fullWidth margin="dense" value={item.itemName}
            onChange={e => setItem({ ...item, itemName: e.target.value })} />
          <TextField label="Cartons" type="number" margin="dense"
            onChange={e => setItem({ ...item, qtyCartons: +e.target.value })} />
          <TextField label="Units" type="number" margin="dense"
            onChange={e => setItem({ ...item, qtyUnits: +e.target.value })} />
          <TextField label="Price" type="number" margin="dense"
            onChange={e => setItem({ ...item, price: +e.target.value })} />
          <TextField label="Total" type="number" margin="dense"
            onChange={e => setItem({ ...item, total: +e.target.value })} />

          <Button onClick={addItem}>Add Item</Button>

          <ul>
            {form.items.map((i, idx) => (
              <li key={idx}>{i.itemName} — {i.qtyUnits} units</li>
            ))}
          </ul>

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
          <Button variant="contained" onClick={handleSave}>Save Invoice</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
