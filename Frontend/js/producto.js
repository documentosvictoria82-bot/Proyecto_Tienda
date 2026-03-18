const API = "https://proyecto-tienda-rho.vercel.app/api/productos"

// VARIABLES GLOBALES
let todosLosProductos = []
let carrito = JSON.parse(localStorage.getItem("carrito")) || []

// ================= ESTRELLAS =================
function generarEstrellas(rating){
    let estrellas = ""
    const redondeado = Math.round(rating)

    for(let i = 1; i <= 5; i++){
        estrellas += i <= redondeado ? "⭐" : "☆"
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
        </span>`
    }
    return estrellas
}

async function calificarProducto(id, valor){
    try{
        await fetch(`${API}/${id}/rating`,{
            method:"POST",
            headers:{ "Content-Type":"application/json" },
            body: JSON.stringify({rating:valor})
        })
        obtenerProductos()
    }catch(error){
        console.log("Error calificando producto:", error)
    }
}

// ================= PRODUCTOS =================
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

function mostrarProductos(productos){
    const contenedor = document.getElementById("productos")
    if(!contenedor) return

    contenedor.innerHTML = ""

    productos.forEach(producto => {

        const imagen = producto.image
        ? producto.image.startsWith("http")
            ? producto.image
            : "https://proyecto-tienda-rho.vercel.app" + producto.image
        : "https://via.placeholder.com/300"

        const card = document.createElement("div")
        card.classList.add("col-md-4","col-lg-3")

        card.innerHTML = `
        <div class="card card-producto h-100">
            <img src="${imagen}" class="card-img-top">

            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${producto.name}</h5>

                <p class="card-text descripcion">
                    ${producto.description || ""}
                </p>

                <button class="btn btn-link p-0 ver-mas" onclick="toggleDescripcion(this)">
                    Ver más
                </button>

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

// ================= CARRITO =================
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
    actualizarContador()
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

        const imagen = producto.image
        ? producto.image.startsWith("http")
            ? producto.image
            : "https://proyecto-tienda-rho.vercel.app" + producto.image
        : "https://via.placeholder.com/300"

        const subtotal = producto.price * producto.cantidad
        total += subtotal

        const div = document.createElement("div")
        div.classList.add("item-carrito")

        div.innerHTML = `
        <div class="carrito-producto">
            <img src="${imagen}" class="carrito-img">

            <div class="carrito-info">
                <p>${producto.name}</p>
                <p>$${producto.price}</p>

                <div>
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

    lista.innerHTML += `<hr><h5>Total: $${total}</h5>`
}

// ================= 🔐 SESIÓN =================
function cerrarSesion(){
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("usuario")

    alert("Sesión cerrada")
    window.location.href = "/index.html"
}

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token")

    const btnCerrarSesion = document.getElementById("btnCerrarSesion")
    const linkLogin = document.querySelector('a[href="./pages/login.html"]')
    const linkRegistro = document.querySelector('a[href="./pages/registro.html"]')

if(token){
    btnCerrarSesion.classList.remove("d-none")

    if(linkLogin) linkLogin.style.display = "none"
    if(linkRegistro) linkRegistro.style.display = "none"
}

    // 🔥 CONEXIÓN DEL BOTÓN (LO IMPORTANTE)
    if(btnCerrarSesion){
        btnCerrarSesion.addEventListener("click", cerrarSesion)
    }

    obtenerProductos()
    actualizarContador()
    renderCarrito()
})