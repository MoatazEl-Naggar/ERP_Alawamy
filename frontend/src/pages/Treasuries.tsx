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

interface Treasury {
  id: string;
  name: string;
  balance: number;
}

export default function Treasuries() {
  const [treasuries, setTreasuries] = useState<Treasury[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { t } = useTranslation();
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

  const handleOpenCreate = () => {
    setName("");
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setName("");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("treasuriesTitle")}</h2>

      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        {t("addTreasury")}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("treasuryName")}</TableCell>
            <TableCell>{t("balance")}</TableCell>
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

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{t("newTreasury")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("treasuryName")}
            fullWidth
            margin="dense"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t("cancel")}</Button>
          <Button variant="contained" onClick={handleSave}>{t("save")}</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
