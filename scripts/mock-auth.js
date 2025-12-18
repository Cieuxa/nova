// scripts/mock-auth.js - Système de connexion simulé sans vraie sauvegarde
(function(){
    'use strict';

    const CURRENT_USER_KEY = 'nova_mock_user';
    
    // Liste de comptes de démo valides
    const DEMO_ACCOUNTS = {
        'demo@nova.com': { email: 'demo@nova.com', firstName: 'Jean', lastName: 'Dupont', password: 'Demo1234' },
        'test@nova.com': { email: 'test@nova.com', firstName: 'Marie', lastName: 'Martin', password: 'Test1234' },
        'user@nova.com': { email: 'user@nova.com', firstName: 'Thomas', lastName: 'Bernard', password: 'User1234' }
    };

    // Fonctions utilitaires
    function saveUser(user) {
        try {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        } catch(e) {
            console.warn('Erreur sauvegarde utilisateur:', e);
        }
    }

    function getUser() {
        try {
            const raw = localStorage.getItem(CURRENT_USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch(e) {
            console.warn('Erreur lecture utilisateur:', e);
            return null;
        }
    }

    function clearUser() {
        try {
            localStorage.removeItem(CURRENT_USER_KEY);
        } catch(e) {
            console.warn('Erreur suppression utilisateur:', e);
        }
    }

    // Service d'authentification
    const AuthService = {
        // Vérifier si un compte démo est valide
        validateDemoAccount: function(email, password) {
            const account = DEMO_ACCOUNTS[email.toLowerCase()];
            if (account && account.password === password) {
                return { success: true, user: account };
            }
            return { success: false, message: 'Email ou mot de passe incorrect' };
        },

        // Permettre l'enregistrement d'un nouveau compte simulé
        registerNewAccount: function(email, firstName, lastName, password) {
            const lowerEmail = email.toLowerCase();
            
            // Vérifier si le compte existe déjà
            if (DEMO_ACCOUNTS[lowerEmail]) {
                return { success: false, message: 'Ce compte existe déjà' };
            }
            
            // Créer un nouveau compte simulé
            const newUser = {
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            // Ajouter aux comptes de démo (pour cette session)
            DEMO_ACCOUNTS[lowerEmail] = newUser;
            
            return { success: true, user: newUser };
        },

        // Se connecter avec un compte de démo
        login: function(email, password) {
            const result = this.validateDemoAccount(email, password);
            if (result.success) {
                // Sauvegarder l'utilisateur connecté
                saveUser({
                    email: result.user.email,
                    firstName: result.user.firstName,
                    lastName: result.user.lastName
                });
                return { success: true, user: result.user };
            }
            return { success: false, message: result.message };
        },

        // S'inscrire (créer un nouveau compte simulé)
        register: function(email, firstName, lastName, password) {
            return this.registerNewAccount(email, firstName, lastName, password);
        },

        // Obtenir l'utilisateur connecté
        getCurrentUser: function() {
            return getUser();
        },

        // Vérifier si connecté
        isLoggedIn: function() {
            return !!getUser();
        },

        // Se déconnecter
        logout: function() {
            clearUser();
        }
    };

    // Exposition publique
    window.AuthService = AuthService;
    window.NovaAuth = AuthService;

    // ========== GESTION DE L'INTERFACE DE CONNEXION ==========

    function initConnectionUI() {
        // Redirection si déjà connecté
        const currentPath = window.location.pathname || window.location.href;
        if (AuthService.isLoggedIn() && /connexion\.html$/i.test(currentPath)) {
            window.location.href = 'profil.html';
            return;
        }

        // Gestion des onglets
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Désactiver tous les onglets et formulaires
                document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                
                // Activer l'onglet sélectionné
                this.classList.add('active');
                const form = document.getElementById(tabId + '-form');
                if (form) form.classList.add('active');
            });
        });

        // Gestion des mots de passe (affichage/masquage)
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const input = this.closest('.password-input-wrapper').querySelector('input');
                if (input) {
                    input.type = input.type === 'password' ? 'text' : 'password';
                    this.textContent = input.type === 'password' ? '👁️' : '🙈';
                }
            });
        });

        // Formulaire de CONNEXION
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email')?.value?.trim() || '';
                const password = document.getElementById('password')?.value || '';

                if (!email || !password) {
                    showError('Veuillez remplir tous les champs', loginForm);
                    return;
                }

                const result = AuthService.login(email, password);
                if (result.success) {
                    // Connexion réussie - redirection
                    setTimeout(() => {
                        window.location.href = 'profil.html';
                    }, 300);
                } else {
                    showError(result.message, loginForm);
                }
            });
        }

        // Formulaire d'INSCRIPTION
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const email = document.getElementById('signup-email')?.value?.trim() || '';
                const firstName = document.getElementById('first-name')?.value?.trim() || '';
                const lastName = document.getElementById('last-name')?.value?.trim() || '';
                const password = document.getElementById('signup-password')?.value || '';
                const confirmPassword = document.getElementById('confirm-password')?.value || '';
                const termsCheckbox = signupForm.querySelector('input[name="terms"]');

                // Validations
                if (!email || !firstName || !lastName || !password || !confirmPassword) {
                    showError('Veuillez remplir tous les champs', signupForm);
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    showError('Veuillez entrer une adresse email valide', signupForm);
                    return;
                }

                if (password.length < 8) {
                    showError('Le mot de passe doit contenir au moins 8 caractères', signupForm);
                    return;
                }

                if (password !== confirmPassword) {
                    showError('Les mots de passe ne correspondent pas', signupForm);
                    return;
                }

                if (termsCheckbox && !termsCheckbox.checked) {
                    showError('Veuillez accepter les conditions d\'utilisation', signupForm);
                    return;
                }

                // Enregistrement
                const result = AuthService.register(email, firstName, lastName, password);
                if (result.success) {
                    // Enregistrement réussi - sauvegarder et rediriger
                    saveUser({
                        email: result.user.email,
                        firstName: result.user.firstName,
                        lastName: result.user.lastName
                    });
                    
                    showSuccess(`Bienvenue ${firstName} ! Redirection en cours...`, signupForm);
                    setTimeout(() => {
                        window.location.href = 'profil.html';
                    }, 1500);
                } else {
                    showError(result.message, signupForm);
                }
            });
        }

        // Formulaire Mot de passe oublié (simulation)
        const forgotForm = document.getElementById('forgot-password-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('reset-email')?.value?.trim() || '';
                
                if (!email) {
                    showError('Veuillez entrer votre adresse email', forgotForm);
                    return;
                }
                
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    showError('Veuillez entrer une adresse email valide', forgotForm);
                    return;
                }

                showSuccess(`Email de réinitialisation envoyé à ${email} (simulation)`, forgotForm);
            });
        }
    }

    // Affichage des messages d'erreur
    function showError(message, formElement) {
        // Supprimer l'erreur existante
        const existingError = formElement?.querySelector('.form-error');
        if (existingError) existingError.remove();

        // Créer et afficher le nouveau message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `<div style="background:#ffdddd;color:#700;padding:12px;border-radius:6px;margin-bottom:12px;border-left:4px solid #d00;">⚠️ ${message}</div>`;

        const targetForm = formElement?.querySelector('.auth-form.active') || formElement;
        if (targetForm?.parentElement) {
            targetForm.parentElement.insertBefore(errorDiv, targetForm);
        } else if (formElement) {
            formElement.insertBefore(errorDiv, formElement.firstChild);
        }
    }

    // Affichage des messages de succès
    function showSuccess(message, formElement) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `<div style="background:#eeffee;color:#070;padding:12px;border-radius:6px;margin-bottom:12px;border-left:4px solid #0d0;">✓ ${message}</div>`;

        const targetForm = formElement?.querySelector('.auth-form.active') || formElement;
        if (targetForm?.parentElement) {
            targetForm.parentElement.insertBefore(successDiv, targetForm);
        } else if (formElement) {
            formElement.insertBefore(successDiv, formElement.firstChild);
        }
    }

    // Initialiser à la charge du DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initConnectionUI);
    } else {
        initConnectionUI();
    }

})();
