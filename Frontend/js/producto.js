const API = "http://localhost:3007/api/producto"

async function obtenerProductos(){
// console.log("1. Iniciando petición a la API...")
    try{
        const response = await fetch(API)

        const data = await response.json()

        mostrarProductos(data)

    }catch(error){

        console.log("Error:", error)

    }

}

function mostrarProductos(productos) {
    const contenedor = document.getElementById("productos");
    
    // Si por alguna razón no encuentra el div, esto nos avisará
    if (!contenedor) {
        console.error("Error: No se encontró el div con id 'productos'");
        return;
    }

    contenedor.innerHTML = ""; // Limpiar el "Cargando..."

    productos.forEach(producto => {
        // Creamos el elemento
        const card = document.createElement("div");
        
        // Le damos estilo para que resalte
        card.style.backgroundColor = "#f4f4f4";
        card.style.border = "2px solid #333";
        card.style.margin = "15px";
        card.style.padding = "15px";
        card.style.borderRadius = "10px";
        card.style.color = "black"; // Aseguramos que el texto sea negro

        // Insertamos los datos. 
        // Usamos producto.name porque confirmaste que así se llama en el objeto.
        card.innerHTML = `
            <h2 style="margin-top:0;">📦 ${producto.name}</h2>
            <p><strong>Descripción:</strong> ${producto.description || 'Sin descripción'}</p>
            <p style="color: green; font-size: 1.2em;"><strong>Precio:</strong> $${producto.price}</p>
            <p><strong>Stock disponible:</strong> ${producto.stock} unidades</p>
        `;

        // Lo agregamos al contenedor del HTML
        contenedor.appendChild(card);
    });
    
    console.log("¡Productos dibujados en pantalla con éxito!");
}

obtenerProductos()