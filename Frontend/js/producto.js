const API = "http://localhost:3007/api/productos"

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

contenedor.innerHTML=""

productos.forEach(producto=>{

const estrellas = "⭐".repeat(Math.round(producto.rating?.rate || 0))

const card = document.createElement("div")

card.classList.add("col-md-4","col-lg-3")

card.innerHTML=`

<div class="card card-producto">

<img src="${producto.images?.[0] || 'https://via.placeholder.com/300'}" class="card-img-top">

<div class="card-body">

<h5 class="card-title">${producto.name}</h5>

<p class="card-text">${producto.description}</p>

<p class="precio">$${producto.price}</p>

<p class="rating">${estrellas}</p>

<p class="text-muted">Stock: ${producto.stock}</p>

<button class="btn btn-dark btn-comprar">Agregar al carrito</button>

</div>

</div>

`

contenedor.appendChild(card)

})

}

obtenerProductos()