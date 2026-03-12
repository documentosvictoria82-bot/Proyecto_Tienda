//const url = new URLSearchParams(window.location.search)
//console.log(url.getAll('idproducto'));

const detalleProducto = document.querySelector('#detalleProducto')

const getProduct = async () => {
    const url = new URLSearchParams(window.location.search)
    const id = url.get('idproducto')
        try {
        let response = await fetch(`http://localhost:3007/api/producto/${id}`)
        let producto = await response.json()
        if(producto) return producto
    } catch (error) {
        alert('No existe el producto'+ err)
    }
       
}

const renderDetail = (producto) => {
    const {name, price, description, category, image} = producto
detalleProducto.innerHTML = `
       <div class="container-detalle">
    <div class="imagen-producto">
        <img src="${image}" alt="${name}">
    </div>
    <div class="info-producto">
        <span class="categoria">${category}</span>
        <h1>${name}</h1>
        <p class="descripcion">${description}</p>
        <div class="precio-seccion">
            <span class="precio">$${price}</span>
            <button class="btn-agregar">Añadir al carrito</button>
        </div>
    </div>
</div>
`
}
document.addEventListener('DOMContentLoaded', async () => {
    let producto = await getProduct()
    console.log(producto);
    renderDetail(producto)
})


