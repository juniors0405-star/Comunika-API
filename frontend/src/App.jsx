// Importamos useState de React para manejar los datos de la pantalla
import { useState } from "react";

// Importamos los estilos de la aplicación
import "./App.css";

function App() {

  // Estado para almacenar el nombre de usuario
  const [usuario, setUsuario] = useState("");

  // Estado para almacenar la contraseña
  const [password, setPassword] = useState("");

  // Estado para mostrar el resultado del inicio de sesión
  const [mensaje, setMensaje] = useState("");
// Estado para saber si el usuario inició sesión correctamente
const [autenticado, setAutenticado] = useState(false);
  // Función que se ejecuta cuando el usuario envía el formulario
  const iniciarSesion = async (e) => {

    // Evitamos que el formulario recargue la página
    e.preventDefault();

    try {

      // Enviamos los datos del usuario al servicio de login del backend
      const respuesta = await fetch("http://localhost:3000/login", {

        // Indicamos que utilizaremos el método POST
        method: "POST",

        // Indicamos que la información será enviada en formato JSON
        headers: {
          "Content-Type": "application/json",
        },

        // Convertimos los datos del formulario a formato JSON
        body: JSON.stringify({
          usuario: usuario,
          password: password,
        }),
      });

      // Convertimos la respuesta del servidor a formato JSON
      const datos = await respuesta.json();

      // Verificamos si la respuesta fue exitosa
      if (respuesta.ok) {
  // Indicamos que la autenticación fue correcta
  setAutenticado(true);
        // Mostramos el mensaje enviado por el backend
        setMensaje(datos.mensaje);

      } else {

        // Mostramos el mensaje de error enviado por el backend
        setMensaje(datos.error);
      }

    } catch (error) {

      // Mostramos un mensaje si no se puede conectar con el backend
      setMensaje("No se pudo conectar con el servidor");
    }
  };
// Función para registrar un nuevo usuario
  const registrarUsuario = async (e) => {

    // Evitamos que el formulario recargue la página
    e.preventDefault();

    try {

      // Enviamos los datos al servicio de registro del backend
      const respuesta = await fetch("http://localhost:3000/registro", {

        // Utilizamos el método POST
        method: "POST",

        // Indicamos que enviaremos información en formato JSON
        headers: {
          "Content-Type": "application/json",
        },

        // Enviamos usuario y contraseña
        body: JSON.stringify({
          usuario: usuario,
          password: password,
        }),
      });

      // Convertimos la respuesta a JSON
      const datos = await respuesta.json();

      // Mostramos el resultado del registro
      if (respuesta.ok) {
        setMensaje(datos.mensaje);
      } else {
        setMensaje(datos.error);
      }

    } catch (error) {

      // Mostramos un mensaje si no hay conexión con el backend
      setMensaje("No se pudo conectar con el servidor");
    }
  };
  // Interfaz visual de la aplicación
  return (
    <div className="app">

      {/* Encabezado principal de Comunika */}
      <header className="encabezado">

        {/* Nombre del proyecto */}
        <h1>COMUNIKA</h1>

        {/* Descripción del proyecto */}
        <p>Foro Web Educativo</p>

      </header>

{/* Contenido principal */}
<main className="contenido">

  {/* Verificamos si el usuario ya inició sesión */}
  {autenticado ? (

    /* Pantalla que se muestra cuando el usuario está autenticado */
    <section className="bienvenida">

      {/* Mostramos la pantalla de bienvenida */}
      <h2>Bienvenido a Comunika</h2>

      {/* Confirmamos que el inicio de sesión fue correcto */}
      <p>Has iniciado sesión correctamente.</p>

    </section>

  ) : (

    /* Pantalla que se muestra cuando el usuario NO está autenticado */
    <section className="bienvenida">

      {/* Título de la pantalla */}
      <h2>Iniciar sesión</h2>

      {/* Formulario de autenticación */}
      <form onSubmit={iniciarSesion}>

        {/* Campo para el usuario */}
        <label>Usuario</label>

        <input
          type="text"
          placeholder="Ingrese su usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        {/* Campo para la contraseña */}
        <label>Contraseña</label>

        <input
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botón para iniciar sesión */}
        <button type="submit">
          Iniciar sesión
        </button>

        {/* Botón para registrar un usuario */}
        <button type="button" onClick={registrarUsuario}>
          Registrarse
        </button>

      </form>

      {/* Mostramos el mensaje solamente si existe */}
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

// Exportamos el componente principal de React
export default App;