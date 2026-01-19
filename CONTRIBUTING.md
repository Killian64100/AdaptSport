# Guide de Contribution - AdaptSport

Merci de votre intérêt pour contribuer à AdaptSport ! Ce guide vous aidera à démarrer.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 20+
- npm 10+
- Git

### Installation
```bash
# Cloner le repo
git clone https://github.com/votre-org/adaptsport.git
cd adaptsport

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Ajouter vos clés API dans .env.local
# OPENROUTER_API_KEY=votre_clé_ici

# Lancer le serveur de développement
npm run dev
```

## 📋 Standards de Code

### TypeScript
- Utilisez TypeScript strict mode
- Évitez `any`, préférez `unknown` si type inconnu
- Définissez des interfaces pour toutes les props de composants

### Formatage
```bash
# Formater automatiquement
npm run format

# Vérifier le formatage
npm run format:check
```

### Linting
```bash
# Lancer ESLint
npm run lint
```

## 🧪 Tests

### Écrire des tests
- Un test pour chaque nouvelle fonction utilitaire
- Tests de composants pour interactions utilisateur critiques
- Couverture minimale : 70%

```bash
# Lancer les tests
npm run test

# Mode watch
npm run test:watch

# Avec coverage
npm run test:coverage

# Interface graphique
npm run test:ui
```

### Structure des tests
```
src/__tests__/
├── components/       # Tests composants React
├── hooks/           # Tests hooks personnalisés
├── utils/           # Tests fonctions utilitaires
└── setup.ts         # Configuration globale tests
```

## 🌿 Workflow Git

### Branches
- `main` : Production stable
- `develop` : Développement actif
- `feature/nom-feature` : Nouvelles fonctionnalités
- `fix/nom-bug` : Corrections de bugs
- `refactor/nom-refactor` : Refactoring code

### Commits Conventionnels
```
feat: Ajout du timer dans les protocoles
fix: Correction conversion sommeil en décimal
docs: Mise à jour du README
test: Ajout tests pour BiomarkerCard
refactor: Simplification du store Zustand
perf: Optimisation du rendu des graphiques
chore: Mise à jour des dépendances
```

### Pull Requests
1. Créez une branche depuis `develop`
2. Faites vos modifications
3. Ajoutez des tests si applicable
4. Vérifiez que tous les tests passent
5. Créez une PR vers `develop`
6. Attendez la review

#### Template PR
```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/modifiés
- [ ] Tests manuels effectués
- [ ] Couverture maintenue/améliorée

## Checklist
- [ ] Code suit les standards du projet
- [ ] Documentation mise à jour
- [ ] Pas de régression
- [ ] Build passe sans erreurs
```

## 🏗️ Architecture

### Structure des Composants (Helix)
```
components/
├── helix/
│   ├── atoms/        # Composants de base (Button, Input)
│   ├── molecules/    # Combinaisons simples (ChatBubble)
│   └── organisms/    # Composants complexes (ProtocolTimer)
├── features/         # Composants métier (BiomarkerCard)
└── ui/              # Composants UI réutilisables
```

### Hooks Personnalisés
- Préfixe `use` obligatoire
- Un hook = une responsabilité
- Documentation JSDoc requise

### Stores Zustand
- État global minimal
- Persistence via middleware
- Actions typées

## 📝 Documentation

### JSDoc pour fonctions complexes
```typescript
/**
 * Convertit une chaîne horaire en nombre décimal
 * @param timeString - Format "7h30"
 * @returns Heures en décimal (ex: 7.5)
 * @example
 * timeToDecimal("7h30") // 7.5
 */
const timeToDecimal = (timeString: string): number => {
  // ...
}
```

### Commentaires
- Expliquez le **pourquoi**, pas le **quoi**
- Évitez les commentaires évidents
- Mettez à jour les commentaires lors des modifications

## 🐛 Signaler un Bug

Utilisez le template dans [TEST_PLAN.md](./TEST_PLAN.md#72-template-bug-report)

## 💡 Proposer une Fonctionnalité

1. Ouvrez une issue de type "Feature Request"
2. Décrivez le besoin utilisateur
3. Proposez une solution
4. Attendez les retours de l'équipe

## 🔍 Code Review

### Pour les reviewers
- Soyez constructif et bienveillant
- Vérifiez la logique métier
- Testez localement si nécessaire
- Approuvez ou demandez des changements

### Pour les contributeurs
- Répondez à tous les commentaires
- Faites les modifications demandées
- Re-demandez une review si nécessaire

## 📦 Release Process

1. Merge develop → main
2. Tag avec version sémantique (v1.2.3)
3. Génération automatique du CHANGELOG
4. Déploiement automatique via CI/CD

## ❓ Besoin d'Aide ?

- 📚 Consultez la [documentation complète](./README.md)
- 💬 Rejoignez le Discord (lien à venir)
- 📧 Contactez l'équipe : dev@adaptsport.io

---

**Merci de contribuer à AdaptSport ! 🚀**
