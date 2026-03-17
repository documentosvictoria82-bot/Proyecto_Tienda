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

        lista.innerHTML = "";

        productos.forEach(producto => {

            const card = document.createElement("div");

            const BASE = "https://proyecto-tienda-rho.vercel.app";
            const imagenUrl = producto.image
                ? (producto.image.startsWith("http") ? producto.image : BASE + producto.image)
                : "https://via.placeholder.com/300";

            // 🔥 GRID CORRECTO + FLEX
            card.className = "col-12 col-sm-6 col-md-4 col-lg-3 d-flex";

            card.innerHTML = `
            <div class="card h-100 shadow-sm border-0 rounded-4 w-100">

                <img src="${imagenUrl}" 
                class="card-img-top bg-light"
                style="height:200px; object-fit:contain; padding:10px;">

                <div class="card-body d-flex flex-column">

                    <h6 class="fw-bold text-truncate">
                        ${producto.name}
                    </h6>

<p class="small text-muted mb-1 descripcion">
    ${producto.description || ""}
</p>

<button class="btn btn-link p-0 ver-mas" onclick="toggleDescripcion(this)">
    Ver más
</button>

                    <p class="fw-bold text-success mb-1">
                        $${Number(producto.price).toLocaleString()}
                    </p>

                    <p class="text-muted small mb-2">
                        Stock: ${producto.stock}
                    </p>

                    <div class="mt-auto d-flex gap-2">

                        <button 
                        class="btn btn-outline-danger w-50 btn-sm"
                        onclick="eliminarProducto('${producto._id}')">
                        🗑
                        </button>

                        <button 
                        class="btn btn-dark w-50 btn-sm"
                        onclick='prepararEdicion(${JSON.stringify(producto)})'>
                        ✏️
                        </button>

                    </div>

                </div>

            </div>
            `;

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
        formData.append("imagen", inputImagen.files[0]);
    }

    try {
        let url = "https://proyecto-tienda-rho.vercel.app/api/productos";
        let metodo = "POST";

        if (productoEditandoId) {
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

    window.scrollTo({ top: 0, behavior: "smooth" });
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
            cargarProductos();
        }

    } catch (error) {
        console.error("Error al eliminar:", error);
    }
}

function toggleDescripcion(btn) {
    const descripcion = btn.previousElementSibling;

    descripcion.classList.toggle("expandida");

    if (descripcion.classList.contains("expandida")) {
        btn.textContent = "Ver menos";
    } else {
        btn.textContent = "Ver más";
    }
}

// =============================
// INICIALIZACIÓN
// =============================
cargarProductos();