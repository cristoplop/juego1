// actividad3.js - Versión actualizada
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let completedExercises = new Set();

const colores = [
    "#ff6b6b","#4ecdc4","#45b7d1","#96cebc","#feca57",
    "#ff9ff3","#54a0ff","#5f27cd","#ff9f43","#a55eea"
];

const objetosEjemplos = [
    { id:1, emoji:"🍎", cantidad:6, nombre:"manzanas" },
    { id:2, emoji:"⭐", cantidad:3, nombre:"estrellas" },
    { id:3, emoji:"🐶", cantidad:2, nombre:"perritos" },
    { id:4, emoji:"🦋", cantidad:4, nombre:"mariposas" },
    { id:5, emoji:"🍌", cantidad:5, nombre:"plátanos" },
    { id:6, emoji:"🎈", cantidad:9, nombre:"globos" },
    { id:7, emoji:"🐟", cantidad:4, nombre:"peces" },
    { id:8, emoji:"🍓", cantidad:6, nombre:"fresas" }
];

function loadProgress(){
    const saved = localStorage.getItem('conteoProgreso');
    if(saved) completedExercises = new Set(JSON.parse(saved));
}

function saveProgress(){
    localStorage.setItem('conteoProgreso', JSON.stringify([...completedExercises]));
}

function updateProgressBar(){
    const total = objetosEjemplos.length;
    const progress = (completedExercises.size / total) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = 
        `${completedExercises.size} de ${total} completados`;
  
    if(completedExercises.size === total) {
        setTimeout(finalizarJuego, 600);
    }
}

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// ==================== PARTICLES ====================
class Particle{
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height * 1.5;
        this.size = Math.random() * 14 + 8;
        this.speed = Math.random() * 9 + 6;
        this.angle = Math.random() * 360;
        this.rotationSpeed = Math.random() * 12 - 6;
        this.color = `hsl(${Math.random()*360},100%,65%)`;
    }
    update(){
        this.y += this.speed;
        this.angle += this.rotationSpeed;
    }
    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
        ctx.restore();
    }
}

function launchConfetti(intensity = 200){
    resizeCanvas();
    const particles = Array.from({length: intensity}, () => new Particle());
    const start = Date.now();

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for(let i = particles.length - 1; i >= 0; i--){
            particles[i].update();
            particles[i].draw();
            if(particles[i].y > canvas.height + 50){
                particles.splice(i, 1);
            }
        }
        
        if(Date.now() - start < 2800 && particles.length > 0){
            requestAnimationFrame(animate);
        }
    }
    animate();
}

// ==================== VOZ ====================
function hablarNumero(num){
    if('speechSynthesis' in window){
        const utterance = new SpeechSynthesisUtterance(num.toString());
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
}

function hablar(texto){
    if('speechSynthesis' in window){
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1.05;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
}

// ==================== CREAR EJERCICIOS ====================
function crearConteo(){
    const container = document.getElementById('conteoContainer');
    container.innerHTML = '';

    objetosEjemplos.forEach(item => {
        const isCompleted = completedExercises.has(item.id);
        const card = document.createElement('div');
        card.className = `card ${isCompleted ? 'completed' : ''}`;
        card.dataset.id = item.id;

        let opcionesHTML = '';
        for(let i = 1; i <= 10; i++){
            opcionesHTML += `
                <div class="opcion" style="background-color: ${colores[i-1]};" data-valor="${i}">${i}</div>`;
        }

        card.innerHTML = `
            <div class="pregunta-container">
                <div class="pregunta-texto">¿Cuántas ${item.nombre}?</div>
                <div class="cantidad-circular" title="Escuchar pregunta">🔊</div>
            </div>
            <div class="objetos">${item.emoji.repeat(item.cantidad)}</div>
            <div class="opciones">${opcionesHTML}</div>
            <div class="resultado"></div>
        `;

        // 🔊 → Dice la pregunta completa (evita que se propaguen clicks que hablen números)
        card.querySelector('.cantidad-circular').addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            e.stopPropagation();
            e.preventDefault();
            const pregunta = card.querySelector('.pregunta-texto').textContent;
            console.log('🔊 pregunta:', pregunta);
            speechSynthesis.cancel();
            hablar(pregunta);
        });

        // Botones de números → SIN voz
        if(!isCompleted){
            card.querySelectorAll('.opcion').forEach(op => {
                op.addEventListener('click', () => verificarConteo(op, item.cantidad, item.id));
            });
        }

        container.appendChild(card);
    });

    updateProgressBar();
}

// ==================== VERIFICAR RESPUESTA ====================
function verificarConteo(elemento, correcto, id){
    const card = elemento.closest('.card');
    const resultadoDiv = card.querySelector('.resultado');
    const seleccionado = parseInt(elemento.dataset.valor);

    // Sin voz aquí (eliminada como pediste)

    if(seleccionado === correcto){
        resultadoDiv.innerHTML = `<span style="color:#27ae60;font-weight:bold;">¡Excelente! ✅</span>`;
        completedExercises.add(id);
        saveProgress();
        updateProgressBar();
        card.classList.add('completed');
        
        launchConfetti(150);
        document.getElementById('correctSound').play().catch(()=>{});
        
        card.querySelectorAll('.opcion').forEach(op => op.style.pointerEvents = 'none');
    } else {
        resultadoDiv.innerHTML = `<span style="color:#e74c3c;">Inténtalo de nuevo 😊</span>`;
        elemento.style.transform = 'scale(0.75)';
        setTimeout(() => elemento.style.transform = 'scale(1)', 200);
        document.getElementById('errorSound').play().catch(()=>{});
    }
}

function finalizarJuego(){
    launchConfetti(350);
    document.getElementById('winSound').play().catch(()=>{});

    setTimeout(() => {
        const mensaje = document.createElement('div');
        mensaje.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.85); color: white; padding: 30px 50px;
            border-radius: 20px; font-size: 2.2rem; text-align: center;
            z-index: 1000; box-shadow: 0 0 40px rgba(255,215,0,0.6);
        `;
        mensaje.innerHTML = `¡Felicidades!<br>¡Completaste toda la actividad! 🎉`;
        document.body.appendChild(mensaje);
        setTimeout(() => mensaje.remove(), 4500);
    }, 800);
}

// ==================== OTRAS FUNCIONES ====================
function mostrarPerfil(){
    const nombre = localStorage.getItem('nombre') || localStorage.getItem('nombreEstudiante');
    const avatar = localStorage.getItem('avatar');
    if(nombre || avatar){
        const perfil = document.getElementById('userProfile');
        perfil.style.display = 'flex';
        if(nombre) document.getElementById('userName').textContent = nombre;
        if(avatar){
            document.getElementById('userAvatar').src = avatar;
        }
    }
}

function resetProgress(){
    if(confirm('¿Estás seguro de reiniciar todo el progreso?')){
        localStorage.removeItem('conteoProgreso');
        completedExercises.clear();
        crearConteo();
    }
}

function volverAlInicio(){
    window.location.href = 'index.html';
}

// ==================== INICIO ====================
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    mostrarPerfil();
    crearConteo();
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
});