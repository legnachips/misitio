const pedido = []; 

const lista = document.getElementById('lista-pedido');
const totalTexto = document.getElementById('total');
const mensajeVacio = document.getElementById('pedido-vacio');
const aviso = document.getElementById('aviso');
const tituloPedido = document.getElementById('titulo-pedido');
const btnVaciar = document.getElementById('btn-vaciar');
const cajaSugerencia = document.getElementById('sugerencia-honesta');
const btnAnadirMantequilla = document.getElementById('btn-anadir-mantequilla');

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
    texto.className = 'item-texto';
    const subtotal = soles(item.precio * item.cantidad);
    texto.textContent = `${item.cantidad} × ${item.nombre} · ${subtotal}`;

    const controles = document.createElement('div');
    controles.className = 'controles-item';

    const restarBtn = document.createElement('button');
    restarBtn.type = 'button';
    restarBtn.className = 'btn-cantidad btn-restar';
    restarBtn.dataset.nombre = item.nombre;
    restarBtn.textContent = '−';
    restarBtn.setAttribute('aria-label', `Restar un ${item.nombre}`);

    const sumarBtn = document.createElement('button');
    sumarBtn.type = 'button';
    sumarBtn.className = 'btn-cantidad btn-sumar';
    sumarBtn.dataset.nombre = item.nombre;
    sumarBtn.textContent = '+';
    sumarBtn.setAttribute('aria-label', `Sumar un ${item.nombre}`);

    const quitarBtn = document.createElement('button');
    quitarBtn.type = 'button';
    quitarBtn.className = 'btn-quitar';
    quitarBtn.dataset.nombre = item.nombre;
    quitarBtn.textContent = 'Quitar';
    quitarBtn.setAttribute('aria-label', `Quitar ${item.nombre}`);

    controles.append(restarBtn, sumarBtn, quitarBtn);
    li.append(texto, controles);
    lista.append(li);
  }

  totalTexto.textContent = soles(calcularTotal());
  mensajeVacio.hidden = pedido.length > 0;
  btnVaciar.hidden = pedido.length === 0;

  const hayPan = pedido.some((item) => item.nombre.toLowerCase().includes('pan'));
  const hayMantequilla = pedido.some((item) => item.nombre === 'Mantequilla artesanal');
  cajaSugerencia.hidden = !(hayPan && !hayMantequilla);
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

function cambiarCantidad(nombre, delta) {
  const posicion = pedido.findIndex((item) => item.nombre === nombre);
  if (posicion === -1) return;

  pedido[posicion].cantidad += delta;

  if (pedido[posicion].cantidad <= 0) {
    pedido.splice(posicion, 1);
    render();
    anunciar(`Se quitó ${nombre}. Total: ${soles(calcularTotal())}.`);
    tituloPedido.focus();
  } else {
    const nuevaCant = pedido[posicion].cantidad;
    render();
    anunciar(`Cantidad de ${nombre}: ${nuevaCant}. Total: ${soles(calcularTotal())}.`);
  }
}

function quitar(nombre) {
  const posicion = pedido.findIndex((item) => item.nombre === nombre);
  if (posicion === -1) return;
  pedido.splice(posicion, 1);
  render();
  anunciar(`Se quitó ${nombre}. Total: ${soles(calcularTotal())}.`);
  tituloPedido.focus(); 
}

document.querySelector('.catalogo').addEventListener('click', (evento) => {
  const boton = evento.target.closest('.btn-anadir');
  if (!boton) return;
  const producto = boton.closest('.producto');
  agregar(producto.dataset.nombre, Number(producto.dataset.precio));
});

lista.addEventListener('click', (evento) => {
  const btnQuitar = evento.target.closest('.btn-quitar');
  if (btnQuitar) {
    quitar(btnQuitar.dataset.nombre);
    return;
  }

  const btnSumar = evento.target.closest('.btn-sumar');
  if (btnSumar) {
    cambiarCantidad(btnSumar.dataset.nombre, 1);
    return;
  }

  const btnRestar = evento.target.closest('.btn-restar');
  if (btnRestar) {
    cambiarCantidad(btnRestar.dataset.nombre, -1);
  }
});

btnVaciar.addEventListener('click', () => {
  if (pedido.length === 0) return;
  const seguro = confirm('¿Estás seguro de que deseas vaciar todo tu pedido?');
  if (!seguro) return;

  pedido.length = 0;
  render();
  anunciar('Se vació todo el pedido. Total: S/ 0.00.');
  tituloPedido.focus();
});

btnAnadirMantequilla.addEventListener('click', () => {
  agregar('Mantequilla artesanal', 2.50);
});

render();
