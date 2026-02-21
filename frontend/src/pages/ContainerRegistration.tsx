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
  Paper,
  Stack
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface Container {
  id?: string;
  containerNumber: string; // ← was "containerNo", now matches DB field
  date: string;
  notes?: string;
}

export default function ContainerRegistration() {
  const initialForm: Container = {
    containerNumber: "", // ← was "containerNo"
    date: "",
    notes: ""
  };

  const [containers, setContainers] = useState<Container[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Container>(initialForm);
  const { t } = useTranslation();

  const fetchContainers = async () => {
    const res = await api.get("/containers");
    setContainers(res.data);
  };

  useEffect(() => {
    fetchContainers();
  }, []);

  const handleSave = async () => {
    if (form.id) {
      await api.put(`/containers/${form.id}`, form);
    } else {
      await api.post("/containers", form);
    }
    setOpen(false);
    setForm(initialForm);
    fetchContainers();
  };

  const handleEdit = (container: Container) => {
    setForm({
      ...container,
      date: container.date ? new Date(container.date).toISOString().slice(0, 10) : ""
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/containers/${id}`);
    fetchContainers();
  };

  const handleOpenCreate = () => {
    setForm(initialForm);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setForm(initialForm);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <h2>{t("containerRegistration")}</h2>

      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        {t("addContainer")}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("containerNumber")}</TableCell>
            <TableCell>{t("date")}</TableCell>
            <TableCell>{t("notes")}</TableCell>
            <TableCell>{t("actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {containers.map((container) => (
            <TableRow key={container.id}>
              <TableCell>{container.containerNumber}</TableCell> {/* ← was containerNo */}
              <TableCell>
                {container.date ? new Date(container.date).toLocaleDateString() : "—"}
              </TableCell>
              <TableCell>{container.notes || "-"}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button onClick={() => handleEdit(container)}>{t("edit")}</Button>
                  <Button color="error" onClick={() => handleDelete(container.id!)}>
                    {t("delete")}
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{form.id ? t("editContainer") : t("addContainer")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("containerNumber")}
            fullWidth
            margin="dense"
            value={form.containerNumber} // ← was form.containerNo
            onChange={(e) => setForm({ ...form, containerNumber: e.target.value })} // ← was containerNo
          />
          <TextField
            label={t("date")}
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <TextField
            label={t("notes")}
            fullWidth
            margin="dense"
            value={form.notes || ""}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
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