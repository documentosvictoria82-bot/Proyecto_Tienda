const API = "http://localhost:3007/api/producto"

async function obtenerProductos(){

    try{
        const response = await fetch(API)
        const productos = await response.json()
        mostrarProductos(productos)

    }catch(error){
        console.log(error)
    }

}

function mostrarProductos(productos){
    const contenedor = document.getElementById("productos")
    contenedor.innerHTML = ""
    productos.forEach(producto => {

        const card = document.createElement("div")

        card.innerHTML = `
        <h3>${producto.name}</h3>
        <p>${producto.description}</p>
        <p>Precio: $${producto.price}</p>
        <p>Stock: ${producto.stock}</p>
        `
        contenedor.appendChild(card)

    })

}

obtenerProductos()