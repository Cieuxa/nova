// ============================================
// GESTION DYNAMIQUE DU HEADER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    updateHeaderForAuthStatus();
});

function updateHeaderForAuthStatus() {
    const currentUser = AuthService.getCurrentUser();
    const navButton = document.querySelector('.nav-button');
    
    if (currentUser && navButton) {
        // Remplacer le bouton Connexion par Mon Profil et Déconnexion
        navButton.href = 'profil.html';
        navButton.textContent = '👤 Mon Compte';
        
        // Ajouter un bouton de déconnexion
        const logoutBtn = document.createElement('li');
        logoutBtn.innerHTML = `<a href="#" id="header-logout" class="nav-button" style="background: var(--error); color: white;">🚪 Déconnexion</a>`;
        
        navButton.parentElement.parentElement.appendChild(logoutBtn);
        
        document.getElementById('header-logout').addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                AuthService.logout();
                const loginPath = (window.NovaAuth && typeof window.NovaAuth.resolvePath === 'function') ? window.NovaAuth.resolvePath('connexion.html') : (window.location.pathname.indexOf('/pages_personnelles/') !== -1 ? '../connexion.html' : 'connexion.html');
                window.location.href = loginPath;
            }
        });
    }
}
