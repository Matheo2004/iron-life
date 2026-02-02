import axios from "axios";

const API_URL = "http://localhost:3000";

// ----------------- USERS -----------------
export const createUser = async (data) => {
  const response = await axios.post(`${API_URL}/users`, data);
  return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getUser = async (id) => {
  const response = await axios.get(`${API_URL}/users/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axios.put(`${API_URL}/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};

// ----------------- WORKOUT SESSIONS -----------------
export const createSession = async (data) => {
  data.date = new Date(data.date).toISOString()
  data.duration = parseInt(data.duration)
  const response = await axios.post(`${API_URL}/sessions`, data);
  return response.data;
};

export const getSessions = async () => {
  const response = await axios.get(`${API_URL}/sessions`);
  return response.data;
};

export const getSession = async (id) => {
  const response = await axios.get(`${API_URL}/sessions/${id}`);
  return response.data;
};

export const updateSession = async (id, data) => {
  const response = await axios.put(`${API_URL}/sessions/${id}`, data);
  return response.data;
};

export const deleteSession = async (id) => {
  const response = await axios.delete(`${API_URL}/sessions/${id}`);
  return response.data;
};

// Obtenir les exercices d'une session
export const getExercisesInSession = async (sessionId) => {
  const response = await axios.get(`${API_URL}/sessions/${sessionId}/exercises`);
  return response.data;
};

// ----------------- EXERCISES -----------------
export const createExercise = async (data) => {
  const response = await axios.post(`${API_URL}/exercises`, data);
  return response.data;
};

export const getExercises = async () => {
  const response = await axios.get(`${API_URL}/exercises`);
  return response.data;
};

export const getExercise = async (id) => {
  const response = await axios.get(`${API_URL}/exercises/${id}`);
  return response.data;
};

export const updateExercise = async (id, data) => {
  const response = await axios.put(`${API_URL}/exercises/${id}`, data);
  return response.data;
};

export const deleteExercise = async (id) => {
  const response = await axios.delete(`${API_URL}/exercises/${id}`);
  return response.data;
};

// ----------------- EXERCISES IN SESSION -----------------
export const createExerciseInSession = async (data) => {
  const response = await axios.post(`${API_URL}/exercise-in-session`, data);
  return response.data;
};

export const getAllExercisesInSession = async () => {
  const response = await axios.get(`${API_URL}/exercise-in-session`);
  return response.data;
};

export const updateExerciseInSession = async (id, data) => {
  const response = await axios.put(`${API_URL}/exercise-in-session/${id}`, data);
  return response.data;
};

export const deleteExerciseInSession = async (id) => {
  const response = await axios.delete(`${API_URL}/exercise-in-session/${id}`);
  return response.data;
};

// ----------------- NUTRITION -----------------
export const createNutrition = async (data) => {
  const response = await axios.post(`${API_URL}/nutrition`, data);
  return response.data;
};

export const getAllNutrition = async () => {
  const response = await axios.get(`${API_URL}/nutrition`);
  return response.data;
};

export const getNutritionByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/nutrition/${userId}`);
  return response.data;
};

export const updateNutrition = async (id, data) => {
  const response = await axios.put(`${API_URL}/nutrition/${id}`, data);
  return response.data;
};

export const deleteNutrition = async (id) => {
  const response = await axios.delete(`${API_URL}/nutrition/${id}`);
  return response.data;
};

// ----------------- PROGRESS -----------------
export const createProgress = async (data) => {
  const response = await axios.post(`${API_URL}/progress`, data);
  return response.data;
};

export const getAllProgress = async () => {
  const response = await axios.get(`${API_URL}/progress`);
  return response.data;
};

export const getProgressByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/progress/${userId}`);
  return response.data;
};

export const updateProgress = async (id, data) => {
  const response = await axios.put(`${API_URL}/progress/${id}`, data);
  return response.data;
};

export const deleteProgress = async (id) => {
  const response = await axios.delete(`${API_URL}/progress/${id}`);
  return response.data;
};

// ----------------- STATS -----------------
export const getSessionProgressByType = async (userId, type) => {
  const response = await axios.get(
    `${API_URL}/stats/sessions/${userId}/${type}`
  );
  return response.data;
};

export const getExerciseProgress = async (userId, exerciseId) => {
  const response = await axios.get(
    `${API_URL}/stats/exercise/${userId}/${exerciseId}`
  );
  return response.data;
};