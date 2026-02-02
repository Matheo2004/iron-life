import requests
from datetime import datetime, timedelta
import random

API_URL = "http://localhost:3000"

# ---------------- USERS ----------------
users = [
    {"email": "test@example.com", "password": "password", "username": "TestUser"},
]

for u in users:
    r = requests.post(f"{API_URL}/users", json=u)
    if r.status_code in (200, 201):
        print(f"✅ Utilisateur créé : {u['username']}")
        user = r.json()
        user_id = user["id"]
    else:
        print(f"❌ Erreur création user {u['username']}: {r.status_code}")
        continue

# ---------------- EXERCICES ----------------
session_types = {
    "Pectoraux - Triceps": [
        "Développé couché",
        "Développé incliné",
        "Dips",
        "Pompes",
        "Extension triceps poulie",
        "Barre au front",
    ],
    "Dos - Biceps": [
        "Tractions",
        "Rowing barre",
        "Rowing haltère",
        "Tirage vertical",
        "Curl barre",
        "Curl haltère",
    ],
    "Jambes": [
        "Squat",
        "Presse à cuisses",
        "Fentes",
        "Soulevé de terre jambes tendues",
        "Leg curl",
        "Leg extension",
    ],
    "Épaules - Trapèzes": [
        "Développé militaire",
        "Élévations latérales",
        "Oiseau",
        "Shrugs",
        "Upright row",
    ],
    "Full Body": [
        "Burpees",
        "Thrusters",
        "Soulevé de terre",
        "Kettlebell swing",
        "Clean & Press",
    ],
}

# ---------------- EXERCICES ----------------
# On récupère tous les exercices existants pour éviter les doublons
r = requests.get(f"{API_URL}/exercises")
existing_exercises = r.json()
exercise_map = {ex["name"]: ex["id"] for ex in existing_exercises}

for muscle_group, exercises in session_types.items():
    for name in exercises:
        if name in exercise_map:
            print(f"ℹ️ Exercice déjà existant : {name}")
            continue  # skip si déjà créé

        payload = {
            "name": name,
            "muscleGroup": muscle_group,
            "description": f"Exercice de {muscle_group.lower()}",
            "imageUrl": "",
            "createdAt": datetime.utcnow().isoformat() + "Z",
        }
        r2 = requests.post(f"{API_URL}/exercises", json=payload)
        if r2.status_code in (200, 201):
            ex = r2.json()
            exercise_map[name] = ex["id"]
            print(f"✅ Exercice ajouté : {name} ({muscle_group})")
        else:
            print(f"❌ Erreur pour {name} : {r2.status_code} – {r2.text}")
            

# ---------------- SESSIONS + EXERCICES IN SESSION ----------------
start_date = datetime.utcnow() - timedelta(days=90)  # 3 mois
for day in range(0, 90, 2):  # séance tous les 2 jours
    session_date = start_date + timedelta(days=day)
    type_choice = random.choice(list(session_types.keys()))
    duration = random.randint(45, 90)

    session_payload = {
        "userId": user_id,
        "type": type_choice,
        "date": session_date.isoformat() + "Z",
        "duration": duration,
    }
    r = requests.post(f"{API_URL}/sessions", json=session_payload)
    if r.status_code not in (200, 201):
        print(f"❌ Erreur création session : {r.text}")
        continue
    session = r.json()
    session_id = session["id"]

    # ajouter exercices à la session
    exercises_in_type = session_types[type_choice]
    for ex_name in random.sample(exercises_in_type, k=min(4, len(exercises_in_type))):
        weight = random.randint(20, 80)
        reps = random.choice([8, 10, 12, 15])
        sets = random.choice([3, 4])
        payload_ex = {
            "sessionId": session_id,
            "exerciseId": exercise_map[ex_name],
            "sets": sets,
            "reps": reps,
            "weight": weight,
        }
        r2 = requests.post(f"{API_URL}/exercise-in-session", json=payload_ex)
        if r2.status_code in (200, 201):
            print(f"   ✅ {ex_name} ajouté à la session {session_id}")
        else:
            print(f"   ❌ Erreur {ex_name} : {r2.text}")

# ---------------- NUTRITION ----------------
meal_types = ["Petit-déjeuner", "Déjeuner", "Dîner", "Collation"]
for day in range(90):
    date = (start_date + timedelta(days=day)).isoformat() + "Z"
    for meal in meal_types:
        payload = {
            "userId": user_id,
            "date": date,
            "mealType": meal,
            "calories": random.randint(300, 800),
            "protein": round(random.uniform(20, 60), 1),
            "carbs": round(random.uniform(20, 100), 1),
            "fat": round(random.uniform(10, 30), 1),
        }
        r = requests.post(f"{API_URL}/nutrition", json=payload)
        if r.status_code in (200, 201):
            print(f"✅ Nutrition {meal} ajouté ({date})")
        else:
            print(f"❌ Nutrition {meal} erreur : {r.text}")

# ---------------- PROGRESS ----------------
for day in range(0, 90, 7):  # progression chaque semaine
    date = (start_date + timedelta(days=day)).isoformat() + "Z"
    weight = round(70 + day*0.1 + random.uniform(-0.5,0.5), 1)
    body_fat = round(20 - day*0.05 + random.uniform(-0.5,0.5), 1)
    muscle_mass = round(50 + day*0.08 + random.uniform(-0.3,0.3), 1)
    payload = {
        "userId": user_id,
        "date": date,
        "weight": weight,
        "bodyFat": body_fat,
        "muscleMass": muscle_mass,
        "photoUrl": "",
    }
    r = requests.post(f"{API_URL}/progress", json=payload)
    if r.status_code in (200, 201):
        print(f"✅ Progression ajoutée ({date})")
    else:
        print(f"❌ Progression erreur : {r.text}")

print("🎉 Seed terminé !")
