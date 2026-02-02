// pages/SessionPage.jsx
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, Typography } from '@mui/material';
import { getSessions, getExercises, createSession, deleteSession, createExerciseInSession } from '../api';

export default function SessionPage() {
  const [sessions, setSessions] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ date: '', duration: '', notes: '' });
  const [selectedExercises, setSelectedExercises] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const sessionsData = await getSessions();
      const exercisesData = await getExercises();
      setSessions(sessionsData || []);
      setExercises(exercisesData || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddSession = async () => {
    await createSession(form);
    setForm({ date: '', duration: '', notes: '' });
    setOpenDialog(false);
    fetchData();
  };

  const handleDeleteSession = async (id) => {
    if(!window.confirm('Supprimer cette séance ?')) return;
    await deleteSession(id);
    fetchData();
  };

  const handleAddExercise = async (sessionId) => {
    const data = selectedExercises[sessionId];
    if(!data || !data.exerciseId) return alert('Choisir un exercice !');
    await createExerciseInSession({
      sessionId: parseInt(sessionId),
      exerciseId: parseInt(data.exerciseId),
      sets: parseInt(data.sets||0),
      reps: parseInt(data.reps||0),
      weight: parseFloat(data.weight||0)
    });
    setSelectedExercises({ ...selectedExercises, [sessionId]: {} });
    fetchData();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'date', 
      headerName: 'Date', 
      flex: 1, 
      valueGetter: (params) => params.row?.date ? new Date(params.row.date).toLocaleString() : ''
    },
    { field: 'duration', headerName: 'Durée (min)', width: 100 },
    { field: 'notes', headerName: 'Notes', flex: 1 },
    { 
      field: 'exercises', 
      headerName: 'Exercices', 
      flex: 2, 
      renderCell: (params) => (
        <ul>
          {params.row?.exercises?.map(ex => (
            <li key={ex.id}>
              {ex.exercise?.name} ({ex.exercise?.muscleGroup}) Sets:{ex.sets} Reps:{ex.reps} W:{ex.weight}
            </li>
          ))}
        </ul>
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 200, 
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDeleteSession(params.row.id)}>Supprimer</Button>
      )
    },
  ];

  return (
    <div style={{ width: '100%' }}>
      <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>Ajouter Séance</Button>
      <DataGrid rows={sessions} columns={columns} loading={loading} autoHeight />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Ajouter Séance</DialogTitle>
        <DialogContent>
          <TextField type="datetime-local" margin="dense" label="Date" fullWidth value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
          <TextField margin="dense" label="Durée (min)" fullWidth value={form.duration} onChange={e=>setForm({...form,duration:e.target.value})} />
          <TextField margin="dense" label="Notes" fullWidth value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAddSession}>Ajouter</Button>
        </DialogActions>
      </Dialog>

      {sessions.map(s => {
        const sel = selectedExercises[s.id] || {};
        return (
          <div key={s.id} style={{ marginTop: 10, padding: 10, border: '1px solid #ccc', borderRadius: 4 }}>
            <Typography variant="subtitle1">Ajouter Exercice à la séance {s.id}</Typography>
            <Select
              value={sel.exerciseId||''}
              onChange={e=>setSelectedExercises({...selectedExercises,[s.id]:{...sel,exerciseId:e.target.value}})}
              sx={{ mr: 1 }}
            >
              <MenuItem value="">--Choisir--</MenuItem>
              {exercises.map(ex => <MenuItem key={ex.id} value={ex.id}>{ex.name} ({ex.muscleGroup})</MenuItem>)}
            </Select>
            <TextField type="number" placeholder="Sets" value={sel.sets||''} onChange={e=>setSelectedExercises({...selectedExercises,[s.id]:{...sel,sets:e.target.value}})} sx={{ width: 70, mr: 1 }} />
            <TextField type="number" placeholder="Reps" value={sel.reps||''} onChange={e=>setSelectedExercises({...selectedExercises,[s.id]:{...sel,reps:e.target.value}})} sx={{ width: 70, mr: 1 }} />
            <TextField type="number" placeholder="Weight" value={sel.weight||''} onChange={e=>setSelectedExercises({...selectedExercises,[s.id]:{...sel,weight:e.target.value}})} sx={{ width: 70, mr: 1 }} />
            <Button variant="contained" onClick={()=>handleAddExercise(s.id)}>Ajouter</Button>
          </div>
        );
      })}
    </div>
  );
}
