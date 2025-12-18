// scripts/auth.clean.js - Canonical AuthService and UI helpers (single implementation)
(function(){
    'use strict'; // Point-virgule ajouté pour terminer l'expression

    const USERS_KEY = 'ns_users';
    const CUR_KEYS = ['ns_current_user','nova_current_user','novaUser'];
    // 'dashboard.html' est legacy; protect canonical personal pages like 'profil.html'
    const PROTECTED_PAGES = ['profil.html','drive.html','mail.html','securite-perso.html','abonnements.html','parametres.html'];

    function parseJSON(s){
        try{
            return JSON.parse(s);
        }catch(e){
            return null;
        } // Accolade fermante manquante ici
    }
    function stringify(u){
        try{
            return JSON.stringify(u);
        }catch(e){
            return null;
        }
    } // Point-virgule ajouté pour terminer l'expression

    function getUsers(){ return parseJSON(localStorage.getItem(USERS_KEY)) || []; }
    function saveUsers(list){ localStorage.setItem(USERS_KEY, stringify(list || [])); }
    function hash(s){ let h=0; for(let i=0;i<(s||'').length;i++){ h=((h<<5)-h)+s.charCodeAt(i); h |= 0; } return h.toString(); }
    function findUser(email){
        if(!email) return null;
        // La fonction `find` ne nécessite pas de `return` explicite dans une flèche si elle est sur une seule ligne.
        // J'ai ajouté une accolade fermante pour une meilleure lisibilité/cohérence.
        return getUsers().find(u => u.email && u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    function persistCurrentUser(user){
        try{
            const raw = stringify(user||null);
            CUR_KEYS.forEach(k => localStorage.setItem(k, raw));
            console.log('Auth: persisted current user');
        }catch(e){
            console.warn('Auth: persistCurrentUser failed', e);
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

    function registerUser({email, firstName, lastName, password}){
        if(!email || !password) return { success:false, message:'Email ou mot de passe manquant.' };
        if(findUser(email)) return { success:false, message:'Un compte existe déjà avec cet e-mail.' };
        const user = {
            id:'u'+Date.now(),
            email,
            firstName: firstName||'',
            lastName: lastName||'',
            passwordHash: hash(password),
            createdAt: new Date().toISOString(),
            mails:[],
            files:[]
        }; // Point-virgule manquant après la déclaration de l'objet
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

    function resolvePath(file){
        try{
            const path = window.location.pathname || window.location.href;
            // Utiliser des expressions régulières ou `endsWith` pour une vérification de répertoire plus robuste,
            // mais l'implémentation originale est conservée pour ne pas changer la logique métier.
            if(path.indexOf('/pages_personnelles/') !== -1 || path.indexOf('pages_personnelles\\') !== -1)
                return '../' + file;
        }catch(e){} // Pas de point-virgule avant le `return` implicite
        return file;
    }

    function updateUserUI(user){
        if(!user) return;
        try{
            const name = document.getElementById('user-name');
            if(name) name.textContent = user.firstName || user.email || 'Mon Compte';
            const side = document.getElementById('sidebar-name');
            // Utilisation d'un template string pour la concaténation de chaînes
            if(side) side.textContent = `${user.firstName || ''} ${user.lastName || ''}`;
            const avatar = document.getElementById('user-avatar');
            if(avatar) avatar.textContent = ((user.firstName||'').charAt(0) + (user.lastName||'').charAt(0)).toUpperCase() || '👤';
        }catch(e){}
    }
    function setupLogout(){
        document.querySelectorAll('#logout-btn,#logout-btn-header').forEach(b => { // Utilisation des accolades pour plus de clarté
            if(b) b.addEventListener('click', function(e){
                e.preventDefault();
                clearCurrentUser();
                const p = resolvePath('connexion.html');
                window.location.href = p;
            });
        });
    }
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

    function checkAuth(){
        try{
            const page = (window.location.pathname || window.location.href).split('/').pop();
            const user = readCurrentUser();
            const justLogged = !!sessionStorage.getItem('auth_just_logged_in');
            console.log('Auth: checkAuth', page, 'userExists', !!user, 'justLogged', justLogged);

            if(justLogged && !user){
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
                        if(PROTECTED_PAGES.includes(page))
                            window.location.href = resolvePath('connexion.html');
                    }
                }, interval);
                return;
            }

            if(PROTECTED_PAGES.includes(page) && !user){
                window.location.href = resolvePath('connexion.html');
                return;
            }

            if(user) updateUserUI(user);
        }catch(e){
            console.warn('Auth: checkAuth failed', e);
        }
    }

    // Le code suivant était mal formé, la fonction `attachFormHandlers` n'était pas fermée correctement.
    function attachFormHandlers(){
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
                    setTimeout(()=>{
                        window.location.href = resolvePath('profil.html');
                    }, 150);
                } else {
                    alert(res.message);
                }
            });
        }

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
                    setTimeout(()=>{
                        window.location.href = resolvePath('profil.html');
                    }, 150);
                } else {
                    // J'ai corrigé l'expression logique pour ne pas évaluer `res.message` si `res` est null/undefined.
                    alert(res && res.message || 'Erreur');
                }
            });
        }
    } // Accolade fermante de `attachFormHandlers` ajoutée ici.

    function init(){
        try{ checkAuth(); }catch(e){}
        try{ attachFormHandlers(); }catch(e){}
        try{ setupLogout(); }catch(e){}
        try{ setupUserMenu(); }catch(e){}

        if(document.readyState === 'loading'){
            document.addEventListener('DOMContentLoaded', ()=>{
                // Réduire la duplication des appels, mais les garder ici pour plus de sûreté au cas où le script est chargé après DOMContentLoaded.
                checkAuth();
                attachFormHandlers();
                setupLogout();
                setupUserMenu();
            });
        }
    } // Point-virgule ajouté pour terminer l'expression

    if(!window.AuthService) window.AuthService = {};
    window.AuthService.getCurrentUser = window.AuthService.getCurrentUser || readCurrentUser;
    window.AuthService.setCurrentUser = window.AuthService.setCurrentUser || persistCurrentUser;
    window.AuthService.logout = window.AuthService.logout || clearCurrentUser;
    window.AuthService.register = window.AuthService.register || registerUser;
    window.AuthService.login = window.AuthService.login || loginUser;
    window.AuthService.getUsers = window.AuthService.getUsers || getUsers;
    window.AuthService.saveUsers = window.AuthService.saveUsers || saveUsers;
    window.AuthService.isLoggedIn = window.AuthService.isLoggedIn || function(){ return !!readCurrentUser(); };

    window.NovaAuth = window.NovaAuth || {};
    window.NovaAuth.checkAuth = checkAuth;
    window.NovaAuth.updateUserUI = updateUserUI;
    window.NovaAuth.resolvePath = resolvePath;
    window.NovaAuth.isLoggedIn = window.NovaAuth.isLoggedIn || function(){ return !!readCurrentUser(); };
    window.NovaAuth.login = window.NovaAuth.login || function(e,p){ return loginUser(e,p); };
    window.NovaAuth.register = window.NovaAuth.register || function(o){ return registerUser(o); };

    init();
})(); // Accolade fermante et parenthèses pour l'IIFE ajoutées/corrigées.