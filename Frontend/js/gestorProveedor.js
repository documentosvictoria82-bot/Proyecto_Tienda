const rolActual = localStorage.getItem("role");

if (rolActual !== 'admin') {
    alert("Acceso denegado: No tienes permisos de administrador.");
    window.location.href = "login.html"; // Lo regresamos al login
}


const form = document.getElementById("formProducto");
const lista = document.getElementById("listaProductos");
let productoEditandoId = null; // Esta variable "recuerda" si estamos editando



// 1. CARGAR PRODUCTOS AL ABRIR LA PÁGINA
async function cargarProductos() {
    const respuesta = await fetch("http://localhost:3007/api/producto");
    const productos = await respuesta.json();
    lista.innerHTML = ""; 

    productos.forEach(producto => {
        const card = document.createElement("div");
        card.innerHTML = `<h3>${producto.name}</h3><p>Precio: $${producto.price}</p>`;
        
        // Botones de acción
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn-eliminar";
        btnEliminar.innerText = "Eliminar";
        btnEliminar.onclick = () => eliminarProducto(producto._id);
        
        const btnModificar = document.createElement("button");
        btnModificar.className = "btn-modificar";
        btnModificar.innerText = "Modificar";
        btnModificar.onclick = () => prepararEdicion(producto);

        card.appendChild(btnEliminar);
        card.appendChild(btnModificar);
        lista.appendChild(card);
    });
}

// 2. CREAR O ACTUALIZAR (El botón Guardar)
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value
    };

    if (productoEditandoId) {
        // MODO MODIFICAR
        await fetch(`http://localhost:3007/api/producto/update/${productoEditandoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
    } else {
        // MODO CREAR
        await fetch("http://localhost:3007/api/producto/crear", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
    }
    location.reload();
});

// 3. PREPARAR PARA MODIFICAR
function prepararEdicion(producto) {
    productoEditandoId = producto._id;
    document.getElementById("name").value = producto.name;
    document.getElementById("description").value = producto.description;
    document.getElementById("price").value = producto.price;
    document.getElementById("stock").value = producto.stock;
}

// 4. ELIMINAR
async function eliminarProducto(id) {
    if(confirm("¿Estás seguro?")) {
        await fetch(`http://localhost:3007/api/producto/delete/${id}`, { method: "DELETE" });
        location.reload();
    }
}

// ¡EJECUTAR AL INICIO!
cargarProductos();