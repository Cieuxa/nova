# Checklist: Tests manuels (création → connexion → pages personnelles)

1) Ouvrir `connexion.html` dans un navigateur (ou `index.html` → bouton Connexion).

2) Inscription
- Onglet "Inscription"
- Email: `test@example.com`
- Prénom: `Jean`
- Nom: `Dupont`
- Mot de passe: `Test123!`
- Confirmer
- Cliquez `S'inscrire`
- Résultat attendu: message de succès et redirection (ou bouton) vers `profil.html`.

3) Vérifier stockage
- Ouvrir la console (F12) → Application → LocalStorage
- Vérifier `ns_users` contient votre compte
- Vérifier `ns_current_user` contient un objet sans mot de passe

4) Accéder aux pages personnelles
- Aller sur `profil.html`, `drive.html`, `mail.html` (ou `profil.html` → menu)
- Résultat attendu: pages accessibles et affichent infos utilisateur (prénom, avatar, mails, fichiers)

5) Déconnexion
- Cliquer `Déconnexion` dans le header
- Résultat attendu: redirection vers `connexion.html`, `ns_current_user` supprimé

6) Reconnexion
- Reconnectez-vous via `connexion.html` avec les mêmes identifiants
- Résultat attendu: utilisateur reconnecté et données précédentes restaurées

7) Réinitialiser l'état (optionnel)
- F12 → Console → `localStorage.clear()`
- Rechargez la page

---

Notes:
- Clés canoniques: `ns_users`, `ns_current_user`.
- Les anciens fichiers `scripts/connexion*.js` ont été neutralisés; le code canonique est maintenant `scripts/auth.clean.js` (le fichier `scripts/auth.js` est conservé à des fins de compatibilité). 
