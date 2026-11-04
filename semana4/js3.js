// Recuperar los conrtoles HTML
const noats = document.querySelector("#notas")
const contador = document.querySelector("#contador")

// Implementacion el evento para la textarea
noats.addEventListener('input', (evento) => {
    const largo = evento.target.value.length
    contador.textContent = `${largo} / 200`;
    // Abrir la consola (F12) para ver los datos del evento
    console.log(evento.type, evento.target.id, largo)
})