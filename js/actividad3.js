// actividad3.js - scripts for actividad3.html
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let completedExercises = new Set();

function loadProgress(){ const saved = localStorage.getItem('conteoProgreso'); if(saved) completedExercises = new Set(JSON.parse(saved)); }
function saveProgress(){ localStorage.setItem('conteoProgreso', JSON.stringify([...completedExercises])); }

function updateProgressBar(){ const total = objetosEjemplos.length; const progress = (completedExercises.size/total)*100; document.getElementById('progressBar').style.width = `${progress}%`; document.getElementById('progressText').textContent = `${completedExercises.size} de ${total} completados`; if(completedExercises.size === total) setTimeout(finalizarJuego, 800); }

function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
class Particle{ constructor(){ this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height - canvas.height; this.size = Math.random()*13+8; this.speed = Math.random()*8+5; this.angle = Math.random()*360; this.color = `hsl(${Math.random()*360},100%,60%)`; } update(){ this.y += this.speed; this.angle += 7; } draw(){ ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.angle*Math.PI/180); ctx.fillStyle=this.color; ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size); ctx.restore(); } }
function launchConfetti(intensity=200){ resizeCanvas(); const particles = Array.from({length:intensity},()=>new Particle()); const start=Date.now(); function animate(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(let i=particles.length-1;i>=0;i--){ particles[i].update(); particles[i].draw(); if(particles[i].y>canvas.height) particles.splice(i,1); } if(Date.now()-start<2500) requestAnimationFrame(animate); } animate(); }

const colores=["#ff6b6b","#4ecdc4","#45b7d1","#96cebc","#feca57","#ff9ff3","#54a0ff","#5f27cd"];
const objetosEjemplos=[ { id:1, emoji:"🍎", cantidad:6, nombre:"manzanas" }, { id:2, emoji:"⭐", cantidad:3, nombre:"estrellas" }, { id:3, emoji:"🐶", cantidad:2, nombre:"perritos" }, { id:4, emoji:"🦋", cantidad:4, nombre:"mariposas" }, { id:5, emoji:"🍌", cantidad:5, nombre:"plátanos" }, { id:6, emoji:"🎈", cantidad:9, nombre:"globos" }, { id:7, emoji:"🐟", cantidad:4, nombre:"peces" }, { id:8, emoji:"🍓", cantidad:6, nombre:"fresas" } ];

function hablarNumero(num){ if('speechSynthesis' in window){ const u=new SpeechSynthesisUtterance(num.toString()); u.lang='es-ES'; u.rate=0.85; speechSynthesis.cancel(); speechSynthesis.speak(u); } }

function crearConteo(){ const container=document.getElementById('conteoContainer'); container.innerHTML=''; objetosEjemplos.forEach(item=>{ const isCompleted = completedExercises.has(item.id); const card = document.createElement('div'); card.className = `card ${isCompleted ? 'completed' : ''}`; card.dataset.id = item.id; let opcionesHTML=''; for(let i=1;i<=10;i++){ opcionesHTML += `<div class="opcion" style="background-color: ${colores[i-1]};" data-valor="${i}">${i}</div>`; } card.innerHTML = `<div class="pregunta-container"><div class="pregunta-texto">¿Cuántas ${item.nombre}?</div><div class="cantidad-circular" title="Escuchar">🔊</div></div><div class="objetos">${item.emoji.repeat(item.cantidad)}</div><div class="opciones">${opcionesHTML}</div><div class="resultado"></div>`; card.querySelector('.cantidad-circular').addEventListener('click', ()=>hablarNumero(item.cantidad)); if(!isCompleted){ card.querySelectorAll('.opcion').forEach(op=>{ op.addEventListener('click', ()=>verificarConteo(op, item.cantidad, item.id)); }); } container.appendChild(card); }); updateProgressBar(); }

function verificarConteo(elemento, correcto, id){ const card = elemento.closest('.card'); const resultadoDiv = card.querySelector('.resultado'); const seleccionado = parseInt(elemento.dataset.valor); if(seleccionado===correcto){ resultadoDiv.innerHTML = `<span style="color:#27ae60;">¡Excelente! ✅</span>`; completedExercises.add(id); saveProgress(); updateProgressBar(); card.classList.add('completed'); launchConfetti(120); document.getElementById('correctSound').play().catch(()=>{}); card.querySelectorAll('.opcion').forEach(op=>op.style.pointerEvents = 'none'); } else { resultadoDiv.innerHTML = `<span style="color:#e74c3c;">Inténtalo de nuevo 😊</span>`; elemento.style.transform='scale(0.7)'; setTimeout(()=>elemento.style.transform='scale(1)',180); document.getElementById('errorSound').play().catch(()=>{}); } }

function finalizarJuego(){ launchConfetti(300); document.getElementById('winSound').play().catch(()=>{}); setTimeout(()=>{ const nombre = prompt('¡Felicitaciones! Has completado la actividad.\n\nIngresa tu nombre para la página final:', 'Estudiante'); if(nombre){ localStorage.setItem('nombreEstudiante', nombre); window.location.href='final.html'; } }, 1200); }

function resetProgress(){ if(confirm('¿Estás seguro de reiniciar todo el progreso?')){ localStorage.removeItem('conteoProgreso'); completedExercises.clear(); crearConteo(); } }
function volverAlInicio(){ window.location.href='index.html'; }

document.addEventListener('DOMContentLoaded', ()=>{ loadProgress(); crearConteo(); window.addEventListener('resize', resizeCanvas); resizeCanvas(); });
