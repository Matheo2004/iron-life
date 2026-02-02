// src/pages/DashboardPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { getSessions, getAllNutrition, getAllProgress } from "../api";

export default function DashboardPage({ userId }) {
  const [sessions, setSessions] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const s = await getSessions();
      const n = await getAllNutrition();
      const p = await getAllProgress();
      setSessions(s.filter(sess => sess.userId === userId));
      setNutrition(n.filter(nut => nut.userId === userId));
      setProgress(p.filter(pr => pr.userId === userId).sort((a, b) => new Date(a.date) - new Date(b.date)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [userId]);

  const lastProgress = useMemo(() => progress[progress.length - 1] || {}, [progress]);
  const caloriesThisWeek = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return nutrition
      .filter(n => new Date(n.date) >= oneWeekAgo)
      .reduce((acc, n) => acc + n.calories, 0);
  }, [nutrition]);

  if (loading) return <Typography sx={{ p: 2 }}>Chargement du dashboard...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      {/* ------------------- CARDS ------------------- */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Séances</Typography>
            <Typography variant="h5">{sessions.length}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Calories cette semaine</Typography>
            <Typography variant="h5">{caloriesThisWeek}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Poids actuel</Typography>
            <Typography variant="h5">{lastProgress.weight ?? "-" } kg</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Masse musculaire</Typography>
            <Typography variant="h5">{lastProgress.muscleMass ?? "-" } kg</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ------------------- DERNIÈRES SÉANCES ------------------- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Dernières séances</Typography>
        {sessions.slice(-5).reverse().map(sess => (
          <Box key={sess.id} sx={{ borderBottom: "1px solid #eee", py: 1 }}>
            <Typography>{new Date(sess.date).toLocaleDateString()} - {sess.type} ({sess.duration} min)</Typography>
          </Box>
        ))}
      </Paper>

      {/* ------------------- DERNIERS REPAS ------------------- */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Derniers repas</Typography>
        {nutrition.slice(-5).reverse().map(n => (
          <Box key={n.id} sx={{ borderBottom: "1px solid #eee", py: 1 }}>
            <Typography>
              {new Date(n.date).toLocaleDateString()} - {n.mealType} : {n.calories} kcal, {n.protein}g P, {n.carbs}g C, {n.fat}g F
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
