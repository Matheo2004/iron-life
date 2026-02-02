// src/pages/ProgressPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Tabs,
  Tab,
  Select,
  MenuItem
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

import {
  getAllProgress,
  createProgress,
  getSessionProgressByType,
  getExerciseProgress,
  getExercises
} from "../api";

export default function ProgressPage({ userId }) {
  const [tab, setTab] = useState(0);

  // -------- CORPS --------
  const [progress, setProgress] = useState([]);
  const [form, setForm] = useState({
    weight: "",
    bodyFat: "",
    muscleMass: "",
  });

  // -------- SÉANCES --------
  const [sessionType, setSessionType] = useState("pec-triceps");
  const [sessionStats, setSessionStats] = useState([]);

  // -------- EXERCICES --------
  const [exercises, setExercises] = useState([]);
  const [exerciseId, setExerciseId] = useState("");
  const [exerciseStats, setExerciseStats] = useState([]);
  const [exerciseMetric, setExerciseMetric] = useState("weight");

  // ================= DATA =================
  useEffect(() => {
    getAllProgress().then(data => {
      setProgress(
        data
          .filter(p => p.userId === userId)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
      );
    });

    getExercises().then(setExercises);
  }, [userId]);

  useEffect(() => {
    if (tab === 1) {
      getSessionProgressByType(userId, sessionType).then(setSessionStats);
    }
  }, [tab, sessionType, userId]);

  useEffect(() => {
    if (tab === 2 && exerciseId) {
      getExerciseProgress(userId, exerciseId).then(setExerciseStats);
    }
  }, [tab, exerciseId, userId]);

  // ================= HANDLERS =================
  const handleAddProgress = async () => {
    await createProgress({
      userId,
      weight: form.weight ? Number(form.weight) : null,
      bodyFat: form.bodyFat ? Number(form.bodyFat) : null,
      muscleMass: form.muscleMass ? Number(form.muscleMass) : null,
    });
    setForm({ weight: "", bodyFat: "", muscleMass: "" });
  };

  // ================= RENDER =================
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Progression
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Corps" />
        <Tab label="Séances" />
        <Tab label="Exercices" />
      </Tabs>

      {/* ======================================================
          ONGLET 1 – CORPS
      ====================================================== */}
      {tab === 0 && (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6">Ajouter une mesure</Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <TextField label="Poids (kg)" type="number"
                value={form.weight}
                onChange={e => setForm({ ...form, weight: e.target.value })}
              />
              <TextField label="Masse grasse (%)" type="number"
                value={form.bodyFat}
                onChange={e => setForm({ ...form, bodyFat: e.target.value })}
              />
              <TextField label="Masse musculaire (kg)" type="number"
                value={form.muscleMass}
                onChange={e => setForm({ ...form, muscleMass: e.target.value })}
              />
              <Button variant="contained" onClick={handleAddProgress}>
                Ajouter
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Évolution corporelle
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString()} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="weight" name="Poids (kg)" stroke="#1976d2" />
                <Line dataKey="bodyFat" name="Masse grasse (%)" stroke="#ff9800" />
                <Line dataKey="muscleMass" name="Masse musculaire (kg)" stroke="#4caf50" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </>
      )}

      {/* ======================================================
          ONGLET 2 – SÉANCES
      ====================================================== */}
      {tab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Progression par type de séance</Typography>

          <Select
            value={sessionType}
            onChange={e => setSessionType(e.target.value)}
            sx={{ my: 2 }}
          >
            <MenuItem value="Pectoraux - Triceps">Pectoraux - Triceps</MenuItem>
            <MenuItem value="Dos - Biceps">Dos - Biceps</MenuItem>
            <MenuItem value="Jambes">Jambes</MenuItem>
            <MenuItem value="Épaules - Trapèzes">Épaules - Trapèzes</MenuItem>
            <MenuItem value="Full Body">Full Body</MenuItem>
          </Select>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                dataKey="volume"
                name="Volume total"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}

      {/* ======================================================
          ONGLET 3 – EXERCICES
      ====================================================== */}
      {tab === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Progression par exercice</Typography>

          <Box sx={{ display: "flex", gap: 2, my: 2 }}>
            <Select
              value={exerciseId}
              onChange={e => setExerciseId(e.target.value)}
              displayEmpty
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="" disabled>Choisir un exercice</MenuItem>
              {exercises.map(ex => (
                <MenuItem key={ex.id} value={ex.id}>
                  {ex.name}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={exerciseMetric}
              onChange={e => setExerciseMetric(e.target.value)}
            >
              <MenuItem value="weight">Charge (kg)</MenuItem>
              <MenuItem value="volume">Volume</MenuItem>
              <MenuItem value="oneRM">1RM estimé</MenuItem>
            </Select>
          </Box>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={exerciseStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                dataKey={exerciseMetric}
                name={exerciseMetric}
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      )}
    </Box>
  );
}