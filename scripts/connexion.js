// ============================================
// FONCTIONNALITÉS SPÉCIFIQUES À LA PAGE CONNEXION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets (Connexion/Inscription)
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    if (authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Retirer la classe active de tous les onglets et formulaires
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                // Ajouter la classe active à l'onglet et au formulaire correspondants
                this.classList.add('active');
                document.getElementById(`${tabId}-form`).classList.add('active');
            });
        });
    }
    
    // Afficher/masquer le mot de passe
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.closest('.form-group').querySelector('input[type="password"]');
            
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });
    
    // Validation du mot de passe en temps réel
    const passwordInput = document.getElementById('signup-password');
    const passwordStrength = document.querySelector('.password-strength');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const requirements = document.querySelectorAll('.requirement');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Mettre à jour la barre de force
            if (strengthBar) {
                strengthBar.setAttribute('data-strength', strength.score);
                strengthBar.style.width = `${strength.score * 25}%`;
                
                // Changer la couleur en fonction du score
                if (strength.score <= 1) {
                    strengthBar.style.backgroundColor = 'var(--error)';
                    if (strengthText) strengthText.textContent = 'Faible';
                } else if (strength.score <= 2) {
                    strengthBar.style.backgroundColor = 'var(--warning)';
                    if (strengthText) strengthText.textContent = 'Moyenne';
                } else if (strength.score <= 3) {
                    strengthBar.style.backgroundColor = 'var(--warning)';
                    if (strengthText) strengthText.textContent = 'Bonne';
                } else {
                    strengthBar.style.backgroundColor = 'var(--success)';
                    if (strengthText) strengthText.textContent = 'Forte';
                }
            }
            
            // Mettre à jour les exigences
            if (requirements.length > 0) {
                // Longueur
                requirements[0].classList.toggle('valid', password.length >= 8);
                
                // Majuscule
                requirements[1].classList.toggle('valid', /[A-Z]/.test(password));
                
                // Chiffre
                requirements[2].classList.toggle('valid', /\d/.test(password));
                
                // Caractère spécial
                requirements[3].classList.toggle('valid', /[!@#$%^&*(),.?":{}|<>]/.test(password));
            }
        });
    }
    
    function calculatePasswordStrength(password) {
        let score = 0;
        
        // Longueur
        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        
        // Complexité
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        
        // Limiter le score à 4
        return {
            score: Math.min(4, score),
            length: password.length
        };
    }
    
    // Validation du formulaire d'inscription
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const terms = document.querySelector('input[name="terms"]').checked;
            
            // Validation
            let isValid = true;
            let errorMessage = '';
            
            // Validation de l'email
            if (!isValidEmail(email)) {
                isValid = false;
                errorMessage = 'Veuillez entrer une adresse email valide.';
            }
            
            // Validation du mot de passe
            else if (password.length < 8) {
                isValid = false;
                errorMessage = 'Le mot de passe doit contenir au moins 8 caractères.';
            }
            
            // Confirmation du mot de passe
            else if (password !== confirmPassword) {
                isValid = false;
                errorMessage = 'Les mots de passe ne correspondent pas.';
            }
            
            // Conditions d'utilisation
            else if (!terms) {
                isValid = false;
                errorMessage = 'Vous devez accepter les conditions d\'utilisation.';
            }
            
            if (isValid) {
                // Simulation de création de compte
                simulateAccountCreation(email);
            } else {
                showFormError(errorMessage);
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showFormError(message) {
        // Supprimer les anciennes erreurs
        const oldError = document.querySelector('.form-error');
        if (oldError) oldError.remove();
        
        // Créer le message d'erreur
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <div style="
                background: var(--error);
                color: var(--text-light);
                padding: var(--space-md);
                border-radius: var(--border-radius-md);
                margin-bottom: var(--space-lg);
                display: flex;
                align-items: center;
                gap: var(--space-sm);
            ">
                <span style="font-size: 1.2rem;">⚠️</span>
                <span>${message}</span>
            </div>
        `;
        
        // Insérer au début du formulaire
        const form = errorDiv.closest('.auth-form') || document.querySelector('.auth-form.active');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        // Supprimer après 5 secondes
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.style.opacity = '0';
                errorDiv.style.transition = 'opacity 0.3s ease';
                setTimeout(() => errorDiv.remove(), 300);
            }
        }, 5000);
    }
    
    function simulateAccountCreation(email) {
        const authButton = signupForm.querySelector('.auth-button');
        const originalText = authButton.innerHTML;
        
        // Montrer un état de chargement
        authButton.innerHTML = `
            <span class="button-text">Création du compte...</span>
            <div class="loading-spinner"></div>
        `;
        authButton.disabled = true;
        
        // Styles pour le spinner
        const spinnerStyles = `
            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: var(--text-light);
                animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = spinnerStyles;
        document.head.appendChild(styleElement);
        
        // Simulation d'une requête API
        setTimeout(() => {
            // Réinitialiser le bouton
            authButton.innerHTML = originalText;
            authButton.disabled = false;
            
            // Afficher un message de succès
            showSuccessMessage(email);
        }, 2000);
    }
    
    function showSuccessMessage(email) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = `
            <div style="
                background: var(--success);
                color: var(--text-light);
                padding: var(--space-xl);
                border-radius: var(--border-radius-lg);
                text-align: center;
                margin-bottom: var(--space-xl);
            ">
                <div style="font-size: 3rem; margin-bottom: var(--space-md);">🎉</div>
                <h3 style="margin-bottom: var(--space-sm); color: var(--text-light);">
                    Compte créé avec succès !
                </h3>
                <p style="margin-bottom: var(--space-lg); opacity: 0.9;">
                    Un email de confirmation a été envoyé à <strong>${email}</strong>
                </p>
                <div style="display: flex; gap: var(--space-sm); justify-content: center;">
                    <button class="btn-primary" id="continue-btn" style="background: var(--text-light); color: var(--success);">
                        Continuer vers Nova
                    </button>
                    <button class="btn-secondary" id="verify-btn" style="border-color: var(--text-light); color: var(--text-light);">
                        Vérifier l'email
                    </button>
                </div>
            </div>
        `;
        
        // Remplacer le formulaire par le message de succès
        const formContainer = signupForm.closest('.auth-card');
        if (formContainer) {
            const forms = formContainer.querySelectorAll('.auth-form');
            forms.forEach(form => form.style.display = 'none');
            formContainer.appendChild(successDiv);
            
            // Gérer les boutons du message de succès
            document.getElementById('continue-btn').addEventListener('click', function() {
                // Redirection vers la page d'accueil
                window.location.href = 'index.html';
            });
            
            document.getElementById('verify-btn').addEventListener('click', function() {
                // Simuler la vérification d'email
                alert('En production, vous seriez redirigé vers votre boîte email.');
            });
        }
    }
    
    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                simulateLogin(email);
            } else {
                showFormError('Veuillez remplir tous les champs.');
            }
        });
    }
    
    function simulateLogin(email) {
        const authButton = loginForm.querySelector('.auth-button');
        const originalText = authButton.innerHTML;
        
        // Montrer un état de chargement
        authButton.innerHTML = `
            <span class="button-text">Connexion en cours...</span>
            <div class="loading-spinner"></div>
        `;
        authButton.disabled = true;
        
        // Simulation d'une requête API
        setTimeout(() => {
            // Réinitialiser le bouton
            authButton.innerHTML = originalText;
            authButton.disabled = false;
            
            // Simuler une connexion réussie (en production, rediriger)
            alert(`Connexion réussie pour ${email}\n\nEn production, vous seriez redirigé vers votre tableau de bord.`);
        }, 1500);
    }
    
    // Gestion du formulaire de réinitialisation
    const forgotForm = document.getElementById('forgot-password-form');
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('reset-email').value;
            
            if (isValidEmail(email)) {
                simulatePasswordReset(email);
            } else {
                showFormError('Veuillez entrer une adresse email valide.');
            }
        });
    }
    
    function simulatePasswordReset(email) {
        const authButton = forgotForm.querySelector('.auth-button');
        const originalText = authButton.innerHTML;
        
        // Montrer un état de chargement
        authButton.innerHTML = `
            <span class="button-text">Envoi en cours...</span>
            <div class="loading-spinner"></div>
        `;
        authButton.disabled = true;
        
        // Simulation d'envoi d'email
        setTimeout(() => {
            // Réinitialiser le bouton
            authButton.innerHTML = originalText;
            authButton.disabled = false;
            
            // Afficher un message de succès
            showResetSuccess(email);
        }, 1500);
    }
    
    function showResetSuccess(email) {
        const successDiv = document.createElement('div');
        successDiv.className = 'reset-success';
        successDiv.innerHTML = `
            <div style="
                background: var(--info);
                color: var(--text-light);
                padding: var(--space-xl);
                border-radius: var(--border-radius-lg);
                text-align: center;
                margin-top: var(--space-xl);
            ">
                <div style="font-size: 2rem; margin-bottom: var(--space-md);">📧</div>
                <h3 style="margin-bottom: var(--space-sm); color: var(--text-light);">
                    Email envoyé !
                </h3>
                <p style="margin-bottom: var(--space-md); opacity: 0.9;">
                    Un lien de réinitialisation a été envoyé à <strong>${email}</strong>
                </p>
                <p style="font-size: var(--font-size-sm); opacity: 0.8;">
                    Vérifiez votre boîte de réception et vos spams.
                </p>
            </div>
        `;
        
        // Insérer après le formulaire
        forgotForm.appendChild(successDiv);
        
        // Supprimer après 10 secondes
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.style.opacity = '0';
                successDiv.style.transition = 'opacity 0.3s ease';
                setTimeout(() => successDiv.remove(), 300);
            }
        }, 10000);
    }
    
    // Gestion du code 2FA
    const codeInputs = document.querySelectorAll('.code-input');
    
    if (codeInputs.length > 0) {
        codeInputs.forEach((input, index) => {
            input.addEventListener('input', function() {
                // Se déplacer vers l'input suivant quand on tape un caractère
                if (this.value.length === 1 && index < codeInputs.length - 1) {
                    codeInputs[index + 1].focus();
                }
                
                // Vérifier si tous les inputs sont remplis
                check2FACode();
            });
            
            input.addEventListener('keydown', function(e) {
                // Se déplacer vers l'input précédent avec Backspace
                if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                    codeInputs[index - 1].focus();
                }
            });
        });
    }
    
    function check2FACode() {
        let code = '';
        codeInputs.forEach(input => {
            code += input.value;
        });
        
        if (code.length === 6) {
            // Code complet - simuler la vérification
            simulate2FAVerification(code);
        }
    }
    
    function simulate2FAVerification(code) {
        const authButton = document.querySelector('#2fa-form .auth-button');
        const originalText = authButton.innerHTML;
        
        // Montrer un état de chargement
        authButton.innerHTML = `
            <span class="button-text">Vérification...</span>
            <div class="loading-spinner"></div>
        `;
        authButton.disabled = true;
        
        // Simulation de vérification
        setTimeout(() => {
            // Réinitialiser le bouton
            authButton.innerHTML = originalText;
            authButton.disabled = false;
            
            // Simuler une vérification réussie
            alert(`Code 2FA vérifié avec succès !\nCode: ${code}\n\nEn production, vous seriez connecté.`);
        }, 1000);
    }
    
    // Authentification sociale
    const socialButtons = document.querySelectorAll('.social-button');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.querySelector('.social-text').textContent;
            simulateSocialAuth(provider);
        });
    });
    
    function simulateSocialAuth(provider) {
        const modal = document.createElement('div');
        modal.className = 'social-auth-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div style="text-align: center; padding: var(--space-xl);">
                    <div style="font-size: 3rem; margin-bottom: var(--space-md);">🔐</div>
                    <h3 style="margin-bottom: var(--space-sm);">
                        Connexion avec ${provider}
                    </h3>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-xl);">
                        Redirection vers ${provider}...
                    </p>
                    <div class="loading">
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                        <div class="loading-dot"></div>
                    </div>
                    <p style="color: var(--text-tertiary); font-size: var(--font-size-sm); margin-top: var(--space-xl);">
                        En production, vous seriez redirigé vers ${provider} pour l'authentification.
                    </p>
                </div>
            </div>
        `;
        
        // Styles similaires à ceux du support
        const modalStyles = `
            .social-auth-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            
            .social-auth-modal .modal-content {
                background: var(--bg-primary);
                border-radius: var(--border-radius-lg);
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.3s ease;
            }
            
            .social-auth-modal .loading {
                display: flex;
                justify-content: center;
                gap: var(--space-sm);
            }
            
            .social-auth-modal .loading-dot {
                width: 12px;
                height: 12px;
                background: var(--nova-blue);
                border-radius: 50%;
                animation: bounce 1.4s infinite ease-in-out;
            }
            
            .social-auth-modal .loading-dot:nth-child(1) { animation-delay: -0.32s; }
            .social-auth-modal .loading-dot:nth-child(2) { animation-delay: -0.16s; }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = modalStyles;
        document.head.appendChild(styleElement);
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Fermer après 3 secondes
        setTimeout(() => {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
                alert(`Simulation de connexion avec ${provider} terminée.\n\nEn production, vous seriez authentifié.`);
            }, 300);
        }, 3000);
    }
    
    // Navigation entre formulaires
    const forgotLink = document.querySelector('a[href="#forgot-password"]');
    const backLink = document.querySelector('.back-link');
    
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchToForm('forgot-password');
        });
    }
    
    if (backLink) {
        backLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchToForm('login');
        });
    }
    
    function switchToForm(formId) {
        // Masquer tous les formulaires
        authForms.forEach(form => form.classList.remove('active'));
        
        // Afficher le formulaire demandé
        document.getElementById(`${formId}-form`).classList.add('active');
        
        // Mettre à jour les onglets si nécessaire
        if (formId === 'login' || formId === 'signup') {
            authTabs.forEach(tab => tab.classList.remove('active'));
            document.querySelector(`.auth-tab[data-tab="${formId}"]`).classList.add('active');
        }
    }
});

// Styles pour la page connexion
const connexionStyles = `
    .auth-form {
        display: none;
        animation: fadeIn 0.3s ease;
    }
    
    .auth-form.active {
        display: block;
    }
    
    .code-input {
        font-size: var(--font-size-2xl);
        text-align: center;
        font-weight: var(--font-weight-bold);
    }
    
    .code-input.filled {
        border-color: var(--nova-blue);
        background-color: var(--bg-secondary);
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .requirement.valid {
        color: var(--success);
    }
    
    .requirement.valid::before {
        content: '✓';
        color: var(--success);
    }
    
    .form-error {
        animation: slideDown 0.3s ease;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Injecter les styles
const connexionStyleElement = document.createElement('style');
connexionStyleElement.textContent = connexionStyles;
document.head.appendChild(connexionStyleElement);