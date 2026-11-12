// Estado del pedido y utilidades
const pedido = []; // cada ítem: { nombre, precio, cantidad }

const lista = document.getElementById('lista-pedido');
const totalTexto = document.getElementById('total');
const mensajeVacio = document.getElementById('pedido-vacio');
const aviso = document.getElementById('aviso');
const tituloPedido = document.getElementById('titulo-pedido');

function soles(monto) {
  return 'S/ ' + monto.toFixed(2);
}

function calcularTotal() {
  return pedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

function anunciar(mensaje) {
  aviso.textContent = mensaje;
}

function render() {
  lista.replaceChildren();

  for (const item of pedido) {
    const li = document.createElement('li');

    const texto = document.createElement('span');
    const subtotal = soles(item.precio * item.cantidad);
    texto.textContent = `${item.cantidad} × ${item.nombre} · ${subtotal}`;

    const quitarBtn = document.createElement('button');
    quitarBtn.type = 'button';
    quitarBtn.className = 'btn-quitar';
    quitarBtn.dataset.nombre = item.nombre;
    quitarBtn.textContent = 'Quitar';
    quitarBtn.setAttribute('aria-label', `Quitar ${item.nombre}`);

    li.append(texto, quitarBtn);
    lista.append(li);
  }

  totalTexto.textContent = soles(calcularTotal());
  mensajeVacio.hidden = pedido.length > 0;
}

function agregar(nombre, precio) {
  const existente = pedido.find((item) => item.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    pedido.push({ nombre, precio, cantidad: 1 });
  }
  render();
  anunciar(`Se añadió ${nombre}. Total: ${soles(calcularTotal())}.`);
}

function quitar(nombre) {
  const posicion = pedido.findIndex((item) => item.nombre === nombre);
  if (posicion === -1) return;
  pedido.splice(posicion, 1);
  render();
  anunciar(`Se quitó ${nombre}. Total: ${soles(calcularTotal())}.`);
  tituloPedido.focus();
}

const catalogo = document.querySelector('.catalogo');
if (catalogo) {
  catalogo.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-anadir');
    if (!boton) return;
    const producto = boton.closest('.producto');
    agregar(producto.dataset.nombre, Number(producto.dataset.precio));
  });
}

if (lista) {
  lista.addEventListener('click', (evento) => {
    const boton = evento.target.closest('.btn-quitar');
    if (!boton) return;
    quitar(boton.dataset.nombre);
  });
  render();
}
