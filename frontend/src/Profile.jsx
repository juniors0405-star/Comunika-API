// Importamos useState para controlar los datos del formulario
import { useState } from "react";

// Importamos la dirección del backend
import { API_URL } from "./config";

// Componente encargado de gestionar el perfil del usuario
function Profile({ cerrarSesion, usuarioId }) {

  // Estado para almacenar el nuevo nombre de usuario
  const [usuario, setUsuario] = useState("");

  // Estado para almacenar la nueva contraseña
  const [password, setPassword] = useState("");

  // Estado para mostrar mensajes al usuario
  const [mensaje, setMensaje] = useState("");

  // Función para actualizar los datos del perfil
  const actualizarPerfil = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch(
        `${API_URL}/usuarios/${usuarioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            usuario: usuario,
            password: password
          })
        }
      );

      const datos = await respuesta.json();

      setMensaje(datos.mensaje || datos.error);

    } catch (error) {
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <section className="bienvenida">

      <h2>Mi perfil</h2>

      <form onSubmit={actualizarPerfil}>

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

        <button type="submit" disabled={!usuarioId}>
          Actualizar perfil
        </button>

      </form>

      {mensaje && <p>{mensaje}</p>}

      <button type="button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>

    </section>
  );
}

// Exportamos el componente para utilizarlo en App.jsx
export default Profile;
