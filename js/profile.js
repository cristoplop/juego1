function showUserProfile() {
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
