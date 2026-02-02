// pages/UserPage.jsx
import React, { useEffect, useState } from "react";
import {
  DataGrid
} from "@mui/x-data-grid";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { getUsers, createUser, updateUser, deleteUser } from "../api";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({
    id: null,
    username: "",
    email: "",
    password: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    goal: ""
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        await updateUser(form.id, form);
      } else {
        await createUser(form);
      }
      setForm({
        id: null,
        username: "",
        email: "",
        password: "",
        gender: "",
        age: "",
        height: "",
        weight: "",
        goal: ""
      });
      setOpenDialog(false);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (user) => {
    setForm({
      id: user.id,
      username: user.username || "",
      email: user.email || "",
      password: "",
      gender: user.gender || "",
      age: user.age || "",
      height: user.height || "",
      weight: user.weight || "",
      goal: user.goal || ""
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "gender", headerName: "Gender", width: 100, valueGetter: (params) => params.row?.gender || "—" },
    { field: "age", headerName: "Age", width: 80, valueGetter: (params) => params.row?.age || "—" },
    { field: "height", headerName: "Height (cm)", width: 110, valueGetter: (params) => params.row?.height || "—" },
    { field: "weight", headerName: "Weight (kg)", width: 110, valueGetter: (params) => params.row?.weight || "—" },
    { field: "goal", headerName: "Goal", flex: 1, valueGetter: (params) => params.row?.goal || "—" },
    {
      field: "createdAt",
      headerName: "Créé le",
      flex: 1,
      valueGetter: (params) => params.row?.createdAt ? new Date(params.row.createdAt).toLocaleString() : "—"
    },
    {
      field: "updatedAt",
      headerName: "Mis à jour le",
      flex: 1,
      valueGetter: (params) => params.row?.updatedAt ? new Date(params.row.updatedAt).toLocaleString() : "—"
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <>
          <Button size="small" onClick={() => handleEdit(params.row)}>Éditer</Button>
          <Button size="small" color="error" onClick={() => handleDelete(params.row.id)}>Supprimer</Button>
        </>
      )
    }
  ];

  return (
    <div style={{ width: "100%", height: 600 }}>
      <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
        Ajouter Utilisateur
      </Button>

      <DataGrid rows={users} columns={columns} loading={loading} autoHeight />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{form.id ? "Modifier Utilisateur" : "Ajouter Utilisateur"}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Username" fullWidth name="username" value={form.username} onChange={handleChange} />
          <TextField margin="dense" label="Email" fullWidth name="email" value={form.email} onChange={handleChange} />
          <TextField margin="dense" label="Password" fullWidth type="password" name="password" value={form.password} onChange={handleChange} required={!form.id} />
          <TextField margin="dense" label="Gender" fullWidth name="gender" value={form.gender} onChange={handleChange} />
          <TextField margin="dense" label="Age" fullWidth type="number" name="age" value={form.age} onChange={handleChange} />
          <TextField margin="dense" label="Height" fullWidth type="number" name="height" value={form.height} onChange={handleChange} />
          <TextField margin="dense" label="Weight" fullWidth type="number" name="weight" value={form.weight} onChange={handleChange} />
          <TextField margin="dense" label="Goal" fullWidth name="goal" value={form.goal} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit}>{form.id ? "Mettre à jour" : "Ajouter"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}