console.log('app.js conectado');

const PRECIOS = {
  'Pan de yema': 0.50,
  'Pan francés': 0.40,
  'Empanada de carne': 4.50,
  'Torta de chocolate': 35.00
};

function validarNombre(nombre) {
  const limpio = nombre.trim();
  if (limpio === '') return 'Escribe tu nombre.';
  if (limpio.length < 2) return 'Tu nombre debe tener al menos 2 letras.';
  return '';
}

function validarCelular(celular) {
  const limpio = celular.replace(/\s/g, '');
  if (limpio === '') return 'Escribe tu número de celular.';
  if (!/^9\d{8}$/.test(limpio)) {
    return 'El celular debe tener 9 dígitos y empezar con 9. Ejemplo: 987 654 321.';
  }
  return '';
}

function validarProducto(producto) {
  return producto === '' ? 'Elige un producto.' : '';
}

function validarCantidad(valor) {
  const cantidad = Number(valor);
  if (valor === '' || !Number.isInteger(cantidad) || cantidad < 1) {
    return 'La cantidad debe ser un número entero mayor que 0.';
  }
  if (cantidad > 100) return 'Para más de 100 unidades, llámanos por teléfono.';
  return '';
}

function validarFecha(fecha) {
  if (fecha === '') return 'Elige la fecha de recojo.';

  const hoyObj = new Date();
  const anio = hoyObj.getFullYear();
  const mes = String(hoyObj.getMonth() + 1).padStart(2, '0');
  const dia = String(hoyObj.getDate()).padStart(2, '0');
  const hoyTexto = `${anio}-${mes}-${dia}`;

  if (fecha < hoyTexto) {
    return 'La fecha de recojo no puede ser anterior a hoy.';
  }
  return '';
}

function mostrarError(id, mensaje) {
  const campo = document.getElementById(id);
  const error = document.getElementById('error-' + id);
  error.textContent = mensaje;
  if (mensaje) {
    campo.setAttribute('aria-invalid', 'true');
  } else {
    campo.removeAttribute('aria-invalid');
  }
}

const campoIndicaciones = document.getElementById('indicaciones');
const contadorIndicaciones = document.getElementById('contador-indicaciones');

if (campoIndicaciones && contadorIndicaciones) {
  campoIndicaciones.addEventListener('input', function () {
    const restantes = 200 - campoIndicaciones.value.length;
    contadorIndicaciones.textContent = `Te quedan ${restantes} caracteres`;
  });
}

const formulario = document.querySelector('form');
const estado = document.getElementById('estado');
const contenedorVolver = document.getElementById('contenedor-volver-inicio');

const reglas = [
  ['nombre', validarNombre],
  ['celular', validarCelular],
  ['producto', validarProducto],
  ['cantidad', validarCantidad],
  ['fecha', validarFecha],
];

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  let primerError = null;

  if (contenedorVolver) {
    contenedorVolver.classList.add('oculto');
  }

  for (const [id, validar] of reglas) {
    const mensaje = validar(document.getElementById(id).value);
    mostrarError(id, mensaje);
    if (mensaje && primerError === null) primerError = id;
  }

  const acepta = document.getElementById('consentimiento').checked;
  const avisoConsentimiento = 'Necesitamos tu autorización para atender el pedido.';
  mostrarError('consentimiento', acepta ? '' : avisoConsentimiento);
  if (!acepta && primerError === null) primerError = 'consentimiento';

  if (primerError !== null) {
    estado.textContent = 'Revisa los campos marcados para continuar.';
    document.getElementById(primerError).focus();
    return;
  }

  const nombre = document.getElementById('nombre').value.trim();
  const producto = document.getElementById('producto').value;
  const cantidad = Number(document.getElementById('cantidad').value);
  const fecha = document.getElementById('fecha').value;

  const precioUnitario = PRECIOS[producto] || 0;
  const total = (precioUnitario * cantidad).toFixed(2);

  estado.textContent = `Gracias, ${nombre}. Recibimos tu pedido de ` +
    `${cantidad} × ${producto} (Total estimado: S/ ${total}) para el ${fecha}. ` +
    `Te confirmaremos por WhatsApp.`;

  if (contenedorVolver) {
    contenedorVolver.classList.remove('oculto');
  }

  formulario.reset();
  if (contadorIndicaciones) {
    contadorIndicaciones.textContent = 'Te quedan 200 caracteres';
  }
});
