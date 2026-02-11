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

interface Expense {
  id?: string;
  number: number;
  name: string;
  type: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Expense>({
    number: 0,
    name: "",
    type: ""
  });

  const fetchExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleSave = async () => {
    if (form.id) {
      await api.put(`/expenses/${form.id}`, form);
    } else {
      await api.post("/expenses", form);
    }
    setOpen(false);
    setForm({ number: 0, name: "", type: "" });
    fetchExpenses();
  };

  const handleEdit = (expense: Expense) => {
    setForm(expense);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>Expense Categories</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Expense
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>No.</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map(e => (
            <TableRow key={e.id}>
              <TableCell>{e.number}</TableCell>
              <TableCell>{e.name}</TableCell>
              <TableCell>{e.type}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(e)}>Edit</Button>
                <Button color="error" onClick={() => handleDelete(e.id!)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{form.id ? "Edit Expense" : "Add Expense"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Number"
            type="number"
            fullWidth
            margin="dense"
            value={form.number}
            onChange={e => setForm({ ...form, number: +e.target.value })}
          />
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Type"
            fullWidth
            margin="dense"
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            placeholder="salary / general / etc"
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
