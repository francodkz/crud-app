const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Menyajikan file statis dari folder frontend (posisinya di luar folder backend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Inisialisasi Database SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Berhasil terhubung ke database SQLite.');
    }
});

// Membuat tabel awal (items) jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL
)`, (err) => {
    if (!err) {
        console.log('Tabel items siap digunakan.');
    }
});

// ==================== ROUTES / ENDPOINTS ====================

// 1. Route tes server
app.get('/api-test', (req, res) => {
    res.json({ message: 'Backend CRUD API berjalan dengan baik!' });
});

// 2. CREATE: Menambahkan data baru (POST)
app.post('/items', (req, res) => {
    const { name, quantity } = req.body;
    const query = `INSERT INTO items (name, quantity) VALUES (?, ?)`;
    
    db.run(query, [name, quantity], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Data berhasil ditambahkan!',
            id: this.lastID,
            name,
            quantity
        });
    });
});

// 3. READ: Melihat semua data (GET)
app.get('/items', (req, res) => {
    console.log('-> Endpoint GET /items dipanggil');
    const query = `SELECT * FROM items`;
    
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Berhasil mengambil data',
            data: rows
        });
    });
});

// ==================== JALANKAN SERVER ====================
// Hanya dipanggil SEKALI di bagian paling bawah dengan '0.0.0.0'
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server backend menyala di port ${PORT}`);
});
