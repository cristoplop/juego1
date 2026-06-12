// actividad2.js - scripts for actividad2.html

const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

function launchConfetti(duration = 2000){
	try { if (window.startConfetti) window.startConfetti(duration); } catch(e) {}
}

class Particle{ constructor(){ this.x=Math.random()*canvas.width; this.y=Math.random()*canvas.height-canvas.height; this.size=Math.random()*12+8; this.speed=Math.random()*7+5; this.angle=Math.random()*360; this.color=`hsl(${Math.random()*360},100%,60%)`; } update(){ this.y+=this.speed; this.angle+=8; } draw(){ ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.angle*Math.PI/180); ctx.fillStyle=this.color; ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size); ctx.restore(); } }

const numeros=[1,2,3,4,5,6,7,8,9,10];
const colores=["#ff6b6b","#4ecdc4","#45b7d1","#96cebc","#feca57","#ff9ff3","#54a0ff","#5f27cd","#ff9f43","#00d2d3"];
let numeroDivs=[];

function crearNumeros(){ const container=document.getElementById('numerosContainer'); container.innerHTML=''; numeroDivs=[]; numeros.forEach((num,index)=>{ const div=document.createElement('div'); div.className='numero'; div.style.backgroundColor=colores[index]; div.textContent=num; div.onclick=()=>hablarNumero(num); container.appendChild(div); numeroDivs.push(div); }); }

function hablarNumero(num){ if('speechSynthesis' in window){ const u=new SpeechSynthesisUtterance(num.toString()); u.lang='es-ES'; u.rate=0.9; u.pitch=1.2; speechSynthesis.cancel(); speechSynthesis.speak(u); } }

async function escucharTodos(){ try{ launchConfetti(4000); if(!numeroDivs||numeroDivs.length===0) crearNumeros(); for(let i=0;i<numeros.length;i++){ const div=numeroDivs[i]; if(!div) continue; div.classList.add('activo'); const u=new SpeechSynthesisUtterance(numeros[i].toString()); u.lang='es-ES'; u.rate=0.85; u.pitch=1.25; speechSynthesis.speak(u); await new Promise(resolve=>{ u.onend=resolve; }); div.classList.remove('activo'); await new Promise(resolve=>setTimeout(resolve,350)); } }catch(e){ console.error('escucharTodos',e); } }

function irAPracticar(){ document.getElementById('seccionAprender').style.display='none'; document.getElementById('seccionPracticar').style.display='block'; window.scrollTo({top:0,behavior:'smooth'}); }
function volverAlInicio(){ window.location.href='index.html'; }

let tarjetasCompletadas=0;
function mostrarBotonVolver(){ const boton=document.getElementById('volverInicioBtn'); if(!boton) return; boton.style.display='inline-block'; boton.scrollIntoView({behavior:'smooth',block:'center'}); }
function comprobarActividadesCompletas(){ if(tarjetasCompletadas>=objetosEjemplos.length) mostrarBotonVolver(); }

const objetosEjemplos=[ { emoji: "🍎", cantidad: 3, nombre: "manzanas" }, { emoji: "⭐", cantidad: 3, nombre: "estrellas" }, { emoji: "🐶", cantidad: 2, nombre: "perritos" }, { emoji: "🦋", cantidad: 4, nombre: "mariposas" }, { emoji: "🍌", cantidad: 6, nombre: "plátanos" }, { emoji: "🎈", cantidad: 7, nombre: "globos" }, { emoji: "🐟", cantidad: 8, nombre: "peces" }, { emoji: "🍓", cantidad: 9, nombre: "fresas" } ];

function crearConteo(){ const container=document.getElementById('conteoContainer'); container.innerHTML=''; objetosEjemplos.forEach(item=>{ const card=document.createElement('div'); card.className='card'; let opcionesHTML=''; for(let i=1;i<=10;i++){ opcionesHTML+=`<div class="opcion" style="background-color: ${colores[i-1]}; color:white;" onclick="verificarConteo(this, ${item.cantidad}, ${i})">${i}</div>`; } card.dataset.completada='false'; card.innerHTML=`<div style="font-size:22px; color:#2c3e50;">¿Cuántas ${item.nombre}?</div><div class="objetos">${item.emoji.repeat(item.cantidad)}</div><div class="opciones">${opcionesHTML}</div><div class="resultado" style="margin-top:12px; font-size:20px; min-height:30px;"></div>`; container.appendChild(card); }); }

function verificarConteo(elemento, correcto, seleccionado){ const resultadoDiv=elemento.parentElement.parentElement.querySelector('.resultado'); document.querySelectorAll('.resultado').forEach(div=>{ if(div!==resultadoDiv) div.innerHTML=''; }); if(seleccionado===correcto){ resultadoDiv.innerHTML='<span style="color:green; font-weight:bold;">¡Correcto! ✅</span>'; elemento.style.transform='scale(1.3)'; hablarNumero(correcto); launchConfetti(1200); document.getElementById('correctSound').currentTime=0; document.getElementById('correctSound').play().catch(()=>{}); const card=resultadoDiv.parentElement; if(card && card.dataset.completada!=='true'){ card.dataset.completada='true'; tarjetasCompletadas+=1; comprobarActividadesCompletas(); } } else { resultadoDiv.innerHTML='<span style="color:red;">Inténtalo otra vez 😊</span>'; elemento.style.transform='scale(0.8)'; setTimeout(()=>elemento.style.transform='scale(1)',200); document.getElementById('errorSound').currentTime=0; document.getElementById('errorSound').play().catch(()=>{}); } }

document.addEventListener('DOMContentLoaded',()=>{ try{ crearNumeros(); crearConteo(); }catch(e){ console.error(e); } window.addEventListener('resize', resizeCanvas); resizeCanvas(); });

// Ejemplo en la página de selección
localStorage.setItem('userName', nombreSeleccionado);
localStorage.setItem('userAvatar', rutaDelAvatar);