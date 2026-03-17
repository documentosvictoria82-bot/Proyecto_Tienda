//const url = new URLSearchParams(window.location.search)
//console.log(url.getAll('idproducto'));
const API = "https://proyecto-tienda-rho.vercel.app/api/login"

const form = document.getElementById("loginForm")

form.addEventListener("submit", async (e)=>{

e.preventDefault()

const email = document.getElementById("email").value
const password = document.getElementById("password").value

const response = await fetch(API,{
method:"POST",
headers:{
"Content-Type":"application/json"
},

body: JSON.stringify({email,password})

})

const data = await response.json()

if (response.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role); 

    alert("Login correcto");

    // Redirección basada en rol
    if (data.role === 'admin') {
        window.location.href = "../pages/creacionProducto.html";
    } else {
        window.location.href = "../index.html";
    }
} else {
    alert(data.error);
}

})
