# Chat n8n Webhook

Une interface minimaliste et moderne pour interagir avec des workflows n8n via webhooks.

## 🎯 Fonctionnalités

- **Interface chat épurée** - Design brutalist minimaliste
- **Multiple workflows** - Sélectionnez entre différents workflows n8n
- **Authentification Basic Auth** - Support optionnel de l'authentification
- **Responsive design** - Optimisé pour desktop et mobile
- **Historique des messages** - Conservation de la conversation
- **Support temps réel** - Indicateur de chargement pendant le traitement

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- pnpm (ou npm)

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd chat-with

# Installer les dépendances
pnpm install
```

### Configuration

Créez un fichier `.env.local` à la racine du projet (vous pouvez copier `.env.example` comme base):

```bash
cp .env.example .env.local
```

Ensuite, remplissez les variables d'environnement:

```env
# Webhooks n8n
 N8N_WEBHOOK_JOB_OFFER=https://your-n8n-instance.com/webhook/job-offer
 N8N_WEBHOOK_SOCIAL_CONTENT=https://your-n8n-instance.com/webhook/social-content
 N8N_WEBHOOK_IDEA_IMPROVEMENT=https://your-n8n-instance.com/webhook/idea-improvement

# Authentification (optionnel)
 N8N_AUTH_USERNAME=your-username
 N8N_AUTH_PASSWORD=your-password

# Restriction IP (optionnel)
# Liste des adresses IP autorisées séparées par des virgules
 N8N_WEBHOOK_IP_APPROUV=192.168.1.100,192.168.1.101,10.0.0.50
```

### Développement

```bash
# Démarrer le serveur de développement
pnpm dev

# Le projet sera accessible sur http://localhost:3000
```

### Production

```bash
# Build du projet
pnpm build

# Démarrer le serveur
pnpm start
```

## 📋 Workflows disponibles

1. **Offre d'emploi** - Générer et analyser des offres d'emploi
2. **Contenu réseaux** - Créer du contenu optimisé pour les réseaux sociaux
3. **Amélioration d'idée** - Raffiner et améliorer vos idées

## 🏗️ Architecture

### Structure du projet

``` 
├── app/                    # Application Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Page d'accueil
│   └── globals.css        # Styles globaux
├── components/
│   ├── chat-widget.tsx    # Composant principal du chat
│   ├── theme-provider.tsx # Provider du thème
│   └── ui/                # Composants UI réutilisables
│       ├── button.tsx
│       ├── input.tsx
│       └── radio-group.tsx
├── hooks/                 # Hooks personnalisés
│   └── use-toast.ts
├── lib/                   # Utilitaires
│   └── utils.ts
└── public/                # Assets statiques
```

### Composants clés

- **ChatWidget** - Composant principal contenant toute la logique du chat
  - Gestion des messages
  - Sélection des workflows
  - Communication avec les webhooks n8n
  - Authentification Basic Auth

## 🎨 Design

L'interface utilise un style **Brutalist** avec:

- Typographie épurée et lisible
- Palette de couleurs minimaliste
- Bordures nettes et définies
- Focus sur la clarté et la fonctionnalité

## 🔐 Authentification et Sécurité

### Authentification Basic Auth

L'authentification Basic Auth est optionnelle:

- Si configurée, elle sera automatiquement ajoutée aux requêtes
- Les credentials sont lus depuis les variables d'environnement
- Aucune donnée sensible n'est stockée côté client

### Restriction d'accès par IP

Vous pouvez restreindre l'accès à l'application à des adresses IP spécifiques:

- Configurez ` N8N_WEBHOOK_IP_APPROUV` avec les IPs autorisées
- Les IPs doivent être séparées par des virgules
- Si cette variable n'est pas définie, l'accès est libre pour toutes les IPs
- La vérification se fait automatiquement au chargement de l'application

**Exemple:**
```
 N8N_WEBHOOK_IP_APPROUV=192.168.1.100,192.168.1.101,10.0.0.50
```

Si l'IP du client ne figure pas dans la liste autorisée, un message d'erreur s'affichera et l'accès sera refusé.

## 📡 Communication avec n8n

Les messages sont envoyés en POST avec:

```json
{
  "message": "Votre message",
  "timestamp": "2026-02-03T10:30:00.000Z",
  "workflow": "job-offer"
}
```

La réponse attendue:

```json
{
  "response": "Réponse du workflow",
  "message": "Alternative si 'response' n'existe pas"
}
```

## 🛠️ Technologies

- **Framework** - Next.js 16+ avec App Router
- **Language** - TypeScript
- **Styles** - Tailwind CSS + CSS personnalisé
- **Icônes** - Lucide React
- **Package manager** - pnpm
- **Vérification IP** - API publique ipify.org

## 🔒 Sécurité - Vérification d'IP

### Fonctionnement

1. **Détection automatique** - L'IP de l'utilisateur est détectée au chargement de la page
2. **Comparaison** - L'IP est comparée à la liste des IPs approuvées
3. **Accès accordé/refusé** - L'accès est autorisé ou bloqué selon le résultat

### Configuration

Pour activer la restriction d'IP, définissez la variable d'environnement:

```env
 N8N_WEBHOOK_IP_APPROUV=192.168.1.100,192.168.1.101,10.0.0.50
```

### Comportement

| Situation | Comportement |
|-----------|-------------|
| Variable non définie | Accès libre pour toutes les IPs |
| Variable définie | Seules les IPs listées peuvent accéder |
| IP non autorisée | Affichage d'un écran d'accès refusé |
| Vérification en cours | Écran de chargement |

### Écrans associés

- **LoadingScreen** - Affichée pendant la vérification d'IP
- **AccessDenied** - Affichée si l'IP n'est pas autorisée
- **ChatWidget** - Affichée si l'accès est autorisé

## 📦 Scripts disponibles

```bash
pnpm dev       # Développement
pnpm build     # Build de production
pnpm start     # Démarrage du serveur produit
pnpm lint      # Vérification du code
```

## 🐛 Dépannage

### Le webhook ne répond pas

- Vérifiez l'URL du webhook dans `.env.local`
- Assurez-vous que n8n est en cours d'exécution
- Vérifiez les logs de la console (F12)

### Erreur d'authentification

- Vérifiez les credentials dans `.env.local`
- Confirmez que Basic Auth est activé dans n8n

### CORS errors

- Configurez les headers CORS dans n8n
- Assurez-vous que le domaine est autorisé

## 📄 Licence

MIT

## 👤 Auteur

Créé pour une intégration n8n personnalisée.

---

Pour plus d'informations sur n8n: https://n8n.io/
