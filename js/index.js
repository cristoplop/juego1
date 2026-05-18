// index.js - scripts for index.html

// Variables
let avatarSeleccionado = null;
let particles = [];

const clickSound = document.getElementById("clickSound");
const selectSound = document.getElementById("selectSound");
const errorSound = document.getElementById("errorSound");
const successSound = document.getElementById("successSound");
const confettiSound = document.getElementById("confettiSound");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 12 + 8;
        this.speed = Math.random() * 7 + 5;
        this.angle = Math.random() * 360;
        this.color = `hsl(${Math.random()*360}, 100%, 60%)`;
    }
    update() { this.y += this.speed; this.angle += 8; }
    draw() { ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.angle * Math.PI / 180); ctx.fillStyle = this.color; ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size); ctx.restore(); }
}

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

function launchConfetti(duration = 3200) { resizeCanvas(); particles = Array.from({length: 300}, () => new Particle()); try { confettiSound.currentTime = 0; confettiSound.play().catch(()=>{}); } catch(e){} const start = Date.now(); function animate(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(let i=particles.length-1;i>=0;i--){ particles[i].update(); particles[i].draw(); if(particles[i].y>canvas.height) particles.splice(i,1); } if(Date.now()-start<duration && particles.length>0) requestAnimationFrame(animate); } animate(); }

function seleccionarAvatar(elemento, avatar){
    // Guardar la URL real de la imagen seleccionada (src del elemento) para usarla en la bienvenida
    avatarSeleccionado = elemento && elemento.src ? elemento.src : avatar;
    try{ if(selectSound){ selectSound.currentTime=0; selectSound.play().catch(()=>{}); } }catch(e){}
    document.querySelectorAll('.avatares img').forEach(img=>img.classList.remove('seleccionado'));
    if(elemento && elemento.classList) elemento.classList.add('seleccionado');
}

function ingresar(){ const nombre = document.getElementById('nombre').value.trim(); if(nombre==='' && avatarSeleccionado===null){ try{ if(errorSound){ errorSound.currentTime=0; errorSound.play().catch(()=>{}); } }catch(e){} setTimeout(()=>hablar('Debes escribir tu nombre y seleccionar un avatar'),700); return; } if(nombre===''||avatarSeleccionado===null){ try{ if(errorSound){ errorSound.currentTime=0; errorSound.play().catch(()=>{}); } }catch(e){} setTimeout(()=>hablar('Completa todos los datos'),700); return; } try{ if(successSound){ successSound.currentTime=0; successSound.play().catch(()=>{}); } }catch(e){} localStorage.setItem('nombre', nombre); localStorage.setItem('avatar', avatarSeleccionado); launchConfetti(3500); setTimeout(()=>hablar(`¡Bienvenido ${nombre}!`),800); setTimeout(()=>{ window.location.href='bienvenido.html'; },2500); }

function hablar(texto){ if('speechSynthesis' in window){ const u=new SpeechSynthesisUtterance(texto); u.lang='es-ES'; u.rate=1.1; speechSynthesis.speak(u); } }

window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

