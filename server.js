const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Tu URI de conexión a MongoDB Atlas
const MONGO_URI = 'mongodb+srv://jhonsalazar01:gYNE3RqRJfNpRi0y@final.0ux8x.mongodb.net/?retryWrites=true&w=majority&appName=Final';

app.use(cors());
app.use(express.json());

// Conectar a MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión:', err));

// Definir esquema y modelo para logs
const logSchema = new mongoose.Schema({
  ip: String,
  hora: { type: Date, default: Date.now },
  correo: String,
  accion: String
});
const Log = mongoose.model('logs', logSchema); // La colección será "logs"

// Ruta para guardar logs
app.post('/logs', async (req, res) => {
  try {
    const { correo, accion } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const nuevoLog = new Log({ ip, correo, accion });
    await nuevoLog.save();

    res.status(201).json({ mensaje: 'Log guardado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el log' });
  }
});

// Ruta opcional para obtener logs
app.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ hora: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los logs' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
