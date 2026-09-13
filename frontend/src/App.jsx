// Importamos useState de React para manejar los datos de la pantalla
import { useState } from "react";

// Importamos los estilos de la aplicación
import "./App.css";

// Importamos los módulos de Comunika
import CreateTopic from "./CreateTopic";
import CreateResponse from "./CreateResponse";
import Profile from "./Profile";

function App() {

  // Estado para almacenar el nombre de usuario
  const [usuario, setUsuario] = useState("");

  // Estado para almacenar la contraseña
  const [password, setPassword] = useState("");

  // Estado para mostrar mensajes
  const [mensaje, setMensaje] = useState("");

  // Estado para saber si el usuario inició sesión correctamente
  const [autenticado, setAutenticado] = useState(false);

  // Función para iniciar sesión
  const iniciarSesion = async (e) => {

    e.preventDefault();

    try {

      // Enviamos los datos al Back-End
      const respuesta = await fetch(
        "https://comunika-api.onrender.com/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            usuario: usuario,
            password: password,
          }),
        }
      );

      // Convertimos la respuesta a JSON
      const datos = await respuesta.json();

      // Verificamos si el login fue correcto
      if (respuesta.ok) {

        setAutenticado(true);
        setMensaje(datos.mensaje);

      } else {

        setMensaje(datos.error);
      }

    } catch (error) {

      setMensaje("No se pudo conectar con el servidor");
    }
  };

  // Función para registrar un nuevo usuario
  const registrarUsuario = async (e) => {

    e.preventDefault();

    try {

      // Enviamos los datos al Back-End
      const respuesta = await fetch(
        "https://comunika-api.onrender.com/registro",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            usuario: usuario,
            password: password,
          }),
        }
      );

      // Convertimos la respuesta a JSON
      const datos = await respuesta.json();

      // Mostramos el resultado
      if (respuesta.ok) {

        setMensaje(datos.mensaje);

      } else {

        setMensaje(datos.error);
      }

    } catch (error) {

      setMensaje("No se pudo conectar con el servidor");
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {

    setAutenticado(false);
    setUsuario("");
    setPassword("");
    setMensaje("Sesión cerrada correctamente");
  };

  return (
    <div className="app">

      {/* Encabezado principal */}
      <header className="encabezado">

        <h1>COMUNIKA</h1>

        <p>Foro Web Educativo</p>

      </header>

      {/* Contenido principal */}
      <main className="contenido">

        {autenticado ? (

          /* ==================================================
             PANTALLA DESPUÉS DEL INICIO DE SESIÓN
             ================================================== */

          <section className="bienvenida">

            <h2>Bienvenido a Comunika</h2>

            <p>Has iniciado sesión correctamente.</p>

            {/* Botón para cerrar sesión */}
            <button onClick={cerrarSesion}>
              Cerrar sesión
            </button>

            {/* Módulo para crear temas */}
            <CreateTopic />

            {/* Módulo para responder publicaciones */}
            <CreateResponse />

            {/* Módulo para gestionar el perfil */}
            <Profile cerrarSesion={cerrarSesion} />

          </section>

        ) : (

          /* ==================================================
             PANTALLA DE INICIO DE SESIÓN
             ================================================== */

          <section className="bienvenida">

            <h2>Iniciar sesión</h2>

            {/* Formulario de autenticación */}
            <form onSubmit={iniciarSesion}>

              {/* Campo de usuario */}
              <label>Usuario</label>

              <input
                type="text"
                placeholder="Ingrese su usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />

              {/* Campo de contraseña */}
              <label>Contraseña</label>

              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Botón iniciar sesión */}
              <button type="submit">
                Iniciar sesión
              </button>

              {/* Botón registrar */}
              <button
                type="button"
                onClick={registrarUsuario}
              >
                Registrarse
              </button>

            </form>

            {/* Mensaje del sistema */}
            {mensaje && <p>{mensaje}</p>}

          </section>

        )}

      </main>

      {/* Pie de página */}
      <footer>
        <p>Comunika © 2026</p>
      </footer>

    </div>
  );
}

// Exportamos el componente principal
export default App;