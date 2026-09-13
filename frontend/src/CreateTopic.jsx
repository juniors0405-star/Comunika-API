import { useState } from "react";

function CreateTopic() {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");

  const crearTema = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await fetch("https://comunika-api.onrender.com/temas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          contenido,
          usuario,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setMensaje(datos.mensaje);
        setTitulo("");
        setContenido("");
        setUsuario("");
      } else {
        setMensaje(datos.error);
      }
    } catch (error) {
      setMensaje("No se pudo conectar con el servidor");
    }
  };

  return (
    <section>
      <h2>Crear nuevo tema</h2>

      <form onSubmit={crearTema}>
        <label>Título</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Escriba el título"
        />

        <label>Contenido</label>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escriba el contenido"
        />

        <label>Usuario</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          placeholder="Escriba su usuario"
        />

        <button type="submit">Publicar tema</button>
      </form>

      {mensaje && <p>{mensaje}</p>}
    </section>
  );
}

export default CreateTopic;