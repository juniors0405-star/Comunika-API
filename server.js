// Importamos Express
const express = require("express");
// Importamos MongoDB
const { MongoClient, ObjectId } = require("mongodb");
// Importamos CORS
const cors = require("cors");

// Cargamos las variables del archivo .env
require("dotenv").config();

// Creamos la aplicación
const app = express();
// Definimos el puerto donde se ejecutará el servidor
// Si existe un puerto en las variables de entorno, lo utilizamos.
// De lo contrario, utilizamos el puerto 3000.
const PORT = process.env.PORT || 3000;
// Permite recibir información en formato JSON
app.use(express.json());

// Configuramos CORS para permitir la comunicación
// entre el frontend de React y el backend de Express
app.use(cors({
    origin: ["http://localhost:5173", "https://comunika-api.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

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


// aquí empieza la ruta de usuarios
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
    // Mostramos en la terminal cuando el frontend intenta iniciar sesión
console.log("Solicitud de inicio de sesión recibida");

// Mostramos los datos enviados por el formulario
console.log(req.body);
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
// SERVICIO PARA CONSULTAR UN USUARIO POR ID
app.get("/usuarios/:id", async (req, res) => {
    try {
        const db = client.db("comunika");

        const id = new ObjectId(req.params.id);

        const usuario = await db.collection("users").findOne({
            _id: id
        });

        if (!usuario) {
            return res.status(404).json({
                error: "Usuario no encontrado"
            });
        }

        res.json(usuario);

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
const id = new ObjectId(req.params.id);
const usuario = await db.collection("users").findOne({
    _id: id
});

console.log("ID recibido:", req.params.id);
console.log("Usuario encontrado:", usuario);

const resultado = await db.collection("users").deleteOne({
    _id: id
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

// ==========================================
// SERVICIO PARA CREAR UN NUEVO TEMA
// ==========================================

// Recibimos una solicitud POST para crear un nuevo tema
console.log("Ruta POST /temas registrada");

app.post("/temas", async (req, res) => {

  try {

    // Nos conectamos a la base de datos "comunika"
    const db = client.db("comunika");

    // Extraemos los datos enviados desde el frontend
    const { titulo, contenido, usuario } = req.body;

    // Verificamos que los campos obligatorios tengan información
    if (!titulo || !contenido || !usuario) {

      // Respondemos con un error si falta algún dato
      return res.status(400).json({
        error: "Todos los campos son obligatorios"
      });
    }

    // Creamos el objeto que almacenaremos en MongoDB
    const nuevoTema = {
      titulo: titulo,
      contenido: contenido,
      usuario: usuario,
      fecha: new Date()
    };

    // Guardamos el nuevo tema en la colección "temas"
    const resultado = await db.collection("temas").insertOne(nuevoTema);

    // Respondemos al frontend indicando que el tema fue creado
    res.status(201).json({
      mensaje: "Tema creado correctamente",
      id: resultado.insertedId
    });

  } catch (error) {

    // Mostramos el error si ocurre un problema con el servidor
    res.status(500).json({
      error: error.message
    });
  }
});
// Iniciamos todo
iniciarServidor();

// SERVICIO PARA CONSULTAR TODOS LOS TEMAS
app.get("/temas", async (req, res) => {
    try {
        const db = client.db("comunika");

        const temas = await db.collection("temas").find().toArray();

        res.json(temas);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
// SERVICIO PARA ACTUALIZAR UN TEMA
app.put("/temas/:id", async (req, res) => {
    try {
        const db = client.db("comunika");

        const id = new ObjectId(req.params.id);

        const { titulo, contenido, usuario } = req.body;

        const resultado = await db.collection("temas").updateOne(
            { _id: id },
            {
                $set: {
                    titulo: titulo,
                    contenido: contenido,
                    usuario: usuario
                }
            }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({
                error: "Tema no encontrado"
            });
        }

        res.json({
            mensaje: "Tema actualizado correctamente"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
// SERVICIO PARA ELIMINAR UN TEMA
app.delete("/temas/:id", async (req, res) => {
  try {
    const db = client.db("comunika");

    const resultado = await db.collection("temas").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        mensaje: "Tema no encontrado"
      });
    }

    res.json({
      mensaje: "Tema eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
// SERVICIO PARA CREAR UNA RESPUESTA
app.post("/temas/:id/respuestas", async (req, res) => {
  try {
    const db = client.db("comunika");

    const { contenido, usuario } = req.body;

    // Validamos que los datos obligatorios existan
    if (!contenido || !usuario) {
      return res.status(400).json({
        mensaje: "El contenido y el usuario son obligatorios"
      });
    }

    // Verificamos que el tema exista
    const tema = await db.collection("temas").findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!tema) {
      return res.status(404).json({
        mensaje: "Tema no encontrado"
      });
    }

    // Creamos la respuesta
    const nuevaRespuesta = {
      contenido,
      usuario,
      temaId: new ObjectId(req.params.id),
      fecha: new Date()
    };

    const resultado = await db.collection("respuestas").insertOne(nuevaRespuesta);

    res.status(201).json({
      mensaje: "Respuesta creada correctamente",
      id: resultado.insertedId
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
// SERVICIO PARA CONSULTAR LAS RESPUESTAS DE UN TEMA
app.get("/temas/:id/respuestas", async (req, res) => {
  try {
    const db = client.db("comunika");

    const respuestas = await db.collection("respuestas").find({
      temaId: new ObjectId(req.params.id)
    }).toArray();

    res.json(respuestas);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
// SERVICIO PARA ACTUALIZAR UNA RESPUESTA
app.put("/respuestas/:id", async (req, res) => {
  try {
    const db = client.db("comunika");

    const { contenido } = req.body;

    if (!contenido) {
      return res.status(400).json({
        mensaje: "El contenido es obligatorio"
      });
    }

    const resultado = await db.collection("respuestas").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { contenido: contenido } }
    );

    if (resultado.matchedCount === 0) {
      return res.status(404).json({
        mensaje: "Respuesta no encontrada"
      });
    }

    res.json({
      mensaje: "Respuesta actualizada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
// SERVICIO PARA ELIMINAR UNA RESPUESTA
app.delete("/respuestas/:id", async (req, res) => {
  try {
    const db = client.db("comunika");

    const resultado = await db.collection("respuestas").deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (resultado.deletedCount === 0) {
      return res.status(404).json({
        mensaje: "Respuesta no encontrada"
      });
    }

    res.json({
      mensaje: "Respuesta eliminada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});