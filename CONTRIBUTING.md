# Guide de développement

## 🎯 Démarrage local

### 1. Installation

```bash
# Cloner le repository
git clone <repository-url>
cd chat-with

# Installer les dépendances
pnpm install
```

### 2. Configuration d'environnement

```bash
# Copier le fichier example
cp .env.example .env.local

# Éditer .env.local avec vos paramètres
# - URLs des webhooks n8n
# - Credentials d'authentification (optionnel)
# - IPs autorisées (optionnel)
```

### 3. Lancement du serveur de développement

```bash
pnpm dev
```

L'application sera disponible à `http://localhost:3000`

## 🧪 Test de la vérification d'IP

### Sans restriction d'IP (défaut)

1. Ne définissez pas ` N8N_WEBHOOK_IP_APPROUV`
2. Accès libre pour toutes les IPs
3. Page charge normalement

### Avec restriction d'IP

1. Définissez ` N8N_WEBHOOK_IP_APPROUV=192.168.1.100`
2. Pour tester:
   - Accédez depuis l'IP autorisée → Application charge
   - Accédez depuis une autre IP → Écran "Accès refusé"

### Obtenir votre IP locale

```bash
# Windows
ipconfig

# macOS/Linux
ifconfig
# ou
ip addr show
```

### Obtenir votre IP publique

```bash
# Depuis le terminal
curl https://api.ipify.org

# Depuis le navigateur
https://api.ipify.org
```

## 🔧 Structure des fichiers

### Fichiers de sécurité

```
├── hooks/
│   └── use-ip-validation.ts       # Hook de vérification d'IP
├── components/
│   ├── access-denied.tsx          # Écran d'accès refusé
│   ├── loading-screen.tsx         # Écran de chargement
│   └── chat-widget.tsx            # Widget principal
├── .env.example                   # Modèle de configuration
└── .env.local                     # Configuration locale (ignorée par git)
```

## 📚 Fonctionnalités principales

### useIPValidation Hook

```tsx
const { isAllowed, isLoading, error, userIP } = useIPValidation()

// isAllowed: boolean - Accès autorisé ou non
// isLoading: boolean - Vérification en cours
// error: string | null - Message d'erreur si accès refusé
// userIP: string | null - IP détectée de l'utilisateur
```

### Composants de sécurité

#### AccessDenied
Affiche un écran quand l'IP n'est pas autorisée:
- Icône de cadenas
- Message d'erreur personnalisé
- IP de l'utilisateur
- Instructions de contact

#### LoadingScreen
Affiche un écran de chargement pendant la vérification:
- Animation de points pulsants
- Message "Vérification de l'accès..."
- Responsive et brutalist

## 🚀 Déploiement

### Variables d'environnement de production

```env
# Webhooks (URL de production)
 N8N_WEBHOOK_JOB_OFFER=https://prod-n8n.com/webhook/job-offer
 N8N_WEBHOOK_SOCIAL_CONTENT=https://prod-n8n.com/webhook/social-content
 N8N_WEBHOOK_IDEA_IMPROVEMENT=https://prod-n8n.com/webhook/idea-improvement

# Auth
 N8N_AUTH_USERNAME=prod-user
 N8N_AUTH_PASSWORD=prod-password

# Restriction IP (production)
 N8N_WEBHOOK_IP_APPROUV=203.0.113.10,203.0.113.11
```

### Vercel/Netlify

1. Connectez votre repository
2. Ajoutez les variables d'environnement dans les settings
3. Deployez

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN pnpm install
COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

```bash
# Build
docker build -t chat-n8n .

# Run
docker run -p 3000:3000 \
  -e  N8N_WEBHOOK_JOB_OFFER=... \
  -e  N8N_AUTH_USERNAME=... \
  -e  N8N_AUTH_PASSWORD=... \
  -e  N8N_WEBHOOK_IP_APPROUV=... \
  chat-n8n
```

## 🐛 Débogage

### Activer les logs console

```tsx
// Dans chat-widget.tsx, les logs sont déjà présents:
console.log('✓ Envoi au workflow...', messageContent)
console.log('✓ Utilisation de Basic Auth')
console.log('✓ Réponse reçue, status:', response.status)
```

### Vérifier la détection d'IP

Ouvrez la console (F12) et vérifiez:

```javascript
// Votre IP publique détectée
fetch('https://api.ipify.org?format=json')
  .then(r => r.json())
  .then(d => console.log('Votre IP:', d.ip))
```

### Vérifier les variables d'environnement

```tsx
console.log('IPs approuvées:', process.env. N8N_WEBHOOK_IP_APPROUV)
console.log('Auth activée:', !!process.env. N8N_AUTH_USERNAME)
```

## 📝 Commits et conventions

### Format des commits

```
feat: Ajouter vérification d'IP
fix: Corriger bug de validation d'IP
docs: Mettre à jour la documentation
style: Formater le code
refactor: Restructurer le code
test: Ajouter des tests
```

## 🔄 Workflow de développement

1. **Créer une branche**
   ```bash
   git checkout -b feature/ma-fonctionnalite
   ```

2. **Développer**
   ```bash
   pnpm dev
   # Faire les modifications
   ```

3. **Tester**
   ```bash
   pnpm build
   # Vérifier qu'il n'y a pas d'erreurs
   ```

4. **Committer**
   ```bash
   git add .
   git commit -m "feat: description claire"
   ```

5. **Push et PR**
   ```bash
   git push origin feature/ma-fonctionnalite
   # Créer une Pull Request sur GitHub
   ```

## 📞 Support

Pour toute question:
- Consultez le README.md
- Consultez SECURITY.md pour les aspects sécurité
- Ouvrez une issue sur GitHub

---

**Dernière mise à jour:** 3 février 2026
