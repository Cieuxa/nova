# 🏗️ Architecture Technique - Système de Connexion

## Vue d'Ensemble

Le système de connexion est basé sur une **architecture client-side (côté navigateur)** avec persistence locale.

```
┌─────────────────────────────────────────────────────┐
│         NAVIGATEUR UTILISATEUR (Frontend)          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │     Pages HTML (HTML + CSS)                  │  │
│  │  - connexion.html                            │  │
│  │  - profil.html                               │  │
│  │  - test-connexion.html                       │  │
│  │  - diagnostic.html                           │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │  Scripts JavaScript                          │  │
│  │  - mock-auth.js (Service d'auth)             │  │
│  │  - protect-pages.js (Vérification pages)     │  │
│  └──────────────────────────────────────────────┘  │
│                        ↓                            │
│  ┌──────────────────────────────────────────────┐  │
│  │  localStorage (Persistance locale)           │  │
│  │  - Clé: 'nova_mock_user'                     │  │
│  │  - Contenu: JSON d'utilisateur               │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
                        ↕
                    (Aucun serveur)
```

## Composants Principaux

### 1. **mock-auth.js** - Service d'Authentification

Responsable de:
- ✅ Gestion des comptes de démo
- ✅ Enregistrement de nouveaux utilisateurs
- ✅ Connexion (validation email/password)
- ✅ Déconnexion
- ✅ Gestion du formulaire de connexion

**Comptes intégrés:**
```javascript
{
    'demo@nova.com': { email, firstName, lastName, password },
    'test@nova.com': { ... },
    'user@nova.com': { ... }
}
```

**Méthodes principales:**
```javascript
AuthService.login(email, password)      // Connexion
AuthService.register(email, fname, lname, pwd)  // Enregistrement
AuthService.getCurrentUser()            // Utilisateur actuel
AuthService.isLoggedIn()                // Vérifier connexion
AuthService.logout()                    // Déconnexion
```

**Stockage:**
```javascript
localStorage.setItem('nova_mock_user', JSON.stringify(user))
localStorage.getItem('nova_mock_user')  // Récupérer
localStorage.removeItem('nova_mock_user') // Effacer
```

### 2. **protect-pages.js** - Protection des Pages

Responsable de:
- ✅ Vérifier l'authentification à la charge
- ✅ Rediriger les non-authentifiés vers connexion.html
- ✅ Mettre à jour l'interface utilisateur
- ✅ Gérer les boutons de déconnexion
- ✅ Empêcher les boucles infinies

**Flux de protection:**
```
Page chargée
    ↓
Est-ce une page protégée? (profil.html, etc.)
    ↓ OUI
Utilisateur connecté?
    ↓ NON → Redirection vers connexion.html
    ↓ OUI
Mettre à jour l'UI (nom, avatar)
```

### 3. **connexion.html** - Page de Connexion

Contient:
- ✅ Formulaire de connexion (email + password)
- ✅ Formulaire d'enregistrement (email + name + password)
- ✅ Formulaire "Mot de passe oublié" (simulation)
- ✅ Onglets pour basculer entre formulaires
- ✅ Validation côté client
- ✅ Messages d'erreur/succès

**Scripts chargés:**
```html
<script src="scripts/menu.js"></script>
<script src="scripts/mock-auth.js"></script>
```

### 4. **profil.html** - Page Protégée

Affiche:
- ✅ Avatar avec initiales
- ✅ Nom et prénom de l'utilisateur
- ✅ Informations personnelles
- ✅ Bouton de déconnexion

**Scripts chargés:**
```html
<script src="scripts/protect-pages.js"></script>
<script src="scripts/profil.js"></script>
```

## Flux de Données

### Connexion - Étape par Étape

```
1. Utilisateur ouvre connexion.html
   ↓
2. mock-auth.js charge et vérifie si déjà connecté
   ↓ OUI → Redirection vers profil.html
   ↓ NON
3. Formulaire de connexion affiché
   ↓
4. Utilisateur remplit email + password
   ↓
5. Submit → Validation côté client
   ↓
6. AuthService.login(email, password) appelé
   ↓
7. Vérification des identifiants
   ↓ VALIDE
8. localStorage.setItem('nova_mock_user', JSON.stringify(user))
   ↓
9. Redirection vers profil.html (après 300ms)
   ↓
10. protect-pages.js détecte l'utilisateur
    ↓
11. Mise à jour de l'interface (nom, avatar)
    ↓
12. Affichage du profil
```

### Déconnexion - Étape par Étape

```
1. Utilisateur clique sur bouton logout
   ↓
2. localStorage.removeItem('nova_mock_user')
   ↓
3. Redirection vers connexion.html
   ↓
4. Formulaire de connexion à nouveau vierge
```

### Protection des Pages

```
1. Utilisateur accède à profil.html
   ↓
2. protect-pages.js s'exécute immédiatement
   ↓
3. Vérification: localStorage.getItem('nova_mock_user')
   ↓ AUCUN
4. Redirection vers connexion.html (window.location.replace)
   ↓
5. Pas de boucle infinie car replace() efface l'historique
```

## Stockage des Données

### Structure localStorage

**Clé:** `nova_mock_user`

**Valeur (JSON):**
```json
{
    "email": "demo@nova.com",
    "firstName": "Jean",
    "lastName": "Dupont"
}
```

**Taille:** ~50-100 bytes par utilisateur

**Persistance:** Jusqu'à fermeture du navigateur ou suppression manuelle

## Points Clés de Conception

### ✅ Pas de Boucles Infinies
- Utilisation de `window.location.replace()` au lieu de `.href`
- `replace()` remplace l'entrée historique, évite les boucles

### ✅ Vérification Unique
- La vérification d'auth se fait UNE SEULE FOIS au chargement
- Pas de vérification répétée/asynchrone

### ✅ Persistence de Session
- Utilise localStorage pour la persistance
- localStorage n'est pas affecté par le rechargement
- Reste tant que le navigateur n'est pas fermé (ou cache vidé)

### ✅ Simplicitié
- Comptes prédéfinis + création de nouveaux comptes
- Pas de backend/serveur à déployer
- Fonctionne partout (local, CDN, serveur)

### ✅ Isolation des Modules
- `mock-auth.js` = Authentification pure
- `protect-pages.js` = Vérification de pages
- Chaque script a une responsabilité

## Configuration

Modifiez les comptes de démo dans **mock-auth.js:**

```javascript
const DEMO_ACCOUNTS = {
    'email@domain.com': { 
        email: 'email@domain.com', 
        firstName: 'John', 
        lastName: 'Doe', 
        password: 'Password123' 
    },
    // Ajoutez plus de comptes ici
};
```

Modifiez les pages protégées dans **protect-pages.js:**

```javascript
const PROTECTED_PAGES = [
    'profil.html',
    'autre-page.html'  // Ajoutez vos pages
];
```

## Déploiement

1. Copiez tous les fichiers sur votre serveur
2. Ouvrez `connexion.html` dans un navigateur
3. Testez avec les comptes de démo
4. C'est tout ! Aucune installation nécessaire

## Performance

- ⚡ Chargement instantané (pas de requêtes serveur)
- ⚡ localStorage ultra-rapide (<1ms)
- ⚡ Aucun délai d'authentification

## Compatibilité

- ✅ Chrome / Edge (v90+)
- ✅ Firefox (v88+)
- ✅ Safari (v14+)
- ✅ Tous navigateurs modernes
- ✅ Mobile (iOS/Android)

**Note:** localStorage doit être activé. En mode "Navigation privée", localStorage peut être limité.

---

**Version:** 1.0
**Dernière mise à jour:** Décembre 2024
**Prêt pour:** Production de démo
