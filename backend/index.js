// server.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// ----------------- USERS -----------------
app.post("/users", async (req, res) => {
  try {
    const user = await prisma.user.create({ data: req.body });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany({
    include: { sessions: true, progress: true, nutrition: true },
  });
  res.json(users);
});

app.get("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { sessions: true, progress: true, nutrition: true },
  });
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await prisma.user.update({ where: { id }, data: req.body });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // Supprimer toutes les relations avant l'user
    await prisma.exerciseInSession.deleteMany({
      where: { session: { userId: id } },
    });
    await prisma.workoutSession.deleteMany({ where: { userId: id } });
    await prisma.nutritionEntry.deleteMany({ where: { userId: id } });
    await prisma.progress.deleteMany({ where: { userId: id } });

    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted with all related data" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- WORKOUT SESSIONS -----------------
app.post("/sessions", async (req, res) => {
  try {
    const session = await prisma.workoutSession.create({ data: req.body });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/sessions", async (req, res) => {
  const sessions = await prisma.workoutSession.findMany({
    include: { exercises: { include: { exercise: true } } },
  });
  res.json(sessions);
});

app.get("/sessions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const session = await prisma.workoutSession.findUnique({
    where: { id },
    include: { exercises: { include: { exercise: true } } },
  });
  res.json(session);
});

app.put("/sessions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const session = await prisma.workoutSession.update({
      where: { id },
      data: req.body,
    });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/sessions/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.exerciseInSession.deleteMany({ where: { sessionId: id } });
    await prisma.workoutSession.delete({ where: { id } });
    res.json({ message: "Session deleted with related exercises" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- EXERCISES -----------------
app.post("/exercises", async (req, res) => {
  try {
    const exercise = await prisma.exercise.create({ data: req.body });
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/exercises", async (req, res) => {
  const exercises = await prisma.exercise.findMany();
  res.json(exercises);
});

app.get("/exercises/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const exercise = await prisma.exercise.findUnique({ where: { id } });
  res.json(exercise);
});

app.put("/exercises/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const exercise = await prisma.exercise.update({
      where: { id },
      data: req.body,
    });
    res.json(exercise);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/exercises/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    // Supprimer toutes les références dans sessions avant
    await prisma.exerciseInSession.deleteMany({ where: { exerciseId: id } });
    await prisma.exercise.delete({ where: { id } });
    res.json({ message: "Exercise deleted with related session links" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- EXERCISES IN SESSION -----------------
app.post("/exercise-in-session", async (req, res) => {
  const { sessionId, exerciseId, sets, reps, weight } = req.body;
  try {
    // Vérifier existence session et exercise
    const session = await prisma.workoutSession.findUnique({ where: { id: sessionId } });
    const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
    if (!session) return res.status(404).json({ error: "Session not found" });
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    const eSession = await prisma.exerciseInSession.create({
      data: { sessionId, exerciseId, sets, reps, weight },
    });
    res.json(eSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/exercise-in-session", async (req, res) => {
  const exercises = await prisma.exerciseInSession.findMany({
    include: { exercise: true, session: true },
  });
  res.json(exercises);
});

app.get("/sessions/:id/exercises", async (req, res) => {
  const id = parseInt(req.params.id);
  const exercises = await prisma.exerciseInSession.findMany({
    where: { sessionId: id },
    include: { exercise: true },
  });
  res.json(exercises);
});

app.put("/exercise-in-session/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const eSession = await prisma.exerciseInSession.update({
      where: { id },
      data: req.body,
    });
    res.json(eSession);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/exercise-in-session/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.exerciseInSession.delete({ where: { id } });
    res.json({ message: "Exercise in session deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- NUTRITION -----------------
app.post("/nutrition", async (req, res) => {
  try {
    const nutrition = await prisma.nutritionEntry.create({ data: req.body });
    res.json(nutrition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/nutrition", async (req, res) => {
  const nutrition = await prisma.nutritionEntry.findMany();
  res.json(nutrition);
});

app.get("/nutrition/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const nutrition = await prisma.nutritionEntry.findMany({ where: { userId } });
  res.json(nutrition);
});

app.put("/nutrition/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const nutrition = await prisma.nutritionEntry.update({
      where: { id },
      data: req.body,
    });
    res.json(nutrition);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/nutrition/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.nutritionEntry.delete({ where: { id } });
    res.json({ message: "Nutrition entry deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ----------------- PROGRESS -----------------
app.post("/progress", async (req, res) => {
  try {
    const progress = await prisma.progress.create({ data: req.body });
    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/progress", async (req, res) => {
  const progress = await prisma.progress.findMany();
  res.json(progress);
});

app.get("/progress/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);
  const progress = await prisma.progress.findMany({ where: { userId } });
  res.json(progress);
});

app.put("/progress/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const progress = await prisma.progress.update({
      where: { id },
      data: req.body,
    });
    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/progress/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.progress.delete({ where: { id } });
    res.json({ message: "Progress entry deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/stats/sessions/:userId/:type", async (req, res) => {
  const { userId, type } = req.params;

  const sessions = await prisma.workoutSession.findMany({
    where: {
      userId: Number(userId),
      type,
    },
    include: {
      exercises: true,
    },
    orderBy: { date: "asc" },
  });

  const data = sessions.map(session => {
    const volume = session.exercises.reduce((acc, ex) => {
      return acc + (ex.weight ?? 0) * ex.reps * ex.sets;
    }, 0);

    return {
      date: session.date,
      volume,
    };
  });

  res.json(data);
});

app.get("/stats/exercise/:userId/:exerciseId", async (req, res) => {
  const { userId, exerciseId } = req.params;

  const entries = await prisma.exerciseInSession.findMany({
    where: {
      exerciseId: Number(exerciseId),
      session: {
        userId: Number(userId),
      },
      weight: { not: null },
    },
    include: {
      session: true,
    },
    orderBy: {
      session: { date: "asc" },
    },
  });

  const data = entries.map(e => ({
    date: e.session.date,
    weight: e.weight,
    reps: e.reps,
    sets: e.sets,
    volume: e.weight * e.reps * e.sets,
    oneRM: +(e.weight * (1 + e.reps / 30)).toFixed(1),
  }));

  res.json(data);
});


// ----------------- START SERVER -----------------
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
