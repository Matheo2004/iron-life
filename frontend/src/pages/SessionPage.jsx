import React, { useEffect, useState } from "react";
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
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getSessions, createSession, deleteSession, updateSession } from "../api";
import ExercisePage from './ExercisePage'

// Animation du dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SessionPage({ userId }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [id, setId] = useState();
  const [session, setSession] = useState();

  const [form, setForm] = useState({
    date: "",
    duration: "",
    type: "",
  });

  const sessionTypes = [
    "Pectoraux - Triceps",
    "Dos - Biceps",
    "Jambes",
    "Épaules - Trapèzes",
    "Full Body",
  ];

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await getSessions();
      const userSessions = data.filter((s) => s.userId === userId);
      setSessions(userSessions)
      return userSessions;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  const handleOpenDialog = () => {
    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16); // format pour datetime-local
    setForm({ date: localDateTime, duration: "", type: "" });
    setOpenDialog(true);
  };

  const handleOpenUpdateDialog = (sess) => {
    setForm({ date: sess.date, duration: sess.duration, type: sess.type });
    setId(sess.id);
    setOpenUpdateDialog(true);
  };

  const handleOpenInfoDialog = (sess) => {
    setOpenInfoDialog(true);
    setSession(sess);
  };

  const handleAddSession = async () => {
    if (!form.date || !form.duration || !form.type) {
      alert("Merci de remplir tous les champs !");
      return;
    }
    await createSession({ ...form, userId });
    setForm({ date: "", duration: "", type: "" });
    setOpenDialog(false);
    fetchSessions();
  };

  const handleDeteleSession = async (id) => {
    await deleteSession(id);
    fetchSessions();
  };

  const handleUpdateSession = async () => {
    await updateSession(id, form);
    setOpenUpdateDialog(false);
    fetchSessions();
  };

  // --- Tri et filtrage ---
  const filteredSessions = sessions
    .filter((s) => (filterType === "all" ? true : s.type === filterType))
    .sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  if (loading) return <Typography>Chargement des séances...</Typography>;

  return (
    <Box sx={{ p: 2, pb: 10, pt: { md: 5 } }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 700,
          textAlign: "center",
          color: "primary.main",
        }}
      >
        Mes Séances
      </Typography>

      {/* Filtres */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
          justifyContent: "center",
        }}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            label="Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">Tous</MenuItem>
            {sessionTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Trier par</InputLabel>
          <Select
            value={sortOrder}
            label="Trier par"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="desc">Date ↓</MenuItem>
            <MenuItem value="asc">Date ↑</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Liste des séances */}
      {filteredSessions.length === 0 ? (
        <Typography align="center" sx={{ color: "text.secondary" }}>
          Aucune séance trouvée.
        </Typography>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {filteredSessions.map((sess) => (
            <Paper
              key={sess.id}
              elevation={3}
              onClick={() => handleOpenInfoDialog(sess)}
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, maxWidth: 200 }}>
                <CalendarMonthIcon color="primary" />
                <Typography sx={{ fontWeight: 600 }}>
                  {new Date(sess.date).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccessTimeIcon color="action" />
                <Typography>Durée : {sess.duration} min</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FitnessCenterIcon color="action" />
                <Typography sx={{ fontWeight: 600, color: "primary.dark" }}>
                  {sess.type}
                </Typography>
              </Box>

              <Box sx={{ position: 'absolute', top: 10, right: 10, display: "flex", gap: 1 }}>
                <EditIcon
                  sx={{ color: "orange" }}
                  onClick={(e) => { e.stopPropagation(); handleOpenUpdateDialog(sess); }}
                />
                <DeleteIcon
                  sx={{ color: "red" }}
                  onClick={(e) => { e.stopPropagation(); handleDeteleSession(sess.id); }}
                />
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Bouton flottant + */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 80,
          right: 24,
          boxShadow: 3,
        }}
        onClick={handleOpenDialog}
      >
        <AddIcon />
      </Fab>


      {/* Dialog d’ajout */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Nouvelle Séance</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            type="datetime-local"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            fullWidth
          />
          <TextField
            type="number"
            label="Durée (min)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type de séance</InputLabel>
            <Select
              value={form.type}
              label="Type de séance"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {sessionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAddSession}>
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'update */}
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Modification Séance</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            type="datetime-local"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={form.date.slice(0, 16)}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            fullWidth
          />
          <TextField
            type="number"
            label="Durée (min)"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type de séance</InputLabel>
            <Select
              value={form.type}
              label="Type de séance"
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {sessionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleUpdateSession}>
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'info */}
      {openInfoDialog && (
        <ExercisePage setOpenInfoDialog={setOpenInfoDialog} openInfoDialog={openInfoDialog} session={session} fetchSessions={fetchSessions} setSession={setSession} />
      )}
    </Box>
  );
}