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

// ================= ACCIONES CARRITO =================
function vaciarCarrito(){
    carrito = []
    guardarCarrito()
    actualizarContador()
    renderCarrito()
}

function finalizarCompra(){
    if(carrito.length === 0){
        alert("Tu carrito está vacío 🛒")
        return
    }

    const toast = document.getElementById("toastCarrito")
    toast.textContent = "Compra realizada con éxito 🎉"
    toast.classList.add("mostrar")

    setTimeout(()=>{
        toast.classList.remove("mostrar")
    },2000)

    carrito = []
    guardarCarrito()
    actualizarContador()
    renderCarrito()
}

// ================= UTILIDADES =================
function guardarCarrito(){
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function mostrarToast(){
    const toast = document.getElementById("toastCarrito")
    toast.classList.add("mostrar")

    setTimeout(()=>{
        toast.classList.remove("mostrar")
    },2000)
}

function toggleDescripcion(btn){
    const descripcion = btn.previousElementSibling
    descripcion.classList.toggle("expandida")
    btn.textContent = descripcion.classList.contains("expandida") ? "Ver menos" : "Ver más"
}

// ================= DOM READY =================
document.addEventListener("DOMContentLoaded", () => {

    // ===== TEMA =====
    const botonTema = document.getElementById("toggleTema")

    if(botonTema){
        if(localStorage.getItem("tema") === "oscuro"){
            document.body.classList.add("dark-mode")
            botonTema.textContent = "☀️"
        }

        botonTema.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode")

            if(document.body.classList.contains("dark-mode")){
                localStorage.setItem("tema","oscuro")
                botonTema.textContent = "☀️"
            }else{
                localStorage.setItem("tema","claro")
                botonTema.textContent = "🌙"
            }
        })
    }

    // ===== CATEGORÍAS =====
    const botonesCategorias = document.querySelectorAll(".categoria")

    botonesCategorias.forEach(btn => {
        btn.addEventListener("click", () => {

            botonesCategorias.forEach(b => b.classList.remove("activa"))
            btn.classList.add("activa")

            const categoria = btn.dataset.cat

            if(categoria === "todos"){
                mostrarProductos(todosLosProductos)
            } else {
                const filtrados = todosLosProductos.filter(p => 
                    p.category && p.category.toLowerCase().includes(categoria.toLowerCase())
                )
                mostrarProductos(filtrados)
            }
        })
    })

    // ===== BUSCADOR =====
    const formBuscar = document.getElementById("formBuscar")
    const inputBuscar = document.getElementById("inputBuscar")

    if(formBuscar){
        formBuscar.addEventListener("submit",(e)=>{
            e.preventDefault()
            const texto = inputBuscar.value.toLowerCase()

            const filtrados = todosLosProductos.filter(p =>
                p.name.toLowerCase().includes(texto)
            )

            mostrarProductos(filtrados)
        })
    }

    // ===== ORDEN =====
    const selectOrdenar = document.getElementById("ordenarPrecio")

    if(selectOrdenar){
        selectOrdenar.addEventListener("change",()=>{
            let productosOrdenados = [...todosLosProductos]

            if(selectOrdenar.value === "menor"){
                productosOrdenados.sort((a,b)=>a.price - b.price)
            }

            if(selectOrdenar.value === "mayor"){
                productosOrdenados.sort((a,b)=>b.price - a.price)
            }

            mostrarProductos(productosOrdenados)
        })
    }

    // ===== PRECIO =====
    const filtroPrecio = document.getElementById("filtroPrecio")
    const precioValor = document.getElementById("precioValor")

    if(filtroPrecio && precioValor){
        precioValor.innerText = filtroPrecio.value

        filtroPrecio.addEventListener("input",()=>{
            const max = Number(filtroPrecio.value)
            precioValor.innerText = max

            const filtrados = todosLosProductos.filter(p => p.price <= max)
            mostrarProductos(filtrados)
        })
    }

    // INIT
    obtenerProductos()
    actualizarContador()
    renderCarrito()
})

// ================= HACER FUNCIONES GLOBALES =================
window.vaciarCarrito = vaciarCarrito
window.finalizarCompra = finalizarCompra
window.toggleCarrito = toggleCarrito
window.cambiarCantidad = cambiarCantidad
window.eliminarProductoCarrito = eliminarProductoCarrito