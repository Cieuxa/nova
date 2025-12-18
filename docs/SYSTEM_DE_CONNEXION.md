# Système de Connexion - Mode Simulation

## Compte de Test Disponibles

Vous pouvez vous connecter avec l'un de ces comptes de démo :

### 1. Compte Démo Principal
- **Email** : demo@nova.com
- **Mot de passe** : Demo1234
- **Nom** : Jean Dupont

### 2. Compte Test
- **Email** : test@nova.com
- **Mot de passe** : Test1234
- **Nom** : Marie Martin

### 3. Compte Utilisateur
- **Email** : user@nova.com
- **Mot de passe** : User1234
- **Nom** : Thomas Bernard

## Fonctionnalités

✅ **Connexion** : Entrez un email et mot de passe valides pour vous connecter
✅ **Inscription** : Créez un nouveau compte avec n'importe quelle adresse email
✅ **Protection des pages** : Les pages protégées redirigent vers la connexion si vous n'êtes pas authentifié
✅ **Persistance** : Votre session persiste au rechargement de la page
✅ **Déconnexion** : Un bouton logout est disponible sur la page profil

## Comment ça fonctionne ?

- Les informations de connexion sont stockées localement (localStorage)
- Aucune donnée n'est envoyée vers un serveur
- Les nouveaux comptes créés existent uniquement pour la session en cours
- Au fermeture du navigateur, la session peut être réinitialisée

## Tests Recommandés

1. Allez sur `connexion.html`
2. Entrez l'email et le mot de passe d'un compte démo
3. Cliquez sur "Se connecter"
4. Vous devriez être redirigé vers `profil.html`
5. Le nom et les initiales devraient s'afficher
6. Le bouton logout devrait vous rediriger vers la connexion

---

**Note** : Ce système est une simulation à des fins de démonstration. Il n'y a pas de serveur backend ou de vraie authentification.
