FROM node:lts-alpine
WORKDIR /app
COPY . /app
RUN yarn install
ENV DB_NAME="smvd" \
    DB_USER="ashishup1999" \
    DB_PASSWORD="NMyAH1mV0VuVea9a" \
    CLIENT_URI="http://localhost:5173" \
    CHAT_SERVER_PORT=3001 \
    API_SERVER_PORT=3002 \
    ENCRYPTION_SECRET_KEY="Abeo38_754ksXj" \
    ENCRYPTION_IV="xcpon8" \
    ENCRYPTION_METHOD="AES_256_CBC"
EXPOSE 3001 3002
CMD node index.js
