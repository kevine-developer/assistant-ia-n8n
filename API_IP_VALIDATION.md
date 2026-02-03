# API de vérification d'IP

## Vue d'ensemble

La vérification d'IP est implémentée via un hook React personnalisé `useIPValidation` qui:

1. Détecte l'IP publique de l'utilisateur
2. La compare à une liste d'IPs approuvées
3. Retourne le résultat de la validation

## Hook: `useIPValidation`

### Localisation
```
hooks/use-ip-validation.ts
```

### Signature

```typescript
function useIPValidation(): IPValidationResult
```

### Retour

```typescript
interface IPValidationResult {
  isAllowed: boolean           // L'accès est autorisé?
  userIP: string | null        // L'IP détectée (si restriction active)
  isLoading: boolean           // Vérification en cours?
  error: string | null         // Message d'erreur si accès refusé
}
```

### Exemple d'utilisation

```tsx
import { useIPValidation } from '@/hooks/use-ip-validation'

export default function Page() {
  const { isAllowed, isLoading, error, userIP } = useIPValidation()

  if (isLoading) {
    return <div>Vérification en cours...</div>
  }

  if (!isAllowed) {
    return <div>Accès refusé: {error}</div>
  }

  return <div>Accès autorisé! Votre IP: {userIP}</div>
}
```

## Configuration

### Variable d'environnement

```
 N8N_WEBHOOK_IP_APPROUV
```

**Type:** Chaîne  
**Format:** Adresses IP séparées par des virgules  
**Optionnel:** Oui (pas de restriction si vide)  
**Exemple:** `192.168.1.100,192.168.1.101,10.0.0.50`

### Parsing

```typescript
// Les IPs sont parsées comme suit:
const approvedIPsString = "192.168.1.100, 192.168.1.101, 10.0.0.50"
const approvedIPs = approvedIPsString
  .split(',')                    // Diviser par virgule
  .map((ip) => ip.trim())        // Supprimer les espaces
  .filter((ip) => ip.length > 0) // Filtrer les vides
  // Résultat: ["192.168.1.100", "192.168.1.101", "10.0.0.50"]
```

## Détection d'IP

### Source

L'API publique `https://api.ipify.org` est utilisée pour détecter l'IP publique de l'utilisateur.

### Requête

```http
GET https://api.ipify.org?format=json
Accept: application/json
```

### Réponse

```json
{
  "ip": "203.0.113.42"
}
```

### Limitations

- **Proxy/VPN:** L'IP retournée est celle du proxy/VPN, pas celle réelle
- **NAT:** Derrière un routeur NAT, l'IP publique est partagée par tous les appareils
- **Réseau d'entreprise:** Tous les utilisateurs ont la même IP sortante
- **Mobile:** L'IP peut changer fréquemment (roaming, changement de réseau)

## Composants associés

### AccessDenied
Affiché quand l'accès est refusé.

**Localisation:** `components/access-denied.tsx`

**Props:**
```typescript
interface AccessDeniedProps {
  userIP?: string | null  // L'IP de l'utilisateur
  error?: string | null   // Message d'erreur
}
```

### LoadingScreen
Affiché pendant la vérification.

**Localisation:** `components/loading-screen.tsx`

## Flux d'exécution

### 1. Initialisation (useEffect)

```typescript
useEffect(() => {
  // Récupérer la configuration
  const approvedIPsString = process.env. N8N_WEBHOOK_IP_APPROUV
  
  // Si pas de restriction, accès libre
  if (!approvedIPsString) {
    setResult({ isAllowed: true, ... })
    return
  }
  
  // Parser les IPs approuvées
  const approvedIPs = [...] // Voir parsing plus haut
  
  // Récupérer l'IP de l'utilisateur
  const response = await fetch('https://api.ipify.org?format=json')
  const { ip: userIP } = await response.json()
  
  // Vérifier l'IP
  const isAllowed = approvedIPs.includes(userIP)
  
  // Retourner le résultat
  setResult({ isAllowed, userIP, isLoading: false, ... })
}, [])
```

### 2. États possibles

| État | isLoading | isAllowed | error | Description |
|------|-----------|-----------|-------|-------------|
| Chargement | true | false | null | Vérification en cours |
| Autorisé (pas de restriction) | false | true | null | Pas de variable définie |
| Autorisé (IP ok) | false | true | null | IP trouvée dans la liste |
| Refusé (IP bloquée) | false | false | Message | IP non trouvée |
| Erreur réseau | false | false | Message | Impossible de récupérer l'IP |

## Gestion des erreurs

### Erreurs gérées

```typescript
try {
  // Requête à l'API ipify
  const response = await fetch('https://api.ipify.org?format=json')
  
  if (!response.ok) {
    throw new Error('Impossible de récupérer votre adresse IP')
  }
  
  const data = await response.json()
  // ... traitement
  
} catch (err) {
  const errorMessage = err instanceof Error 
    ? err.message 
    : 'Erreur de validation IP'
  
  setResult({
    isAllowed: false,
    userIP: null,
    isLoading: false,
    error: errorMessage,
  })
}
```

### Erreurs possibles

- **Réseau indisponible:** "Impossible de récupérer votre adresse IP"
- **API ipify indisponible:** "Impossible de récupérer votre adresse IP"
- **Erreur JSON:** "Impossible de récupérer votre adresse IP"

## Cas d'usage

### Cas 1: Sans restriction

```env
# .env.local
 N8N_WEBHOOK_IP_APPROUV=
```

Résultat:
- `isAllowed = true`
- `userIP = null`
- `error = null`

### Cas 2: IP autorisée

```env
# .env.local
 N8N_WEBHOOK_IP_APPROUV=192.168.1.100
```

Si l'IP de l'utilisateur est `192.168.1.100`:
- `isAllowed = true`
- `userIP = "192.168.1.100"`
- `error = null`

### Cas 3: IP non autorisée

```env
# .env.local
 N8N_WEBHOOK_IP_APPROUV=192.168.1.100
```

Si l'IP de l'utilisateur est `192.168.1.50`:
- `isAllowed = false`
- `userIP = "192.168.1.50"`
- `error = "Accès refusé. Votre IP (192.168.1.50) n'est pas autorisée."`

### Cas 4: Erreur de vérification

Si l'API ipify n'est pas accessible:
- `isAllowed = false`
- `userIP = null`
- `error = "Impossible de récupérer votre adresse IP"`

## Performance

- **Temps de vérification:** ~100-500ms (dépend de latence réseau)
- **Mise en cache:** La vérification s'exécute une seule fois au montage du composant
- **Impact:** Minimal - requête asynchrone non-bloquante

## Sécurité

### Considérations

1. **IP publique vs IP locale:** La vérification détecte l'IP publique, pas l'IP locale
2. **Proxies:** Les proxies/VPN masquent l'IP réelle
3. **Fiabilité:** N'utilisez pas comme seule mesure de sécurité
4. **HTTPS:** Combiné avec HTTPS pour meilleure sécurité

### Recommandations

1. **Combiner avec authentification:** Utilisez Basic Auth + vérification IP
2. **Logging:** Enregistrez les tentatives d'accès refusé
3. **Rate limiting:** Limitez les requêtes par IP
4. **Monitoring:** Surveillez les patterns suspects

## Alternatives

Si vous ne voulez pas utiliser `ipify.org`:

### Option 1: Détection côté serveur (API Route)

```typescript
// pages/api/get-ip.ts
export default function handler(req: any, res: any) {
  const ip = req.headers['x-forwarded-for'] || 
             req.socket.remoteAddress
  res.json({ ip })
}
```

Avantages:
- Plus précis avec proxy reverse
- IP backend plutôt que publique

Inconvénients:
- Nécessite une API route
- Déploiement plus complexe

### Option 2: Vérification côté serveur

Implémenter la vérification au niveau de la route/middleware au lieu du client.

Avantages:
- Plus sécurisé
- Impossible à contourner

Inconvénients:
- Plus complexe
- Requiert un backend

## Références

- [API ipify.org](https://www.ipify.org/)
- [Détection d'IP en JavaScript](https://www.w3schools.com/whatis/whatis_ip_address.asp)
- [Sécurité des applications web](https://owasp.org/www-project-top-ten/)

---

**Dernière mise à jour:** 3 février 2026
