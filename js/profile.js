function showUserProfile() {
    // No mostrar perfil en la página de inicio ni en la pantalla de bienvenida
    try {
        const page = (window.location.pathname || '').split('/').pop();
        if (page === '' || page === 'index.html' || page === 'bienvenido.html') return;
    } catch (e) {}

    const nombre = localStorage.getItem('nombre') || localStorage.getItem('nombreEstudiante');
    const avatar = localStorage.getItem('avatar') || localStorage.getItem('userAvatar');
    const perfil = document.getElementById('userProfile');
    if (!perfil) return;

    if (!nombre && !avatar) {
        perfil.style.display = 'none';
        return;
    }

    perfil.style.display = 'flex';
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');

    if (userName && nombre) {
        userName.textContent = nombre;
    }
    if (userAvatar) {
        if (avatar) {
            userAvatar.src = avatar;
            userAvatar.alt = nombre ? `${nombre} - avatar` : 'Avatar del usuario';
        } else {
            userAvatar.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', showUserProfile);

// ================= Confetti global =================
(() => {
    let particles = [];
    let animId = null;
    let stopTimer = null;

    function resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function stopConfettiInternal() {
        try { if (animId) cancelAnimationFrame(animId); } catch(e){}
        animId = null;
        particles = [];
        const canvas = document.getElementById('confetti');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,canvas.width,canvas.height);
            // hide canvas if desired
            try { canvas.style.display = 'none'; } catch(e){}
        }
        if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
    }

    function startConfetti(duration = 1500, intensity = 140) {
        stopConfettiInternal();
        const canvas = document.getElementById('confetti');
        if (!canvas) return;
        canvas.style.display = 'block';
        resizeCanvas(canvas);
        const ctx = canvas.getContext('2d');

        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#51cf66', '#ff9ff3', '#a8e6cf'];
        for (let i = 0; i < intensity; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.5 - 100,
                w: Math.random() * 12 + 7,
                h: Math.random() * 7 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 4 + 3,
                angle: Math.random() * 360,
                rot: Math.random() * 0.2 - 0.1
            });
        }

        let frame = 0;
        function animate() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            let alive = false;
            particles.forEach(p => {
                p.y += p.speed;
                p.angle += p.rot;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle * Math.PI / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
                ctx.restore();
                if (p.y < canvas.height + 50) alive = true;
            });
            if (alive && frame++ < 1000) {
                animId = requestAnimationFrame(animate);
            } else {
                stopConfettiInternal();
            }
        }
        animate();

        // For safety, stop after duration ms
        stopTimer = setTimeout(() => stopConfettiInternal(), duration);
    }

    // Expose globally
    window.startConfetti = startConfetti;
    window.stopConfetti = stopConfettiInternal;
})();
