import React, { useState } from "react";

// Componente encargado de crear nuevos temas en el foro
function CreateTopic() {

  // Variables de estado para almacenar la información del formulario
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [usuario, setUsuario] = useState("");

  // Variables para mostrar el resultado de la operación
  const [mensaje, setMensaje] = useState("");
  const [idTema, setIdTema] = useState("");

  // Función que se ejecuta cuando el usuario publica un nuevo tema
  const publicarTema = async (e) => {

    // Evita que el formulario recargue la página
    e.preventDefault();

    // Limpia los mensajes y el ID de una prueba anterior
    setMensaje("");
    setIdTema("");

    try {

      // Envía la información del nuevo tema al Back-End mediante una petición POST
      const respuesta = await fetch(
        "https://comunika-api.onrender.com/temas",
        {
          method: "POST",

          // Se indica que la información enviada está en formato JSON
          headers: {
            "Content-Type": "application/json",
          },

          // Se envían los datos del tema al servicio API
          body: JSON.stringify({
            titulo,
            contenido,
            usuario,
          }),
        }
      );

      // Convierte la respuesta del servidor de JSON a un objeto JavaScript
      const datos = await respuesta.json();

      // Verifica si el servidor creó correctamente el tema
      if (respuesta.ok) {

        // Muestra el mensaje enviado por el Back-End
        setMensaje(
          datos.mensaje || "Tema creado correctamente"
        );

        // Guarda el ID generado por MongoDB y devuelto por el Back-End
        setIdTema(datos.id || "");

        // Limpia los campos del título y contenido después de publicar
        setTitulo("");
        setContenido("");

      } else {

        // Muestra el mensaje de error enviado por el servidor
        setMensaje(
          datos.error || "No se pudo crear el tema"
        );
      }

    } catch (error) {

      // Se muestra este mensaje cuando existe un problema de conexión
      setMensaje("Error de conexión con el servidor");
    }
  };

  return (
    <section>

      {/* Título del módulo de creación de temas */}
      <h2>Crear nuevo tema</h2>

      {/* Formulario utilizado para registrar un nuevo tema */}
      <form onSubmit={publicarTema}>

        {/* Campo para ingresar el título del tema */}
        <label>
          Título
          <input
            type="text"
            placeholder="Escriba el título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </label>

        {/* Campo para ingresar el contenido del tema */}
        <label>
          Contenido
          <textarea
            placeholder="Escriba el contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            required
          />
        </label>

        {/* Campo para indicar el usuario que crea el tema */}
        <label>
          Usuario
          <input
            type="text"
            placeholder="Escriba su usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </label>

        {/* Botón que ejecuta la función para crear el tema */}
        <button type="submit">
          Publicar tema
        </button>

      </form>

      {/* Muestra el mensaje de respuesta del Back-End */}
      {mensaje && (
        <p>
          <strong>{mensaje}</strong>
        </p>
      )}

      {/* Muestra el ID generado automáticamente por MongoDB */}
      {idTema && (
        <p>
          <strong>ID del tema generado por MongoDB:</strong>{" "}
          {idTema}
        </p>
      )}

    </section>
  );
}

// Exporta el componente para poder utilizarlo desde App.jsx
export default CreateTopic;