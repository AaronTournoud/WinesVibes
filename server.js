const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const path = require('path');



app.use(bodyParser.urlencoded({ extended: true }));


// Configuración de la base de datos PostgreSQL
const pool = new Pool({
    user: 'AaronTDB_owner',
    host: 'ep-red-pine-a5wbgkem.us-east-2.aws.neon.tech',
    database: 'vinos',
    password: 'GdFx0z8MXEhW',
    port: 5432,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

app.use(express.static(path.join(__dirname, 'Public')));

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Public/home.html');
});

app.get('/vinos', (req, res) => {
    res.sendFile(path.join(__dirname, '/Public/vinos.html'));
});

app.get('/api/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT v.nombre as nombre, m.nombre as marca, c.calificacion as calificacion, i.imagen_url as imagen FROM vinos v join marca m on v.idmarca=m.id join calificacion c on v.id=c.idvino left join imagen i on i.id=v.id'); // Cambia el nombre de la tabla según tu estructura
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error en el servidor');
    }
});

// Otras rutas (Bodegas, Uvas, Ranking)
app.get('/bodegas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM marca');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la base de datos');
    }
});

app.get('/uvas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tipo');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la base de datos');
    }
});

app.get('/ranking', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM calificacion');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en la base de datos');
    }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});