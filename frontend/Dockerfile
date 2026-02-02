# Étape 1 : image Node
FROM node:20

# Créer le dossier de travail
WORKDIR /app

# Copier les fichiers
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port de dev React
EXPOSE 5173

# Lancer le serveur de dev
CMD ["npm", "start"]
