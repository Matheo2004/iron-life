// src/pages/ProgressPage.jsx
import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import {
  getProgressByUser,
  getAllProgress,
  createProgress,
  deleteProgress,
} from "../api";
import { DataGrid } from "@mui/x-data-grid";

export default function ProgressPage({ userId }) {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const data = userId ? await getProgressByUser(userId) : await getAllProgress();
      setProgressList(data);
    } catch (err) {
      console.error("Erreur lors du chargement des progressions :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, [userId]);

  const handleAdd = async () => {
    if (!weight) return alert("Le poids est requis !");
    try {
      await createProgress({
        userId,
        weight: parseFloat(weight),
        bodyFat: bodyFat ? parseFloat(bodyFat) : 0,
        muscleMass: muscleMass ? parseFloat(muscleMass) : 0,
        photoUrl: photoUrl || "",
      });
      setWeight("");
      setBodyFat("");
      setMuscleMass("");
      setPhotoUrl("");
      fetchProgress();
    } catch (err) {
      alert("Erreur lors de l'ajout : " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette progression ?")) return;
    try {
      await deleteProgress(id);
      fetchProgress();
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "userId", headerName: "User ID", width: 100 },
    { field: "weight", headerName: "Poids (kg)", width: 120 },
    { field: "bodyFat", headerName: "Masse grasse (%)", width: 150 },
    { field: "muscleMass", headerName: "Masse musculaire (kg)", width: 170 },
    {
      field: "photoUrl",
      headerName: "Photo",
      width: 100,
      renderCell: (params) =>
        params?.row?.photoUrl ? (
          <img src={params.row.photoUrl} alt="Progression" width={50} />
        ) : (
          "—"
        ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => params?.row?.date ? new Date(params.row.date).toLocaleString() : "—",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Button
          color="error"
          variant="outlined"
          size="small"
          onClick={() => handleDelete(params?.row?.id)}
        >
          Supprimer
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Progression
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          label="Poids (kg)"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          size="small"
        />
        <TextField
          label="Masse grasse (%)"
          type="number"
          value={bodyFat}
          onChange={(e) => setBodyFat(e.target.value)}
          size="small"
        />
        <TextField
          label="Masse musculaire (kg)"
          type="number"
          value={muscleMass}
          onChange={(e) => setMuscleMass(e.target.value)}
          size="small"
        />
        <TextField
          label="URL de la photo"
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleAdd}>
          Ajouter
        </Button>
      </Box>

      <DataGrid
        rows={progressList || []}
        columns={columns}
        loading={loading}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
      />
    </Box>
  );
}