// Importamos useState para manejar los datos del formulario
import { useState } from "react";

// Componente para crear una respuesta a un tema existente
function CreateResponse() {

  // Estado para almacenar el ID del tema al que se responderá
  const [temaId, setTemaId] = useState("");

  // Estado para almacenar el contenido de la respuesta
  const [contenido, setContenido] = useState("");

  // Estado para almacenar el usuario que realiza la respuesta
  const [usuario, setUsuario] = useState("");

  // Estado para mostrar mensajes al usuario
  const [mensaje, setMensaje] = useState("");

  // Función que se ejecuta al enviar el formulario
  const crearRespuesta = async (e) => {

    // Evitamos que el navegador recargue la página
    e.preventDefault();

    try {

      // Enviamos la información al Back-End mediante una solicitud POST
      const respuesta = await fetch(
        `https://comunika-api.onrender.com/temas/${temaId}/respuestas`,
        {
          method: "POST",

          // Indicamos que estamos enviando información en formato JSON
          headers: {
            "Content-Type": "application/json",
          },

          // Convertimos los datos del formulario a formato JSON
          body: JSON.stringify({
            contenido: contenido,
            usuario: usuario,
          }),
        }
      );

      // Convertimos la respuesta del servidor a JSON
      const datos = await respuesta.json();

      // Verificamos si la operación fue exitosa
      if (respuesta.ok) {

        // Mostramos el mensaje enviado por el servidor
        setMensaje(datos.mensaje);

        // Limpiamos el campo de contenido después de crear la respuesta
        setContenido("");

      } else {

        // Mostramos el mensaje de error enviado por el servidor
        setMensaje(datos.error);
      }

    } catch (error) {

      // Mostramos un mensaje si no existe comunicación con el servidor
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  // Construimos la interfaz del componente
  return (
    <section className="bienvenida">

      {/* Título de la funcionalidad */}
      <h2>Responder a una publicación</h2>

      {/* Formulario para crear la respuesta */}
      <form onSubmit={crearRespuesta}>

        {/* Campo para indicar el ID del tema */}
        <label>ID del tema</label>

        <input
          type="text"
          placeholder="Ingrese el ID del tema"
          value={temaId}
          onChange={(e) => setTemaId(e.target.value)}
          required
        />

        {/* Campo para escribir la respuesta */}
        <label>Contenido</label>

        <textarea
          placeholder="Escriba su respuesta"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          required
        />

        {/* Campo para indicar el usuario */}
        <label>Usuario</label>

        <input
          type="text"
          placeholder="Ingrese su usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        {/* Botón para enviar la respuesta */}
        <button type="submit">
          Publicar respuesta
        </button>

      </form>

      {/* Mostramos el resultado de la operación */}
      {mensaje && <p>{mensaje}</p>}

    </section>
  );
}

// Exportamos el componente para utilizarlo en App.jsx
export default CreateResponse;