// scripts/protect-pages.js - Protection des pages avec authentification
(function(){
    'use strict';

    const PROTECTED_PAGES = ['profil.html', 'drive.html', 'mail.html', 'securite-perso.html', 'abonnements.html', 'parametres.html'];
    const AUTH_CHECK_DELAY = 100; // Délai court pour vérifier l'authentification

    function getCurrentPageName() {
        const path = window.location.pathname || window.location.href;
        return path.split('/').pop().toLowerCase() || '';
    }

    function isProtectedPage() {
        const currentPage = getCurrentPageName();
        return PROTECTED_PAGES.some(p => currentPage.includes(p.toLowerCase()));
    }

    function isConnectionPage() {
        const currentPage = getCurrentPageName();
        return currentPage.includes('connexion');
    }

    function getAuthUser() {
        try {
            const raw = localStorage.getItem('nova_mock_user');
            return raw ? JSON.parse(raw) : null;
        } catch(e) {
            return null;
        }
    }

    function setupAuthCheck() {
        const isProtected = isProtectedPage();
        const isLoginPage = isConnectionPage();
        const user = getAuthUser();

        // Page protégée sans authentification -> rediriger vers connexion
        if (isProtected && !user) {
            console.log('[Auth] Page protégée sans authentification - redirection vers connexion');
            window.location.replace('connexion.html');
            return;
        }

        // Page de connexion avec authentification -> rediriger vers profil
        if (isLoginPage && user) {
            console.log('[Auth] Déjà connecté - redirection vers profil');
            window.location.replace('profil.html');
            return;
        }

        // Si page protégée et utilisateur existe -> mettre à jour l'UI
        if (isProtected && user) {
            updateUserInterface(user);
        }
    }

    function updateUserInterface(user) {
        // Mettre à jour le nom d'utilisateur
        const nameElements = document.querySelectorAll('#user-name, #sidebar-name, .user-display-name');
        nameElements.forEach(el => {
            if (el) {
                el.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
            }
        });

        // Mettre à jour l'avatar avec les initiales
        const avatarElements = document.querySelectorAll('#user-avatar, #avatar-placeholder');
        avatarElements.forEach(el => {
            if (el) {
                const initials = ((user.firstName || '')[0] + (user.lastName || '')[0]).toUpperCase() || '👤';
                el.textContent = initials;
            }
        });

        // Afficher un message de bienvenue optionnel
        const welcomeElements = document.querySelectorAll('[data-welcome-message]');
        welcomeElements.forEach(el => {
            if (el) {
                el.textContent = `Bienvenue, ${user.firstName || 'Utilisateur'} !`;
            }
        });
    }

    function setupLogoutButtons() {
        document.querySelectorAll('[id*="logout"], [class*="logout"], [data-action="logout"]').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // Déconnecter
                try {
                    localStorage.removeItem('nova_mock_user');
                } catch(e) {}
                // Rediriger vers la connexion
                window.location.href = 'connexion.html';
            });
        });
    }

    // Initialiser immédiatement (pas d'attente)
    setupAuthCheck();

    // Configurer les boutons de déconnexion après le DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupLogoutButtons);
    } else {
        setupLogoutButtons();
    }

})();
