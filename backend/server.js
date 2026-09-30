const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path')
const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Inisialisasi Database SQLite (File database akan otomatis terbuat bernama 'database.sqlite')
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Gagal terhubung ke database:', err.message);
    } else {
        console.log('Berhasil terhubung ke database SQLite.');
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
// Membuat tabel awal (Contoh: tabel items/barang)
db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL
)`, (err) => {
    if (!err) {
        console.log('Tabel items siap digunakan.');
    }
});

// Route / Endpoint tes server
app.get('/', (req, res) => {
    res.json({ message: 'Backend CRUD API berjalan dengan baik!' });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server backend menyala di port ${PORT}`);
});

// 1. CREATE: Menambahkan data baru (POST)
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

// 2. READ: Melihat semua data (GET)
app.get('/items', (req, res) => {
	console.log('-> Endpoint GET /items dipanggil!'); // TAMBAHKAN INI    
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
