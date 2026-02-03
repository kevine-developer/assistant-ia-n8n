# Sécurité

Ce document décrit les mesures de sécurité implémentées dans cette application.

## 🔐 Authentification Basic Auth

### Configuration

Pour activer l'authentification Basic Auth, définissez les variables d'environnement:

```env
 N8N_AUTH_USERNAME=your-username
 N8N_AUTH_PASSWORD=your-password
```

### Fonctionnement

- Les credentials sont automatiquement encodés en Base64
- L'en-tête `Authorization` est ajouté à chaque requête webhook
- Les credentials ne sont jamais stockés côté client

### Sécurité

- Utilisez HTTPS en production
- Les credentials ne sont visibles que dans les variables d'environnement
- Ne committez jamais `.env.local` dans le repository (il est exclu via `.gitignore`)

## 🔒 Restriction d'accès par IP

### Configuration

Pour restreindre l'accès à certaines adresses IP:

```env
 N8N_WEBHOOK_IP_APPROUV=192.168.1.100,192.168.1.101,10.0.0.50
```

### Fonctionnement

1. **Détection de l'IP** - L'IP de l'utilisateur est détectée via l'API `ipify.org`
2. **Validation** - L'IP est comparée à la liste des IPs approuvées
3. **Accès** - L'accès est accordé ou refusé selon le résultat
4. **Affichage** - Un écran approprié est affiché à l'utilisateur

### Flux de vérification

```
┌─────────────────────────────┐
│  Chargement de la page      │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  LoadingScreen              │
│  "Vérification en cours..." │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   IP autorisée   IP bloquée
        │             │
        ▼             ▼
   ChatWidget   AccessDenied
```

### Limitations et considérations

- **Proxy/VPN** - Si l'utilisateur utilise un proxy ou VPN, l'IP détectée sera celle du proxy
- **NAT** - Derrière un routeur NAT, plusieurs appareils partageront la même IP
- **Réseau d'entreprise** - Tous les utilisateurs du même réseau d'entreprise auront la même IP
- **Fiabilité** - La détection d'IP n'est pas 100% fiable et ne doit pas être utilisée comme seule mesure de sécurité

### Recommandations

Pour une sécurité maximale:

1. **Combinez avec Basic Auth** - Utilisez l'authentification Basic Auth en plus de la restriction d'IP
2. **Utilisez HTTPS** - Chiffrez toutes les communications
3. **Authentification forte** - Envisagez une authentification par token JWT
4. **Logs** - Enregistrez les tentatives d'accès refusé
5. **Réseau privé** - Hébergez l'application sur un réseau privé si possible

## 📝 Variables d'environnement sensibles

### À ne JAMAIS committer

```
.env.local          # Variables locales (ignorées par git)
.env.development    # Variables de développement (si locales)
.env.production     # Variables de production (si locales)
```

### À toujours inclure

```
.env.example        # Modèle avec exemples (pas de vraies données)
.gitignore          # Règles d'exclusion de git
```

## 🛡️ Bonnes pratiques

1. **Secrets partagés** - Utilisez un gestionnaire de secrets (AWS Secrets Manager, Vault, etc.)
2. **Rotation** - Changez régulièrement les credentials
3. **Audit** - Enregistrez les accès et tentatives
4. **Isolation** - Exécutez l'app dans un conteneur ou environnement isolé
5. **Monitoring** - Surveillez les tentatives d'accès non autorisé
6. **Mise à jour** - Gardez les dépendances à jour

## 🔗 Sécurité des webhooks n8n

### Configuration recommandée

1. **Authentification** - Activez Basic Auth ou Token dans n8n
2. **Validation** - Validez les requêtes entrantes
3. **Rate limiting** - Limitez le nombre de requêtes par IP/utilisateur
4. **Logging** - Enregistrez tous les appels aux webhooks
5. **HTTPS** - Utilisez toujours HTTPS pour les webhooks

### Exemple de configuration n8n

```
Webhook URL: https://your-domain.com/api/webhook
Method: POST
Authentication: Basic Auth
Headers: Content-Type: application/json
Response: Custom response ou Fixed Response
```

## 📞 Signaler une vulnérabilité

Si vous découvrez une faille de sécurité:

1. Ne la publiez pas publiquement
2. Contactez l'administrateur du projet
3. Décrivez la vulnérabilité en détail
4. Attendez une réponse avant publication

---

**Dernière mise à jour:** 3 février 2026
