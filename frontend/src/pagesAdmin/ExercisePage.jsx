// pages/ExercisePage.jsx
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { getExercises, createExercise, deleteExercise } from "../api";

export default function ExercisePage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ name: "", muscleGroup: "", description: "", imageUrl: "" });

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const data = await getExercises();
      setExercises(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExercises(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.muscleGroup) return alert("Nom et groupe musculaire requis !");
    try {
      await createExercise(form);
      setForm({ name: "", muscleGroup: "", description: "", imageUrl: "" });
      setOpenDialog(false);
      fetchExercises();
    } catch (err) {
      alert("Erreur lors de l'ajout : " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet exercice ?")) return;
    try {
      await deleteExercise(id);
      fetchExercises();
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Nom", flex: 1, valueGetter: (params) => params.row?.name || "—" },
    { field: "muscleGroup", headerName: "Groupe musculaire", flex: 1, valueGetter: (params) => params.row?.muscleGroup || "—" },
    { field: "description", headerName: "Description", flex: 2, valueGetter: (params) => params.row?.description || "—" },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 100,
      renderCell: (params) =>
        params.row?.imageUrl ? <img src={params.row.imageUrl} alt={params.row.name} width={50} /> : "—"
    },
    {
      field: "createdAt",
      headerName: "Créé le",
      flex: 1,
      valueGetter: (params) => params.row?.createdAt ? new Date(params.row.createdAt).toLocaleString() : "—"
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Button color="error" size="small" onClick={() => handleDelete(params.row.id)}>Supprimer</Button>
      )
    }
  ];

  return (
    <div style={{ width: "100%", height: 600 }}>
      <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
        Ajouter Exercice
      </Button>

      <DataGrid rows={exercises} columns={columns} loading={loading} autoHeight />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ajouter Exercice</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Nom" fullWidth name="name" value={form.name} onChange={handleChange} />
          <TextField margin="dense" label="Groupe musculaire" fullWidth name="muscleGroup" value={form.muscleGroup} onChange={handleChange} />
          <TextField margin="dense" label="Description" fullWidth name="description" value={form.description} onChange={handleChange} />
          <TextField margin="dense" label="Image URL" fullWidth name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>Ajouter</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}