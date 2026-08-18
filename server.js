// Importamos Express
const express = require("express");

// Importamos MongoDB
const { MongoClient, ObjectId } = require("mongodb");

// Cargamos las variables del archivo .env
require("dotenv").config();

// Creamos la aplicación
const app = express();

// Permite recibir información en formato JSON
app.use(express.json());

// Puerto de la API
const PORT = 3000;

// URL de conexión a MongoDB
const uri = process.env.MONGODB_URI;

// Creamos el cliente de MongoDB
const client = new MongoClient(uri);

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Comunika funcionando correctamente"
    });
});

// Función para conectar MongoDB
async function iniciarServidor() {
    try {
        await client.connect();

        console.log("✅ Conectado correctamente a MongoDB Atlas");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:");
        console.error(error);
    }
}

// Iniciamos todo
iniciarServidor();
app.get("/usuarios", async (req, res) => {
  try {
    const db = client.db("comunika");
    const usuarios = await db.collection("users").find().toArray();

    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/usuarios", async (req, res) => {
  try {
    const db = client.db("comunika");

    const nuevoUsuario = {
      nombre: req.body.nombre,
      email: req.body.email
    };

    const resultado = await db.collection("users").insertOne(nuevoUsuario);

    res.status(201).json({
      mensaje: "Usuario creado correctamente",
      id: resultado.insertedId
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
// SERVICIO DE REGISTRO
app.post("/registro", async (req, res) => {
    try {
        const db = client.db("comunika");

        const { usuario, password } = req.body;

        // Verificamos si el usuario ya existe
        const usuarioExistente = await db.collection("users").findOne({ usuario });

        if (usuarioExistente) {
            return res.status(400).json({
                error: "El usuario ya existe"
            });
        }

        // Guardamos el nuevo usuario
        await db.collection("users").insertOne({
            usuario: usuario,
            password: password
        });

        res.json({
            mensaje: "Usuario registrado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// SERVICIO DE INICIO DE SESIÓN
app.post("/login", async (req, res) => {
    try {
        const db = client.db("comunika");

        const { usuario, password } = req.body;

        // Buscamos el usuario y la contraseña
        const usuarioEncontrado = await db.collection("users").findOne({
            usuario: usuario,
            password: password
        });

        // Verificamos las credenciales
        if (usuarioEncontrado) {
            return res.json({
                mensaje: "Autenticación satisfactoria"
            });
        }

        res.status(401).json({
            error: "Error en la autenticación"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
// SERVICIO PARA ACTUALIZAR UN USUARIO
app.put("/usuarios/:id", async (req, res) => {
    try {
        const db = client.db("comunika");

        const resultado = await db.collection("users").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );

        res.json({
            mensaje: "Usuario actualizado correctamente",
            modificados: resultado.modifiedCount
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
// SERVICIO PARA ELIMINAR UN USUARIO
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const db = client.db("comunika");

        // Eliminamos el usuario utilizando su ID
        const resultado = await db.collection("users").deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (resultado.deletedCount === 1) {
            return res.json({
                mensaje: "Usuario eliminado correctamente"
            });
        }

        res.status(404).json({
            error: "Usuario no encontrado"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});