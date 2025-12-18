// ============================================
// GESTION DU MENU MOBILE ET DE LA NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function () {
            navList.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');

            // Animation des barres du burger menu
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));

            // Empêcher le défilement quand le menu est ouvert
            document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
        });

        // Fermer le menu quand on clique sur un lien
        const navLinks = navList.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navList.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';

                // Réinitialiser l'animation des barres
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            });
        });

        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function (event) {
            if (!navList.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
                navList.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';

                const spans = mobileMenuBtn.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }
        });
    }

    // Navigation active
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage ||
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    setActiveNavLink();

    // Scroll doux pour les ancres internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Ignorer les ancres vides ou externes
            if (href === '#' || href.startsWith('#!')) return;

            // Vérifier si c'est une ancre interne
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Calculer la position avec offset pour le header fixe
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header avec effet de scroll
    const header = document.querySelector('header');

    function handleScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
});

// Ajout des styles pour le menu mobile
const mobileMenuStyles = `
    @media (max-width: 768px) {
        .nav-list {
            position: fixed;
            top: 73px;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--bg-primary);
            flex-direction: column;
            padding: var(--space-xl);
            gap: var(--space-lg);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 999;
            overflow-y: auto;
        }
        
        .nav-list.active {
            transform: translateX(0);
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }
        
        header.scrolled {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
    }
`;

// Injecter les styles
const styleElement = document.createElement('style');
styleElement.textContent = mobileMenuStyles;
document.head.appendChild(styleElement);

// ============================================
// GESTION GLOBALE DE L'AUTHENTIFICATION (MENU)
// ============================================

// Commande Admin masquée pour réinitialiser
window.novaAdminReset = function () {
    // Extra confirmation: require typing RESET to avoid accidental wipes
    const promptMsg = '⚠️ ADMINISTRATION NOVA SYSTEMS ⚠️\n\nCeci effacera TOUTES les données locales (comptes, sessions).\n\nTapez RESET pour confirmer.';
    const input = prompt(promptMsg);
    if (input && input.trim().toUpperCase() === 'RESET') {
        try{ localStorage.clear(); console.log('>>> SYSTEM RESET SUCCESSFUL'); window.location.reload(); } catch(e){ console.error('NovaAdminReset failed', e); }
    } else {
        console.log('NovaAdminReset cancelled or invalid confirmation');
    }
};

// Mettre à jour le bouton Connexion -> Mon Compte
function updateAuthNavigation() {
    try {
        let user = null;
        if (window.AuthService && typeof window.AuthService.getCurrentUser === 'function') {
            user = window.AuthService.getCurrentUser();
        } else {
            const session = localStorage.getItem('ns_current_user') || localStorage.getItem('nova_current_user') || localStorage.getItem('novaUser');
            if (session) {
                try { user = JSON.parse(session); } catch (e) { user = { email: session }; }
            }
        }
        if (user) {
            const authLinks = document.querySelectorAll('a[href="connexion.html"]');
            authLinks.forEach(link => {
                link.textContent = 'Mon Compte';
                const profileHref = (window.NovaAuth && typeof window.NovaAuth.resolvePath === 'function') ? window.NovaAuth.resolvePath('profil.html') : (window.location.pathname.indexOf('/pages_personnelles/') !== -1 ? '../profil.html' : 'profil.html');
                link.href = profileHref;
                link.classList.add('logged-in');
                if (link.classList.contains('nav-button')) {
                    link.style.backgroundColor = 'var(--bg-secondary)';
                    link.style.color = 'var(--text-primary)';
                    link.style.border = '1px solid var(--border-medium)';
                }
            });
            console.log(`NovaAuth: Connecté en tant que ${user.email}`);
        }
    } catch (e) {
        console.error('NovaAuth: Erreur de vérification session', e);
    }
}

// Exécuter au chargement
updateAuthNavigation();
