// =============================
// ELEMENTOS DEL DOM
// =============================

const rolActual = localStorage.getItem("role");

console.log("El rol detectado es:", rolActual); // Esto te ayudará a ver el error en la consola

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
async function cargarProductos(){

try{

const respuesta = await fetch("https://proyecto-tienda-rho.vercel.app/api/productos");
const productos = await respuesta.json();

// limpiar contenedor
lista.innerHTML="";

// recorrer productos
productos.forEach(producto=>{

// crear tarjeta
const card = document.createElement("div");
card.classList.add("producto-card");


// imagen del producto
const imagen = producto.image
? `http://proyecto-tienda-rho.vercel.app${producto.image}`
: "https://via.placeholder.com/300";


// contenido de la tarjeta
card.innerHTML = `

<img src="${imagen}">

<h4>${producto.name}</h4>

<p>${producto.description || ""}</p>

<p class="producto-precio">$${producto.price}</p>

<p class="producto-stock">Stock: ${producto.stock}</p>

`;


// =============================
// BOTÓN ELIMINAR
// =============================

const btnEliminar = document.createElement("button");

btnEliminar.className="btn-eliminar";
btnEliminar.innerText="Eliminar";

btnEliminar.onclick=()=>eliminarProducto(producto._id);


// =============================
// BOTÓN MODIFICAR
// =============================

const btnModificar = document.createElement("button");

btnModificar.className="btn-modificar";
btnModificar.innerText="Modificar";

btnModificar.onclick=()=>prepararEdicion(producto);


// agregar botones
card.appendChild(btnEliminar);
card.appendChild(btnModificar);


// agregar card a la lista
lista.appendChild(card);

});

}catch(error){

console.log("Error cargando productos:",error);

}

}



// =============================
// 2️⃣ CREAR O ACTUALIZAR PRODUCTO
// =============================
form.addEventListener("submit", async (e)=>{

e.preventDefault();

// crear formData
const formData = new FormData();

formData.append("name",document.getElementById("name").value);
formData.append("description",document.getElementById("description").value);
formData.append("price",document.getElementById("price").value);
formData.append("stock",document.getElementById("stock").value);
formData.append("category",document.getElementById("category").value);

const imagen = document.getElementById("imagen").files[0];

if(imagen){
formData.append("imagen",imagen);
}

try{

if(productoEditandoId){

// ✏️ ACTUALIZAR PRODUCTO
await fetch(`http://localhost:3007/api/productos/update/${productoEditandoId}`,{
method:"PUT",
body:formData
});

productoEditandoId=null;

}else{

// ➕ CREAR PRODUCTO
await fetch("http://localhost:3007/api/productos",{
method:"POST",
body:formData
});

}

form.reset();

cargarProductos();

}catch(error){

console.log("Error:",error);

}

});



// =============================
// 3️⃣ PREPARAR EDICIÓN
// =============================
function prepararEdicion(producto){

productoEditandoId = producto._id;

document.getElementById("name").value = producto.name;
document.getElementById("description").value = producto.description;
document.getElementById("price").value = producto.price;
document.getElementById("stock").value = producto.stock;

}



// =============================
// 4️⃣ ELIMINAR PRODUCTO
// =============================
async function eliminarProducto(id){

const confirmar = confirm("¿Estás seguro de eliminar este producto?");

if(!confirmar) return;

await fetch(`http://localhost:3007/api/productos/delete/${id}`,{
method:"DELETE"
});

cargarProductos();

}



// ¡EJECUTAR AL INICIO!
cargarProductos();