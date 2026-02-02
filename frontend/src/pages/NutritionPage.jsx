// src/pages/NutritionPage.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button, TextField } from "@mui/material";
import { getAllNutrition, createNutrition } from "../api";

export default function NutritionPage({ userId }) {
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ calories: "", proteins: "", carbs: "", fats: "" });

  const fetchNutrition = async () => {
    setLoading(true);
    try {
      const data = await getAllNutrition();
      setNutrition(data.filter(n => n.userId === userId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNutrition(); }, [userId]);

  const handleAdd = async () => {
    await createNutrition({ ...form, userId });
    setForm({ calories: "", proteins: "", carbs: "", fats: "" });
    fetchNutrition();
  };

  if (loading) return <Typography>Chargement des entrées nutritionnelles...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Nutrition</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Ajouter une entrée</Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <TextField label="Calories" type="number" value={form.calories} onChange={e => setForm({...form, calories:e.target.value})} />
          <TextField label="Protéines (g)" type="number" value={form.proteins} onChange={e => setForm({...form, proteins:e.target.value})} />
          <TextField label="Glucides (g)" type="number" value={form.carbs} onChange={e => setForm({...form, carbs:e.target.value})} />
          <TextField label="Lipides (g)" type="number" value={form.fats} onChange={e => setForm({...form, fats:e.target.value})} />
          <Button variant="contained" onClick={handleAdd}>Ajouter</Button>
        </Box>
      </Paper>

      <Box sx={{ display: "grid", gap: 2 }}>
        {nutrition.slice().reverse().map(n => (
          <Paper key={n.id} sx={{ p: 2 }}>
            <Typography variant="body1">{new Date(n.date).toLocaleDateString()}</Typography>
            <Typography>Calories: {n.calories}, Protéines: {n.proteins}g, Glucides: {n.carbs}g, Lipides: {n.fats}g</Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
