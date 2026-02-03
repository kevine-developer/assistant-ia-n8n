import { useState, useEffect } from "react";

interface IPValidationResult {
  isAllowed: boolean;
  userIP: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook pour valider l'IP de l'utilisateur
 * Vérifie si l'IP est dans la liste des IPs approuvées
 * @returns État de validation de l'IP
 */
export function useIPValidation(): IPValidationResult {
  const [result, setResult] = useState<IPValidationResult>({
    isAllowed: false, // Par défaut, refuser l'accès
    userIP: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const validateIP = async () => {
      try {
        // Récupérer la liste des IPs approuvées
        const approvedIPsString = process.env.N8N_WEBHOOK_IP_APPROUV;

        console.log("[IP VALIDATION] IPs autorisées:", approvedIPsString);

        // Si aucune restriction n'est définie, refuser l'accès
        if (!approvedIPsString || approvedIPsString.trim() === "") {
          setResult({
            isAllowed: false,
            userIP: null,
            isLoading: false,
            error: "Aucune règle d'accès IP n'est définie. Accès refusé.",
          });
          return;
        }

        // Parser les IPs approuvées
        const approvedIPs = approvedIPsString
          .split(",")
          .map((ip) => ip.trim())
          .filter((ip) => ip.length > 0);

        // Récupérer l'IP de l'utilisateur via une API publique
        const response = await fetch("https://api.ipify.org?format=json", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Impossible de récupérer votre adresse IP");
        }

        const data = await response.json();
        const userIP = data.ip;

        // Si l'IP est vide ou null, refuser l'accès
        if (!userIP) {
          setResult({
            isAllowed: false,
            userIP: null,
            isLoading: false,
            error: "Impossible de détecter votre adresse IP. Accès refusé.",
          });
          return;
        }

        // Vérifier si l'IP est dans la liste approuvée
        const isAllowed = approvedIPs.includes(userIP);

        setResult({
          isAllowed,
          userIP,
          isLoading: false,
          error: isAllowed
            ? null
            : `Accès refusé. Votre IP (${userIP}) n'est pas autorisée.`,
        });
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur de validation IP";
        setResult({
          isAllowed: false,
          userIP: null,
          isLoading: false,
          error: errorMessage,
        });
      }
    };

    validateIP();
  }, []);

  return result;
}
