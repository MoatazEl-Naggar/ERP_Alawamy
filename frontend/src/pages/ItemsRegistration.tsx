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
import { useTranslation } from "react-i18next";

interface InventoryItem {
  id?: string;
  itemName: string;
  barcode?: string;
}

export default function ItemsRegistration() {
  const initialForm: InventoryItem = {
    itemName: "",
    barcode: ""
  };

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<InventoryItem>(initialForm);
  const { t } = useTranslation();

  const fetchItems = async () => {
    const res = await api.get("/inventory/items");
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async () => {
    if (form.id) {
      await api.put(`/inventory/items/${form.id}`, form);
    } else {
      await api.post("/inventory/items", form);
    }

    setOpen(false);
    setForm(initialForm);
    fetchItems();
  };

  const handleEdit = (item: InventoryItem) => {
    setForm(item);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await api.delete(`/inventory/items/${id}`);
    fetchItems();
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
      <h2>{t("itemsRegistration")}</h2>

      <Button variant="contained" onClick={handleOpenCreate} sx={{ mb: 2 }}>
        {t("addItemRegistration")}
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t("itemName")}</TableCell>
            <TableCell>{t("barcode")}</TableCell>
            <TableCell>{t("actions")}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.itemName}</TableCell>
              <TableCell>{item.barcode || "-"}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(item)}>{t("edit")}</Button>
                <Button color="error" onClick={() => handleDelete(item.id!)}>{t("delete")}</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth>
        <DialogTitle>{form.id ? t("editItemRegistration") : t("addItemRegistration")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("itemName")}
            fullWidth
            margin="dense"
            value={form.itemName}
            onChange={(e) => setForm({ ...form, itemName: e.target.value })}
          />
          <TextField
            label={t("barcode")}
            fullWidth
            margin="dense"
            value={form.barcode || ""}
            onChange={(e) => setForm({ ...form, barcode: e.target.value })}
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
