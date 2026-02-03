import { AlertCircle, Lock } from "lucide-react";

interface AccessDeniedProps {
  userIP?: string | null;
  error?: string | null;
}

export function AccessDenied({ userIP, error }: AccessDeniedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="border-2 border-destructive bg-destructive/5 p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-destructive/10 border-2 border-destructive">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
          </div>

          {/* Titre */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Accès Refusé
          </h1>

          {/* Message d'erreur */}
          <div className="bg-background border-2 border-destructive/20 p-4 mb-6 text-left">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-mono text-destructive mb-2">
                  {error ||
                    "Votre adresse IP n'est pas autorisée à accéder à cette application."}
                </p>
                {userIP && (
                  <p className="text-xs text-muted-foreground">
                    Votre IP: <span className="font-mono">{userIP}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Information */}
          <div className="border-t-2 border-foreground/10 pt-6">
            <p className="text-sm text-muted-foreground font-mono">
              Veuillez contacter l'administrateur système pour demander l'accès.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Chat n8n Webhook - Version 1.0</p>
        </div>
      </div>
    </div>
  );
}
