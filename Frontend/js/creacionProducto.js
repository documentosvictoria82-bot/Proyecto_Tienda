ddocument.addEventListener('DOMContentLoaded', () => {
    const formulario = document.querySelector('.formulario');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // 1. Creamos el FormData en lugar de un objeto simple
            // Esto permite que Multer en el backend reciba el archivo
            const formData = new FormData();
            
            // Agregamos los campos uno a uno para mantener tus conversiones (parseFloat/parseInt)
            formData.append('name', e.target.titulo.value);
            formData.append('description', e.target.descripcion.value);
            formData.append('price', parseFloat(e.target.precio.value));
            formData.append('category', e.target.categoria.value);
            formData.append('stock', parseInt(e.target.count.value));
            
            // Para objetos anidados como 'rating', los enviamos así para que el backend los entienda
            formData.append('rating[rate]', parseFloat(e.target.rate.value));
            formData.append('rating[count]', parseInt(e.target.count.value));

            // CAPTURAMOS LA IMAGEN REAL (esto es lo que faltaba)
            if (e.target.imagen.files[0]) {
                formData.append('imagen', e.target.imagen.files[0]);
            }

            console.log("Enviando formulario con imagen...");

            // 2. FETCH ajustado
            const response = await fetch('http://localhost:3007/api/producto', {
                method: 'POST',
                // IMPORTANTE: Al usar FormData, NO debes poner 'Content-Type': 'application/json'
                // El navegador configurará el Header automáticamente como 'multipart/form-data'
                body: formData 
            });

            const data = await response.json();

            // 3. Tus alertas y lógica se mantienen exactamente igual
            if (response.ok) {
                alert('Producto creado con éxito');
                console.log('Respuesta servidor:', data);
                formulario.reset(); 
            } else {
                console.error('Error del servidor:', data.error);
                alert('Error: ' + data.error);
            }

        } catch (error) {
            console.error('Error en la solicitud:', error);
            alert('Error de conexión con el servidor');
        }
    });
});