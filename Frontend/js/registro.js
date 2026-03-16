const API = "https://proyecto-tienda-rho.vercel.app/api/register"

const form = document.getElementById("registerForm")

form.addEventListener("submit", async (e)=>{

e.preventDefault()

const usuario = document.getElementById("usuario").value
const email = document.getElementById("email").value
const password = document.getElementById("password").value
const role = document.getElementById("role").value // Capturamos el rol

const data = {
    usuario,
    email,
    password,
    role // Lo añadimos al objeto que se envía
}

const response = await fetch(API,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify(data)

})

const result = await response.json()

console.log(result)

alert(result.message); 
    if (response.ok) {
    window.location.href = "../pages/login.html";
    }
})