// pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { getUsers, getAllProgress, getSessions, getAllNutrition } from '../api';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, sessions: 0, progress: 0, meals: 0 });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const users = await getUsers();
      const sessions = await getSessions();
      const progress = await getAllProgress();
      const meals = await getAllNutrition();
      setStats({ users: users.length, sessions: sessions.length, progress: progress.length, meals: meals.length });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if(loading) return <CircularProgress />;

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Utilisateurs</Typography>
            <Typography variant="h4">{stats.users}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Séances</Typography>
            <Typography variant="h4">{stats.sessions}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Progressions</Typography>
            <Typography variant="h4">{stats.progress}</Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography variant="h6">Repas</Typography>
            <Typography variant="h4">{stats.meals}</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}