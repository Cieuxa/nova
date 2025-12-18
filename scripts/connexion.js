// Legacy file neutralized - functionality moved to `scripts/auth.js`.
// This file has been replaced with a stub to prevent accidental use.
console.warn('connexion.js neutralized — use scripts/auth.js');

    const AuthService = (function () {
        const USERS_KEY = 'ns_users';
        const CURRENT_KEY = 'ns_current_user';

        function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch (e) { return []; } }
        function saveUsers(list) { localStorage.setItem(USERS_KEY, JSON.stringify(list || [])); }

        function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; } return h.toString(); }

        function findUser(email) { if (!email) return null; const list = getUsers(); return list.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null; }
        function saveUser(user) { const list = getUsers(); const idx = list.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase()); if (idx >= 0) list[idx] = user; else list.push(user); saveUsers(list); }

        function register({ email, firstName, lastName, password }) {
            if (!email || !password) return { success: false, message: 'Email ou mot de passe manquant.' };
            if (findUser(email)) return { success: false, message: 'Un compte existe déjà avec cet e-mail.' };
            const user = { email, firstName: firstName || '', lastName: lastName || '', passwordHash: hash(password), createdAt: Date.now() };
            saveUser(user);
            setCurrentUser({ email: user.email, firstName: user.firstName, lastName: user.lastName });
            return { success: true, user };
        }

        function login(email, password) {
            const user = findUser(email);
            if (!user) return { success: false, message: 'Aucun compte trouvé pour cet e-mail.' };
            if (user.passwordHash !== hash(password)) return { success: false, message: 'Mot de passe incorrect.' };
            setCurrentUser({ email: user.email, firstName: user.firstName, lastName: user.lastName });
            return { success: true, user };
        }

        function setCurrentUser(user) { localStorage.setItem(CURRENT_KEY, JSON.stringify(user || null)); }
        function getCurrentUser() { try { return JSON.parse(localStorage.getItem(CURRENT_KEY) || 'null'); } catch (e) { return null; } }
        function isLoggedIn() { return !!getCurrentUser(); }
        function logout() { localStorage.removeItem(CURRENT_KEY); }

        return { getUsers, saveUsers, findUser, saveUser, register, login, setCurrentUser, getCurrentUser, isLoggedIn, logout };
    })();

    window.AuthService = AuthService;

    // UI helpers
    function clearFormError(form) { const old = (form || document).querySelector('.form-error'); if (old) old.remove(); }
    function showFormError(message, form) {
        clearFormError(form);
        const targetForm = (form && form.querySelector) ? form : document;
        const insertTo = targetForm.querySelector('.auth-form.active') || targetForm.querySelector('.auth-form') || document.body;
        const el = document.createElement('div'); el.className = 'form-error'; el.innerHTML = `<div style="background:#ffdddd;color:#700;padding:10px;border-radius:6px;margin-bottom:8px;">⚠️ ${message}</div>`;
        insertTo.insertBefore(el, insertTo.firstChild);
    }

    function showSuccessMessage(email) {
        const signupForm = document.getElementById('signup-form');
        const successDiv = document.createElement('div'); successDiv.className = 'form-success';
        successDiv.innerHTML = '<div style="background:var(--success, #e6ffed);color:var(--text-light, #023);padding:1rem;border-radius:8px;text-align:center;">' +
            '<div style="font-size:2rem;margin-bottom:0.5rem;">🎉</div>' + `<h3>Compte créé avec succès !</h3><p>Bienvenue, <strong>${email}</strong></p>` + '<div style="margin-top:0.75rem;"><button id="continue-btn" class="btn-primary" style="padding:8px 12px;">Accéder à mon profil</button></div>' + '</div>';
        if (signupForm) {
            const card = signupForm.closest('.auth-card') || document.body;
            card.querySelectorAll('.auth-form').forEach(f => f.style.display = 'none');
            card.appendChild(successDiv);
            document.getElementById('continue-btn').addEventListener('click', function () { window.location.href = 'profil.html'; });
        } else {
            alert('Compte créé — ' + email);
            window.location.href = 'profil.html';
        }
    }

    function performRegistration(data) { return AuthService.register(data); }
    function performLogin(email, password) { return AuthService.login(email, password); }

    // Main bindings
    document.addEventListener('DOMContentLoaded', () => {
        if (AuthService.isLoggedIn() && /connexion\.html$/.test(window.location.pathname)) { window.location.href = 'profil.html'; return; }

        document.querySelectorAll('.auth-tab').forEach(tab => tab.addEventListener('click', function () {
            const id = this.getAttribute('data-tab');
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            this.classList.add('active'); const target = document.getElementById(id + '-form'); if (target) target.classList.add('active');
        }));

        document.querySelectorAll('.toggle-btn').forEach(btn => btn.addEventListener('click', function () {
            const input = this.closest('.form-group').querySelector('input[type="password"]'); if (!input) return; input.type = input.type === 'password' ? 'text' : 'password'; this.textContent = input.type === 'password' ? '👁️' : '🙈';
        }));

        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault(); clearFormError(signupForm);
                const email = (document.getElementById('signup-email') || {}).value.trim();
                const firstName = (document.getElementById('first-name') || {}).value.trim();
                const lastName = (document.getElementById('last-name') || {}).value.trim();
                const password = (document.getElementById('signup-password') || {}).value || '';
                const confirm = (document.getElementById('confirm-password') || {}).value || '';
                const termsEl = signupForm.querySelector('input[name="terms"]'); const terms = !!termsEl && termsEl.checked;
                if (!email || !firstName || !lastName || !password || !confirm) return showFormError('Veuillez remplir tous les champs.', signupForm);
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showFormError('Veuillez entrer une adresse email valide.', signupForm);
                if (password.length < 8) return showFormError('Le mot de passe doit contenir au moins 8 caractères.', signupForm);
                if (password !== confirm) return showFormError('Les mots de passe ne correspondent pas.', signupForm);
                if (!terms) return showFormError('Vous devez accepter les conditions d\'utilisation.', signupForm);
                const res = performRegistration({ email, firstName, lastName, password }); if (res.success) showSuccessMessage(email); else showFormError(res.message || 'Erreur lors de la création du compte.', signupForm);
            });
        }

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault(); clearFormError(loginForm);
                const email = (document.getElementById('email') || {}).value.trim(); const password = (document.getElementById('password') || {}).value || '';
                if (!email || !password) return showFormError('Veuillez remplir tous les champs.', loginForm);
                const res = performLogin(email, password); if (res.success) window.location.href = 'profil.html'; else showFormError(res.message || 'Erreur de connexion.', loginForm);
            });
        }

        const forgotForm = document.getElementById('forgot-password-form');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault(); clearFormError(forgotForm);
                const email = (document.getElementById('reset-email') || {}).value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showFormError('Veuillez entrer une adresse email valide.', forgotForm);
                const el = document.createElement('div'); el.className = 'reset-success'; el.innerHTML = `<div style="background:#eef6ff;padding:10px;border-radius:6px;">📧 Lien de réinitialisation envoyé à <strong>${email}</strong> (simulation)</div>`; forgotForm.appendChild(el); setTimeout(() => el.remove(), 7000);
            });
        }

        const codeInputs = document.querySelectorAll('.code-input'); if (codeInputs.length) { codeInputs.forEach((input, idx) => { input.addEventListener('input', function () { if (this.value.length === 1 && idx < codeInputs.length - 1) codeInputs[idx + 1].focus(); }); input.addEventListener('keydown', function (ev) { if (ev.key === 'Backspace' && !this.value && idx > 0) codeInputs[idx - 1].focus(); }); }); }

    });

    // Small UI-only styles injection
    const connexionStyles = `
    .auth-form{display:none}
    .auth-form.active{display:block}
    .form-error{animation:slideDown .25s ease}
    @keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
    `;
    const connexionStyleElement = document.createElement('style'); connexionStyleElement.textContent = connexionStyles; document.head.appendChild(connexionStyleElement);