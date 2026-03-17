const API = "https://proyecto-tienda-rho.vercel.app/api/productos"

// VARIABLES GLOBALES
let todosLosProductos = []
let carrito = JSON.parse(localStorage.getItem("carrito")) || []

// GENERAR ESTRELLAS
function generarEstrellas(rating){
let estrellas = ""
const redondeado = Math.round(rating)

for(let i = 1; i <= 5; i++){
if(i <= redondeado){
estrellas += "⭐"
}else{
estrellas += "☆"
}
}
return estrellas
}

function generarEstrellasInteractivo(idProducto, ratingActual){
let estrellas = ""
const rating = Math.round(ratingActual)

for(let i = 1; i <= 5; i++){
const activa = i <= rating ? "estrella-activa" : ""

estrellas += `
<span 
class="estrella ${activa}" 
onclick="calificarProducto('${idProducto}',${i})">
★
</span>
`
}
return estrellas
}

async function calificarProducto(id, valor){
try{
await fetch(`${API}/${id}/rating`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({rating:valor})
})
obtenerProductos()
}catch(error){
console.log("Error calificando producto:", error)
}
}

// OBTENER PRODUCTOS
async function obtenerProductos(){
try{
const response = await fetch(API)
const data = await response.json()

if(!Array.isArray(data)){
console.log("Error del backend:", data)
return
}

todosLosProductos = data
mostrarProductos(data)

}catch(error){
console.log("Error cargando productos:", error)
}
}

// MOSTRAR PRODUCTOS
function mostrarProductos(productos){

const contenedor = document.getElementById("productos")
if(!contenedor) return

contenedor.innerHTML=""

productos.forEach(producto=>{

const estrellas = generarEstrellas(producto.rating?.rate || 0)

// ❌ ANTES (solo backend local)
// const imagen = producto.image
// ? "https://proyecto-tienda-rho.vercel.app" + producto.image
// : "https://via.placeholder.com/300"

// ✅ AHORA (Cloudinary + compatibilidad)
const imagen = producto.image
  ? producto.image.startsWith("http")
    ? producto.image // Cloudinary
    : "https://proyecto-tienda-rho.vercel.app" + producto.image // local
  : "https://via.placeholder.com/300";

const card = document.createElement("div")
card.classList.add("col-md-4","col-lg-3")

card.innerHTML=`
<div class="card card-producto h-100">

<img src="${imagen}" class="card-img-top">

<div class="card-body d-flex flex-column">

<h5 class="card-title">${producto.name}</h5>
<p class="card-text">${producto.description || ""}</p>
<p class="precio">$${producto.price}</p>

<div class="rating">
${generarEstrellasInteractivo(producto._id, producto.rating?.rate || 0)}
</div>

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

// BUSCADOR
document.addEventListener("DOMContentLoaded", ()=>{
const formBuscar = document.getElementById("formBuscar")
const inputBuscar = document.getElementById("inputBuscar")

if(formBuscar){
formBuscar.addEventListener("submit",(e)=>{
e.preventDefault()
const texto = inputBuscar.value.toLowerCase()

const filtrados = todosLosProductos.filter(producto =>
producto.name.toLowerCase().includes(texto)
)

mostrarProductos(filtrados)
})
}

if(inputBuscar){
inputBuscar.addEventListener("input",()=>{
const texto = inputBuscar.value.toLowerCase()

const filtrados = todosLosProductos.filter(producto =>
producto.name.toLowerCase().includes(texto)
)

mostrarProductos(filtrados)
})
}
})

// FILTRO CATEGORÍA
document.addEventListener("DOMContentLoaded", () => {
const botonesCategorias = document.querySelectorAll(".categoria")

botonesCategorias.forEach(btn => {
btn.addEventListener("click", () => {

const categoria = btn.dataset.cat

if(categoria === "todos"){
mostrarProductos(todosLosProductos)
}else{
const filtrados = todosLosProductos.filter(p => 
p.category && p.category.toLowerCase() === categoria.toLowerCase()
)
mostrarProductos(filtrados)
}
})
})
})

// CARRITO
function agregarCarrito(id){
const producto = todosLosProductos.find(p=>p._id === id)
const existe = carrito.find(p=>p._id === id)

if(existe){
existe.cantidad += 1
}else{
carrito.push({...producto, cantidad:1})
}

guardarCarrito()
actualizarContador()
renderCarrito()
mostrarToast()
}

function eliminarProductoCarrito(id){
carrito = carrito.filter(p => p._id !== id)
guardarCarrito()
actualizarContador()
renderCarrito()
}

function cambiarCantidad(id,cambio){
const producto = carrito.find(p=>p._id === id)
producto.cantidad += cambio

if(producto.cantidad <= 0){
eliminarProductoCarrito(id)
return
}

guardarCarrito()
renderCarrito()
}

function actualizarContador(){
const contador = document.getElementById("contadorCarrito")
if(!contador) return

const total = carrito.reduce((acc,p)=> acc + p.cantidad,0)
contador.innerText = total
}

function toggleCarrito(){
const panel = document.getElementById("panelCarrito")
panel.classList.toggle("abierto")
renderCarrito()
}

// RENDER CARRITO
function renderCarrito(){

const lista = document.getElementById("listaCarrito")
if(!lista) return

lista.innerHTML = ""
let total = 0

if(carrito.length === 0){
lista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío 🛒</p>`
return
}

carrito.forEach(producto => {

const div = document.createElement("div")
div.classList.add("item-carrito")

// ❌ ANTES
// const imagen = `https://proyecto-tienda-rho.vercel.app${producto.image}`

// ✅ AHORA
const imagen = producto.image
  ? producto.image.startsWith("http")
    ? producto.image
    : "https://proyecto-tienda-rho.vercel.app" + producto.image
  : "https://via.placeholder.com/300";

const subtotal = producto.price * producto.cantidad
total += subtotal

div.innerHTML = `
<div class="carrito-producto">

<img src="${imagen}" class="carrito-img">

<div class="carrito-info">
<p class="carrito-nombre">${producto.name}</p>
<p class="carrito-precio">$${producto.price}</p>

<div class="controles-cantidad">
<button onclick="cambiarCantidad('${producto._id}',-1)">-</button>
<span>${producto.cantidad}</span>
<button onclick="cambiarCantidad('${producto._id}',1)">+</button>
</div>

<button onclick="eliminarProductoCarrito('${producto._id}')">
🗑 Eliminar
</button>

</div>
</div>
`

lista.appendChild(div)
})

const totalHTML = document.createElement("div")
totalHTML.innerHTML = `<hr><h5>Total: $${total}</h5>`
lista.appendChild(totalHTML)
}

// GUARDAR
function guardarCarrito(){
localStorage.setItem("carrito",JSON.stringify(carrito))
}

// TOAST
function mostrarToast(){
const toast = document.getElementById("toastCarrito")
toast.classList.add("mostrar")

setTimeout(()=>{
toast.classList.remove("mostrar")
},2000)
}

// VACIAR CARRITO
window.vaciarCarrito = function () {
    carrito = []; // vacía el array

    guardarCarrito(); // guarda vacío en localStorage
    actualizarContador(); // actualiza número
    renderCarrito(); // actualiza UI

    console.log("Carrito vaciado correctamente 🧹");
};


// INIT
obtenerProductos()
actualizarContador()
renderCarrito()