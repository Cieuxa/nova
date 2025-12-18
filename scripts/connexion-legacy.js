// connexion-legacy.js — copie de l'ancienne implémentation (préservée pour compatibilité)
// (Ce fichier a été renommé depuis connexion.js pour éviter les doublons avec scripts/auth.js)
(function () {
    'use strict';

    // --- AuthService (singleton) ---
    const AuthService = (function () {
        const USERS_KEY = 'ns_users';
        const CURRENT_KEY = 'ns_current_user';

        function getUsers() {
            try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
            catch (e) { return []; }
        }
        function saveUsers(list) { localStorage.setItem(USERS_KEY, JSON.stringify(list || [])); }

        function hash(s) {
            let h = 0;
            for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
            return h.toString();
        }

        function findUser(email) {
            if (!email) return null;
            const list = getUsers();
            return list.find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
        }
        function saveUser(user) {
            const list = getUsers();
            const idx = list.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
            if (idx >= 0) list[idx] = user; else list.push(user);
            saveUsers(list);
        }

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

    // Expose for other scripts (profil.js may read it)
    window.AuthService = AuthService;

    // --- UI helpers ---
    function clearFormError(form) { const old = (form || document).querySelector('.form-error'); if (old) old.remove(); }
    function showFormError(message, form) {
        clearFormError(form);
        const targetForm = (form && form.querySelector) ? form : document;
        const insertTo = targetForm.querySelector('.auth-form.active') || targetForm.querySelector('.auth-form') || document.body;
        const el = document.createElement('div');
        el.className = 'form-error';
        el.innerHTML = `<div style="background:#ffdddd;color:#700;padding:10px;border-radius:6px;margin-bottom:8px;">⚠️ ${message}</div>`;
        insertTo.insertBefore(el, insertTo.firstChild);
    }

    function showSuccessMessage(email) {
        const signupForm = document.getElementById('signup-form');
        const successDiv = document.createElement('div'); successDiv.className = 'form-success';
        successDiv.innerHTML = '<div style="background:var(--success, #e6ffed);color:var(--text-light, #023);padding:1rem;border-radius:8px;text-align:center;">' +
            '<div style="font-size:2rem;margin-bottom:0.5rem;">🎉</div>' + `<h3>Compte créé avec succès !</h3><p>Bienvenue, <strong>${email}</strong></p>` + '<div style="margin-top:0.75rem;"><button id="continue-btn" class="btn-primary" style="padding:8px 12px;">Accéder à mon profil</button></div>' + '</div>';
            if (signupForm) {
            // Legacy implementation neutralized — use `scripts/auth.clean.js`.
            // This file has been intentionally replaced with a stub to avoid accidental usage.
            // The canonical authentication implementation lives in `scripts/auth.clean.js`.
            console.warn('connexion-legacy.js neutralized — use scripts/auth.clean.js');
        } else {
