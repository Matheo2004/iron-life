# Étape 1 : image Node
FROM node:20

# Créer le dossier de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3000

# Charger les variables d'environnement et lancer l'app
CMD npx prisma migrate deploy && node index.js