console.log("JS cargado")

const API = "http://localhost:3007/api/producto"


async function obtenerProductos(){

    try{

        const response = await fetch(API)

        const data = await response.json()

        console.log("Datos que llegan:", data)

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
<p>Rating: ${producto.rating?.rate || "Sin rating"}</p>
`

        contenedor.appendChild(card)

    })

}

obtenerProductos()