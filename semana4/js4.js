// Lista de los precios de los productos
const precios = {
    'pan farnces': 0.30,
    'pan de yema': 0.50,
    'Chancay': 0.60,
    'torta de chocolate': 45.00,
}

//Recuperar los cobjetos del HTML
const selector = document.querySelector('#producto')
const precio = document.querySelector('#precio')

// Implementacion del evento 'change'
selector.addEventListener('change', (evento) => {
    const nombre = evento.target.value
    if (nombre === '') {
        precio.textContent =  'elije un producto.'
        return
    }
    precio.textContent = `${nombre}: S/. ${precios[nombre].toFixed(2)} por unidad`
})