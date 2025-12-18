# 🧪 Guide de Test - Système de Connexion

## Fichiers d'Accès Rapide

| Fichier | Objectif |
|---------|----------|
| `test-connexion.html` | **Interface de test simple** - Accédez rapidement aux pages de test |
| `diagnostic.html` | **Diagnostique avancé** - Vérifiez l'état du système et testez les fonctions |
| `connexion.html` | **Page de connexion** - Formulaires de login/signup |
| `profil.html` | **Profil utilisateur** - Page protégée (nécessite authentification) |

---

## 📋 Cas de Test

### Test 1: Connexion Basique ✓
**Étapes:**
1. Ouvrir `connexion.html`
2. Entrer email: `demo@nova.com`
3. Entrer mot de passe: `Demo1234`
4. Cliquer "Se connecter"

**Résultats attendus:**
- ✓ Redirection vers `profil.html` après 300ms
- ✓ Nom affiché: "Jean Dupont"
- ✓ Initiales affichées: "JD"
- ✓ Email affiché: "demo@nova.com"

---

### Test 2: Connexion Invalide ✗
**Étapes:**
1. Ouvrir `connexion.html`
2. Entrer email: `demo@nova.com`
3. Entrer mot de passe: `wrongpassword`
4. Cliquer "Se connecter"

**Résultats attendus:**
- ✓ Message d'erreur rouge
- ✓ Rester sur `connexion.html`
- ✓ Pas de redirection

---

### Test 3: Créer un Compte
**Étapes:**
1. Ouvrir `connexion.html`
2. Cliquer sur l'onglet "Créer un compte"
3. Remplir le formulaire:
   - Email: `nouveau@example.com`
   - Prénom: `Alice`
   - Nom: `Dupuis`
   - Mot de passe: `SecurePass123`
   - Confirmer: `SecurePass123`
4. Cocher "J'accepte les conditions"
5. Cliquer "Créer mon compte"

**Résultats attendus:**
- ✓ Message de succès vert
- ✓ Redirection vers `profil.html`
- ✓ Nom affiché: "Alice Dupuis"
- ✓ Initiales affichées: "AD"

---

### Test 4: Protection des Pages
**Étapes:**
1. Vider le localStorage (ou déconnecter)
2. Aller directement à `profil.html`

**Résultats attendus:**
- ✓ Redirection immédiate vers `connexion.html`
- ✓ Pas d'affichage de contenu du profil

---

### Test 5: Session Persistante
**Étapes:**
1. Se connecter avec `test@nova.com` / `Test1234`
2. Vous êtes sur `profil.html`
3. Rafraîchir la page (F5)

**Résultats attendus:**
- ✓ Vous restez sur `profil.html`
- ✓ Votre nom est toujours affiché
- ✓ Pas de redirection vers la connexion

---

### Test 6: Déconnexion
**Étapes:**
1. Être connecté sur `profil.html`
2. Chercher et cliquer le bouton de déconnexion/logout
3. Ou entrer `diagnostic.html` et cliquer "Effacer localStorage"

**Résultats attendus:**
- ✓ localStorage effacé
- ✓ Redirection vers `connexion.html`
- ✓ Formulaires vides

---

### Test 7: Affichage du Formulaire "Mot de Passe Oublié"
**Étapes:**
1. Ouvrir `connexion.html`
2. Cliquer sur "Mot de passe oublié ?" (lien sous le champ password)
3. Entrer un email: `test@nova.com`
4. Cliquer "Envoyer le lien"

**Résultats attendus:**
- ✓ Passage au formulaire de réinitialisation
- ✓ Message de confirmation affiché
- ✓ (Simulation - pas de vrai email envoyé)

---

### Test 8: Validation des Champs
**Étapes:**
1. Ouvrir `connexion.html`
2. Essayer de soumettre le formulaire sans remplir les champs
3. Ou entrer un email invalide

**Résultats attendus:**
- ✓ Messages d'erreur appropriés
- ✓ Validation HTML5 de l'email
- ✓ Validation du mot de passe (min 8 caractères pour signup)

---

### Test 9: Affichage/Masquage du Mot de Passe
**Étapes:**
1. Ouvrir `connexion.html`
2. Cliquer sur l'icône 👁️ à côté du champ "Mot de passe"

**Résultats attendus:**
- ✓ Mot de passe devient visible
- ✓ Icône change en 🙈
- ✓ Re-cliquer le cache à nouveau

---

### Test 10: Onglets de Formulaire
**Étapes:**
1. Ouvrir `connexion.html`
2. Vérifier que "Connexion" est actif par défaut
3. Cliquer sur "Créer un compte"
4. Cliquer sur "Connexion"

**Résultats attendus:**
- ✓ Les onglets changent correctement
- ✓ Seul le formulaire actif est visible
- ✓ L'onglet actif est souligné/en surbrillance

---

## 🛠️ Tests Avancés avec diagnostic.html

### Test d'Authentification
1. Ouvrir `diagnostic.html`
2. Cliquer "Tester Login: demo@nova.com"
3. Vérifier le statut mise à jour en temps réel

### Test d'Enregistrement
1. Ouvrir `diagnostic.html`
2. Cliquer "Tester Enregistrement"
3. Un nouveau compte sera créé avec email unique

### Test localStorage
1. Ouvrir `diagnostic.html`
2. Vérifier l'état de localStorage
3. Cliquer "Effacer localStorage"
4. Vérifier que l'état est réinitialisé

---

## 🐛 Dépannage

### Problème: Boucle infinie de redirection

**Solution:**
- Vérifier que `protect-pages.js` est chargé sur profil.html
- Vérifier que la clé localStorage est `nova_mock_user`
- Vider le cache du navigateur

### Problème: Le nom n'est pas affiché

**Solution:**
- Vérifier que les ID HTML correspondent:
  - `#sidebar-name` dans profil.html
  - `#avatar-placeholder` dans profil.html
- Vérifier que `protect-pages.js` s'exécute

### Problème: Les formulaires ne se soumettent pas

**Solution:**
- Vérifier que `mock-auth.js` est chargé dans connexion.html
- Vérifier les IDs des formulaires:
  - `#login-form`
  - `#signup-form`
  - `#forgot-password-form`
- Vérifier la console pour les erreurs JavaScript

### Problème: localStorage ne fonctionne pas

**Solution:**
- Vérifier que localStorage est activé (certains navigateurs en mode privé le bloquent)
- Ouvrir diagnostic.html pour tester localStorage
- Essayer dans un nouvel onglet/fenêtre

---

## ✅ Checklist de Validation

- [ ] Connexion avec compte démo fonctionne
- [ ] Création de compte fonctionne
- [ ] Pages protégées redirigent vers connexion si non authentifié
- [ ] Profil affiche le nom et initiales correctement
- [ ] Déconnexion efface la session
- [ ] Session persiste après rafraîchir
- [ ] Pas de boucles infinies de redirection
- [ ] Messages d'erreur/succès s'affichent correctement
- [ ] Validation des formulaires fonctionne
- [ ] Affichage/masquage du mot de passe fonctionne

---

## 📞 Contacts/Support

Pour signaler un bug ou poser une question, consultez:
- `docs/MODIFICATIONS_CONNEXION.md` - Résumé complet des modifications
- `docs/SYSTEM_DE_CONNEXION.md` - Documentation du système

---

**Dernière mise à jour:** 2024
**Version:** 1.0
**Statut:** Prêt pour la démonstration
