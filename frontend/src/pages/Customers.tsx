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

interface Customer {
  id?: string;
  customerNumber: string;
  name: string;
  phone?: string;
  address?: string;
  email?: string;
  accountNumber?: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Customer>({
    customerNumber: "",
    name: "",
    phone: "",
    address: "",
    email: "",
    accountNumber: ""
  });

  const fetchCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSave = async () => {
    if (form.id) {
      await api.put(`/customers/${form.id}`, form);
    } else {
      await api.post("/customers", form);
    }
    setOpen(false);
    setForm({ customerNumber: "", name: "", phone: "", address: "", email: "", accountNumber: "" });
    fetchCustomers();
  };

  const handleEdit = (customer: Customer) => {
    setForm(customer);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/customers/${id}`);
    fetchCustomers();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>Customers</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Customer
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
          {customers.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.customerNumber}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(c)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(c.id!)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{form.id ? "Edit Customer" : "Add Customer"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Customer Number"
            fullWidth
            margin="dense"
            value={form.customerNumber}
            onChange={e => setForm({ ...form, customerNumber: e.target.value })}
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
