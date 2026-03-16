// =============================
// URL DE LA API DEL BACKEND
// =============================
const API = "http://localhost:3007/api/producto"


// =============================
// VARIABLES GLOBALES
// =============================

// guardará todos los productos para filtros y buscador
let todosLosProductos = []

// carrito guardado en el navegador
let carrito = JSON.parse(localStorage.getItem("carrito")) || []



// =============================
// 1️⃣ OBTENER PRODUCTOS DESDE EL BACKEND
// =============================
async function obtenerProductos(){

try{

// llamamos la API
const response = await fetch(API)

// convertimos la respuesta a JSON
const productos = await response.json()

// guardamos todos los productos
todosLosProductos = productos

// mostramos los productos en pantalla
mostrarProductos(productos)

}catch(error){

console.log("Error cargando productos:", error)

}

}



// =============================
// 2️⃣ MOSTRAR PRODUCTOS EN LA TIENDA
// =============================
function mostrarProductos(productos){

const contenedor = document.getElementById("productos")

// limpiamos el contenedor
contenedor.innerHTML=""

// recorremos cada producto
productos.forEach(producto=>{

// mostrar estrellas de rating
const estrellas = "⭐".repeat(Math.round(producto.rating?.rate || 0))

// obtener imagen
const imagen = producto.image
? "http://localhost:3007" + producto.image
: "https://via.placeholder.com/300"

// crear tarjeta del producto
const card = document.createElement("div")

card.classList.add("col-md-4","col-lg-3")

card.innerHTML=`

<div class="card card-producto h-100">

<img src="${imagen}" class="card-img-top">

<div class="card-body d-flex flex-column">

<h5 class="card-title">${producto.name}</h5>

<p class="card-text">${producto.description || ""}</p>

<p class="precio">$${producto.price}</p>

<p class="rating">${estrellas}</p>

<p class="stock">Stock: ${producto.stock}</p>

<button 
class="btn btn-dark btn-comprar mt-auto"
onclick="agregarCarrito('${producto._id}')">

Agregar al carrito

</button>

</div>

</div>

`

contenedor.appendChild(card)

})

}



// =============================
// 3️⃣ BUSCADOR DE PRODUCTOS
// =============================

const formBuscar = document.getElementById("formBuscar")

if(formBuscar){

formBuscar.addEventListener("submit",(e)=>{

// evitar que recargue la página
e.preventDefault()

// texto buscado
const texto = document
.getElementById("inputBuscar")
.value
.toLowerCase()

// filtrar productos por nombre
const filtrados = todosLosProductos.filter(producto =>
producto.name.toLowerCase().includes(texto)
)

// mostrar resultados
mostrarProductos(filtrados)

})

}



// =============================
// 4️⃣ FILTRO POR CATEGORÍAS
// =============================

const botonesCategorias = document.querySelectorAll(".categoria")

botonesCategorias.forEach(btn=>{

btn.addEventListener("click",()=>{

const categoria = btn.dataset.cat

// mostrar todos
if(categoria === "todos"){

mostrarProductos(todosLosProductos)

}else{

// filtrar por categoría
const filtrados = todosLosProductos.filter(p=>p.category === categoria)

mostrarProductos(filtrados)

}

})

})



// =============================
// 5️⃣ AGREGAR PRODUCTO AL CARRITO
// =============================
function agregarCarrito(id){

// buscar producto en la lista
const producto = todosLosProductos.find(p=>p._id === id)

// verificar si ya existe en carrito
const existe = carrito.find(p=>p._id === id)

if(existe){

// aumentar cantidad
existe.cantidad += 1

}else{

// agregar nuevo producto al carrito
carrito.push({...producto, cantidad:1})

}

// guardar carrito
guardarCarrito()

// actualizar contador
actualizarContador()

// actualizar panel carrito
renderCarrito()

//Notificion cuando se agrega al carrito
mostrarToast()
}



// =============================
// 6️⃣ ELIMINAR PRODUCTO DEL CARRITO
// =============================
function eliminarProductoCarrito(id){

// quitamos el producto del carrito
carrito = carrito.filter(p => p._id !== id)

// guardamos cambios
guardarCarrito()

// actualizamos contador
actualizarContador()

// renderizamos carrito nuevamente
renderCarrito()

}



// =============================
// 7️⃣ CAMBIAR CANTIDAD DEL PRODUCTO
// =============================
function cambiarCantidad(id,cambio){

const producto = carrito.find(p=>p._id === id)

// aumentar o disminuir
producto.cantidad += cambio

// si llega a 0 se elimina
if(producto.cantidad <= 0){

eliminarProductoCarrito(id)
return

}

guardarCarrito()
renderCarrito()

}



// =============================
// 8️⃣ ACTUALIZAR CONTADOR DEL CARRITO
// =============================
function actualizarContador(){

const contador = document.getElementById("contadorCarrito")

if(!contador) return

// sumar cantidades
const total = carrito.reduce((acc,p)=> acc + p.cantidad,0)

contador.innerText = total

}



// =============================
// 9️⃣ ABRIR / CERRAR CARRITO
// =============================
function toggleCarrito(){

const panel = document.getElementById("panelCarrito")

panel.classList.toggle("abierto")

renderCarrito()

}


// =============================
// 🔟 MOSTRAR PRODUCTOS EN CARRITO
// =============================
function renderCarrito(){

const lista = document.getElementById("listaCarrito")

if(!lista) return

lista.innerHTML = ""

let total = 0

// Si carrito vacío
if(carrito.length === 0){

lista.innerHTML = `
<p class="carrito-vacio">
Tu carrito está vacío 🛒
</p>
`

return
}

carrito.forEach(producto => {

const div = document.createElement("div")

div.classList.add("item-carrito")

const imagen = producto.image
? "http://localhost:3007" + producto.image
: "https://via.placeholder.com/80"

// subtotal
const subtotal = producto.price * producto.cantidad

// total del carrito
total += subtotal

div.innerHTML = `

<div class="carrito-producto">

<img src="${imagen}" class="carrito-img">

<div class="carrito-info">

<p class="carrito-nombre">${producto.name}</p>

<p class="carrito-precio">$${producto.price}</p>

<div class="controles-cantidad">

<button 
class="btn-cantidad"
onclick="cambiarCantidad('${producto._id}',-1)">
-
</button>

<span class="cantidad-producto">
${producto.cantidad}
</span>

<button 
class="btn-cantidad"
onclick="cambiarCantidad('${producto._id}',1)">
+
</button>

</div>

<button 
class="btn-eliminar"
onclick="eliminarProductoCarrito('${producto._id}')">

🗑 Eliminar

</button>

</div>

</div>

`

lista.appendChild(div)

})


// TOTAL
const totalHTML = document.createElement("div")

totalHTML.innerHTML = `
<hr>
<h5 class="total-carrito">Total: $${total}</h5>
`

lista.appendChild(totalHTML)

}


// =============================
// 11️⃣ GUARDAR CARRITO EN LOCALSTORAGE
// =============================
function guardarCarrito(){

localStorage.setItem("carrito",JSON.stringify(carrito))

}

function mostrarToast(){

const toast = document.getElementById("toastCarrito")

toast.classList.add("mostrar")

setTimeout(()=>{

toast.classList.remove("mostrar")

},2000)

}

// =============================
// VACIAR CARRITO
// =============================
function vaciarCarrito(){

// confirmar antes de eliminar
const confirmar = confirm("¿Quieres vaciar el carrito?")

if(!confirmar) return

// limpiar carrito
carrito = []

// guardar cambios
guardarCarrito()

// actualizar interfaz
actualizarContador()
renderCarrito()

}

const ordenarPrecio = document.getElementById("ordenarPrecio")

if(ordenarPrecio){

ordenarPrecio.addEventListener("change",()=>{

let productosOrdenados = [...todosLosProductos]

if(ordenarPrecio.value === "menor"){

productosOrdenados.sort((a,b)=>a.price-b.price)

}

if(ordenarPrecio.value === "mayor"){

productosOrdenados.sort((a,b)=>b.price-a.price)

}

mostrarProductos(productosOrdenados)

})

}

//Filtrar por precio

const filtroPrecio = document.getElementById("filtroPrecio")

if(filtroPrecio){

filtroPrecio.addEventListener("input",()=>{

const precioMax = filtroPrecio.value

document.getElementById("precioValor").innerText = precioMax

const filtrados = todosLosProductos.filter(p=>p.price <= precioMax)

mostrarProductos(filtrados)

})

}


// =============================
// 12️⃣ INICIAR APLICACIÓN
// =============================

// cargar productos
obtenerProductos()

// actualizar contador
actualizarContador()

// mostrar carrito si hay productos guardados
renderCarrito()