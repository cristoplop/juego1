const numeros = [
    { num: 1, palabra: 'uno', english: 'one' },
    { num: 2, palabra: 'dos', english: 'two' },
    { num: 3, palabra: 'tres', english: 'three' },
    { num: 4, palabra: 'cuatro', english: 'four' },
    { num: 5, palabra: 'cinco', english: 'five' },
    { num: 6, palabra: 'seis', english: 'six' },
    { num: 7, palabra: 'siete', english: 'seven' },
    { num: 8, palabra: 'ocho', english: 'eight' },
    { num: 9, palabra: 'nueve', english: 'nine' },
    { num: 10, palabra: 'diez', english: 'ten' }
];

const grid = document.getElementById('grid');
const btnEscuchar = document.getElementById('btnEscuchar');
let isPlaying = false;
let currentUtterance = null;

function crearTarjetas() {
    numeros.forEach(item => {
        const div = document.createElement('div');
        div.className = 'tarjeta';
        div.dataset.num = item.num;

        div.innerHTML = `
            <div class="numero">${item.num}</div>
            <div class="palabra">${item.palabra}</div>
            <div class="palabra-en">${item.english}</div>
        `;

        div.addEventListener('click', () => {
            if (!isPlaying) {
                decirNumero(item.palabra);
            }
        });

        grid.appendChild(div);
    });
}

function decirNumero(texto) {
    if (currentUtterance) {
        speechSynthesis.cancel();
    }

    if ('speechSynthesis' in window) {
        currentUtterance = new SpeechSynthesisUtterance(texto);
        currentUtterance.lang = 'es-ES';
        currentUtterance.rate = 0.95;
        speechSynthesis.speak(currentUtterance);
    }
}

async function repetirTodo() {
    if (isPlaying) return;

    isPlaying = true;
    btnEscuchar.disabled = true;
    const tarjetas = document.querySelectorAll('.tarjeta');

    for (let i = 0; i < numeros.length; i++) {
        tarjetas.forEach(t => t.classList.remove('activo'));
        tarjetas[i].classList.add('activo');

        decirNumero(numeros[i].palabra);
        await new Promise(resolve => setTimeout(resolve, 1600));
    }

    tarjetas.forEach(t => t.classList.remove('activo'));
    isPlaying = false;
    btnEscuchar.disabled = false;
}

if (grid && btnEscuchar) {
    crearTarjetas();
    btnEscuchar.addEventListener('click', repetirTodo);
}
<audio id="levelComplete" src="02. Level Complete.mp3"></audio>