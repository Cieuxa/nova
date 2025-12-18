(function(){
    'use strict';

    // 🔑 Clés et Constantes
    const USERS_KEY = 'ns_users';
    const CUR_KEYS = ['ns_current_user', 'nova_current_user', 'novaUser'];
    const PROTECTED_PAGES = ['dashboard.html','profil.html','drive.html','mail.html','securite-perso.html','abonnements.html','parametres.html'];

    // --- Helpers de base ---
    
    // JSON
    function parseJSON(s){ try{ return JSON.parse(s); }catch(e){ return null; } }
    function stringify(u){ try{ return JSON.stringify(u); }catch(e){ return null; } }

    // Storage
    function getUsers(){ return parseJSON(localStorage.getItem(USERS_KEY)) || []; }
    function saveUsers(list){ localStorage.setItem(USERS_KEY, stringify(list || [])); }
    
    // Hashing (Simple hash pour l'exemple, ne pas utiliser en production)
    function hash(s){ let h=0; for(let i=0;i<(s||'').length;i++){ h=((h<<5)-h)+s.charCodeAt(i); h |= 0; } return h.toString(); }
    
    function findUser(email){
        if(!email) return null;
        return getUsers().find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    // --- Gestion de l'utilisateur courant ---
    
    function persistCurrentUser(user){
        try{
            const raw = stringify(user || null);
            CUR_KEYS.forEach(k => localStorage.setItem(k, raw));
            console.log('Auth: persisted current user');
        }catch(e){
            console.warn('Auth: persist current user failed', e);
        }
    }
    
    function readCurrentUser(){
        for(const k of CUR_KEYS){
            const raw = localStorage.getItem(k);
            if(raw){
                const p = parseJSON(raw);
                if(p) return p;
            }
        }
        return null;
    }
    
    function clearCurrentUser(){ CUR_KEYS.forEach(k => localStorage.removeItem(k)); }

    // --- Logique Métier (Register/Login) ---
    
    function registerUser({email, firstName, lastName, password}){
        if(!email || !password) return { success:false, message:'Email ou mot de passe manquant.' };
        if(findUser(email)) return { success:false, message:'Un compte existe déjà avec cet e-mail.' };
        
        const user = {
            id:'u'+Date.now(),
            email,
            firstName: firstName || '',
            lastName: lastName || '',
            passwordHash: hash(password),
            createdAt: new Date().toISOString(),
            mails:[],
            files:[]
        };
        // Données initiales
        user.mails = [{ id:'m1', from:'welcome@nova.systems', subject:'Bienvenue', body:'Bienvenue !', date: Date.now() }];
        user.files = [{ id:'f1', name:'Demo.txt', size:'1KB', date: Date.now() }];
        
        const list = getUsers();
        list.push(user);
        saveUsers(list);
        persistCurrentUser(user);
        
        return { success:true, user };
    }

    function loginUser(email, password){
        const u = findUser(email);
        if(!u) return { success:false, message:'Aucun compte trouvé.'};
        if(u.passwordHash !== hash(password)) return { success:false, message:'Mot de passe incorrect.'};
        persistCurrentUser(u);
        return { success:true, user: u };
    }

    // --- Helpers d'Interface (UI) et Navigation ---
    
    // Résolution de chemin pour les pages personnelles
    function resolvePath(file){
        try{
            const path = window.location.pathname || window.location.href;
            if(path.indexOf('/pages_personnelles/') !== -1 || path.indexOf('pages_personnelles\\') !== -1)
                return '../' + file;
        }catch(e){}
        return file;
    }

    // Mise à jour des éléments d'interface utilisateur (nom, avatar)
    function updateUserUI(user){
        if(!user) return;
        try{
            const name = document.getElementById('user-name');
            if(name) name.textContent = user.firstName || user.email || 'Mon Compte';
            const side = document.getElementById('sidebar-name');
            if(side) side.textContent = `${user.firstName || ''} ${user.lastName || ''}`;
            const avatar = document.getElementById('user-avatar');
            if(avatar) avatar.textContent = ((user.firstName||'').charAt(0) + (user.lastName||'').charAt(0)).toUpperCase() || '👤';
        }catch(e){}
    }
    
    // Configuration du bouton de déconnexion
    function setupLogout(){
        document.querySelectorAll('#logout-btn,#logout-btn-header').forEach(b => b && b.addEventListener('click', function(e){
            e.preventDefault();
            clearCurrentUser();
            window.location.href = resolvePath('connexion.html');
        }));
    }
    
    // Configuration du menu utilisateur
    function setupUserMenu(){
        const btn = document.getElementById('user-menu-btn');
        const menu = document.querySelector('.dropdown-menu');
        if(btn && menu){
            btn.addEventListener('click', ()=> menu.classList.toggle('show'));
            document.addEventListener('click', (e) => {
                if(!btn.contains(e.target) && !menu.contains(e.target))
                    menu.classList.remove('show');
            });
        }
    }

    // Vérification d'authentification (avec boucle de réessai robuste)
    function checkAuth(){
        try{
            const page = (window.location.pathname || window.location.href).split('/').pop();
            const user = readCurrentUser();
            const justLogged = !!sessionStorage.getItem('auth_just_logged_in');
            console.log('Auth: checkAuth', page, 'userExists', !!user, 'justLogged', justLogged);

            if(justLogged && !user){ // Boucle de réessai après une redirection post-login rapide
                sessionStorage.removeItem('auth_just_logged_in');
                let retries = 0;
                const maxRetries = 8;
                const interval = 200;
                const id = setInterval(()=>{
                    const u = readCurrentUser();
                    console.log('Auth: checkAuth retry', retries, 'user', !!u);
                    if(u){
                        clearInterval(id);
                        updateUserUI(u);
                        return;
                    }
                    retries++;
                    if(retries >= maxRetries){
                        clearInterval(id);
                        if(PROTECTED_PAGES.includes(page)) window.location.href = resolvePath('connexion.html');
                    }
                }, interval);
                return;
            }

            // Vérification standard de la page protégée
            if(PROTECTED_PAGES.includes(page) && !user){
                window.location.href = resolvePath('connexion.html');
                return;
            }
            if(user) updateUserUI(user);
        } catch(e){
            console.warn('Auth: checkAuth failed', e);
        }
    }

    // Attachement des gestionnaires de formulaires (Login/Signup)
    function attachFormHandlers(){
        // Signup
        const signup = document.getElementById('signup-form');
        if(signup){
            signup.addEventListener('submit', e => {
                e.preventDefault();
                const email = (document.getElementById('signup-email')||{}).value || '';
                const fn = (document.getElementById('first-name')||{}).value || '';
                const ln = (document.getElementById('last-name')||{}).value || '';
                const pw = (document.getElementById('signup-password')||{}).value || '';
                const cp = (document.getElementById('confirm-password')||{}).value || '';

                if(!email||!fn||!ln||!pw||!cp) return alert('Veuillez remplir tous les champs');
                if(pw!==cp) return alert('Les mots de passe ne correspondent pas');

                const res = registerUser({ email, firstName: fn, lastName: ln, password: pw });

                if(res.success){
                    sessionStorage.setItem('auth_just_logged_in','true');
                    setTimeout(()=>{ window.location.href = resolvePath('profil.html'); }, 150);
                } else {
                    alert(res.message);
                }
            });
        }

        // Login
        const login = document.getElementById('login-form');
        if(login){
            login.addEventListener('submit', e => {
                e.preventDefault();
                const email = (document.getElementById('email')||{}).value || '';
                const pw = (document.getElementById('password')||{}).value || '';

                if(!email||!pw) return alert('Veuillez remplir tous les champs');

                const res = loginUser(email, pw);

                if(res && res.success){
                    sessionStorage.setItem('auth_just_logged_in','true');
                    setTimeout(()=>{ window.location.href = resolvePath('profil.html'); }, 150);
                } else {
                    alert(res && res.message || 'Erreur');
                }
            });
        }
    }

    // --- Initialisation ---
    function init(){
        // Tentative d'exécution immédiate
        try{ checkAuth(); }catch(e){}
        try{ attachFormHandlers(); }catch(e){}
        try{ setupLogout(); }catch(e){}
        try{ setupUserMenu(); }catch(e){}

        // Réexécution après le chargement complet du DOM si nécessaire
        if(document.readyState === 'loading'){
            document.addEventListener('DOMContentLoaded', ()=>{
                checkAuth();
                attachFormHandlers();
                setupLogout();
                setupUserMenu();
            });
        }
    }

    // --- Exposition des Services (API Public) ---
    
    // AuthService (héritage/compatibilité)
    if(!window.AuthService) window.AuthService = {};
    window.AuthService.getCurrentUser = window.AuthService.getCurrentUser || readCurrentUser;
    window.AuthService.setCurrentUser = window.AuthService.setCurrentUser || persistCurrentUser;
    window.AuthService.logout = window.AuthService.logout || clearCurrentUser;
    window.AuthService.register = window.AuthService.register || registerUser;
    window.AuthService.login = window.AuthService.login || loginUser;
    window.AuthService.getUsers = window.AuthService.getUsers || getUsers;
    window.AuthService.saveUsers = window.AuthService.saveUsers || saveUsers;
    window.AuthService.isLoggedIn = window.AuthService.isLoggedIn || function(){ return !!readCurrentUser(); };

    // NovaAuth (nouveau nom de service)
    window.NovaAuth = window.NovaAuth || {};
    window.NovaAuth.checkAuth = checkAuth;
    window.NovaAuth.updateUserUI = updateUserUI;
    window.NovaAuth.resolvePath = resolvePath;
    window.NovaAuth.isLoggedIn = window.NovaAuth.isLoggedIn || function(){ return !!readCurrentUser(); };
    window.NovaAuth.login = window.NovaAuth.login || function(e,p){ return loginUser(e,p); };
    window.NovaAuth.register = window.NovaAuth.register || function(o){ return registerUser(o); };

    // Lancement du script
    init();
})();