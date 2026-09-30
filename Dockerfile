# Gunakan base image resmi Node.js yang ringan
FROM node:18-slim

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json terlebih dahulu
COPY /backend/package*.json ./ ./backend/


# Masuk ke direktori backend untuk install dependencies
WORKDIR /app/backend

# Install dependencies (gunakan npm ci jika ada package-lock.json, atau npm install)
RUN npm install --production

# Salin seluruh sisa file project ke dalam container
WORKDIR /app
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Cloud Run biasanya menyediakan port melalui variabel environment PORT, 
# tapi secara default kita bisa set ke port 8080 atau port aplikasi kamu
ENV PORT=8080
EXPOSE 8080

# Perintah untuk menjalankan aplikasi kamu
WORKDIR /app/backend
CMD ["node", "server.js"]
