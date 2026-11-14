const btnMenu = document.getElementById('btn-menu'), mobileMenu = document.getElementById('mobile-menu'), iconOpen = document.getElementById('icon-open'), iconClose = document.getElementById('icon-close');
btnMenu.addEventListener('click', () => { mobileMenu.classList.toggle('hidden'); iconOpen.classList.toggle('hidden'); iconClose.classList.toggle('hidden'); });
