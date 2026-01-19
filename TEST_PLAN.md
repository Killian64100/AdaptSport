# Plan de Tests - AdaptSport

## 1. Stratégie de Test

### 1.1 Objectifs
- Garantir la fiabilité des fonctionnalités critiques
- Prévenir les régressions lors des évolutions
- Assurer la cohérence des conversions de données (sommeil)
- Valider l'intégration API et gestion d'erreurs

### 1.2 Niveaux de Test
| Niveau | Outil | Couverture Cible | Responsable |
|--------|-------|------------------|-------------|
| Unitaire | Vitest + React Testing Library | 80% | Développeur |
| Intégration | Vitest | 60% | Développeur |
| E2E | Cypress (futur) | Parcours critiques | QA |
| Performance | Lighthouse | Score > 90 | DevOps |

---

## 2. Matrice de Test

### 2.1 Tests Unitaires

#### 2.1.1 Utilitaires & Conversions
| ID | Fonction | Cas de test | Priorité | Statut |
|----|----------|-------------|----------|--------|
| UT-001 | `timeToDecimal()` | Convertit "7h30" → 7.5 | HAUTE | ✅ TODO |
| UT-002 | `timeToDecimal()` | Convertit "8h00" → 8.0 | HAUTE | ✅ TODO |
| UT-003 | `timeToDecimal()` | Gère "5h12" → 5.2 | HAUTE | ✅ TODO |
| UT-004 | `decimalToTime()` | Convertit 7.5 → "7h30" | HAUTE | ✅ TODO |
| UT-005 | `decimalToTime()` | Arrondit 7.501 → "7h30" | HAUTE | ✅ TODO |
| UT-006 | `decimalToTime()` | Gère 8.0 → "8h00" | HAUTE | ✅ TODO |
| UT-007 | `normalCDF()` | Calcul percentile VFC | MOYENNE | ⬜ TODO |
| UT-008 | `generateNormalDistribution()` | Génère courbe cohérente | MOYENNE | ⬜ TODO |

#### 2.1.2 Hooks Personnalisés
| ID | Hook | Cas de test | Priorité | Statut |
|----|------|-------------|----------|--------|
| UT-009 | `useContextMode` | Change de mode contexte | HAUTE | ✅ FAIT |
| UT-010 | `useContextMode` | Motion detection | HAUTE | ✅ FAIT |
| UT-011 | `useGeofence` | Détecte entrée zone | HAUTE | ✅ FAIT |
| UT-012 | `useGeofence` | Détecte sortie zone | HAUTE | ✅ FAIT |
| UT-013 | `useFeedback` | Affiche toast success | MOYENNE | ⬜ TODO |
| UT-014 | `useFeedback` | Affiche toast error | MOYENNE | ⬜ TODO |

#### 2.1.3 Stores Zustand
| ID | Store | Cas de test | Priorité | Statut |
|----|-------|-------------|----------|--------|
| UT-015 | `useProtocolStore` | Ajoute protocole existant | HAUTE | ⬜ TODO |
| UT-016 | `useProtocolStore` | Ajoute protocole custom | HAUTE | ⬜ TODO |
| UT-017 | `useProtocolStore` | Empêche doublons | HAUTE | ⬜ TODO |
| UT-018 | `useProtocolStore` | Supprime protocole | MOYENNE | ⬜ TODO |
| UT-019 | `useProtocolStore` | Persiste dans localStorage | HAUTE | ⬜ TODO |
| UT-020 | `useBiomarkerStore` | Charge données mock | MOYENNE | ⬜ TODO |
| UT-021 | `useBiomarkerStore` | Update métriques | MOYENNE | ⬜ TODO |

### 2.2 Tests Composants

#### 2.2.1 Composants Critiques
| ID | Composant | Cas de test | Priorité | Statut |
|----|-----------|-------------|----------|--------|
| CT-001 | `BiomarkerCard` | Affiche métrique en decimal | HAUTE | ⬜ TODO |
| CT-002 | `BiomarkerCard` | Affiche sommeil en "7h30" | HAUTE | ⬜ TODO |
| CT-003 | `BiomarkerCard` | Cache unité pour sommeil | HAUTE | ⬜ TODO |
| CT-004 | `BiomarkerCard` | Affiche tendance (up/down) | MOYENNE | ⬜ TODO |
| CT-005 | `ChatBubble` | Rend message utilisateur | HAUTE | ✅ FAIT |
| CT-006 | `ChatBubble` | Rend message coach | HAUTE | ✅ FAIT |
| CT-007 | `ChatBubble` | Affiche bouton d'action | HAUTE | ⬜ TODO |
| CT-008 | `ChatBubble` | Appelle onAddProtocol | HAUTE | ⬜ TODO |
| CT-009 | `ProtocolTimer` | Lance timer | HAUTE | ✅ FAIT |
| CT-010 | `ProtocolTimer` | Pause/Resume timer | HAUTE | ✅ FAIT |
| CT-011 | `ProtocolTimer` | Reset timer | HAUTE | ✅ FAIT |
| CT-012 | `ProtocolTimer` | Affiche progression | MOYENNE | ⬜ TODO |
| CT-013 | `NormativeChart` | Affiche graphique VFC | HAUTE | ⬜ TODO |
| CT-014 | `NormativeChart` | Convertit sommeil en decimal | HAUTE | ⬜ TODO |
| CT-015 | `NormativeChart` | Affiche ticks sommeil | HAUTE | ⬜ TODO |
| CT-016 | `NormativeChart` | Inverse axe pour RHR | MOYENNE | ⬜ TODO |
| CT-017 | `DynamicMetricChart` | Affiche historique 7 jours | HAUTE | ⬜ TODO |
| CT-018 | `DynamicMetricChart` | Convertit sommeil | HAUTE | ⬜ TODO |

#### 2.2.2 Navigation & Layout
| ID | Composant | Cas de test | Priorité | Statut |
|----|-----------|-------------|----------|--------|
| CT-019 | `ContextualHeader` | Change titre selon page | MOYENNE | ✅ FAIT |
| CT-020 | `AppLayout` | Affiche navigation | MOYENNE | ⬜ TODO |
| CT-021 | Page Coach | Switch onglet Chat/Biblio | HAUTE | ⬜ TODO |
| CT-022 | Page Bibliothèque | Filtre protocoles | HAUTE | ⬜ TODO |
| CT-023 | Page Détail Protocole | Affiche timer si durée > 0 | HAUTE | ⬜ TODO |
| CT-024 | Page Détail Protocole | Affiche icône si durée = 0 | MOYENNE | ⬜ TODO |

### 2.3 Tests d'Intégration

| ID | Scénario | Étapes | Priorité | Statut |
|----|----------|--------|----------|--------|
| IT-001 | Ajout protocole depuis chat | 1. Envoie message<br>2. Clique bouton<br>3. Vérifie toast<br>4. Vérifie store | HAUTE | ⬜ TODO |
| IT-002 | Navigation vers bibliothèque | 1. Page coach<br>2. Switch onglet<br>3. Vérifie URL<br>4. Vérifie protocoles affichés | HAUTE | ⬜ TODO |
| IT-003 | Exécution protocole avec timer | 1. Ouvre protocole<br>2. Lance timer<br>3. Pause/Resume<br>4. Retour biblio | HAUTE | ⬜ TODO |
| IT-004 | Affichage sommeil cohérent | 1. Dashboard<br>2. Détail biomètre<br>3. Graphique comparaison<br>4. Vérifie "7h30" partout | HAUTE | ⬜ TODO |
| IT-005 | Fallback API coach | 1. Simule erreur 429<br>2. Vérifie fallback local<br>3. Affiche message | HAUTE | ⬜ TODO |

### 2.4 Tests Sécurité

| ID | Cas | Test | Priorité | Statut |
|----|-----|------|----------|--------|
| SEC-001 | Privacy Zones | Zone détectée correctement | HAUTE | ✅ FAIT |
| SEC-002 | Privacy Zones | Localisation masquée | HAUTE | ✅ FAIT |
| SEC-003 | API Keys | Non exposées côté client | CRITIQUE | ⬜ TODO |
| SEC-004 | XSS | Sanitize inputs chat | HAUTE | ⬜ TODO |
| SEC-005 | CSRF | Tokens protégés | MOYENNE | ⬜ À IMPLÉMENTER |

---

## 3. Tests de Performance

### 3.1 Métriques Lighthouse
| Métrique | Objectif | Actuel | Statut |
|----------|----------|--------|--------|
| Performance | > 90 | À mesurer | ⬜ TODO |
| Accessibility | > 90 | À mesurer | ⬜ TODO |
| Best Practices | > 90 | À mesurer | ⬜ TODO |
| SEO | > 90 | À mesurer | ⬜ TODO |

### 3.2 Core Web Vitals
| Métrique | Objectif | Actuel | Statut |
|----------|----------|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | À mesurer | ⬜ TODO |
| FID (First Input Delay) | < 100ms | À mesurer | ⬜ TODO |
| CLS (Cumulative Layout Shift) | < 0.1 | À mesurer | ⬜ TODO |

---

## 4. Procédures de Test

### 4.1 Tests Unitaires
```bash
# Lancer tous les tests
npm run test

# Tests en mode watch
npm run test:watch

# Coverage report
npm run test:coverage
```

### 4.2 Tests E2E (futur)
```bash
# Ouvrir Cypress
npm run cypress:open

# Run headless
npm run cypress:run
```

### 4.3 Tests Manuels
- [ ] Navigation complète dashboard
- [ ] Ajout/suppression protocoles
- [ ] Chat avec coach (API réelle)
- [ ] Responsive mobile/tablette
- [ ] Thème clair/sombre
- [ ] Accessibilité clavier

---

## 5. Environnements de Test

| Environnement | URL | Usage | Données |
|---------------|-----|-------|---------|
| Local Dev | localhost:3000 | Développement | Mock |
| Staging | À définir | Tests QA | Mock + API test |
| Production | À définir | Utilisateurs | Données réelles |

---

## 6. Critères de Validation

### 6.1 Definition of Done (DoD)
- ✅ Tests unitaires écrits et passent
- ✅ Tests composants écrits si applicable
- ✅ Couverture code > 70% pour fichier modifié
- ✅ ESLint sans erreurs
- ✅ TypeScript sans erreurs
- ✅ Tests manuels effectués
- ✅ Documentation mise à jour
- ✅ Code review approuvé

### 6.2 Critères de Release
- ✅ Tous tests critiques (HAUTE priorité) passent
- ✅ Couverture globale > 70%
- ✅ Performance Lighthouse > 85
- ✅ Tests sécurité critiques passent
- ✅ Tests manuels parcours utilisateur OK
- ✅ Pas de régression connue

---

## 7. Gestion des Bugs

### 7.1 Priorisation
| Sévérité | Délai de correction | Exemple |
|----------|---------------------|---------|
| CRITIQUE | < 24h | App ne démarre pas |
| HAUTE | < 3 jours | Conversion sommeil cassée |
| MOYENNE | < 1 semaine | UI alignement |
| BASSE | Backlog | Amélioration mineure |

### 7.2 Template Bug Report
```markdown
**Titre**: [Composant] Description courte

**Sévérité**: CRITIQUE / HAUTE / MOYENNE / BASSE

**Étapes de reproduction**:
1. ...
2. ...

**Résultat attendu**: ...

**Résultat observé**: ...

**Environnement**: 
- OS: Windows/Mac/Linux
- Navigateur: Chrome 120
- Version app: 1.0.0

**Captures d'écran**: ...
```

---

## 8. Outils & Configuration

### 8.1 Stack de Test
- **Vitest**: Tests unitaires/intégration (compatible Vite)
- **React Testing Library**: Tests composants React
- **MSW (Mock Service Worker)**: Mock API calls
- **Cypress** (futur): Tests E2E
- **Lighthouse CI**: Performance monitoring

### 8.2 Coverage Targets
```json
{
  "branches": 70,
  "functions": 75,
  "lines": 80,
  "statements": 80
}
```

---

## 9. Roadmap Tests

### Q1 2026
- [x] Tests hooks existants (useContextMode, useGeofence)
- [ ] Tests conversions temps (timeToDecimal, decimalToTime)
- [ ] Tests stores Zustand
- [ ] Tests composants critiques (BiomarkerCard, ChatBubble)
- [ ] Configuration Vitest complète

### Q2 2026
- [ ] Tests intégration parcours utilisateur
- [ ] Tests sécurité API
- [ ] Setup Cypress E2E
- [ ] Tests performance automatisés
- [ ] CI/CD avec GitHub Actions

### Q3 2026
- [ ] Tests visuels (Storybook + Chromatic)
- [ ] Tests accessibilité automatisés (axe-core)
- [ ] Tests charge API
- [ ] Tests compatibilité navigateurs (BrowserStack)

---

**Date de création**: 18 janvier 2026  
**Responsable**: Équipe QA AdaptSport  
**Prochaine revue**: 1er février 2026
