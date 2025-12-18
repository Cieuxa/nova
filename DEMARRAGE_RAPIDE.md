# 🚀 DÉMARRAGE RAPIDE - Système de Connexion

## En 30 Secondes

1. **Ouvrir** → `connexion.html`
2. **Entrer** → Email: `demo@nova.com` | Mot de passe: `Demo1234`
3. **Cliquer** → "Se connecter"
4. ✅ **Vous êtes connecté !**

---

## 📋 Comptes de Démo (Prêts à l'Emploi)

```
Compte 1:
  Email: demo@nova.com
  Mot de passe: Demo1234
  Nom: Jean Dupont

Compte 2:
  Email: test@nova.com
  Mot de passe: Test1234
  Nom: Marie Martin

Compte 3:
  Email: user@nova.com
  Mot de passe: User1234
  Nom: Thomas Bernard
```

**Ou créez votre propre compte** en cliquant "Créer un compte"

---

## 🔗 Liens Rapides

| Lien | Action |
|------|--------|
| [connexion.html](connexion.html) | Se connecter / S'inscrire |
| [profil.html](profil.html) | Mon profil (protégé) |
| [test-connexion.html](test-connexion.html) | Tester rapidement |
| [diagnostic.html](diagnostic.html) | Diagnostique avancé |
| [demo.html](demo.html) | Tableau de bord |

---

## ⚡ Actions Rapides

### Je veux me connecter
```
1. Ouvrer connexion.html
2. Email + mot de passe d'un compte démo
3. Cliquer "Se connecter"
```

### Je veux créer un compte
```
1. Ouvrir connexion.html
2. Cliquer "Créer un compte"
3. Remplir le formulaire
4. Cliquer "Créer mon compte"
```

### Je veux voir mon profil
```
1. Être connecté
2. Aller sur profil.html
3. Voir vos informations affichées
```

### Je veux me déconnecter
```
1. Aller sur profil.html (si connecté)
2. Cliquer le bouton logout
3. Vous êtes redirigé vers connexion.html
```

### Je veux tester le système
```
1. Ouvrir diagnostic.html
2. Voir l'état en temps réel
3. Cliquer les boutons de test
```

---

## 🎯 Points Clés à Retenir

✅ **Pas de serveur** - Fonctionne entièrement en local
✅ **Pas d'enregistrement** - Les données ne sont pas sauvegardées
✅ **Simulation** - C'est une demo, pas un vrai système
✅ **localStorage** - Utilise le stockage local du navigateur
✅ **Session** - Votre connexion persiste au rafraîchissement

---

## 🧪 Tests Basiques

### Test 1: Connexion ✓
```
connexion.html → demo@nova.com / Demo1234 → Se connecter → profil.html ✓
```

### Test 2: Protection ✓
```
Déconnecté → profil.html → redirection vers connexion.html ✓
```

### Test 3: Persistance ✓
```
Connecté → F5 (refresh) → Toujours connecté ✓
```

---

## 🐛 Si ça ne fonctionne pas

| Problème | Solution |
|----------|----------|
| Boucle infinie | Vider cache + rechanger onglet |
| Nom ne s'affiche pas | Vérifier que profil.html se charge |
| localStorage vide | Mode privé ? Activer localStorage |
| Erreur JavaScript | Ouvrir F12 → Onglet Console |

---

## 📚 Besoins de Plus de Détails ?

- **Utilisateur** → Lire `README_CONNEXION.md`
- **Développeur** → Lire `docs/ARCHITECTURE.md`
- **Testeur** → Consulter `docs/GUIDE_TESTS.md`
- **Technique** → Voir `CONFIGURATION_COMPLETE.md`

---

## ✅ Checklist Rapide

- [ ] Ouvrir connexion.html
- [ ] Tester connexion avec demo@nova.com
- [ ] Vérifier redirection vers profil.html
- [ ] Vérifier affichage du nom "Jean Dupont"
- [ ] Créer un nouveau compte
- [ ] Tester la protection (accès direct à profil.html sans connexion)
- [ ] Tester la persistance (refresh F5)
- [ ] Tester la déconnexion

---

**Vous êtes prêt ! 🎉**

Commencez par [connexion.html](connexion.html)

---

*Créé: Décembre 2024*
*Version: 1.0*
*Statut: ✅ Production Ready*
