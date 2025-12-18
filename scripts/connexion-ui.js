// scripts/connexion-ui.js - Interface utilisateur pour la connexion

class ConnexionUI {
    constructor() {
        this.forms = {
            login: null,
            signup: null,
            forgot: null,
            twofa: null
        };
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupTabs();
            this.setupForms();
            this.setupPasswordToggle();
            this.setupCodeInputs();
            this.setupPasswordStrength();
        });
    }
    
    setupTabs() {
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    switchTab(tabId) {
        // Désactiver tous les onglets
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.remove('active');
        });
        
        // Masquer tous les formulaires
        document.querySelectorAll('.auth-form').forEach(f => {
            f.classList.remove('active');
        });
        
        // Activer l'onglet sélectionné
        const activeTab = document.querySelector(`.auth-tab[data-tab="${tabId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Afficher le formulaire correspondant
        const activeForm = document.getElementById(`${tabId}-form`);
        if (activeForm) {
            activeForm.classList.add('active');
        }
        
        // Effacer les erreurs
        this.clearErrors();
    }
    
    setupForms() {
        // Formulaire de connexion
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Formulaire d'inscription
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        // Formulaire mot de passe oublié
        const forgotForm = document.getElementById('forgot-password-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }
        
        // Formulaire 2FA
        const twofaForm = document.getElementById('2fa-form');
        if (twofaForm) {
            twofaForm.addEventListener('submit', (e) => this.handleTwoFA(e));
        }
    }
    
    async handleLogin(e) {
        e.preventDefault();
        this.clearErrors();
        
        const email = document.getElementById('email')?.value.trim() || '';
        const password = document.getElementById('password')?.value || '';
        
        // Validation
        if (!email || !password) {
            this.showError('Veuillez remplir tous les champs.', 'login-form');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showError('Veuillez entrer une adresse email valide.', 'login-form');
            return;
        }
        
        // Désactiver le bouton pendant le traitement
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn?.innerHTML;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="button-text">Connexion...</span>';
        }
        
        try {
            // Appeler l'authentification
            const result = NovaAuth.login(email, password);
            
            if (result.success) {
                // Connexion réussie
                this.showSuccess('Connexion réussie ! Redirection en cours...', 'login-form');
                
                // Rediriger vers le dashboard après un court délai
                    setTimeout(() => {
                        window.location.href = 'profil.html';
                }, 1000);
            } else {
                // Échec de connexion
                this.showError(result.message || 'Erreur de connexion.', 'login-form');
                
                // Réactiver le bouton
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        } catch (error) {
            console.error('Erreur de connexion:', error);
            this.showError('Une erreur est survenue. Veuillez réessayer.', 'login-form');
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }
    
    async handleSignup(e) {
        e.preventDefault();
        this.clearErrors();
        
        const email = document.getElementById('signup-email')?.value.trim() || '';
        const firstName = document.getElementById('first-name')?.value.trim() || '';
        const lastName = document.getElementById('last-name')?.value.trim() || '';
        const password = document.getElementById('signup-password')?.value || '';
        const confirmPassword = document.getElementById('confirm-password')?.value || '';
        const termsAccepted = document.querySelector('input[name="terms"]')?.checked || false;
        
        // Validation
        if (!email || !firstName || !lastName || !password || !confirmPassword) {
            this.showError('Veuillez remplir tous les champs.', 'signup-form');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showError('Veuillez entrer une adresse email valide.', 'signup-form');
            return;
        }
        
        if (password.length < 8) {
            this.showError('Le mot de passe doit contenir au moins 8 caractères.', 'signup-form');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('Les mots de passe ne correspondent pas.', 'signup-form');
            return;
        }
        
        if (!termsAccepted) {
            this.showError('Vous devez accepter les conditions d\'utilisation.', 'signup-form');
            return;
        }
        
        // Désactiver le bouton
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn?.innerHTML;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="button-text">Création du compte...</span>';
        }
        
        try {
            // Inscription
            const result = NovaAuth.register({
                email,
                firstName,
                lastName,
                password
            });
            
            if (result.success) {
                // Inscription réussie
                this.showRegistrationSuccess(email, firstName);
            } else {
                // Échec de l'inscription
                this.showError(result.message || 'Erreur lors de la création du compte.', 'signup-form');
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
            }
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            this.showError('Une erreur est survenue. Veuillez réessayer.', 'signup-form');
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        }
    }
    
    handleForgotPassword(e) {
        e.preventDefault();
        this.clearErrors();
        
        const email = document.getElementById('reset-email')?.value.trim() || '';
        
        if (!this.isValidEmail(email)) {
            this.showError('Veuillez entrer une adresse email valide.', 'forgot-password-form');
            return;
        }
        
        // Simulation d'envoi d'email
        this.showSuccess(
            `Un lien de réinitialisation a été envoyé à <strong>${email}</strong> (simulation).`, 
            'forgot-password-form'
        );
        
        // Réinitialiser le formulaire après 3 secondes
        setTimeout(() => {
            e.target.reset();
            this.switchTab('login');
        }, 3000);
    }
    
    handleTwoFA(e) {
        e.preventDefault();
        this.clearErrors();
        
        // Récupérer le code 2FA
        const codeInputs = document.querySelectorAll('.code-input');
        let code = '';
        codeInputs.forEach(input => {
            code += input.value;
        });
        
        if (code.length !== 6) {
            this.showError('Veuillez entrer le code à 6 chiffres.', '2fa-form');
            return;
        }
        
        // Simulation de vérification 2FA
        this.showSuccess('Vérification 2FA réussie !', '2fa-form');
        
        setTimeout(() => {
              window.location.href = 'profil.html';
        }, 1000);
    }
    
    showRegistrationSuccess(email, firstName) {
        const signupForm = document.getElementById('signup-form');
        if (!signupForm) return;
        
        // Cacher le formulaire
        signupForm.style.display = 'none';
        
        // Afficher le message de succès
        const successHTML = `
            <div class="registration-success">
                <div class="success-icon">🎉</div>
                <h3>Compte créé avec succès !</h3>
                <p>Bienvenue dans la communauté Nova Systems, <strong>${firstName}</strong> !</p>
                <p>Un email de confirmation a été envoyé à <strong>${email}</strong></p>
                <div class="success-actions">
                    <button id="go-to-dashboard" class="btn-primary">
                        Accéder à mon tableau de bord
                    </button>
                    <button id="edit-profile" class="btn-secondary">
                        Compléter mon profil
                    </button>
                </div>
            </div>
        `;
        
        const container = signupForm.closest('.auth-card') || document.body;
        const successDiv = document.createElement('div');
        successDiv.innerHTML = successHTML;
        container.appendChild(successDiv);
        
        // Configurer les boutons
        document.getElementById('go-to-dashboard')?.addEventListener('click', () => {
              window.location.href = 'profil.html';
        });
        
        document.getElementById('edit-profile')?.addEventListener('click', () => {
            window.location.href = 'profil.html';
        });
    }
    
    setupPasswordToggle() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const input = this.closest('.form-group').querySelector('input[type="password"]');
                if (!input) return;
                
                if (input.type === 'password') {
                    input.type = 'text';
                    this.innerHTML = '🙈';
                    this.setAttribute('aria-label', 'Masquer le mot de passe');
                } else {
                    input.type = 'password';
                    this.innerHTML = '👁️';
                    this.setAttribute('aria-label', 'Afficher le mot de passe');
                }
            });
        });
    }
    
    setupCodeInputs() {
        const codeInputs = document.querySelectorAll('.code-input');
        if (!codeInputs.length) return;
        
        codeInputs.forEach((input, index) => {
            // Limiter à un seul caractère numérique
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^0-9]/g, '');
                
                if (this.value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                // Si tous les champs sont remplis, auto-soumettre
                const allFilled = Array.from(codeInputs).every(input => input.value.length === 1);
                if (allFilled) {
                    const form = this.closest('form');
                    if (form) {
                        setTimeout(() => form.submit(), 300);
                    }
                }
            });
            
            // Navigation avec les flèches et backspace
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && !this.value && index > 0) {
                    codeInputs[index - 1].focus();
                } else if (e.key === 'ArrowLeft' && index > 0) {
                    codeInputs[index - 1].focus();
                } else if (e.key === 'ArrowRight' && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
            });
        });
    }
    
    setupPasswordStrength() {
        const passwordInput = document.getElementById('signup-password');
        if (!passwordInput) return;
        
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            this.updatePasswordStrength(password);
        });
    }
    
    updatePasswordStrength(password) {
        const meter = document.querySelector('.strength-bar');
        const text = document.querySelector('.strength-text');
        const requirements = document.querySelectorAll('.requirement');
        
        if (!meter || !text) return;
        
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
        
        // Mettre à jour les exigences visuelles
        requirements.forEach(req => {
            const type = req.getAttribute('data-requirement');
            if (checks[type]) {
                req.classList.add('met');
                strength += 25;
            } else {
                req.classList.remove('met');
            }
        });
        
        // Mettre à jour le compteur
        meter.style.width = `${strength}%`;
        meter.setAttribute('data-strength', strength);
        
        // Mettre à jour le texte
        if (strength === 0) {
            meter.style.backgroundColor = '#ff4444';
            text.textContent = 'Force du mot de passe : très faible';
        } else if (strength <= 25) {
            meter.style.backgroundColor = '#ff7744';
            text.textContent = 'Force du mot de passe : faible';
        } else if (strength <= 50) {
            meter.style.backgroundColor = '#ffaa44';
            text.textContent = 'Force du mot de passe : moyenne';
        } else if (strength <= 75) {
            meter.style.backgroundColor = '#44cc44';
            text.textContent = 'Force du mot de passe : bonne';
        } else {
            meter.style.backgroundColor = '#00aa00';
            text.textContent = 'Force du mot de passe : excellente';
        }
    }
    
    showError(message, formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        this.clearErrors(form);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                <span>${message}</span>
            </div>
        `;
        
        form.prepend(errorDiv);
        
        // Supprimer automatiquement après 5 secondes
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
    
    showSuccess(message, formId) {
        const form = document.getElementById(formId);
        if (!form) return;
        
        this.clearErrors(form);
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <div class="success-message">
                <span class="success-icon">✅</span>
                <span>${message}</span>
            </div>
        `;
        
        form.prepend(successDiv);
        
        // Supprimer automatiquement après 3 secondes
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }
    
    clearErrors(form = null) {
        const target = form || document;
        const errors = target.querySelectorAll('.form-error, .form-success');
        errors.forEach(error => error.remove());
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// Initialiser l'interface de connexion
window.addEventListener('DOMContentLoaded', () => {
    window.ConnexionUI = new ConnexionUI();
});