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

interface Treasury {
  id: string;
  name: string;
  balance: number;
}

export default function Treasuries() {
  const [treasuries, setTreasuries] = useState<Treasury[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const fetchTreasuries = async () => {
    const res = await api.get("/treasuries");
    setTreasuries(res.data);
  };

  useEffect(() => {
    fetchTreasuries();
  }, []);

  const handleSave = async () => {
    await api.post("/treasuries", { name });
    setName("");
    setOpen(false);
    fetchTreasuries();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>Treasuries</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Treasury
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Treasury Name</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {treasuries.map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.name}</TableCell>
              <TableCell>{t.balance.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>New Treasury</DialogTitle>
        <DialogContent>
          <TextField
            label="Treasury Name"
            fullWidth
            margin="dense"
            value={name}
            onChange={e => setName(e.target.value)}
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
