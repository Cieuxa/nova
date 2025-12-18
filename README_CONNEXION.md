# 🔐 Système de Connexion - Instructions

Bienvenue dans le système de connexion simulé de Nova Systems.

## 🚀 Démarrage Rapide

### Accès à la Connexion
1. Ouvrez `connexion.html` dans votre navigateur
2. Vous verrez le formulaire de connexion avec deux onglets:
   - **Connexion** - Pour se connecter avec un compte existant
   - **Créer un compte** - Pour créer un nouveau compte

### Connexion avec un Compte Démo

Vous pouvez immédiatement vous connecter avec un des comptes de démo:

```
Email: demo@nova.com
Mot de passe: Demo1234
```

Après connexion réussie, vous serez redirigé vers votre profil où vous verrez:
- Votre nom affiché
- Vos initiales en avatar
- Vos informations personnelles

## 📋 Comptes Disponibles

| Email | Mot de passe | Nom |
|-------|-------------|-----|
| demo@nova.com | Demo1234 | Jean Dupont |
| test@nova.com | Test1234 | Marie Martin |
| user@nova.com | User1234 | Thomas Bernard |

## ✨ Fonctionnalités Principales

### ✅ Connexion
- Entrez votre email et mot de passe
- Cliquez "Se connecter"
- Vous serez redirigé vers votre profil

### ✅ Créer un Compte
- Cliquez sur l'onglet "Créer un compte"
- Remplissez vos informations
- Votre nouveau compte sera créé immédiatement
- Vous serez connecté automatiquement

### ✅ Profil Utilisateur
- Page protégée accessible uniquement si connecté
- Affiche votre nom et informations
- Bouton de déconnexion

### ✅ Mot de Passe Oublié
- Cliquez sur "Mot de passe oublié ?"
- Entrez votre email
- (Simulation - ce n'est pas un vrai système)

### ✅ Gestion de la Session
- Votre session persiste lors du rechargement
- Déconnexion possible depuis le profil
- localStorage utilisé pour la persistance

## 🎨 Interface Utilisateur

### Affichage/Masquage du Mot de Passe
Cliquez sur l'icône 👁️ pour afficher ou masquer votre mot de passe

### Onglets
Basculez entre "Connexion" et "Créer un compte" avec les boutons en haut du formulaire

### Messages d'Erreur
Les erreurs s'affichent en rouge avec un message clair

### Messages de Succès
Les succès s'affichent en vert (comme la création de compte)

## 🧪 Pages de Test

### test-connexion.html
Une page simple pour vérifier votre statut et tester rapidement

### diagnostic.html
Un tableau de bord complet pour diagnostiquer et tester le système

## 💾 Comment Ça Marche ?

Tout fonctionne **localement dans votre navigateur**:

1. **Pas de serveur** - Aucune donnée n'est envoyée à un serveur
2. **Stockage local** - Les informations sont sauvegardées dans localStorage
3. **Simulation** - C'est une interface qui fonctionne comme un vrai système
4. **Session** - Votre connexion persiste jusqu'au fermeture complète du navigateur

## 📱 Appareils Supportés

- ✅ Ordinateurs de bureau
- ✅ Tablettes
- ✅ Téléphones mobiles
- ✅ Tous les navigateurs modernes

## 🔒 Sécurité

**Note:** Ceci est une simulation à des fins de démonstration.
- Les mots de passe ne sont PAS chiffrés réellement
- Les données ne sont stockées que localement
- Aucune donnée personnelle n'est transmise
- À utiliser uniquement pour des tests

## 📚 Documentation Complète

Pour plus de détails:
- `docs/SYSTEM_DE_CONNEXION.md` - Fonctionnement du système
- `docs/MODIFICATIONS_CONNEXION.md` - Modifications techniques
- `docs/GUIDE_TESTS.md` - Guide complet des tests

## ❓ Questions Fréquemment Posées

### Q: Pourquoi je suis redirigé vers connexion.html si je vais sur profil.html sans être connecté ?
**R:** C'est normal ! Le profil est une page protégée qui nécessite une authentification.

### Q: Mes données vont-elles être sauvegardées ?
**R:** Non, c'est une simulation. Les données sont dans localStorage de votre navigateur. Elles disparaîtront en vidant le cache.

### Q: Je peux créer mon propre compte ?
**R:** Oui ! Cliquez sur "Créer un compte" et remplissez le formulaire. Votre nouveau compte existera pour cette session.

### Q: Ça fonctionne en local ou j'ai besoin d'un serveur ?
**R:** Fonctionne entièrement en local. Ouvrez juste les fichiers HTML dans votre navigateur.

### Q: Comment me déconnecter ?
**R:** Allez sur votre profil et cherchez le bouton de déconnexion. Ou ouvrez `diagnostic.html` et cliquez "Effacer localStorage".

## 🎯 Prochaines Étapes

1. **Testez la connexion** - Utilisez demo@nova.com / Demo1234
2. **Testez la création de compte** - Créez un nouveau compte avec vos infos
3. **Testez la navigation** - Vérifiez que tout fonctionne correctement
4. **Partagez vos retours** - Signalez tout comportement anormal

---

**Version:** 1.0
**Date:** Décembre 2024
**Prêt pour:** Démonstration et tests

Bon test ! 🚀
