// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { CssBaseline, AppBar, Toolbar, Typography, Box, BottomNavigation, BottomNavigationAction, Avatar } from "@mui/material";
import DashboardPage from "./pages/DashboardPage";
import SessionPage from "./pages/SessionPage";
import ExercisePage from "./pages/ExercisePage";
import NutritionPage from "./pages/NutritionPage";
import ProgressPage from "./pages/ProgressPage";
import { getUsers } from "./api";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TimelineIcon from '@mui/icons-material/Timeline';
import HomeIcon from '@mui/icons-material/Home';

import BrandingSignInPage from './pages/components/BrandingSignInPage'

export default function App() {
    const [user, setUser] = useState(null);
    const [tab, setTab] = useState(0);

    const [login, setLogin] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const users = await getUsers();
            if (users.length > 0) setUser(users[1]);
        };
        fetchUser();
    }, []);

    if (!user) return <p>Chargement de votre profil...</p>;

    if (!login) {
        return (
            <BrandingSignInPage />
        )
    }

    return (
        <Box>
            <Router>
                <Box sx={{ mt: { xs: 12, md: 8}, mb: 7 }}>
                    <Routes>
                        <Route path="/" element={<DashboardPage userId={user.id} />} />
                        <Route path="/sessions" element={<SessionPage userId={user.id} />} />
                        <Route path="/exercises" element={<ExercisePage userId={user.id} />} />
                        <Route path="/nutrition" element={<NutritionPage userId={user.id} />} />
                        <Route path="/progress" element={<ProgressPage userId={user.id} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Box>

                <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
                    <BottomNavigation
                        value={tab}
                        onChange={(e, newValue) => setTab(newValue)}
                        sx={{ pt: { xs: 4, md: 3 } }}
                    >
                        <BottomNavigationAction sx={{ backgroundColor: '#F3F7FB', mx: 1, borderRadius: 2 }} component={Link} to="/" label="Dashboard" icon={<HomeIcon />} />
                        <BottomNavigationAction sx={{ backgroundColor: '#F3F7FB', mx: 1, borderRadius: 2 }} component={Link} to="/sessions" label="Séances" icon={<FitnessCenterIcon />} />
                        <BottomNavigationAction sx={{ backgroundColor: '#F3F7FB', mx: 1, borderRadius: 2 }} component={Link} to="/nutrition" label="Nutrition" icon={<RestaurantIcon />} />
                        <BottomNavigationAction sx={{ backgroundColor: '#F3F7FB', mx: 1, borderRadius: 2 }} component={Link} to="/progress" label="Progression" icon={<TimelineIcon />} />
                    </BottomNavigation>
                </Box>
            </Router>
        </Box>
    );
}