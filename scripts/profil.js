// GESTION COMPLÈTE DU PROFIL UTILISATEUR
// ============================================
// ============================================
// PROFIL UTILISATEUR SIMPLE NOVA
// ============================================

// Toutes les récupérations d'utilisateur utilisent AuthService.getCurrentUser()
function saveUser(user) {
    // Update both legacy and new storage keys to maintain compatibility
    try {
        const keys = ['ns_users', 'nova_users'];
        keys.forEach(key => {
            const list = JSON.parse(localStorage.getItem(key) || '[]');
            const idx = list.findIndex(u => u.email === user.email);
            if (idx !== -1) list[idx] = user; else list.push(user);
            localStorage.setItem(key, JSON.stringify(list));
        });
        // Keep current user in sync
        if (window.AuthService && typeof window.AuthService.setCurrentUser === 'function') {
            window.AuthService.setCurrentUser(user);
        } else {
            localStorage.setItem('ns_current_user', JSON.stringify(user));
            localStorage.setItem('nova_current_user', JSON.stringify(user));
            localStorage.setItem('novaUser', JSON.stringify(user));
        }
    } catch (e) {
        console.warn('saveUser failed', e);
    }
}

function logout() {
    if (window.AuthService && typeof window.AuthService.logout === 'function') {
        window.AuthService.logout();
    } else {
        ['ns_current_user', 'nova_current_user', 'novaUser'].forEach(k => localStorage.removeItem(k));
    }
    const loginPath = (window.NovaAuth && typeof window.NovaAuth.resolvePath === 'function') ? window.NovaAuth.resolvePath('connexion.html') : (window.location.pathname.indexOf('/pages_personnelles/') !== -1 ? '../connexion.html' : 'connexion.html');
    window.location.href = loginPath;
}

document.addEventListener('DOMContentLoaded', function () {
    function doInit(user) {
        // Ajout automatique des mails et fichiers factices si manquants
        let updated = false;
        if (!user.mails) {
            user.mails = [
                {from: 'contact@nova.com', subject: 'Bienvenue sur NovaMail', date: '10/12/2025'},
                {from: 'support@nova.com', subject: 'Votre espace NovaDrive est prêt', date: '10/12/2025'},
                {from: 'info@nova.com', subject: 'Sécurité renforcée', date: '10/12/2025'}
            ];
            updated = true;
        }
        if (!user.files) {
            user.files = [
                {name: 'Document.pdf', size: '1.2 Mo'},
                {name: 'Photo.jpg', size: '0.5 Mo'},
                {name: 'Notes.txt', size: '0.1 Mo'},
                {name: 'Présentation.pptx', size: '2.0 Mo'},
                {name: 'Archive.zip', size: '0.8 Mo'}
            ];
            updated = true;
        }
        if (updated) saveUser(user);

        // Affichage des infos
        document.getElementById('sidebar-name').textContent = user.firstName + ' ' + user.lastName;
        document.getElementById('first-name').value = user.firstName;
        document.getElementById('last-name').value = user.lastName;
        document.getElementById('email').value = user.email;

        // Modification du profil
        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                user.firstName = document.getElementById('first-name').value.trim();
                user.lastName = document.getElementById('last-name').value.trim();
                saveUser(user);
                alert('Profil mis à jour !');
                location.reload();
            });
        }

        // Affichage des mails factices
        const mailList = document.getElementById('mail-list');
        if (mailList) {
            mailList.innerHTML = '';
            const mails = user.mails || [
                {from: 'contact@nova.com', subject: 'Bienvenue sur NovaMail', date: '10/12/2025'},
                {from: 'support@nova.com', subject: 'Votre espace NovaDrive est prêt', date: '10/12/2025'},
                {from: 'info@nova.com', subject: 'Sécurité renforcée', date: '10/12/2025'}
            ];
            mails.forEach(mail => {
                const div = document.createElement('div');
                div.className = 'mail-item';
                div.innerHTML = `<strong>${mail.subject}</strong><br><span>${mail.from}</span> <span style='float:right'>${mail.date}</span>`;
                mailList.appendChild(div);
            });
        }

        // Affichage des fichiers factices
        const fileList = document.getElementById('file-list');
        if (fileList) {
            fileList.innerHTML = '';
            const files = user.files || [
                {name: 'Document.pdf', size: '1.2 Mo'},
                {name: 'Photo.jpg', size: '0.5 Mo'},
                {name: 'Notes.txt', size: '0.1 Mo'},
                {name: 'Présentation.pptx', size: '2.0 Mo'},
                {name: 'Archive.zip', size: '0.8 Mo'}
            ];
            files.forEach(file => {
                const div = document.createElement('div');
                div.className = 'file-item';
                div.innerHTML = `<span>${file.name}</span> <span style='float:right'>${file.size}</span>`;
                fileList.appendChild(div);
            });
        }

        // Déconnexion
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) { logoutBtn.addEventListener('click', logout); }
        // Run profile init helpers
        initProfile(user); setupProfileForm();
    }

    let user = AuthService.getCurrentUser();
    if (!user) {
        const justLogged = sessionStorage.getItem('auth_just_logged_in');
        if (justLogged) {
            // delay briefly and retry once — protects against a race condition after login
            setTimeout(() => {
                user = AuthService.getCurrentUser();
                if (!user) {
                    const loginPath = (window.NovaAuth && typeof window.NovaAuth.resolvePath === 'function') ? window.NovaAuth.resolvePath('connexion.html') : (window.location.pathname.indexOf('/pages_personnelles/') !== -1 ? '../connexion.html' : 'connexion.html');
                    window.location.href = loginPath;
                } else {
                    doInit(user);
                }
            }, 500);
            sessionStorage.removeItem('auth_just_logged_in');
            return;
        } else {
            const loginPath = (window.NovaAuth && typeof window.NovaAuth.resolvePath === 'function') ? window.NovaAuth.resolvePath('connexion.html') : (window.location.pathname.indexOf('/pages_personnelles/') !== -1 ? '../connexion.html' : 'connexion.html');
            window.location.href = loginPath;
            return;
        }
    }
    // If we have a user already, initialize immediately
    doInit(user);
    // Ajout automatique des mails et fichiers factices si manquants
    let updated = false;
    if (!user.mails) {
        user.mails = [
            {from: 'contact@nova.com', subject: 'Bienvenue sur NovaMail', date: '10/12/2025'},
            {from: 'support@nova.com', subject: 'Votre espace NovaDrive est prêt', date: '10/12/2025'},
            {from: 'info@nova.com', subject: 'Sécurité renforcée', date: '10/12/2025'}
        ];
        updated = true;
    }
    if (!user.files) {
        user.files = [
            {name: 'Document.pdf', size: '1.2 Mo'},
            {name: 'Photo.jpg', size: '0.5 Mo'},
            {name: 'Notes.txt', size: '0.1 Mo'},
            {name: 'Présentation.pptx', size: '2.0 Mo'},
            {name: 'Archive.zip', size: '0.8 Mo'}
        ];
        updated = true;
    }
    if (updated) saveUser(user);

    // Affichage des infos
    document.getElementById('sidebar-name').textContent = user.firstName + ' ' + user.lastName;
    document.getElementById('first-name').value = user.firstName;
    document.getElementById('last-name').value = user.lastName;
    document.getElementById('email').value = user.email;

    // Modification du profil
    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            user.firstName = document.getElementById('first-name').value.trim();
            user.lastName = document.getElementById('last-name').value.trim();
            saveUser(user);
            alert('Profil mis à jour !');
            location.reload();
        });
    }

    // Affichage des mails factices
    const mailList = document.getElementById('mail-list');
    if (mailList) {
        mailList.innerHTML = '';
        const mails = user.mails || [
            {from: 'contact@nova.com', subject: 'Bienvenue sur NovaMail', date: '10/12/2025'},
            {from: 'support@nova.com', subject: 'Votre espace NovaDrive est prêt', date: '10/12/2025'},
            {from: 'info@nova.com', subject: 'Sécurité renforcée', date: '10/12/2025'}
        ];
        mails.forEach(mail => {
            const div = document.createElement('div');
            div.className = 'mail-item';
            div.innerHTML = `<strong>${mail.subject}</strong><br><span>${mail.from}</span> <span style='float:right'>${mail.date}</span>`;
            mailList.appendChild(div);
        });
    }

    // Affichage des fichiers factices
    const fileList = document.getElementById('file-list');
    if (fileList) {
        fileList.innerHTML = '';
        const files = user.files || [
            {name: 'Document.pdf', size: '1.2 Mo'},
            {name: 'Photo.jpg', size: '0.5 Mo'},
            {name: 'Notes.txt', size: '0.1 Mo'},
            {name: 'Présentation.pptx', size: '2.0 Mo'},
            {name: 'Archive.zip', size: '0.8 Mo'}
        ];
        files.forEach(file => {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.innerHTML = `<span>${file.name}</span> <span style='float:right'>${file.size}</span>`;
            fileList.appendChild(div);
        });
    }

    // Déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});


// Plus de double DOMContentLoaded ni de checkAuth : tout passe par AuthService.getCurrentUser()

function initProfile(user) {
    // Avatar avec initiales
    const avatarElement = document.getElementById('avatar-placeholder');
    if (avatarElement) {
        const initials = (user.firstName[0] + user.lastName[0]).toUpperCase();
        avatarElement.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2.5rem;
                font-weight: bold;
                color: white;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
            ">
                ${initials}
            </div>
        `;
    }

    // Nom dans la sidebar
    document.getElementById('sidebar-name').textContent = `${user.firstName} ${user.lastName}`;

    // Message de bienvenue
    document.getElementById('welcome-message').textContent = `Bienvenue, ${user.firstName}`;

    // Remplir le formulaire de profil
    document.getElementById('first-name').value = user.firstName || '';
    document.getElementById('last-name').value = user.lastName || '';
    document.getElementById('email').value = user.email || '';
}

function setupProfileForm() {
    const profileForm = document.getElementById('profile-form');
    const editModeBtn = document.getElementById('edit-mode-btn');
    const editActions = document.getElementById('edit-actions');
    const cancelBtn = document.getElementById('cancel-btn');
    const inputs = profileForm?.querySelectorAll('input');

    if (editModeBtn) {
        editModeBtn.addEventListener('click', function() {
            enableEditMode(inputs, editActions, editModeBtn);
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            const currentUser = AuthService.getCurrentUser();
            initProfile(currentUser);
            disableEditMode(inputs, editActions, editModeBtn);
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfileChanges(inputs, editActions, editModeBtn);
        });
    }
}

function enableEditMode(inputs, editActions, editModeBtn) {
    if (inputs) {
        inputs.forEach(input => {
            input.disabled = false;
            input.style.borderColor = 'var(--nova-blue)';
        });
    }
    if (editActions) {
        editActions.style.display = 'flex';
    }
    if (editModeBtn) {
        editModeBtn.style.display = 'none';
    }
}

function disableEditMode(inputs, editActions, editModeBtn) {
    if (inputs) {
        inputs.forEach(input => {
            input.disabled = true;
            input.style.borderColor = '';
        });
    }
    if (editActions) {
        editActions.style.display = 'none';
    }
    if (editModeBtn) {
        editModeBtn.style.display = 'inline-block';
    }
}

function saveProfileChanges(inputs, editActions, editModeBtn) {
    const firstNameInput = document.getElementById('first-name');
    const lastNameInput = document.getElementById('last-name');

    const updatedData = {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value
    };

    // Mettre à jour l'utilisateur
    AuthService.updateCurrentUser(updatedData);

    // Afficher un message de succès
    showSuccessNotification('Profil mis à jour avec succès !');

    // Recharger les informations affichées
    const updatedUser = AuthService.getCurrentUser();
    initProfile(updatedUser);

    // Désactiver le mode édition
    disableEditMode(inputs, editActions, editModeBtn);
}

function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
                AuthService.logout();
                const loginPath = (window.NovaAuth && typeof window.NovaAuth.resolvePath === 'function') ? window.NovaAuth.resolvePath('connexion.html') : (window.location.pathname.indexOf('/pages_personnelles/') !== -1 ? '../connexion.html' : 'connexion.html');
                window.location.href = loginPath;
            }
        });
    }
}

function loadMails() {
    const currentUser = AuthService.getCurrentUser();
    const mailList = document.getElementById('mail-list');

    if (!mailList || !currentUser.mails) return;

    mailList.innerHTML = '';

    const displayMails = currentUser.mails.slice(0, 3);

    displayMails.forEach(mail => {
        const mailItem = document.createElement('div');
        mailItem.className = 'mail-item';
        mailItem.innerHTML = `
            <div style="
                padding: var(--space-sm);
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: background 0.2s;
                display: flex;
                gap: var(--space-sm);
                align-items: center;
            " onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 1.5rem; flex-shrink: 0;">${mail.avatar || '📧'}</span>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; color: var(--text-primary);">${mail.from}</div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${mail.subject}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-tertiary);">
                        ${formatDate(mail.date)}
                    </div>
                </div>
                ${!mail.read ? '<span style="width: 8px; height: 8px; background: var(--nova-blue); border-radius: 50%; flex-shrink: 0;"></span>' : ''}
            </div>
        `;

        mailItem.addEventListener('click', function() {
            showMailDetail(mail);
        });

        mailList.appendChild(mailItem);
    });

    if (displayMails.length === 0) {
        mailList.innerHTML = '<p style="padding: var(--space-md); color: var(--text-secondary); text-align: center;">Aucun email</p>';
    }
}

function showMailDetail(mail) {
    const modal = document.createElement('div');
    modal.className = 'mail-modal';
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 20px;
        ">
            <div style="
                background: var(--bg-primary);
                border-radius: var(--border-radius-lg);
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            ">
                <div style="
                    padding: var(--space-lg);
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0;">${mail.subject}</h3>
                    <button onclick="this.closest('.mail-modal').remove()" style="
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        cursor: pointer;
                        color: var(--text-secondary);
                    ">×</button>
                </div>
                <div style="padding: var(--space-lg);">
                    <div style="
                        display: flex;
                        gap: var(--space-md);
                        margin-bottom: var(--space-lg);
                        padding-bottom: var(--space-lg);
                        border-bottom: 1px solid var(--border-color);
                    ">
                        <span style="font-size: 2rem; flex-shrink: 0;">${mail.avatar || '📧'}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; color: var(--text-primary);">${mail.from}</div>
                            <div style="color: var(--text-secondary); font-size: 0.9rem;">${mail.email}</div>
                            <div style="color: var(--text-tertiary); font-size: 0.85rem;">
                                ${new Date(mail.date).toLocaleString('fr-FR')}
                            </div>
                        </div>
                    </div>
                    <div style="line-height: 1.6; color: var(--text-primary);">
                        ${mail.body}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function loadFiles() {
    const currentUser = AuthService.getCurrentUser();
    const fileList = document.getElementById('file-list');

    if (!fileList || !currentUser.files) return;

    fileList.innerHTML = '';

    currentUser.files.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div style="
                padding: var(--space-sm);
                border-bottom: 1px solid var(--border-color);
                display: flex;
                gap: var(--space-sm);
                align-items: center;
                cursor: pointer;
                transition: background 0.2s;
            " onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='transparent'">
                <span style="font-size: 1.5rem; flex-shrink: 0;">${file.icon}</span>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 500; color: var(--text-primary);">
                        ${file.name}
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">
                        ${formatFileSize(file.size)} • ${file.date}
                    </div>
                </div>
            </div>
        `;

        fileItem.addEventListener('click', function() {
            alert(`Fichier: ${file.name}\n\nCeci est un fichier fictif dans la démo.`);
        });

        fileList.appendChild(fileItem);
    });

    if (currentUser.files.length === 0) {
        fileList.innerHTML = '<p style="padding: var(--space-md); color: var(--text-secondary); text-align: center;">Aucun fichier</p>';
    }
}

function updateSecurityInfo() {
    const currentUser = AuthService.getCurrentUser();
    const lastLoginElement = document.getElementById('last-login');

    if (lastLoginElement && currentUser.lastLogin) {
        const lastLogin = new Date(currentUser.lastLogin);
        lastLoginElement.textContent = `${lastLogin.toLocaleDateString('fr-FR')} à ${lastLogin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Hier';
    } else {
        return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' });
    }
}

function formatFileSize(size) {
    if (size < 1) {
        return (size * 1024).toFixed(0) + ' KB';
    } else if (size < 1024) {
        return size.toFixed(1) + ' MB';
    } else {
        return (size / 1024).toFixed(1) + ' GB';
    }
}

function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success);
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}
