// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CssBaseline, Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Snackbar, Alert } from '@mui/material';
import Dashboard from './pages/DashboardPage';
import ExercisePage from './pages/ExercisePage';
import NutritionPage from './pages/NutritionPage';
import ProgressPage from './pages/ProgressPage';
import SessionPage from './pages/SessionPage';
import UserPage from './pages/UserPage';

const drawerWidth = 240;

export default function App() {
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Router>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Application Musculation
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }}}>
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button component={Link} to="/sessions">
              <ListItemText primary="Séances" />
            </ListItem>
            <ListItem button component={Link} to="/exercises">
              <ListItemText primary="Exercices" />
            </ListItem>
            <ListItem button component={Link} to="/nutrition">
              <ListItemText primary="Nutrition" />
            </ListItem>
            <ListItem button component={Link} to="/progress">
              <ListItemText primary="Progression" />
            </ListItem>
            <ListItem button component={Link} to="/users">
              <ListItemText primary="Utilisateurs" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sessions" element={<SessionPage />} />
          <Route path="/exercises" element={<ExercisePage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/users" element={<UserPage />} />
        </Routes>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Router>
  );
}