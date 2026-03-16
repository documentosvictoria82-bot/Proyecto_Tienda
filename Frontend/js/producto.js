// =============================
// URL DE LA API DEL BACKEND
// =============================
const API = "https://proyecto-tienda-rho.vercel.app/api/productos"


// =============================
// VARIABLES GLOBALES
// =============================

// guardará todos los productos para filtros y buscador
let todosLosProductos = []

// carrito guardado en el navegador
let carrito = JSON.parse(localStorage.getItem("carrito")) || []

// =============================
// ⭐ GENERAR ESTRELLAS
// =============================
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

// enviar calificación al backend
await fetch(`${API}/${id}/rating`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body: JSON.stringify({rating:valor})
})

// volver a cargar productos para actualizar estrellas
obtenerProductos()

}catch(error){

console.log("Error calificando producto:", error)

}

}

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

if(!contenedor) return

contenedor.innerHTML=""

// recorremos cada producto
productos.forEach(producto=>{

// mostrar estrellas de rating
const estrellas = generarEstrellas(producto.rating?.rate || 0)

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



// =============================
// 3️⃣ BUSCADOR DE PRODUCTOS
// =============================

document.addEventListener("DOMContentLoaded", ()=>{

const formBuscar = document.getElementById("formBuscar")
const inputBuscar = document.getElementById("inputBuscar")

if(formBuscar){

formBuscar.addEventListener("submit",(e)=>{

// evitar que recargue la página
e.preventDefault()

const texto = inputBuscar.value.toLowerCase()

// filtrar productos por nombre
const filtrados = todosLosProductos.filter(producto =>
producto.name.toLowerCase().includes(texto)
)

// mostrar resultados
mostrarProductos(filtrados)

})

}


// BUSCAR MIENTRAS ESCRIBES
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



// =============================
// 4️⃣ FILTRO POR CATEGORÍAS
// =============================

document.addEventListener("DOMContentLoaded", () => {

const botonesCategorias = document.querySelectorAll(".categoria")

botonesCategorias.forEach(btn => {

btn.addEventListener("click", () => {

const categoria = btn.dataset.cat

// mostrar todos
if(categoria === "todos"){

mostrarProductos(todosLosProductos)

}else{

// filtrar por categoría (ignora mayúsculas)
const filtrados = todosLosProductos.filter(p => 
p.category && p.category.toLowerCase() === categoria.toLowerCase()
)

mostrarProductos(filtrados)

}

})

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
// 7️⃣ CAMBIAR CANTIDAD
// =============================
function cambiarCantidad(id,cambio){

const producto = carrito.find(p=>p._id === id)

// aumentar o disminuir
producto.cantidad += cambio

//Canitidad carrito
if(producto.cantidad <= 0){

eliminarProductoCarrito(id)
return

}

guardarCarrito()
renderCarrito()

}



// =============================
// 8️⃣ ACTUALIZAR CONTADOR
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
// 🔟 RENDER CARRITO
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
? `http://localhost:3007${producto.image}`
: "https://via.placeholder.com/300";


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
// 11️⃣ GUARDAR CARRITO
// =============================
function guardarCarrito(){

localStorage.setItem("carrito",JSON.stringify(carrito))

}



// =============================
// TOAST
// =============================
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



// =============================
// ORDENAR POR PRECIO
// =============================
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



// =============================
// FILTRO PRECIO
// =============================
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
// 12️⃣ INICIAR APP
// =============================

// cargar productos
obtenerProductos()

// actualizar contador
actualizarContador()

// mostrar carrito si hay productos guardados
renderCarrito()


// CONTROL DE SESIÓN (LOGIN / LOGOUT)

document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los elementos del navbar
    const linkLogin = document.getElementById("linkLogin");
    const linkRegistro = document.getElementById("linkRegistro");
    const btnCerrarSesion = document.getElementById("btnCerrarSesion");

    // Revisamos si existe el token en el localStorage
    const token = localStorage.getItem("token");

    if (token) {
        // SI HAY SESIÓN:
        // Ocultamos los enlaces de Iniciar Sesión y Registro
        if (linkLogin) linkLogin.classList.add("d-none");
        if (linkRegistro) linkRegistro.classList.add("d-none");
        
        // Mostramos el botón de Cerrar Sesión
        if (btnCerrarSesion) btnCerrarSesion.classList.remove("d-none");
    }

    // Lógica para el botón de Cerrar Sesión
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener("click", () => {
            // 1. Borramos los datos de autenticación
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            
            // Opcional: Borrar el carrito al cerrar sesión si lo deseas
            // localStorage.removeItem("carrito");

            alert("Sesión cerrada correctamente. ¡Vuelve pronto!");

            // 2. Redirigimos al inicio y recargamos la página
            window.location.href = "index.html"; 
        });
    }
});