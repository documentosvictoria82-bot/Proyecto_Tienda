// =============================
// ELEMENTOS DEL DOM Y SEGURIDAD
// =============================

const rolActual = localStorage.getItem("role");

// Verificación de Administrador
if (!rolActual || rolActual.toLowerCase() !== 'admin') {
    alert("Acceso denegado: No tienes permisos de administrador.");
    window.location.href = "login.html";
}

const form = document.getElementById("formProducto");
const lista = document.getElementById("listaProductos");
let productoEditandoId = null;

// =============================
// 1️⃣ CARGAR PRODUCTOS
// =============================
async function cargarProductos() {
    try {
        const respuesta = await fetch("https://proyecto-tienda-rho.vercel.app/api/productos");
        const productos = await respuesta.json();

        // Limpiar contenedor antes de renderizar
        lista.innerHTML = "";

        productos.forEach(producto => {
            // Crear contenedor de la tarjeta
            const card = document.createElement("div");
            card.classList.add("producto-card");

            // Lógica de la imagen
            const BASE = "https://proyecto-tienda-rho.vercel.app";
            const imagenUrl = producto.image
                ? (producto.image.startsWith("http") ? producto.image : BASE + producto.image)
                : "https://via.placeholder.com/300";

            // Insertar contenido HTML básico
            card.innerHTML = `
                <img src="${imagenUrl}" alt="${producto.name}">
                <h4>${producto.name}</h4>
                <p>${producto.description || ""}</p>
                <p class="producto-precio">$${producto.price}</p>
                <p class="producto-stock">Stock: ${producto.stock}</p>
            `;

            // --- BOTÓN ELIMINAR ---
            const btnEliminar = document.createElement("button");
            btnEliminar.className = "btn-eliminar";
            btnEliminar.innerText = "Eliminar";
            btnEliminar.onclick = () => eliminarProducto(producto._id);

            // --- BOTÓN MODIFICAR ---
            const btnModificar = document.createElement("button");
            btnModificar.className = "btn-modificar";
            btnModificar.innerText = "Modificar";
            btnModificar.onclick = () => prepararEdicion(producto);

            // Agregar botones y tarjeta al DOM
            card.appendChild(btnEliminar);
            card.appendChild(btnModificar);
            lista.appendChild(card);
        });
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

// =============================
// 2️⃣ CREAR O ACTUALIZAR PRODUCTO
// =============================
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("stock", document.getElementById("stock").value);
    formData.append("category", document.getElementById("category").value);

    const inputImagen = document.getElementById("imagen");
    if (inputImagen.files[0]) {
        formData.append("imagen", inputImagen.files[0]); // Nota: Asegúrate que el backend espere "image" o "imagen"
    }

    try {
        let url = "https://proyecto-tienda-rho.vercel.app/api/productos";
        let metodo = "POST";

        if (productoEditandoId) {
            // Modo Edición
            url = `https://proyecto-tienda-rho.vercel.app/api/productos/update/${productoEditandoId}`;
            metodo = "PUT";
        }

        const respuesta = await fetch(url, {
            method: metodo,
            body: formData
        });

        if (respuesta.ok) {
            alert(productoEditandoId ? "Producto actualizado" : "Producto creado");
            productoEditandoId = null;
            form.reset();
            cargarProductos();
        } else {
            alert("Hubo un error al procesar la solicitud.");
        }
    } catch (error) {
        console.error("Error en la operación:", error);
    }
});

// =============================
// 3️⃣ PREPARAR EDICIÓN
// =============================
function prepararEdicion(producto) {
    productoEditandoId = producto._id;

    document.getElementById("name").value = producto.name;
    document.getElementById("description").value = producto.description;
    document.getElementById("price").value = producto.price;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("category").value = producto.category || "";

    // Opcional: Hacer scroll hacia el formulario para que el usuario sepa que puede editar
    window.scrollTo(0, 0);
}

// =============================
// 4️⃣ ELIMINAR PRODUCTO
// =============================
async function eliminarProducto(id) {
    const confirmar = confirm("¿Estás seguro de eliminar este producto?");
    if (!confirmar) return;

    try {
        const respuesta = await fetch(`https://proyecto-tienda-rho.vercel.app/api/productos/delete/${id}`, {
            method: "DELETE"
        });

        if (respuesta.ok) {
            alert("Producto eliminado con éxito");
            cargarProductos(); // Recargar la lista automáticamente
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

// ¡Ejecutar carga inicial!
cargarProductos();