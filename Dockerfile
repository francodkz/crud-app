FROM node:18-slim

# Install build dependencies yang dibutuhkan oleh sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Salin package.json backend
COPY backend/package*.json ./backend/

# Install dependencies termasuk sqlite3 di dalam container
WORKDIR /app/backend
RUN npm install --production

# Salin seluruh file backend dan frontend
WORKDIR /app
COPY backend/ ./backend/
COPY frontend/ ./frontend/

WORKDIR /app/backend

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
