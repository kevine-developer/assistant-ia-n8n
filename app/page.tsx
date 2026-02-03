"use client";

import { ChatWidget } from "@/components/chat-widget";
import { AccessDenied } from "@/components/access-denied";
import { LoadingScreen } from "@/components/loading-screen";
import { useIPValidation } from "@/hooks/use-ip-validation";

export default function Home() {
  const { isAllowed, isLoading, error, userIP } = useIPValidation();
console.log("[HOME] isAllowed:", isAllowed, "isLoading:", isLoading, "userIP:", userIP, "error:", error);
  // Afficher l'écran de chargement pendant la vérification
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Afficher l'écran d'accès refusé si l'IP n'est pas autorisée
  if (!isAllowed) {
    return <AccessDenied userIP={userIP} error={error} />;
  }

  // Afficher l'application si l'accès est autorisé
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">
            {"Chat n8n Webhook"}
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            {"Mon assistant IA -N8N"}
          </p>
        </div>

        <ChatWidget />

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            {"Webhook actif"}
          </div>
        </div>
      </div>
    </main>
  );
}
