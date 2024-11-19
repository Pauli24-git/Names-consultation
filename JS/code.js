var peticionHttp;
const urlUsers = "https://jsonplaceholder.typicode.com/users";

function inicializarXHR() {
    if (window.XMLHttpRequest) {
        peticionHttp = new XMLHttpRequest();
    } else {
        peticionHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
}

function realizarPeticionHttpAsync(url, metodo, callback) {
    peticionHttp.onreadystatechange = function () {
        if (peticionHttp.readyState === 4) { 
            if (peticionHttp.status === 200) { 
                try {
                    let responseText = peticionHttp.responseText;
                    if (responseText) {
                        let response = JSON.parse(responseText);
                        callback(response);
                    } else {
                        alert("La respuesta está vacía.");
                    }
                } catch (error) {
                    console.error("Error al analizar la respuesta JSON:", error);
                    alert("Hubo un problema al analizar la respuesta de la API.");
                }
            } else {
                alert("Error en la petición. Código: " + peticionHttp.status);
            }
        }
    };
    peticionHttp.open(metodo, url, true); 
    peticionHttp.send(null);
}

function validateUser(event) {
    event.preventDefault();
    var email = document.getElementById("email").value.toLowerCase();
    var password = document.getElementById("password").value;

    inicializarXHR();

    realizarPeticionHttpAsync(urlUsers, "GET", function () {
        if (peticionHttp.readyState === 4) { 
            if (peticionHttp.status === 200) { 
                let usuarios = JSON.parse(peticionHttp.responseText); 
                let usuarioEncontrado = usuarios.find(user => user.email.toLowerCase() === email); 

                if (usuarioEncontrado) {
                    let latAsPassword = usuarioEncontrado.address.geo.lat; 

                    if (latAsPassword.toString() === password) {
                        window.location.href = `./dashboard.html`;
                    } else {
                        alert("Contraseña incorrecta.");
                    }
                } else {
                    alert("Usuario no encontrado.");
                }
            } else {
                alert("Error en la petición. Código: " + peticionHttp.status);
            }
        }
    });
}