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

interface Supplier {
  id?: string;
  supplierNumber: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  accountNumber?: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Supplier>({
    supplierNumber: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    accountNumber: ""
  });

  const fetchSuppliers = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSave = async () => {
    if (form.id) {
      await api.put(`/suppliers/${form.id}`, form);
    } else {
      await api.post("/suppliers", form);
    }
    setOpen(false);
    setForm({ supplierNumber: "", name: "", phone: "", address: "", email: "", accountNumber: "" });
    fetchSuppliers();
  };

  const handleEdit = (supplier: Supplier) => {
    setForm(supplier);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/suppliers/${id}`);
    fetchSuppliers();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>Suppliers</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Supplier
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suppliers.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.supplierNumber}</TableCell>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.phone}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(s)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(s.id!)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{form.id ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Supplier Number"
            fullWidth
            margin="dense"
            value={form.supplierNumber}
            onChange={e => setForm({ ...form, supplierNumber: e.target.value })}
          />
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="dense"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <TextField
            label="Address"
            fullWidth
            margin="dense"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Account Number"
            fullWidth
            margin="dense"
            value={form.accountNumber}
            onChange={e => setForm({ ...form, accountNumber: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
