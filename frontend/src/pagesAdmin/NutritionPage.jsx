// src/pages/NutritionPage.jsx
import React, { useEffect, useState } from "react";
import {
  DataGrid
} from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography
} from "@mui/material";
import { getAllNutrition, createNutrition, deleteNutrition } from "../api";

export default function NutritionPage() {
  const [nutritions, setNutritions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    notes: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllNutrition();
      setNutritions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddNutrition = async () => {
    if (!form.userId) return alert("Veuillez indiquer l'ID de l'utilisateur !");
    try {
      await createNutrition(form);
      setForm({ userId: "", calories: "", protein: "", carbs: "", fats: "", notes: "" });
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      alert(err.message || "Erreur lors de l'ajout");
    }
  };

  const handleDeleteNutrition = async (id) => {
    if (!window.confirm("Supprimer cet enregistrement nutrition ?")) return;
    try {
      await deleteNutrition(id);
      fetchData();
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "userId", headerName: "User ID", width: 100 },
    { field: "calories", headerName: "Calories", width: 100, valueGetter: (params) => params?.row?.calories || "—" },
    { field: "protein", headerName: "Protéines (g)", width: 130, valueGetter: (params) => params?.row?.protein || "—" },
    { field: "carbs", headerName: "Glucides (g)", width: 130, valueGetter: (params) => params?.row?.carbs || "—" },
    { field: "fats", headerName: "Lipides (g)", width: 130, valueGetter: (params) => params?.row?.fats || "—" },
    { field: "notes", headerName: "Notes", flex: 1, valueGetter: (params) => params?.row?.notes || "—" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDeleteNutrition(params?.row?.id)}>
          Supprimer
        </Button>
      ),
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Gestion Nutrition
      </Typography>
      <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
        Ajouter Nutrition
      </Button>

      <DataGrid
        rows={nutritions}
        columns={columns}
        loading={loading}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ajouter Nutrition</DialogTitle>
        <DialogContent>
          <TextField
            label="User ID"
            type="number"
            margin="dense"
            fullWidth
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
          />
          <TextField
            label="Calories"
            type="number"
            margin="dense"
            fullWidth
            value={form.calories}
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
          />
          <TextField
            label="Protéines (g)"
            type="number"
            margin="dense"
            fullWidth
            value={form.protein}
            onChange={(e) => setForm({ ...form, protein: e.target.value })}
          />
          <TextField
            label="Glucides (g)"
            type="number"
            margin="dense"
            fullWidth
            value={form.carbs}
            onChange={(e) => setForm({ ...form, carbs: e.target.value })}
          />
          <TextField
            label="Lipides (g)"
            type="number"
            margin="dense"
            fullWidth
            value={form.fats}
            onChange={(e) => setForm({ ...form, fats: e.target.value })}
          />
          <TextField
            label="Notes"
            margin="dense"
            fullWidth
            multiline
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAddNutrition}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}