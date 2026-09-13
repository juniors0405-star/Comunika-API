// Importamos useState para controlar los datos del formulario
import { useState } from "react";

// Componente encargado de gestionar el perfil del usuario
function Profile({ cerrarSesion }) {

  // Estado para almacenar el ID del usuario
  const [id, setId] = useState("");

  // Estado para almacenar el nuevo nombre de usuario
  const [usuario, setUsuario] = useState("");

  // Estado para almacenar la nueva contraseña
  const [password, setPassword] = useState("");

  // Estado para mostrar mensajes al usuario
  const [mensaje, setMensaje] = useState("");

  // Función para actualizar los datos del perfil
  const actualizarPerfil = async (e) => {

    // Evitamos que el formulario recargue la página
    e.preventDefault();

    try {

      // Enviamos los nuevos datos al servicio Back-End
      const respuesta = await fetch(
        `https://comunika-api.onrender.com/usuarios/${id}`,
        {
          method: "PUT",

          // Indicamos que enviamos información en formato JSON
          headers: {
            "Content-Type": "application/json"
          },

          // Enviamos usuario y contraseña al servidor
          body: JSON.stringify({
            usuario: usuario,
            password: password
          })
        }
      );

      // Convertimos la respuesta del servidor a JSON
      const datos = await respuesta.json();

      // Mostramos el mensaje recibido del servidor
      setMensaje(datos.mensaje || datos.error);

    } catch (error) {

      // Mostramos un mensaje si no se puede conectar con el servidor
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <section className="bienvenida">

      {/* Título de la sección de perfil */}
      <h2>Mi perfil</h2>

      {/* Formulario para actualizar los datos */}
      <form onSubmit={actualizarPerfil}>

        {/* Campo para identificar al usuario */}
        <label>ID del usuario</label>

        <input
          type="text"
          placeholder="Ingrese el ID del usuario"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        {/* Campo para modificar el nombre de usuario */}
        <label>Usuario</label>

        <input
          type="text"
          placeholder="Ingrese el nuevo usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        {/* Campo para modificar la contraseña */}
        <label>Nueva contraseña</label>

        <input
          type="password"
          placeholder="Ingrese la nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Botón para guardar los cambios */}
        <button type="submit">
          Actualizar perfil
        </button>

      </form>

      {/* Mostramos el resultado de la actualización */}
      {mensaje && <p>{mensaje}</p>}

      {/* Botón para cerrar la sesión */}
      <button type="button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>

    </section>
  );
}

// Exportamos el componente para utilizarlo en App.jsx
export default Profile;