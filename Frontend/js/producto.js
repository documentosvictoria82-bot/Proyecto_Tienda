const API = "http://localhost:3000/api/producto"

async function obtenerProductos(){

    try{

        const response = await fetch(API)

        const data = await response.json()

        mostrarProductos(data)

    }catch(error){

        console.log("Error:", error)

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
        `

        contenedor.appendChild(card)

    })

}

obtenerProductos()