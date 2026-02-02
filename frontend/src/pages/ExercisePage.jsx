// src/pages/ExercisePage.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Slide,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { createExerciseInSession, updateExerciseInSession, deleteExerciseInSession, getExercises } from "../api";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ExercisePage({ setOpenInfoDialog, openInfoDialog, session, fetchSessions, setSession }) {
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [exercices, setExercices] = useState([]);
  const [form, setForm] = useState({
    type: Number,
    sets: Number,
    reps: Number,
    weight: Number,
  });

  const fetchExercices = async () => {
    setLoading(true);
    try {
      const data = await getExercises();
      setExercices(data.filter((e) => e.muscleGroup === session.type));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercices();
  }, [session.id]);

  const handleOpenUpdateDialog = (exer) => {
    setForm({ sets: exer.sets, reps: exer.reps, weight: exer.weight });
    setId(exer.id);
    setOpenUpdateDialog(true);
  };

  const handleAddExerciseInSession = async () => {
    if (!form.type || !form.sets || !form.reps) {
      alert("Remplissez tous les champs !");
      return;
    }
    await createExerciseInSession({
      sessionId: session.id,
      exerciseId: form.type,
      sets: form.sets,
      reps: form.reps,
      weight: form.weight,
    });
    setForm({ type: "", sets: "", reps: "", weight: "" });
    setOpenDialog(false);
    const updatedSessions = await fetchSessions();
    const updatedSession = updatedSessions.find(s => s.id === session.id);
    setSession(updatedSession);
  };


  const handleDeteleExerciseInSession = async (id) => {
    await deleteExerciseInSession(id);
    const updatedSessions = await fetchSessions();
    const updatedSession = updatedSessions.find(s => s.id === session.id);
    setSession(updatedSession);
  };

  const handleUpdateExerciseInSession = async () => {
    await updateExerciseInSession(id, form);
    setOpenUpdateDialog(false);
    const updatedSessions = await fetchSessions();
    const updatedSession = updatedSessions.find(s => s.id === session.id);
    setSession(updatedSession);
  };


  const handleOpenDialog = () => setOpenDialog(true);

  if (loading) return <Typography>Chargement des séances...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Dialog
        open={openInfoDialog}
        onClose={() => setOpenInfoDialog(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontSize: { xs: 35, md: 40 }, textAlign: 'center' }}>Séance</DialogTitle>
        <Grid container spacing={3} sx={{ p: 3, justifyContent: 'center', mt: -2 }}>
          {session?.exercises.map((exer) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={exer.id}>
                <Paper
                  elevation={3}
                  sx={{
                    position: 'relative',
                    p: 2,
                    borderRadius: 3,
                    background: "#F9FAFB",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    transition: "transform 0.2s ease",
                    "&:hover": { transform: "scale(1.01)" },
                  }}
                >
                  <Typography>Name: {exer.exercise.name}</Typography>
                  <Typography>MuscleGroup: {exer.exercise.muscleGroup}</Typography>
                  <Typography>Description: {exer.exercise.description}</Typography>
                  <Typography>Sets: {exer.sets}</Typography>
                  <Typography>Reps: {exer.reps}</Typography>
                  <Typography>Weight: {exer.weight}</Typography>

                  <Box sx={{ position: 'absolute', top: 10, right: 10, display: "flex", gap: 1 }}>
                    <EditIcon sx={{ color: "orange", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); handleOpenUpdateDialog(exer); }} />
                    <DeleteIcon sx={{ color: "red", cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); handleDeteleExerciseInSession(exer.id); }} />
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        {/* Bouton flottant + */}
        <Fab color="primary" sx={{ position: "absolute", top: 20, right: 20 }} onClick={handleOpenDialog}>
          <AddIcon />
        </Fab>
        <DialogActions sx={{ mt: -5 }}>
          <Button onClick={() => setOpenInfoDialog(false)}>Annuler</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d’ajout */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Nouvelle Exercice</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Type d'exercise</InputLabel>
            <Select
              value={form.type}
              label="Type d'exercice"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {session && exercices?.map((exer) => (
                <MenuItem key={exer.id} value={exer.id}>{exer.name}</MenuItem>
              )) || <MenuItem value="">Aucun exercice disponible</MenuItem>
              }
            </Select>
          </FormControl>
          <TextField
            type="number"
            label="Sets"
            value={form.sets}
            onChange={(e) => setForm({ ...form, sets: parseInt(e.target.value) || 0 })}
            fullWidth
          />
          <TextField
            type="number"
            label="Reps"
            value={form.reps}
            onChange={(e) => setForm({ ...form, reps: parseInt(e.target.value) || 0 })}
            fullWidth
          />
          <TextField
            type="number"
            label="Weight"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: parseInt(e.target.value) || 0 })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAddExerciseInSession}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'update */}
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} TransitionComponent={Transition} fullWidth maxWidth="xs">
        <DialogTitle>Modification Exercice</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            type="number"
            label="Sets"
            value={form.sets}
            onChange={(e) => setForm({ ...form, sets: parseInt(e.target.value) || 0 })}
            fullWidth
          />
          <TextField
            type="number"
            label="Reps"
            value={form.reps}
            onChange={(e) => setForm({ ...form, reps: parseInt(e.target.value) || 0 })}
            fullWidth
          />
          <TextField
            type="number"
            label="Weight"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: parseInt(e.target.value) || 0 })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdateExerciseInSession}>Modifier</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}