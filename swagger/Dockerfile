FROM swaggerapi/swagger-ui:latest

# Ne PAS copier dans /usr/share/nginx/html directement !
# Copie dans un sous-dossier ou garde les fichiers originaux intacts
COPY documentation/swagger.json /usr/share/nginx/html/swagger.json

ENV SWAGGER_JSON=/usr/share/nginx/html/swagger.json
