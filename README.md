# Iron Life

Application web de **suivi sportif** : on y enregistre ses séances de musculation, ses repas et sa progression
physique, avec un espace d'administration pour gérer les utilisateurs et le catalogue d'exercices.

## Fonctionnalités

- **Séances** : exercices réalisés, séries, répétitions et charges
- **Exercices** : catalogue classé par groupe musculaire
- **Nutrition** : repas avec calories, protéines, glucides et lipides
- **Progression** : poids, masse grasse et masse musculaire au fil du temps
- **Administration** : gestion des utilisateurs, exercices, séances et données nutritionnelles

## Technologies

- **Frontend** : React, Vite
- **Backend** : Node.js, Express, Prisma
- **Base de données** : PostgreSQL
- **Documentation de l'API** : Swagger UI
- **Déploiement** : Docker Compose

## Lancer le projet

```bash
docker compose up --build
```

| Service | Adresse |
|---|---|
| Interface | http://localhost:5173 |
| API | http://localhost:3000 |
| Documentation Swagger | http://localhost:8080 |

Pour remplir la base avec des exercices d'exemple : `python seed_exercises.py`.

> Les identifiants PostgreSQL de `docker-compose.yml` sont destinés au développement local uniquement.

## Organisation

```
backend/    API Express + schéma Prisma et migrations
frontend/   interface React (pages utilisateur et pages d'administration)
swagger/    documentation OpenAPI de l'API
```
