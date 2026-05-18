// bienvenido.js - scripts for bienvenido.html

document.addEventListener('DOMContentLoaded', ()=>{
    try{
        const nombre = localStorage.getItem('nombre') || localStorage.getItem('nombreEstudiante') || 'Estudiante';
        const avatar = localStorage.getItem('avatar');
        const texto = document.getElementById('texto');
        const foto = document.getElementById('foto');
        if(texto) texto.textContent = `¡Hola ${nombre}!`;
        if(foto && avatar) {
            // si avatar es sólo nombre de archivo, intentar buscar en img/ como fallback
            if (avatar.startsWith('data:') || avatar.startsWith('http') || avatar.startsWith('/')) {
                foto.src = avatar;
            } else {
                foto.src = avatar; // si el valor es la URL guardada, esto la colocará; si no, queda vacío
            }
            foto.alt = nombre + " - avatar";
        }
    }catch(e){ console.error(e); }
});

function volver(){ window.location.href = 'index.html'; }
function continuar(){ window.location.href = 'actividad2.html'; }

function hablar(texto){ if('speechSynthesis' in window){ const u=new SpeechSynthesisUtterance(texto); u.lang='es-ES'; speechSynthesis.cancel(); speechSynthesis.speak(u); } }

