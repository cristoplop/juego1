// script.js
let avatarSeleccionado = null;

document.addEventListener("DOMContentLoaded", function() {

    const clickSound = document.getElementById("clickSound");
    const errorSound = document.getElementById("errorSound");
    const successSound = document.getElementById("successSound");

    // === FUNCIONES GLOBALES (importante para los onclick) ===
    window.seleccionarAvatar = function(elemento, avatar) {
        avatarSeleccionado = avatar;
        if (clickSound) clickSound.play();

        document.querySelectorAll(".avatares img").forEach(img => {
            img.classList.remove("seleccionado");
        });
        elemento.classList.add("seleccionado");
    };

    window.ingresar = function() {
        const nombre = document.getElementById("nombre").value.trim();

        if (nombre === "" && avatarSeleccionado === null) {
            if (errorSound) errorSound.play();
            setTimeout(() => {
                hablar("Debes escribir tu nombre y seleccionar un avatar");
            }, 700);
        }
        else if (nombre !== "" && avatarSeleccionado !== null) {
            if (successSound) successSound.play();
            document.getElementById("contenido").classList.add("efecto");
            
            localStorage.setItem("nombre", nombre);
            localStorage.setItem("avatar", avatarSeleccionado);
            
            setTimeout(() => {
                hablar(`¡Bienvenido ${nombre}!`);
            }, 800);
            
            setTimeout(() => {
                window.location.href = "bienvenido.html";
            }, 2300);
        }
        else {
            if (errorSound) errorSound.play();
            setTimeout(() => {
                hablar("Completa todos los datos");
            }, 700);
        }
    };

    function hablar(texto) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(texto);
            utterance.lang = 'es-ES';
            utterance.rate = 1.1;
            speechSynthesis.speak(utterance);
        }
    }
});