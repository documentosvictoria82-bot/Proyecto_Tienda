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

    alert("🎉 Gracias por tu compra")

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
    if(!toast) return

    toast.textContent = "🛒 Producto agregado al carrito"
    toast.classList.add("mostrar")

    setTimeout(()=>{
        toast.classList.remove("mostrar")
    },2000)
}

function toggleDescripcion(btn){
    const descripcion = btn.previousElementSibling
    descripcion.classList.toggle("expandida")
    btn.textContent = descripcion.classList.contains("expandida") 
        ? "Ver menos" 
        : "Ver más"
}

// ================= GLOBALES (CLAVE PARA QUE FUNCIONE TODO) =================
window.agregarCarrito = agregarCarrito
window.vaciarCarrito = vaciarCarrito
window.finalizarCompra = finalizarCompra
window.toggleCarrito = toggleCarrito
window.cambiarCantidad = cambiarCantidad
window.eliminarProductoCarrito = eliminarProductoCarrito
window.toggleDescripcion = toggleDescripcion
window.calificarProducto = calificarProducto